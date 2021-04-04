const fetch = require("node-fetch");
const cron = require("node-cron");

const API_KEY = "PH8YZb3RYH4PEZnoCcMFslQWjWPrU9U3"
const locations = [
    {
        name: "JFK",
        coordinates: "40.64131109999999,-73.77813909999999"
    }, {
        name: "ORD",
        coordinates: "41.987192736722314,-87.92327417492885"
    }, {
        name: "DFW",
        coordinates: "32.90376415625377,-97.02818628915884"
    }
]

/**
 * main function for monitoring the required locations.
 */
async function monitorLocations() {
    console.log(`Starting ${locations.length} locations monitoring - ${new Date().toISOString()}`)
    locations.forEach(location => {
        monitorTemperture(location);
    })
    console.log(`Will run again in 15 minutes`)
}

/**
 * Monitor the given location, will send an alert if the differece between the next interval is more that 2°C
 */
async function monitorTemperture(location) {
    const startTime = new Date()
    const endTime = new Date()
    endTime.setHours(startTime.getHours() + 1)
    console.log(`Getting temperture for ${location.name}`)

    // API Call for fetching the given location's forecast
    const res = await fetch(`https://api.tomorrow.io/v4/timelines?location=${location.coordinates}&fields=temperature&timesteps=15m&units=metric&apikey=${API_KEY}&startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`);
    const tempertureResponse = await res.json();

    const currentTemperture = tempertureResponse?.data?.timelines[0]?.intervals[0]?.values?.temperature
    const nextIntervalTemperture = tempertureResponse?.data?.timelines[0]?.intervals[1]?.values?.temperature
    const nextIntervalStartTime = tempertureResponse?.data?.timelines[0]?.intervals[1]?.startTime

    // Check if the temperature is dropping or increasing by 2°C
    if (Math.abs(currentTemperture - nextIntervalTemperture) > 2) {
        console.log(`Alert! temperture in ${location.name} about to drop at ${nextIntervalStartTime} from ${currentTemperture} to ${nextIntervalTemperture}`)
    }
    console.log(`Succseffully got temperture for ${location.name}`)
}

/**
 * Main monitoring runner, will run every 15 minutes.
 */
cron.schedule('*/15 * * * *', () => {
    monitorLocations();
});

//In order to run this script 24/7 We will use a process manager like PM2 in order to make sure that even if the script crash's,
//it will start itself.
