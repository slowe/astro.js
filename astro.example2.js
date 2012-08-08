/*
	A file with multiple packages just to see how it copes

*/
(function () {

	// Create the main function
	function init(astrojs) {

		this.hello = function(){
			return message;
		}
		return this;
	}

	// Register the package with the core
	astrojs.registerPackage({
		init: init,
		dependencies: [],
		name: 'multipleA',
		version: '0.1'
	});
	
})(astrojs);


(function () {

	// Create the main function
	function init(astrojs) {

		this.hello = function(){
			return message;
		}
		return this;
	}

	// Register the package with the core
	astrojs.registerPackage({
		init: init,
		dependencies: [],
		name: 'multipleB',
		version: '0.1'
	});
	
})(astrojs);

