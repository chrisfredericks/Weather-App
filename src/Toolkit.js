// randomly generates a number between the range of low and high
function getRandom(low = 1, high = 10) {
	let randomNumber;
	// calculate random number
    randomNumber = Math.floor(Math.random() * (high - low)) + low;
	// return random number
	return randomNumber;
}

function addKey(functionToCall, myKeyCode = 13) {
    // wire up event listener
    document.addEventListener("keydown", (e) => {
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
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("load", (e) => {
        // has the response been received successfully?
        if (xmlhttp.status == 200) {
            // data retrieved - call success method and pass along XML object response
            success(xmlhttp.responseXML);
        } else {
            failure();
        }
    });
    xmlhttp.addEventListener("error", (e) => {
        failure();
    });
    xmlhttp.open("GET", retrieveScript, true);
    xmlhttp.send();
}
// ------------------------------------------------------------

export {getRandom, addKey, getXMLData};