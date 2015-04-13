# URLShortener

This app's  server built on Node Js.
If you want to interact with this App first install the following:

Requirements:
Install Node JS.
Install mysql(No passwords please).

MySQL:

Create a mysql table as follows:

    mysql -u root
    create database tinyurls;
    use tinyurls;
    create table urls(tiny varchar(255),original varchar(255),visitcount int,created timestamp);

Node JS:

1.Install Node JS from https://nodejs.org/download/  
  

2.Install node-mysql package.This package is required to interact and maintain connection with mysql database;
    reference: https://github.com/felixge/node-mysql/#introduction
  
3.Use the following command to install node-mysql package.
  npm install node-mysql  

How to Run URLShortener:

1.Get the URLShortener repository.

2.Open terminal,Move to the URLShortener folder

3.type the following command

     node URLShortener.js
  
4.Open web browser type the following in location bar 

    http://localhost:2000
  
5.You can see the input box and generate tab.use them to shorten your URL


