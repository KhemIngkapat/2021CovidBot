const fetch = require('node-fetch')



const {makeChart,makeEmbed}  =require('./CovidVisualData/CovidData.js')


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
        message.reply(makeEmbed(message,args,today_data))
        makeChart(message,args,data)
        
        
    }
}