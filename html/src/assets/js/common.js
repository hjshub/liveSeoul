//
//-----------------------------------------------------------------
// 공통 스크립트
//-----------------------------------------------------------------
//

'use strict';

var _gb = function () {
    this.wW = window.innerWidth;
    this.wH = window.innerHeight;
    this.html = $('html');
    this.body = $('body');
    this.layout = $('#layout');
    this.main = $('main');
    this.wrap = $('.wrap');
    this.header = $('#gnb');
    this.allMenu = $('#allMenu');
    this.topBanner = $('#top-banner');
    this.lpop = $('#lpop');
    this.footer = $('footer');
    this.tabMenu = $('.tab-menu');
    this.mobTabMenu = $('.mob-tabMenu');
    this.vdSwiper = $('.vd-swiper').get();
    this.tabSwiper = $('.tab-swiper').get();
    this.vdContainer = $('.vd-container');
    this.liveOnAir = $('.liveOnAir');
    this.btnActiveModal = $('.button-active-modal');
    this.isMob = this.wW <= 768 ? true : false;
    this.isMobTab = false;
    this.vdMiniPlayer = false;
  },
  gb = new _gb();

window.addEventListener('load', function () {
  commonFunction().init();

  if (gb.main.length) {
    if (!gb.html.hasClass('onAir')) {
      commonFunction().MainSwiper();
    }
    commonFunction().showOnLayer();
    commonFunction().setTopbnr();
    commonFunction().setPop();
  }

  if (gb.vdSwiper.length) commonFunction().VdSwiper();
  if (gb.tabSwiper.length) commonFunction().TabSwiper();
  if ($('.cr-vis-swiper').length) commonFunction().CrVisSwiper();
  if ($('.list-filter-swiper').length) commonFunction().FilterSwiper();
  if ($('.keyword-swiper').length) commonFunction().KeywordSwiper();
  if ($('.keyword-swiper2').length) commonFunction().KeywordSwiper2();
  if ($('.weeklyLive-swiper').length) commonFunction().weeklyLiveSwiper();
  if ($('.sort-inner').length) commonFunction().setCurList();
  if ($('.previewOn').length) commonFunction().PreviewOn();
});

function commonFunction() {
  var commonFunction_ = new gb.CommonFunction();

  return commonFunction_;
}

(function ($) {
  gb.CommonFunction = function () {
    var setGnb = function () {
        // 헤더
        if (gb.main.length) {
          gsap.to('main', { y: 0, duration: 0.5, delay: 0.3 });
          gsap.to('#gnb', { y: 0, opacity: 1, duration: 0.5, delay: 0.4 });
        }

        if (document.documentElement.scrollTop >= 92) {
          gb.html.addClass('fixed');
        } else {
          gb.html.removeClass('fixed');
        }

        $('.button-open-schLayer').on('click', function () {
          var trg = $(this);

          if (trg.hasClass('open')) {
            trg.removeClass('open');
            trg.next('.search-pop').stop().slideUp(300);
          } else {
            trg.addClass('open');
            trg.next('.search-pop').find('input[type=text]').val('');
            trg.next('.search-pop').stop().slideDown(300);
          }
        });

        $('.button-open-allMenu').on('click', function () {
          gb.allMenu.stop().animate(
            {
              right: 0,
            },
            300
          );

          gb.layout.css({
            height: '100vh',
            'overflow-y': 'hidden',
          });
          $('#reCommendList').css('z-index', 1);
        });

        $('.button-close-allMenu').on('click', function () {
          gb.allMenu.stop().animate(
            {
              right: '-100%',
            },
            300
          );

          if (!$('.button-open-sideMenu').hasClass('active')) {
            gb.layout.css({
              height: 'auto',
              'overflow-y': 'visible',
            });
            $('#reCommendList').css('z-index', 1001);
          }
        });

        gb.allMenu.find('.depth1 > li > button').each(function () {
          var trg = $(this);

          if (trg.hasClass('on')) {
            trg.next('.box').css('display', 'block');
          }

          trg.on('click', function () {
            if (trg.hasClass('on')) {
              trg.removeClass('on');
              trg.next('.box').slideUp(300);
            } else {
              gb.allMenu.find('.depth1 > li > button').removeClass('on');
              gb.allMenu.find('.depth1 > li > button').next('.box').slideUp(300);
              trg.addClass('on');
              trg.next('.box').slideDown(300);
            }
          });
        });

        $('.dropDown .item > a').on({
          'mouseenter focusin': function () {
            var trg = $(this);

            $('.dropDown .item').removeClass('on');
            $('.dropDown .item').find('.depth2').stop().fadeOut(300);
            trg.closest('.item').addClass('on');
            trg.next('.depth2').stop().fadeIn(300);
          },
        });

        $('.dropDown .item').on({
          mouseleave: function () {
            var trg = $(this);

            trg.removeClass('on');
            trg.find('.depth2').stop().fadeOut(300);
          },
        });

        $('.sideMenu .cate-wrap').on('mouseenter', function () {
          gb.body.css('overflow-y', 'hidden');
        });

        $('.sideMenu .cate-wrap').on('mouseleave', function () {
          gb.body.css('overflow-y', 'scroll');
        });
      },
      setTopbnr = function () {
        // 메인 상단 공지 배너
        if (!getCookie('topbnr')) {
          gb.topBanner.css('display', 'block');
        } else {
          gb.topBanner.css('display', 'none');
        }

        gb.topBanner.find('.bnr-close > button').on('click', function () {
          gb.topBanner.slideUp(300);
          if ($('input[type=checkbox][name=topBnr_chk]').is(':checked')) {
            setCookie('topbnr', 'done', 1);
          }
        });
      },
      setPop = function () {
        // 메인 레이어 팝업
        if (!getCookie('lpop')) {
          gb.lpop.css('display', 'block');
        } else {
          gb.lpop.css('display', 'none');
        }

        gb.lpop.find('.pop-close > button').on('click', function () {
          gb.lpop.css('display', 'none');

          if ($('input[type=checkbox][name=lpop_chk]').is(':checked')) {
            setCookie('lpop', 'done', 1);
          }
        });
      },
      modal = function () {
        // 공통 모달
        gb.btnActiveModal.on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          var trg = $(this),
            modalName = trg.data('modal-name');

          if (trg.hasClass('on')) {
            $('.button-active-modal').removeClass('on');
            $('.modal').css('display', 'none');

            if (trg.hasClass('fixed')) {
              $('.dimmed fixed').remove();
              gb.body.css({
                height: 'auto',
                'overflow-y': 'visible',
              });
            }
          } else {
            $('.button-active-modal').not(trg).removeClass('on');
            trg.addClass('on');

            $('.modal').css('display', 'none');
            $('.modal#modal-' + modalName)
              .find('textarea')
              .val('');
            $('.modal#modal-' + modalName)
              .stop()
              .fadeIn(300);

            if (trg.hasClass('fixed')) {
              gb.body.append('<div class="dimmed fixed modal-off"></div>');
              gb.body.css({
                height: '100vh',
                'overflow-y': 'hidden',
              });
            }

            // 큐레이션 담기 리셋
            if (modalName == 'addCuration') {
              $('.modal#modal-' + modalName)
                .find('li.add')
                .remove();

              $('.modal#modal-' + modalName)
                .find('input[type=checkbox]')
                .prop('checked', '');
            }

            // 영상 다운로드 요청
            if (modalName == 'applyDownload') {
              // 다운로드 영역 선택
              var _radio = $('input[type=radio][name^=download]');

              _radio.on('change', function () {
                var _trg = $(this);

                if (_trg.filter('#dw_piece').prop('checked')) {
                  $('.set-dw-section').css('display', 'block');
                } else {
                  $('.set-dw-section').css('display', 'none');
                }
              });
            }
          }
        });

        $(document).on('click', '.modal-off', function () {
          modalOff();
        });
      },
      modalOff = function () {
        // 공통 모달 닫기
        $('.button-active-modal').removeClass('on');
        $('.modal').css('display', 'none');
        $('.dimmed.fixed').remove();

        // 입력 폼 리셋
        $('.modal').find('input').val('');
        $('.modal').find('textarea').val('');

        gb.body.css({
          height: 'auto',
          'overflow-y': 'visible',
        });

        // 가이드 영상 리셋
        if ($('#guideVd').length) {
          var videoGuide = document.getElementById('video_guide');
          videoGuide.pause();
          $(videoGuide).prop('currentTime', 0);
        }
      },
      MainSwiper = function () {
        // 메인 스와이퍼
        gb.mainSwiper = new Swiper('.main-swiper', {
          // Optional parameters
          loop: true,
          speed: 600,
          centeredSlides: true,
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          slidesPerView: 1,
          debugger: true, // Enable debugger
        });

        gb.mainSwiper.on('slideChangeTransitionStart', function (swiper) {
          var notCurrentvd = $('.main-swiper .swiper-slide:not(.swiper-slide-active) video').get(),
            animate = $('.main-swiper .swiper-slide-active .animate').get(),
            animate_ = $('.main-swiper .swiper-slide:not(.swiper-slide-active) .animate').get();

          clearTimeout(gb.timeSet); // 이미지 스와이프 리셋
          console.log('이미지 스와이프 리셋');

          if (notCurrentvd.length) {
            notCurrentvd.forEach(function (elem) {
              elem.pause();
              $(elem).prop('currentTime', 0);
            });
          }

          animate_.forEach(function (elem) {
            $(elem).removeClass('animation--start');
          });

          animate.forEach(function (elem) {
            $(elem).addClass('animation--start');
          });

          $('.button-swiperController').removeClass('play').addClass('pause').find('em').text('일시정지');
        });

        gb.mainSwiper.on('slideChangeTransitionEnd', function () {
          var currentVd = document.querySelector('.main-swiper .swiper-slide-active video'),
            currentImg = document.querySelector('.main-swiper .swiper-slide-active .imgBnr');

          if (currentVd) {
            // 비디오 타입인 경우
            currentVd.play();
            currentVd.addEventListener('ended', function () {
              // 현재 비디오 재생종료 후 스와이프
              gb.mainSwiper.slideNext();
            });

            console.log('video');
          }

          if (currentImg) {
            // 이미지 타입인 경우 (5초 뒤 스와이프)
            gb.timeSet = setTimeout(function () {
              gb.mainSwiper.slideNext();
            }, 5000);

            console.log('image');
          }
        });

        var currentVd = document.querySelector('.main-swiper .swiper-slide-active video'),
          currentImg = document.querySelector('.main-swiper .swiper-slide-active .imgBnr'),
          notCurrentvd = $('.main-swiper .swiper-slide:not(.main-swiper .swiper-slide-active) video').get(),
          animate = $('.main-swiper .swiper-slide-active .animate').get();

        if (notCurrentvd.length) {
          notCurrentvd.forEach(function (elem) {
            elem.load();
          });
        }

        if (currentVd) {
          // 비디오 타입인 경우
          currentVd.play();
          currentVd.addEventListener('ended', function () {
            // 현재 비디오 재생종료 후 스와이프
            gb.mainSwiper.slideNext();
          });

          console.log('video');
        }

        if (currentImg) {
          // 이미지 타입인 경우 (5초 뒤 스와이프)
          gb.timeSet = setTimeout(function () {
            gb.mainSwiper.slideNext();
          }, 5000);

          console.log('image');
        }

        setTimeout(function () {
          animate.forEach(function (elem) {
            $(elem).addClass('animation--start');
          });
        }, 100);

        $('.main-swiper')
          .find('.swiper-pagination')
          .append('<button type="button" class="button-swiperController pause"><em class="hidden-txt">일시정지</em></button>');

        $(document).on('click', '.button-swiperController', function () {
          var trg = $(this),
            currentVd = document.querySelector('.main-swiper .swiper-slide-active video'),
            currentImg = document.querySelector('.main-swiper .swiper-slide-active .imgBnr');

          if (trg.hasClass('play')) {
            trg.removeClass('play').addClass('pause').find('em').text('일시정지');
            if (currentVd) currentVd.play();

            if (currentImg) {
              gb.timeSet = setTimeout(function () {
                gb.mainSwiper.slideNext();
              }, 5000);
            }
          } else {
            trg.removeClass('pause').addClass('play').find('em').text('재생');
            if (currentVd) currentVd.pause();
            if (currentImg) clearTimeout(gb.timeSet);
          }
        });
      },
      VdSwiper = function () {
        // 공통 스와이퍼
        gb._vdSwiper = gb._vdSwiper || [];

        gb.vdSwiper.forEach(function (elem, i) {
          if (typeof gb._vdSwiper[i] !== 'undefined') {
            gb._vdSwiper[i].destroy();
            gb._vdSwiper[i] = undefined;
          }

          gb.vdSwiperOption = {
            // Optional parameters
            loop: false,
            speed: 600,
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 0,
            centeredSlides: false,
            debugger: true, // Enable debugger
            // resistance: false,
            // allowTouchMove: true,
            // observer: true,
            // observeParents: true,
            // SimulateTouch: false,
            scrollbar: {
              el: '.swiper-scrollbar-customed',
              hide: false,
              draggable: true,
            },
            navigation: {
              nextEl: '.button-swiper-nxt',
              prevEl: '.button-swiper-prev',
            },
          };

          gb._vdSwiper[i] = new Swiper(elem, gb.vdSwiperOption);
        });
      },
      LiveOnSwiper = function () {
        // 편성표 스와이퍼
        if (typeof gb._liveOnSwiper !== 'undefined') {
          gb._liveOnSwiper.destroy();
          gb._liveOnSwiper = undefined;
        }

        gb._liveOnSwiper = new Swiper('.liveOn-swiper', {
          // Optional parameters
          loop: true,
          speed: 600,
          direction: 'horizontal',
          slidesPerView: 'auto',
          spaceBetween: 0,
          centeredSlides: false,
          debugger: true, // Enable debugger
          navigation: {
            nextEl: '.button-swiper-nxt',
            prevEl: '.button-swiper-prev',
          },
        });
      },
      TabSwiper = function () {
        // 탭 메뉴 스와이퍼
        gb._tabSwiper = gb._tabSwiper || [];

        gb.tabSwiper.forEach(function (elem, i) {
          if (typeof gb._tabSwiper[i] !== 'undefined') {
            gb._tabSwiper[i].destroy();
            gb._tabSwiper[i] = undefined;
          }

          gb.tabSwiperOption = {
            // Optional parameters
            loop: false,
            speed: 600,
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 0,
            centeredSlides: false,
            debugger: true, // Enable debugger,
            navigation: {
              nextEl: '.button-swiper-nxt',
              prevEl: '.button-swiper-prev',
            },
          };
          //if (window.innerWidth <= 1280) {
          gb._tabSwiper[i] = new Swiper(elem, gb.tabSwiperOption);
          //}
        });
      },
      CrVisSwiper = function () {
        gb.CrVisSwiper = new Swiper('.cr-vis-swiper', {
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

        gb.CrVisSwiper.on('activeIndexChange', function (swiper) {
          setTimeout(function () {
            var notCurrentvd = $('.cr-vis-swiper .swiper-slide:not(.swiper-slide-active) video').get(),
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
      },
      PreviewOn = function () {
        // 영상 미리보기
        var videoPreviewAjax = function (el) {
          $.ajax({
            url: '../video/preview.html',
            type: 'get',
            dataType: 'html',
            success: function (result) {
              $(el).html(result);
              // $(el).find('video').first().trigger('click');
            },
          });
        };

        $(document).on('mouseenter touchstart', '.previewOn > .pv-list .img-thumb', function (e) {
          var trg = $(this),
            el = trg.closest('.pv-list').find('.vd-preview');

          $('.img-thumb').find('.toolTip').remove();
          $('.vd-preview').html('');
          clearTimeout(gb.videoPreviewAjax);

          trg.append('<span class="toolTip">계속마우스 오버하여 재생하기</span>');
          gb.videoPreviewAjax = setTimeout(function () {
            videoPreviewAjax(el);
          }, 1500);
        });

        $(document).on('mouseleave', '.previewOn > .pv-list', function () {
          $('.vd-preview').html('');
          $('.img-thumb').find('.toolTip').remove();
          clearTimeout(gb.videoPreviewAjax);
        });
      },
      FilterSwiper = function () {
        // 서울오리지널 필터 스와이퍼
        if (typeof gb.filterSwiper !== 'undefined') {
          gb.filterSwiper.destroy();
          gb.filterSwiper = undefined;
        }

        gb.filterSwiperOption = {
          // Optional parameters
          loop: false,
          speed: 600,
          direction: 'horizontal',
          slidesPerView: 'auto',
          spaceBetween: 0,
          centeredSlides: false,
          debugger: true, // Enable debugger,
          navigation: {
            nextEl: '.button-swiper-nxt',
            prevEl: '.button-swiper-prev',
          },
        };

        gb.filterSwiper = new Swiper('.list-filter-swiper', gb.filterSwiperOption);

        if ($('.list-filter-swiper').closest('div').hasClass('topic')) {
          // 분야별 영상
          $('.list-filter-swiper')
            .find('input[type=checkbox]')
            .on('change', function () {
              var index = $('.list-filter-swiper').find('input[type=checkbox]').index(this);

              if ($(this).prop('checked')) {
                gb.filterSwiper.slideTo(index);
              }
            });
        } else {
          // 기타 프로그램
          $('.list-filter-swiper')
            .find('input[type=radio]')
            .on('change', function () {
              var index = $('.list-filter-swiper').find('input[type=radio]').index(this);

              if ($(this).prop('checked')) {
                gb.filterSwiper.slideTo(index);
              }
            });
        }
      },
      KeywordSwiper = function () {
        // 통합검색 영상분류 필터 스와이퍼
        if (typeof gb.keywordSwiper !== 'undefined') {
          gb.keywordSwiper.destroy();
          gb.keywordSwiper = undefined;
        }

        gb.keywordSwiperOption = {
          // Optional parameters
          loop: false,
          speed: 600,
          direction: 'horizontal',
          slidesPerView: 'auto',
          spaceBetween: 0,
          centeredSlides: false,
          debugger: true, // Enable debugger
        };

        gb.keywordSwiper = new Swiper('.keyword-swiper', gb.keywordSwiperOption);

        $('.keyword-swiper')
          .find('input[type=checkbox]')
          .on('change', function () {
            var index = $('.keyword-swiper').find('input[type=checkbox]').index(this);

            if ($(this).prop('checked')) {
              gb.keywordSwiper.slideTo(index);
            }
          });
      },
      KeywordSwiper2 = function () {
        // 공통 목록 추천키워드 스와이퍼
        if (typeof gb.keywordSwiper2 !== 'undefined') {
          gb.keywordSwiper2.destroy();
          gb.keywordSwiper2 = undefined;
        }

        gb.keywordSwiperOption_ = {
          // Optional parameters
          loop: false,
          speed: 600,
          direction: 'horizontal',
          slidesPerView: 'auto',
          spaceBetween: 0,
          centeredSlides: false,
          debugger: true, // Enable debugger
        };

        gb.keywordSwiper = new Swiper('.keyword-swiper2', gb.keywordSwiperOption_);
      },
      weeklyLiveSwiper = function () {
        // 편성표 주간 생중계 예정방송
        if (typeof gb.weeklyLiveSwiper !== 'undefined') {
          gb.weeklyLiveSwiper.destroy();
          gb.weeklyLiveSwiper = undefined;
        }

        gb.weeklyLiveSwiperOption = {
          // Optional parameters
          loop: false,
          speed: 600,
          direction: 'horizontal',
          slidesPerView: 1,
          spaceBetween: 0,
          centeredSlides: false,
          debugger: true, // Enable debugger
          breakpoints: {
            // when window width is >= 391px
            391: {
              slidesPerView: 2,
            },
            // when window width is >= 640px
            640: {
              slidesPerView: 3,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 4,
            },
            // when window width is >= 1680px
            1680: {
              slidesPerView: 6,
            },
          },
        };

        gb.weeklyLiveSwiper = new Swiper('.weeklyLive-swiper', gb.weeklyLiveSwiperOption);
      },
      CurationSwiper = function () {
        // 큐레이션 스와이퍼
        gb.curationSwiper = new Swiper('.curation-swiper', {
          // Optional parameters
          loop: true,
          speed: 500,
          centeredSlides: true,
          effect: 'fade',
          fadeEffect: {
            crossFade: true,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          slidesPerView: 1,
          debugger: true, // Enable debugger
        });

        gb.curationSwiper.on('activeIndexChange', function (swiper) {
          setTimeout(function () {
            var currentVd = document.querySelector('.swiper-slide-active video'),
              notCurrentvd = $('.swiper-slide:not(.swiper-slide-active) video').get(),
              animate = $('.swiper-slide-active .animate').get(),
              animate_ = $('.swiper-slide:not(.swiper-slide-active) .animate').get();

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

        var animate = $('.swiper-slide-active .animate').get();

        setTimeout(function () {
          animate.forEach(function (elem) {
            $(elem).addClass('animation--start');
          });
        }, 100);
      },
      showOnLayer = function () {
        // 편성표 보기
        gb.buttonShowLayer = $('.button-showLayer');

        if (gb.buttonShowLayer.hasClass('on')) {
          if ($('.liveOn-swiper').length) {
            gb.liveOnAir.slideDown(300, LiveOnSwiper);
          } else {
            gb.liveOnAir.slideDown(300);
          }
        }

        gb.buttonShowLayer.on('click', function () {
          var trg = $(this);

          if (trg.hasClass('on')) {
            trg.removeClass('on');
            gb.liveOnAir.slideUp(300, function () {
              if ($('.liveOn-swiper').length) {
                gb._liveOnSwiper.destroy();
              }
              trg.find('em').html(trg.find('em').html().replace('닫기', '보기'));
            });
          } else {
            trg.addClass('on');
            if ($('.liveOn-swiper').length) {
              gb.liveOnAir.slideDown(300, LiveOnSwiper);
            } else {
              gb.liveOnAir.slideDown(300);
            }

            trg.find('em').html(trg.find('em').html().replace('보기', '닫기'));
          }
        });

        $(document).on('mouseenter focusin', '.liveOnAir .info', function () {
          var trg = $(this);

          trg.closest('.article').addClass('on');
          trg
            .find('.preview')
            .stop()
            .fadeIn(200, function () {
              gsap.to(trg.find('.preview'), { opacity: 1, scaleY: 1, duration: 0.4 });
            });
        });

        $(document).on('mouseleave focusout', '.liveOnAir .info', function () {
          var trg = $(this);

          trg.closest('.article').removeClass('on');
          gsap.to(trg.find('.preview'), { opacity: 0, scaleY: 0, duration: 0.4 });
          trg.find('.preview').stop().fadeOut(300);
        });
      },
      tabMenu = function () {
        // 메인 탭 메뉴
        gb.tabMenu.each(function () {
          var trg_tabList = this,
            tabList_idx = gb.tabMenu.index(trg_tabList);

          $(trg_tabList)
            .find('a')
            .on('click', function (e) {
              e.preventDefault();
              e.stopPropagation();

              var trg = $(this),
                trg_idx = $(trg_tabList).find('a').index(this),
                tabId = trg.attr('href').substr(1);

              gb._tabSwiper[tabList_idx].slideTo(trg_idx);

              if (!trg.closest('li').hasClass('on')) {
                $(trg_tabList).find('li').removeClass('on');
                trg.closest('li').addClass('on');

                $.get('./tabContents/' + trg_tabList.id + '.html', function (data) {
                  $(trg_tabList)
                    .next('.tab-contents')
                    .html($(data).filter('#' + tabId));

                  new Swiper('#' + tabId + ' .vd-swiper', gb.vdSwiperOption);

                  setTimeout(function () {
                    $('#' + tabId).addClass('active');
                  }, 200);
                });
              }
            });
        });
      },
      mobTabMenu = function () {
        //광장 24시 탭 메뉴
        gb.mobTabMenu.find('a').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          gb.isMobTab = true;

          var trg = $(this),
            dataId = trg.attr('href');

          trg.closest('li').addClass('on');
          gb.mobTabMenu.find('a').not(trg).closest('li').removeClass('on');
          $('.box-item').not(dataId).css('display', 'none');
          $('.box-item').filter(dataId).css('display', 'block');
        });
      },
      selectSchedType = function () {
        //편성표 타입 선택
        gb.btnSchedType = $('.sched-header .ctrl-box button');
        gb.btnSchedType.on('click', function () {
          var trg = $(this),
            type = trg.data('view-type');

          trg.addClass('selected');
          gb.btnSchedType.not(trg).removeClass('selected');

          $('.sched-cts').css('display', 'none');
          $('.sched-cts')
            .filter('#month-' + type)
            .css('display', 'block');
        });
      },
      datePick = function () {
        $('.calendar').datepicker({
          showOn: 'both',
          buttonImageOnly: true,
          buttonImage: '../assets/images/icon-calendar.png',
          dateFormat: 'yy-mm-dd',
        });
      },
      fileUpload = function (el, type) {
        // input file
        var pathpoint = el.value.lastIndexOf('.'),
          filepoint = el.value.substring(pathpoint + 1, el.length),
          filetype = filepoint.toLowerCase(); // 업로드 파일 확장자

        if (window.FileReader) {
          // modern browser
          var fileReader = new FileReader(),
            fileName = $(el)[0].files[0].name, // 첨부 파일 명
            filesize = $(el)[0].files[0].size; // 첨부 파일 용량

          fileReader.readAsDataURL($(el)[0].files[0]);
        }

        $(el).closest('.file-attach').find('.text-wrap input[type=text]').val(fileName);
        if (type == 'image') {
          // 이미지 업로드
          if (filetype == 'jpg' || filetype == 'gif' || filetype == 'png' || filetype == 'jpeg' || filetype == 'bmp') {
            // 정상적인 이미지 확장자 파일일 경우
            fileReader.onload = function (e) {
              $(el).closest('.file-up-list').find('.file-attach-image img').attr('src', e.target.result);
            };
          } else {
            alert('이미지 파일만 선택 할 수 있습니다.');
            parentObj = el.parentNode;
            node = parentObj.replaceChild(el.cloneNode(true), el);
            return false;
          }
        }
      },
      copyToClipboard = function (val) {
        // 클립 보드에 복사
        var t = document.createElement('textarea');

        document.body.appendChild(t);

        t.value = val;
        t.select();

        document.execCommand('copy');
        document.body.removeChild(t);
      },
      copyUrl = function () {
        // url 복사
        copyToClipboard(location.href);
        alert('링크가 복사되었습니다.\n ' + location.href);
      },
      allCheck = function () {
        // 전체 선택
        var checked_ItemAll = $('input[type=checkbox][name^=chkAll]'),
          check_Item = $('input[type=checkbox][name^=chk_]');

        checked_ItemAll.on('change', function () {
          if ($(this).prop('checked')) {
            check_Item.prop('checked', '');
          }
        });

        check_Item.on('change', function () {
          if ($(this).prop('checked')) {
            checked_ItemAll.prop('checked', '');
          }
        });
      },
      goScrollTop = function () {
        gb.html.stop().animate({ scrollTop: 0 }, 400);
      },
      menuAll = function (t, el) {
        // 프로그램 전체메뉴
        if ($(t).hasClass('active')) {
          $(t).removeClass('active');
          $(el).stop().fadeOut(300);
        } else {
          $(t).addClass('active');
          $(el).stop().fadeIn(300);
        }
      },
      setLnb = function () {
        // 모바일 사이드 메뉴 (공통 목록, 공통 상세)
        $('.button-open-sideMenu').on('click', function () {
          var trg = $(this);
          if (trg.hasClass('active')) {
            $('.mob-sideMenu')
              .stop()
              .animate(
                {
                  left: '-80%',
                },
                {
                  duration: 300,
                  complete: function () {
                    trg.removeClass('active');
                  },
                }
              )
              .next('.dimmed')
              .remove();

            gb.layout.css({
              height: 'auto',
              'overflow-y': 'visible',
            });
          } else {
            $('.mob-sideMenu')
              .stop()
              .animate(
                {
                  left: 0,
                },
                {
                  duration: 300,
                  complete: function () {
                    trg.addClass('active');
                  },
                }
              )
              .after('<div class="dimmed side"></div>');

            gb.layout.css({
              height: '100vh',
              'overflow-y': 'hidden',
            });
          }

          $(document).on('click', '.dimmed.side', function () {
            $('.mob-sideMenu')
              .stop()
              .animate(
                {
                  left: '-80%',
                },
                {
                  duration: 300,
                  complete: function () {
                    trg.removeClass('active');
                  },
                }
              );
            gb.layout.css({
              height: 'auto',
              'overflow-y': 'visible',
            });
            $(this).remove();
          });
        });
      },
      setLnbFixed = function () {
        // pc 사이드 메뉴
        if (document.documentElement.scrollTop + document.documentElement.clientHeight >= gb.footer.offset().top) {
          $('.sideMenu').css(
            'bottom',
            document.documentElement.scrollTop + document.documentElement.clientHeight - gb.footer.offset().top + 'px'
          );
        } else {
          $('.sideMenu').css('bottom', 0);
        }
      },
      setCurList = function () {
        $('.sort-inner').sortable({
          placeholder: 'ui-shift',
          cursor: 'move',
        });
        $('.sort-inner li').disableSelection();

        // 등록 영상 삭제
        $(document).on('click', '.button-delete', function () {
          $(this).closest('li').remove();
        });
      },
      vdMiniPlayerOff = function () {
        // 소형 플레이어 닫기
        $(document).on('click', '.button-vd-close', function () {
          gb.vdContainer.removeClass('fixed');
          gb.vdContainer.css('height', 'auto');
          if (gb.vdContainer.find('.plyr--video').length) {
            gb.vdContainer.find('video').vodPause();
          }
          if (gb.vdContainer.find('.ytp-container').length) {
            gb.YTplayer.pauseVideo();
          }
          $(this).remove();
        });
      },
      blockContextMenu = function () {
        // 우 클릭, 드래그 방지
        $(document).on('contextmenu selectstart dragstart', function () {
          return false;
        });
      },
      init = function () {
        setGnb();
        setLnb();
        tabMenu();
        mobTabMenu();
        selectSchedType();
        allCheck();
        datePick();
        modal();
        vdMiniPlayerOff();
        //blockContextMenu();
      };

    return {
      init: init,
      setTopbnr: setTopbnr,
      setPop: setPop,
      menuAll: menuAll,
      modalOff: modalOff,
      MainSwiper: MainSwiper,
      VdSwiper: VdSwiper,
      LiveOnSwiper: LiveOnSwiper,
      TabSwiper: TabSwiper,
      CrVisSwiper: CrVisSwiper,
      PreviewOn: PreviewOn,
      FilterSwiper: FilterSwiper,
      KeywordSwiper: KeywordSwiper,
      KeywordSwiper2: KeywordSwiper2,
      weeklyLiveSwiper: weeklyLiveSwiper,
      showOnLayer: showOnLayer,
      goScrollTop: goScrollTop,
      fileUpload: fileUpload,
      setCurList: setCurList,
      setLnbFixed: setLnbFixed,
      mobTabMenu: mobTabMenu,
      copyUrl: copyUrl,
    };
  };

  window.Modernizr = {
    touch: true,
  };

  window.addEventListener('resize', function () {
    gb.isMob = window.innerWidth <= 768 ? true : false;
    gb.isMob2 = window.innerWidth <= 1080 ? true : false;

    if (gb.vdSwiper.length) commonFunction().VdSwiper();
    if (gb.liveOnAir.length) commonFunction().LiveOnSwiper();
    if (gb.tabSwiper.length) commonFunction().TabSwiper();
    if ($('.list-filter-swiper').length) commonFunction().FilterSwiper();
    if ($('.keyword-swiper').length) commonFunction().KeywordSwiper();
    if ($('.keyword-swiper2').length) commonFunction().KeywordSwiper2();
    if ($('.weeklyLive-swiper').length) commonFunction().weeklyLiveSwiper();

    if (!gb.isMob) {
      $('.mob-sideMenu')
        .stop()
        .animate(
          {
            left: '-80%',
          },
          {
            duration: 300,
            complete: function () {
              $('.button-open-sideMenu').removeClass('active');
            },
          }
        )
        .next('.dimmed')
        .remove();

      gb.layout.css({
        height: 'auto',
        'overflow-y': 'visible',
      });
    } else {
      $('#pg-all').css('display', 'none');
      $('.button-open-pgAll').removeClass('active');
    }

    if (gb.mobTabMenu.length) {
      if (gb.isMob2) {
        if (!gb.isMobTab) {
          $('.box-item').css('display', 'none');
          $('.box-item').first().css('display', 'block');

          gb.mobTabMenu.find('li').removeClass('on');
          gb.mobTabMenu.find('li').first().addClass('on');

          gb.isMobTab = true;
        }
      } else {
        $('.box-item').css('display', 'block');

        gb.isMobTab = false;
      }
    }
  });

  window.addEventListener('scroll', function (e) {
    if (document.documentElement.scrollTop >= 92) {
      gb.html.addClass('fixed');
    } else {
      gb.html.removeClass('fixed');
    }

    if (document.documentElement.scrollTop + document.documentElement.clientHeight >= gb.footer.offset().top) {
      $('.sideMenu').css(
        'bottom',
        document.documentElement.scrollTop + document.documentElement.clientHeight - gb.footer.offset().top + 'px'
      );
    } else {
      $('.sideMenu').css('bottom', 0);
    }

    if (gb.vdContainer.length) {
      if (document.documentElement.scrollTop >= gb.vdContainer.offset().top + gb.vdContainer.height() - gb.header.height() + 92) {
        if (!gb.vdMiniPlayer) {
          if (gb.vdContainer.find('.plyr--video').length) {
            // 티젠 플레이어
            // 소형플레이어로 전환
            if (gb.vdContainer.find('.plyr--video').hasClass('plyr--playing')) {
              gb.vdContainer.css('height', gb.vdContainer.height());
              gb.vdContainer.addClass('fixed');
              gb.vdContainer
                .find('> div')
                .append(
                  '<button class="button-vd-close" type="button" title="영상 닫기"><em class="hidden-txt">영상 닫기</em></button>'
                );
              gb.vdMiniPlayer = true;
            } else {
              gb.vdContainer.css('height', 'auto');
              gb.vdContainer.removeClass('fixed');
            }
          }

          if (gb.vdContainer.find('.ytp-container').length) {
            // 유튜브 플레이어
            // 소형플레이어로 전환
            if (gb.ytpStatus == 'play') {
              // 재생 중
              gb.vdContainer.css('height', gb.vdContainer.height());
              gb.vdContainer.addClass('fixed');
              gb.vdContainer
                .find('> div')
                .append(
                  '<button class="button-vd-close" type="button" title="영상 닫기"><em class="hidden-txt">영상 닫기</em></button>'
                );
              gb.vdMiniPlayer = true;
            } else {
              gb.vdContainer.css('height', 'auto');
              gb.vdContainer.removeClass('fixed');
            }
          }
        }
      } else {
        if (gb.vdContainer.find('.plyr--video').length) {
          // 티젠 플레이어
          gb.vdContainer.removeClass('fixed');
          gb.vdContainer.css('height', 'auto');
        }

        if (gb.vdContainer.find('.ytp-container').length) {
          // 유튜브 플레이어
          gb.vdContainer.removeClass('fixed');
          gb.vdContainer.css('height', 'auto');
        }
        gb.vdContainer.find('.button-vd-close').remove();
        gb.vdMiniPlayer = false;
      }
    }
  });
})(jQuery);

// 쿠키설정
function setCookie(cName, cValue, cDay) {
  var expire = new Date(),
    cookies;

  expire.setDate(expire.getDate() + cDay);
  cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
  if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
  document.cookie = cookies;
}

function getCookie(cName) {
  cName = cName + '=';
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cName);
  var cValue = '';
  if (start != -1) {
    start += cName.length;
    var end = cookieData.indexOf(';', start);
    if (end == -1) end = cookieData.length;
    cValue = cookieData.substring(start, end);
  }
  return unescape(cValue);
}
