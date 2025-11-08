import { useState } from 'react'
import './index.css'

function Weather({weather}){
    if(!weather) return null;

   
    return (
        
        <div className='flex flex-col items-center mt-20 space-y-6'>
            <div className='bg-white/70 rounded-xl shadow-lg p-6 w-80 text-center'>
                <div className = "location"> 
                    <p className='text-2xl font-semibold mb-2'>{weather.city}</p>
                 </div>

                <div className = "weather-icon"> 
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} className='mx-auto'/>
                </div>

                <div className = 'temperature'> 
                    <h2 className='text-6xl font bold mb-4'>{Math.round(weather.temperature)}℃</h2>
                </div>

                 <div className = 'description'> 
                    <p className = 'text-gray-600 mb-4'>{weather.description}</p>
                 </div>

             </div>
        </div> 

    )       

}

export default Weather;