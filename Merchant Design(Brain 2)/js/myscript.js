$(document).ready(function(){
        			$(window).scroll(function() {
        				
					  if ($(document).scrollTop() > 350) {
					    $('#promo').addClass('shrink');
					  } else {
					    $('#promo').removeClass('shrink');
					  }
					});
})