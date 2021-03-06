console.log("firstExpressApp");
var express = require("express");
var app = express();


app.get("/", function(req, res){
  res.send("Hi there");
});

app.get("/bye", function(req, res){
	res.send("Goodbye");
})

app.get("/r/:subredditName", function(req, res){
	res.send("Welcome to subreddit " + req.params.subredditName);
});

app.get("*", function(req, res){
	res.send("Catchall");
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
})







