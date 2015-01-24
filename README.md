Introduction
============

The main goal of this project is to facilitate research of french gas station. 
The web application show on a map the localisation and many information such as prices and services.

This project is diveded into three parts
  - a Python script to update the NoSQL database (MongoDB) every hours
  - a ReST api to retrive data using Flask
  - a Web application to display gas stations on a map based on HTML / Javascript

Requirement
--------------
 
 MongoDB must be installed and the database "cloud" must be created.
 
How to setup ?
--------------

Clone the repository 

	$ git clone https://github.com/e-lefort/project_cloud.git

Use virtualenv to execute a clean install from the repository

	$ pip install virtualenv
	$ virtual venv
	$ . venv/bin/active
	
Install all the dependencies from the virtualenv

	(venv)$ pip install rest_api/requirements.txt
	
Run the server locally (localhost:5000)

	(venv)$ python rest_api/runserver.py

