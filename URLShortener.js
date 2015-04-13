/*
Author:Charan
Details: This file is Node server to receive data from client side and to interact with database
Libraries used:
	node-mysql Its a nodejs library to manage connection with mysql database.
	reference: https://github.com/felixge/node-mysql/#introduction
*/

/*
type the following commands in terminal:
mysql -u root
create database tinyurls;
use tinyurls;
create table urls(tiny varchar(255),original varchar(255),visitcount int,created timestamp);*/

var mysql = require('mysql');
var http = require('http');
var sys = require('sys');
var fs = require('fs');
var url = require("url");
var qs = require('querystring');


/* MYSQL */
var connection = mysql.createConnection({

	host: 'localhost',
	user: 'root',
	password: ''

});

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});

/* WEB SERVER */

var config = {
	home: "home.html",
	work: "work.js",
	styles: "styles.css"
}

http.createServer(function(req, response) {

	var POST = {};

	if (req.method == 'POST') {
	} else if (req.method == 'GET') {
		var url_parts = url.parse(req.url, true);
	}

	switch (req.url) {

		case '/':
			response.end(fs.readFileSync(config.home).toString());
			break;
		case "/shorten":
			var body = '';

			req.on('data', function(data) {
				body += data;
			});

			req.on('end', function() {

				POST = qs.parse(body);
				var originalUrl = POST.url;
				var tinyUrl = (+new Date()).toString(36);

				connection.query("use tinyurls;", function() {

					connection.query("insert into urls values('" + tinyUrl + "','" + originalUrl + "',1,NOW());", function() {

						//connection.query("select * from urls", function() {

							//var dataArr = arguments[1];
							response.writeHead(200, {
								'content-type': 'application/json' //No I18N
							});
							//response.write(JSON.stringify(dataArr));
							response.write(tinyUrl.toString());
							response.end();
						//})
					});
				});
			});
			break;
		case "/allurl":

			connection.query("use tinyurls;", function() {
				connection.query("select * from urls", function() {

					var dataArr = arguments[1];

					response.writeHead(200, {
						'content-type': 'application/json' //No I18N
					});

					response.write(JSON.stringify(dataArr));
					response.end();
				});
			});
			break;
		case "/work.js":
			response.end(fs.readFileSync(config.work).toString());
			break;
		case "/styles.css":
			response.end(fs.readFileSync(config.styles).toString());
			break;
		default:
			var randomKey = req.url.substr(1);
			if(randomKey){
				redirectToOriginalUrl(randomKey, response);	
			}
			break;
	}


}).listen(2000);

function redirectToOriginalUrl(tiny, response) {

	connection.query("use tinyurls;", function() {

		connection.query("select original from urls where tiny='" + tiny + "'", function() {

			var dataArr = arguments[1];

			if (dataArr.length) {

				var original = arguments[1] ? dataArr[0].original : undefined;

				if (original !== undefined) {

					connection.query("select visitcount from urls where tiny='" + tiny + "';", function() {
						var visitcount = arguments[1][0].visitcount;
						visitcount = ++visitcount;
						connection.query("update urls set visitcount=" + visitcount + " where tiny='" + tiny + "' ;", function() {
							console.log("VISIT COUNT UPDATED");
						});
					});
					response.writeHead(302, {
						'Location': original
					});
					response.end();
				}
			}
		});

	});
	return 0;
}

sys.puts('Server running at port:2000/'); //No I18N