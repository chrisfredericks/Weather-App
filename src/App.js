import { Spinner } from "spin.js";
// -------------------------------- challenge solution
import {getXMLData} from "./Toolkit.js";
// --------------------------------------------------
import $ from "jquery";

// retrieve server sided script
// let retrieveScript = "http://lessonspace.sean.nscctruro.ca/clientSideSamples/portfolioData.php";
let retrieveScript = "cities.xml";
// xmlHttpRequest object for carrying out AJAX
let xmlhttp;
let xmlObject;
// number of cities in XML
let citiesCount = 0;

// references to objects on page
let cities;
let txtName;
let txtDescription;
let lnkUrl;
// let imgSample1,imgSample2,imgSample3,imgSample4;
// let viewAll;
// let viewSelected;
let loadingOverlay;

// construct Spinner object (spin.js) and add to loading-overlay <div> http://spin.js.org/
let spinner = new Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.getElementsByClassName("loading-overlay")[0]);

// ------------------------------------------------------- private methods
function populateMe() {
    // populate the dropdown menu
    for (let i = 0; i < citiesCount; i++) {
        // create element for dropdown
        let option = document.createElement("option");
        option.text = xmlObject.getElementsByTagName("name")[i].textContent;

        // APPROACH II
        // store data for each city in the listItem option itself since javascript does not have a clean way to search the XML tree for a target id="#" attribute
        // option.id = xmlObject.getElementsByTagName("city")[i].getAttribute("id");
        option.city = option.text;
        option.province = xmlObject.getElementsByTagName("province")[i].textContent;
        option.city += (", " + option.province);
        console.log(option.city);

        // add element to cities as a new option
        cities.add(option, null);

    }

    cities.addEventListener("change", onChanged);
}

// ------------------------------------------------------- event handlers
function onLoaded(result) {  
    // ---------------------------------------------- challenge solution
    // grab the XML response
    //xmlObject = xmlhttp.responseXML;
    xmlObject = result;
    // ------------------------------------------------------------------

    citiesCount = xmlObject.getElementsByTagName("city").length;
    if (citiesCount > 0) {
        populateMe();
        onChanged();
        loadingOverlay.style.display = "none";
    }         
}

function onError(e) {
    console.log("*** Error has occured during AJAX data retrieval");
}

function onChanged(e) {
    // reference to option in cities
    let listItem = cities.selectedOptions[0];
    // updating interface
    // txtName.innerHTML = listItem.name;
    // txtDescription.innerHTML = listItem.description;
    // lnkUrl.innerHTML = listItem.url;
    // lnkUrl.href = listItem.url;
    // lnkUrl.target = "_blank";
    // imgSample1.src = "images/" + listItem.image1;
    // imgSample2.src = "images/" + listItem.image2;
    // imgSample3.src = "images/" + listItem.image3;
    // imgSample4.src = "images/" + listItem.image4;
}

// ------------------------------------------------------- private methods
function main() {
    // setup references to controls
    cities = document.getElementById("cities");
    loadingOverlay = document.getElementsByClassName("loading-overlay")[0];

    // send out AJAX request
    getXMLData(retrieveScript, onLoaded, onError);
    // ----------------------------------------------------------
}

main();