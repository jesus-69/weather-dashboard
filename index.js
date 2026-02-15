
        // Default cities to display
        const defaultCities = [
            'London',
            'New York',
            'Tokyo',
            'Paris',
            'Sydney',
            'Dubai',
            'Mumbai',
            'Singapore'
        ];

        let cities = [...defaultCities];

        async function fetchWeather(city) {
            const API_KEY = '058564bd42724305ba0141848261302';
            const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
            
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return await response.json();
            } catch (error) {
                throw error;
            }
        }

        function createWeatherCard(data, index) {
            const icon = data.current.condition.icon.startsWith('//') 
                ? `https:${data.current.condition.icon}` 
                : data.current.condition.icon;
            
            return `
                <div class="weather-card">
                    <button class="remove-btn" onclick="removeCity(${index})">×</button>
                    <div class="city-name">${data.location.name}</div>
                    <div class="country">${data.location.country}</div>
                    <div class="weather-icon"><img src="${icon}" alt="${data.current.condition.text}" style="width: 80px; height: 80px;"></div>
                    <div class="temperature">${Math.round(data.current.temp_c)}°C</div>
                    <div class="description">${data.current.condition.text}</div>
                    <div class="details">
                        <div class="detail-item">
                            <span class="detail-label">Feels Like</span>
                            <span class="detail-value">${Math.round(data.current.feelslike_c)}°C</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Humidity</span>
                            <span class="detail-value">${data.current.humidity}%</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Wind Speed</span>
                            <span class="detail-value">${Math.round(data.current.wind_kph)} km/h</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Pressure</span>
                            <span class="detail-value">${Math.round(data.current.pressure_mb)} hPa</span>
                        </div>
                    </div>
                </div>
            `;
        }

        async function loadAllWeather() {
            const weatherGrid = document.getElementById('weatherGrid');
            const loading = document.getElementById('loading');
            const errorDiv = document.getElementById('error');
            
            loading.style.display = 'block';
            errorDiv.style.display = 'none';
            weatherGrid.innerHTML = '';

            const weatherPromises = cities.map(city => fetchWeather(city));
            
            try {
                const results = await Promise.allSettled(weatherPromises);
                const cards = results
                    .map((result, index) => {
                        if (result.status === 'fulfilled') {
                            return createWeatherCard(result.value, index);
                        }
                        return '';
                    })
                    .join('');
                
                weatherGrid.innerHTML = cards;
                updateTimestamp();
            } catch (error) {
                errorDiv.textContent = 'Error loading weather data. Please check your API key.';
                errorDiv.style.display = 'block';
            } finally {
                loading.style.display = 'none';
            }
        }

        function addCity() {
            const input = document.getElementById('cityInput');
            const city = input.value.trim();
            const errorDiv = document.getElementById('error');
            
            if (city && !cities.includes(city)) {
                cities.push(city);
                loadAllWeather();
                input.value = '';
                errorDiv.style.display = 'none';
            } else if (cities.includes(city)) {
                errorDiv.textContent = 'City already added!';
                errorDiv.style.display = 'block';
                setTimeout(() => errorDiv.style.display = 'none', 3000);
            }
        }

        function removeCity(index) {
            cities.splice(index, 1);
            loadAllWeather();
        }

        function updateTimestamp() {
            const timestamp = document.getElementById('timestamp');
            const now = new Date();
            timestamp.textContent = `Last updated: ${now.toLocaleString()}`;
        }

        
        document.getElementById('cityInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addCity();
            }
        });

      
        loadAllWeather();

        
        setInterval(loadAllWeather, 300000);