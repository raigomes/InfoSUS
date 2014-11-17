/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.intellisense.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.min.js" />
var map = null;
var watchID = null;
var myLatitude, myLongitude;
var myCredentials = "AscljQTZ8FzCi3aUkJT7HWnRZZGQSFXBgqHMgpgUaY5knCCIGgFdIS4-bbU4uK7G";

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
            getDataFromXML("File/SUS Data.xml", "Posto de Saude");
        });
        //PMF
        $("#btn23").click(function () {
            getDataFromXML("File/SUS Data.xml", "Medico de Familia");
        });
        //Policlínicas
        $("#btn24").click(function () {
            getDataFromXML("File/SUS Data.xml", "Policlinica");
        });
        //Urgência e Emergência
        $("#btn25").click(function () {
            getDataFromXML("File/SUS Data.xml", "Urgencia e Emergencia");
        });
        //Hospitais
        $("#btn26").click(function () {
            getDataFromXML("File/SUS Data.xml", "Hospital");
        });
        //Saúde Mental
        $("#btn27").click(function () {
            getDataFromXML("File/SUS Data.xml", "Saude Mental");
        });

        $("#btn31").click(function () {//SUS
            $("#contentBody").empty();
            $("#content").find("h1").empty().append("SUS");
        });
        $("#btn32").click(function () {//Estrutura
            $("#contentBody").empty();
            $("#content").find("h1").empty().append("A Estrutura");
        });
        $("#btn33").click(function () {//Atenção Básica
            $("#contentBody").empty();
            $("#content").find("h1").empty().append("Aten&ccedil;&atilde;o B&aacute;sica");
        });
        $("#btn34").click(function () {//Média Complexidade
            $("#contentBody").empty();
            $("#content").find("h1").empty().append("M&eacute;dia Complexidade");
        });
        $("#btn35").click(function () {//Alta Complexidade
            $("#contentBody").empty();
            $("#content").find("h1").empty().append("Alta Complexidade");
        });
        $("#btn36").click(function () {//Urgência
            $("#contentBody").empty();
            $("#content").find("h1").empty().append("Urg&ecirc;ncia e Emerg&ecirc;ncia");
        });
        $("#btn37").click(function () {//Saúde Mental
            $("#contentBody").empty();
            $("#content").find("h1").empty().append("Sa&uacute;de Mental");
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
    ShowNeighborhoods();
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
    //alert("pega posicao");
    watchID = navigator.geolocation.watchPosition(onSuccess, onError);
}

//CurrentPosition SuccessCallback
function onSuccess(position) {
    myLatitude = position.coords.latitude;
    myLongitude = position.coords.longitude;
    var location = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
    var pin = new Microsoft.Maps.Pushpin(location);
    map.entities.push(pin);
    ChangeView(location, 15);
}

//CurrentPosition ErrorCallback
function onError(e) {
    alert('ERRO ao definir a posição do GPS.');
    alert('ERRO: ' + e.code + ' ' + e.message);
}

function ShowNeighborhoods() {
    map.entities.clear();
    var list = getSortedList();
    alert(myLatitude.text());
    $.each(list, function (key, val) {

    });
}

function getSortedList() {

}

////////////////////////////////////////////////////////

/*View Clinics Methods*/
function getDataFromXML(fileName, healthType) {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    var path = window.location.pathname.replace('index.html', fileName);
    $.ajax(path, {
        type: "GET",
        dataType: "xml",
        isLocal: true,
        async: false,
        success: function (responseXML) { getClinics(responseXML, healthType); },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("ERROR: " + jqXHR.status + " " + jqXHR.statusText);
        }
    });
}

function getClinics(responseXML, healthType) {
    $("#contentBody").empty();
    $.each($(responseXML).find("Entity"), function (key, val) {
        if ($(val).find("Health_Type").text() == healthType) {
            var id = $(val).find("ID").text();
            var name = $(val).find("EntityName").text().toUpperCase();
            var displayName = getDisplayName(name, $(val).find("DisplayName").text());
            var type = $(val).find("Health_Type").text();
            var address = $(val).find("AddressLine").text();
            var location = $(val).find("Location").text();
            var city = $(val).find("City").text();
            var description = $(val).find("Description").text();

            $("#contentBody").append("<div data-role='collapsible' id='clinic" + id + "'></div>");
            $("#clinic" + id).append("<h3>" + displayName + "</h3>");
            $("#clinic" + id).append("<p><b>Unidade: </b>" + name + "</p>");
            $("#clinic" + id).append("<p><b>Tipo: </b>" + type + "</p>");
            $("#clinic" + id).append("<p><b>Endere&ccedil;o: </b>" + address + "</p>");
            $("#clinic" + id).append("<p><b>Bairro: </b>" + location + "</p>");
            $("#clinic" + id).append("<p><b>Cidade: </b>" + city + "</p>");
            $("#clinic" + id).append("<p><b>Descri&ccedil;&atilde;o: </b>" + description + "</p>");

            $("#clinic" + id).append("<a href='#map' id='mapLink" + id + "'>Veja no mapa</a>");
            $("#mapLink" + id).click(function () {
                var latitude = $(val).find("Latitude").text();
                var longitude = $(val).find("Longitude").text();

                if (latitude.length == 0) {
                    var entityAddress = address + " " + location + " " + city;
                    if (map == null) {                        
                        GetMap();
                    }
                    else {
                        //alert("entrou");
                        map.setOptions({ zoom: 1 });
                        map.entities.clear();
                    }

                    callSearchService(displayName, entityAddress);
                }
                else {
                    ShowClinic(latitude, longitude, displayName, address);
                }
            });
        }
    });
    $("#content").find("h1").empty().append(healthType);
    $("#contentBody").collapsibleset('refresh');

}

function getDisplayName(name, displayName) {
    var len = 0;

    if (displayName.length == 0) {
        displayName = name;
    }

    if (displayName.length > 25) {
        var arr = displayName.split(" ");
        displayName = "";
        $.each(arr, function (key, val) {
            len += val.length;
            if (len > 25) {
                displayName += "<br>";
                len = 0;
            }
            displayName += val + " ";
        });
    }

    return displayName;
}

//Get Latlong By Address (I guess...)

function callSearchService(entityName, entityAddress) {

    Microsoft.Maps.loadModule('Microsoft.Maps.Search', {
        callback: function () {
            var searchManager = new Microsoft.Maps.Search.SearchManager(map);
            var geocodeRequest = { where: entityAddress, count: 10, callback: searchCallback, errorCallback: searchError, userData: {name: entityName, address: entityAddress} };            
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




//function callSearchService(credentials) {
//    var searchRequest = 'http://dev.virtualearth.net/REST/v1/Locations/' + query + '?output=json&jsonp=searchServiceCallback&key=' + credentials;
//    var mapscript = document.createElement('script');
//    mapscript.type = 'text/javascript';
//    mapscript.src = searchRequest;
//    document.getElementById('divMap').appendChild(mapscript)
//}

//function searchServiceCallback(result) {
//    alert("entrou");
//    var output = document.getElementById("output");
//    if (output) {
//        while (output.hasChildNodes()) {
//            output.removeChild(output.lastChild);
//        }
//    }
//    var resultsHeader = document.createElement("h5");
//    output.appendChild(resultsHeader);

//    if (result &&
//    result.resourceSets &&
//    result.resourceSets.length > 0 &&
//    result.resourceSets[0].resources &&
//    result.resourceSets[0].resources.length > 0) {
//        resultsHeader.innerHTML = "Bing Maps REST Search API  <br/>  Found location " + result.resourceSets[0].resources[0].name;
//        var bbox = result.resourceSets[0].resources[0].bbox;
//        var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bbox[0], bbox[1]), new Microsoft.Maps.Location(bbox[2], bbox[3]));
//        map.setView({ bounds: viewBoundaries });
//        var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
//        var pushpin = new Microsoft.Maps.Pushpin(location);
//        map.entities.push(pushpin);
//    }
//    else {
//        if (typeof (response) == 'undefined' || response == null) {
//            alert("Invalid credentials or no response");
//        }
//        else {
//            if (typeof (response) != 'undefined' && response && result && result.errorDetails) {
//                resultsHeader.innerHTML = "Message :" + response.errorDetails[0];
//            }
//            alert("No results for the query");

//        }
//    }
//}


function ShowClinic(latitude, longitude, name, address) {
    Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', {
        callback: function () {
            if (map == null)
                GetMap();
            else
                map.entities.clear();

            AddPushPin(latitude, longitude, name, address, 'img/sus.png');
            ChangeView(new Microsoft.Maps.Location(latitude, longitude), 15);
        }
    });
}

function AddPushPin(latitude, longitude, pinTitle, pinDescription, pinIcon) {
    var location, pin, infobox, pinLayer, infoboxLayer;

    location = new Microsoft.Maps.Location(latitude, longitude);
    //alert("entrou");
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
        //alert("-1");
    }
    //alert("saiu");
}

/*END of Clinics Methods*/

/*General Methods*/
function ChangeView(location, zoom) {
    var viewOptions = map.getOptions();
    viewOptions.zoom = zoom;
    viewOptions.center = location;
    map.setView(viewOptions);
}
/*END of General Methods*/
