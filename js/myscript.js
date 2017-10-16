$(document).ready(function(){
        			$(window).scroll(function() {
        				
					  if ($(document).scrollTop() > 400) {
					    $('#promo').addClass('shrink');
					  } else {
					    $('#promo').removeClass('shrink');
					  }
					});
})