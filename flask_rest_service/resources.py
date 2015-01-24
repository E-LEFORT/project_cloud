import json
from flask import request, abort, Flask, render_template
from flask.ext import restful
from flask.ext.restful import reqparse
from flask_rest_service import app, api, mongo
from bson.objectid import ObjectId

# retourne les coordonees de toutes les stations
#@app.route('/api/gas_station/', methods=['GET'])
#@crossdomain(origin='*')
class GasStationCoordinates(restful.Resource):
    def get(self):
        return mongo.db.gas_station.find({}, { "@id":1, "@latitude":1, "@longitude":1, "@pop":1, "_id":0 })

# retourne les informations relative a une station (id)
class GasStationDetail(restful.Resource):
    def get(self, gas_station_id):
        return mongo.db.gas_station.find_one_or_404({ "@id": gas_station_id }, { "_id":0}) #{ pdv_liste: {pdv: { $-id: gas_station_id } } }

# retourne l'etat du service
class Root(restful.Resource):
    def get(self):
        return {
            'status': 'OK',
            'mongo': str(mongo.db),
        }

@app.route('/')
def index():
    return render_template('index.html')

api.add_resource(Root, '/api/')
api.add_resource(GasStationCoordinates, '/api/gas_station/')
api.add_resource(GasStationDetail, '/api/gas_station/<string:gas_station_id>')
