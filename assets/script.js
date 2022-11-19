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

// fetch(queryForecastURL)
//     .then(function (response) {
//     return response.json();
//     })
//     .then(function (data) {
//     console.log(data)
//     console.log(data.list[4]);  //midday forecast
//     console.log(data.list[12]);
//     console.log(data.list[20]);
//     console.log(data.list[28]);
//     console.log(data.list[36]);

//     for (var i = 0; i < data.length; i++) {
//         // Creating elements, tablerow, tabledata, and anchor
//         var createTableRow = document.createElement('tr');
//         var tableData = document.createElement('td');
//         var link = document.createElement('a');

//         // Setting the text of link and the href of the link
//         link.textContent = data[i].html_url;
//         link.href = data[i].html_url;

//         // Appending the link to the tabledata and then appending the tabledata to the tablerow
//         // The tablerow then gets appended to the tablebody
//         tableData.appendChild(link);
//         createTableRow.appendChild(tableData);
//         tableBody.appendChild(createTableRow);
//     }
//     })
    

//console.log(results);