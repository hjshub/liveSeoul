/*****
 creater main
**** */
var crVisSwiper = new Swiper('.cr-vis-swiper', {
  // Optional parameters
  loop: true,
  speed: 600,
  centeredSlides: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },
  autoplay: {
    delay: 5000,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  slidesPerView: 1,
  debugger: true, // Enable debugger
});

crVisSwiper.on('activeIndexChange', function (swiper) {
  setTimeout(function () {
    var currentVd = document.querySelector('.cr-vis-swiper .swiper-slide-active video'),
      notCurrentvd = $('.cr-vis-swiper .swiper-slide:not(.swiper-slide-active) video').get(),
      animate = $('.cr-vis-swiper .swiper-slide-active .animate').get(),
      animate_ = $('.cr-vis-swiper .swiper-slide:not(.swiper-slide-active) .animate').get();

    animate_.forEach(function (elem) {
      $(elem).removeClass('animation--start');
    });
    animate.forEach(function (elem) {
      $(elem).addClass('animation--start');
    });
    notCurrentvd.forEach(function (elem) {
      elem.pause();
      $(elem).prop('currentTime', 0);
    });
  }, 100);
});

var $crVisSwiper_playBtn = $('.cr-vis-swiper .swiper-playBtn');

$crVisSwiper_playBtn.click(function () {
  if ($(this).hasClass('play')) {
    crVisSwiper.autoplay.stop();
    $(this).text('재생').removeClass('play').addClass('stop');
  } else {
    crVisSwiper.autoplay.start();
    $(this).text('멈춤').removeClass('stop').addClass('play');
  }
});

var animate = $('.cr-vis-swiper .swiper-slide-active .animate').get();

setTimeout(function () {
  animate.forEach(function (elem) {
    $(elem).addClass('animation--start');
  });
}, 100);
