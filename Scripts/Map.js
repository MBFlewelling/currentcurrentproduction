var mapInfo={}
var mapGraphics={}
var CircularJSON = window.CircularJSON


//document.getElementById("#baseMapImg").addEventListener("click", baseMapToggle)
//baseMapToggle()
require(["esri/map", "esri/dijit/LocateButton","esri/layers/ArcGISDynamicMapServiceLayer","esri/dijit/Search","dojo/domReady!"], function(Map, LocateButton,ArcGISDynamicMapServiceLayer, Search) {
    $("#submitButton").remove()
    $("#address").val("")
    var map = new Map("mapCard", {
        center: [-118, 34.5],
        zoom: 8,
        basemap: "hybrid"
    });
    console.log(localStorage['message'])
    solarInsulation = new ArcGISDynamicMapServiceLayer("http://104.210.42.117/arcgis/rest/services/CC/CC_NearUoR_Area_Solar_Insolation/MapServer");
    solarInsulation.setVisibleLayers([1])

    map.addLayer(solarInsulation)

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            //x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    function showPosition(position) {

        map.centerAndZoom([position.coords.longitude, position.coords.latitude], 19);
    }

    $("#locateImg").on("click", getLocation);
    var s = new Search({
        map: map,
        enableInfoWindow: false,
        zoomScale: 10,
        autoNavigate: false,
        enableSuggestions: false
    }, address);
    s.startup();

    map.on("load",function(){map.graphics.on("graphic-add", function () {
        $('.card').css('display', 'relative')

        mapGraphics=map.graphics.graphics[1].attributes.Match_addr


        //map.graphics = mapGraphics

        console.log(map.graphics)
    })
})
    s.on("search-results", function(result){

        map.centerAndZoom(result.results[0][0].feature.geometry, 20);

    })


    $("#map2").flip({
        trigger:'manual'
    })

    $(".flipToggle").click(function(){
        $("#map2").flip('toggle')
    })
    function storeMap(){
        mapInfo['center'] = map.extent.getCenter();
        mapInfo['zoom'] = map.getZoom();
        console.log(mapInfo)
        localStorage.mapInfo = JSON.stringify(mapInfo);
        console.log(localStorage.mapInfo)
        console.log(JSON.parse(localStorage.mapInfo)['center'])

    }
    map.on("extent-change",function(){
        storeMap()
    })
    $("baseMapImg").css("background-image", "url(/mapImg/satellite.jpg)")
    if(localStorage['message']=='hello') {
        localStorage.message = "moo"
    }else if(localStorage['message']=='moo'){
        localStorage.message ='hello'
    }
    function baseMapToggle(){
        alert("hello")
        $("#baseMapImg").css("background-image", "url(/mapImg/satellite.jpg)")
    }
    //document.getElementById("#baseMapImg").addEventListener("click", baseMapToggle)
    //baseMapToggle()
    $("document").ready(function(){
        $('#baseMapImg').click(function(){
            var imgLable = $("#baseMapLable").text();
            console.log(imgLable)
            if(imgLable.includes("Satellite")){
                $("#baseMapImg").css("background-image", 'url("mapImg/Street.jpg")')
                $("#baseMapLable").text("Streets")
                map.setBasemap("hybrid")
            }else if(imgLable.includes("Streets")){
                $("#baseMapImg").css("background-image", 'url("mapImg/Satellite.jpg")')
                $("#baseMapLable").text("Satellite")
                map.setBasemap("streets")
            }
        })
    })
    var bodyHTML = document.getElementsByTagName('body')[0];
    function disableBodyScroll() {
        console.log("lock")
        $('body').css('overflowY', 'hidden');
    }
    function enableBodyScroll() {
        bodyHTML.style.overflowY = 'auto';
    }
    $('#map2').mouseover(disableBodyScroll)
    $('.card').mouseout(enableBodyScroll)

});
