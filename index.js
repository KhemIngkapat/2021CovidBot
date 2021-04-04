const { Client } = require("discord.js")
const Discord = require("discord.js")
const fetch = require("node-fetch")
const { MessageAttachment} = require('discord.js')

const { ChartJSNodeCanvas } = require('chartjs-node-canvas')
const client = new Client({
    disableEveryone: true
});

client.on("ready",()=>{
    console.log('Im ready')

    client.user.setActivity('Me getting developped again',{ 
        type : "WATCHING"

    });
});


const chartCallback = (ChartJS) => {
    // ChartJS.plugins.register({
    //   beforeDraw: (chartInstance) => {
    //     const { chart } = chartInstance
    //     const { ctx } = chart
    //     ctx.fillStyle = 'white'
    //     ctx.fillRect(0, 0, chart.width, chart.height)
    //   },
    // })
  }


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

        case "chart":
            const simple_data = [1,5]
            const simple_label = ['Hey','Hello']
            const width = 800
            const height = 600

            const canvas = new ChartJSNodeCanvas({
                width,
                height,
                chartCallback
            })

            const configure = {
                type : 'bar',
                data : {
                    labels : simple_label,
                    datasets : [{
                        label : 'Testing',
                        data : simple_data,
                        backgroundColor : '#7289d9'

                    }]
                }




            }

            const image = await canvas.renderToBuffer(configure)
            const attachment = new MessageAttachment(image)

            message.channel.send(attachment)


        

    }



})

client.login("NzAxMzM3OTAwMDA0MTQ3MjQx.Xq-M0Q.eHYj6kvxVxe7Ulz6GOmFW1UYeQk");