document.getElementById('searchButton').addEventListener('click', function() {
    var city = document.getElementById('search-input').ariaValueMax;
    if (city) {
        fetchCityWeather(city);
    }
});

function fetchCityWeather(lat, lon) {
    var apiKey = '83d61eed31a0a84a3b429edf288391f6'
    var apiWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=83d61eed31a0a84a3b429edf288391f6`
    
    $.ajax({
        url:apiWeatherUrl,
        success: function(response) {
            displayCurrentWeather(response);
            saveSearchHistory(city);
            fetchWeatherForecast(response.coord.lat, response.coord.lon);

        },
        error: function() {
            //handle error
        }

    });
}

function displayCurrentWeather(data) {
    var currentWeatherHtml = `
    <div>
        <h3>${data.name} (${new Date().toLocaleDateString()})</h3>
        <p><img src="https://openweathermap.org/imp/wn/${data.weather[0].icon}.png" alt="weather icon></p>
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
        </div>
        `;
        $(current-weather-info).html(currentWeatherHtml);
}

function fetchWeatherForecast(lat, lon) {
    var apiKey = '83d61eed31a0a84a3b429edf288391f6'
    var apiWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=83d61eed31a0a84a3b429edf288391f6`

    $.ajax({
        url: apiForecasUrl,
        success: function(response) {
            displayWeatherForecast(response.list);
        },
        error:function() {
            //handle error
        }
    });
}

function displayWeatherForecast(forecasts) {
    var forecastHtml = '';
    var previousDate = '';

    forecasts.forEach(function(forecast) {
        var date = new Date(forecast.dt * 1000);
        var dayOfWeek = date.toLocaleDateString('en-US', {weekday: 'long'});
        
        if (previousDate !== dayOfWeek) {
            var weatherIcon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
            forecastHtml += `
            <div>
                <h4>${dayOfWeek} (${date.toLocaleDateString()})</h4>
                <p><img src="${weatherIcon}" alt="weather icon"></p>
                <p>Temp: ${forecast.main.temp} °F</p>
                <p>Wind: ${forecast.wind.speed} mph</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>
            `;
            previousDate = dayOfWeek
        }
    });

    $('#forecast-cards').html(forecastHtml);
}
