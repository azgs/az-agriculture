## Arizona Farm Stands and U-Pick Farms Map
============

This web map application showcases Arizona farm stands and U-pick farms which produce 10 specialty crops.
- Apples
- Chili Peppers
- Honey
- Lavender
- Lemons
- Medjool Dates
- Olives
- Pumpkins
- Romaine Lettuce
- Sweet Corn

##Development Setup

### Prerequisites

> [node.js](http://nodejs.org/)

### Installation

    > npm install

### Convert Farms CSV Data to JSON

    > cd data/
    > node csv2json.js

Data will be at http://localhost:3000/farms.json once server is started below

### Running for Development

    > node server.js

Go to http://localhost:3000/

### Production Setup
- Change the server location for the json data in `app.serviceUrl` to point to the production server.
- Change the basemap link.