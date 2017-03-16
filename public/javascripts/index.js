$(document).ready(function() {
  $( ".close-btn" ).click(function() {
    $( ".alert-banner" ).removeClass("visible");
  });

  $(".ext-button").click(function() {
      $(".call-button").addClass("btn-visible");
      $.cookie('call_button', 'btn-visible');
  });
});

$(".ext-button").addClass($.cookie('call_button'));

 