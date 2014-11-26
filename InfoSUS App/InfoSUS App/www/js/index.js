/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.intellisense.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.min.js" />
/// <reference path="/Scripts/BMJS/Microsoft.Maps-vsdoc.js"/>
var map = null;
var watchID = null;
var myLatitude, myLongitude;
var maxDistance = 10; //Em Kilometer
var titleLength = 12;
var myCredentials = "AscljQTZ8FzCi3aUkJT7HWnRZZGQSFXBgqHMgpgUaY5knCCIGgFdIS4-bbU4uK7G";
/*GeoCodeCalc Class*/
var GeoCodeCalc = {
    EarthRadiusInMiles: 3956.0,
    EarthRadiusInKilometers: 6367.0,
    ToRadian: function (v) { return v * (Math.PI / 180); },
    DiffRadian: function (v1, v2) {
        return GeoCodeCalc.ToRadian(v2) - GeoCodeCalc.ToRadian(v1);
    },
    CalcDistance: function (lat1, lng1, lat2, lng2, radius) {
        var cordLength = (Math.pow(Math.sin((GeoCodeCalc.DiffRadian(lat1, lat2)) / 2.0), 2.0) + Math.cos(GeoCodeCalc.ToRadian(lat1)) * Math.cos(GeoCodeCalc.ToRadian(lat2)) * Math.pow(Math.sin((GeoCodeCalc.DiffRadian(lng1, lng2)) / 2.0), 2.0));
        var centralangle = 2 * Math.atan2(Math.sqrt(cordLength), Math.sqrt(1 - cordLength));
        var distance = radius * centralangle;
        alert("Origin = " + lat1 + ", " + lng1 + "\nDestiny = " + lat2 + ", " + lng2 + "\ndistance = " + distance + " Km");
        return distance;
    }
};

document.addEventListener('deviceready', this.onDeviceReady, false);



function onDeviceReady() {
    $(document).ready(function () {
        //Telefones             
        $("#btn13").click(function () {
            $.support.cors = true;
            $.mobile.allowCrossDomainPages = true;
            var path = window.location.pathname.replace('index.html', 'File/telefonesuteis.xml');
            $.ajax(path, {
                type: "GET",
                dataType: "xml",
                isLocal: true,
                async: false,
                success: function (responseXML) {
                    var answer = "";
                    $.each($(responseXML).find("Entity"), function (key, val) {
                        answer = answer + "<tr>"
                            + "<td>" + $(val).find("Name").text() + "</td>"
                            + "<td>" + $(val).find("PhoneNumber").text() + "</td>"
                            + "<td>" + $(val).find("Description").text() + "</td></tr>";
                    });
                    $("#phoneTable").find("tbody").empty().append(answer);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("ERROR: " + jqXHR.status + " " + jqXHR.statusText);
                }
            });
        });
        //Unidades mais próximas
        $("#btn21").click(function () {
            Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', { callback: getMapCallback });
        });
        //Postos de Saúde
        $("#btn22").click(function () {
            getDataFromXML("File/SUS Data.xml", "Posto de Saude", false);
        });
        //PMF
        $("#btn23").click(function () {
            getDataFromXML("File/SUS Data.xml", "Medico de Familia", false);
        });
        //Policlínicas
        $("#btn24").click(function () {
            getDataFromXML("File/SUS Data.xml", "Policlinica", false);
        });
        //Urgência e Emergência
        $("#btn25").click(function () {
            getDataFromXML("File/SUS Data.xml", "Urgencia e Emergencia", false);
        });
        //Hospitais
        $("#btn26").click(function () {
            getDataFromXML("File/SUS Data.xml", "Hospital", false);
        });
        //Saúde Mental
        $("#btn27").click(function () {
            getDataFromXML("File/SUS Data.xml", "Saude Mental", false);
        });

        $("#btn31").click(function () {//SUS
            $("#contentBody").empty();
            $("#content").find("h1").empty().append(parseName("SUS", titleLength));
        });
        $("#btn32").click(function () {//Estrutura
            $("#contentBody").empty();
            $("#content").find("h1").empty().append(parseName("A Estrutura", titleLength));
        });
        $("#btn33").click(function () {//Atenção Básica
            $("#contentBody").empty();
            $("#content").find("h1").empty().append(parseName("Aten&ccedil;&atilde;o B&aacute;sica", titleLength));
        });
        $("#btn34").click(function () {//Média Complexidade
            $("#contentBody").empty();
            $("#content").find("h1").empty().append(parseName("M&eacute;dia Complexidade", titleLength));
        });
        $("#btn35").click(function () {//Alta Complexidade
            $("#contentBody").empty();
            $("#content").find("h1").empty().append(parseName("Alta Complexidade", titleLength));
        });
        $("#btn36").click(function () {//Urgência
            $("#contentBody").empty();
            $("#content").find("h1").empty().append(parseName("Urg&ecirc;ncia e Emerg&ecirc;ncia", titleLength));
        });
        $("#btn37").click(function () {//Saúde Mental
            $("#contentBody").empty();
            $("#content").find("h1").empty().append(parseName("Sa&uacute;de Mental", titleLength));
        });
    });
}

/*Nearest Clinics Methods*/

function getMapCallback() {
    if (map == null) {
        GetMap();
    }
    else {
        //alert("entrou");
        map.setOptions({ zoom: 1 });
        map.entities.clear();
    }
    ShowCurrentPosition();
}

function GetMap() {
    try {
        var mapOptions = {
            credentials: myCredentials,
            mapTypeId: Microsoft.Maps.MapTypeId.road
            //enableClickableLogo: false,
            //enableSearchLogo: false,
            //theme: new Microsoft.Maps.Themes.BingTheme()
        };
        map = new Microsoft.Maps.Map(document.getElementById("divMap"), mapOptions);
    }
    catch (e) {
        var md = new Windows.UI.Popups.MessageDialog(e.message);
        md.showAsync();
        alert(e.message);
    }
}

function ShowCurrentPosition() {

    /*CHANGE COMMENTS LINE WHEN DEPLOYING ON DEVICE*/
    //watchID = navigator.geolocation.watchPosition(onSuccess, onError);
    getFakePosition(-22.888460, -43.114689);
}

function getFakePosition(latitude, longitude) {
    myLatitude = latitude;
    myLongitude = longitude;
    var location = new Microsoft.Maps.Location(myLatitude, myLongitude);
    var pin = new Microsoft.Maps.Pushpin(location);
    map.entities.push(pin);
    ShowNeighborhoods();
    ChangeView(location, 15);
}

//CurrentPosition SuccessCallback
function onSuccess(position) {
    myLatitude = position.coords.latitude;
    myLongitude = position.coords.longitude;
    var location = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
    var pin = new Microsoft.Maps.Pushpin(location);
    map.entities.push(pin);
    ShowNeighborhoods();
    ChangeView(location, 15);
}

//CurrentPosition ErrorCallback
function onError(e) {
    alert('ERRO ao definir a posição do GPS.');
    alert('ERRO: ' + e.code + ' ' + e.message);
}

function ShowNeighborhoods() {
    getDataFromXML("File/SUS Data.xml", "All", true);
}

function getNeighbors(responseXML) {
    var clinics = [];
    var count = 0;
    var id, name, displayName, address, location, city, latitude, longitude;
    //get all clinics and calculate distance to user position

    $.each($(responseXML).find("Entity"), function (key, val) {
        id = $(val).find("ID").text();
        name = $(val).find("EntityName").text().toUpperCase();
        displayName = getDisplayName(name, $(val).find("DisplayName").text(), false);
        address = $(val).find("AddressLine").text();
        location = $(val).find("Location").text();
        city = $(val).find("City").text();
        latidude = $(val).find("Latitude").text();
        longitude = $(val).find("Longitude").text();
        
        var clinicData = { id: id, name: displayName, address: address, location: location, city: city, distance: 0};
        calculateDistance(latidude, longitude, clinics , clinicData);
    });

    clinics.sort(function (a, b) {
        a.distance - b.distance;
    });

    $.each(clinics, function (key, val) {
        if (val.distance < maxDistance) {
            showClinicOnMap(val, { id: id, name: displayName, address: address, location: location, city: city });
            count = count + 1;
        }
    });

    alert("Foram encontradas " + count + " unidades perto de voce! :)");
}

function calculateDistance(entityLatitude, entityLongitude, clinicArray, clinicData) {
    if (entityLatitude.length == 0) {
        alert("latitude vazia");

        Microsoft.Maps.loadModule('Microsoft.Maps.Search', {
            callback: function () {
                var searchManager = new Microsoft.Maps.Search.SearchManager(map);
                alert("1");
                var geocodeRequest = {
                    where: entityAddress,
                    count: 10,
                    callback: function () {
                        alert("2");
                        calculate(geocodeRequest, data);
                    },
                    errorCallback: searchError,
                    data: clinicData
                };
                searchManager.geocode(geocodeRequest);                
            }
        });

        sleep(400);
    }
    else {
        clinicData.distance = GeoCodeCalc.CalcDistance(myLatitude, myLongitude, entityLatitude, entityLongitude, GeoCodeCalc.EarthRadiusInKilometers);        
        clinicArray.concat(clinicData);
    }        
}

function calculate(geocodeResponse, data) {    
    var response = geocodeResponse.results[0];
    data.distance = GeoCodeCalc.CalcDistance(myLatitude, myLongitude, response.location.latidude, response.location.longitude, GeoCodeCalc.EarthRadiusInKilometers);
    clinicArray.concat(data);
    alert("3");
}

////////////////////////////////////////////////////////

/*View Clinics Methods*/
function getDataFromXML(fileName, healthType, isNeighbor) {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    var path = window.location.pathname.replace('index.html', fileName);
    $.ajax(path, {
        type: "GET",
        dataType: "xml",
        isLocal: true,
        async: false,
        success: function (responseXML) {
            var userData = { xml: responseXML, type: healthType, isNeighborhood: isNeighbor };
            updateFromXML(userData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR: " + jqXHR.status + " " + jqXHR.statusText);
        }
    });
}

function updateFromXML(userData) {
    if (userData.isNeighborhood) {
        getNeighbors(userData.xml);
    }
    else {
        getClinics(userData.xml, userData.type);
    }
}

function getClinics(responseXML, healthType) {
    $("#contentBody").empty();
    $.each($(responseXML).find("Entity"), function (key, val) {
        if ($(val).find("Health_Type").text() == healthType) {
            var id = $(val).find("ID").text();
            var name = $(val).find("EntityName").text().toUpperCase();
            var displayName = getDisplayName(name, $(val).find("DisplayName").text(), false);
            var type = $(val).find("Health_Type").text();
            var address = $(val).find("AddressLine").text();
            var location = $(val).find("Location").text();
            var city = $(val).find("City").text();
            var phoneNumber = $(val).find("PhoneNumbers").text();
            var email = $(val).find("Email").text();
            var description = $(val).find("Description").text();

            $("#contentBody").append("<div data-role='collapsible' id='clinic" + id + "'></div>");
            $("#clinic" + id).append("<h3>" + displayName + "</h3>");
            $("#clinic" + id).append("<p><b>Unidade: </b>" + name + "</p>");
            $("#clinic" + id).append("<p><b>Tipo: </b>" + type + "</p>");
            $("#clinic" + id).append("<p><b>Endere&ccedil;o: </b>" + address + "</p>");
            $("#clinic" + id).append("<p><b>Bairro: </b>" + location + "</p>");
            $("#clinic" + id).append("<p><b>Cidade: </b>" + city + "</p>");

            if (phoneNumber != "")
                $("#clinic" + id).append("<p><b>Telefone: </b>" + phoneNumber + "</p>");
            if (email != "")
                $("#clinic" + id).append("<p><b>Email: </b>" + email + "</p>");
            if (description != "")
                $("#clinic" + id).append("<p><b>Descri&ccedil;&atilde;o: </b>" + description + "</p>");

            $("#clinic" + id).append("<a href='#map' id='mapLink" + id + "'>Veja no mapa</a>");
            $("#mapLink" + id).click(function () {
                showClinicOnMap(val, { id: id, name: displayName, address: address, location: location, city: city });
            });
        }
    });

    healthType = parseName(healthType, titleLength);

    $("#content").find("h1").empty().append(healthType);
    $("#contentBody").collapsibleset('refresh');

}

function getDisplayName(name, displayName, isTitle) {
    var numCharByLine = 25;

    if (displayName.length == 0) {
        displayName = parseName(name, numCharByLine);
    }
    else {
        displayName = parseName(displayName, numCharByLine);
    }

    return displayName;
}

function showClinicOnMap(val, userData) {
    var latitude = $(val).find("Latitude").text();
    var longitude = $(val).find("Longitude").text();
    var entityAddress = userData.address + " - " + userData.location + ", " + userData.city;

    if (latitude.length == 0) {
        
        if (map == null) {
            GetMap();
        }
        else {
            map.setOptions({ zoom: 1 });
            map.entities.clear();
        }

        callSearchService(userData.name, entityAddress);
    }
    else {
        ShowClinic(latitude, longitude, userData.name, entityAddress);
    }
}

function ShowClinic(latitude, longitude, name, address) {
    var description = ""

    Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', {
        callback: function () {
            if (map == null)
                GetMap();
            else
                map.entities.clear();

            description = address + "<br><br><a href = '#' onclick = 'getDirections()'>Como chegar</a>";

            AddPushPin(latitude, longitude, name, description, 'img/sus.png');
            ChangeView(new Microsoft.Maps.Location(latitude, longitude), 15);
        }
    });
}

function getDirections() {
    //ShowCurrentPosition();
    alert("Implement directions");
}

function AddPushPin(latitude, longitude, pinTitle, pinDescription, pinIcon) {
    var location, pin, infobox, pinLayer, infoboxLayer;

    location = new Microsoft.Maps.Location(latitude, longitude);

    if (pinIcon != null) {
        pin = new Microsoft.Maps.Pushpin(location, { icon: pinIcon, width: 25, height: 25 });
        if (pinTitle != null) {
            infobox = new Microsoft.Maps.Infobox(location, { title: pinTitle, description: pinDescription, visible: false });
            Microsoft.Maps.Events.addHandler(pin, 'click', function (e) {
                if (!infobox.visible) {
                    infobox.setOptions({ visible: true });
                    infobox.setLocation(e.target.getLocation());
                    ChangeView(infobox.geolocation(), 15);
                }
                else {
                    infobox.setOptions({ visible: false });
                }
            });
            map.entities.push(infobox);
            map.entities.push(pin);
        }
    }
    else {
        pin = new Microsoft.Maps.Pushpin(location);
        map.entities.push(pin);
    }
}

//Get Latlong By Address (I guess...)

function callSearchService(entityName, entityAddress) {
    alert(entityName + " " + entityAddress);

    Microsoft.Maps.loadModule('Microsoft.Maps.Search', {
        callback: function () {
            var searchManager = new Microsoft.Maps.Search.SearchManager(map);
            var geocodeRequest = { where: entityAddress, count: 5, callback: searchCallback, errorCallback: searchError, userData: { name: entityName, address: entityAddress } };
            searchManager.geocode(geocodeRequest);
        }
    });
}

function searchCallback(geocodeResponse, userData) {
    var response = geocodeResponse.results[0];
    ShowClinic(response.location.latitude, response.location.longitude, userData.name, userData.address);
}

function searchError(geocodeRequest) {
    alert("An error occurred.");
}


/*END of Clinics Methods*/

/*General Methods*/
function ChangeView(location, zoom) {
    var viewOptions = map.getOptions();
    viewOptions.zoom = zoom;
    viewOptions.center = location;
    map.setView(viewOptions);
}

function parseName(displayName, countChar) {
    var len = 0;

    if (displayName.length > countChar) {
        var arr = displayName.split(" ");
        displayName = "";
        $.each(arr, function (key, val) {
            len += val.length + 1;
            if (len > countChar && displayName != "") {
                displayName += "<br>";
                len = 0;
            }
            displayName += val + " ";
        });
    }

    return displayName;
}

function sleep(ms) {
    var dt = new Date();
    dt.setTime(dt.getTime() + ms);
    while (new Date().getTime() < dt.getTime());
}

/*END of General Methods*/
