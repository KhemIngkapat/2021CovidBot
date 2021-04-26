const { Client,Collection} = require("discord.js")
const { config } = require("dotenv");
const fs = require('fs')
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))



config({
    path:__dirname +"/.env"
});




const client = new Client({
    disableEveryone: true
});



client.commands = new Collection()
client.on("ready",()=>{
    console.log('Im ready')

    client.user.setActivity("+covid to track Thailand's Covid-19 Data",{ 
        type : "WATCHING"

    });
});



commandFiles.forEach((file) =>{
    const command = require(`./commands/${file}`)
    client.commands.set(command.name,command)
})



client.on("message",async message=>{
    const prefix = "+";
    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;
    const message_array =  message.content.slice(prefix.length).trim().split(/ +/g);
    const command = message_array.shift().toLowerCase()
    if(!client.commands.has(command)) return
    try{
        console.log(message_array)
        client.commands.get(command).execute(message,message_array)
    
    }catch(error){
        console.log(error)
        message.reply('Something went wrong')
    }

})

client.login(process.env.TOKEN);