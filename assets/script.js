var searchEntry = $("#search-entry");
var searchButton = $("#search-button");
var currentCityInfo = $("#current-city-info");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHumidity = $("#current-humidity");
var recentButtons = $("#recent-buttons");

//console.log(recentButtons);
//console.log(recentButtons.children()[0]);

var city;

var recentSearches; // = JSON.parse(localStorage.getItem("recentSearches"));

function convertedUnixDate(timeStamp,timeZone){
        var localDate = new Date();
        var timeZoneCorrection = timeZone + localDate.getTimezoneOffset()*60;       
        var convertedDate = new Date((timeStamp + timeZoneCorrection)*1000);
        var displayDate = convertedDate.getMonth()+1 + '/' + convertedDate.getDate() + '/' + + convertedDate.getFullYear() + " " + convertedDate.getHours() + ':' + convertedDate.getMinutes();        
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
    if (recentSearches == null) {
        recentSearches = [city];
        
    }
    console.log(recentSearches);
    localStorage.setItem('recentSearches',  JSON.stringify(recentSearches));
    console.log("temp: " + tempArray);
}

function getApi(){  //get current and forecast info from api
    var apiKey = "608e89a8abd53641f8198304f956f5a7";
    var queryWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey+"&units=metric";
    var queryForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey+"&units=metric";

    fetch(queryWeatherURL)  //get current info              
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
           currentCityInfo.text(city + "  ("+ convertedUnixDate(data.dt,data.timezone) + ")"); 
           currentTemp.text("Temp: " + (data.main.temp).toFixed(2) + "ºC");
           currentWind.text("Wind: " + (data.wind.speed/10*36).toFixed(2) + "Km/h");
           currentHumidity.text("Humidity: " + (data.main.humidity).toFixed(0) + "%");
        })
    fetch(queryForecastURL) //get forecast info
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (var i = 0, j=7; i < 5 && j< data.list.length; i++, j+=8) {
                var fiveDays = [];
                fiveDays[i] ;
        }
        })
    }

function getCity(){ //get city from searchEnter textarea
    city = searchEntry.val().trim();
    console.log("city: " + city);
    
}
function runAll(){
    getCity();
    getApi();     ///add func to check if city valid before proceeding 
    updateRecent();
    searchEntry.val('');
    loadRecentButtons();
}

function loadRecentButtons(){
    recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (recentSearches != null){
        for(var i = 0; i < recentSearches.length; i++){
            var currentButton = recentButtons.children().eq(i);
            currentButton.text(recentSearches[i]);
            currentButton.removeClass("hide");
            console.log(currentButton.text());
        }
    }
}

loadRecentButtons();
searchButton.on('click',runAll);
searchEntry.on('keypress',function(e) {
    if(e.keyCode == 13) runAll();
})


//console.log(JSON.parse(localStorage.getItem("recentSearches")));