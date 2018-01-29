var express = require("express");
var app     = express();
var bodyParser = require("body-parser");
var request=require("request");
var cruddoc = require("./cruddoc");


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
  console.log('error:', error); 
  console.log('statusCode:', response && response.statusCode); 
console.log(data.results[0].geometry.location.lat);
console.log(data.results[0].geometry.location.lng);
var a=data.results[0].geometry.location.lng;
var b=data.results[0].geometry.location.lat;
var radius = 30 * 1000 ;
var cr = cruddoc.findNearByAreas(a,b,radius,function(data){
    console.log(data);
});

//var xy= cruddoc.findArea(cr);
//console.log(xy);
});
});
app.get("/doctors/new",function(req,res){
  res.render("newdoctor");
});
app.post('/doctors/new',function(req, res){
    //res.render('newdoctor');
    var query = req.body.location;
    var docname=req.body.doctor.docname;
    var category=req.body.doctor.category;
    var mobileno=req.body.doctor.mobileno;
    //var add=req.body.doctor.location;
    //console.log(req.body.doctor.docname);
    //console.log(req.body.doctor.category);
    console.log(req.body.location);
    console.log(query);
var url ='https://maps.googleapis.com/maps/api/geocode/json?address='+query;
request(url, function (error, response, body) {
var data=JSON.parse(body);
  console.log('error:', error); 
  console.log('statusCode:', response && response.statusCode); 
console.log(data.results[0].geometry.location.lat);
console.log(data.results[0].geometry.location.lng);
var a=data.results[0].geometry.location.lng;
var b=data.results[0].geometry.location.lat;
var cr = cruddoc.createArea(docname,query,mobileno,category,a,b);
console.log(cr);
   });
});
app.listen(3000, function(){
  console.log('Server listening on port 3000');
});
