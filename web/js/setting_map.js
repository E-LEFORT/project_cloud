dojo.require("esri.dijit.Popup");
dojo.require("esri.map");
dojo.require("esri.layers.osm");

dojo.require("esri.symbols.SimpleMarkerSymbol");
dojo.require("esri.symbols.SimpleLineSymbol");
dojo.require("esri.Color");

dojo.require("esri.dijit.BasemapToggle")
dojo.require("esri.dijit.Geocoder");
dojo.require("esri.dijit.LocateButton");

var graphic;
var map, osmLayer;
var greenSymbol, blueSymbol;
var layer;

function init() {
  // diviser par 100 000 les données issues de nos datas pour obtenir la latitude  et la longitude désirée

  map = new esri.Map("map", {
    center: [519791 / 100000, 4620114 / 100000], // longitude, latitude
    zoom: 12,
    logo: false,
    basemap: "topo",
    //infoWindow: popup
  });

  var toggle = new esri.dijit.BasemapToggle({
    map: map,
    basemap: "satellite"
  }, "BasemapToggle");
  toggle.startup();

  geocoder = new esri.dijit.Geocoder({
    arcgisGeocoder: {
      placeholder: "Search "
    },
    map: map
  }, "ui-dijit-geocoder");
  geocoder.startup();

  var symbol = new esri.symbol.SimpleMarkerSymbol(
    esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
    12,
    new esri.symbol.SimpleLineSymbol(
      esri.symbol.SimpleLineSymbol.STYLE_SOLID,
      new esri.Color([210, 105, 30, 0.5]),
      8
    ),
    new esri.Color([210, 105, 30, 0.9])
  );

  geoLocate = new esri.dijit.LocateButton({
    map: map,
    symbol: symbol,
    loaded: true,
  }, "LocateButton");

  dojo.connect(map, "onLoad", function() {

    getLocation();

    //Add running route graphics once the map loads
    var picBaseUrl = "images/";
    greenSymbol = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "GreenPin1LargeB.png", 32, 32);
    blueSymbol = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "BluePin1LargeB.png", 32, 32);

    addPointsToMap();

    dojo.connect(map.graphics, "onClick", function(evt) {
      //Retrieve the ID of the Point
      var graphicAttributes = evt.graphic.attributes;

      if (graphicAttributes.ID == null)
        return;

      var title = "Point de ravitaillement " + graphicAttributes.ID;
      //Requête AJAX Avec l'id

      $.ajax({
        type: "GET",
        url: "http://f3b2926cbb.url-de-test.ws/api/gas_station/" + graphicAttributes.ID,
        success: function(response) {

          var content = "<b>Adresse :</b> " + response['adresse'] + "<br/>";
          content += "<b>Ville :</b> " + response['ville'] + "<br/>";

          var len;

          //Section carburant
          var carburants = response['prix'];
          if (carburants != null) {

            len = carburants.length;
            for (var i = 0; i < len; i++) {
              if (i == 0)
                content += "<b>Carburant :</b><br/>";
              entry = response['prix'][i];
              content += entry['@nom'] + " : " + parseInt(entry['@valeur']) / 1000 + " euros<br/>";
            }
          }

          //Section services
          var services = response['services'];
          if (services != null) {

            content += "<b>Services :</b><br/>";
            if (Object.prototype.toString.call(services['service']) === '[object Array]') {
              len = services['service'].length;
              for (var i = 0; i < len; i++) {
                entry = services['service'][i];
                content += entry + "<br/>";
              }
            } else {
              entry = services['service'];
              content += entry + "<br/>";
            }
          }
          map.infoWindow.setContent(content);
        },
        error: function(data) {
          //alert(data + "erreur");
          map.infoWindow.setContent('Error while retriving datas');
        }
      });

      map.infoWindow.setTitle(title);
      map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
    });
  });

  geoLocate.startup();

  //add logic to resize the map when the browser size changes
  dojo.connect(dijit.byId('map'), 'resize', function() {
    resizeMap();
  });
}

function addPointsToMap() {
  $.ajax({
    type: "GET",
    url: "http://f3b2926cbb.url-de-test.ws/api/gas_station/",
    success: function(response) {
      var text = '';
      var len = response.length;
      for (var i = 0; i < len; i++) {
        var symbol;
        entry = response[i];
        if (entry['@pop'] == 'R')
          symbol = greenSymbol;
        if (entry['@pop'] == 'A')
          symbol = blueSymbol;

        addPoint(new esri.geometry.Point(entry['@longitude'] / 100000, entry['@latitude'] / 100000), symbol, entry['@id']);
      }
    },
    error: function(data) {
      alert(data + "erreur");
    }
  });
}

function addPoint(point, symbol, entryID) {
  point = esri.geometry.geographicToWebMercator(point);

  //var graphic = new esri.Graphic(point, symbol);
  var graphic = new esri.Graphic(point, symbol, {
    "ID": entryID
  } /*, infoTemplate*/ );
  map.graphics.add(graphic);
}

//Handle resize of browser
function resizeMap() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    map.resize();
    map.reposition();
  }, 500);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function zoomToLocation(location) {
  var pt = new esri.geometry.Point(location.coords.longitude, location.coords.latitude);
  map.centerAndZoom(pt, 12);
}

function locationError(error) {
  //error occurred so stop watchPosition
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

dojo.ready(init);
