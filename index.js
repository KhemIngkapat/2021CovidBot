const { Client,
    MessageEmbed,
    MessageAttachment,
    Collection} = require("discord.js")
const { config } = require("dotenv");
const fs = require('fs')
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

client.commands = new Collection()

config({
    path:__dirname +"/.env"
});

commandFiles.forEach((file) =>{
    const command = require(`./commands/${file}`)
    client.commands.set(command.name,command)
})


const client = new Client({
    disableEveryone: true
});

client.on("ready",()=>{
    console.log('Im ready')

    client.user.setActivity("+covid to track Thailand's Covid-19 Data",{ 
        type : "WATCHING"

    });
});



client.on("message",async message=>{
    const prefix = "+";
    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;
    const message_array =  message.content.slice(prefix.length).trim().split(/ +/g);
    const command = message_array.shift().toLowerCase()
    if(!client.commands.has(command)) return
    try{
        client.commands.get(command).execute(message,command)
    
    }catch(error){
        console.log(error)
        message.reply('Something went wrong')
    }

})

client.login(process.env.TOKEN);