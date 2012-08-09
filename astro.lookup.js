/*
 * Name resolver based on the LookUP webservice
 * Written by Stuart Lowe
 *
 */
(function () {

	function init(astrojs) {

		this.fns = {};

		this.results = function(d){

			if(typeof d=="undefined" || (d.type && d.type=="error")) return { message: "There was a problem getting the search results. Sorry about that." };
			if(d.target && d.target.suggestion) return { message: 'Not found. Did you mean '+d.target.suggestion+'?', suggestion: d.target.suggestion }
			if(d.ra) return d;
			else{
				if(d.message) return d;
				else return { message: "Not found. Sorry." };
			}
		}

		this.find = function(objectname,eventData,callback){

			if(typeof callback!=="function" && typeof eventData==="function"){
				callback = eventData;
				eventData = {};
			}
			if(typeof callback!=="function") return -1;

			var str = objectname;
			str = encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  replace(/\)/g, '%29').replace(/\*/g, '%2A'); 
			str = str.replace(/%0A/g, '\n');
			var fname = 'astrojslookup'+Date.now();
			var _obj = this;
			var _arg = eventData;
			var _call = callback;
			this.fns[fname] = function(d){
				d = _obj.results(d);
				_call.call(astrojs,{result:d,data:_arg});
			}
			var js = document.createElement('script');
			js.setAttribute('type', 'text/javascript');
			js.setAttribute('src', 'http://www.strudel.org.uk/lookUP/json/?name='+str+'&callback=astrojs.lookup.fns.'+fname);
			js.onerror = js.onreadystatechange = this.fns[fname];
			document.getElementsByTagName('head')[0].appendChild(js);

			return 0;
		}
		
		return this;
	}

	astrojs.registerPackage({
		init: init,
		name: 'lookup',
		version: '0.1'
	});
	
})(astrojs);

