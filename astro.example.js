/*
	astro.example.js - a very simple example

*/
(function () {

	// Define any dependencies that are required for this package to run
	var dependencies = ['constants'];
	
	// Create the main function
	function init(astrojs) {

		var message = "Hello Universe!";
		this.pi = 3.141;

		this.hello = function(){
			return message;
		}
		return this;
	}

	// Register the package with the core
	astrojs.registerPackage({
		init: init,
		dependencies: dependencies,
		name: 'example',
		version: '0.0.1'
	});
	
})(astrojs);

