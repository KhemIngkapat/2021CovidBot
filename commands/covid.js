const fetch = require('axios')
const { MessageEmbed } = require('discord.js')


const { makeLine } = require('./CovidVisualData/makeChart.js')

// first Goal : Try To Devide All The Code Into Parts And Write An Description
module.exports = {
    name: 'covid',
    desc: 'Get Covid Data',
    async execute(message, args) {
        try {
            // Getting Data With Fetching
            const reponse = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
            const json = await reponse.data
            console.log(json)
            const data = await json['Data']
            const today_data = await data[data.length - 1]


// some random function
            const isNum = (str) => {
                return !isNaN(str)
            }
            // get the args sorted like [number,theme]
            const formatted_args = args.slice(1, args.length).sort()

            // function for getting the percentage of anything compare to comfirmed
            const percentage = (upper) => {
                int_upper = parseInt(upper)
                int_lower = parseInt(today_data.Confirmed)
                long_percent = int_upper / int_lower

                return `${Math.round(long_percent * 10000) / 100}%`
            }

            // the color of the embed message
            const embedColor = {
                'more': '#FF0000',
                'equal': '#FFFF00',
                'less': '#5DBB63'
            }

            // function to compare the latest to the second lastest to select the color
            const checkCon = (arr) => {

                const con = []
                con.push(arr[arr.length - 2]['NewConfirmed'])
                con.push(arr[arr.length - 1]['NewConfirmed'])

                if (con[1] > con[0]) {
                    return 'more'
                } else if (con[1] < con[0]) {
                    return 'less'
                } else {
                    return 'equal'
                }

            }
            // fucking long embed
            const embed = new MessageEmbed()
                .setColor(embedColor[checkCon(data)])
                .setTitle('Covid19 Thailand Tracker')
                .setDescription(today_data.Date)
                .addFields(
                    { name: 'Confirmed ✅', value: today_data.Confirmed, inline: true },
                    { name: 'Recovered 👍', value: today_data.Recovered, inline: true },
                    { name: 'Hospitalized 🏥', value: today_data.Hospitalized, inline: true },
                    { name: 'Deaths 💀', value: today_data.Deaths },
                    { name: 'New Confirmed ✅', value: today_data.NewConfirmed, inline: true },
                    { name: 'New Recovered 👍', value: today_data.NewRecovered, inline: true },
                    { name: 'New Hospitalized 🏥', value: today_data.NewHospitalized, inline: true },
                    { name: 'New Deaths 💀', value: today_data.NewDeaths },
                    { name: 'Recovered Percentage 👍', value: percentage(today_data.Recovered), inline: true },
                    { name: 'Hospitalized Percentage 🏥', value: percentage(today_data.Hospitalized), inline: true },
                    { name: 'Deaths Percentage 💀', value: percentage(today_data.Deaths), inline: true })
                .setFooter('ข้อมูลจาก กรมควบคุมโรค')

            // check the chart function
            if (!await makeLine(message, formatted_args, data, isNum(formatted_args[0]))) {
                makeLine(message, [], data, false)

            }
            // send embed message
            message.reply(embed)

        } catch (error) {
            console.log(error)
        }

    }

}
