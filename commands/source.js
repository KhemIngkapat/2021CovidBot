const {MessageEmbed}  = require('discord.js')

module.exports = {
    name : 'source',
    desc : 'Reply Source Of This Bot',
    execute(message,args){
        const Embed = new MessageEmbed()
        .setColor('#5DBB63')
        .setTitle('Source')
        .setDescription('All links')
        .addFields(
            {name:'Covid Data',value:'http://covid19.th-stat.com/api/open/today'},
            {name:'Github Repository',value:'https://github.com/KhemIngkapat/2021CovidBot'}


        )
        message.reply(Embed)
    }
}