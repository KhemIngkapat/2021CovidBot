module.exports = {
    name : 'test',
    desc : 'Testing Command',
    execute(message,args){
        switch(args[0]){
            case '1':
                message.reply('1')
                break
            case '2':
                message.reply('2')
                break
            default:
                message.reply('default')
                break

        }
    }
}