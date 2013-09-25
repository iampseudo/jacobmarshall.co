/**
 * Copyright 2013 - Jacob Marshall (public@jacobmarshall.co)
 *
 * Please feel free to use this code as an educational resource;
 * and if you decide (for some weird reason) to rip my code, please
 * just leave me a little credit... <3
 */

;(function ( global, page ) {

	/**
	 * Shorthand function to get the prototype
	 * property in an Function object.
	 */
	function proto ( c ) {
		if ( c.hasOwnProperty('prototype') )
			return c.prototype;
	}

	/**
	 * Store some of the more useful prototype
	 * objects so we can work some awesome magic.
	 */
	var _Object = proto(Object),
		_Array = proto(Array),
		_String = proto(String);

	var slice = _Array.slice;

	/**
	 * Extends an object (no argument limit),
	 * and returns it. If you wish to duplicate
	 * an object, simply set the origin to an
	 * empty object and pass the object as
	 * another argument. See the clone() function.
	 */
	function extend ( origin ) {

		/**
		 * Grab all of the arguments and place them
		 * into a convenient array container. No more
		 * Argument crap.
		 */
		var args = slice.apply(arguments),

		/**
		 * Grab all of the objects we wish to extend
		 * the origin with. We do this by slicing them
		 * from the args array.
		 */
		merge = slice.call(args, 1),

		/**
		 * Setup the index/length variables, Douglas
		 * Crockford told me to...
		 */
		index = 0, length = merge.length;

		/**
		 * Itterate over each of the extra objects,
		 * one-by-one adding each of their properties
		 * to the origin.
		 */
		for ( ; index < length; index ++ ) {
			var obj = merge[index];
			for ( var key in obj ) {
				if ( obj.hasOwnProperty(key) ) {
					origin[key] = obj[key];
				}
			}
		}

		// Return the origin, to allow for cloning.
		return origin;
	}

	/**
	 * Shorthand function to easily clone an object.
	 * Only takes one argument because we only wish
	 * to clone the object, not extend it.
	 */
	function clone ( obj ) {
		return extend({}, obj);
	}

	/**
	 * XMLHttpRequest fix for older and less superior
	 * browsers. Works with both 'new HttpRequest;' and
	 * 'HttpRequest();'.
	 */
	function HttpRequest () {
		var notspec = 'Microsoft.XMLHTTP';

		/**
		 * If we have the spec XMLHttpRequest object in
		 * our global variable scope, we can use that, but
		 * if not, fallback to the old Internet Explorer
		 * way of creating an ajax request object.
		 */
		return ( typeof global.XMLHttpRequest !== 'undefined' ) ?
			new XMLHttpRequest() : new ActiveXObject(notspec);
	}

	/**
	 * This function can be used as default call-
	 * backs for utility functions. It does nothing,
	 * and is privately scoped, so *fingers crossed*
	 * no tampering is possible.
	 */
	function callback () {
		/* Silent callback */
	}

	/**
	 * A neat little utility function that requests
	 * an http call and allows it to return the results
	 * to a callback function. Equivilent of jQuery's
	 * $.ajax method. But better *shuts mouth*.
	 */
	function fetch ( type, url, options ) {

		/**
		 * Allows the call to extend the default ajax
		 * properties, like whether or not the request
		 * is send asynchronously (always!), or define
		 * the http request headers, data... etc.
		 */
		var opt = extend({

			/**
			 * The type of http request, e.g. GET, POST
			 * and other VERB methods.
			 */
			type: type,

			// The relative url location
			url: url,

			// Request asynchronously?
			async: true,

			// Define custom headers
			headers: {},

			// Send 'other' data
			data: '',

			/**
			 * This callback is invoked after all basic
			 * configuration is take place, allowing it
			 * to override any previous actions.
			 */
			setup: callback,

			/**
			 * The callback that is invoked after the
			 * readyState of the HttpRequest has changed
			 * to 4 (@see XMLHttpRequest.prototype).
			 */
			callback: callback,

			/**
			 * If any exceptions are thrown during the
			 * request's initialization, it is passed
			 * as the only argument of this callback.
			 */
			error: callback

		}, options);

		// Create a new instance of a HttpRequest
		var xhr = new HttpRequest;

		/**
		 * Register an event handler when the readyState
		 * of the XHR request changes. We listen to this
		 * to see if we're done with the request.
		 */
		xhr.onreadystatechange = function () {
			if ( xhr.readyState == 4 ) {

				// If we're done, invoke the callback
				opt.callback(xhr);

			}
		}

		/**
		 * Set a bunch of custom request headers, if
		 * defined in the options object. Beware of this.
		 */
		var headers = opt.headers;
		for ( var key in headers ) {
			if ( headers.hasOwnProperty(key) ) {

				// Set the header values
				xhr.setRequestHeader(key, headers[key]);

			}
		}

		/**
		 * Now call the setup function, allowing even
		 * more configuration to the request object.
		 */
		opt.setup.call(xhr);

		try {

			/**
			 * Initiate the connection, by defining the re-
			 * quest type, url and async values.
			 */
			xhr.open(opt.type, opt.url, opt.async);

			/**
			 * Send the request, and optionally send extra
			 * data through the request...
			 */
			xhr.send(opt.data);

		} catch ( e ) {

			// Clean up any thrown exceptions we may encounter
			opt.error(e);
			
		}
	}

}( this, document ));