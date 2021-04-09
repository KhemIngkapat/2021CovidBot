const { Client,
    MessageEmbed,
    MessageAttachment} = require("discord.js")
// const Discord = require("discord.js")
const fetch = require("node-fetch")
const { config } = require("dotenv");

config({
    path:__dirname +"/.env"
});



const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const client = new Client({
    disableEveryone: true
});

client.on("ready",()=>{
    console.log('Im ready')

    client.user.setActivity('Me getting developped again',{ 
        type : "WATCHING"

    });
});


const chartCallback = (ChartJS) => {}


client.on("message",async message=>{
    const prefix = "+";
    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix)) return;
    const message_array =  message.content.slice(prefix.length).trim().split(/ +/g);


    switch(message_array[0].toLowerCase()){
        default:
            message.reply("Invalid Command")
            break
        case "hello":
            message.channel.send(`Hello,${"<@"+message.author.id+">"} :laughing:`)
            break

        case "covid":
            const dark_option = {
                scales : {
                    x : {
                        grid : {
                            color : 'rgba(255,255,255,1)'
                        },
                        ticks : {
                            color : 'rgba(255,255,255,1)'
                        }
                    },
                    y : {
                        grid : {
                            color : 'rgba(255,255,255,1)'
                        },
                        ticks : {
                            color : 'rgba(255,255,255,1)'
                        }
                    }
                },
                plugins : {
                    title : {
                        display :true,
                        text : "Thailand's Covid Track",
                        color : 'rgba(255,255,255,1)'
                    },
                    legend : {
                        labels : {
                            color : 'rgba(255,255,255,1)'
                        }
                    }
                }

            }
            const theme = {
                dark : {
                    options : dark_option,
                    background : "#2C2F33",
                        },
                transparent : {
                    options : dark_option,
                    background : 'transparent'
                },
                light : {
                    options : {},
                    background : 'white'
                },
            }

            if(message_array[1] === undefined){
                var selected_theme = theme['transparent']
            }else{
                var selected_theme = theme[message_array[1]]
            }

            
            
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

            const today_data = data[data.length -1]

            const width = 800
            const height = 600

            const canvas = new ChartJSNodeCanvas({
                width,
                height,
                chartCallback
            })

            const plugin = {
                id: 'custom_canvas_background_color',
                beforeDraw: (chart) => {
                  const ctx = chart.canvas.getContext('2d');
                  ctx.save();
                  ctx.globalCompositeOperation = 'destination-over';
                  ctx.fillStyle = selected_theme.background
                  ctx.fillRect(0, 0, chart.width, chart.height);
                  ctx.restore();
                }
              };



            // Chart.defaults.color = "white"

            const configure = {
                type : 'line',
                data : {
                    labels : date,
                    datasets : [{
                        label : `Confirmed : ${confirmed[confirmed.length-1]}`,
                        data : confirmed,
                        borderColor : '#00FFFF',
                        backgroundColor : '#00FFFF',
                        pointRadius:0
                        

                    },
                    {
                        label : `Recovered : ${recovered[recovered.length-1]}`,
                        data : recovered,
                        borderColor : '#00FF00',
                        backgroundColor : '#00FF00',
                        pointRadius : 0
                        


                    },
                    {
                        label : `Hospitalized : ${hospitalized[hospitalized.length-1]}`,
                        data : hospitalized,
                        borderColor : '#ff91a4',
                        backgroundColor : '#ff91a4',
                        pointRadius : 0
                        


                    },
                    {
                        label : `Deaths :   : ${death[death.length-1]}`,
                        data : death,
                        borderColor : '#990000',
                        backgroundColor : '#990000',
                        pointRadius : 0
                        


                    }
                ]
                },
                plugins:[plugin],
                options : selected_theme.options
                    
            }

            const image = await canvas.renderToBuffer(configure)
            const attachment = new MessageAttachment(image)

            const percentage = (upper)=>{
                int_upper = parseInt(upper)
                int_lower = parseInt(today_data.Confirmed)
                long_percent = int_upper/int_lower

                return `${Math.round(long_percent*10000) / 100}%`


            }

            

            const Embed = new MessageEmbed()
            .setColor('#5DBB63')
            .setTitle('Covid19 Thailand Tracker')
            .setDescription(today_data.Date)
            .addFields(
                {name:'Confirmed',value:today_data.Confirmed,inline: true },
                {name:'Recovered',value:today_data.Recovered,inline: true },
                {name:'Hospitalized',value:today_data.Hospitalized,inline: true },
                {name:'Deaths',value:today_data.Deaths,inline: true },
                {name:'New Confirmed',value:today_data.NewConfirmed,inline: true },
                {name:'New Recovered',value:today_data.NewRecovered,inline: true },
                {name:'New Hospitalized',value:today_data.NewHospitalized,inline: true },
                {name:'New Deaths',value:today_data.NewDeaths,inline: true },
                {name:'Recovered Percentage',value:percentage(today_data.Recovered),inline: true },
                {name:'Hospitalized Percentage',value:percentage(today_data.Hospitalized),inline: true },
                {name:'Deaths Percentage',value:percentage(today_data.Deaths),inline: true },

            )
            .setFooter('ข้อมูลจาก กรมควบคุมโรค')

            
            message.reply(Embed)

            message.channel.send(attachment)

            break

        case 'source':
            const Source_Embed = new MessageEmbed()
            .setColor('#5DBB63')
            .setTitle("Thailand's Covid Data")
            .setDescription('This is the link of the information that this bot use.')

            .addFields(
                {name : 'API',value:'https://covid19.th-stat.com/api/open/timeline'},
                {name : 'Google Sheet',value: 'https://docs.google.com/spreadsheets/d/1OIO-HYNKMpPqzdkKPQd5bVcVZDVGNxxDbTBc_ndixt4/edit?usp=sharing'}
            )
            .setFooter('KhemIngkapat')

            message.reply(Source_Embed)
            break

        case 'invite_link':
            const Invite_Embed = new MessageEmbed()
            .setColor('#5DBB63')
            .setTitle("Invite Link")
            .setDescription('Here is a link to invite this bot to server.')

            .addFields(
                {name : 'Invite Link',value:'https://discord.com/oauth2/authorize?client_id=701337900004147241&scope=bot&permissions=8'},
                
            )
            .setFooter('KhemIngkapat')

            message.reply(Invite_Embed)
            break
            break

    }
})

client.login(process.env.TOKEN);