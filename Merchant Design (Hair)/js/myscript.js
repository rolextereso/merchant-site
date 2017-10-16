$(document).ready(function(){
        			$(window).scroll(function() {
        			console.log($(document).scrollTop());
					  if ($(document).scrollTop() > 425) {
					    $('#promo').addClass('shrink');
					  } else {
					    $('#promo').removeClass('shrink');
					  }
					});
})