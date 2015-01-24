import os
from flask import Flask
from flask.ext import restful           # ReST lib
from flask.ext.pymongo import PyMongo   # MongoDB lib
from flask import make_response
from bson.json_util import dumps

from cros import crossdomain

#  we check if we have a MONGO_URL environment variable
MONGO_URL = os.environ.get('MONGO_URL')
if not MONGO_URL:
    #  we are in our development environment so we set it to the localhost
    MONGO_URL = "mongodb://localhost:27017/cloud";

# we initialize our Flask application
app = Flask(__name__)

# we initialize our mongoDB connection
app.config['MONGO_URI'] = MONGO_URL
mongo = PyMongo(app)

# is used to dump the BSON encoded mongoDB objects to JSON
def output_json(obj, code, headers=None):
    resp = make_response(dumps(obj), code)
    resp.headers.extend(headers or {})
    return resp

DEFAULT_REPRESENTATIONS = {'application/json': output_json}
api = restful.Api(app)
api.representations = DEFAULT_REPRESENTATIONS
api.decorators=[crossdomain(origin='*')]

import flask_rest_service.resources
