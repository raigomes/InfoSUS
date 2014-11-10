/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.intellisense.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.min.js" />
var map = null, geoLocationProvider, myLatitude, myLongitude;

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
                    alert(responseXML);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("ERROR: " + jqXHR.status + " " + jqXHR.statusText);
                }
            });
        });
        //Unidades mais próximas
        $("#btn21").click(function () {
            Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', {
                callback: function () {
                    GetMap();
                    var pos = ShowCurrentPosition();
                    alert(myLatitude + ", " + myLongitude);
                    ShowNeighborhoods(map.getCenter());
                }
            });
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

        });
        $("#btn32").click(function () {//Estrutura

        });
        $("#btn33").click(function () {//Atenção Básica

        });
        $("#btn34").click(function () {//Policlínicas

        });
        $("#btn35").click(function () {//Urgência

        });
        $("#btn36").click(function () {//Hospitais

        });
        $("#btn37").click(function () {//Saúde Mental

        });
    });
}

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
        //alert("entrou");
        if ($(val).find("Health_Type").text() == healthType) {
            var id = $(val).find("ID").text();
            var name = $(val).find("Name").text().toUpperCase();
            var type = $(val).find("Health_Type").text();
            var address = $(val).find("Address").text();
            var location = $(val).find("Location").text();
            var city = $(val).find("City").text();

            $("#contentBody").append("<div data-role='collapsible' id='clinic" + id + "'></div>");
            $("#clinic" + id).append("<h3>" + name + "</h3>");
            $("#clinic" + id).append("<p><b>Unidade: </b>" + name + "</p>");
            $("#clinic" + id).append("<p><b>Tipo: </b>" + type + "</p>");
            $("#clinic" + id).append("<p><b>Endere&ccedil;o: </b>" + address + "</p>");
            $("#clinic" + id).append("<p><b>Bairro: </b>" + location + "</p>");
            $("#clinic" + id).append("<p><b>Cidade: </b>" + city + "</p>");

            $("#clinic" + id).append("<a href='#map' id='mapLink"+id+"'>Veja no mapa</a>");
            $("#mapLink" + id).click(function() {
                ShowClinic($(val).find("Latitude").text(), $(val).find("Longitude").text(), name, address)
            });

            //alert($("#clinic" + id).html());
        }
    });
    $("#content").find("h1").empty().append(healthType);
    $("#contentBody").collapsibleset('refresh');

}

function GetMap() {

    map = new Microsoft.Maps.Map(document.getElementById('divMap'),
    {
        credentials: "AscljQTZ8FzCi3aUkJT7HWnRZZGQSFXBgqHMgpgUaY5knCCIGgFdIS4-bbU4uK7G",
        mapTypeId: Microsoft.Maps.MapTypeId.auto,
        enableClickableLogo: false,
        enableSearchLogo: false,
        theme: new Microsoft.Maps.Themes.BingTheme()
    });

}

function ShowCurrentPosition() {
    geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(map);
    geoLocationProvider.getCurrentPosition({
        successCallback: function (position) {
            var location = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
            var pin = new Microsoft.Maps.Pushpin(location);
            map.entities.push(pin);
            myLatitude = position.coords.latitude;
            myLongitude = position.coords.longitude;
        },
        errorCallback: function (e) {
            alert('ERRO ao definir a posição do GPS.');
            alert('ERRO: ' + e.errorCode + ' ' + e.internalError);
            return null;
        }
    });
}

function ShowNeighborhoods() {
    map.entities.clear();
    var list = getSortedList();
    $.each(list, function (key, val) {

    });
}

function ShowClinic(latitude, longitude, name, address) {    
    Microsoft.Maps.loadModule('Microsoft.Maps.Themes.BingTheme', {
        callback: function () {
            if (map == null)
                GetMap();
            else
                map.entities.clear();

            AddPushPin(latitude, longitude, name, address, 'img/sus.png');
            ChangeView(location, 15);
        }
    });
}

function AddPushPin(latitude, longitude, pinTitle, pinDescription, pinIcon) {
    var location, pin, infobox, pinLayer, infoboxLayer;

    location = new Microsoft.Maps.Location(latitude, longitude);
    //alert("entrou");
    if (pinIcon != null) {
        pin = new Microsoft.Maps.Pushpin(location, { icon: pinIcon, width: 50, height: 50 });
        if (pinTitle != null) {            
            infobox = new Microsoft.Maps.Infobox(location, { title: pinTitle, description: pinDescription, visible: false, offset: new Microsoft.Maps.Point(0, 25) });
            Microsoft.Maps.Events.addHandler(pin, 'click', function (e) {
                infobox.setOptions({ visible: true });
                infobox.setLocation(e.target.getLocation());
            });
            map.entities.push(infobox);
            map.entities.push(pin);            
        }        
    }
    else {
        pin = new Microsoft.Maps.Pushpin(location);
        map.entities.push(pin);
        alert("-1");
    }        
    //alert("saiu");
}

function ChangeView(location, zoom) {
    var viewOptions = map.getOptions();
    viewOptions.zoom = zoom;
    viewOptions.center = location;
    map.setView(viewOptions);
}

function getSortedList() {

}

function ToggleGPS() {

    // Initialize the location provider

    if (!geoLocationProvider) {

        geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(map);

    }

    //Clear the GPS layer 

    gpsLayer.clear();

    //if (args.checked) {

    // Get the user’s current location
    var centerPoint; //new Microsoft.Maps.Location(-22.889115, -43.124703);
    geoLocationProvider.getCurrentPosition({

        successCallback: function (e) {
            centerPoint = e.center;
            var pin = new Microsoft.Maps.Pushpin(centerPoint, {
                icon: './img/sus.png',
                width: 25,
                height: 25,
                draggable: true,
                visible: true
                //                    anchor: new Microsoft.Maps.Point(e.latitude-1, e.longitude+1)
            });
            pinInfobox = new Microsoft.Maps.Infobox(pin.getLocation(),
            {
                title: 'My Pushpin',
                description: 'This pushpin is located at ' + centerPoint,
                visible: false,
                offset: new Microsoft.Maps.Point(0, 15)
            });

            //Pushpin Click Event.
            Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
            //Hide the infobox whem the map is moved.
            Microsoft.Maps.Events.addHandler(map, 'viewchange', hideInfobox);


            gpsLayer.push(pin);
            gpsLayer.push(pinInfobox);

        }

    });

    //alert("pass3");

    //} else {

    //    //Remove the accuracy circle and cancel any request that might be processing

    //    geoLocationProvider.removeAccuracyCircle();

    //    geoLocationProvider.cancelCurrentRequest();

    //}

}

function displayInfobox(e) {
    infobox.setOptions({ visible: true });
}

function hideInfobox(e) {
    infobox.setOptions({ visible: false });
}

function createSearchManager() {
    map.addComponent('searchManager', new Microsoft.Maps.Search.SearchManager(map));
    searchManager = map.getComponent('searchManager');
}

function LoadSearchModule() {
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', { callback: searchRequest })
}

function searchRequest() {
    createSearchManager();
    var query = document.getElementById('txtSearch').value;
    var request =
        {
            query: query,
            count: 20,
            startIndex: 0,
            bounds: map.getBounds(),
            callback: search_onSearchSuccess,
            errorCallback: search_onSearchFailure
        };
    searchManager.search(request);

}

function search_onSearchSuccess(result, userData) {
    map.entities.clear();
    var searchResults = result && result.searchResults;
    alert(searchResults.length);
    if (searchResults) {
        for (var i = 0; i < searchResults.length; i++) {
            search_createMapPin(searchResults[i]);
        }
        if (result.searchRegion && result.searchRegion.mapBounds) {
            map.setView({ bounds: result.searchRegion.mapBounds.locationRect });
        }
        else {
            alert('No results');
        }
    }
}

function search_createMapPin(result) {
    if (result) {
        var pin = new Microsoft.Maps.Pushpin(result.location, null);
        Microsoft.Maps.Events.addHandler(pin, 'click', function () {
            search_showInfoBox(result)
        });
        map.entities.push(pin);
    }
}

function search_showInfoBox(result) {
    if (currInfobox) {
        currInfobox.setOptions({ visible: true });
        map.entities.remove(currInfobox);
    }
    currInfobox = new Microsoft.Maps.Infobox(
        result.location,
        {
            title: result.name,
            description: [result.address, result.city, result.state,
              result.country, result.phone].join(' '),
            showPointer: true,
            titleAction: null,
            titleClickHandler: null
        });
    currInfobox.setOptions({ visible: true });
    map.entities.push(currInfobox);
}

function search_onSearchFailure(result, userData) {
    alert('Search  failed');
}