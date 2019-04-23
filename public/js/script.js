
$(document).ready(function(){
    $(".scrape-btn").on("click", function(){
        console.log("click")
        $.ajax({
            url: "/article",
            type: "GET"
            }).then(function(scrapeResults){
            console.log(scrapeResults)
            })
    })
});