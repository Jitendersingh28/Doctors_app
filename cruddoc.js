//'use strict';
var mongoose = require("mongoose");
var area = mongoose.connect('mongodb://localhost/areas', {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;

let locSchema = new mongoose.Schema({
docname: { type : String},	
  name : { type: String },
  mobilno:{type : String},
  category : { type: String }, 
  location : {
    coordinates: { type: [Number], index: '2dsphere' }
  }
});


var AreaModel =mongoose.model("areas",locSchema);
mongoose.connect('mongodb://localhost/areas',{
  useMongoClient: true
  /* other options */
});
var bapu={}
//CRUD operations

var createArea = function(docname,name,mobileno,category, long, lat) {
	let query = {
		docname:docname,
		name:name,
		mobileno:mobileno,
		category:category,
		location: {
			coordinates: [long, lat] 
		}
	};
	return AreaModel.create(query)
		.then(function(result){
			return result;
		});
};
let namu=""
var findArea = function(query) {
	return AreaModel.find(query)
		.then(function(result){
			return result;
		})
};

var finddr = function(name){
	return AreaModel.find(name)
	.then(function(result){
		return result;
	})
};


var updateArea = function(findQuery, setQuery) {
	let updateQuery = {
		"$set" : setQuery
	};
	return AreaModel.update(findQuery, setQuery)
		.then(function(result){
			return result;
		});

};

var deleteArea = function(query) {
	return AreaModel.remove(query)
		.then(function(result){
			return result;
		});
};

//GeoNear query
/**
 * findNearByAreas will find nearby areas around given longitude and latitude
 * @param  {[Number]} longitude 
 * @param  {[Number]} latitude 
 * @param  {[Number]} radius in meters  
 * @return {[Object]} nearby area documents          
 */
var findNearByAreas = function(longitude, latitude, radiusInMtrs,callback) {
	var geoNearQuery = {
		docname:"",
		name:"",
		mobileno:"",
		category:"",
		spherical: true,
		maxDistance: radiusInMtrs, 
		distanceMultiplier: 0.001, //to convert back into KMs otherwise it will give in mtrs
		near: {
      		type: 'Point',
      		coordinates: [longitude, latitude]
    	},
    	distanceField: 'calculatedDistance'
	};
	console.log(JSON.stringify(geoNearQuery));
	  AreaModel.aggregate([{'$geoNear' : geoNearQuery}]).exec()
		.then(function(results) {
			//console.log(results);
			callback(results);
		
		})
};

bapu['createArea'] = createArea
bapu['findArea'] = findArea
bapu['updateArea'] = updateArea
bapu['deleteArea'] = deleteArea
bapu['findNearByAreas'] = findNearByAreas
bapu['finddr']=finddr
module.exports=bapu;
/*
//Run functions
const NAME = "test_delhi_center";
const CATEGORY = "test_category";
const UPDATED_CATEGORY = "test_category_update_1";
const DELHI_LONG = 77.1209;
const DELHI_LAT = 28.6415;
*/
//Test case 1

/*createArea(NAME, CATEGORY, DELHI_LONG, DELHI_LAT)
 	.then(function(result){
 		console.log('Create Result' , result);
 		let findQuery  = {
 			name: NAME,
 			category: CATEGORY
 		};
 		return findArea(findQuery);
 	})
 	.then(function(result){
 		console.log('Find result', result);
 		let updateFindQuery = {
 			name: NAME,
 			category: CATEGORY
 		};
 		let updateQuery = {
 			category: UPDATED_CATEGORY
 		};
 		return updateArea(updateFindQuery, updateQuery);
 	})
 	.then(function(result){
 		console.log('Update result', result);
 		let findQuery = {
 			name: NAME,
 			category: UPDATED_CATEGORY
 		};
 		return deleteArea(findQuery);
 	})
 	.then(function(result){
 		console.log('deleteArea result', result.result);
 		return result;
 	})

*/
// //Test Case 2 - CreateManyAreas

 /*const COORDINATES_COLLECTION = [[77.2167, 28.6315],[77.1873, 28.4817], [77.0680, 28.6663], [77.3178, 28.4089]];
 for(let i = 0; i < COORDINATES_COLLECTION.length; ++i) {
 	let testName = NAME + "_" + i;
 	let testCategory = CATEGORY + "_" + i;
 	let long = COORDINATES_COLLECTION[i][0];
 	let lat = COORDINATES_COLLECTION[i][1];
 	createArea(testName, testCategory, long, lat)
 		.then(function(result){
 			console.log('Create Result' , result);
 			return result;
 		});
 }
*/
/*
// //Test Case 3 - GEONEAR

 let RADIUS = 30 * 1000;
 findNearByAreas(DELHI_LONG, DELHI_LAT, RADIUS)
 	.then(function(results) {
 		console.log('NearByAreas - ', results);
 		return results;
 	});
 	*/