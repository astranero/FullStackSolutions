
import axios from "axios";
const URL = `https://studies.cs.helsinki.fi/restcountries/api/all`
const API_KEY = import.meta.env.API_KEY

export const getWeatherData = async (lat, lon) => {
    const weatherAPI = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    try {
        const response = await axios.get(weatherAPI);
        return response.data;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return [];
    }
};


export const getAllCountries = async () => {
    try {
        const response = await axios.get(URL);
        return response.data;
    } catch(error) {
        console.log(`Error: ${error.message}`)
        return [];
    }
};
