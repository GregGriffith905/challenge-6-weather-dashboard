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
        var timeZoneCorrection = timeZone + localDate.getTimezoneOffset()*60;       //cancel timezone offset
        var convertedDate = new Date((timeStamp + timeZoneCorrection)*1000);        //convert unix date and time at search
        var displayDate = convertedDate.getMonth()+1 + '/' + convertedDate.getDate() + '/' + convertedDate.getFullYear();//dd:mm:yyyy
        var displayTime = convertedDate.getHours() + ':' + String(convertedDate.getMinutes()).padStart(2,'0');           //hh:mm
        
        if (convertedDate.getHours()>6 && convertedDate.getHours()<18) isDay=true; //6h-18h is day period
        else isDay = false;                                                        //else it is night

        return [displayDate,displayTime];        //return date and time
};
function updateRecent(){  //updates array of recently searched cities
    recentSearches = JSON.parse(localStorage.getItem("recentSearches")); //get array from localstorage
    var length;
    var inList = false; //is selected city already in array?

    if (recentSearches != null){                  //If there are recent searches
        length = recentSearches.length;           //get length of recent searches
        for (var i = 0; i < length; i++){         //check if city searched is already in recent search
            if (city == recentSearches[i]){       //if city in list then remove and replace it at postion 0
                recentSearches.splice(i,1);       //remove
                recentSearches.unshift(city);     //replace
                inList = true;                    //to skip next portion  
            }
        }
        if (!inList) {                            //if not in list          
            if (length<8){                        //if list length < 8
                recentSearches.unshift(city)      //add to list  
            }
            if (length>=8){                       // if list length >= 8 
                recentSearches.splice(7);         // delete least recent search  
                recentSearches.unshift(city);     //add new city to top of list   
            }
        }
    }
    if (recentSearches == null) recentSearches = [city];    //if there are no recent searches add first item

    localStorage.setItem('recentSearches',  JSON.stringify(recentSearches));    //save changes to local storage
}
function getIcon(weather){  //loads weather icon from font awesome unicode
    var icons = {clouds: ['<i class="fa">&#xf6c4</i>','<i class="fa">&#xf6c3</i>'], 
             clear: ['<i class="fa">&#xf185</i>', '<i class="fa">&#xf186</i>'],
             atmosphere: '<i class="fa">&#xf75f</i>', 
             snow: '<i class="fa">&#xf2dc</i>',
             rain: '<i class="fa">&#xf740</i>',
             drizzle: '<i class="fa">&#xf73d</i>',
             thunderstorm: '<i class="fa">&#xf75a</i>'
            };          
    if (weather.main == "Clear" && isDay) return icons.clear[0];            //return clear sun
    else if (weather.main == "Clear") return icons.clear[1];                //return clear moon   
    else if (weather.main == "Clouds" && isDay) return icons.clouds[0];     //return cloudy sun
    else if (weather.main == "Clouds") return icons.clouds[1];              //return cloudy moon
    else if (weather.main == "Atmosphere") return icons.atmosphere;         //return smog
    else if (weather.main == "Snow") return icons.snow;                     //return snow   
    else if (weather.main == "Rain") return icons.rain;                     //return heavy rain
    else if (weather.main == "Drizzle") return icons.drizzle;               //return light rain   
    else if (weather.main == "Thunderstorm") return icons.thunderstorm;     //return storm

}
function getApi(){  //get current and forecast info from api
    var apiKey = "608e89a8abd53641f8198304f956f5a7";
    var queryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey+"&units=metric";
    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey+"&units=metric";

    fetch(queryWeatherURL)  //get current info              
        .then(function (response) {
        responseStatus = response.status;   //needed to pass value
        if (responseStatus != 200){         //error handling
            alert("City not found");        //alert user
            searchEntry.val('');            //clear field
            return;
        }
        return response.json();
        })
        .then(function (data) {
            if (responseStatus == 200){             //proceed if ok
                city = data.name;                   //replace typed city name with name from api
                currentCityInfo.text(city + "  ("+ convertedUnixDate(data.dt,data.timezone)[0] + ") "); //update current city and date
                lastUpdate.text("Last update: " + convertedUnixDate(data.dt,data.timezone)[1] + "h local time: " + data.name + "," + data.sys.country);
                currentIcon.html(getIcon(data.weather[0]));                                             //update icon
                currentTemp.text("Temp: " + (data.main.temp).toFixed(2) + "ºC");                        //update temperature
                currentWind.text("Wind: " + (data.wind.speed/10*36).toFixed(2) + "Km/h");               //update wind speed
                currentHumidity.text("Humidity: " + (data.main.humidity).toFixed(0) + "%");             //update humidity
                if(isDay) currentCard.css({"background-color":" rgba(39, 130, 204, 0.329","color":"black"} ); //update color
                else currentCard.css({"background-color":"rgba(12, 13, 27, 0.897)","color":"white" });        //update color
                
                updateRecent();           //update recent search array
                loadRecentButtons();      //reload search buttons
                searchEntry.val('');      //clear search entry
           }
        }) 
        fetch(queryForecastURL) //get forecast info
            .then(function (response) {
                responseStatus = response.status;   //needed to pass valur
                if (responseStatus !=200) return;   //error handling
                else return response.json();        
            })
            .then(function (data) {
                if (responseStatus == 200){         //proceed if ok
                    for (var i = 0, j=7; i < 5 && j< data.list.length; i++, j+=8) { //loop to populate 5 forecasted days
                        var forecastCard = forecast.children()[1].children[i];                //forecast card
                        var fcastDate = new Date(data.list[j].dt_txt)                         //get date from api  
                        var fcastdateformatted = fcastDate.getMonth()+1 + '/' + fcastDate.getDate() + '/' + fcastDate.getFullYear();
                        var forecastDate = forecastCard.children[0].children[0].children[0];  //date paragraph
                        var forecastIcon = forecastCard.children[0].children[0].children[1];  //icon paragraph
                        var forecastTemp = forecastCard.children[0].children[0].children[2];  //temp paragraph
                        var forecastWind = forecastCard.children[0].children[0].children[3];  //wind speed paragraph
                        var forecastHumidity = forecastCard.children[0].children[0].children[4];//humidity paragraph

                        forecastDate.textContent=(fcastdateformatted);                                    //update date 
                        forecastIcon.innerHTML = getIcon(data.list[j].weather[0]);                        //update icon              
                        forecastTemp.textContent=("Temp: " + data.list[j].main.temp.toFixed(2) + "ºC");   //update temp
                        forecastWind.textContent=("Wind: " + data.list[j].wind.speed.toFixed(2) + "Km/h ");//update wind speed
                        forecastHumidity.textContent=("Humidity: " + data.list[j].main.humidity.toFixed(0) + "% ");//update humidity
                        if(isDay) forecastCardClass.css("color","white");                                 //update text color- day  
                        else forecastCardClass.css("color","black");                                      //update text color- night 
                    }
                }
            })
}
function runFromSearch(){  //runs api on click of search button
    var searchVal = searchEntry.val().trim();   //gets value from search bar
    if (searchVal !=""){                        //if trimmed value is not ""    
        city = searchVal;                       //assign value from search to city
        getApi();                               //call api            
    }
}
function runFromRecent(event){    //runs api on click of a recent button
    city = event.target.textContent;            //assign value from search button to city
    getApi();                                   //call api
}
function loadRecentButtons(){   //load recent search buttons on startup and after list has been updated
    recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (recentSearches != null){
        for(var i = 0; i < recentSearches.length; i++){
            var currentButton = recentButtons.children().eq(i);
            currentButton.text(recentSearches[i]);
            currentButton.removeClass("hide");
        }
    }
}
function loadLastSearch(){  //automatically load weather of last searched city on startup/refresh
    recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (recentSearches != null){    //if there are recent searches
        city = recentSearches[0];   //assign value of most recent to city
        getApi();                   //call api
    }
    else{                           //if there are no recent searches  
        city = "Toronto";           //assign "toronto" to city as a default value
        getApi();                   //call api
    }
}

loadLastSearch();       //load weather info of last search
loadRecentButtons();    //load buttons of recent searches

searchButton.on('click',runFromSearch); //when search button is clicked
searchEntry.on('keypress',function(e) { //when enter key is pressed
    if(e.keyCode == 13) runFromSearch();
})

recentButtons.children().eq(0).on('click', runFromRecent);  //when recent search buttons are clicked
recentButtons.children().eq(1).on('click', runFromRecent);
recentButtons.children().eq(2).on('click', runFromRecent);
recentButtons.children().eq(3).on('click', runFromRecent);
recentButtons.children().eq(4).on('click', runFromRecent);
recentButtons.children().eq(5).on('click', runFromRecent);
recentButtons.children().eq(6).on('click', runFromRecent);
recentButtons.children().eq(7).on('click', runFromRecent);



