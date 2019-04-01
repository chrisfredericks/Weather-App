import { Spinner } from "spin.js";
import {getXMLData} from "./Toolkit.js";
import {CookieManager} from "./CookieManager";

// cookieManager object
let cookieManager = null;


// xmlHttpRequest object for carrying out AJAX
let xmlObject;

// number of cities in XML
let citiesCount = 0;

let lastCity = null;
let retrieveScript;
let cities;
let option;
let listItem;
let loadingOverlay;

// weather variables
let code;
let conditions;
let sunrise;
let sunset;
let currentTemp;
let lowTemp;
let highTemp;
let humidity;
let pressure;
let windDirectionCode;
let windDirection;
let windStrength;
let windSpeed;

// construct Spinner object (spin.js) and add to loading-overlay <div> http://spin.js.org/
let spinner = new Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.getElementsByClassName("loading-overlay")[0]);

// ------------------------------------------------------- private methods
function populateMe() {
    // populate the dropdown menu
    for (let i = 0; i < citiesCount; i++) {
        // create element for dropdown
        option = document.createElement("option");
        let city = xmlObject.getElementsByTagName("name")[i].textContent;
        let province = xmlObject.getElementsByTagName("province")[i].textContent;
        option.text = city + ", " + province;

        // add element to cities as a new option
        cities.add(option, null);
    }

    cities.addEventListener("change", onChanged);
}

function getWeatherData() {

    // get all the weather variables
    conditions = xmlObject.getElementsByTagName("weather")[0].getAttribute("value");
    sunrise = xmlObject.getElementsByTagName("sun")[0].getAttribute("rise");
    sunset = xmlObject.getElementsByTagName("sun")[0].getAttribute("set");
    currentTemp = xmlObject.getElementsByTagName("temperature")[0].getAttribute("value");
    lowTemp = xmlObject.getElementsByTagName("temperature")[0].getAttribute("min");
    highTemp = xmlObject.getElementsByTagName("temperature")[0].getAttribute("max");
    humidity = xmlObject.getElementsByTagName("humidity")[0].getAttribute("value");
    pressure = xmlObject.getElementsByTagName("pressure")[0].getAttribute("value");
    windDirectionCode = xmlObject.getElementsByTagName("direction")[0].getAttribute("value");
    windDirection = xmlObject.getElementsByTagName("direction")[0].getAttribute("name");
    windSpeed = xmlObject.getElementsByTagName("speed")[0].getAttribute("value");
    windStrength = xmlObject.getElementsByTagName("speed")[0].getAttribute("name");
}

function convertWeatherData() {
    
    // construct new date objects with local time
    sunrise = new Date(sunrise + "Z");
    sunset = new Date(sunset + "Z");
    
    // convert dates to display correctly
    let month = sunrise.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let day = sunrise.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    let hours = sunrise.getHours();
    let minutes = sunrise.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    let year = sunrise.getFullYear();
    sunrise = month + "/" + day + "/" + year + "  " + hours + ":" + minutes;
    month = sunset.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    day = sunset.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    hours = sunset.getHours();
    minutes = sunset.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    year = sunset.getFullYear();
    sunset = month + "/" + day + "/" + year + "  " + hours + ":" + minutes;
    
    // convert from Kelvin to Celsius
    currentTemp -= 273.15;
    lowTemp -= 273.15;
    highTemp -= 273.15;
}

function setWeatherIconColor() {
    console.log(code);
    if (code == 800) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "yellow";
    }
    if ((code > 800) && (code <= 804)){
        console.log(code);
        document.querySelector(".info__icon").style.color = "gray";
    }
    if (code.substring(0,1) == 6) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "white";
    }
    if (code.substring(0,1) == 2) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "darkgray";
    }
    if (code == 741) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "gray";
    }
    // switch (code) {
    //     case 801:
    //     document.querySelector(".info__icon").style.color = "lightgray";
    //     break;
        // case 1:
        //   day = "Monday";
        //   break;
        // case 2:
        //    day = "Tuesday";
        //   break;
        // case 3:
        //   day = "Wednesday";
        //   break;
        // case 4:
        //   day = "Thursday";
        //   break;
        // case 5:
        //   day = "Friday";
        //   break;
        // case 6:
        //   day = "Saturday";
    //   }
}

function displayData() {

    code = xmlObject.getElementsByTagName("weather")[0].getAttribute("number");
    setWeatherIconColor()
    document.getElementsByClassName("info__icon")[0].innerHTML = `<i class="wi wi-owm-${code}"></i>`;
    document.getElementsByClassName("info__conditions")[0].innerHTML = conditions;
    document.getElementsByClassName("info__city")[0].innerHTML = listItem;
    document.getElementsByClassName("weather__sun__rise")[0].innerHTML = `<i class="wi wi-sunrise"></i>&nbsp;${sunrise}`;
    document.getElementsByClassName("weather__sun__set")[0].innerHTML = `<i class="wi wi-sunset"></i>&nbsp;${sunset}`;
    document.getElementsByClassName("weather__temp__current")[0].innerHTML = `${Math.round(currentTemp)}<i class="wi wi-celsius"></i>&nbsp;&nbsp;Current`;
    document.getElementsByClassName("weather__temp__low")[0].innerHTML = `${Math.round(lowTemp)}<i class="wi wi-celsius"></i>&nbsp;&nbsp;Low`;
    document.getElementsByClassName("weather__temp__high")[0].innerHTML = `${Math.round(highTemp)}<i class="wi wi-celsius"></i>&nbsp;&nbsp;High`;
    document.getElementsByClassName("weather__humidity__value")[0].innerHTML = `${humidity} %`;
    document.getElementsByClassName("weather__pressure__value")[0].innerHTML = `${pressure} hPa`;
    document.getElementsByClassName("weather__wind__icon")[0].innerHTML = `<i class="wi wi-wind towards-${windDirectionCode}-deg"></i><b>&nbsp;&nbsp;Wind</b>`;
    document.getElementsByClassName("weather__wind__direction")[0].innerHTML = `${windDirection} wind`;
    document.getElementsByClassName("weather__wind__strength")[0].innerHTML = windStrength;
    document.getElementsByClassName("weather__wind__speed")[0].innerHTML = `${windSpeed} km/h speed`;
   
}

function saveData() {

    // write last city searched to cookie so it knows where to start in the future
    cookieManager.setupCookie("lastCity", lastCity, 365);
}

// ------------------------------------------------------- event handlers
function onCityDataLoaded(result) {

    // grab the XML response
    xmlObject = result;
    loadingOverlay.style.display = "none";
    document.getElementsByClassName("info__icon")[0].style.display = "block";
    document.getElementsByClassName("info__conditions")[0].style.display = "block";
    document.getElementsByClassName("credits")[0].style.display = "block";
    document.getElementsByClassName("weather")[0].style.display = "flex";
    document.querySelector(".main").style.opacity = 1;

    getWeatherData();
    convertWeatherData();
    displayData();
}

function onLoaded(result) {  
    // grab the XML response
    xmlObject = result;
 
    citiesCount = xmlObject.getElementsByTagName("city").length;
    if (citiesCount > 0) {
        populateMe();
        
        // retrieve last city loaded
        listItem = cookieManager.retrieveCookie("lastCity");

        // set city to last city loaded if not undefined
        if (listItem != undefined) {
            cities.value = listItem;
        }

        onChanged();
        loadingOverlay.style.display = "none";
    }
}

function onCityNotFound(e) {
    document.querySelector(".main").style.opacity = 1;
    document.getElementsByClassName("info__city")[0].innerHTML = "City not found".fontcolor("red").italics();
    document.getElementsByClassName("info__icon")[0].style.display = "none";
    document.getElementsByClassName("info__conditions")[0].style.display = "none";
    document.getElementsByClassName("weather")[0].style.display = "none";
    document.getElementsByClassName("credits")[0].style.display = "none";
}

function onError(e) {
    console.log("*** Error has occured during AJAX data retrieval");
}

function onChanged(e) {

    // reference to option in cities
    listItem = cities.selectedOptions[0];
    lastCity = listItem.textContent;
    listItem = lastCity;
    saveData();

    // split out the city from the province
    let citySplit = listItem.split(",");
    retrieveScript = `http://api.openweathermap.org/data/2.5/weather?q=${citySplit[0]},CA&mode=xml&appid=6761afb1468ce2fec9c0b3c67ee37aa2`;
    document.querySelector(".main").style.opacity = 0.2;
    document.querySelector(".info__icon").style.color = "blue";

    getXMLData(retrieveScript, onCityDataLoaded, onCityNotFound);
}

function main() {

    // construct cookieManager
    cookieManager = new CookieManager();

    document.getElementsByClassName("weather")[0].style.display = "none";
    document.getElementsByClassName("credits")[0].style.display = "none";
    document.querySelector(".main").style.opacity = 0.2;

    // setup references to controls
    retrieveScript = "cities.xml";
    cities = document.getElementById("cities");
    loadingOverlay = document.getElementsByClassName("loading-overlay")[0];

    // send out AJAX request
    getXMLData(retrieveScript, onLoaded, onError);
    // ----------------------------------------------------------
}

main();