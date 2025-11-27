const API_KEY = "98740f4ebc0d63bc0f8ba70090e5a091";

/* ELEMENTS */
const cityInput = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");
const btn = document.querySelector(".search button");

const box = document.querySelector(".weather-box");
const details = document.querySelector(".details");

const icon = document.querySelector(".icon");
const temp = document.querySelector(".temp");
const desc = document.querySelector(".description");
const humi = document.querySelector(".humi");
const wind = document.querySelector(".wind");

/* BACKGROUND */
const L1 = document.querySelector(".layer-1");
const L2 = document.querySelector(".layer-2");
const rays = document.querySelector(".light-rays");
const rainFx = document.querySelector(".rain");

/* BACKGROUND MAP */
const BG = {
  Clear:  {l1:"assist/clear1.jpg", l2:"assist/clear2.png", rays:1, rain:0},
  Clouds: {l1:"assist/cloud1.jpg", l2:"assist/cloud2.png", rays:0, rain:0},
  Rain:   {l1:"assist/rain1.jpg",  l2:"assist/rain2.png",  rays:0, rain:1},
  Snow:   {l1:"assist/snow1.jpg",  l2:"assist/snow2.png",  rays:0, rain:0},
  Mist:   {l1:"assist/mist1.jpg",  l2:"assist/mist2.png",  rays:0, rain:0}
};

/* ICON MAP */
const ICON = {
  Clear:"assist/clear.png",
  Clouds:"assist/cloud.png",
  Rain:"assist/rain.png",
  Snow:"assist/snow.png",
  Mist:"assist/mist.png"
};

/* AUTOCOMPLETE SYSTEM */

let cityCache = {}; // caching

async function fetchCities(query) {
  if (cityCache[query]) return cityCache[query];

  try {
    const res = await fetch(
      `https://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=7&namePrefix=${query}`
    );
    const json = await res.json();

    cityCache[query] = json.data; // cache
    return json.data;
  } catch (e) {
    console.log("Autocomplete error:", e);
    return [];
  }
}

function showSuggestions(list) {
  suggestions.innerHTML = "";
  if (!list.length) return (suggestions.style.display = "none");

  list.forEach(city => {
    const li = document.createElement("li");
    li.textContent = `${city.city}, ${city.country}`;

    li.onclick = () => {
      cityInput.value = city.city;
      suggestions.style.display = "none";
      getWeather(city.city);
    };

    suggestions.appendChild(li);
  });

  suggestions.style.display = "block";
}

cityInput.addEventListener("input", async () => {
  const q = cityInput.value.trim();
  if (q.length < 2) return (suggestions.style.display = "none");

  showSuggestions(await fetchCities(q));
});

// إخفاء القائمة
document.addEventListener("click", e => {
  if (!e.target.closest(".search")) suggestions.style.display = "none";
});

/* WEATHER FETCH*/

function getWeather(city) {
  if (!city) return;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  )
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) return alert("Ville introuvable!");

      const w = data.weather[0].main;
      const bg = BG[w] || BG.Clouds;

      /* BACKGROUND */
      L1.style.backgroundImage = `url(${bg.l1})`;
      L2.style.backgroundImage = `url(${bg.l2})`;
      L1.style.opacity = L2.style.opacity = 1;

      rays.style.opacity = bg.rays ? 0.6 : 0;
      rainFx.style.opacity = bg.rain ? 0.4 : 0;

      /* DATA */
      icon.src = ICON[w] || ICON.Clouds;
      temp.innerHTML = `${Math.round(data.main.temp)}°C`;
      desc.textContent = data.weather[0].description;

      humi.textContent = data.main.humidity + "%";
      wind.textContent = data.wind.speed + " km/h";

      /* SHOW */
      [box, details].forEach(el => el.classList.remove("hidden"));
      setTimeout(() => {
        box.classList.add("show");
        details.classList.add("show");
      }, 50);
    })
    .catch(() => alert("Erreur API !"));
}

/* ENTER = search */
cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter") btn.click();
});

/* BUTTON CLICK */
btn.addEventListener("click", () => {
  getWeather(cityInput.value);
});
