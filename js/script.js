document.getElementById('searchButton').addEventListener('click', function() {
    var city = document.getElementById('search-input').value;
    if (city) {
        getCoordinates(city);
    }
});

function getCoordinates(city) {
    var apiKey = '83d61eed31a0a84a3b429edf288391f6'
    var apiGeoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    
    $.ajax({
        url:apiGeoUrl,
        success: function(response) {
            if (response.length >0) {
            var lat = response[0].lat;
            var lon = response[0].lon;
            fetchCityWeather(lat,lon, city);
        } else {
            alert('City not found');
        }

    },
    error: function(){
        alert('Error fetching city coordinates');
    }
  });
}

function fetchCityWeather(lat, lon, city) {
    var apiKey = '83d61eed31a0a84a3b429edf288391f6'
    var apiWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    $.ajax({
        url: apiWeatherUrl,
        success: function(response) {
            displayCurrentWeather(response);
            saveSearchHistory(city);
            fetchWeatherForecast(lat, lon);
        },
        error:function() {
            //handle error
            alert('Error fetching weather data');
        }
    });
}

function displayCurrentWeather(data) {
    var currentWeatherHtml = `
    <div>
        <h3>${data.name} (${new Date().toLocaleDateString()})</h3>
        <p><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"></p>
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
        </div>
        `;
        $('#current-weather-info').html(currentWeatherHtml);
}

function fetchWeatherForecast(lat, lon) {
    var apiKey = '83d61eed31a0a84a3b429edf288391f6';
    var apiForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    $.ajax({
        url: apiForecastUrl,
        success: function(response) {
            displayWeatherForecast(response.list);
        },
        error: function() {
            alert('Error fetching weather forecast.');
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

function saveSearchHistory(city) {
    //save search history in local storage or an array and update the UI
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)){
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateSearchHistoryUI(searchHistory);
    }
}

function updateSearchHistoryUI(history){
    var historyHtml = history.map(function(city){
        return `<button type="button" class="history-item">${city}</button>`;
    }).join('');
    $('#search-history').html(historyHtml);

    //Add click event to the history items
    $('.history-item').on('click', function(){
        var city =$(this).text();
        getCoordinates(city);
    });
}

//Initialize search history from local storage
$(document).ready(function(){
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) ||[];
    updateSearchHistoryUI(searchHistory);
});