import React, { useEffect, useState } from 'react';
import axios from 'axios';
import loadingIcon from './img/loading.gif';
import WeatherCard from './WeatherCard';
import { Kelvin2Celsius, getFormattedLocalDate, getFormattedLocalDateTime, getDayOfWeek } from './util';

function WeatherForecast() {
    const [cityName, setCityName] = useState('');
    const [currentWeather, setCurrentWeather] = useState();
    const [fiveDaysForecast, setFiveDaysForecast] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    //TODO: Move APIKEY to environment variable on server side to hide it. 
    // This is a client only application at this stage and I need to develop server side to do so. 
    const APIKEY = process.env.REACT_APP_API_KEY

    useEffect(() => {
        const searchByGeoLocationHandler = (position) => {
            setErrorMessage('');
            // console.log("Latitude: " + position.coords.latitude + "  Longitude: " + position.coords.longitude);
            getCurrentWeather(null, position.coords.latitude, position.coords.longitude);
            getFiveDaysForecast(null, position.coords.latitude, position.coords.longitude);
        };
        
        const showGeoLocationError = (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setErrorMessage("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    setErrorMessage("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    setErrorMessage("The request to get user location timed out.");
                    break;
                case error.UNKNOWN_ERROR:
                    setErrorMessage("An unknown error occurred.");
                    break;
                default:
                    break;
            }
        };
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(searchByGeoLocationHandler, showGeoLocationError);
        } else {
            setErrorMessage("Geolocation is not supported by this browser");
        }
    }, []);

    /**
     * Get current weather from openweathermap.
     * @param city name to search 
     */
    const getCurrentWeather = (city, lat, lon) => {
        let url;
        if (city !== null) {
            url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY;
        } else if (lat !== null && lon !== null) {
            url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY;
        } else {
            setErrorMessage("Error!");
            return;
        }

        axios.get(url)
        .then((result)=>{
            let gmtEpoc = result.data.dt;
            let timezone = result.data.timezone; // unit is second
            let weatherData = {};
            
            weatherData.ctemp = Kelvin2Celsius(result.data.main.temp);            
            weatherData.dateTime = getFormattedLocalDateTime(gmtEpoc, timezone);
            weatherData.date = getFormattedLocalDate(gmtEpoc, timezone);
            weatherData.dayOfWeek = getDayOfWeek(gmtEpoc, timezone);
            weatherData.cityName = result.data.name;
            weatherData.weatherDescription = result.data.weather[0].description;
            weatherData.iconURL = "https://openweathermap.org/img/wn/" + result.data.weather[0].icon + "@2x.png";

            setCurrentWeather(weatherData);
        })
        .catch((err)=>{
            if (err.response.status === 404) {
                setErrorMessage("City is not found.");
            } else {
                setErrorMessage("Error in getting current weather data!");
                console.log("Error", err.response);
            }

        })
    }

    /**
     * Get five days of weather forecast from openweathermap.
     * @param city name to search 
     */
    const getFiveDaysForecast = (city, lat, lon) => {
        let url
        if (city !== null) { 
            url = "https://api.openweathermap.org/data/2.5/forecast?appid=" + APIKEY + "&q=" + city;
        } else if (lat !== null && lon !== null) {
            url = "https://api.openweathermap.org/data/2.5/forecast?appid=" + APIKEY + "&lat=" + lat + "&lon=" + lon;       
        } else {
            setErrorMessage("Error!");
            return;
        }

        axios.get(url)
        .then((result)=>{
            // console.log("getFiveDaysForecast result",result);
            let response = result.data;
            let weatherDataArr = [];

            // Loop through five days of weather forecast data. 
            // Data is available every 3 hours in the 'list' array. 
            // Assuming anytime of day is ok to choose from the list. 
            // We can see the date/time here. response.list[i].dt_txt
            for (let i = 4; i < response.list.length; i = i + 8) {
                let weatherData = {};
                let ktemp = response.list[i].main.temp;
                let gmtEpoc = response.list[i].dt;
                let timezone = response.city.timezone;

                weatherData.ctemp = Kelvin2Celsius(ktemp);
                // When displaying date/time, we use local date/time of weather location.
                weatherData.dateTime = getFormattedLocalDateTime(gmtEpoc, timezone);
                weatherData.date = getFormattedLocalDate(gmtEpoc, timezone);
                weatherData.dayOfWeek = getDayOfWeek(gmtEpoc, timezone);
                weatherData.cityName = response.city.name;
                weatherData.weatherDescription = response.list[i].weather[0].description;
                weatherData.iconURL = "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png";
                // console.log("weatherData",weatherData)
                weatherDataArr.push(weatherData);
            }
        
            setFiveDaysForecast(weatherDataArr);
        })
        .catch((err)=>{
            if (err.response.status === 404) {
                setErrorMessage("City is not found.");
            } else {
                setErrorMessage("Error in getting weather forecast data!");
                console.log("Error", err.response);
            }
        })
    } 

    /**
     * Called when search button is clicked.
     * @param {*} city 
     */
    const searchButtonHandler = (city) => {
        city = city.trim();
        setErrorMessage('');        
        getFiveDaysForecast(city);
        getCurrentWeather(city);
    } 

    const handleKeyPress = (e, city) => {
        if (e.key === "Enter") {
            searchButtonHandler(city);
        }
    }


    return (
        <>            
            <div className="search">
                Search for a city:<p/>
                <input 
                    placeholder="Enter city name..."
                    onChange={e=>setCityName(e.target.value)}
                    onKeyPress={e => handleKeyPress(e, e.target.value)}
                    value={cityName}
                />

                <button onClick={(e)=>searchButtonHandler(cityName)}>
                    Search
                </button>
                <p/>
                {errorMessage}
            </div>
              
            <div className="content">
                <div className="content-description">              
                    Current and 5 days forecast 
                    {currentWeather ? 
                    ` in  ${currentWeather.cityName}`
                    :
                     ''}
                   :<br/> 
                    <small>(Hover mouse to show more info)</small>
                </div>

                <div className="cards">
                    {/* Display loading icon if there's no weather data yet. */}
                    { !currentWeather || !fiveDaysForecast ? 
                        <div className="loading">
                            <img src={loadingIcon} alt="loading..." />
                        </div>
                        :
                        ''
                    }

                    { currentWeather ? 
                        <WeatherCard weatherData={currentWeather} />
                        :
                        ''
                    }

                    { fiveDaysForecast ? 
                        <>
                            <WeatherCard weatherData={fiveDaysForecast[0]} />
                            <WeatherCard weatherData={fiveDaysForecast[1]} />
                            <WeatherCard weatherData={fiveDaysForecast[2]} />
                            <WeatherCard weatherData={fiveDaysForecast[3]} />
                            <WeatherCard weatherData={fiveDaysForecast[4]} />
                        </>
                        :
                        ''
                    }
                </div>
            </div>
        </>
    );
}

export default WeatherForecast;
