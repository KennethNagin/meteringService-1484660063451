// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(document).ready(function() {
  $("#sb").click(function(){
  	$.get("/string", function(string) {
    	$('#txtString').val(string);
	});
  });

  $("#sb2").click(function(){
  	$.get("/key", function(string) {
    	$('#txtString2').val(string);
	});
  }); 
 

});
