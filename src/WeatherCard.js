import React, {useState} from 'react';

function WeatherCard({weatherData}) {

    const [dateStr, setDateStr] = useState(weatherData.date);
    const [weather, setWeather] = useState('');
    const [city, setCity] = useState('');

    /**
     * Animation on mouseEnter, mouseLeave might be an issue in terms of accessiblity. 
     * https://www.wuhcag.com/on-focus/
     * 
     * However, I have implemented animation according to requirement "weather-widget.md" and wireframe.
     * "A delightful use of animations is a plus." 
     */

    const mouseEnter = () =>{
        setDateStr(weatherData.dateTime);
        setWeather(weatherData.weatherDescription);
        setCity(weatherData.cityName);
    }

    const mouseLeave = () =>{
        setDateStr(weatherData.date);
        setWeather('');
        setCity('')    
    }

    return (
        <div className="card"
             onMouseEnter={mouseEnter}
             onMouseLeave={mouseLeave}>
            
            <h2 className="day">{weatherData.dayOfWeek}</h2>
            <small>{dateStr}</small><br/>

            {/* Add mergin if weather is displayed. */}
            { weather !== '' ? 
            <div className="mtop">{weather}</div>
            :
            ''            
            }
            
            <img src={weatherData.iconURL} alt={weather} />
            <h1 className="temp"> {weatherData.ctemp}°C</h1>
            {city}
        </div>
    )

}
export default WeatherCard;