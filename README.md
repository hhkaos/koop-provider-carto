# koop-provider-carto

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [How to build the service URL](#how-to-build-the-service-url)
  - [From a basic viewer](#from-a-basic-viewer)
  - [From a builder viewer](#from-a-builder-viewer)
  - [From public datasets](#from-public-datasets)
- [Run locally](#run-locally)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

This provider allows you to transform layers hosted on Carto servers to ArcGIS Feature Layer so you can use it within ArcGIS SDKs, web maps and web scenes.

## Live demos

A demo server has been deployed to now.sh for testing purposes: [https://demo-app-nrqueszwed.now.sh/koop-provider-carto/](https://demo-app-nrqueszwed.now.sh/koop-provider-carto/)

|Original dataset|Koop service|Preview in ArcGIS.com|
|---|---|---|
|[Fee leaf members](https://fee.carto.com/viz/f6a3b484-217e-11e5-92cb-0e853d047bba/embed_map?wmode=opaque)|[Raw data](https://demo-app-nrqueszwed.now.sh/koop-provider-carto/rest/services/fee/leaf_members/FeatureServer/0/query)|[ArcGIS web map](https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=https://demo-app-nrqueszwed.now.sh/koop-provider-carto/rest/services/fee/leaf_members/FeatureServer/0)
|[Fee green sites](https://fee.carto.com/builder/5459e116-668a-11e5-9e6d-0e5b35a699a7/embed)|[Raw data](https://demo-app-nrqueszwed.now.sh/koop-provider-carto/rest/services/fee/fee.green_key_sites/FeatureServer/0)|[ArcGIS web map](https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=https://demo-app-nrqueszwed.now.sh/koop-provider-carto/rest/services/fee/fee.green_key_sites/FeatureServer/0)|
|[Twitter t3chfest reduced](https://common-data.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20twitter_t3chfest_reduced)|[Raw data](https://demo-app-nrqueszwed.now.sh/koop-provider-carto/rest/services/common-data/twitter_t3chfest_reduced/FeatureServer/0)|[ArcGIS web map](https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=https://demo-app-nrqueszwed.now.sh/koop-provider-carto/rest/services/common-data/twitter_t3chfest_reduced/FeatureServer/0)|


## How to build the service URL

### From a basic viewer

On this example we are going transform the data from this [basic viewer](https://fee.carto.com/viz/f6a3b484-217e-11e5-92cb-0e853d047bba/embed_map?wmode=opaque) to an ArcGIS Feature Service format.

We have to check the network request and filter by the string `select`. It will display **an URL** similar to `https://fee.carto.com/api/v1/map?stat_tag=...` like this one:

```
https://fee.carto.com/api/v1/map?stat_tag=f6a3b484-217e-11e5-92cb-0e853d047bba&config=%7B%22version%22%3A%221.0.1%22%2C%22stat_tag%22%3A%22f6a3b484-217e-11e5-92cb-0e853d047bba%22%2C%22layers%22%3A%5B%7B%22type%22%3A%22cartodb%22%2C%22options%22%3A%7B%22sql%22%3A%22SELECT%20*%20FROM%20leaf_members%22%2C%22cartocss%22%3A%22%2F**%20simple%20visualization%20*%2F%5Cn%5Cn%23leaf_members%7B%5Cn%20%20marker-fill-opacity%3A%200.9%3B%5Cn%20%20marker-line-color%3A%20%23FFF%3B%5Cn%20%20marker-line-width%3A%201.5%3B%5Cn%20%20marker-line-opacity%3A%201%3B%5Cn%20%20marker-placement%3A%20point%3B%5Cn%20%20marker-type%3A%20ellipse%3B%5Cn%20%20marker-width%3A%2020%3B%5Cn%20%20marker-fill%3A%20%2386bc24%3B%5Cn%20%20marker-allow-overlap%3A%20true%3B%5Cn%7D%22%2C%22cartocss_version%22%3A%222.1.1%22%2C%22interactivity%22%3A%5B%22cartodb_id%22%5D%2C%22attributes%22%3A%7B%22id%22%3A%22cartodb_id%22%2C%22columns%22%3A%5B%22address%22%2C%22amount_primary_school%22%2C%22amount_students%22%2C%22amount_teachers%22%2C%22country%22%2C%22international_organisation_name%22%2C%22lat%22%2C%22lng%22%2C%22local_organisation_name%22%2C%22national_operator_email%22%2C%22national_operator_name%22%2C%22national_operator_phone%22%2C%22number_of_trees_planted_during_the_academic_year%22%2C%22web%22%2C%22year_joined_leaf%22%2C%22total_number_of_schools%22%2C%22total_number_of_students%22%2C%22total_number_of_teachers%22%5D%7D%7D%7D%5D%7D&callback=_cdbc_1290352312_1
```

> **Note**: it could also be something like this `https://orgid.carto.com/api/v1/sql?q=select...`, on this case we can also use `decodeUriComponent` and get the tableName from there.

If we use the `decodeURIComponent` JavaScript function to decode **this URL** we will find a `config` parameter with a JSON object. Inside this object, there is a `layers` property, and within the `options` key we will find a `sql` key with the name of a table that we need.

We just have to use this tableName and the subdomain of that URL to compose our koop URL like this:

http://localhost:8080/koop-provider-carto/rest/services/**subdomain**/**tableName**/FeatureServer/0?f=json

So it will look like this:

* Sample 1: [http://localhost:8080/koop-provider-carto/rest/services/fee/new_school_members/FeatureServer/0/query](http://localhost:8080/koop-provider-carto/rest/services/fee/new_school_members/FeatureServer/0/query)
* Sample 2: [http://localhost:8080/koop-provider-carto/rest/services/fee/leaf_members/FeatureServer/0/query](http://localhost:8080/koop-provider-carto/rest/services/fee/leaf_members/FeatureServer/0/query)

Now we are ready to load this data into a webmap removing the `query` operation, something like this:

* [https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=http://localhost:8080/koop-provider-carto/rest/services/fee/new_school_members/FeatureServer/0](https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=http://localhost:8080/koop-provider-carto/rest/services/fee/new_school_members/FeatureServer/0)
* [https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=http://localhost:8080/koop-provider-carto/rest/services/fee/leaf_members/FeatureServer/0](https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=http://localhost:8080/koop-provider-carto/rest/services/fee/leaf_members/FeatureServer/0)

### From a builder viewer

Open the source code a look for the `table_name` variable properties. This will provide you a table names you will need. For example on [this page](https://fee.carto.com/builder/5459e116-668a-11e5-9e6d-0e5b35a699a7/embed) you will find something like `{\"table_name\":\"fee.green_key_sites\"}`, so you will have to use the same subdomain of the page (in this case `fee`) and the `table_name`: `fee.green_key_site`, like this:

[http://localhost:8080/koop-provider-carto/rest/services/fee/fee.green_key_sites/FeatureServer/0/query](http://localhost:8080/koop-provider-carto/rest/services/fee/fee.green_key_sites/FeatureServer/0/query)

Preview on ArcGIS Online:

[https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=http://localhost:8080/koop-provider-carto/rest/services/fee/fee.green_key_sites/FeatureServer/0](https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=http://localhost:8080/koop-provider-carto/rest/services/fee/fee.green_key_sites/FeatureServer/0)


### From public datasets

Like [this one called "twitter_t3chfest_reduced"](https://common-data.cartodb.com/api/v2/sql?q=select%20*%20from%20(SELECT%20*%20FROM%20%22twitter_t3chfest_reduced)%22%20as%20_cartodbjs_alias). You can use the same approach and build something like this:

[http://localhost:8080/koop-provider-carto/rest/services/common-data/twitter_t3chfest_reduced/FeatureServer/0](http://localhost:8080/koop-provider-carto/rest/services/common-data/twitter_t3chfest_reduced/FeatureServer/0)

Preview on ArcGIS Online:

[https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=http://localhost:8080/koop-provider-carto/rest/services/common-data/twitter_t3chfest_reduced/FeatureServer/0](https://www.arcgis.com/home/webmap/viewer.html?source=sd&panel=gallery&suggestField=true&url=http://localhost:8080/koop-provider-carto/rest/services/common-data/twitter_t3chfest_reduced/FeatureServer/0)

## Run locally

Open a terminal, move to the project folder and execute:

* `npm install` to install dependencies
* `npm start` to start the local server
