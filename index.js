import { data } from "./data.js";

function loadAllWeather() { 
    let weatherHTML = '';
    
    data.forEach((item) => {
        weatherHTML += `
            <div class="weather-card" data-index="${item.index}">
                <button class="remove-btn" onclick="removeCity(${item.index})">×</button>
                <div class="city-name">${item.location.name}</div>
                <div class="country">${item.location.country.trim()}</div>
                <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/01d.png" alt="${item.condition.text}" style="width: 80px; height: 80px;">
                </div>
                <div class="temperature">${Math.round(item.condition.temp_c)}°C</div>
                <div class="description">${item.condition.text}</div>
                <div class="details">
                    <div class="detail-item">
                        <span class="detail-label">Feels Like</span>
                        <span class="detail-value">${Math.round(item.condition.feelslike_c)}°C</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Humidity</span>
                        <span class="detail-value">${item.condition.humidity}%</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Wind Speed</span>
                        <span class="detail-value">${Math.round(item.condition.wind_kph)} km/h</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Pressure</span>
                        <span class="detail-value">${Math.round(item.condition.pressure_mb || item.condition.pressure)} hPa</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    document.querySelector('.weather-grid').innerHTML = weatherHTML;
}

window.removeCity = function(index) {
    const itemIndex = data.findIndex(item => item.index === index);
    
    if (itemIndex !== -1) {
        data.splice(itemIndex, 1);
        loadAllWeather();
        console.log(`City with index ${index} removed`);
    }
};

function addCity() {
    const searchInput = document.querySelector('.search-input');
    const cityName = searchInput.value.trim();
    
    if (cityName === '') {
        alert('Please enter a city name');
        return;
    }
    const newCity = {
        index: data.length + 1,
        location: {
            name: cityName,
            country: "Nepal"
        },
        condition: {
            text: "warm",
            temp_c: Math.floor(Math.random() * 20) + 10, // Random temp between 10-30
            feelslike_c: Math.floor(Math.random() * 20) + 10,
            humidity: Math.floor(Math.random() * 50) + 30,
            wind_kph: Math.floor(Math.random() * 15) + 5,
            pressure: Math.floor(Math.random() * 30) + 10
        }
    };
    
    data.push(newCity);
    loadAllWeather();
    searchInput.value = '';
    console.log('New city added:', newCity);
}


document.addEventListener('DOMContentLoaded', () => {

    loadAllWeather();
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', addCity);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCity();
            }
        });
    }
});