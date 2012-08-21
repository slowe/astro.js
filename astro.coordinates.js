/*
	astro.coordinates.js - coordinates and transforms transforms

*/
(function () {

	// Define any dependencies that are required for this package to run
	var dependencies = ['dates'];
	
	// Create the main function
	function init(astrojs) {
	
		this.d2r = Math.PI/180;
		this.r2d = 180/Math.PI;	// degrees to radians
		var d2r = this.d2r;
		var r2d = this.r2d;
		var twopi = 2*Math.PI;
		var _obj = this;
		

		function deg2dms(a,bounds){
			var d = parseFloat(a);

			var sign = (d < 0) ? -1 : 1;
			a = Math.abs(d);
			var deg = Math.floor(a);
			var min = Math.floor((a-deg)*60);
			var sec = (a-deg-min/60)*3600;
			var second = (sec < 10) ? "0"+sec : ""+sec;
			if(second.length > 5) second = second.substring(0,5);
			return { degrees: d, dms: [sign*deg, min, sec], string: ((sign < 0) ? "-" : "+")+((deg < 10) ? "0"+deg : deg)+':'+((min < 10) ? "0"+min : min)+':'+second };
		}

		function deg2hms(a,bounds){
			var d = parseFloat(a);

			a = d/15.0;
			var hrs = Math.floor(a);
			var min = Math.floor((a-hrs)*60);
			var sec = Math.round(100*(a-hrs-min/60)*3600)/100;
			if(sec < 0.000001) sec = 0;
			return { degrees: d, hms: [hrs, min, sec], string: ((hrs < 10) ? "0"+hrs : hrs)+':'+((min < 10) ? "0"+min : min)+':'+((sec < 10) ? "0"+sec : ""+sec) };
		}

		function dms2deg(inp,bounds){
			if(typeof inp==="number" || (!inp.indexOf(':') > 0 && !inp.indexOf(' ') > 0)) return deg2dms(inp,bounds);
			var bits = (inp.indexOf(':') > 0) ? inp.split(':') : ((inp.indexOf(' ') > 0) ? inp.split(' ') : [inp,"0","0"]);
			var deg = parseFloat(bits[0]);
			var sign = (deg < 0) ? -1 : 1;
			deg = Math.abs(deg)
			var min = parseFloat(bits[1]);
			var sec = parseFloat(bits[2]);
			if(sec < 0.000001) sec = 0;
			var t = sign*(deg + min/60 + sec/3600);
			return { degrees: t, dms: [deg, min, sec], string: inp };
		}

		function hms2deg(inp,bounds){
			if(typeof inp==="number" || (!inp.indexOf(':') > 0 && !inp.indexOf(' ') > 0)) return deg2hms(inp,bounds);
			var bits = (inp.indexOf(':') > 0) ? inp.split(':') : ((inp.indexOf(' ') > 0) ? inp.split(' ') : [inp,"0","0"]);
			var hrs = parseFloat(bits[0]);
			var min = parseFloat(bits[1]);
			var sec = parseFloat(bits[2]);
			var t = (hrs + min/60 + sec/3600);
			return { degrees: t*15, hms: [hrs, min, sec], string: inp };
		}

		/*
			The "angle" is a fundamental object. Units *must* be specified
			rather than a default value be assumed. This is as much for 
			self-documenting code as anything else.
			
			Angle objects simply represent a single angular coordinate. More specific
			angular coordinates (e.g. RA, Dec) are subclasses of Angle.
		*/
		function Angle(inp,opts){

			this.radians = 0;

			// Allow Angle() instances to be added together with '+'. The result is the sum in radians.
			this.valueOf = function(){ return this.radians; }

			if(!inp) return this;

			
			var a;

			if(typeof opts==="undefined") opts = { unit: "", bounds: [-360,360] };
			if(typeof opts.bounds!=="object") opts.bounds = [-360,360];
			
			this.bounds = opts.bounds;


			// Look for the unit in the string
			if(opts.unit=="" && typeof inp==="string"){
				var i = inp.indexOf(' deg');
				if(i > 0){
					inp = inp.substr(0,i);
					opts.unit = "DEGREE";
				}
				var i = inp.indexOf('°');
				if(i > 0){
					inp = inp.substr(0,i);
					opts.unit = "DEGREE";
				}
			}

			this.original = { value: inp, unit: opts.unit, bounds: opts.bounds };

			if(opts.unit == "HOUR") a = hms2deg(inp,opts.bounds);
			else if(opts.unit == "DEGREE") a = dms2deg(inp,opts.bounds);
			else this.errors = ["Invalid unit type "+opts.unit];

			if(a){

				if(opts.unit == "DEGREE"){
					if(opts.bounds){
						var v = a.degrees % 360;
						if((typeof opts.bounds[0]==="number" && v <= opts.bounds[0]) || (typeof opts.bounds[1]==="number" && v >= opts.bounds[1])){
							this.error = 'RangeError';
							return this;
						}
						if((typeof opts.bounds[0]==="number" && a.degrees <= opts.bounds[0]) || (typeof opts.bounds[1]==="number" && a.degrees >= opts.bounds[1])) a.degrees = v;
					}
				}


				this.degrees = a.degrees;
				this.radians = a.degrees*d2r;
				if(opts.unit == "HOUR") this.hours = a.degrees/15;
				this.processed = a;
				if(opts.unit == "HOUR") this.hms = a.hms;
				else if(opts.unit == "DEGREE") this.dms = a.dms;
			}

			return this;
		}
		this.Angle = function(c,opts){ return new Angle(c,opts); }


		// Extend Angle() to an RA() class
		function RA(c,opts){
			if((!opts || (opts && typeof opts.unit!=="string")) && parseInt(c) >= 24) opts = { unit: "DEGREE" };
			Angle.call(this,c,opts);
			this.hours = this.degrees/15;
		}
		RA.prototype = new Angle();
		// correct the constructor pointer because it points to Angle
		RA.prototype.constructor = RA;
		this.RA = function(c,opts){ return new RA(c,opts); }
		RA.prototype.to_string = function(opt){
			if(!opt) return this.string;
			if(typeof opt.unit==="string"){
				var sep = (typeof opt.sep==="string") ? opt.sep : ":";
				var prec = (typeof opt.precision==="number") ? opt.precision : 2;
				var zero = (typeof opt.zeropadding==="boolean") ? opt.zeropadding : false;
				var a = deg2hms(this.degrees);

				var h = (zero && a.hms[0] < 10) ? "0"+a.hms[0] : a.hms[0];
				var m = (zero && a.hms[1] < 10) ? "0"+a.hms[1] : a.hms[1];
				var s = (zero && a.hms[2] < 10) ? "0"+a.hms[2].toFixed(prec) : a.hms[2].toFixed(prec);

				if(opt.unit=="HOUR") return h + sep + m + sep + s;
				else if(opt.unit=="DEGREE") return this.degrees.toFixed(prec);
			}
			return this.string;
		}
		
		// Extend Angle() to a Dec() class
		function Dec(c,opts){
			if(!opts) opts = { unit: "DEGREE" };
			if(opts && typeof opts.unit!=="string") opts.unit = "DEGREE";
			Angle.call(this,c,opts);
		}
		Dec.prototype = new Angle();
		// correct the constructor pointer because it points to Angle
		Dec.prototype.constructor = Dec;
		this.Dec = function(c,opts){ return new Dec(c,opts); }
		Dec.prototype.to_string = function(opt){
			if(!opt) return this.string;
			if(typeof opt.unit==="string"){
				var sep = (typeof opt.sep==="string") ? opt.sep : ":";
				var prec = (typeof opt.precision==="number") ? opt.precision : 2;
				var zero = (typeof opt.zeropadding==="boolean") ? opt.zeropadding : false;
				var d = (zero && Math.abs(this.dms[0]) < 10) ? "0"+Math.abs(this.dms[0]) : Math.abs(this.dms[0]);
				var m = (zero && this.dms[1] < 10) ? "0"+this.dms[1] : this.dms[1];
				var s = (zero && this.dms[2] < 10) ? "0"+this.dms[2].toFixed(prec) : this.dms[2].toFixed(prec);
				if(opt.unit=="DEGREE") return (this.degrees < 0 ? "-" : "+") + d + sep + m + sep + s;
			}
			return this.string;
		}


		function ICRSCoordinate(ra,dec,opts){

			if(typeof ra==="string" && typeof dec==="object" && dec.unit){
				opts = dec;
				dec = null;
			}

			var units = parseUnits(opts,["","DEGREE"]);

			this.ra = ra;
			this.dec = dec;

			if(typeof ra==="string" && typeof dec!=="string" && ra.indexOf('  ') > 0){
				// Input: a single string containing RA and Dec separated by a double space
				var p = ra.split('  ');

				if(p.length == 2){
					this.ra = new RA(p[0],{ unit: units[0]});
					this.dec = new Dec(p[1],{ unit: units[1]});
				}
			} // Otherwise we'll assume ra and dec are values that can be parsed

			if(!(this.ra instanceof RA)) this.ra = new RA(this.ra,{unit:units[0]});
			if(!(this.dec instanceof Dec)) this.dec = new Dec(this.dec,{unit:units[1]});

			this.errors = [];
			if(this.ra.errors) this.errors.push(this.ra.errors);
			if(this.dec.errors) this.errors.push(this.dec.errors);
			
			return this;
		}
		ICRSCoordinate.prototype.galactic = function(){
			var g = _obj.eq2gal(this.ra.degrees,this.dec.degrees);
			return new GalacticCoordinate(g.l,g.b,'DEGREE');
		}
		ICRSCoordinate.prototype.equatorial = function(){
			return this;
		}
		function GalacticCoordinate(l,b,opts){
			var units = parseUnits(opts,["DEGREE","DEGREE"]);

			this.l = new Angle(l,{unit:units[0]});
			this.b = new Angle(b,{unit:units[1]});
			return this;
		}
		GalacticCoordinate.prototype.galactic = function(){
			return this;
		}
		GalacticCoordinate.prototype.equatorial = function(){
			var e = _obj.gal2eq(this.l.degrees,this.b.degrees);
			console.log(e)
			return new ICRSCoordinate(e.ra,e.dec,'DEGREE');
		}
		function parseUnits(u,backup){
			if(!backup) backup = ["","DEGREE"];
			return (u && u.unit) ? ((typeof u.unit==="string") ? [u.unit,u.unit] : (u.unit.length >= 2 ? [u.unit[0],u.unit[1]] : [u.unit[0],"DEGREE"])) : backup;
		}
		function Coordinate(inp){
			if(typeof inp!=="object") return -1;
			var units = parseUnits(inp,["",""]); 

			//c = Coordinate(a1=139.686111, a2=4.875278, unit=u.DEGREE, system=GALACTIC)
			if(inp.a1 && inp.a2 && typeof inp.system==="string"){
				if(inp.system=="GALACTIC"){
					inp.l = inp.a1;
					inp.b = inp.a2;
				}else if(inp.sytem=="EQUATORIAL"){
					inp.ra = inp.a1;
					inp.dec = inp.a2;
				}
			}

			if(inp.ra && inp.dec){
				if(units=="") units = ["HOUR","DEGREE"];
				return new ICRSCoordinate(inp.ra, inp.dec, { unit:units });
			}
			if(inp.l && inp.b){
				if(units=="") units = ["DEGREE","DEGREE"];
				return new GalacticCoordinate(inp.l, inp.b, { unit:units });
			}

		}
		this.ICRSCoordinate = function(ra,dec){ return new ICRSCoordinate(ra,dec); }
		this.GalacticCoordinates = function(l,b,opts){
			if((typeof l==="number" || typeof l==="string") && (typeof b==="number" || typeof b==="string")) return new GalacticCoordinate(l,b,opts);
			return { message: "Error: only accepts Angles as numbers or strings" };
		}
		this.Coordinate = function(inp){ return Coordinate(inp); }

		
		// Input is Julian Date
		// Uses method defined in Practical Astronomy (4th ed) by Peter Duffet-Smith and Jonathan Zwart
		this.meanObliquity = function(JD){
			var T,T2,T3;
			if(!JD) return { status: -1 };
			T = (JD-2451545.0)/36525;	// centuries since 2451545.0 (2000 January 1.5)
			T2 = T*T;
			T3 = T2*T;
			return 23.4392917 - 0.0130041667*T - 0.00000016667*T2 + 0.0000005027778*T3;
		}
		
		// Take input in decimal degrees, decimal Sidereal Time and decimal latitude
		// Uses method defined in Practical Astronomy (4th ed) by Peter Duffet-Smith and Jonathan Zwart
		this.ecliptic2azel = function(l,b,LST,lat){
			var sl,cl,sb,cb,v,e,se,Cprime,s,cST,sST,B,r,sphi,cphi,A,w,theta,psi;
			if(!LST || !lat) return { status: -1 };
			l *= d2r;
			b *= d2r;
			sl = Math.sin(l);
			cl = Math.cos(l);
			sb = Math.sin(b);
			cb = Math.cos(b);
			v = [cl*cb,sl*cb,sb];
			e = this.meanObliquity();
			e *= d2r;
			ce = Math.cos(e);
			se = Math.sin(e);
			Cprime = [[1.0,0.0,0.0],[0.0,ce,-se],[0.0,se,ce]];
			s = this.vectorMultiply(Cprime,v);
			ST = LST*15*d2r;
			cST = Math.cos(ST);
			sST = Math.sin(ST);
			B = [[cST,sST,0],[sST,-cST,0],[0,0,1]];
			r = this.vectorMultiply(B,s);
			lat *= d2r;
			sphi = Math.sin(lat);
			cphi = Math.cos(lat);
			A = [[-sphi,0,cphi],[0,-1,0],[cphi,0,sphi]];
			w = this.vectorMultiply(A,r);
			theta = Math.atan2(w[1],w[0]);
			psi = Math.asin(w[2]);
			return {az:theta/d2r,el:psi/d2r}
		}

/*
		// compute horizon coordinates from utc, ra, dec
		// ra, dec, lat, lon in decimal degrees
		// utc is a Date object
		// results returned in hrz_altitude, hrz_azimuth
		this.radec2azel = function(ra, dec, lat, lon, UTC, LST){
			// compute hour angle in degrees
			if(typeof LST==="undefined") LST = astrojs.dates.getLST(UTC,lon);
			var ha = LST*15 - ra;
			if (ha < 0) ha += 360;
			// convert degrees to radians
			ha *= this.d2r;
			dec *= this.d2r;
			// Fudge to fix divide by zero error at poles
			// Convert to radians
			lat = ((Math.abs(lat) == 90.0) ? (lat-0.00001) : lat)*this.d2r;
			// compute altitude in radians
			var alt = Math.asin(Math.sin(dec)*Math.sin(lat) + Math.cos(dec)*Math.cos(lat)*Math.cos(ha));
			// compute azimuth in radians
			// divide by zero error at poles or if alt = 90 deg
			var az  = Math.acos((Math.sin(dec) - Math.sin(alt)*Math.sin(lat))/(Math.cos(alt)*Math.cos(lat)));
			// convert radians to degrees
			var hrz_altitude = alt/this.d2r;
			var hrz_azimuth  = az/this.d2r;
			// choose hemisphere
			if (Math.sin(ha) > 0) hrz_azimuth = 360 - hrz_azimuth;
			return {alt: hrz_altitude, az: hrz_azimuth};
		}*/
		

		// Take input in decimal degrees
		this.ecliptic2radec = function(l,b,JD){
			var e,sl,cl,sb,cb,tb,se,ce,ra,dec;
			e = this.meanObliquity(JD);
			l *= d2r;
			b *= d2r;
			e *= d2r;
			sl = Math.sin(l);
			cl = Math.cos(l);
			sb = Math.sin(b);
			cb = Math.cos(b);
			tb = Math.tan(b);
			se = Math.sin(e);
			ce = Math.cos(e);
			ra = Math.atan2((sl*ce - tb*se),(cl));
			dec = Math.asin(sb*ce+cb*se*sl);
			return { ra:ra/d2r, dec:dec/d2r };
		}

		// Input is a two element position (degrees)
		// Output is a two element position (degrees)
		function Transform(p, rot){
			p[0] *= d2r;
			p[1] *= d2r;
			var cp1 = Math.cos(p[1]);
			var m = [Math.cos(p[0])*cp1, Math.sin(p[0])*cp1, Math.sin(p[1])];
			var s = [m[0]*rot[0] + m[1]*rot[1] + m[2]*rot[2], m[0]*rot[3] + m[1]*rot[4] + m[2]*rot[5], m[0]*rot[6] + m[1]*rot[7] + m[2]*rot[8] ];
			var r = Math.sqrt(s[0]*s[0] + s[1]*s[1] + s[2]*s[2]); 
			var b = Math.asin(s[2]/r); // Declination in range -90 -> +90
			var cb = Math.cos(b);
			var a = Math.atan2(((s[1]/r)/cb),((s[0]/r)/cb));
			if (a < 0) a += twopi;
			return [a*r2d,b*r2d];
		}

		this.fk42fk5 = function(ra,dec){
			// Convert from B1950 -> J2000
			pos = Transform ([ra,dec], [0.9999256782, -0.0111820611, -0.0048579477, 0.0111820610,  0.9999374784, -0.0000271765, 0.0048579479, -0.0000271474,  0.9999881997])
			return {ra:(pos[0]), dec:(pos[1])};
		}

		this.fk52fk4 = function(ra,dec){
			// Convert J2000->B1950
			pos = Transform([ra,dec], [0.9999256795,  0.0111814828,  0.0048590039, -0.0111814828,  0.9999374849, -0.0000271771, -0.0048590040, -0.0000271557,  0.9999881946]);
			return {ra:(pos[0]), dec:(pos[1])};
		}

		this.gal2eq = function(l,b,epoch){
		 	// Convert Galactic -> J2000
		 	// Using celestial values
			//var pos = Transform([l,b], [-0.054875539396, 0.494109453628, -0.867666135683, -0.873437104728, -0.444829594298, -0.198076389613, -0.48383499177, 0.7469822487, 0.455983794521]);

			// Using SLALIB values
			if(epoch == "1950" || epoch == "B1950" || epoch == "FK4") var pos = Transform([l,b], [-0.066988739415, 0.492728466075, -0.867600811151, -0.872755765852, -0.450346958020, -0.188374601723, -0.483538914632, 0.744584633283, 0.460199784784])
			else var pos = Transform([l,b], [-0.054875539726, 0.494109453312, -0.867666135858, -0.873437108010, -0.444829589425, -0.198076386122, -0.483834985808, 0.746982251810, 0.455983795705]);

		 	return {ra:(pos[0]), dec:(pos[1])};
		}

		this.eq2gal = function(ra,dec,epoch){
			var pos = [ra,dec]
			// Convert from B1950 -> J2000
			if(epoch == "1950" || epoch == "B1950" || epoch == "FK4") pos = Transform (pos, [0.9999256782, -0.0111820611, -0.0048579477, 0.0111820610,  0.9999374784, -0.0000271765, 0.0048579479, -0.0000271474,  0.9999881997])

			// Spherical Astronomy by Green, equation 14.55, page 355
		 	// Convert J2000 -> Galactic
		 	pos = Transform(pos, [-0.054876, -0.873437, -0.483835, 0.494109, -0.444830,  0.746982, -0.867666, -0.198076,  0.455984]);
			return {l:pos[0], b:pos[1]};
		}

		// Coordinate based functions
		// Convert Ra/Dec (1950 or 2000) to Galactic coordinates
		this.equatorial2galactic = function(ra, dec, epoch){
			var OB = 23.4333334*d2r;
			dec *= d2r;
			ra *= d2r;

			var a = (epoch && (epoch == "1950" || epoch == "B1950" || epoch == "FK4")) ? 27.4 : 27.128251;	// The RA of the North Galactic Pole
			var d = (epoch && (epoch == "1950" || epoch == "B1950" || epoch == "FK4")) ? 192.25 : 192.859481;	// The declination of the North Galactic Pole
			var l = (epoch && (epoch == "1950" || epoch == "B1950" || epoch == "FK4")) ? 33.0 : 32.931918;	// The ascending node of the Galactic plane on the equator
			var sdec = Math.sin(dec);
			var cdec = Math.cos(dec);
			var sa = Math.sin(a*d2r);
			var ca = Math.cos(a*d2r)
		
			var GT = Math.asin(cdec*ca*Math.cos(ra-d*d2r)+sdec*sa);
			var GL = Math.atan((sdec-Math.sin(GT)*sa)/(cdec*Math.sin(ra- d*d2r)*ca))/d2r;
			var TP = sdec-Math.sin(GT)*sa;
			var BT = cdec*Math.sin(ra-d*d2r)*ca;
			if(BT<0) GL=GL+180;
			else {
				if (TP<0) GL=GL+360;
			}
			GL = GL + l;
			if (GL>360) GL = GL - 360;
		
			var LG=Math.floor(GL);
			var LM=Math.floor((GL - Math.floor(GL)) * 60);
			var LS=((GL -Math.floor(GL)) * 60 - LM) * 60;
			var GT=GT/d2r;
		
			var D = Math.abs(GT);
			if (GT > 0) var BG=Math.floor(D);
			else var BG=(-1)*Math.floor(D);
			var BM=Math.floor((D - Math.floor(D)) * 60);
			var BS = ((D - Math.floor(D)) * 60 - BM) * 60;
			if (GT<0) {
				BM=-BM;
				BS=-BS;
			}

			return { l: GL, b: GT };
		}

		this.galactic2equatorial = function(l, b, epoch){

			// NGP = 12h51m26.282s +27°07′42.01″ (J2000) http://adsabs.harvard.edu/abs/2004ApJ...616..872R (Appendix A)
			var fk4 = (epoch && (epoch == "1950" || epoch == "B1950" || epoch == "FK4")) ? true : false;
			var NGP_a = (fk4) ? 27.4 : 27.1283361;	// The RA of the North Galactic Pole
			var NGP_d = (fk4) ? 192.25 : 192.859481;	// The declination of the North Galactic Pole
			var AN_l = (fk4) ? 33.0 : 32.9319;	// The ascending node of the Galactic plane on the equator

			l *= d2r;
			b *= d2r;
		
			var LAL_LGAL = AN_l*d2r;
			var LAL_ALPHAGAL = NGP_d*d2r;
			var LAL_DELTAGAL = NGP_a*d2r;
		
			var sDGal = Math.sin(LAL_DELTAGAL);
			var cDGal = Math.cos(LAL_DELTAGAL);
			l = l-LAL_LGAL;
		
			var sB = Math.sin(b);
			var cB = Math.cos(b);
			var sL = Math.sin(l);
			var cL = Math.cos(l);
		
			/* Compute components. */
			var sinD = cB*cDGal*sL + sB*sDGal;
			var sinA = cB*cL;
			var cosA = sB*cDGal - cB*sL*sDGal;
		
			/* Compute final results. */
			var delta = Math.asin(sinD)*r2d;
			var alpha = (Math.atan2( sinA, cosA ))*r2d + NGP_d;
		
			alpha = alpha%360.0;

			return {ra:alpha,dec:delta};
		}


		// Returns [x, y (,elevation)]
		this.ecliptic2xy = function(l,b,wide,tall,LST,fullsky){
			var pos;
			if(typeof fullsky!=="boolean") fullsky = false;
			if(typeof LST=="undefined")  return { status: -1 };
			if(fullsky){
				pos = this.ecliptic2radec(l,b);
				return this.radec2xy(pos.ra,pos.dec);
			}else{
				pos = this.ecliptic2azel(l,b,LST);
				var el = pos.el;
				pos = this.azel2xy(pos.az-this.az_off,pos.el,wide,tall);
				pos.el = el;
				return pos;
			}
			return 0;
		}
		// Returns [x, y (,elevation)]
		this.radec2xy = function(ra,dec,wide,tall,projection,az_off){
			var x,y;
			if(typeof az_off!=="number") az_off = 0;
			if(projection == "mollweide"){
				var thetap = Math.abs(dec)*d2r;
				var dtheta;
				var pisindec = Math.PI*Math.sin(Math.abs(dec)*d2r);
				// Now iterate to correct answer
				for(var i = 0; i < 20 ; i++){
					dtheta = -(thetap + Math.sin(thetap) - pisindec)/(1+Math.cos(thetap));
					thetap += dtheta;
					if(dtheta < 1e-4) break;
				}
				var normra = (ra+az_off)%360 - 180;
				var outside = false;
				x = -(2/Math.PI)*(normra*d2r)*Math.cos(thetap/2)*tall/2 + wide/2;
				if(x > wide) outside = true;
				var sign = (dec >= 0) ? 1 : -1;
				y = -sign*Math.sin(thetap/2)*tall/2 + tall/2;
				var coords = this.coord2horizon(ra, dec);
				return {x:(outside ? -100 : x%wide),y:y,el:coords[0]};
			}else if(projection == "planechart"){
				var normra = (ra+az_off)%360-180;
				x = -(normra/360)*tall*2 + wide/2;
				y = -(dec/180)*tall+ tall/2;
				if(x > wide) outside = true;
				var coords = this.coord2horizon(ra, dec);
				return {x:(outside ? -100 : x%wide),y:y,el:coords[0]};
			}else{
				var coords = this.coord2horizon(ra, dec);
				// Only return coordinates above the horizon
				if(coords[0] > 0){
					pos = this.azel2xy(coords[1]-az_off,coords[0],wide,tall);
					return {x:pos.x,y:pos.y,az:coords[1],el:coords[0]};
				}
			}
			return 0;
		}

		return this;
	}

	// Register the package with the core
	astrojs.registerPackage({
		init: init,
		dependencies: dependencies,
		name: 'coordinates',
		version: '0.1'
	});
	
})(astrojs);