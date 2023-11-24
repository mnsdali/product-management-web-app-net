// Location plugin
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation);
    } else {
        $('#resultCoords').html("Geolocation is not supported by this browser.");
    }
}

function showLocation(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    $('#lat').val(latitude);
    $('#lng').val(longitude);
    $('#resultCoords').html("lat: "+latitude+", lng: "+longitude);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
        $('#resultCoords').html("User denied the request for Geolocation.");
        break;
        case error.POSITION_UNAVAILABLE:
        $('#resultCoords').html("Location information is unavailable.");
        break;
        case error.TIMEOUT:
        $('#resultCoords').html("The request to get user location timed out.");
        break;
        case error.UNKNOWN_ERROR:
        $('#resultCoords').html("An unknown error occurred.");
        break;
    }
}

