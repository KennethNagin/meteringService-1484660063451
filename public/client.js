// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(document).ready(function() {

  $("#getKey").click(function(){
	$('#status').val("");
	$('#keyValue').val("");
  	$.get("/getKey/"+$('#key').val(), function(result) {
    	$('#keyValue').val(result.message);
    	$('#status').val(result.status);
	});
  });
   

  $("#setKey").click(function(){
	$('#status').val("");
	var data = {};
	data.keyValue = $('#keyValue').val();
    $.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
            url: '/setKey/'+$('#key').val(),						
            success: function(result) {
                console.log('success');
				$('#status').val(result.status);
            },
            error: function(result) {
                console.log('error');
				$('#status').val(result.status);
            }
     });

  });




 
 

});

 
