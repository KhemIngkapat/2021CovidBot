const fetch = require('node-fetch')
const {MessageEmbed} = require('discrd.js')

module.exports = {
    name : 'covid',
    desc : 'Get Covid Data',
    async execute(message,args){
        const reponse = await fetch('https://covid19.th-stat.com/api/open/timeline')
        const json = await reponse.json()
        const data = await json['Data']
        const today_data = await data[data.length -1]

        let result = "\nToday's Data\n"

        Object.entries(today_data).forEach((data) =>{
            result += `\tToday ${data[0]} : ${data[1]}\n`
        })

        
        message.reply(result)
        
    }
}