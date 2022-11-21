var searchEntry = $("#search-entry");
var searchButton = $("#search-button");
var currentCityInfo = $("#current-city-info");
var currentIcon = $("#current-icon");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHumidity = $("#current-humidity");
var recentButtons = $("#recent-buttons");

var forecast = $('#forecast');


             

// var forecast1 = $('#forecast1');
// var forecast2 = $('#forecast2');
// var forecast3 = $('#forecast3');
// var forecast4 = $('#forecast4');
// var forecast5 = $('#forecast5');

var city;
var responseStatus;
var isDay;


var recentSearches; // = JSON.parse(localStorage.getItem("recentSearches"));

function convertedUnixDate(timeStamp,timeZone){
        var localDate = new Date();
        var timeZoneCorrection = timeZone + localDate.getTimezoneOffset()*60;       
        var convertedDate = new Date((timeStamp + timeZoneCorrection)*1000);
        var displayDate = convertedDate.getMonth()+1 + '/' + convertedDate.getDate() + '/' + convertedDate.getFullYear() + " " + convertedDate.getHours() + ':' + String(convertedDate.getMinutes()).padStart(2,'0');        
        if (convertedDate.getHours()>6 && convertedDate.getHours()<18) isDay=true;
        else isDay = false;
        console.log(isDay);
        return displayDate;        
};

function updateRecent(){    
    recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    var tempArray = [];
    var length;

    
    if (recentSearches != null){
        length = recentSearches.length;  
        for (var i = 0; i < length; i++){   //check if city is already in list
            if (city == recentSearches[i]) return;
        }
        tempArray[0] = city;
        if (length<8){                     //if list length < 8, add city to list 
            for (var i=0; i<length; i++){
                tempArray[i+1] = recentSearches[i] ;
            }
        }
        if (length>=8){                    // if list length >= 8, add city to list and delete least recent city 
            for (var i=0; i<7; i++){
                tempArray[i+1] = recentSearches[i] ;
            }   
        }
        recentSearches = tempArray;
    }
    if (recentSearches == null) recentSearches = [city];

    console.log(recentSearches);
    localStorage.setItem('recentSearches',  JSON.stringify(recentSearches));
    console.log("temp: " + tempArray);
}



function getIcon(weather){
    var icons = {clouds: '<i class="fa">&#xf0c2</i>', 
             clear: ['<i class="fa">&#xf185</i>', '<i class="fa">&#xf186</i>'],
             atmosphere: '<i class="fa">&#xf75f</i>', 
             snow: '<i class="fa">&#xf2dc</i>',
             rain: '<i class="fa">&#xf740</i>',
             drizzle: '<i class="fa">&#xf73d</i>',
             thunderstorm: '<i class="fa">&#xf75a</i>'
            };    
    console.log(weather.main);
    console.log(icons);        
    if (weather.main == "Clear" && isDay) return icons.clear[0];
    else if (weather.main == "Clear") return icons.clear[1];
    else if (weather.main == "Clouds") return icons.clouds;
    else if (weather.main == "Atmosphere") return icons.atmosphere;
    else if (weather.main == "Snow") return icons.snow;
    else if (weather.main == "Rain") return icons.rain;
    else if (weather.main == "Drizzle") return icons.drizzle;
    else if (weather.main == "Thunderstorm") return icons.thunderstorm;

}
function getApi(){  //get current and forecast info from api
    var apiKey = "608e89a8abd53641f8198304f956f5a7";
    var queryWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey+"&units=metric";
    var queryForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey+"&units=metric";

    fetch(queryWeatherURL)  //get current info              
        .then(function (response) {
        //console.log(response.status); 
        responseStatus = response.status;
        if (responseStatus != 200){
            alert("Invalid entry or City not found"); 
            return;
        }
        return response.json();
        })
        .then(function (data) {
            console.log(data);
           if (responseStatus == 200){
            currentCityInfo.text(city + "  ("+ convertedUnixDate(data.dt,data.timezone) + ")"); 
            currentIcon.html(getIcon(data.weather[0]));
            currentTemp.text("Temp: " + (data.main.temp).toFixed(2) + "ºC");
            currentWind.text("Wind: " + (data.wind.speed/10*36).toFixed(2) + "Km/h");
            currentHumidity.text("Humidity: " + (data.main.humidity).toFixed(0) + "%");
           }
        }) 
        fetch(queryForecastURL) //get forecast info
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                for (var i = 0, j=7; i < 5 && j< data.list.length; i++, j+=8) {
                    var fiveDays = [];
                    fiveDays[i] ;
                    var forecastCard = forecast.children()[1].children[i];
                    var fcastDate = new Date(data.list[j].dt_txt)
                    var fcastdateformatted = fcastDate.getMonth()+1 + '/' + fcastDate.getDate() + '/' + fcastDate.getFullYear();
                    var forecastDate = forecastCard.children[0].children[0].children[0];
                    var forecastIcon = forecastCard.children[0].children[0].children[1];
                    var forecastTemp = forecastCard.children[0].children[0].children[2];
                    var forecastWind = forecastCard.children[0].children[0].children[3];
                    var forecastHumidity = forecastCard.children[0].children[0].children[4];

                    forecastDate.textContent=(fcastdateformatted);
                    forecastIcon.innerHTML = getIcon(data.list[j].weather[0]);
                    forecastTemp.textContent=("Temp: " + data.list[j].main.temp.toFixed(2) + "ºC");
                    forecastWind.textContent=("Wind: " + data.list[j].wind.speed.toFixed(2) + "Km/h");
                    forecastHumidity.textContent=("Humidity: " + data.list[j].main.humidity.toFixed(0) + "%");

                    //forecastCard.children[0] = convertedUnixDate(data.dt,data.timezone)
                    // console.log(data.list[j].main.temp);
                    // console.log(data.list[j].wind.speed);
                    // console.log(data.list[j].main.humidity);

                    //console.log(forecastCard.children[0].children[0].children[0]);
                    //console.log(forecastCard.children[0].children[0].children[1]);
                }
            })
}

function getCity(){ //get city from searchEnter textarea
    city = searchEntry.val().trim();
    console.log("city: " + city);
    
}
function runAll(){
    if (searchEntry.val()!=""){
        getCity();
        getApi();     ///add func to check if city valid before proceeding 
        //console.log(responseStatus)
        if (responseStatus == "200"){
            updateRecent();
            searchEntry.val('');
            loadRecentButtons();
        }
    }
}

function runAll2(event){
    city = event.target.textContent;
    getApi();
}

function loadRecentButtons(){
    recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (recentSearches != null){
        for(var i = 0; i < recentSearches.length; i++){
            var currentButton = recentButtons.children().eq(i);
            currentButton.text(recentSearches[i]);
            currentButton.removeClass("hide");
            //console.log(currentButton.text());
        }
    }
}



loadRecentButtons();
searchButton.on('click',runAll);
searchEntry.on('keypress',function(e) {
    if(e.keyCode == 13) runAll();
})

recentButtons.children().eq(0).on('click', runAll2);
recentButtons.children().eq(1).on('click', runAll2);
recentButtons.children().eq(2).on('click', runAll2);
recentButtons.children().eq(3).on('click', runAll2);
recentButtons.children().eq(4).on('click', runAll2);
recentButtons.children().eq(5).on('click', runAll2);
recentButtons.children().eq(6).on('click', runAll2);
recentButtons.children().eq(7).on('click', runAll2);




