var apiKey = "608e89a8abd53641f8198304f956f5a7";
var city = "toronto";

var queryWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey+"&units=metric";
var queryForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey+"&units=metric";

fetch(queryWeatherURL)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    console.log(data)
    console.log("Temp: " + (data.main.temp) + "C")
    console.log("Wind: " + (data.wind.speed/10*36) + "Km/h")
    console.log("Humidity: " + (data.main.humidity) + "%")
    })

 