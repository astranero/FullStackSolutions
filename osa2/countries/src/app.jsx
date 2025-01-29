import { useState, useEffect } from "react";
import { getAllCountries, getWeatherData} from "./axiosutils";


export const App = () => {
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState("");
    const [targetCountry, setTargetCountry] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        getAllCountries()
            .then(data => setCountries(data)
            ).catch(error => console.error(`Error: ${error.message}`))
    }, [])

    useEffect(() => {
        const delayFetch = setTimeout(() => {
            if (targetCountry){
                try {
                    const data = getWeatherData(targetCountry.latlng[0], targetCountry.latlng[1]);
                    setWeather(data);
                } catch (error) {
                    console.error(`Error: ${error.message}`)
                }
            }
        }, 2000);
        return () => clearTimeout(delayFetch)
    }, [targetCountry])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setTargetCountry(null);
        setWeather(null);
    }


    const visibleCountries = targetCountry 
    ? [targetCountry]
    : countries.filter((country) => (
        country.name.official.toLowerCase().includes(search.toLowerCase())
    ));

    return (
            <div>
                <p>Find countries: <input value={search} onChange={handleSearch} /></p>
            {visibleCountries.length > 10 ? (
                <p>Too many matches, specify another filter</p>
            ) : visibleCountries.length === 1 ? (
                <div>
                    <h1 key={visibleCountries[0].cca3}>{visibleCountries[0].name.common}</h1>
                    <br></br>
                    <p> capital {visibleCountries[0].capital }</p>
                    <p> area {visibleCountries[0].area} </p>
                    <br></br>
                    <h2> Languages:</h2>
                    <ul>
                        { Object.values(visibleCountries[0].languages).map( language => {
                            return <li key={language}> {language.toString()} </li>
                        })}
                    </ul>
                    <img src={visibleCountries[0].flags.svg} width="150"/> 
                    <h2> Weather in {visibleCountries[0].capital}:</h2>
                    { weather ? (
                        <div>
                            <p>Temperature: {(weather.current.temp - 273.15).toFixed(2)} °C</p>
                            <img 
                                src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} 
                                alt={weather.current.weather[0].description} 
                            />
                            <p>Wind Speed: {weather.current.wind_speed} m/s</p>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <ul>
                    {visibleCountries.map(country => (
                        <li key={country.cca3}>
                            {country.name.common} 
                            <button onClick={() => {setTargetCountry(country)}}>show</button>
                        </li>
                    ))}
                </ul>
            )}
            </div>
    );
};

export default App;
