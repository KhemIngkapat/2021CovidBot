async function makeChart(message,args,data){
    const dark_option = {
        scales : {
            x : {
                grid : {
                    color : 'rgba(255,255,255,1)'
                },
                ticks : {
                    color : 'rgba(255,255,255,1)'
                }
            },
            y : {
                grid : {
                    color : 'rgba(255,255,255,1)'
                },
                ticks : {
                    color : 'rgba(255,255,255,1)'
                }
            }
        },
        plugins : {
            title : {
                display :true,
                text : "Thailand's Covid Track",
                color : 'rgba(255,255,255,1)'
            },
            legend : {
                labels : {
                    color : 'rgba(255,255,255,1)'
                }
            }
        }
    
    }

    const theme = {
        dark : {
            options : dark_option,
            background : "#2C2F33",
                },
        transparent : {
            options : dark_option,
            background : 'transparent'
        },
        light : {
            options : {},
            background : 'white'
        },
    }

    if(args[1] === undefined){
        var selected_theme = theme['transparent']
    }else{
        var selected_theme = theme[args[1]]
    }

    const [confirmed,death,hospitalized,recovered,date] = [[],[],[],[],[]]

    data.forEach((item)=>{
        confirmed.push(item['Confirmed'])
        recovered.push(item['Recovered'])
        hospitalized.push(item['Hospitalized'])
        death.push(item['Deaths'])
        date.push(item['Date'])
    
    })
    
    const today_data = data[data.length -1]
    
    const width = 800
    const height = 600
    
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
          ctx.fillStyle = selected_theme.background
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      };
    
    
    
    // Chart.defaults.color = "white"
    
    const configure = {
        type : 'line',
        data : {
            labels : date,
            datasets : [{
                label : `Confirmed : ${confirmed[confirmed.length-1]}`,
                data : confirmed,
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
        options : selected_theme.options
            
    }
    
    const image = await canvas.renderToBuffer(configure)
    const attachment = new MessageAttachment(image)
    
    const percentage = (upper)=>{
        int_upper = parseInt(upper)
        int_lower = parseInt(today_data.Confirmed)
        long_percent = int_upper/int_lower
    
        return `${Math.round(long_percent*10000) / 100}%`
    
    
    }
    
    
    
    const Embed = new MessageEmbed()
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
        {name:'Deaths Percentage',value:percentage(today_data.Deaths),inline: true },
    
    )
    .setFooter('ข้อมูลจาก กรมควบคุมโรค')
    
    
    message.reply(Embed)
    
    message.channel.send(attachment)
    



}

module.exports = {
    makeChart
}