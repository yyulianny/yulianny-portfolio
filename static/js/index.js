var $lightBox = $('.lightbox');
var $next = $lightBox.find('.next');
var $prev = $lightBox.find('.prev');
var $close = $lightBox.find('.close');
var $image = $lightBox.find('.image');
var $body = $('html, body');

var images = [];

$('.gallery').each(function() {
	var $gallery = $(this);

	var $images = $gallery.find('.image');

	var galleryImages = $images.map(function() {
		return $(this).data('image') || $(this).attr('src').split('img/').pop();
	}).get();

	$images.click(function() {
		// console.log($image);
		// console.log('url(./img/' + $(this).data('image') + ');');
		// $image.css({
		// 	'background-image': 'url(./img/' + $(this).data('image') + ')'
		// });

		var index = $images.index($(this));
		console.log(index);
		images = galleryImages.slice();
		console.log(images);
		images = images.splice(index).concat(images)
		console.log(images);

		loadImage();
		$lightBox.fadeIn();
	});
});

$lightBox.click(function() {
	$lightBox.fadeOut(function(){
		$image.hide();
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

// $('.project-link').click(function(e){
// 	e.preventDefault();

// 	$body.stop().animate({
// 		scrollTop:$($(this).attr('href')).position().top - 200
// 	}, 500, 'swing');
// })