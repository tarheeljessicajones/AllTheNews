var num = 0;
var articleTotal = 0;
var articleID = 0;


//GET articles
$.getJSON('/articles', function(data) {
  
  articleTotal = data.length;
  $('#articles').append('<p data-id="' + data[num]._id + '">' + '<a href="' + data[num].link + '" target="_blank">' + data[num].title + '</a><br />'+ data[num].blurb + '</p>');
  articleID = data[num]._id;
  console.log(articleID);
});

$('#checknote').on('click', function(){


  $.ajax({
    method: "GET",
    url: "/articles/" + articleID,
  })
    .done(function( data ) {
      console.log(data);
      if(data.note){
        $('#saved').append('<strong>' + data.note.title + '</strong><br>' + data.note.body + '<br>');
      }
      else{
        $('#saved').empty();
      }
    });
});

$(document).on('click', '#savenote', function(){
 

  $.ajax({
    method: "POST",
    url: "/articles/" + articleID,
    data: {
      title: $('#titleinput').val(), 
      body: $('#bodyinput').val() 
    }
  })
   
    .done(function( data ) {
      console.log(data);
      $('#notes').empty();
    });

  $('#titleinput').val("");
  $('#bodyinput').val("");
});

$('#deletenote').on('click', function(){
 
  //POST model
  $.ajax({
    method: "POST",
    url: "/articles/" + articleID,
    data: {
      title: null,
      body: null
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#saved').empty();
    });
});