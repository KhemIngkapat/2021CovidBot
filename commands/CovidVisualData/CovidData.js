const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const {MessageAttachment} = require('discord.js')
const {Chart} = require('chart.js')



module.exports = {
    async makeChart(message,args,data){

        const isNum = (str) => !isNaN(str)

        const [confirmed,death,hospitalized,recovered,date] = [[],[],[],[],[]]
    
        data.forEach((item)=>{
            confirmed.push(item['Confirmed'])
            recovered.push(item['Recovered'])
            hospitalized.push(item['Hospitalized'])
            death.push(item['Deaths'])
            date.push(item['Date'])
        
        })

        if(isNum(args[1])){
            var thisNum = parseInt(args[1])
        }else{
            var thisNum = data.length
        }
        
        const today_data = data[data.length -1]
        
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
              ctx.fillStyle = 'transparent'
              ctx.fillRect(0, 0, chart.width, chart.height);
              ctx.restore();
            }
          };
        
        
        Chart.defaults.color = 'white'
        Chart.defaults.borderColor = 'white'
        const configure = {
            type : 'line',
            data : {
                labels : date,
                datasets : [{
                    label : `Confirmed : ${confirmed[confirmed.length-1]}`,
                    data : confirmed.slice(confirmed.length - thisNum,confirmed.length -1),
                    borderColor : '#00FFFF',
                    backgroundColor : '#00FFFF',
                    borderWidth : 2,
                    pointRadius:0
                },
                {
                    label : `Recovered : ${recovered[recovered.length-1]}`,
                    data : recovered,
                    borderColor : '#00FF00',
                    backgroundColor : '#00FF00',
                    borderWidth : 2,
                    pointRadius : 0

                },
                {
                    label : `Hospitalized : ${hospitalized[hospitalized.length-1]}`,
                    data : hospitalized,
                    borderColor : '#ff91a4',
                    backgroundColor : '#ff91a4',
                    borderWidth : 2,
                    pointRadius : 0

                },
                {
                    label : `Deaths :   : ${death[death.length-1]}`,
                    data : death,
                    borderColor : '#990000',
                    backgroundColor : '#990000',
                    borderWidth : 2,
                    pointRadius : 0

                }
            ]
            },
            plugins:[plugin],
            options : {
                plugins : {
                    title : {
                        text : "Thailand's Covid Chart",
                        display : 'True'
                    }

                }
            }
                
        }
        
        const image = await canvas.renderToBuffer(configure)
        const attachment = new MessageAttachment(image)
        
        message.channel.send(attachment)
    }
}