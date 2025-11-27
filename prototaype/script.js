const API_KEY = "d043e3221020701080932193b6b23f63";

const currentWeatherDiv = document.getElementById("currentWeather");
const forecastDiv = document.getElementById("forecast");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
let chartInstance = null;

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city.length > 0) {
    getWeather(city);
  }
});

async function getWeather(city) {
  // طقس اليوم
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ar&appid=${API_KEY}`;

  // توقعات 5 أيام
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ar&appid=${API_KEY}`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL)
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    displayCurrentWeather(weatherData);
    displayForecast(forecastData.list);
    drawChart(forecastData.list);

  } catch (err) {
    alert("❌ حدث خطأ في جلب البيانات");
  }
}

/* -------------------- الطقس الحالي -------------------- */

function displayCurrentWeather(data) {
  currentWeatherDiv.classList.remove("hidden");

  currentWeatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.weather[0].description}</p>
    <p>🌡️ الحرارة: ${data.main.temp}°C</p>
    <p>💧 الرطوبة: ${data.main.humidity}%</p>
    <p>🌬️ الرياح: ${data.wind.speed} كم/س</p>
  `;
}

/* -------------------- توقعات 5 أيام -------------------- */

function displayForecast(list) {
  forecastDiv.innerHTML = "";
  document.getElementById("forecastTitle").classList.remove("hidden");
  forecastDiv.classList.remove("hidden");

  // أخذ توقع واحد يومياً عند الساعة 12:00
  const daily = list.filter(i => i.dt_txt.includes("12:00"));

  daily.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString("ar-MA", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

    forecastDiv.innerHTML += `
      <div class="forecast-card">
        <h4>${date}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
        <p>${day.weather[0].description}</p>
        <p>${day.main.temp}°C</p>
      </div>
    `;
  });
}

/* -------------------- منحنى الحرارة -------------------- */

function drawChart(list) {
  const times = list.slice(0, 12).map(i => i.dt_txt.slice(11, 16));
  const temps = list.slice(0, 12).map(i => i.main.temp);

  document.getElementById("chartTitle").classList.remove("hidden");
  const canvas = document.getElementById("tempChart");
  canvas.classList.remove("hidden");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(canvas, {
    type: "line",
    data: {
      labels: times,
      datasets: [{
        label: "درجة الحرارة",
        data: temps,
        tension: 0.4,
        borderWidth: 3,
        fill: true
      }]
    }
  });
}
