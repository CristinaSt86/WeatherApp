import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState("Bucharest");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [inputCity, setInputCity] = useState("");

  const API_KEY = "91c01b286cb7725767d5dfbf4c6cb8e6";
  const PEXELS_API_KEY =
    "VHje9JGZaYmhDGABxW0yfJWoCDJA0NSqXfGlz8KwNnglgPM53fGXmczR";

  useEffect(() => {
    const fetchWeatherAndImage = async () => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(weatherResponse.data);

        const condition = weatherResponse.data.weather[0].main;
        const imageResponse = await axios.get(
          `https://api.pexels.com/v1/search?query=${condition}&per_page=1`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );
        const imageUrl = imageResponse.data.photos[0]?.src.large;
        setImageUrl(imageUrl);
      } catch (error) {
        console.log("Error fetching Data:", error);
      }
    };
    fetchWeatherAndImage();
  }, [city]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCity(event.target.value);
  };

  const handleCityChange = () => {
    setCity(inputCity);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCityChange(); // Trigger the same function as button click
    }
  };

  return (
    <div>
      <div
        className="overflow-x-hidden min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className=" bg-white bg-opacity-70 p-8 rounded-lg shadow-xl text-center max-w-xs md:max-w-md lg:max-w-lg mx-auto">
          <input
            type="text"
            value={inputCity}
            onChange={handleInputChange}
            onKeyUp={handleKeyPress}
            placeholder="Enter a city"
            className="border p-2 rounded mb-4 focus:outline-none"
          />
          <button
            onClick={handleCityChange}
            className="bg-white/50 backdrop-blur-md text-gray-800 shadow-xl hover:bg-white/20 px-4 py-2 rounded"
          >
            Get Weather
          </button>

          <h1 className="text-4xl font-bold text-gray-800 my-2">{city}</h1>
          {weatherData && (
            <>
              <p className="text-xl text-gray-600">
                {weatherData.weather[0].description.charAt(0).toUpperCase() +
                  weatherData.weather[0].description.slice(1)}
              </p>
              <p className="text-2xl text-gray-800 font-bold">
                {Math.round(weatherData.main.temp)}°C
              </p>
              <img
                className="mx-auto mt-4"
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="Weather Icon"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
