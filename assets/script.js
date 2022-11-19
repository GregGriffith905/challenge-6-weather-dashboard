var apiKey = "608e89a8abd53641f8198304f956f5a7";
var city = "toronto";

var queryWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
var queryForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

fetch(queryWeatherURL)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    console.log(data)
    })
