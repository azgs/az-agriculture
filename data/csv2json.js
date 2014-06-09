var csv = require("csvtojson").core.Converter;
var fs = require("fs");
var path = require("path");
var _ = require("underscore");

function makeCrop (crop) {
  if (crop === "Lemons") {
    return {"type": crop, "season": ["December", "January", "February", "March"]};
  }
  if (crop === "Olives") {
    return {"type": crop, "season": ["September", "October", "November", "December"]};
  }
  if (crop === "Medjool Dates") {
    return {"type": crop, "season": ["September", "October", "November"]};
  }
  if (crop === "Apples") {
    return {"type": crop, "season": ["July", "August", "September", "October"]};
  }
  if (crop === "Sweet Corn") {
    return {"type": crop, "season": ["July", "August", "September"]};
  }
  if (crop === "Chili Peppers" || crop === "Anaheim Chilis") {
    return {"type": crop, "season": ["August", "September", "October", "November"]};
  }
  if (crop === "Viticultural Grapes") {
    return {"type": crop, "season": ["September", "October"]};
  }
  if (crop === "Romaine Lettuce") {
    return {"type": crop, "season": ["December", "January", "February", "March", "April", "May"]};
  }
  if (crop === "Lavender") {
    return {"type": crop, "season": ["May", "June", "July"]};
  }
  if (crop === "Pumpkins") {
    return {"type": crop, "season": ["October", "November", "December"]};
  }
  if (crop === "Honey") {
    return {"type": crop, "season": []};
  }
}

function makeParent (obj) {
  return { 
    "type" : "FeatureCollection",
    "features": obj,
  }
}

function makeChild (obj) {
  var crops = obj["Crop"].split(";");  
  var cropSeasons = _.map(crops, function (crop) {
    return makeCrop(crop.trim());
  });
  console.log(cropSeasons)
  return { 
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [
        parseFloat(obj["Long"]), 
        parseFloat(obj["Lat"])
      ]
    },
    "properties": {
      "crop": cropSeasons,
      "source": obj["Farm/Grower"],
      "street": obj["Location"],
      "area": obj["Area"],
      "lat": parseFloat(obj["Lat"]),
      "lon": parseFloat(obj["Long"]),
      "owner": obj["Owner"],
      "website": obj["Website"],
      "phone": obj["Contact"],
      "email": obj["Email"],
      "store": obj["You pick?"].split(";"),
      "hours": obj["Hours of operation"],
      "notes": obj["Notes"],
    }
  }
};

var csvPath = path.join(__dirname, "upickfarmv1.csv");
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