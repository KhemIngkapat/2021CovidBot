module.exports = {
    name : 'hello',
    desc : 'Hello Command',
    execute(message,args){
        message.channel.send('pong')
    },
}