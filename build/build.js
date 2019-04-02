(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var __assign = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};
var defaults = {
    lines: 12,
    length: 7,
    width: 5,
    radius: 10,
    scale: 1.0,
    corners: 1,
    color: '#000',
    fadeColor: 'transparent',
    animation: 'spinner-line-fade-default',
    rotate: 0,
    direction: 1,
    speed: 1,
    zIndex: 2e9,
    className: 'spinner',
    top: '50%',
    left: '50%',
    shadow: '0 0 1px transparent',
    position: 'absolute'
};
var Spinner = /** @class */function () {
    function Spinner(opts) {
        if (opts === void 0) {
            opts = {};
        }
        this.opts = __assign({}, defaults, opts);
    }
    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target by calling
     * stop() internally.
     */
    Spinner.prototype.spin = function (target) {
        this.stop();
        this.el = document.createElement('div');
        this.el.className = this.opts.className;
        this.el.setAttribute('role', 'progressbar');
        css(this.el, {
            position: this.opts.position,
            width: 0,
            zIndex: this.opts.zIndex,
            left: this.opts.left,
            top: this.opts.top,
            transform: "scale(" + this.opts.scale + ")"
        });
        if (target) {
            target.insertBefore(this.el, target.firstChild || null);
        }
        drawLines(this.el, this.opts);
        return this;
    };
    /**
     * Stops and removes the Spinner.
     * Stopped spinners may be reused by calling spin() again.
     */
    Spinner.prototype.stop = function () {
        if (this.el) {
            if (typeof requestAnimationFrame !== 'undefined') {
                cancelAnimationFrame(this.animateId);
            } else {
                clearTimeout(this.animateId);
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
            this.el = undefined;
        }
        return this;
    };
    return Spinner;
}();
exports.Spinner = Spinner;
/**
 * Sets multiple style properties at once.
 */

function css(el, props) {
    for (var prop in props) {
        el.style[prop] = props[prop];
    }
    return el;
}
/**
 * Returns the line color from the given string or array.
 */
function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length];
}
/**
 * Internal method that draws the individual lines.
 */
function drawLines(el, opts) {
    var borderRadius = Math.round(opts.corners * opts.width * 500) / 1000 + 'px';
    var shadow = 'none';
    if (opts.shadow === true) {
        shadow = '0 2px 4px #000'; // default shadow
    } else if (typeof opts.shadow === 'string') {
        shadow = opts.shadow;
    }
    var shadows = parseBoxShadow(shadow);
    for (var i = 0; i < opts.lines; i++) {
        var degrees = ~~(360 / opts.lines * i + opts.rotate);
        var backgroundLine = css(document.createElement('div'), {
            position: 'absolute',
            top: -opts.width / 2 + "px",
            width: opts.length + opts.width + 'px',
            height: opts.width + 'px',
            background: getColor(opts.fadeColor, i),
            borderRadius: borderRadius,
            transformOrigin: 'left',
            transform: "rotate(" + degrees + "deg) translateX(" + opts.radius + "px)"
        });
        var delay = i * opts.direction / opts.lines / opts.speed;
        delay -= 1 / opts.speed; // so initial animation state will include trail
        var line = css(document.createElement('div'), {
            width: '100%',
            height: '100%',
            background: getColor(opts.color, i),
            borderRadius: borderRadius,
            boxShadow: normalizeShadow(shadows, degrees),
            animation: 1 / opts.speed + "s linear " + delay + "s infinite " + opts.animation
        });
        backgroundLine.appendChild(line);
        el.appendChild(backgroundLine);
    }
}
function parseBoxShadow(boxShadow) {
    var regex = /^\s*([a-zA-Z]+\s+)?(-?\d+(\.\d+)?)([a-zA-Z]*)\s+(-?\d+(\.\d+)?)([a-zA-Z]*)(.*)$/;
    var shadows = [];
    for (var _i = 0, _a = boxShadow.split(','); _i < _a.length; _i++) {
        var shadow = _a[_i];
        var matches = shadow.match(regex);
        if (matches === null) {
            continue; // invalid syntax
        }
        var x = +matches[2];
        var y = +matches[5];
        var xUnits = matches[4];
        var yUnits = matches[7];
        if (x === 0 && !xUnits) {
            xUnits = yUnits;
        }
        if (y === 0 && !yUnits) {
            yUnits = xUnits;
        }
        if (xUnits !== yUnits) {
            continue; // units must match to use as coordinates
        }
        shadows.push({
            prefix: matches[1] || '',
            x: x,
            y: y,
            xUnits: xUnits,
            yUnits: yUnits,
            end: matches[8]
        });
    }
    return shadows;
}
/**
 * Modify box-shadow x/y offsets to counteract rotation
 */
function normalizeShadow(shadows, degrees) {
    var normalized = [];
    for (var _i = 0, shadows_1 = shadows; _i < shadows_1.length; _i++) {
        var shadow = shadows_1[_i];
        var xy = convertOffset(shadow.x, shadow.y, degrees);
        normalized.push(shadow.prefix + xy[0] + shadow.xUnits + ' ' + xy[1] + shadow.yUnits + shadow.end);
    }
    return normalized.join(', ');
}
function convertOffset(x, y, degrees) {
    var radians = degrees * Math.PI / 180;
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    return [Math.round((x * cos + y * sin) * 1000) / 1000, Math.round((-x * sin + y * cos) * 1000) / 1000];
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var CookieManager = function () {
    function CookieManager() {
        _classCallCheck(this, CookieManager);
    }

    _createClass(CookieManager, [{
        key: "setupCookie",
        value: function setupCookie(name, value, days) {
            // construct date object - will be today's date by default
            var date = new Date();
            // set time to be today plus how many days specified
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            // concatenate the expires name/value pair with expiry date converted to GMT 
            var expires = "expires=" + date.toGMTString();
            // assemble cookie
            document.cookie = name + "=" + value + ";" + expires + ";";
        }
    }, {
        key: "retrieveCookie",
        value: function retrieveCookie(name) {
            // return undefined if no cookie stored
            if (document.cookie === "") return undefined;
            // value to be returned is undefined by default
            var value = void 0;
            // put cookie name/value pairs into an array split on the ; delimiter (since there could be multiple cookies in the file)
            var cookieArray = document.cookie.split(";");
            // remove blank spaces from all elements of cookieArray
            cookieArray = cookieArray.map(function (cookie) {
                return cookie.trim();
            });
            // find cookie with name and set value
            cookieArray.forEach(function (cookie) {
                if (cookie.split("=")[0] == name) {
                    value = cookie.split("=")[1];
                }
            });
            return value;
        }
    }]);

    return CookieManager;
}();

exports.CookieManager = CookieManager;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// randomly generates a number between the range of low and high
function getRandom() {
    var low = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var high = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

    var randomNumber = void 0;
    // calculate random number
    randomNumber = Math.floor(Math.random() * (high - low)) + low;
    // return random number
    return randomNumber;
}

function addKey(functionToCall) {
    var myKeyCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 13;

    // wire up event listener
    document.addEventListener("keydown", function (e) {
        // is the key released the provided key? Check keyCode via Event object
        if (e.keyCode === myKeyCode) {
            // pressing the enter key will force some browsers to refresh
            // this command stops the event from going further
            e.preventDefault();
            // call provided callback to do everything else that needs to be done
            functionToCall();
            // this also helps the event from propagating in some browsers
            return false;
        }
    });
}

// ----------------------------------------- challenge solution
function getXMLData(retrieveScript, success, failure) {
    // send out AJAX request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("load", function (e) {
        // has the response been received successfully?
        if (xmlhttp.status == 200) {
            // data retrieved - call success method and pass along XML object response
            success(xmlhttp.responseXML);
        } else {
            failure();
        }
    });
    xmlhttp.addEventListener("error", function (e) {
        failure();
    });
    xmlhttp.open("GET", retrieveScript, true);
    xmlhttp.send();
}
// ------------------------------------------------------------

exports.getRandom = getRandom;
exports.addKey = addKey;
exports.getXMLData = getXMLData;

},{}],4:[function(require,module,exports){
"use strict";

var _spin = require("spin.js");

var _Toolkit = require("./Toolkit.js");

var _CookieManager = require("./CookieManager");

// cookieManager object
var cookieManager = null;

// xmlHttpRequest object for carrying out AJAX
var xmlObject = void 0;

// number of cities in XML
var citiesCount = 0;

var lastCity = null;
var retrieveScript = void 0;
var cities = void 0;
var option = void 0;
var listItem = void 0;
var loadingOverlay = void 0;

// weather variables
var code = void 0;
var conditions = void 0;
var sunrise = void 0;
var sunset = void 0;
var currentTemp = void 0;
var lowTemp = void 0;
var highTemp = void 0;
var humidity = void 0;
var pressure = void 0;
var windDirectionCode = void 0;
var windDirection = void 0;
var windStrength = void 0;
var windSpeed = void 0;

// construct Spinner object (spin.js) and add to loading-overlay <div> http://spin.js.org/
var spinner = new _spin.Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.getElementsByClassName("loading-overlay")[0]);

// ------------------------------------------------------- private methods
function populateMe() {
    // populate the dropdown menu
    for (var i = 0; i < citiesCount; i++) {
        // create element for dropdown
        option = document.createElement("option");
        var city = xmlObject.getElementsByTagName("name")[i].textContent;
        var province = xmlObject.getElementsByTagName("province")[i].textContent;
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
    var month = sunrise.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var day = sunrise.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var hours = sunrise.getHours();
    var minutes = sunrise.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var year = sunrise.getFullYear();
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

    // convert from m/s to km/h
    windSpeed *= 3.6;
    windSpeed = windSpeed.toFixed(1);
}

function setWeatherIconColor() {
    console.log(code);
    if (code == 800) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "yellow";
    }
    if (code > 800 && code <= 804) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "gray";
    }
    if (code.substring(0, 1) == 6) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "white";
    }
    if (code.substring(0, 1) == 2) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "darkgray";
    }
    if (code == 741) {
        console.log(code);
        document.querySelector(".info__icon").style.color = "gray";
    }
}

function displayData() {

    code = xmlObject.getElementsByTagName("weather")[0].getAttribute("number");
    setWeatherIconColor();
    document.getElementsByClassName("info__icon")[0].innerHTML = "<i class=\"wi wi-owm-" + code + "\"></i>";
    document.getElementsByClassName("info__conditions")[0].innerHTML = conditions;
    document.getElementsByClassName("info__city")[0].innerHTML = listItem;
    document.getElementsByClassName("weather__sun__rise")[0].innerHTML = "<i class=\"wi wi-sunrise\"></i>&nbsp;" + sunrise;
    document.getElementsByClassName("weather__sun__set")[0].innerHTML = "<i class=\"wi wi-sunset\"></i>&nbsp;" + sunset;
    document.getElementsByClassName("weather__temp__current")[0].innerHTML = Math.round(currentTemp) + "<i class=\"wi wi-celsius\"></i>&nbsp;&nbsp;Current";
    document.getElementsByClassName("weather__temp__low")[0].innerHTML = Math.round(lowTemp) + "<i class=\"wi wi-celsius\"></i>&nbsp;&nbsp;Low";
    document.getElementsByClassName("weather__temp__high")[0].innerHTML = Math.round(highTemp) + "<i class=\"wi wi-celsius\"></i>&nbsp;&nbsp;High";
    document.getElementsByClassName("weather__humidity__value")[0].innerHTML = humidity + " %";
    document.getElementsByClassName("weather__pressure__value")[0].innerHTML = pressure + " hPa";
    document.getElementsByClassName("weather__wind__icon")[0].innerHTML = "<i class=\"wi wi-wind towards-" + windDirectionCode + "-deg\"></i><b>&nbsp;&nbsp;Wind</b>";
    document.getElementsByClassName("weather__wind__direction")[0].innerHTML = windDirection + " wind";
    document.getElementsByClassName("weather__wind__strength")[0].innerHTML = windStrength;
    document.getElementsByClassName("weather__wind__speed")[0].innerHTML = windSpeed + " km/h speed";
}

function saveData() {

    // write last city searched to cookie so it knows where to start in the future
    cookieManager.setupCookie("lastCity", lastCity, 365);
}

// ------------------------------------------------------- event handlers
function onCityDataLoaded(result) {

    // grab the XML response
    xmlObject = result;
    console.log(xmlObject);
    loadingOverlay.style.display = "none";
    document.getElementsByClassName("info__icon")[0].style.display = "block";
    document.getElementsByClassName("info__conditions")[0].style.display = "block";
    document.getElementsByClassName("info__city")[0].style.display = "block";
    document.getElementsByClassName("credits")[0].style.display = "block";
    document.getElementsByClassName("weather")[0].style.display = "flex";
    document.querySelector(".info__icon").style.opacity = 1;
    document.querySelector(".info__conditions").style.opacity = 1;
    document.querySelector(".info__city").style.opacity = 1;
    document.querySelector(".weather").style.opacity = 1;

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
    document.querySelector(".info__icon").style.opacity = 1;
    document.querySelector(".info__conditions").style.opacity = 1;
    document.querySelector(".info__city").style.opacity = 1;
    document.querySelector(".weather").style.opacity = 1;
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
    var citySplit = listItem.split(",");
    retrieveScript = "http://api.openweathermap.org/data/2.5/weather?q=" + citySplit[0] + ",CA&mode=xml&appid=6761afb1468ce2fec9c0b3c67ee37aa2";
    document.querySelector(".info__icon").style.opacity = 0.2;
    document.querySelector(".info__conditions").style.opacity = 0.2;
    document.querySelector(".weather").style.opacity = 0.2;
    document.querySelector(".info__city").style.opacity = 0.2;
    document.querySelector(".info__icon").style.color = "blue";

    (0, _Toolkit.getXMLData)(retrieveScript, onCityDataLoaded, onCityNotFound);
}

function main() {

    // construct cookieManager
    cookieManager = new _CookieManager.CookieManager();

    document.getElementsByClassName("weather")[0].style.display = "none";
    document.getElementsByClassName("credits")[0].style.display = "none";
    document.querySelector(".info__icon").style.opacity = 0.2;
    document.querySelector(".info__conditions").style.opacity = 0.2;
    document.querySelector(".info__city").style.opacity = 0.2;
    document.querySelector(".weather").style.opacity = 0.2;

    // setup references to controls
    retrieveScript = "cities.xml";
    cities = document.getElementById("cities");
    loadingOverlay = document.getElementsByClassName("loading-overlay")[0];

    // send out AJAX request
    (0, _Toolkit.getXMLData)(retrieveScript, onLoaded, onError);
    // ----------------------------------------------------------
}

main();

},{"./CookieManager":2,"./Toolkit.js":3,"spin.js":1}]},{},[4])

//# sourceMappingURL=build.js.map
