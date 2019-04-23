var express = require("express");
var exphbs= require("express-handlebars");
var mongoose= require("mongoose");
var axios = require ("axios")
var cheerio = require("cheerio")
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



app.get("/", function(req, res) {
  Article.find({"saved": false}, function(error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("home", hbsObject);
  });
});


app.get("/article", function(req, res){   
axios.get("https://www.theonion.com/").then(function(response){
        var $ = cheerio.load(response.data);
        var results =[]
        $("h1").each(function(i, element) {
            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");
            
            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
              title: title,
              link: link,
              
            });
            res.json(results)
        })

        });
        
    })

         app.get("/articles", function(req, res) {
  
  db.Article.find()
    .then(function(article){
      res.json(article)
    })
    .catch(function(err){
      res.json(err)
    })

});




app.get("/articles/:id", function(req, res) {
  
  db.Article.findOne({_id: req.params.id}) 
    .populate ("note")
    .then(function(article){
      res.json(article)
}).catch (function(err){
  res.json(err)
})

  
});


app.post("/articles/:id", function(req, res) {
 
  db.Note.create(req.body).then(function(note){
    return db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {note: note._id} }, {new: true})
  })
  .then (function(article){
    res.json(article)
  }).catch(function(err){
    res.json(err)
  })
 
});

 



app.listen(PORT, function(){
    console.log("On Port 8080")
});
