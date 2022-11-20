var searchEntry = $("#search-entry");
var searchButton = $("#search-button");
var city;

//var recentSearches = JSON.parse(localStorage.getItem("recentSearches"));

function convertedUnixDate(timeStamp,timeZone){
        var localDate = new Date();
        var timeZoneCorrection = timeZone + localDate.getTimezoneOffset()*60;       
        var convertedDate = new Date((timeStamp + timeZoneCorrection)*1000);
        var displayDate = convertedDate.getMonth()+1 + '/' + convertedDate.getDate() + '/' + + convertedDate.getFullYear() + " " + convertedDate.getHours() + ':' + convertedDate.getMinutes();        
        return displayDate;        
};

function updateRecent(){    
    var recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
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

function getApi(){
    var apiKey = "608e89a8abd53641f8198304f956f5a7";
    var queryWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey+"&units=metric";
    var queryForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey+"&units=metric";

    fetch(queryWeatherURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        // console.log(data);
        // console.log("City: " + data.name);
        // console.log("Date: " + convertedUnixDate(data.dt,data.timezone));
        // console.log("Icon: " + "");
        // console.log("Temp: " + (data.main.temp) + "C");
        // console.log("Wind: " + (data.wind.speed/10*36) + "Km/h");
        // console.log("Humidity: " + (data.main.humidity) + "%");
        })
    fetch(queryForecastURL)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        // console.log(data);
        // console.log(data.list);
        for (var i = 0, j=7; i < 5 && j< data.list.length; i++, j+=8) {
            var fiveDays = [];
            fiveDays[i] ;
            // console.log(i);
            // console.log(j);
            // console.log(convertedUnixDate(data.list[j].dt,data.city.timezone));
            // console.log((data.list[j].main.temp).toFixed(2) + "C") ;
            // console.log((data.list[j].wind.speed/10*36).toFixed(2) + "Km/h");
            // console.log((data.list[j].main.humidity).toFixed(0) + "%");
        }
        })
    }

function getCity(){
    city = searchEntry.val();
    console.log("city: " + city);
}
function runAll(){
    getCity();
    //getApi();     ///add func to check if city valid before proceeding 
    updateRecent();

    

}

searchButton.on('click',runAll);
console.log(JSON.parse(localStorage.getItem("recentSearches")));