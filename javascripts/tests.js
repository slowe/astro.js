
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

astrojs.importPackages(['example','dates','ephem','cosmology','coords','example2','maths'],{me:'tester',i:8},function(e){

	console.log( 'We should have loaded now');


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

test("astro.maths.js",function(){

	equal(typeof astrojs.maths, "object", 'Does maths exist?')
	var a = astrojs.maths.randomNormal();
	console.log('randomNormal',astrojs.maths.randomNormal());
	console.log('randomNormal',astrojs.maths.randomNormal());
	console.log('randomNormal',astrojs.maths.randomNormal());
	console.log('randomNormal',astrojs.maths.randomNormal());
	console.log('randomNormal',astrojs.maths.randomNormal());
	console.log('randomNormal',astrojs.maths.randomNormal());
	equal(typeof a,"number",'randomNormal returns a number');

});

