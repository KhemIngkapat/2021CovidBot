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
            console.log('ye')

        case "chart":
            const reponse = await fetch('https://covid19.th-stat.com/api/open/timeline')
            const json = await reponse.json()
            const data = await json['Data']
            const [confirmed,death,hospitalized,recovered,date] = [[],[],[],[],[]]
            
            
            

            data.forEach((item)=>{
                confirmed.push(item['Confirmed'])
                recovered.push(item['Recovered'])
                hospitalized.push(item['Hospitalized'])
                death.push(item['Deaths'])
                date.push(item['Date'])

            })

            const width = 800
            const height = 600

            const canvas = new ChartJSNodeCanvas({
                width,
                height,
                chartCallback
            })

            const configure = {
                type : 'line',
                data : {
                    labels : date,
                    datasets : [{
                        label : `Confirmed : ${confirmed[confirmed.length-1]}`,
                        data : confirmed,
                        backgroundColor : '#00FFFF'
                        ,lineTension: 0.1



                    },
                    {
                        label : `Recovered : ${recovered[recovered.length-1]}`,
                        data : recovered,
                        backgroundColor : '#00FF00'
                        ,lineTension: 0.1


                    },
                    {
                        label : `Hospitalized : ${hospitalized[hospitalized.length-1]}`,
                        data : hospitalized,
                        backgroundColor : '#ff91a4'
                        ,lineTension: 0.1


                    },
                    {
                        label : `Deaths :   : ${death[death.length-1]}`,
                        data : death,
                        backgroundColor : '#990000'
                        ,lineTension: 0.1


                    }
                ]
                }




            }

            const image = await canvas.renderToBuffer(configure)
            const attachment = new MessageAttachment(image)

            message.channel.send(attachment)


        

    }



})

client.login("NzAxMzM3OTAwMDA0MTQ3MjQx.Xq-M0Q.eHYj6kvxVxe7Ulz6GOmFW1UYeQk");