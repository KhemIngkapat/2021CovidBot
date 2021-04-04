const { Client } = require("discord.js")
const Discord = require("discord.js")
const client = new Client({
    disableEveryone: true
});

client.on("ready",()=>{
    console.log('Im ready')

    client.user.setActivity('Me getting developped again',{ 
        type : "WATCHING"

    });
});

client.on("message",async message=>{
    const prefix = "+";
    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;
    const message_array =  message.content.slice(prefix.length).trim().split(/ +/g);


    switch(message_array[0]){
        case "hello":
            message.reply('Fuck you')
            break

        case "bye":
            message.reply('bye and fuckyou')
            break

        default:
            message.reply("nothing for stupid person like you")
            break

    }



})

client.login("NzAxMzM3OTAwMDA0MTQ3MjQx.Xq-M0Q.eHYj6kvxVxe7Ulz6GOmFW1UYeQk");