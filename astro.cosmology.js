/*
	astro.cosmology.js - a start at porting astro.cosmology.py

*/
(function () {

	// Define any dependencies that are required for this package to run
	var dependencies = [];
	

	// An instance of a cosmology
	// Adapted from Ned Wright's Cosmology Calculator
	// 25 Jul 1999 Copyright Edward L. Wright, all rights reserved.
	// Adapted/modernized by Stuart Lowe @ dotAstronomy 2012, Heidelberg
	function Cosmos(inp){
		this.n = 1000;	// number of points in integrals
		this.nda = 1;	// number of digits in angular size distance
		this.H0 = 71;	// Hubble constant
		this.WM = 0.27;	// Omega(matter)
		this.WV = 0.73;	// Omega(vacuum) or lambda
		this.WR = 0;	// Omega(radiation)
		this.WK = 0;	// Omega curvaturve = 1-Omega(total)
		this.z = 3.0;	// redshift of the object
		this.h = 0.71	// H0/100
		this.c = 299792.458; // velocity of light in km/sec
		this.Tyr = 977.8; // coefficent for converting 1/H into Gyr
		this.DTT = 0.5;	// time from z to now in units of 1/H0
		this.DTT_Gyr = 0.0;	// value of DTT in Gyr
		this.age = 0.5;	// age of Universe in units of 1/H0
		this.age_Gyr = 0.0;	// value of age in Gyr
		this.zage = 0.1;	// age of Universe at redshift z in units of 1/H0
		this.zage_Gyr = 0.0;	// value of zage in Gyr
		this.DCMR = 0.0;	// comoving radial distance in units of c/H0
		this.DCMR_Mpc = 0.0;
		this.DCMR_Gyr = 0.0;
		this.DA = 0.0;	// angular size distance
		this.DA_Mpc = 0.0;
		this.DA_Gyr = 0.0;
		this.kpc_DA = 0.0;
		this.DL = 0.0;	// luminosity distance
		this.DL_Mpc = 0.0;
		this.DL_Gyr = 0.0;	// DL in units of billions of light years
		this.V_Gpc = 0.0;
		this.a = 1.0;	// 1/(1+z), the scale factor of the Universe
		this.az = 0.5;	// 1/(1+z(object));
		
		return this;
	}
	
	// entry point for the input form to pass values back to this script
	Cosmos.prototype.setValues = function(H0,WM,WV,z) {
		if(typeof H0==="number") this.H0 = H0;
		this.h = this.H0/100;
		if(typeof WM==="number") this.WM = WM;
		if(typeof WV==="number") this.WV = WV;
		if(typeof z==="number") this.z = z;
		this.WR = 4.165E-5/(this.h*this.h);	// includes 3 massless neutrino species, T0 = 2.72528
		this.WK = 1-this.WM-this.WR-this.WV;
		
		return this;
	}

	// Ways to access the variables with more obvious names
	Cosmos.prototype.age_at_z = function(unit){
		if(unit="Gyr") return this.zage_Gyr;
		return this.zage;
	}
	Cosmos.prototype.time_from_z = function(unit){
		if(unit="Gyr") return this.DTT_Gyr;
		return this.DTT;
	}	
	Cosmos.prototype.angular_size_distance = function(){
		if(unit=="Mpc") return this.DA_Mpc;
		else if(unit="Gyr") return this.DA_Gyr;
		return this.DA;
	}
	Cosmos.prototype.comoving_radial_distance = function(unit){
		if(unit=="Mpc") return this.DCMR_Mpc;
		else if(unit="Gyr") return this.DCMR_Gyr;
		return this.DCMR;
	}
	Cosmos.prototype.luminosity_distance = function(unit){
		if(unit=="Mpc") return this.DL_Mpc;
		else if(unit="Gyr") return this.DL_Gyr;
		return this.DL;
	}

	// tangential comoving distance
	Cosmos.prototype.DCMT = function() {
		var ratio = 1.00;
		var x = Math.sqrt(Math.abs(this.WK))*this.DCMR;
		var y;
		if (x > 0.1) {
			ratio =  (this.WK > 0) ? 0.5*(Math.exp(x)-Math.exp(-x))/x : Math.sin(x)/x;
			y = ratio*this.DCMR;
			return y;
		};
		y = x*x;
		// statement below fixed 13-Aug-03 to correct sign error in expansion
		if (this.WK < 0) y = -y;
		ratio = 1 + y/6 + y*y/120;
	
		return ratio*this.DCMR;

	}
	
	// comoving volume computation
	Cosmos.prototype.VCM = function() {
		var ratio = 1.00;
		var x = Math.sqrt(Math.abs(this.WK))*this.DCMR;
		var y;
		if (x > 0.1) {
			ratio =  (this.WK > 0) ? (0.125*(Math.exp(2*x)-Math.exp(-2*x))-x/2)/(x*x*x/3) :
			(x/2 - Math.sin(2*x)/4)/(x*x*x/3) ;
			y = ratio*this.DCMR*this.DCMR*this.DCMR/3;
			return y;
		};
		y = x*x;
		// statement below fixed 13-Aug-03 to correct sign error in expansion
		if (this.WK < 0) y = -y;
		ratio = 1 + y/5 + (2/105)*y*y;
		return ratio*this.DCMR*this.DCMR*this.DCMR/3;
	}
	
	Cosmos.prototype.compute = function(){
		this.h = this.H0/100;
		this.WR = 4.165E-5/(this.h*this.h);	// includes 3 massless neutrino species, T0 = 2.72528
		this.WK = 1-this.WM-this.WR-this.WV;
		this.az = 1.0/(1+1.0*this.z);
		this.age = 0;
		var i;
		for (i = 0; i != this.n; i++) {
			this.a = this.az*(i+0.5)/this.n;
			this.adot = Math.sqrt(this.WK+(this.WM/this.a)+(this.WR/(this.a*this.a))+(this.WV*this.a*this.a));
			this.age = this.age + 1/this.adot;
		};
		this.zage = this.az*this.age/this.n;
	
		// correction for annihilations of particles not present now like e+/e-
		// added 13-Aug-03 based on T_vs_t.f
		var lpz = Math.log((1+1.0*this.z))/Math.log(10.0);
		var dzage = 0;
		if (lpz >  7.500) dzage = 0.002 * (lpz -  7.500);
		if (lpz >  8.000) dzage = 0.014 * (lpz -  8.000) +  0.001;
		if (lpz >  8.500) dzage = 0.040 * (lpz -  8.500) +  0.008;
		if (lpz >  9.000) dzage = 0.020 * (lpz -  9.000) +  0.028;
		if (lpz >  9.500) dzage = 0.019 * (lpz -  9.500) +  0.039;
		if (lpz > 10.000) dzage = 0.048;
		if (lpz > 10.775) dzage = 0.035 * (lpz - 10.775) +  0.048;
		if (lpz > 11.851) dzage = 0.069 * (lpz - 11.851) +  0.086;
		if (lpz > 12.258) dzage = 0.461 * (lpz - 12.258) +  0.114;
		if (lpz > 12.382) dzage = 0.024 * (lpz - 12.382) +  0.171;
		if (lpz > 13.055) dzage = 0.013 * (lpz - 13.055) +  0.188;
		if (lpz > 14.081) dzage = 0.013 * (lpz - 14.081) +  0.201;
		if (lpz > 15.107) dzage = 0.214;
		this.zage = this.zage*Math.pow(10.0,dzage);
		this.zage_Gyr = (this.Tyr/this.H0)*this.zage;
		this.DTT = 0.0;
		this.DCMR = 0.0;
		// do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
		for (i = 0; i != this.n; i++) {
			this.a = this.az+(1-this.az)*(i+0.5)/this.n;
			this.adot = Math.sqrt(this.WK+(this.WM/this.a)+(this.WR/(this.a*this.a))+(this.WV*this.a*this.a));
			this.DTT = this.DTT + 1/this.adot;
			this.DCMR = this.DCMR + 1/(this.a*this.adot);
		};
		this.DTT = (1-this.az)*this.DTT/this.n;
		this.DCMR = (1-this.az)*this.DCMR/this.n;
		this.age = this.DTT+this.zage;
		this.age_Gyr = this.age*(this.Tyr/this.H0);
		this.DTT_Gyr = (this.Tyr/this.H0)*this.DTT;
		this.DCMR_Gyr = (this.Tyr/this.H0)*this.DCMR;
		this.DCMR_Mpc = (this.c/this.H0)*this.DCMR;
		this.DA = this.az*this.DCMT();
		this.DA_Mpc = (this.c/this.H0)*this.DA;
		this.kpc_DA = this.DA_Mpc/206.264806;
		this.DA_Gyr = (this.Tyr/this.H0)*this.DA;
		this.DL = this.DA/(this.az*this.az);
		this.DL_Mpc = (this.c/this.H0)*this.DL;
		this.DL_Gyr = (this.Tyr/this.H0)*this.DL;
		this.V_Gpc = 4*Math.PI*Math.pow(0.001*this.c/this.H0,3)*this.VCM();
		
		return this;
	}

	// Create the main function
	function init(astrojs) {

		this.cosmos = function(H0,WM,WV,z){
		
			var c = new Cosmos();
			return c.setValues(H0,WM,WV,z).compute();

		}
		
		return this;

	}

	astrojs.registerPackage({
		init: init,
		dependencies: dependencies,
		name: 'cosmology',
		version: '0.2'
	});
	
})(astrojs);