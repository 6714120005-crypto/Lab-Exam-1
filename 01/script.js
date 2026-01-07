const cities = {
    bangkok: { name: "กรุงเทพฯ", lat: 13.7563, lon: 100.5018 },
    london: { name: "ลอนดอน", lat: 51.5074, lon: -0.1278 },
    tokyo: { name: "โตเกียว", lat: 35.6895, lon: 139.6917 },
    newyork: { name: "นิวยอร์ก", lat: 40.7128, lon: -74.0060 }
};


const citySelect = document.getElementById("citySelect");
const weatherDiv = document.getElementById("weather");


citySelect.addEventListener("change", () => {
    const cityKey = citySelect.value;
    if (!cityKey) {
        weatherDiv.innerHTML = "";
        return;
    }
    loadWeather(cities[cityKey]);
});


async function loadWeather(city) {
    weatherDiv.innerHTML = "กำลังโหลดข้อมูล...";


    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&forecast_days=4&timezone=auto`;


    try {
        const response = await fetch(url);
        const data = await response.json();
        showWeather(city.name, data);
    } catch (err) {
        weatherDiv.innerHTML = "ไม่สามารถโหลดข้อมูลได้";
    }
}


function showWeather(cityName, data) {
    weatherDiv.innerHTML = "";


    const current = data.current_weather;
    const daily = data.daily;


    const currentDiv = document.createElement("div");
    currentDiv.className = "current-weather";
    currentDiv.innerHTML = `
  <h2>วันนี้ · ${cityName}</h2>
  <div class="temp">${current.temperature}°C</div>
  <div>${weatherText(current.weathercode)}</div>
    `;


    const forecastDiv = document.createElement("div");
    forecastDiv.className = "forecast";


    for (let i = 1; i <= 3; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
<h3>${formatDate(daily.time[i])}</h3>
<div>${weatherText(daily.weathercode[i])}</div>
<div>สูงสุด: ${daily.temperature_2m_max[i]}°C</div>
<div>ต่ำสุด: ${daily.temperature_2m_min[i]}°C</div>
`;
        forecastDiv.appendChild(card);
    }


    weatherDiv.appendChild(currentDiv);
    weatherDiv.appendChild(forecastDiv);
}


function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short" });
}


function weatherText(code) {
    if (code === 0) return "ท้องฟ้าแจ่มใส ☀️";
    if (code <= 3) return "มีเมฆ ⛅";
    if (code <= 48) return "หมอก 🌫️";
    if (code <= 67) return "ฝน 🌧️";
    if (code <= 77) return "หิมะ ❄️";
    if (code <= 99) return "พายุ ⛈️";
    return "ไม่ทราบสภาพอากาศ";
}