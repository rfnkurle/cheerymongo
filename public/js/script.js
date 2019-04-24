
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

$(document).on("click", ".save", function(event){
    var data = {
      title: $(this).attr("data-title"),
      link: $(this).attr("data-link"),
      summary: $(this).attr("data-summary"),
    };
    $.ajax({
      method: "POST",
      url: "/savedarticles",
      data: data
    }).done(function(result){
      location.reload();
    }).fail(function(xhr, responseText, responseStatus){
      if (xhr){
        console.log(xhr.responseText);
      };
    });
  });