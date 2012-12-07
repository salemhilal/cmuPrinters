// All of our printer utilities are in this object.
function cmuPrinters(table){
    this.table = table;
    this.printers = this._getPrinters(table);
}

// Hard-coded gps locations of all the printers.
cmuPrinters.prototype._gpsTable = {
    "prn-hou-donner-1": {latitude : 40.441838, longitude : -79.940193},
    "prn-cs-ghc3-1": {latitude : 40.443538, longitude : -79.944625},
    "prn-cs-ghc5-1": {latitude : 40.443305, longitude : -79.94456},
    "prn-cl-uc-1": {latitude: 40.443276, longitude : -79.94223},
    "prn-cl-baker-1": {latitude : 40.441319, longitude : -79.944624},
    "prn-cl-baker-2" : {latitude : 40.441256, longitude : -79.944629},
    "prn-cl-wean-c" : {latitude : 40.44272, longitude : -79.946145},
    "prn-cl-wean-1" : {latitude : 40.442730, longitude : -79.945944},
    "prn-lib-es-2" : {latitude : 40.442705, longitude : -79.945638},
    "prn-lib-es-3" : {latitude : 40.442748, longitude : -79.945587},
    "prn-lib-hl1color" : {latitude : 40.441162, longitude : -79.944029},
    "prn-lib-hl1ref-1" : {latitude : 40.441174 , longitude : -79.943932},
    "prn-lib-hl1ref-2" : {latitude : 40.441154, longitude : -79.943878},
    "prn-lib-hl1ref-3" : {latitude : 40.441152, longitude : -79.943817},
    "prn-lib-hl2-1" : {latitude : 40.441148, longitude : -79.943742},
    "prn-lib-hl3-1" : {latitude : 40.441152, longitude : -79.943659},
    "prn-lib-hl4arts-1" : {latitude : 40.441109, longitude : -79.943629},
    "prn-lib-hl4arts-2" : {latitude : 40.441101, longitude : -79.94354},
    "prn-lib-hl4music-1" : {latitude : 40.441052, longitude : -79.943492},
    "prn-cl-cyert-1" : {latitude : 40.44424, longitude : -79.943814},
    "prn-cl-ww-1" : {latitude : 40.442724, longitude : -79.94099},
    "prn-gsia-ww-1" : {latitude : 40.442716, longitude : -79.940885},
    "prn-cl-cfa-1" : {latitude : 40.44173, longitude : -79.942854},
    "prn-cl-cfa-c" : {latitude : 40.44155, longitude : -79.942999},
    "prn-hou-mudge-1" : {latitude : 40.446943, longitude : -79.942672},
    "prn-cl-more-1" : {latitude : 40.445155, longitude : -79.943375}
};

// Given semi-parsed HTML data, get the printer info.
// Specifically coded to work with CMU's printer data site.
cmuPrinters.prototype._getPrinters = function (table) {
    var printers = {};
    var oddRows  = $(table).find(".epi-rowOdd");
    var evenRows = $(table).find(".epi-rowEven");

    var that = this;

    function parseRow(i,e){
        var fields    = $(e).find("td");
        var name      = $($(fields)[0]).find("p").html();
        var lcd       = $($(fields)[2]).find("p").html();
        var status    = $($(fields)[3]).find("p").html();
        var timestamp = $($(fields)[5]).find("p").html();

        if(that._gpsTable[name]) {
            printers[name] = 
            {
                name: name,
                lcd: lcd,
                status: status,
                timestamp: timestamp,
                latitude: that._gpsTable[name].latitude,
                longitude: that._gpsTable[name].longitude,
            };
        }
    }
    
    $(oddRows).each(parseRow);
    $(evenRows).each(parseRow);
    return printers;
}

// Given n and lat & lon, return an array with the n closest printers. 
// Currently very expensive. 
cmuPrinters.prototype.getClosest = function(n, lat, lon) {
    var minDist = Infinity;
    var minP = undefined;
    var minPs = [];
    for(var i = 0; i < n; i++) {
        for(var printer in this.printers) {
            curP = this.printers[printer];
            curDist = Math.sqrt(Math.pow(Math.abs(lat - curP.latitude), 2) + Math.pow(Math.abs(lon - curP.longitude), 2));
            if(curDist <= minDist && !minPs.contains(curP)) {
                minDist = curDist;
                minP = curP;
            }
        }
        if(minP)
            minPs[i] = minP;
        else return minPs;
        minDist = 1000000.0;
        minP = undefined;
    }

    return minPs;
}

// Because right now, I'm a little lazy. 
Array.prototype.contains = function contains(arr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === value) return true;
    }
    return false;
}

// Things to be run only after the page loads.
// i.e. load the map, create listeners, etc.
$(document).ready(function(){


    $.get("http://clusters.andrew.cmu.edu/printerstats/", function(data){
        var bodyText = $(data.responseText);
        var PrinterUtil = new cmuPrinters(bodyText);

        google.maps.event.addListener(cmuMap, 'click', function(event) {
            console.log('Point.X.Y: ' + event.latLng);
            console.log(event);
            console.log(event.latLng);
            var lat = event.latLng["$a"];
            var lng = event.latLng["ab"];

            console.log(PrinterUtil.getClosest(3, lat, lng));
        });


    });

    $("#showList").live("click", function(){
        $("#locations").slideUp();
        $("#printerList").slideDown();
    });

    //Boot up the map.
    var cmuMap = new google.maps.Map(document.getElementById('cmuMap'), {
        disableDefaultUI: true,
        center: new google.maps.LatLng(40.44317485343779, -79.94323968887329),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //Resizes the map.
    resizeMap = function (){
        google.maps.event.trigger(cmuMap,'resize');
        cmuMap.setZoom( cmuMap.getZoom() );
        console.log(cmuMap.getZoom());
    }
});
