import React, { useState, useEffect } from "react";
import { CloudRain, Thermometer, Droplets } from "lucide-react";
import axios from "axios";

export default function WeatherWidget({ district}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
        
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/weatheralert?dist=${district}`
        );
        setWeather(res.data);
      } catch (err) {
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [district]);

  if (loading) return <div className="text-gray-500">Loading weather...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 text-center border border-green-200 hover:shadow-2xl transition">
      <h3 className="text-xl font-bold text-green-800 mb-2">
        🌤 Weather in {weather.location}
      </h3>
      <div className="flex items-center justify-center gap-3 mb-4">
        {weather.icon && (
          <img src={weather.icon} alt="Weather Icon" className="w-12 h-12" />
        )}
        <p className="text-lg font-semibold">{weather.condition}</p>
      </div>
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" /> Temperature:
          </span>
          <span>{weather.temperature}°C</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-500" /> Humidity:
          </span>
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-green-500" /> Rainfall:
          </span>
          <span>{weather.rainfall} mm</span>
        </div>
      </div>
    </div>
  );
}
