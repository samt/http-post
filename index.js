/**
 * http-post
 *
 * (c) copyright 2012 Sam Thompson <sam@emberlabs.org>
 * License: The MIT License - http://opensource.org/licenses/mit-license.php
 */

module.exports = function(options, data, files, fn) {
	if (typeof(files) == 'function' || typeof(files) == 'undefined') {
		fn = files;
		files = [];
	}

	if (typeof(fn) != 'function') {
		fn = function() {};
	}

	if (typeof(options) == 'string') {
		var options = require('url').parse(options);
	}

	var fs = require('fs');
	var endl = "\r\n";
	var length = 0;
	var contentType = '';

	// If we have files, we have to chose multipart, otherweise we just stringify the query 
	if (files.length) {
		var boundary = '-----np' + Math.random();
		var toWrite = [];

		for(var k in data) {
			toWrite.push('--' + boundary + endl);
			toWrite.push('Content-Disposition: form-data; name="' + k + '"' + endl);
			toWrite.push(endl);
			toWrite.push(data[k] + endl);
		}

		var name = '', stats;
		for (var k in files) {
			if (fs.existsSync(files[k].path)) {
				// Determine the name
				name = (typeof(files[k].name) == 'string') ? files[k].name : files[k].path.replace(/\\/g,'/').replace( /.*\//, '' );

				// Determine the size and store it in our files area
				stats = fs.statSync(files[k].path);
				files[k].length = stats.size;

				toWrite.push('--' + boundary + endl);
				toWrite.push('Content-Disposition: form-data; name="' + files[k].param + '"; filename="' + name + '"' + endl);
				//toWrite.push('Content-Type: image/png');
				toWrite.push(endl);
				toWrite.push(files[k]);
			}
		}

		// The final multipart terminator
		toWrite.push('--' + boundary + '--' + endl);

		// Now that toWrite is filled... we need to determine the size
		for(var k in toWrite) {
			length += toWrite[k].length;
		}

		contentType = 'multipart/form-data; boundary=' + boundary;
	}
	else {
		data = require('querystring').stringify(data);
		length = data.length;
		contentType = 'application/x-www-form-urlencoded';
	}
	options.method = 'POST';
	options.headers = options.headers || {};
	options.headers['Content-Length'] = length;
	options.headers['Content-Type'] = contentType;
		
	var req = require('http').request(options, function(responce) {
		fn(responce);
	});

	// Multipart and form-urlencded work slightly differnetly for sending
	if (files.length) {
		for(var k in toWrite) {
			if (typeof(toWrite[k]) == 'string') {
				req.write(toWrite[k]);
			}
			else {
				// @todo make it work better for larger files
				req.write(fs.readFileSync(toWrite[k].path, 'binary'));
				req.write(endl);
			}
		}
	}
	else {
		req.write(data);
	}
	req.end();

	return req;
}
