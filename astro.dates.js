/*
	astro.dates.js - astronomy date manipulation

*/
(function () {

	// Create the main function
	function init(astrojs) {

		// Return the full Julian Date
		// It is important to remember to include the timezone 
		// offset if setting this with a string
		this.getJulianDate = function(today) {
			// The Julian Date of the Unix Time epoch is 2440587.5
			if(!today) today = new Date();
			if(typeof today==="string") today = new Date(today);
			return ( ((typeof today==="number") ? today : today.getTime()) / 86400000.0 ) + 2440587.5;
		}
		
		// Return the Greenwich Sidereal Time
		this.getGST = function(clock){
			if(typeof clock==="undefined") return { status: -1 };
			if(typeof clock==="string") clock = new Date(clock);
			else if(typeof clock==="number") clock = new Date(clock);
			var JD, JD0, S, T, T0, UT, A, GST;
			JD = this.getJulianDate(clock);
			JD0 = Math.floor(JD-0.5)+0.5;
			S = JD0-2451545.0;
			T = S/36525.0;
			T0 = (6.697374558 + (2400.051336*T) + (0.000025862*T*T))%24;
			if(T0 < 0) T0 += 24;
			UT = (((clock.getUTCMilliseconds()/1000 + clock.getUTCSeconds())/60) + clock.getUTCMinutes())/60 + clock.getUTCHours();
			A = UT*1.002737909;
			T0 += A;
			GST = T0%24;
			if(GST < 0) GST += 24;
			return GST;
		}

		// Return the Local Sidereal Time
		this.getLST = function(clock,lon){
			if(typeof clock==="undefined" || typeof lon==="undefined") return { status: -1 };
			var GST = this.getGST(clock);
			var d = (GST + lon/15.0)/24.0;
			d = d - Math.floor(d);
			if(d < 0) d += 1;
			return 24.0*d;
		}

		// Return a structure with the Julian Date, Local Sidereal Time and Greenwich Sidereal Time
		this.astronomicalTimes = function(clock,lon){
			if(typeof clock==="undefined" || typeof lon==="undefined") return { status: -1 };

			return { GST:this.getGST(clock,lon), LST:this.getLST(clock,lon), JD:this.getJulianDate(clock) };
		}
		return this;
	}


	astrojs.registerPackage({
		init: init,
		name: 'dates',
		version: '0.1'
	});
	
})(astrojs);



