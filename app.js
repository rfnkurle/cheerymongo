var express = require("express");
var exphbs= require("express-handlebars");
var mongoose= require("mongoose");
var axios = require ("axios")
var cheerio = require("cheerio")
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

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
        
        var results =[];
        $(".js_post_item").each(function(i, element) {
            
             var link = $(element).children("header").children("h1").children("a").attr("href");
            var title = $(element).children("header").children("h1").children("a").text();
            var summary = $(element).children(".js_item-content").children(".entry-summary").children("p").text();
            // Save these results in an object that we'll push into the results array
            results.push({
              title: title,
              link: link,
              summary: summary
              
            });
            console.log(results)
                         

        });
        
        res.json(results)
        
        // res.render("index", results);
        });
        
    });


         
app.get("/article", function(req, res) {
  
  db.Article.find()
    .then(function(article){
      res.json(article)
    })
    .catch(function(err){
      res.json(err)
    })

});




app.get("/article/:id", function(req, res) {
  
  db.Article.findOne({_id: req.params.id}) 
    .populate ("notes")
    .then(function(article){
      res.json(article)
}).catch (function(err){
  res.json(err)
})

  
});


app.post("/article/:id", function(req, res) {
 
  db.Note.create(req.body).then(function(notes){
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
