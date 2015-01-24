Introduction
============

The main goal of this project is to facilitate research of french gas station. 
The web application show on a map the localisation and many information such as prices and services.

This project is diveded into two parts
  - a ReST api to retrive data create with Flask
  - a Web application to display gas stations on a map based on HTML / Javascript
  
How to setup ?
--------------

Clone the repository 

	$ git clone https://github.com/E-LEFORT/project_cloud.git

Use virtualenv to execute a clean install from the repository

	$ pip install virtualenv
	$ virtual venv
	$ . venv/bin/active
	
Install all the dependencies from the virtualenv

	(venv)$ pip install rest_api/requirements.txt
	
Run the server locally (localhost:5000)

	(venv)$ python runserver.py

