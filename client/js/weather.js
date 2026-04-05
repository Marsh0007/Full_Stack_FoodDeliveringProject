async function loadWeatherByCoords(lat, lon) {
  const weatherBox = document.getElementById("weatherBox");

  if (!weatherBox) return;

  try {
    weatherBox.innerHTML = "<p>Loading weather...</p>";

    const response = await fetch(
      `http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load weather");
    }

    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

    weatherBox.innerHTML = `
      <div class="weather-card">
        <div class="weather-header">
          <div>
            <h3>${data.city}, ${data.country}</h3>
            <p>${capitalizeText(data.description)}</p>
          </div>
          <img src="${iconUrl}" alt="${data.description}" class="weather-icon">
        </div>

        <div class="weather-details">
          <div class="weather-item">
            <span class="label">Temperature</span>
            <span class="value">${Math.round(data.temperature)}°C</span>
          </div>
          <div class="weather-item">
            <span class="label">Feels Like</span>
            <span class="value">${Math.round(data.feelsLike)}°C</span>
          </div>
          <div class="weather-item">
            <span class="label">Humidity</span>
            <span class="value">${data.humidity}%</span>
          </div>
          <div class="weather-item">
            <span class="label">Wind</span>
            <span class="value">${data.windSpeed} m/s</span>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Weather fetch error:", error);
    weatherBox.innerHTML = "<p>Unable to load weather right now.</p>";
  }
}

async function loadWeatherByCity(city = "Berlin") {
  const weatherBox = document.getElementById("weatherBox");

  if (!weatherBox) return;

  try {
    weatherBox.innerHTML = "<p>Loading weather...</p>";

    const response = await fetch(
      `http://localhost:5000/api/weather?city=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load weather");
    }

    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

weatherBox.innerHTML = `
  <div class="weather-card">
    <div class="weather-header">
      <div>
        <h3>${data.city}, ${data.country}</h3>
        <p>${capitalizeText(data.description)}</p>
      </div>
      <img src="${iconUrl}" alt="${data.description}" class="weather-icon">
    </div>

    <div class="weather-details">
      <div class="weather-item">
        <span class="label">Temperature</span>
        <span class="value">${Math.round(data.temperature)}°C</span>
      </div>

      <div class="weather-item">
        <span class="label">Feels Like</span>
        <span class="value">${Math.round(data.feelsLike)}°C</span>
      </div>

      <div class="weather-item">
        <span class="label">Humidity</span>
        <span class="value">${data.humidity}%</span>
      </div>

      <div class="weather-item">
        <span class="label">Wind</span>
        <span class="value">${data.windSpeed} m/s</span>
      </div>
    </div>
  </div>
`;
  } catch (error) {
    console.error("Weather fetch error:", error);
    weatherBox.innerHTML = "<p>Unable to load weather right now.</p>";
  }
}

function capitalizeText(text) {
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

function getUserLocationAndWeather() {
  if (!navigator.geolocation) {
    loadWeatherByCity("Berlin");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      loadWeatherByCoords(lat, lon);
    },
    (error) => {
      console.error("Location error:", error);
      loadWeatherByCity("Berlin");
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  getUserLocationAndWeather();
});