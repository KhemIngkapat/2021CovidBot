module.exports = {
    name : 'test',
    desc : 'Testing Command',
    execute(message,args){
        switch(args[1]){
            case '1':
                message.reply('1')
                break
            case '2':
                message.reply('2')
                break

            case 'case':
                console.log(['covid','light','5'].slice(1,3).sort())
                break
            default:
                message.reply('default')
                break

        }
    }
}