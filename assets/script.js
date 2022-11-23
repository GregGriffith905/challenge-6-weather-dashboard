var searchEntry = $("#search-entry");            //imported html elements
var searchButton = $("#search-button");
var currentCityInfo = $("#current-city-info");
var currentIcon = $("#current-icon");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHumidity = $("#current-humidity");
var recentButtons = $("#recent-buttons");
var currentCard = $("#current-card");
var lastUpdate = $("#last-update");
var forecast = $('#forecast');
var forecastCardClass = $('.forecast-card');

var city;                   //stores the city inputed
var responseStatus;         //used in fetching
var isDay;                  //check time for use of day/night icons
var recentSearches;         //array to store 8 recent searches

function convertedUnixDate(timeStamp,timeZone){ //convert unix date to local time at searched city
        var localDate = new Date();
        var timeZoneCorrection = timeZone + localDate.getTimezoneOffset()*60;       
        var convertedDate = new Date((timeStamp + timeZoneCorrection)*1000);
        var displayDate = convertedDate.getMonth()+1 + '/' + convertedDate.getDate() + '/' + convertedDate.getFullYear();//dd:mm:yyyy
        var displayTime = convertedDate.getHours() + ':' + String(convertedDate.getMinutes()).padStart(2,'0');           //hh:mm
     
        if (convertedDate.getHours()>6 && convertedDate.getHours()<18) isDay=true; //6h-18h is day period
        else isDay = false;
        return [displayDate,displayTime];        //return date and time
};
function updateRecent(){  //updates array of recently searched cities
    recentSearches = JSON.parse(localStorage.getItem("recentSearches")); //get araay from localestrage
    var length;
    var inList = false; //is selected city already in array?

    if (recentSearches != null){
        length = recentSearches.length;  
        for (var i = 0; i < length; i++){   //check if city is already in list
            if (city == recentSearches[i]){ //if city for then remove and replace it at postion 0
                recentSearches.splice(i,1);
                recentSearches.unshift(city);
                inList = true;
            }
        }
        if (!inList) {
            if (length<8){                     //if list length < 8, add city to list 
                recentSearches.unshift(city)
            }
            if (length>=8){                    // if list length >= 8, add city to list and delete least recent city 
                recentSearches.splice(7);
                recentSearches.unshift(city); 
            }
        }
    }
    if (recentSearches == null) recentSearches = [city];    //add first item if array is empty

    localStorage.setItem('recentSearches',  JSON.stringify(recentSearches));    //save changes to local storage
}
function getIcon(weather){  //loads weather icon from font awesome
    var icons = {clouds: ['<i class="fa">&#xf6c4</i>','<i class="fa">&#xf6c3</i>'], //f0c2
             clear: ['<i class="fa">&#xf185</i>', '<i class="fa">&#xf186</i>'],
             atmosphere: '<i class="fa">&#xf75f</i>', 
             snow: '<i class="fa">&#xf2dc</i>',
             rain: '<i class="fa">&#xf740</i>',
             drizzle: '<i class="fa">&#xf73d</i>',
             thunderstorm: '<i class="fa">&#xf75a</i>'
            };          
    if (weather.main == "Clear" && isDay) return icons.clear[0];
    else if (weather.main == "Clear") return icons.clear[1];
    else if (weather.main == "Clouds" && isDay) return icons.clouds[0];
    else if (weather.main == "Clouds") return icons.clouds[1];
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
        responseStatus = response.status;
        if (responseStatus != 200){     //error handling
            alert("City not found");    //alert user
            searchEntry.val('');        //clear field
            return;
        }
        return response.json();
        })
        .then(function (data) {
            if (responseStatus == 200){ 
                city = data.name; 
                currentCityInfo.text(city + "  ("+ convertedUnixDate(data.dt,data.timezone)[0] + ") "); 
                lastUpdate.text("Last update: " + convertedUnixDate(data.dt,data.timezone)[1] + "h local time: " + data.name + "," + data.sys.country);
                currentIcon.html(getIcon(data.weather[0])); 
                currentTemp.text("Temp: " + (data.main.temp).toFixed(2) + "ºC");
                currentWind.text("Wind: " + (data.wind.speed/10*36).toFixed(2) + "Km/h");
                currentHumidity.text("Humidity: " + (data.main.humidity).toFixed(0) + "%");
                if(isDay) currentCard.css({"background-color":" rgba(39, 130, 204, 0.329","color":"black"} );
                else currentCard.css({"background-color":"rgba(12, 13, 27, 0.897)","color":"white" });
                
                updateRecent();
                loadRecentButtons();
                searchEntry.val('');
           }
        }) 
        fetch(queryForecastURL) //get forecast info
            .then(function (response) {
                responseStatus = response.status;
                if (responseStatus !=200) return;
                else return response.json();
            })
            .then(function (data) {
                if (responseStatus == 200){
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
                        if(isDay) forecastCardClass.css("color","white");
                        else forecastCardClass.css("color","black");    
                    }
                }
            })
}
function runFromSearch(){  //runs on click of search button
    var searchVal = searchEntry.val().trim();
    if (searchVal !=""){
        city = searchVal;
        getApi();  
    }
}
function runFromRecent(event){    //runs on click of a recent button
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
        }
    }
}
function loadLastSearch(){
    recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (recentSearches != null){
        city = recentSearches[0];
        getApi();  
    }
    else{   
        city = "Toronto";
        getApi();
    }
}

loadLastSearch();
loadRecentButtons();
searchButton.on('click',runFromSearch);
searchEntry.on('keypress',function(e) {
    if(e.keyCode == 13) runFromSearch();
})

recentButtons.children().eq(0).on('click', runFromRecent);
recentButtons.children().eq(1).on('click', runFromRecent);
recentButtons.children().eq(2).on('click', runFromRecent);
recentButtons.children().eq(3).on('click', runFromRecent);
recentButtons.children().eq(4).on('click', runFromRecent);
recentButtons.children().eq(5).on('click', runFromRecent);
recentButtons.children().eq(6).on('click', runFromRecent);
recentButtons.children().eq(7).on('click', runFromRecent);



