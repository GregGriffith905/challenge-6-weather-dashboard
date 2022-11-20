var searchButton = $("#search-button");
var city = "toronto";



function convertedUnixDate(timeStamp,timeZone){
        var localDate = new Date();
        var timeZoneCorrection = timeZone + localDate.getTimezoneOffset()*60;       
        var convertedDate = new Date((timeStamp + timeZoneCorrection)*1000);
        var displayDate = convertedDate.getMonth()+1 + '/' + convertedDate.getDate() + '/' + + convertedDate.getFullYear() + " " + convertedDate.getHours() + ':' + convertedDate.getMinutes();        
        return displayDate;        
};

function getApi(){
    var apiKey = "608e89a8abd53641f8198304f956f5a7";
    var queryWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey+"&units=metric";
    var queryForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey+"&units=metric";
    

    fetch(queryWeatherURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        console.log(data);
        console.log("City: " + data.name);
        console.log("Date: " + convertedUnixDate(data.dt,data.timezone));
        console.log("Icon: " + "");
        console.log("Temp: " + (data.main.temp) + "C");
        console.log("Wind: " + (data.wind.speed/10*36) + "Km/h");
        console.log("Humidity: " + (data.main.humidity) + "%");
        })

    fetch(queryForecastURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        console.log(data);
        console.log(data.list);
        for (var i = 0, j=7; i < 5 && j< data.list.length; i++, j+=8) {
            var fiveDays = [];
            fiveDays[i] ;
            console.log(i);
            console.log(j);
            console.log(convertedUnixDate(data.list[j].dt,data.city.timezone));
            console.log((data.list[j].main.temp).toFixed(2) + "C") ;
            console.log((data.list[j].wind.speed/10*36).toFixed(2) + "Km/h");
            console.log((data.list[j].main.humidity).toFixed(0) + "%");
        }
        })
    }
searchButton.on('click',getApi)