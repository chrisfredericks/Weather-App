import { Spinner } from "spin.js";
// -------------------------------- challenge solution
import {getXMLData} from "./Toolkit.js";
// --------------------------------------------------
import $ from "jquery";

let retrieveScript;
// xmlHttpRequest object for carrying out AJAX
let xmlhttp;
let xmlObject;
// number of cities in XML
let citiesCount = 0;

// references to objects on page
let cities;
let option;
let listItem;
let loadingOverlay;

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

// ------------------------------------------------------- event handlers
function onLoaded(result) {  
    // grab the XML response
    //xmlObject = xmlhttp.responseXML;
    xmlObject = result;
    // ------------------------------------------------------------------

    if (retrieveScript == "cities.xml") {
        citiesCount = xmlObject.getElementsByTagName("city").length;
        if (citiesCount > 0) {
            populateMe();
            onChanged();
            loadingOverlay.style.display = "none";
        }         
    } else {
        loadingOverlay.style.display = "none";
        let conditions = xmlObject.getElementsByTagName("weather")[0].getAttribute("value");
        console.log(xmlObject);
        let code = xmlObject.getElementsByTagName("weather")[0].getAttribute("number");
        document.getElementsByClassName("info__icon")[0].innerHTML = `<i class="wi wi-owm-${code}"></i>`;
        document.getElementsByClassName("info__conditions")[0].innerHTML = conditions;
        document.getElementsByClassName("info__city")[0].innerHTML = listItem.textContent;
    }
}

function onError(e) {
    console.log("*** Error has occured during AJAX data retrieval");
    document.getElementsByClassName("info__icon")[0].innerHTML = "";
    document.getElementsByClassName("info__conditions")[0].innerHTML = "";
    document.getElementsByClassName("info__city")[0].innerHTML = "City not found";
}

function onChanged(e) {
    // reference to option in cities
    listItem = cities.selectedOptions[0];
    let citySplit = listItem.textContent.split(",");
    console.log(listItem.textContent);
    console.log(citySplit[0]);
    retrieveScript = `http://api.openweathermap.org/data/2.5/weather?q=${citySplit[0]},CA&mode=xml&appid=6761afb1468ce2fec9c0b3c67ee37aa2`;
    getXMLData(retrieveScript, onLoaded, onError);
}

// ------------------------------------------------------- private methods
function main() {
    // setup references to controls
    retrieveScript = "cities.xml";
    cities = document.getElementById("cities");
    loadingOverlay = document.getElementsByClassName("loading-overlay")[0];

    // send out AJAX request
    getXMLData(retrieveScript, onLoaded, onError);
    // ----------------------------------------------------------
}

main();