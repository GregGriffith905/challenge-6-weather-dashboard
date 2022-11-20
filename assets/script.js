var apiKey = "608e89a8abd53641f8198304f956f5a7";
var city = "toronto";

var queryWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey+"&units=metric";
var queryForecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey+"&units=metric";

function convertedUnixDate(timeStamp,timeZone){
        var localDate = new Date();
        var timeZoneCorrection = timeZone + localDate.getTimezoneOffset()*60;       
        var convertedDate = new Date((timeStamp + timeZoneCorrection)*1000);
        var displayDate = convertedDate.getMonth()+1 + '/' + convertedDate.getDate() + '/' + + convertedDate.getFullYear() + " " + convertedDate.getHours() + ':' + convertedDate.getMinutes();        
        return displayDate;        
};

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


        // // Creating elements, tablerow, tabledata, and anchor
        // var createTableRow = document.createElement('tr');
        // var tableData = document.createElement('td');
        // var link = document.createElement('a');

        // // Setting the text of link and the href of the link
        // link.textContent = data[i].html_url;
        // link.href = data[i].html_url;

        // // Appending the link to the tabledata and then appending the tabledata to the tablerow
        // // The tablerow then gets appended to the tablebody
        // tableData.appendChild(link);
        // createTableRow.appendChild(tableData);
        // tableBody.appendChild(createTableRow);
      }
    
    // console.log("Temp: " + (data.main.temp) + "C")
    // console.log("Wind: " + (data.wind.speed/10*36) + "Km/h")
    // console.log("Humidity: " + (data.main.humidity) + "%")
    })