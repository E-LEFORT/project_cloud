import urllib
import zipfile
import os.path
import os
from subprocess import call

url = 'http://donnees.roulez-eco.fr/opendata/jour'
filename = 'carburant.zip'

# We download the .zip file
testfile = urllib.URLopener()
testfile.retrieve(url, 'tmp/' + filename)

print filename

# We unzip de .zip file previously downloaded
zfile = zipfile.ZipFile('tmp/' + filename)
for name in zfile.namelist():
  (dirname, filename) = os.path.split(name)
  print "Decompressing " + filename + " on " + dirname
  if not os.path.exists('tmp/' + dirname) and not dirname == '':
    os.makedirs('tmp/' + dirname)
  zfile.extract(name, 'tmp/' + dirname)

print os.path.splitext(filename)[0]

# Parsing the xml file to json file
call(["xml2json", "--strip_text", "--strip_newline", "-o", "tmp/out.json", 'tmp/' + os.path.splitext(filename)[0] + ".xml"])

# Making the json file workable by deleting tags pdv_liste and pdv
with open(r'tmp/out.json', 'r') as infile, open(r'tmp/formated.json', 'w') as outfile:
    data = infile.read()
    data = data.replace("{\"pdv_liste\": {\"pdv\": ", "")
    outfile.write(data)

with open("tmp/formated.json", 'rb+') as filehandle:
    filehandle.seek(-2, os.SEEK_END)
    filehandle.truncate()

# Import the .json file
call(["mongo",  "cloud", "--eval", "db.gas_station.drop()"])
call(["mongoimport", "--db", "cloud", "--jsonArray", "--collection", "gas_station", "--file", "tmp/formated.json"])
