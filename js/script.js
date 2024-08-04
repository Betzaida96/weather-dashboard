function displayWeatherForecast(lat, lon) {
    var apiKey = '83d61eed31a0a84a3b429edf288391f6'
    var apiWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=83d61eed31a0a84a3b429edf288391f6`
    
    $.ajax({
        url:apiWeatherUrl,
        data: {
            lat: lat,
            lon: lon,
            appid: apiKey,
            units: 'imperial'
        },
        success: function(response) {
            $('#weatherCard .card-body').empty();

            var forecasts = response.list;
            var previousDate;
            forecasts.forEach(function(forecast) {
                var date = new Date(forecast.dt *1000);
                var dayofWeek =date.toLocaleDateString('en-US', {weekday: 'long'});
                if (previousDate !== dayofWeek) {
                    var highTemp = forecast.main.temp_max;
                    var lowTemp = forecast.main.temp_min;
                    var weatherDiscription = forecast.weather[0].description;
                    var chanceOfRain = forecast.rain ? forecast.rain['3h'] : 0

                    var forecastItem = `<div>${dayofWeek}: High - ${highTemp}&deg;F, low - ${lowTemp}&deg;F, weather description ${weatherDiscription},
                    chance of rain - ${chanceOfRain}%</div>`;
                    $('weatherCard .card-body').append(forecastItem);
                    previousDate = dayofWeek;
                }
            });
        },
        error: function() {

        }
    });
}