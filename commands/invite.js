const {MessageEmbed} = require('discord.js')

module.exports = {
    name:'invite',
    desc:'This Is The Invite Link For This Bot',
    execute(message,args){
        const embed = new MessageEmbed()
            .setColor('#5DBB63')
            .setTitle('Invite Link')
            .setDescription('This Is The Invite Link For This Bot')
            .addFields(
                {name:'Invite Link',value:'https://discord.com/oauth2/authorize?client_id=701337900004147241&scope=bot&permissions=8'}
            )
            .setFooter('Khem Ingkapat')

        message.reply(embed)
        
    }
}