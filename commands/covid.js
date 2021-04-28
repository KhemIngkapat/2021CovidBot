const fetch = require('node-fetch')
const {MessageEmbed} = require('discord.js')


const {makeLine}  =require('./CovidVisualData/makeChart.js')


module.exports = {
    name : 'covid',
    desc : 'Get Covid Data',
    async execute(message,args){
        const reponse = await fetch('https://covid19.th-stat.com/api/open/timeline')
        const json = await reponse.json()
        const data = await json['Data']
        const today_data = await data[data.length -1]

        // const Embed = new MessageEmbed()
        // .setColor('#5DBB63')
        // .setTitle('Covid19 Thailand Tracker')
        // .setDescription(today_data.Date)

        // .setFooter('ข้อมูลจาก กรมควบคุมโรค')

        // Object.entries(today_data).forEach((data) =>{
        //     Embed.addFields({name : data[0],value : data[1],inline : true})
        // })

        
        // message.reply(Embed)

        const isNum = (str) =>{
            return !isNaN(str)
        }

        const formatted_args = args.slice(1,args.length).sort()

        console.log(formatted_args)

        console.log(isNum(formatted_args[0]))

        makeLine(message,formatted_args,data,isNum(formatted_args[0]))
        
        

        const percentage = (upper)=>{
            int_upper = parseInt(upper)
            int_lower = parseInt(today_data.Confirmed)
            long_percent = int_upper/int_lower
        
            return `${Math.round(long_percent*10000) / 100}%`
        }

        const embed = new MessageEmbed()
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
            {name:'Deaths Percentage',value:percentage(today_data.Deaths),inline: true },)
            .setFooter('ข้อมูลจาก กรมควบคุมโรค')
        
        // if(makeLine(message,args,data,true)){
        //     // message.reply(embed)
        // }

        // if(await makeLine(message,args,data,true)){
            
        //     message.reply(embed)
        
        // }



        
        }

        
       
        
        
    }
