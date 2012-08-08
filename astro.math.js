/*
	astro.math.js - extra maths functions that don't exist in Math

*/
(function () {

	// Define any dependencies that are required for this package to run
	var dependencies = [];
	
	// Create the main function
	function init(astrojs) {

		var _randNorm = null;
		this.randomNormal = function () {
			// Box-Muller transform for normally distributed random numbers.
			// http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
			var f, u, v, s = 0.0;
			if (_randNorm !== null &&
					typeof(_randNorm) !== "undefined") {
				var tmp = _randNorm;
				_randNorm = null;
				return tmp;
			}
			while (s === 0.0 || s >= 1.0) {
				u = 2 * Math.random() - 1;
				v = 2 * Math.random() - 1;
				s = u * u + v * v;
			}
			f = Math.sqrt(-2 * Math.log(s) / s);
			_randNorm = v * f;
			return u * f;
		};

		return this;
	}

	// Register the package with the core
	astrojs.registerPackage({
		init: init,
		dependencies: dependencies,
		name: 'math',
		version: '0.1'
	});
	
})(astrojs);

