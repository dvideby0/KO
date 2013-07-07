/**
 * Created with JetBrains PhpStorm.
 * User: Richard Brookfield
 * Date: 6/29/13
 * Time: 1:40 AM
 */


// Handle Scrolling and scrollspy padding and offset

$('.navbar li a, #register-btn').click(function(event) {
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

// Countdown Timer code

$(function(){

    var ts = new Date(2013, 25, 9),
        newYear = true;

    if((new Date()) > ts){
        // The new year is here! Count towards something else.
        // Notice the *1000 at the end - time must be in milliseconds
        ts = (new Date()).getTime() + 10*24*60*60*1000;
        newYear = false;
    }

    $('#countdown').countdown({
        timestamp	: ts,
        callback	: function(days, hours, minutes, seconds){
        }
    });

});


$('form').tooltip({
    selector: '[rel="tooltip"]'
});

$("form :input").jqBootstrapValidation({
    submitSuccess: function($form, event){
        var form = $('#registration-form');
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8867',
            data: form.serialize(),
            success: function(data)
            {
                $('.center').notify({
                    message: { text: data },
                    type: 'bangTidy',
                    closable: false
                }).show();
            }
        });
        event.preventDefault();
    }
});

