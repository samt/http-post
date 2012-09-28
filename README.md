# http-post

This utility extends the funcationlity of the 'http' library in stock node.js.
It returns a post request function in a very similar way to node's [http.get()](http://nodejs.org/api/http.html#http_http_get_options_callback).

In the same style as `http.get()`, this function calls `req.end()` automatically

## Installing

	npm install http-post

## Usage

	http-post(options, data[, files[, callback]])

or

	http-post(options, data[, callback])

### options

Options are the same as the ones for [http.request()](http://nodejs.org/api/http.html#http_http_request_options_callback)
except `method` will always be forced to `POST`. Note that `options` can be
replaced with the full URI of the request similar to `http.get` allowing for
even greater flexiblity in your post requests.

### data

Data should be key/value pairs of form data. This does not handle file data,
see the `files` option below for more information on uploading files.

	var data = {
		name: "Sam",
		email: "sam@emberlabs.org",
		gender: "m",
		languages: [
			"C",
			"C++",
			"Java",
			"JavaScript",
			"PHP",
			"Python"
		]
	}

Pass it an empty array if you do not need to send any form data.

### files

TBA

### callback

Callback is the same from [http.request()](http://nodejs.org/api/http.html#http_http_request_options_callback).
It accepts an instance of [http.ClientResponce](http://nodejs.org/api/http.html#http_http_clientresponse)
that has been created during the time of the request.

## Return

Returns an instance of [http.ClientRequest](http://nodejs.org/api/http.html#http_class_http_clientrequest)

## Examples

`Setting up`

	var http = require('http');
	http.post = require('http-post');

`Posting data`

	http.post('http://localhost/postscript.php', { name: 'Sam', email: 'sam@emberlabs.org' }, function(res){
		response.setEncoding('utf8');
		res.on('data', function(chunk) {
			console.log(chunk);
		});
	});

## License

[The MIT License](http://opensource.org/licenses/mit-license.php)
