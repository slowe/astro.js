/*
	Astro.js - a framework for astronomy libraries

	LICENSE:

	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 2 of the License, or
	(at your option) any later version.
   
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU General Public License for more details.
   
	You should have received a copy of the GNU General Public License
	along with this program (see SLA_CONDITIONS); if not, write to the
	Free Software Foundation, Inc., 59 Temple Place, Suite 330,
	Boston, MA 02111-1307 USA

*/

(function(global){

	// Get the base URL of this script - we'll use this for loading
	var scripts = document.getElementsByTagName('script');
	var src = scripts[scripts.length - 1];
	if (src.getAttribute.length !== undefined) src = src.src
	else src = src.getAttribute('src', -1);
	src = src.substring(0,src.lastIndexOf('/')+1)

	var astrojs = {

		version: '0.0.7',
		// Some internal variables
		astrojs: {
			base: src,
			packages: [],
			packagelookup: [],
			toload: 0,
			loaded: function(){
				this.toload--;
				astrojs.ready();
			}
		},
		ready: function(args,callback){

			this.setReady(args,callback);

			// We must wait until the document is ready before doing
			// anything otherwise function calls could fire out of 
			// order. This code from jQuery:
			if(!this.astrojs.readyBound){
				this.astrojs.readyBound = true;
	
				// Mozilla, Opera and webkit nightlies currently support this event
				if(document.addEventListener) {
					// Use the handy event callback
					document.addEventListener( "DOMContentLoaded", function(){
						document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
						astrojs.readyGo();
					}, false);
				
				// If IE event model is used
				}else if(document.attachEvent){
					// ensure firing before onload,
					// maybe late but safe also for iframes
					document.attachEvent("onreadystatechange", function(){
						if ( document.readyState === "complete" ) {
							document.detachEvent( "onreadystatechange", arguments.callee );
							astrojs.readyGo();
						}
					});
				
					// If IE and not an iframe
					// continually check to see if the document is ready
					if ( document.documentElement.doScroll && window == window.top ) (function(){
						if ( jQuery.isReady ) return;
						try {
							// If IE is used, use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							document.documentElement.doScroll("left");
						} catch( error ) {
							setTimeout( arguments.callee, 0 );
							return;
						}
					
						// and execute any waiting functions
						astrojs.readyGo();
					})();
				}else{
					// A fallback to window.onload
					window.onload = astrojs.readyGo;
				}
			}

			if(this.astrojs.toload==0) this.readyGo();

			return this;
		},
		readyGo: function(){
			if(this.astrojs.toload==0 && this.astrojs.ready && typeof this.astrojs.ready.fn==="function"){
				var fn = this.astrojs.ready.fn;
				this.astrojs.ready.fn = -1;
				fn.call();
			}
		},
		setReady: function(args,callback){

			if(typeof callback==="undefined" && typeof args==="undefined") return;

			if(!callback && typeof args==="function"){
				callback = args;
				args = {};
			}
			if(typeof args!=="object") args = {};
			if(typeof callback==="function"){
				// Define an object to hold the callback and arguments
				this.astrojs.ready = {
					fn:function(){
						a = astrojs.astrojs;
						if(a.toload==0 && typeof a.ready.callback==="function") a.ready.callback.call(a.ready.me,{data:a.ready.args});
					},
					args: args,
					callback: callback,
					me: this
				}
			}
		},
		importPackage: function(p){

			var idx, name, loc, end;
			loc = name = p;

			// Is this a remote package?
			if(name.indexOf('astro.') < 0){
				loc = 'astro.'+name+'.js';
			}else{
				idx = loc.indexOf('astro.');
				end = (loc.lastIndexOf('.js') == loc.length-3) ? loc.length-3 : loc.length
				name = loc.substring(idx+6,end);
			}
			
			// Skip out if we've already loaded it
			if(typeof this.astrojs.packagelookup[name]!="undefined") return;

			// Set a dummy value
			this.astrojs.packagelookup[name] = -1;

			// Increment the loading packages counter
			this.astrojs.toload++;


			var js = document.createElement('script');
			js.setAttribute('type', 'text/javascript');
			js.setAttribute('src', (loc.indexOf('http://')!=0 ? this.astrojs.base : "") + loc);
			js.onerror = function(){
				astrojs.astrojs.loaded();
			}

			document.getElementsByTagName('head')[0].appendChild(js);

		},
		importPackages: function(p,args,callback){

			// Set up the ready function
			this.setReady(args,callback);

			for(var i = 0; i < p.length ; i++) this.importPackage(p[i]);

			return this;
		},
		initPackages: function(){

			var pack;
			
			for(var p = this.astrojs.packages.length-1; p >= 0  ; p--){

				pk = this.astrojs.packages[p];

				// Skip it if it has already been initiated
				if(pk.initiated) continue;

				var ok = true;

				// Check if all the dependencies have been met
				if(typeof pk.dependencies=="object"){
					for(var i = 0; i < pk.dependencies.length; i++){
						if(typeof this[pk.dependencies[i]]==="undefined") ok = false;
						else{
							if(typeof this[pk.dependencies[i]]==="function") ok = false;
						}
					}
				}

				if(ok){
					if(typeof pk.init==="function") this[pk.name] = pk.init(this);
					// Update the loading packages counter
					if(this.astrojs.toload > 0) this.astrojs.toload--;
					pk.initiated = true;
				}
			}
		},
		registerPackage: function(inp){

			var a = this.astrojs;
			var ok = (!a.packagelookup[inp.name] || a.packagelookup[inp.name] < 0);

			// We can't have people overwriting built-in functions
			if(ok && typeof this[inp.name]==="function") ok = false;
			// We can't have people overwriting built-in functions
			if(inp.name == "astrojs") ok = false;

			if(ok){

				if(console && typeof console.log==="function") console.log('Registering astro.'+inp.name+'.js');
				

				// Push the details of the package somewhere
				a.packages.push(inp);
				a.packagelookup[inp.name] = a.packages.length;

				// Load any dependencies
				if(typeof inp.dependencies==="object") this.importPackages(inp.dependencies);

				// Call the init function
				this.initPackages();
				
			}else{
				if(console && typeof console.log==="function") console.log('A package "'+inp.name+'" already exists');
			}

			// Try ready
			this.ready();

			return ok;

		}

	}

	if(global.astrojs) throw new Error('astrojs has already been defined');
	else global.astrojs = astrojs;

})(typeof window === "undefined" ? this : window);
