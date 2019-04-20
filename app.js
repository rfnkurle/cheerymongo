var express = require("express");
var exphbs= require("express-handlebars");
var mongoose= require("mongoose");

var PORT = process.env.PORT || 8080

var app = express();
app.use(express.static("public"));

// Connect Handlebars to our Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

var routes = require("./routes/APIroutes.js");
app.use(routes)

app.listen(PORT, function(){
    console.log("On Port 8080")
});
