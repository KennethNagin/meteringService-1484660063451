/*eslint-env node*/
var https = require('https');

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
//app.use(bodyParser()); // not supported
//app.use(bodyParser.raw()); // support json encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
//app.use(bodyParser.urlencoded({ extended: true })); 
 
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get("/string", function(req, res) {
    var strings = ["string1", "string2", "string3"]
    var n = Math.floor(Math.random() * strings.length)
    res.send(strings[n])
});



app.get("/getKey/:key", function(client_req, client_res) {
   console.log("entered getKey");
   console.log(client_req.params.key);
   chainArgs = [client_req.params.key];
   //blockChainReq(client_req, client_res, 'query', 'read',chainArgs);
   blockChainReq(client_req, client_res, 'query', 'read',chainArgs);
});

app.post("/setKey/:key", function(client_req, client_res) {
   console.log("entered setKey");
   console.log(client_req.params)
   console.log(client_req.body);
   console.log('body: ' + JSON.stringify(client_req.body));
   console.log('key: '+client_req.params.key);
   console.log('keyValue: '+client_req.body.keyValue);
   chainArgs = [client_req.params.key,client_req.body.keyValue];
   //blockChainReq(client_req, client_res, 'query', 'read',chainArgs);
   blockChainReq(client_req, client_res, 'invoke', 'write',chainArgs);
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

function blockChainReq(client_req, client_res, chainMethod, chainFunction, chainArgs) {
   console.log("entered blockChainReq");
   console.log(client_req.params);
   console.log(`chainMethod: ${chainMethod}, chainFunction: ${chainFunction}, chainArgs: ${chainArgs} `);

   console.log(chainMethod);
   console.log(chainFunction);
   console.log(chainArgs);
    var response = "";
	var postData = JSON.stringify(
	{
  		jsonrpc: '2.0',
  		method: chainMethod,
  		params: {
    		type: 1,
    		chaincodeID: {
      		name: 'f6ba21de8d133c0df54fa8cf973617207d7e10a554ef93816912bd81f8b79c56c2905587a1772e8e6a9f52e66e40dacfbd5b3c803524a378b62971ac9023243b'
    	},
    	ctorMsg: {
      		function: chainFunction,
       		args: chainArgs
      
    	},
    	secureContext: 'user_type1_1'
  	},
  	id: 0

	});
	
	console.log(postData);
	var options = {
  		hostname: 'c1bdbab254a44bb6be11653e6169b09f-vp0.us.blockchain.ibm.com',
  		port: 5001,
  		path: '/chaincode',
  		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Content-Length': Buffer.byteLength(postData)		
		}		
	};
	console.log(options);
	var req = https.request(options, (res) => {
  		console.log(`STATUS: ${res.statusCode}`);
  		console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  		res.setEncoding('utf8');
  		var body = '';
  		res.on('data', (chunk) => {
			body += chunk;
  		});
  		res.on('end', () => {
    		console.log('request ended:');
			var responseBody = JSON.parse(body)
    		console.log(`responsebody: ${JSON.stringify(responseBody)}`);
    		console.log(`result: ${JSON.stringify(responseBody.result)}`);
//			client_res.send(JSON.stringify(responseBody.result.message));
//	client_res.send(responseBody.result.message);
			client_res.send(responseBody.result);
  		});
	});

	req.on('error', (e) => {
  		console.log(`problem with request: ${e.message}`);
		client_res.send(`problem with request: ${e.message}`);
	});

	// write data to request body
	req.write(postData);
	req.end();
	

}