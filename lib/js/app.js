/**
 * Created with JetBrains PhpStorm.
 * User: Richard Brookfield
 * Date: 6/29/13
 * Time: 1:40 AM
 */


// Handle Scrolling and scrollspy padding and offset

$('.navbar li a').click(function(event) {
    event.preventDefault();
    $('html, body').animate({ scrollTop: $(this.hash).offset().top -0}, 500);
});
$('body').scrollspy({offset:0});

//---------------------------------------------------


// Create the ScrollTop button and handle click event

$(document).on('scroll', function(){
    if($(window).scrollTop() > 0){
        $('.top-button').show();
    }
    else{
        $('.top-button').hide();
    }
});

$('.top-button').click(function(){
    $('html, body').animate({ scrollTop: 0});
});