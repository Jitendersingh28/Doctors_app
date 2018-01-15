var express = require("express");
var app     = express();
var bodyParser = require("body-parser");
var request=require("request");
//var mongoose = require("mongoose");
//var config = require("./config");
var cruddoc = require("./cruddoc");

// var doc = mongoose.connect('mongodb://localhost/docs', {
//   useMongoClient: true,
// });
// mongoose.Promise = global.Promise;
/*
var area = mongoose.connect('mongodb://localhost/areas', {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;


// var docSchema = new mongoose.Schema({
//   name:String,
//   type:String,
//   locname:String,
//   phone_no:Number,
//   loc:[locSchema]
// });

  

//var locSchema = new mongoose.Schema({
//loc: { point:{ type: [Number], index: '2dsphere'} }});
let locSchema = new mongoose.Schema({
  name : { type: String },
  category : { type: String }, 
  location : {
    coordinates: { type: [Number], index: '2dsphere' }
  }
});

var AreaModel =mongoose.model("areas",locSchema);
mongoose.connect('mongodb://localhost/areas',{
  useMongoClient: true
  /* other options */
//});
//*/
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/views'));

app.get("/",function(req,res){
	res.render("home");
});
app.get('/login',function(req, res){
    res.render('login');
   });
app.get('/doctorlogin',function(req, res){
    res.render('doclogin');
   });
app.get('/doctors',function(req,res){
var query=req.query.address;
var url ='https://maps.googleapis.com/maps/api/geocode/json?address='+query;
request(url, function (error, response, body) {
var data=JSON.parse(body);
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
  //var a=data.results[0].geometry.location.lat;
  //var b=data.results[0].geometry.location.lng;
console.log(data.results[0].geometry.location.lat);
console.log(data.results[0].geometry.location.lng);
var a=data.results[0].geometry.location.lng;
var b=data.results[0].geometry.location.lat;
var category='';
var cr = cruddoc.createArea(query,category,a,b);
//areas.create({"loc" : { "coordinates" : [b,a], "type" : "point" }});
//areas.create(point:{type:[b,a],index:'2dsphere'});
//areas.ensureIndex({loc:"2dsphere"});
console.log(cr);
res.redirect("home");
});
});

app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
