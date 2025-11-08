import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios'
import {FaSearch} from "react-icons/fa"
import Weather from './weather'
import defaultWeatherBg from './assets/sky-background.jpg'
import cloudyWeatherBg from './assets/sky-cloudy.jpg'

const API_KEY= "24485040f9e87006ca173e969e645416";

function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const[searchHistory, setSearchHistory] = useState([])
  const[error, setError] = useState(null)
  const [backgroundImage, setBackgroundImage] = useState(defaultWeatherBg);

  const weatherBackground = {
    Default: defaultWeatherBg,
    Clear: cloudyWeatherBg,
    Rain: cloudyWeatherBg,
    Clouds: cloudyWeatherBg,
    Snow: cloudyWeatherBg
  }

  

  const handleKeyDown = (event => {
    if(event.key === "Enter"){
      handleSearch();
    }
  })

  useEffect(()=>{
    const saved = JSON.parse(localStorage.getItem('searchHistory')) || [] ;
    setSearchHistory(saved);

    if(error) {
      const timer = setTimeout(() => setError(null), 3000);
      return() => clearTimeout(timer);
    }
    },[error]);


  const handleSearch = async(term) => {
    const query = term || city;
    if(!query.trim())return;

  

  try {
    const weatherApi = await axios.get("https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              q: query,
              units:"metric",
              appid: API_KEY,
            }
          }
        );

      
      const data = weatherApi.data;
       
      if(data && data.cod === 200){

        console.log(data.cod);
        
        setWeather({city: data.name, temperature: data.main.temp, icon: data.weather[0].icon, description: data.weather[0].description })

        const currentWeather = data.weather[0].main
        setBackgroundImage(weatherBackground[currentWeather] || weatherBackground.Default);

        const updatedHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0,5);
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        setCity("");
      }
    }
    catch (error){
        setError('Sorry no matching location found');
        setCity("");
      
    }
  }


  return (
    <div 
      className='relative min-h-screen w-full bg-cover bg-center bg-no-repeat m-0' 
      style={{ backgroundImage: `url(${backgroundImage})` }}>


      <div className='absolute top-4 left-4 bg-black/40 text-white rounded-lg px-21 py-4 flex flex-col items-start space-y-2'>
        <header className= 'flex items-center space-x-4 text-4xl font-semibold'>
        <h1 className='text-white text-xl font-semibold'>YC Weather</h1>
        <img src='https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' alt='React Logo' className='react-logo w-12 h-12'/>
        </header>
        <p className='text-sm text-white/80'>Quick local forecasts</p>
      </div>
      
      <div className='flex flex-col items-center'>
        
         <div className='relative w-full max-w-md mt-40'>
          <span className='flex-items-center absolute left-3 py-4 top-1/2-translate-y-1/2 text-gray-500'><FaSearch/></span>
            <input 
              type='text' 
              className='w-full pl-10 pr-4 py-3 rounded-lg shadow border border-white/30 bg-white/90 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400' 
              placeholder='Search for a location' 
              value={city} 
              onChange={(event) => setCity(event.target.value)} 
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className='h-4 mt-1 flex items-center justify-center'>
            {error && (<p className='text-sm text-red-500 bg-white/60 px-1 py-1 rounded'>{error}</p>)}
          </div>

      </div> 


        {searchHistory.length > 0 && (
      <div className='absolute top-40 right-8 w-64 bg-white/80 rounded-xl shadow p-4'>
            <h4 className='font-semibold text-gray-700 mb-4'>Recent locations</h4>
            <ul className='space-y-2'>
              {searchHistory.map((item, i) => (
                <li className='w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 active:bg-blue-300 transition font-medium shadow-sm'
                  key={i}>
                  <button onClick = {() =>
                  handleSearch(item)}>{item}</button>

                </li>
              ))}
            </ul>
            <button className='text-red-500 hover:text-red-600 mt-4' onClick={() => { setSearchHistory([]);
            localStorage.removeItem("searchHistory");
            setWeather(null);
            setCity("");
            
            }}
            >
            Clear History
          </button>
      </div>
      )}
      <Weather weather={weather}/>

      <footer className='fixed bottom-0 left-0 w-full text-center py-8 bg-black/40 text-white mt-10'>
      <p className='text-sm'>
        @ {new Date().getFullYear()} My Weather App - Buit using React & Tailwind
      </p>
    </footer>

    </div>
  )
}

export default App
