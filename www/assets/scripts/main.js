/*jshint strict:false */

(function ($) {

	// Drag Slider Demo

	$.widget.bridge('DragSlider', DragSlider);
	$(".drag-slider").DragSlider({'prevPos' : 0});

	$(".j-slide-top").on('click', function(){
		$( "#mainDrag").DragSlider('gotoSlide', 10);
	});

	$(".j-slide-bottom").on('click', function(){
		$( "#otherDrag").DragSlider('gotoSlide', 3);
	});

	$(".j-slide-both").on('click', function(){
		$( "#mainDrag").DragSlider('gotoSlide', 5);
		$( "#otherDrag").DragSlider('gotoSlide', 3);
	});

	$(".j-reset-both").on('click', function(){
		$( "#mainDrag").DragSlider('gotoSlide', 0);
		$( "#otherDrag").DragSlider('gotoSlide', 0);
	});

	// End Slider Demo
	// End Slider Demo
	// End Slider Demo
	// 

})(jQuery); // Fully reference jQuery after this point.