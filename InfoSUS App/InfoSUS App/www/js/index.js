/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.intellisense.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.min.js" />
var map = null, watchID = null, geoLocationProvider, myLatitude, myLongitude;

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
        alert("entrou");
        map.setOptions({ zoom: 1 });
        map.entities.clear();
    }
    ShowCurrentPosition();
    ShowNeighborhoods(map.getCenter());
}

function GetMap() {
    try {
        var mapOptions = {
            credentials: "AscljQTZ8FzCi3aUkJT7HWnRZZGQSFXBgqHMgpgUaY5knCCIGgFdIS4-bbU4uK7G",
            mapTypeId: Microsoft.Maps.MapTypeId.auto,
            enableClickableLogo: false,
            enableSearchLogo: false,
            theme: new Microsoft.Maps.Themes.BingTheme()
        };
        map = new Microsoft.Maps.Map(document.getElementById("divMap"), mapOptions);
    }
    catch (e) {
        var md = new Windows.UI.Popups.MessageDialog(e.message);
        md.showAsync();
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
    ChangeView(location, 10);
}

//CurrentPosition ErrorCallback
function onError(e) {
    alert('ERRO ao definir a posição do GPS.');
    alert('ERRO: ' + e.code + ' ' + e.message);
}

function ShowNeighborhoods() {
    map.entities.clear();
    var list = getSortedList();
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
        //alert("entrou");
        if ($(val).find("Health_Type").text() == healthType) {
            var id = $(val).find("ID").text();
            var name = $(val).find("Name").text().toUpperCase();
//            var displayName = getDisplayName(name);
            var type = $(val).find("Health_Type").text();
            var address = $(val).find("Address").text();
            var location = $(val).find("Location").text();
            var city = $(val).find("City").text();
            var description = $(val).find("Description").text();

            $("#contentBody").append("<div data-role='collapsible' id='clinic" + id + "'></div>");
            $("#clinic" + id).append("<h3>" + name + "</h3>");
            $("#clinic" + id).append("<p><b>Unidade: </b>" + name + "</p>");
            $("#clinic" + id).append("<p><b>Tipo: </b>" + type + "</p>");
            $("#clinic" + id).append("<p><b>Endere&ccedil;o: </b>" + address + "</p>");
            $("#clinic" + id).append("<p><b>Bairro: </b>" + location + "</p>");
            $("#clinic" + id).append("<p><b>Cidade: </b>" + city + "</p>");
            $("#clinic" + id).append("<p><b>Descri&ccedil;&atilde;o: </b>" + description + "</p>");

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

function getDisplayName(name) {
    if (name.length) {
        var words = name.split(" ");
    }
}

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

/*END of Clinics Methods*/

/*General Methods*/
function ChangeView(location, zoom) {
    var viewOptions = map.getOptions();
    viewOptions.zoom = zoom;
    viewOptions.center = location;
    map.setView(viewOptions);
}
/*END of General Methods*/
