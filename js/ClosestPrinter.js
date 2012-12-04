/*
 * This module handels finding the closest n printers to a given location.  This location can
 * be from clicking some point on the map or from using a GPS enabled device.
 *
 * To use this module, you need to call it like a function with two params:
 * 		1: Printers = the object holding all printer objects, id'd by name (accessed via getPrinters(table) from PrinterUtil)
 *      2: PrintUtil = the PrinterUtil object that you should have created before this
 * 
 *
 * Here is an example of getting this module:
 *		var PU = PrinterUtil();
 *      var bodyText = *jQuery stuff that gets their printer info*;
 *      var printers = PU.getPrinters(bodyText);
 *      var CP = ClosestPrinter(printers, PU);
 * 
*/
var ClosestPrinter = function (Printers, PrintUtil) {
    var that = this;

	/*
	 * getClosestPrintersByClick(n, lat, long) will return the n closest printers to the latitude and longitude from the map.
	 * These n printers will be returned in an array sorted from closest to furthest.
	 *
	 * If n is greater than the number of printers, then minP will eventually exit the inner loop as undefined and
	 * the function should return the array (containing every printer by this point)
	 *
	 * Possible TODO:
	 *		-May only want to add printers to the array if their status is good (your call/handling on this one)
	*/
	this.getClosestPrinterByGPS = function (numToGet, gpsLat, gpsLong) {
		for(var i = 0; i < numToGet; i++) {
			for(var printer in Printers) {
				curP = Printers[printer];
				curDist = Math.sqrt(Math.pow(Math.abs(gpsLat - curP.latitude), 2) + Math.pow(Math.abs(gpsLong - curP.longitude), 2));
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
	
	return that;
}



	
	



