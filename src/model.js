/*
model.js

This file is required. It must export a class with at least one public function called `getData`

Documentation: https://koopjs.github.io/docs/usage/provider
*/

const request = require('request').defaults({
    gzip: true,
    json: true
})

function Model (koop) {}

// Public function to return data from the
// Return: GeoJSON FeatureCollection
//
// Config parameters (config/default.json)
// req.
//
// URL path parameters:
// req.params.host (if index.js:hosts true)
// req.params.id  (if index.js:disableIdParam false)
// req.params.layer
// req.params.method
Model.prototype.getData = function (req, callback) {

    const orgid = req.params.host;
    const table = req.params.id;
    const query = `select%20*%20from%20(SELECT%20*,ST_AsText(the_geom)%20as%20the_geom_text%20FROM%20${table})%20as%20_cartodbjs_alias`;
    const endpoint = `https://${orgid}.carto.com/api/v1/sql?q=${query}`;
    // console.log(`Endpoint: ${endpoint}`);
    let body = [];

    // Call the remote API with our developer key
    request(endpoint, (err, res, body) => {
        if (err) return callback(err)
    }).on('data', function(chunk) {
        body.push(chunk);
    }).on('end', () => {
        body = JSON.parse(Buffer.concat(body).toString());

        if(body.error){
            console.log(`Error: ${body.error}`);
            return callback(body.error)
        }else{
            // translate the response into geojson
            let geojson = translate(body)

            // Optional: cache data for 10 seconds at a time by setting the ttl or "Time to Live"
            geojson.ttl = 60
            console.log(`CACHE data for ${geojson.ttl} seconds`);

            // Optional: Service metadata and geometry type
            geojson.metadata = {
                title: 'Carto Koop Provider',
                name: 'Carto layer',
                idField: 'OBJECTID',
                description: `Generated from ${endpoint}`,
            }

            // hand off the data to Koop
            // console.log(JSON.stringify(geojson, null, 2))
            callback(null, geojson)
        }
    });
}

function translate(input) {
    const fieldsArray = Object.entries(input.fields).map(e => {return { 'key': e[0], 'value': e[1] }})
    let datefields = fieldsArray.filter(field => (field.value.type === 'date'));
    datefields = datefields.map(datefield => datefield.key);

    // Filter elements without geometry
    input.rows = input.rows.filter(elem => (!isNaN(parseFloat(elem.lng)) || elem.the_geom));

    return {
        type: 'FeatureCollection',
        features: input.rows.map((elem, i) => formatFeature(elem, datefields, i))
    }
}

function formatFeature(inputFeature, dateFields, index) {
    // Most of what we need to do here is extract the longitude and latitude
    let lng, lat;

    if(inputFeature.the_geom_text.indexOf('POINT') != -1){
        // It is a point layer
        const myRegexp = /POINT\((.*)\ (.*)\)/gm;
        const match = myRegexp.exec(inputFeature.the_geom_text);
        lng = parseFloat(match[1]);
        lat = parseFloat(match[2]);
    }

    const feature = {
        type: 'Feature',
        properties: {
            OBJECTID: index + 1,
            ...inputFeature
        },
        geometry: {
            type: 'Point',
            coordinates: [lng, lat]
        }
    };

    // But we also want to translate a few of the date fields so they are easier to use downstream
    dateFields.forEach(field => {
        feature.properties[field] = new Date(feature.properties[field]).toISOString()
    })
    return feature
}

module.exports = Model
