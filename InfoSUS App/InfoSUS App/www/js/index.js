/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.intellisense.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.min.js" />

document.addEventListener('deviceready', this.onDeviceReady, false);
function onDeviceReady() {
    $(document).ready(function () {
        $("#btn12").click(function () {//SUS

        });
        $("#btn13").click(function () {//Telefones            
            $.support.cors = true;
            $.mobile.allowCrossDomainPages = true;
            var path = window.location.pathname.replace('index.html', 'File/telefonesutei.xml');
            //alert(path);               
            $.ajax(path, {
                type: "GET",
                dataType: "xml",
                isLocal: true,
                async: false,
                complete: function () {

                },
                success: function (responseXML) {
                    var answer = "";
                    $.each($(responseXML).find("EntityRow"), function (key, val) {
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
        $("#btn21").click(function () {

        });
        $("#btn22").click(function () {

        });
        $("#btn23").click(function () {

        });
        $("#btn24").click(function () {

        });
        $("#btn25").click(function () {

        });
        $("#btn26").click(function () {

        });
        $("#btn27").click(function () {

        });
    });
}
