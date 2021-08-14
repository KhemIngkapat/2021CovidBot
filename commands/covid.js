const fetch = require('axios')
const { MessageEmbed } = require('discord.js')


const { makeLine } = require('./CovidVisualData/makeChart.js')

// first Goal : Try To Devide All The Code Into Parts And Write An Description
module.exports = {
    name: 'covid',
    desc: 'Get Covid Data',
    async execute(message, args) {
        try {
            // Getting Historical Data With Fetching
            const conResponse = await fetch('https://disease.sh/v3/covid-19/historical/th')
            const conJson = await conResponse.data
            const conFetchData = await conJson.timeline


            const setDate = new Set()
            const conData = {}

            // Object.keys(fetchData).map((key) => {
            //     data[key] = []
            // })

            Object.entries(conFetchData).map(([type, obj]) => {
                conData[type] = []
                Object.entries(obj).map(([date, num]) => {
                    setDate.add(date)
                    conData[type].push(num)
                })
            })
            conData.dates = [...setDate]

            // getting latest data

            const latestResponse = await fetch('https://disease.sh/v3/covid-19/countries/thailand')
            const latestJson = await latestResponse.data

            const allowed = ['cases', 'todayCases', 'deaths', 'todayDeaths', 'recovered', 'todayRecovered']

            const latestData = Object.keys(latestJson)
                .filter(key => allowed.includes(key))
                .reduce((obj, key) => {
                    obj[key] = latestJson[key];
                    return obj;
                }, {});

            latestData['latestDate'] = conData.dates[conData.dates.length - 1]

            // function for getting the percentage of anything compare to comfirmed
            const percentage = (upper,lower) => {
                int_upper = parseInt(upper)
                int_lower = parseInt(lower)
                long_percent = int_upper / int_lower

                return `${Math.round(long_percent * 10000) / 100}%`
            }

            latestData.recovPercentage = percentage(latestData.recovered,latestData.cases)
            latestData.deathPercentage = percentage(latestData.deaths,latestData.cases)




            // some random function
            const isNum = (str) => {
                return !isNaN(str)
            }
            // get the args sorted like [number,theme]
            const formatted_args = args.slice(1, args.length).sort()



            // the color of the embed message
            const embedColor = {
                'more': '#FF0000',
                'equal': '#FFFF00',
                'less': '#5DBB63'
            }

            // function to compare the latest to the second lastest to select the color
            // const checkCon = (arr) => {

            //     const con = []
            //     con.push(arr[arr.length - 2]['NewConfirmed'])
            //     con.push(arr[arr.length - 1]['NewConfirmed'])

            //     if (con[1] > con[0]) {
            //         return 'more'
            //     } else if (con[1] < con[0]) {
            //         return 'less'
            //     } else {
            //         return 'equal'
            //     }

            // }

            const checkCon = (arr) => {
                let firstNum = arr[arr.length-1] - arr[arr.length-2]
                let secondNum = arr[arr.length-2] - arr[arr.length-3]

                if(firstNum<secondNum){
                    return 'less'
                }else if(firstNum>secondNum){
                    return 'more'
                }else{
                    return 'equal'
                }
            }

            // fucking long embed
            // now there is no hospitalized part because of new URL
            const embed = new MessageEmbed()
                .setColor(embedColor[checkCon(conData.cases)])
                .setTitle('Covid19 Thailand Tracker')
                .setDescription(latestData.latestDate)
                .addFields(
                    { name: 'Confirmed ✅', value:latestData.cases, inline: true },
                    { name: 'Recovered 👍', value: latestData.recovered, inline: true },
                    { name: 'Deaths 💀', value: latestData.deaths },
                    { name: 'New Confirmed ✅', value: latestData.todayCases, inline: true },
                    { name: 'New Recovered 👍', value: latestData.todayRecovered, inline: true },
                    { name: 'New Deaths 💀', value: latestData.todayDeaths },
                    { name: 'Recovered Percentage 👍', value: latestData.recovPercentage, inline: true },
                    { name: 'Deaths Percentage 💀', value:latestData.deathPercentage, inline: true })
                .setFooter('ข้อมูลจาก กรมควบคุมโรค')

            // check the chart function
            if (!await makeLine(message, formatted_args, conData, isNum(formatted_args[0]))) {
                makeLine(message, [], conData, false)

            }
            // send embed message
            message.reply(embed)

        } catch (error) {
            console.log(error)
        }

    }

}
