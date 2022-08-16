$('.cr-aboutus-top .img-thumb').on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();

  var posTop = $('.date-search-area').next('h3').offset().top;

  $('html')
    .stop()
    .animate(
      {
        scrollTop: posTop - $('header').height() + 'px',
      },
      300
    );
});
