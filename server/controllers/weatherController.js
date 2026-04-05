const getWeatherByLocation = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Weather API key is missing" });
    }

    let url = "";

    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else {
      return res.status(400).json({ message: "City or coordinates are required" });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.message || "Failed to fetch weather"
      });
    }

    res.json({
      city: data.name,
      country: data.sys?.country || "",
      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,
      description: data.weather?.[0]?.description || "",
      icon: data.weather?.[0]?.icon || "",
      windSpeed: data.wind?.speed || 0
    });
  } catch (error) {
    console.error("Weather error:", error);
    res.status(500).json({ message: "Server error while fetching weather" });
  }
};

module.exports = { getWeatherByLocation };