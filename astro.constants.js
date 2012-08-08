/*
	astro.constants.js - basic physical constants in SI units
	
	Format based largely on astropy constants

*/
(function () {

	function Constant(v, e, n, o, u){
	
		this.value = v;
		this.error = e;
		this.name = n;
		this.origin = o;
		this.units = u;

		this.toString = function(){
			var s = " Name = \n"+this.name;
			s += " Value = \n"+this.value;
			s += " Error = \n"+this.error;
			s += " Units = \n"+this.units;
			s += " Origin = "+this.origin;
			return s
		}
		return this;
	}

	// Create the main function
	function init(astrojs) {
	
		// PHYSICAL CONSTANTS
		this.c = new Constant(2.99792458e8,0,"Speed of light","2010 CODATA",'m/s');
		this.G = new Constant(6.67384e-11,8.0e-15,"Gravitational constant",'2010 CODATA','m^3/kg/sec^2');
		this.h = new Constant(6.62606957e-34,2.9e-41,"Planck constant","2010 CODATA",'J.s');
		this.hbar = new Constant(1.054571726e-34,4.7e-42,"Reduced Planck constant","2010 CODATA",'J.s');
		this.e = new Constant(1.602176565e-19,3.5e-27,"Electron charge","2010 CODATA",'C');
		this.m_e = new Constant(9.10938291e-31,4.0e-38,"Electron mass",'2010 CODATA','kg');
		this.m_p = new Constant(1.672621777e-27,7.4e-35,'Proton mass','2010 CODATA','kg');
		this.m_n = new Constant(1.674927351e-27,7.4e-35,'Neutron mass','2010 CODATA','kg');
		this.alpha = new Constant(7.2973525698e-3,2.4e-12,'Fine Structure constant','2010 CODATA','');
		this.R = new Constant(8.3144621,0.0000075,'Gas constant','2010 CODATA','J/mol/K');
		this.Ryd = new Constant(10973731.568539,0.000055,'Rydberg constant','2010 CODATA','m^-1');
		this.N_A = new Constant(6.02214129e23,2.7e-30,"Avogadro's number",'2010 CODATA','/mol');
		this.k = new Constant(1.3806488e-23,1.3e-29,'Boltzmann constant','2010 CODATA','J/K');
		this.sigma_sb = new Constant(5.670373e-8,2.1e-13,'Stefan-Boltzmann constant','2010 CODATA','J/m^2/K^4/s');
		this.eV = new Constant(1.602176565e-19,3.5e-27,'Electron Volt','2010 CODATA','J');
		this.amu = new Constant(1.660538921e-27,7.3e-35,'(unified) atomic mass unit','2010 CODATA','kg');

		// DISTANCE
		this.au = new Constant(1.496e11,-1,'Astronomical unit','','m');
		this.pc = new Constant(3.08568024696e18,-1,'Parsec','','m');
		this.kpc = new Constant(3.08568024696e21,-1,'Parsec','','m');
		this.ly = new Constant(9.463e15,-1,'Lightyear','','m');

		// TIME
		this.yr = new Constant(31557600,0,'Year','','s');

		// SOLAR QUANTITIES
		this.M_sun = new Constant(1.9884e30,2e26,'Solar mass','The Astronomical Almanac 2013','kg'); // Solar mass in kilograms
		this.R_sun = new Constant(696000000,0,'Solar radius','The Astronomical Almanac 2013','m'); // Solar radius in meters
		this.L_sun = new Constant(3.839e26,-1,'Solar luminosity','','J/s');
		this.T_sun = new Constant(5.780e3,-1,'Solar temperature','','K');

		// OTHER SOLAR SYSTEM QUANTITIES
		this.M_jup = new Constant(1.89850861164e+27,3.9768e20,'Jupiter mass','http://adsabs.harvard.edu/abs/2010ApJ...720L.201C','kg');
		this.R_jup = new Constant(71492000,4000,'Jupiter equatorial radius','The Astronomical Almanac 2013','m');
		this.M_earth = new Constant(5.9722e24,6e20,'Earth mass','The Astronomical Almanac 2013','kg');
		this.R_earth = new Constant(6378136.6,0.1,'Earth equatorial radius','The Astronomical Almanac 2013','m');

		return this;
	}

	astrojs.registerPackage({
		init: init,
		name: 'constants',
		version: '0.1'
	});
	
})(astrojs);

