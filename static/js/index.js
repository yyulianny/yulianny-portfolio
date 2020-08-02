(function(window, $) {
	var $lightBox = $('.lightbox');
	var $next = $lightBox.find('.next');
	var $prev = $lightBox.find('.prev');
	var $close = $lightBox.find('.close');
	var $image = $lightBox.find('.image');
	var $gameContainer = $lightBox.find('.game-container');
	var $body = $('html, body');
	var $html = $('html');
	var $main = $('main');

	var images = [];

	$('.gallery').each(function() {
		var $gallery = $(this);
		var $images = $gallery.find('.image, img');
		var galleryImages = $images.map(function() {
			return $(this).data('image') || $(this).attr('src').split('img/').pop();
		}).get();

		$images.click(function() {
			var index = $images.index($(this));
			images = galleryImages.slice();
			images = images.splice(index).concat(images)

			loadImage();
			$gameContainer.hide();
			$lightBox.fadeIn();
		});
	});

	$('.play-it').click(function(e) {
		e.preventDefault();

		var gameUrl = $(this).attr('href');
		$image.hide();
		$gameContainer.show().html(`
			<iframe src="${gameUrl}" frameborder="0" allowfullscreen="" />
		`);
		$lightBox.fadeIn();
	});

	$lightBox.click(function() {
		$lightBox.fadeOut(function(){
			$image.hide();
			$gameContainer.hide();
			$gameContainer.html('');
		});
	})

	$image.click(function(e){e.stopPropagation()})
	$prev.click(function(e){
		e.stopPropagation();
		images.unshift(images.pop());
		loadImage();
	})
	$next.click(function(e){
		e.stopPropagation();
		images.push(images.shift());
		loadImage();
	})

	var loadImage = function() {
		$image.fadeOut(function(){
			$image.attr('src', '/static/img/' + images[0]);
			$image.fadeIn();
		})
	}

	function setFixed() {
		$main.toggleClass('fixed', $html.scrollTop() >= 54);
	};

	setFixed();

	function throttle(fn, wait) {
	  var time = Date.now();
	  return function() {
	    if ((time + wait - Date.now()) < 0) {
	      fn();
	      time = Date.now();
	    }
	  }
	}

	$(window).on('scroll', throttle(setFixed, 50));

	// Carousel

	var $carousel = $('#carousel');
	if (!$carousel.length) return;

	var $cArrowNext = $('.carousel-arrow.next');
	var $cArrowPrev = $('.carousel-arrow.prev');

	$cArrowNext.click(function() {
		$carousel.animate({
			scrollLeft: '+=268'
		}, 300);
	});

	$cArrowPrev.click(function() {
		$carousel.animate({
			scrollLeft: '-=268'
		}, 300);
	});

	var $curProject = $carousel.find('.project').filter(function(i, el) {
	  return $(el).attr('href') === location.pathname;
	});

	$curProject.addClass('current');
	$carousel.scrollLeft($carousel.scrollLeft() + $curProject.position().left - $carousel.width()/2 + $curProject.width()/2)
})(window, jQuery);
