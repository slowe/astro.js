/*
	astro.coords.js - basic coordinate transforms

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
		name: 'coords',
		version: '0.1'
	});
	
})(astrojs);