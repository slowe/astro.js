
$(document).ready(function() {

	$('#bench').html('<button>Run bench tests</button> <select><option value="1000">1000</option><option value="5000">5000</option><option value="10000">10000</option><option value="20000" selected>20000</option><option value="50000">50000</option><option value="100000">100000</option></select> times<br /><div class="benchtests"></div>');
	$('#bench button').bind("click",function(e){
		runBenchTests();
	});

});

function runBenchTests(){
	var jd;
	var i;
	var start;
	var results = [];
	var s = 'July 24, 2012 17:28:00 +00:00'
	var d = new Date(s);
	var n = $('#bench select option:selected').val();


	// Build new array of random dates
	var times = [];
	var dates = [];
	var dates2 = [];
	var dates3 = [];
	var strns = [];
	var l = [];
	var b = [];
	var l2 = [];
	var b2 = [];
	var ra = [];
	var dec = [];
	var ra2 = [];
	var dec2 = [];
	function randomDate(date1, date2) {
		var minD = new Date(date1);
		var maxD = new Date(date2);
		return new Date(Math.random(minD.getTime(), maxD.getTime()));
	}
	for(i = 0; i < n ; i++){
		start = randomDate('1999-06-08 16:34:52',s);
		times.push(start.getTime());
		dates.push(start);
		strns.push(start.toLocaleString());
		dates2.push(randomDate('1999-06-08 16:34:52',s));
		dates3.push(randomDate('1999-06-08 16:34:52',s));
		l.push(Math.random(-180,180));
		b.push(Math.random(-90,90));
		l2.push(Math.random(-180,180));
		b2.push(Math.random(-90,90));
		ra.push(Math.random(0,360));
		dec.push(Math.random(-90,90));
		ra2.push(Math.random(0,360));
		dec2.push(Math.random(-90,90));
	}


	// getJulianDate
	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getJulianDate(dates[i]);
	results.push(['astrojs.dates.getJulianDate(Date())',n,(new Date() - start)])

	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getJulianDate(times[i]);
	results.push(['astrojs.dates.getJulianDate(n)',n,(new Date() - start)])

	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getJulianDate(strns[i]);
	results.push(['astrojs.dates.getJulianDate(datestring)',n,(new Date() - start)])


	// getLST
	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getLST(dates[i],-2.3);
	results.push(['astrojs.dates.getLST(Date(),-2.3)',n,(new Date() - start)])

	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getLST(times[i],-2.3);
	results.push(['astrojs.dates.getLST(n,-2.3)',n,(new Date() - start)])

	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getLST(strns[i],-2.3);
	results.push(['astrojs.dates.getLST(datestring,-2.3)',n,(new Date() - start)]);


	// getGST
	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getGST(dates[i]);
	results.push(['astrojs.dates.getGST(Date())',n,(new Date() - start)]);

	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getGST(times[i]);
	results.push(['astrojs.dates.getGST(n)',n,(new Date() - start)]);

	start = new Date();
	for(i = 0 ; i < n ; i++) jd = astrojs.dates.getGST(strns[i]);
	results.push(['astrojs.dates.getGST(datestring)',n,(new Date() - start)]);


	// eq2gal
	start = new Date();
	for(i = 0 ; i < n ; i++) coord = astrojs.coords.eq2gal(ra[i],dec[i]);
	results.push(['astrojs.coords.eq2gal(ra,dec)',n,(new Date() - start)]);

	start = new Date();
	for(i = 0 ; i < n ; i++) coord = astrojs.coords.eq2gal(ra2[i],dec2[i],"B1950");
	results.push(['astrojs.coords.eq2gal(ra,dec,"B1950")',n,(new Date() - start)]);


	// equatorial2galactic
	start = new Date();
	for(i = 0 ; i < n ; i++) coord = astrojs.coords.equatorial2galactic(ra[i],dec[i]);
	results.push(['astrojs.coords.equatorial2galactic(ra,dec)',n,(new Date() - start)]);

	start = new Date();
	for(i = 0 ; i < n ; i++) coord = astrojs.coords.equatorial2galactic(ra2[i],dec2[i],"B1950");
	results.push(['astrojs.coords.equatorial2galactic(ra,dec,"B1950")',n,(new Date() - start)]);



	// gal2eq
	start = new Date();
	for(i = 0 ; i < n ; i++) coord = astrojs.coords.gal2eq(l[i],l[i]);
	results.push(['astrojs.coords.gal2eq(ra,dec)',n,(new Date() - start)]);

	start = new Date();
	for(i = 0 ; i < n ; i++) coord = astrojs.coords.gal2eq(l2[i],l2[i],"B1950");
	results.push(['astrojs.coords.gal2eq(ra,dec,"B1950")',n,(new Date() - start)]);


	// galactic2equatorial
	start = new Date();
	for(i = 0 ; i < n ; i++) coord = astrojs.coords.galactic2equatorial(l[i],b[i]);
	results.push(['astrojs.coords.galactic2equatorial(l,b)',n,(new Date() - start)]);

	start = new Date();
	for(i = 0 ; i < n ; i++) coord = astrojs.coords.galactic2equatorial(l2[i],b2[i],"B1950");
	results.push(['astrojs.coords.galactic2equatorial(l,b,"B1950")',n,(new Date() - start)]);



	var table = "<table><tr><th>Test</th><th>Repeats (n)</th><th>Total time (ms)</th></tr>";
	for(i = 0; i < results.length; i++){
	
		table += "<tr><td>"+results[i][0]+"</td><td class=\"v\">"+results[i][1]+"</td><td class=\"v\">"+results[i][2]+"</td></tr>";
	}
	table += "</table>";
	
	$('#bench .benchtests').html('<h3 id="bench-header">astrojs - bench tests</h3>'+table);
};
function almost_equal(actual,expected,precision,message){
	if(typeof actual!=="number" || typeof expected!=="number"){
		ok(false,"One or both of the inputs aren't numbers");
		return;
	}
	if(typeof precision==="string"){
		message = precision;
		precision = 9;	// default
	}
	var f = Math.pow(10,precision)
	var residual = (Math.round((actual-expected)*f)/f);
	equal(residual,0,'Residual: '+message+' expect '+expected.toFixed(precision+1)+' actual '+actual.toFixed(precision+1)+' diff '+(actual-expected).toFixed(precision+1));
}
// Precision = accuracy in arcseconds
function almost_equal_degrees(actual,expected,precision,message){
	if(typeof actual!=="number" || typeof expected!=="number"){
		ok(false,"One or both of the inputs aren't numbers");
		return;
	}
	if(typeof precision==="string"){
		message = precision;
		precision = 1;	// default
	}
//	var f = Math.pow(10,precision+1)
//	var residual = (Math.round((actual-expected)*f)/f);
	ok(Math.abs((actual-expected)*3600) < precision,message+' difference '+((actual-expected)*3600).toFixed(2)+'″');
	//equal(parseFloat(actual.toFixed(precision)),parseFloat(expected.toFixed(precision)),'Residual: '+message+' difference '+((actual-expected)*3600).toFixed(2)+' arcseconds');
}

astrojs.importPackages(['example','dates','ephem','cosmology','coordinates','coords','example2','lookup','math'],{me:'tester',i:8},function(e){

	console.log( 'We should have loaded now');


	var edata = {test:1234};
	astrojs.lookup.find("M31",edata,function(e){
	
		test("astro.lookup.js results",function(){
			equal(e.data, edata, 'The event data get passed through')
			equal(typeof e.result, "object", 'Do results exist?')
			equal(e.result.target.name, "M31", 'Found M31')
			almost_equal(e.result.ra.decimal, 10.6847083, 4, 'Has an RA')
		
		});
	});
	


	// Will print "tester" to the console
	console.log(e.data.me)
	
	// Will print 8 to the console
	console.log(e.data.i)

	// Will print out the value of the speed of light in m/s
	console.log(astrojs.constants.c.toString())

	// Return the Julian Date for now
	var jd = astrojs.dates.getJulianDate();
	console.log(jd);

	// Return the Julian Date for March 21st 2012 (GMT)
	jd = astrojs.dates.getJulianDate(new Date('March 21, 2012 00:00:00 +00:00'));	
	console.log(jd);

	// Access example's public function
	console.log(astrojs.example.hello());
	
	// ... and see the public variable;
	console.log(astrojs.example.pi);

});

test("astro.js",function(){
	equal(typeof astrojs, "object", 'Does astrojs exist?');
	equal(typeof astrojs.version, "string", 'Does the version number exist?');
	equal(astrojs.astrojs.toload, 0, 'We should have no packages left to load');
	var p = { init: function(){}, dependencies: [], name: 'madeupexample', version: '0.0.1' }
	ok(astrojs.registerPackage(p), 'Register a package that doesn\'t exist');
	ok(!astrojs.registerPackage(p), 'Don\'t register a package that already exists');
	var p2 = { init: function(){}, dependencies: [], name: 'ready', version: '0.0.1' }
	ok(!astrojs.registerPackage(p2), 'Don\'t register a package with the name of a built-in function');
	var p3 = { init: function(){}, dependencies: [], name: 'astrojs', version: '0.0.1' }
	ok(!astrojs.registerPackage(p3), 'Don\'t register a package that would over-write the astrojs internal object');
	equal(typeof astrojs.multipleA, "object", 'Does astro.multipleA (in astro.example2.js) exist?');
	equal(typeof astrojs.multipleB, "object", 'Does astro.multipleB (in astro.example2.js) exist?');

});

test("astro.constants.js",function(){

	equal(typeof astrojs.constants, "object", 'Do constants exist?');
	equal(astrojs.constants.c.value, 2.99792458e8, 'Speed of light');

});

test("astro.coordinates.js",function(){

	equal(typeof astrojs.coordinates, "object", 'Does coordinates exist?')

	// Sirius
	var l = 227.228206;
	var b = -8.887735;
	var ra = 101.288541;
	var dec = -16.713143;


	var a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11;
	
	a1 = astrojs.coordinates.Angle(13343,{ unit: "DEGREE" });
	equal( a1.degrees, 23, 'Check that Angle (13343) is returned as 23');

	a2 = astrojs.coordinates.Angle(-50, { unit: "DEGREE" });
	equal( a2.degrees, -50, 'Check that Angle (-50 degrees) is returned as -50');


	a3 = astrojs.coordinates.Angle(-361, { unit: "DEGREE" })
	equal( a3.degrees, -1, 'Check that Angle (-361 degrees) is returned as -1');
	
	// custom bounds
	
	a4 = astrojs.coordinates.Angle(66, { unit: "DEGREE", bounds: [-45,45] });
	equal( a4.error, "RangeError", 'Check that Angle (66 degrees in bounds -45 to 45) is returned with "RangeError"');
	// RangeError
	
	a5 = astrojs.coordinates.Angle(390, { unit: "DEGREE", bounds: [-75,75] })
	equal( a5.degrees, 30, 'Check that Angle (390 degrees in bounds -75 to 75) is returned as 30');
	// 30, no RangeError because while 390>75, 30 is within the bounds
	
	a6 = astrojs.coordinates.Angle(390, { unit: "DEGREE", bounds: [-720,720] })
	equal( a6.degrees, 390, 'Check that Angle (390 degrees in bounds -720 to 720) is returned as 390');
	// 390
	
	a7 = astrojs.coordinates.Angle(1020, { unit: "DEGREE", bounds: null })
	equal( a7.degrees, 1020, 'Check that Angle (1020 degrees in null bounds) is returned as 1020');
	
	//a8 = a5 + a6;
	//console.log(a8)
	//equal( a8, undefined, 'the bounds don\'t match');

	var ra,dec,dec2,l,b;
	ra = astrojs.coordinates.RA("4:08:15.162342");
	equal( ra.error, undefined, 'undefined - hours or degrees?');
	
	ra = astrojs.coordinates.RA("26:34:65.345634");
	almost_equal( ra.degrees, 26.58482, 4, 'unambiguous degree input to RA()');

	ra = astrojs.coordinates.RA("4:08:15.162342", { unit: "HOUR" });
	almost_equal( ra.degrees, 62.06318, 4, 'Units can be specified');


	// Where RA values are commonly found in hours or degrees, declination is nearly always
	// specified in degrees, so this is the default.
	dec = astrojs.coordinates.Dec("-41:08:15.162342");
	almost_equal( dec.degrees, -41.13755, 4, 'Declination defined');
	dec2 = astrojs.coordinates.Dec("-41:08:15.162342", { unit: "DEGREE" }) // same as above
	equal( dec.degrees, dec2.degrees, 'Declination the same when defined with units');


	var c = astrojs.coordinates.ICRSCoordinate(ra, dec) //ra and dec are RA and Dec objects, or Angle objects
	equal( c.constructor.name, "ICRSCoordinate", 'ICRSCoordinate type');
	equal( c.ra.constructor.name, "RA", 'ICRS contains RA');
	equal( c.dec.constructor.name, "Dec", 'ICRS contains Dec');

	c = astrojs.coordinates.ICRSCoordinate("54.12412 deg", "-41:08:15.162342");
	almost_equal( c.dec.degrees, -41.13755, 4, 'ICRS Declination matches');


	c = astrojs.coordinates.ICRSCoordinate('4 23 43.43  +23 45 12.324');
	equal( c.errors.length, 1, 'ICRS uses single, ambiguous string input with no units specified');

	c = astrojs.coordinates.ICRSCoordinate('4 23 43.43  +23 45 12.324', { unit: ["HOUR"] });
	almost_equal( c.dec.degrees, 23.75342, 4, 'ICRS takes single string input with only first unit specified');

	c = astrojs.coordinates.ICRSCoordinate('4 23 43.43  +23 45 12.324', { unit: ["DEGREE","DEGREE"] });
	almost_equal( c.dec.degrees, 23.75342, 4, 'ICRS takes single string input with both units specified');

	l = 280.4652;
	b = -32.8884;
	ra = 80.8941708;
	dec = -69.7561111;
	
	var ra_b1950 = 15.*(5.+(24./60));
	var dec_b1950 = -(69.+(48./60));

	// Other types of coordinate systems have their own classes
	c = astrojs.coordinates.GalacticCoordinates(l, b) // this only accepts Angles, *not* RA and Dec objects

	equal( c.l.degrees, l, 'Check that GalacticCoordinates longitude (degrees) is the same as input');
	equal( c.b.degrees, b, 'Check that GalacticCoordinates latitude (degrees) is the same as input');


	c = astrojs.coordinates.Coordinate({ra: ra, dec:dec });
	console.log(c)
	equal( c.constructor.name, "ICRSCoordinate", 'Coordinate with Ra/Dec returns ICRSCoordinate type');

/*
	var coord = astrojs.coordinates.RA(101.288541);
	equal( coord.degrees, ra, 'Check that RA (degrees) is the same as input');
	equal( coord.hours, ra/15, 'Check that RA (hours) is the same as input');

	var coord = astrojs.coordinates.RA(101.288541);
	equal( coord.degrees, ra, 'Check that RA (degrees) is the same as input');
	equal( coord.hours, ra/15, 'Check that RA (hours) is the same as input');
	
	var gal = astrojs.coordinates.GalacticCoordinate(l,b);

console.log('Here',gal,gal.toString());	
	almost_equal_degrees( coord.ra, ra, 1,'Right Ascenscion of Sirius');
	almost_equal_degrees( coord.dec, dec, 1, 'Declination of Sirius');

	var coord = astrojs.coords.equatorial2galactic(ra,dec);

	almost_equal_degrees( coord.l, l,'Galactic longitude of LMC (equatorial2galactic)');
	almost_equal_degrees( coord.b, b, 'Galactic latitude of LMC (equatorial2galactic)');

	var coord = astrojs.coords.equatorial2galactic(ra_b1950,dec_b1950,"1950");

	almost_equal_degrees( coord.l, l,'Galactic longitude of LMC (equatorial2galactic B1950)');
	almost_equal_degrees( coord.b, b, 'Galactic latitude of LMC (equatorial2galactic B1950)');

	var coord = astrojs.coords.galactic2equatorial(l,b);

	almost_equal_degrees( coord.ra, ra,'RA of LMC (galactic2equatorial)');
	almost_equal_degrees( coord.dec, dec, 'Dec of LMC (galactic2equatorial)');

	var coord = astrojs.coords.galactic2equatorial(l,b,"1950");

	almost_equal_degrees( coord.ra, ra_b1950,'RA of LMC (galactic2equatorial B1950)');
	almost_equal_degrees( coord.dec, dec_b1950, 'Dec of LMC (galactic2equatorial B1950)');

	var coord = astrojs.coords.eq2gal(ra,dec);

	almost_equal_degrees( coord.l, l,'Galactic longitude of LMC (eq2gal)');
	almost_equal_degrees( coord.b, b, 'Galactic latitude of LMC (eq2gal)');

	var coord = astrojs.coords.eq2gal(ra_b1950,dec_b1950,"1950");

	almost_equal_degrees( coord.l, l,'Galactic longitude of LMC (eq2gal B1950)');
	almost_equal_degrees( coord.b, b, 'Galactic latitude of LMC (eq2gal B1950)');

	var coord = astrojs.coords.gal2eq(l,b);

	almost_equal_degrees( coord.ra, ra,'RA of LMC (gal2eq)');
	almost_equal_degrees( coord.dec, dec, 'Dec of LMC (gal2eq)');

	var coord = astrojs.coords.gal2eq(l,b,"1950");

	almost_equal_degrees( coord.ra, ra_b1950,'RA of LMC (gal2eq B1950)');
	almost_equal_degrees( coord.dec, dec_b1950, 'Dec of LMC (gal2eq B1950)');

*/
});

test("astro.coords.js",function(){

	equal(typeof astrojs.coords, "object", 'Does coords exist?')

	// Sirius
	var l = 227.228206;
	var b = -8.887735;
	var ra = 101.288541;
	var dec = -16.713143;
	var coord = astrojs.coords.gal2eq(l,b);

	almost_equal_degrees( coord.ra, ra, 1,'Right Ascenscion of Sirius');
	almost_equal_degrees( coord.dec, dec, 1, 'Declination of Sirius');

	l = 280.4652;
	b = -32.8884;
	ra = 80.8941708;
	dec = -69.7561111;
	
	var ra_b1950 = 15.*(5.+(24./60));
	var dec_b1950 = -(69.+(48./60));
	var coord = astrojs.coords.equatorial2galactic(ra,dec);

	almost_equal_degrees( coord.l, l,'Galactic longitude of LMC (equatorial2galactic)');
	almost_equal_degrees( coord.b, b, 'Galactic latitude of LMC (equatorial2galactic)');

	var coord = astrojs.coords.equatorial2galactic(ra_b1950,dec_b1950,"1950");

	almost_equal_degrees( coord.l, l,'Galactic longitude of LMC (equatorial2galactic B1950)');
	almost_equal_degrees( coord.b, b, 'Galactic latitude of LMC (equatorial2galactic B1950)');

	var coord = astrojs.coords.galactic2equatorial(l,b);

	almost_equal_degrees( coord.ra, ra,'RA of LMC (galactic2equatorial)');
	almost_equal_degrees( coord.dec, dec, 'Dec of LMC (galactic2equatorial)');

	var coord = astrojs.coords.galactic2equatorial(l,b,"1950");

	almost_equal_degrees( coord.ra, ra_b1950,'RA of LMC (galactic2equatorial B1950)');
	almost_equal_degrees( coord.dec, dec_b1950, 'Dec of LMC (galactic2equatorial B1950)');

	var coord = astrojs.coords.eq2gal(ra,dec);

	almost_equal_degrees( coord.l, l,'Galactic longitude of LMC (eq2gal)');
	almost_equal_degrees( coord.b, b, 'Galactic latitude of LMC (eq2gal)');

	var coord = astrojs.coords.eq2gal(ra_b1950,dec_b1950,"1950");

	almost_equal_degrees( coord.l, l,'Galactic longitude of LMC (eq2gal B1950)');
	almost_equal_degrees( coord.b, b, 'Galactic latitude of LMC (eq2gal B1950)');

	var coord = astrojs.coords.gal2eq(l,b);

	almost_equal_degrees( coord.ra, ra,'RA of LMC (gal2eq)');
	almost_equal_degrees( coord.dec, dec, 'Dec of LMC (gal2eq)');

	var coord = astrojs.coords.gal2eq(l,b,"1950");

	almost_equal_degrees( coord.ra, ra_b1950,'RA of LMC (gal2eq B1950)');
	almost_equal_degrees( coord.dec, dec_b1950, 'Dec of LMC (gal2eq B1950)');


});

test("astro.cosmology.js",function(){

	equal(typeof astrojs.cosmology, "object", 'Does cosmology exist?');

	var cosmos = astrojs.cosmology.cosmos(70);

	equal(cosmos.H0, 70, 'The value of H0 has been correctly set');

});

test("astro.dates.js",function(){
	equal(typeof astrojs.dates, "object", 'Date functions')
	almost_equal(astrojs.dates.getJulianDate('December 25, 1990 19:30:00 +00:00'), 2448251.3125, 'Using a correctly formatted date string')
	almost_equal(astrojs.dates.getJulianDate(new Date('December 25, 1990 19:30:00 +00:00')), 2448251.3125, 'Using a Javascript Date() object')
	almost_equal(astrojs.dates.getJulianDate(new Date('April 1, 1993 GMT')), 2449078.5, 'Using a Javascript Date() just with month, day year and timezone')
	almost_equal(astrojs.dates.getJulianDate(new Date(1342018666659)), 2456120.12345670, 7,'Using a Javascript Date() object set with milliseconds')
	var d = new Date('March 21, 2012 00:00:00 +00:00');
	//console.log(astrojs.dates.getGST(d,0))	// London
	var d = new Date('July 24, 2012 17:28:00 +00:00');
	//console.log(astrojs.dates.getLST(d,0))	// London
	//console.log(astrojs.dates.getLST(d,-119.71))	// Santa Barbara
});

test("astro.ephem.js",function(){

	equal(typeof astrojs.ephem, "object", 'Does ephem exist?')

	var jd = astrojs.dates.getJulianDate(new Date('March 21, 2012 00:00:00 +00:00'));

	var sun = astrojs.ephem.sunPos(jd);
	var moon = astrojs.ephem.moonPos(jd);

	equal( sun.D, 811, 'Number of days since the epoch of 2010 January 0.0')
	almost_equal_degrees( sun.lat, 0, 'Latitude of the Sun at JD '+jd)
	almost_equal_degrees( sun.lon, 0.773015859742884, 'Longitude of the Sun at JD '+jd)

	almost_equal_degrees( moon.lat, 5.133315869279202, 'Latitude of the Moon at JD '+jd)
	almost_equal_degrees( moon.lon, 342.5192613195672, 'Longitude of the Moon at JD '+jd)

	var d = new Date('July 22, 2009 03:57:12 +00:00');
	d = d.getTime()+762;
	var jd = astrojs.dates.getJulianDate(d);
	var sun = astrojs.ephem.sunPos(jd);
	var moon = astrojs.ephem.moonPos(jd);

	almost_equal_degrees( sun.lat, 0, 'Latitude of the Sun at JD '+jd)
	almost_equal_degrees( sun.lon, 119.487194396, 'Longitude of the Sun at JD '+jd)

});

test("astro.math.js",function(){

	equal(typeof astrojs.math, "object", 'Does math exist?')
	var a = astrojs.math.randomNormal();
	console.log('randomNormal',astrojs.math.randomNormal());
	console.log('randomNormal',astrojs.math.randomNormal());
	console.log('randomNormal',astrojs.math.randomNormal());
	console.log('randomNormal',astrojs.math.randomNormal());
	console.log('randomNormal',astrojs.math.randomNormal());
	console.log('randomNormal',astrojs.math.randomNormal());
	equal(typeof a,"number",'randomNormal returns a number');

});

