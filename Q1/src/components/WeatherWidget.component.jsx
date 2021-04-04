import { useState, useEffect } from 'react';

/**
 * Main component for displaying the temperature with the corresponding color and text.
 */
const WeatherWidget = () => {
  const API_KEY = "PH8YZb3RYH4PEZnoCcMFslQWjWPrU9U3"
  const JFK = "40.64131109999999,-73.77813909999999"

  const [tempertureLayout, setTempertureLayout] = useState(null);
  const [tempertureText, setTempertureText] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(null);

  // Will check the temperature every minute.
  useEffect(() => {
    getWeather()
    const stopInterval = setInterval(() => {
      getWeather()
    }, 1000 * 60)
    return () => {
      clearInterval(stopInterval);
    }
  }, [])

  // Gets the temeperature for JFK via the tomorrow.io API
  const getWeather = async () => {
    const startTime = new Date()
    const endTime = new Date()
    endTime.setHours(startTime.getHours() + 1)

    const res = await fetch(`https://api.tomorrow.io/v4/timelines?location=${JFK}&fields=temperature&timesteps=1h&units=metric&apikey=${API_KEY}&startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`);
    const tempertureResponse = await res.json();

      const currentTemperature = tempertureResponse?.data?.timelines[0]?.intervals[0]?.values?.temperature;

      setCurrentTemp(currentTemperature)
      if (currentTemperature > 15) {
        setTempertureLayout("bg-green-800 text-white")
        setTempertureText("All clear")
      } else if (currentTemperature > 5 && currentTemperature < 15) {
        setTempertureLayout("bg-yellow-300 text-black")
        setTempertureText("[Extreme Cold] Keep You Warm (Hot Drinks/Soups)")
      } else if (currentTemperature < 5) {
        setTempertureLayout("bg-red-600 text-white")
        setTempertureText("[Danger Cold] Stop the work and get inside")
      }
  }
  
  return (
    <div className={"bg-white"}>
      <main>
        <div className={"relative"}>
          <div className={"flex items-center justify-center h-screen max-w-7xl mx-auto sm:px-6 lg:px-8"}>
            <div className={`${tempertureLayout} relative shadow-xl sm:rounded-2xl sm:overflow-hidden`}>
              <div className={"relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8"}>
                <h1 className={"text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"}>
                  <span className={`${tempertureLayout} block`}>JFK Temperture {currentTemp?.toFixed(1)}°C</span>
                </h1>
                <p className={`${tempertureLayout} mt-6 max-w-lg mx-auto text-center text-2xl sm:max-w-3xl`}>
                  {tempertureText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WeatherWidget;