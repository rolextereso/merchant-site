$(document).ready(function(){
        			$(window).scroll(function() {
        				
					  if ($(document).scrollTop() > 425) {
					    $('#promo').addClass('shrink');
					  } else {
					    $('#promo').removeClass('shrink');
					  }
					});
})