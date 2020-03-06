'use strict';

/* global google:true */

$(function () {
  var $header = $('header');
  var $window = $(window);
  var $links = $('nav a');
  var $menu = $('.menu');

  $window.scroll(updateHeader).trigger('scroll');
  $links.on('click', scrollToSection);
  $menu.on('click', toggleMenu);
  initMap();

  function toggleMenu() {
    $('.dropdown').slideToggle();
  }

  function updateHeader() {
    var bottomOfHeader = $header.offset().top + $header.height();
    var viewportHeight = $window.height();

    if (bottomOfHeader >= viewportHeight) {
      $header.addClass('opaque');
    } else {
      $header.removeClass('opaque');
    }
  }

  function scrollToSection() {
    var section = $(this).attr('href');
    $('body').animate({
      scrollTop: $(section).offset().top
    }, 1000, function () {
      if ($window.width() < 575) {
        $('.dropdown').slideToggle();
      }
    });
  }

  function initMap() {
    var lat = $('#map').data('lat');
    var lng = $('#map').data('lng');
    var latLng = { lat: lat, lng: lng };

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: latLng,
      scrollwheel: false
    });

    new google.maps.Marker({
      position: latLng,
      map: map
    });
  }
});