var csv = require("csvtojson").core.Converter;
var fs = require("fs");
var path = require("path");
var _ = require("underscore");

function makeCrop (crop) {
  if (crop === "Lemons") {
    return {"type": crop, "months": ["December", "January", "February", "March"], "seasons": ["Winter", "Spring"]};
  }
  if (crop === "Olives") {
    return {"type": crop, "months": ["September", "October", "November", "December"], "seasons": ["Fall", "Winter"]};
  }
  if (crop === "Medjool Dates") {
    return {"type": crop, "months": ["September", "October", "November"], "seasons": ["Fall"]};
  }
  if (crop === "Apples") {
    return {"type": crop, "months": ["July", "August", "September", "October"], "seasons": ["Summer", "Fall"]};
  }
  if (crop === "Sweet Corn") {
    return {"type": crop, "months": ["July", "August", "September"], "seasons": ["Summer", "Fall"]};
  }
  if (crop === "Chili Peppers") {
    return {"type": crop, "months": ["August", "September", "October", "November"], "seasons": ["Summer", "Fall"]};
  }
  if (crop === "Viticultural Grapes") {
    return {"type": crop, "months": ["September", "October"], "seasons": ["Fall"]};
  }
  if (crop === "Romaine Lettuce") {
    return {"type": crop, "months": ["December", "January", "February", "March", "April", "May"], "seasons": ["Winter", "Spring"]};
  }
  if (crop === "Lavender") {
    return {"type": crop, "months": ["May", "June", "July"], "seasons": ["Spring", "Summer"]};
  }
  if (crop === "Pumpkins") {
    return {"type": crop, "months": ["October", "November", "December"], "seasons": ["Fall", "Winter"]};
  }
  if (crop === "Honey") {
    return {"type": crop, "months": [], "seasons": []};
  }
}

function makeParent (obj) {
  return { 
    "type" : "FeatureCollection",
    "features": obj,
  }
}

function makeChild (obj) {
  var crops
    , cropSeasons
    , images
    ;

  crops = obj["Crop"].split(";");  
  cropSeasons = _.map(crops, function (crop) {
    return makeCrop(crop.trim());
  });
  images = obj["Images"].split(";");

  return { 
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [
        parseFloat(obj["Long"]), 
        parseFloat(obj["Lat"])
      ]
    },
    "properties": {
      "uid": Math.floor(Math.random()*10000000),
      "crop": cropSeasons,
      "source": obj["Farm/Grower"],
      "street": obj["Location"],
      "area": obj["Area"],
      "lon": parseFloat(obj["Long"]),
      "lat": parseFloat(obj["Lat"]),
      "owner": obj["Owner"],
      "website": obj["Website"],
      "phone": obj["Contact"],
      "email": obj["Email"],
      "store": obj["You pick?"].split(";"),
      "hours": obj["Hours of operation"],
      "notes": obj["Notes"],
      "images": images,
    }
  }
};

var csvPath = path.join(__dirname, "upickfarms.csv");
var jsonPath = path.join(__dirname, "farms.json");

var fileStream = fs.createReadStream(csvPath);
var csvConverter = new csv({constructResult:true});

csvConverter.on("end_parsed", function (obj) {
  var features = _.map(obj, function (d) {
    var child = makeChild(d);
    if (child["properties"]["source"].length > 1) {
      return child;        
    }
  });

  var featureList = [];
  var cleanedFeatures = _.map(features, function (feature) {
    if (typeof(feature) !== "undefined") {
      featureList.push(feature);
    }
  });

  var json = makeParent(featureList);
  var writeJson = JSON.stringify(json);

  fs.writeFile(jsonPath, writeJson, function (err, res) {
    if (err) console.log(err);
    else console.log(jsonPath);
  });
});

fileStream.pipe(csvConverter);