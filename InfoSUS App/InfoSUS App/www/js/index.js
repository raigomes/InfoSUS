/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.intellisense.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.js" />
/// <reference path="c:\users\t-raim\documents\visual studio 2012\projects\infosus\infosus app\infosus app\scripts\jquery-2.1.1.min.js" />

document.addEventListener('deviceready', this.onDeviceReady, false);
function onDeviceReady() {
    $(document).ready(function () {                
        $("#btn12").click(function () {//SUS
            
        });
        $("#btn13").click(function () {//Telefones            
            $("#phoneTable").find("tbody").empty().append(function () {
                $.support.cors = true;
                $.mobile.allowCrossDomainPages = true;
                var path = window.location.pathname.replace('index.html', 'telefonesuteis.json');
                alert(path);
                
                $.ajax(path, {
                    type: "GET",
                    dataType: "json",
                    isLocal: true,
                    success: function (data) {
                        var answer = "";
                        alert("entrou");
                        console.log(data);
                        data = $.parseJSON(data)
                        $.each(data, function (key, val) {
                            answer = "<td>" + val + "</td>";
                        });
                        alert(answer);
                        return "<tr>" + answer + "</tr>";
                    },
                    error: function (msg) {
                        alert("ERROR: " + msg.status + " " + msg.statusText);
                    }
                });
                //$.getJSON('telefonesuteis.json', 
                //    function (data) {
                //        var answer = "";
                //        alert("entrou");
                //        $.each(data, function (key, val) {
                //            answer = "<td>" + val + "</td>";
                //        });
                //        alert(answer);
                //        return "<tr>" + answer + "</tr>";
                //});
                //var name = "<td>Servi&ccedil;o de Atendimento M&oacute;vel de Urg&ecirc;ncia</td>";
                //var phone = "<td>192</td>";
                //var description = "<td>Atendimento de Urg&ecirc;ncias M&eacute;dicas do SAMU</td>";
                //var text = document.createElement("tr");
                //text.innerHTML = name + phone + description;

                //alert(text.innerHTML);

                //return text;
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
