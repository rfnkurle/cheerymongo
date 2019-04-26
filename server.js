var express = require("express");
var exphbs= require("express-handlebars");
var mongoose= require("mongoose");
var axios = require ("axios")
var cheerio = require("cheerio")
var db = require("./models");



var app = express();
app.use(express.static("public"));

// Connect Handlebars to our Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
//
//set to mongoDB server instead of local host
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

var PORT = process.env.PORT || 8080



app.use(express.json());
app.use(express.urlencoded({extended: false}));

var routes = require("./routes/APIroutes.js");
app.use(routes)






app.get("/article", function(req, res){   
axios.get("https://www.theonion.com/").then(function(response){
        var $ = cheerio.load(response.data);
        
        var results ={
            articles: []
        };
        $(".js_post_item").each(function(i, element) {
            
             results.link = $(this).children("header").children("h1").children("a").attr("href");
            results.title = $(this).children("header").children("h1").children("a").text();
            results.summary = $(this).children(".js_item-content").children(".entry-summary").children("p").text();
            // Save these results in an object that we'll push into the results array
            
            results.articles.push({
                title: results.title,
                link: results.link,
                summary: results.summary,
                
              });
            
            db.Article.create(results)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
         
            // console.log(results)
                        
        });
       

        // res.json(results)
        res.render("index", {results});
         
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


//have to wire these up right to take in notes correctly

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
    console.log("On Port ...")
});


