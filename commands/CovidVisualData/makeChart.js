const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const {MessageAttachment} = require('discord.js')
const {Chart} = require('chart.js')
// const {readFileSync} = require('fs')

// const dark_option = readFileSync('darkOption.json')



module.exports = {
    async makeLine(message,args,data,specific = false){

        try{

        // Chart.defaults.color = 'white'
        // Chart.defaults.borderColor = 'white'

        const [confirmed,death,hospitalized,recovered,date] = [[],[],[],[],[]]
    
        data.forEach((item)=>{
            confirmed.push(item['Confirmed'])
            recovered.push(item['Recovered'])
            hospitalized.push(item['Hospitalized'])
            death.push(item['Deaths'])
            date.push(item['Date'])
        
        })

        const bgColor = {
            'light' : {
                'color' : 'white',
                execute(){
                    // Chart.defaults.color = '#666'
                    // Chart.defaults.boderColor = 'rgba(0, 0, 0, 0.1)'
                }
            },
            'transparent' : {
                'color' : 'transparent',
                execute(){
                    // Chart.defaults.color = 'white'
                    // Chart.defaults.borderColor = 'white'
                }
            },
            'dark' : {
                'color' : '#2F3136',
                execute(){
                    // Chart.defaults.color = 'white'
                    // Chart.defaults.borderColor = 'white'
                }
            }
        }

        // bgColor[args[2]].execute()

        
        const width = 800
        const height = 600
    
        const chartCallback = (ChartJS) =>{}
        
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
              ctx.fillStyle = bgColor[args[2]]['color']
              ctx.fillRect(0, 0, chart.width, chart.height);
              ctx.restore();
            }
          };
        
        // if(args[2] == 'light') {
        //     Chart.defaults.color = 'white'
        //     Chart.defaults.borderColor = 'white'
        // }

        

        
        const specSize = (arr,num) =>{
            return arr.slice(arr.length - num,arr.length)
        }

        const size = parseInt(args[1])

        if(specific){
            var [plot_con,plot_rec,plot_hos,plot_dea,plot_date] = [specSize(confirmed,size),
                                                                specSize(recovered,size),
                                                                specSize(hospitalized,size),
                                                                specSize(death,size),
                                                                specSize(date,size)]
        }else{
            var [plot_con,plot_rec,plot_hos,plot_dea,plot_date] = [confirmed,death,hospitalized,recovered,date]
        }

    
        const configure = {
            type : 'line',
            data : {
                labels : plot_date,
                datasets : [{
                    label : `Confirmed : ${confirmed[confirmed.length-1]}`,
                    data : plot_con,
                    borderColor : '#00FFFF',
                    backgroundColor : '#00FFFF',
                    borderWidth : 2,
                    pointRadius:0.1
                },
                {
                    label : `Recovered : ${recovered[recovered.length-1]}`,
                    data : plot_rec,
                    borderColor : '#00FF00',
                    backgroundColor : '#00FF00',
                    borderWidth : 2,
                    pointRadius : 0.1

                },
                {
                    label : `Hospitalized : ${hospitalized[hospitalized.length-1]}`,
                    data : plot_hos, 
                    borderColor : '#ff91a4',
                    backgroundColor : '#ff91a4',
                    borderWidth : 2,
                    pointRadius : 0.1

                },
                {
                    label : `Deaths :   : ${death[death.length-1]}`,
                    data : plot_dea,
                    borderColor : '#990000',
                    backgroundColor : '#990000',
                    borderWidth : 2,
                    pointRadius : 0.1

                }
            ]
            },
            plugins:[plugin],
            options : {
                plugins : {
                    title : {
                        text : "Thailand's Covid Chart",
                        display : 'True'
                    },
                    scale : {}

                },
                
            }
                
        }
        
        const image = await canvas.renderToBuffer(configure)
        const attachment = new MessageAttachment(image)
        
        message.channel.send(attachment)

        return true
    }catch(error){
        console.log(error)

        message.reply('Something Went Wrong With The Chart\n\tPlease Try Again With Appropriate Format')

        return false
    }
}

    
}