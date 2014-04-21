/*!
 * jQuery UI Widget- InfiniteScroller
 * Author: @Marc Broad
 * Further changes, additional comments: @Marc Broad
 */

/**
 * TODO:
 *
 * Trigger events
 * Breakout functions into smaller methods
 * Remove coupling from local vars to global options object
 * Add Bower.json
 * 
 */



// a "widgetName" object constructor
// required: this must accept two arguments,
// options: an object of configuration options
// element: the DOM element the instance was created on
var DragSlider = function( options,  element ){
	this.options = options;
	this.element = element;
	this._init();
};


// the "widgetName" prototype
DragSlider.prototype = {

	_curPos: 0,
	_curSlide: null,

	// _create will automatically run the first time this
	// widget is called
	_create: function(){
		// creation code
	},

	// required: initialization logic for the plugin goes into _init
	// This fires when your instance is first created and when
	// attempting to initialize the widget again (by the bridge)
	// after it has already been initialized.
	_init: function(){

		// maintain scope reference
		var self		=	this;

		// set the elements once, avoid multiple lookups. 
		self.option( 'drag-wrapper', $(this.element) );
		self.option( 'draggable', $(this.element).find('.drag-inner') );

		// scope vars / references
		var $wrapper	=	self.option( 'drag-wrapper' );
		var $draggable	=	self.option( 'draggable' );
		var drag_width	=	0;

		// generate the calculations for left, width of all the contained elements
		$draggable.css({'left': 0});
		$draggable.find('.drag-item').each(function(){
			var $this	=	$(this);
			drag_width	+=	$this.outerWidth();
		})

		// set the inline styles for width of all the contained elements
		$draggable.css({'width': drag_width})
		self.option( 'original-width', drag_width );


		// on click of the wrapper, grab the initial vars for reference in the scope
		$draggable.on("mousedown", function(e) {

			var $drag 		=	 $(this).addClass('draggable');
			var startOffset =	 $drag.offset().left;
			var startX     	=	 e.pageX;

			// on mousemove, check if it's currently draggable
			$drag.css('z-index', 1000).parents().on("mousemove", function(e) {
				
				if($drag.hasClass('draggable')){

					var curX    	= 	parseInt(e.pageX);
					var newPos 		=	startOffset + ( curX - startX );

					// this needs tidying up in order to remove implication that these are all images
					var $img_first 	=	$drag.find('.drag-item:first');
					var first_w 	=	$img_first.outerWidth();
					var $img_last 	=	$drag.find('.drag-itemimg:last');
					var last_w 		=	$img_last.outerWidth();

					// am i moving to the left, and has my first element moved offscreen...
					if(newPos < ( 0 - first_w ) ){
						newPos = 0;
						startX -= first_w;
						$drag.append($drag.find('.drag-item:first'));

					// am i moving to the right, and has my last element moved offscreen...						
					}else if(newPos > 0){
						newPos -= last_w;
						startX += last_w;
						$drag.prepend($drag.find('.drag-item:last'));
					}

					// set the offset based on any new calculations
					$drag.offset({
						left 	: 	newPos
					})
				}
			});
			// disable selection outline
			e.preventDefault(); 
		})
		$(document).on("mouseup", function() {
			// remove all binding to mousemove, remove class
			$draggable.removeClass('draggable').parents().unbind('mousemove');
		});
	},

	_onSlide: function(now, fx){
		var self 		= 	 this;
		var $drag 		=	 $(fx.elem);
		var $img_first 	=	 $drag.find('.drag-item:first');
		var first_w 	=	 $img_first.outerWidth();
		var pad_left 	=	 parseInt($drag.css("padding-left"));
		var width 		=	 $drag.outerWidth();

		if( now <= ( 0 - pad_left - first_w)) {
			$drag.css({"padding-left" : pad_left + first_w + "px", "width" : width + first_w })
			$drag.append($img_first);
		}

	},

	/**
	 * Move to slide X relative to the first element
	 * @param  {Int} 	slide 	Element number, NOT 0 based.
	 * @return {False}
	 */
	gotoSlide: function (slide) {
		var self	=	this;
		var $el 	= 	$(self.element)
		var $inner 	= 	$el.find('.drag-inner');
		var $img 	= 	$el.find('.drag-inner .drag-item');
		var index 	= 	slide - 1;
		var left 	= 	(!slide) ? 0 : -1 * $inner.find('.drag-item:eq(' + index + ')').offset().left + $inner.offset().left;


		// TODO return false if start pos == end pos

		self._onStart();
		if (!self._curSlide) self._curSlide = $inner.animate({
			left: left
		},{
			step: function( now, fx ) {
				self._onSlide(now, fx);
			},
			duration: 1000,
			complete: function(){
				$inner.css('padding-left', '');
				$inner.css('left', '');
				$inner.css('width',  $inner.data('width'));
				self._onStop();
				self._curSlide = null;
			}
		});
	},


	// required: objects to be used with the bridge must contain an
	// 'option'. Post-initialization, the logic for changing options
	// goes here.
	
	/**
	 * Set/Get instance level options
	 * @param  {String} key   	The name of the option var to store
	 * @param  {Mixed} 	value 	The value of the option var to store
	 * @return {}		       	
	 */
	option: function( key, value ){

		// optional: get/change options post initialization
		// ignore if you don't require them.

		// signature: $('#foo').bar({ cool:false });
		if( $.isPlainObject( key ) ){
			this.options = $.extend( true, this.options, key );

		// signature: $('#foo').option('cool'); - getter
		} else if ( key && typeof value === "undefined" ){
			return this.options[ key ];

		// signature: $('#foo').bar('option', 'baz', false);
		} else {
			this.options[ key ] = value;
		}

		// required: option must return the current instance.
		// When re-initializing an instance on elements, option
		// is called first and is then chained to the _init method.
		return this;
	},

	_onStart: function (){
		//console.log('start...');
	},
	_onStop: function (){
		//console.log('stop...');
	},

	// notice no underscore is used for public methods
	publicFunction: function(){
		//console.log('public function');
	},

	// underscores are used for private methods
	_privateFunction: function(){
		//console.log('private function');
	}
};


// USAGE
// 
// connect the widget obj to jQuery's API under the "ResponseSlider" namespace
// NOTE:: the namespace can be anything you want: DragSlider, CustomSlider, Slider, BubbleButt...
// $.widget.bridge("ResponseSlider", DragSlider);

// create an instance of the widget for use
// var slider = $("#elem").ResponseSlider({
//     [option]: [value]
// });

// your widget instance exists in the elem's data
// slider.data("ResponseSlider").element; // => #elem element

// bridge allows you to call public methods...
// slider.ResponseSlider("publicFunction"); // => "public method"

// bridge prevents calls to internal methods
// slider.ResponseSlider("_privateFunction"); // => #elem element


