const { Client } = require("discord.js")
const Discord = require("discord.js")
const fetch = require("node-fetch")
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
        default:
            message.reply("nothing for stupid person like you")
            break
        case "hello":
            message.reply('Fuck you')
            break

        case "bye":
            message.reply('bye and fuckyou')
            break


        case "covid":
            const reponse = await fetch('https://covid19.th-stat.com/api/open/timeline')
            const json = await reponse.json()

            console.log(json)

        

    }



})

client.login("NzAxMzM3OTAwMDA0MTQ3MjQx.Xq-M0Q.eHYj6kvxVxe7Ulz6GOmFW1UYeQk");