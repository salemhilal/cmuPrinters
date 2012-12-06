/*
 * This module handles creating the object-hash of printers for use by other modules. It holds the GPS
 * coordinates of the printers as well as info specific to the chosen map/image.
 *
 * Also, the other modules (such as ClosestPrinter) may make use of the latitude and longitude conversion functions. 
 *
*/
var PrinterUtil = (function () {
	var exports = {};
	
		//The object-hash relating printer names to their latitude and longitude
		GPSTable = 
		{
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

	/*
	 * This is basically that function you wrote to put the printer data into an object earlier.
	 * You need to pass it in the same table as you did before (with the printer data), and the only
	 * differences now are the 2 new properties each printer gets assigned (latitude, longitude)
	 *
	 * Also different is that printers will only get added if they are found in the GPSTable above (since we omitted some)
	 *
	 * The object-hash of printers is returned
	*/
	exports.getPrinters = function (table) {
        var printers = {};
        var oddRows  = $(table).find(".epi-rowOdd");
        var evenRows = $(table).find(".epi-rowEven");

        function parseRow(i,e){
            var fields    = $(e).find("td");
            var name      = $($(fields)[0]).find("p").html();
            var lcd       = $($(fields)[2]).find("p").html();
            var status    = $($(fields)[3]).find("p").html();
            var timestamp = $($(fields)[5]).find("p").html();

			if(GPSTable[name]) {
				printers[name] = 
				{
					name: name,
					lcd: lcd,
					status: status,
					timestamp: timestamp,
					latitude: GPSTable[name].latitude,
					longitude: GPSTable[name].longitude,
				};
			}
        }
        
        $(oddRows).each(parseRow);
        $(evenRows).each(parseRow);
        return printers;
    }
	
	return exports;
})();