;(function( $, window, document, undefined ) {

	var pluginName = 'slideshow',
		defaults = {
			fullscreen: false,
			delay: 5000  // 5 second delay between slides
		};
		
	function Slideshow( element, options ) {
	
		this.element = element;
		this.options = $.extend( {}, defaults, options );
		this.slideObjects = [];
		this.currentDrag = {};
		this.currentSlide = 0;
		this.isVisible = false;
		this.isAutomaticMode = false;
		this.isFullscreen = this.options.fullscreen;
		this._defaults = defaults;
		this._name = pluginName;
		
		this.initialize();
	
	}
	
	Slideshow.prototype.initialize = function Slideshow$initialize() {

		this.buildBackdrop();

		this.backdropObject.append( this.getHeader() );
		this.backdropObject.append( this.getContainer() );
		this.backdropObject.append( this.getFooter() );
		
		this.wireUpEvents();
		
		this.initSlides();
		
		this.expandDivs();
	
	};
	
	Slideshow.prototype.preloadImage = function Slideshow$preloadImage( slideObject ) {
	
		var imageObject,
			_this = this;
	
		// slide already contains an image, leave it be
		if ( $( 'img', slideObject ).length !== 0 )
		{
			return;
		}
		
		imageObject = $('<img>')
			.attr( 'src', slideObject.data('slideshow-slide-image') )
			.addClass('slideshow-image')
			.load(
				function Slideshow$ImageLoaded() {
					var img = $(this);
					var img_size = 
					{
						'height': this.height,
						'width': this.width
					};
					img.data( 'native-size', img_size );
					_this.resizeImage( $(this) );
				}
			);  // .load
			
		slideObject.append( imageObject );
	};
	
	Slideshow.prototype.resizeImage = function Slideshow$resizeImage( imageObject ) {
	
		var top,
			left,
			windowHeight = $(window).height(),
			windowWidth = $(window).width(),
			nativeSize = imageObject.data('native-size'),
			imageHeight = nativeSize.height,
			imageWidth = nativeSize.width,
			ratio = imageWidth / imageHeight,
			heightRatio = imageHeight / windowHeight,
			widthRatio = imageWidth / windowWidth;
		
		if (heightRatio > widthRatio && heightRatio > 1)
		{
			imageObject.height( windowHeight );
			imageObject.width( ratio * windowHeight );
			top = 0;
			left = ( windowWidth - ratio * windowHeight ) / 2;
		}
		else if (widthRatio > 1)
		{
			imageObject.height( windowWidth / ratio );
			imageObject.width( windowWidth );
			top = ( windowHeight - windowWidth / ratio ) / 2;
			left = 0;
		}
		else
		{
			if ( this.isFullscreen )
			{
				if ( heightRatio > widthRatio )
				{
					imageHeight = imageHeight / heightRatio;
					imageWidth = imageWidth / heightRatio;
				}
				else
				{
					imageHeight = imageHeight / widthRatio;
					imageWidth = imageWidth / widthRatio;
				}
			}
			imageObject.height( imageHeight );
			imageObject.width( imageWidth );
			top = (windowHeight - imageHeight) / 2;
			left = (windowWidth - imageWidth) / 2;
		}
		
		// center image in the div
		imageObject.css(
			{
				'top': top,
				'left': left
			}
		);
	
	};
	
	Slideshow.prototype.wireUpEvents = function Slideshow$wireUpEvents() {
		
		var _this = this;
	
		this.nextButton.click(
			function Slideshow$nextClicked( clickEvent ) {
					_this.turnOffAutomaticMode();
					_this.nextSlide();
					clickEvent.stopPropagation();
			});
			
		this.prevButton.click(
			function Slideshow$prevClicked( clickEvent ) {
					_this.turnOffAutomaticMode();
					_this.prevSlide();
					clickEvent.stopPropagation();
			});
			
		this.fullscreenButton.click(
			function Slideshow$fullscreenClicked( clickEvent ) {
					_this.toggleFullscreen();
					clickEvent.stopPropagation();
			});
			
		this.playPauseButton.click(
			function Slideshow$playPauseClicked( clickEvent ) {
					_this.toggleAutomaticMode();
					clickEvent.stopPropagation();
			});
			
		this.exitButton.click(
			function Slideshow$exitClicked( clickEvent ) {
					_this.hideSlideshow();
					clickEvent.stopPropagation();
			});
	
	};
	
	Slideshow.prototype.wireUpListeners = function Slideshow$wireUpListeners() {
		
		var _this = this,
			jDocument = $(document);
		
		// listen for swipe start
		jDocument
			.on('mousedown.slideshow touchstart.slideshow', 
				function Slideshow$touchStartHandler(event) {
					
					var actualEvent,
						isTouch = (event.type === 'touchstart');
				
					// only care about left-click
					if (!isTouch && event.which !== 1)
					{
						return;
					}
					
					event.preventDefault();
					event.stopPropagation();
					
					if ( isTouch )
					{
						actualEvent = event.originalEvent.targetTouches[0];
					}
					else
					{
						actualEvent = event;
					}
					
					_this.swipeStart(actualEvent);
					
				});
				
			
		jDocument
			.on('mousemove.slideshow touchmove.slideshow', 
				function Slideshow$touchMoveHandler(event) {
				
					var isTouch = (event.type === 'touchmove');
				
					if ( !_this.currentDrag.isInProgress )
					{
						// not swiping, so just quit
						return;
					}
				
					event.preventDefault();
					event.stopPropagation();
				
					if ( isTouch )
					{
						actualEvent = event.originalEvent.targetTouches[0];
					}
					else
					{
						actualEvent = event;
					}
				
					_this.swipeContinue(actualEvent);
		
				}
			);
			
		jDocument
			.on('mouseup.slideshow mouseleave.slideshow touchend.slideshow touchcancel.slideshow',
				function Slideshow$touchEndHandler(event) {
				
					if ( !_this.currentDrag.isInProgress )
					{
						// not swiping, so just quit
						return;
					}

					event.preventDefault();
					event.stopPropagation();
					
					_this.swipeStop(event);
					
				}
			);
		
		// listen for keystrokes
		jDocument
			.on( 'keypress.slideshow',
				function Slideshow$keypressWrapper( event ) {
						_this.keypressHandler( event );
				}
			);
		
		// listen for window resizes
		$(window).resize(
			function Slideshow$windowResizeWrapper( event ) {
					_this.resizeHandler( event );
			});

	};
	
	Slideshow.prototype.resizeHandler = function Slideshow$resizeHandler( event ) {
	
		this.expandDivs();
		
		// if the slideshow is visible, re-slide to the current slide to fix up the layout
		if ( this.isVisible )
		{
			this.slideTo( this.currentSlide, true );
		}
				
		this.resizeAllImages();
	};
	
	Slideshow.prototype.resizeAllImages = function Slideshow$resizeAllImages() {
	
		var _this = this;
		
		$( '.slideshow-image', this.containerObject ).each(
			function Slideshow$ResizeAllImages() {
				_this.resizeImage( $(this) );
			}
		);
	
	};
	
	Slideshow.prototype.swipeStart = function Slideshow$swipeStart( event ) {
		
		var _this = this;
		
		this.currentDrag = {
				'isInProgress': true,
				'startX': event.pageX,
				'startY': event.pageY,
				'currentX': event.pageX,
				'currentY': event.pageX,
				'startTime': new Date().getTime(),
				'startPos': this.containerObject.position().left,
				'windowWidth': $(window).width(),
				'isTouch': ( event.type === 'touchstart' )
			};
		
	};
	
	Slideshow.prototype.swipeContinue = function Slideshow$swipeContinue( event ) {
		
		var oldX = this.currentDrag.currentX,
			currentX = event.pageX,
			currentY = event.pageY,
			windowWidth = this.currentDrag.windowWidth,
			newPos,
			isTouch = (event.type === 'touchmove');
		
		// make sure events are consistent
		if ( isTouch !== this.currentDrag.isTouch )
		{
			return;
		}
		
		this.currentDrag.currentX = currentX;
		this.currentDrag.currentY = currentY;
			
		if ( oldX === currentX )
		{
			// horizontal position didn't change
			return;
		}
		
		// user is dragging, so turn off the automatic slideshow
		this.turnOffAutomaticMode();
		
		// where should the new left coordinate be?
		newPos = this.currentDrag.startPos + currentX - this.currentDrag.startX;
										
		// increase resistance if dragging past boundaries
		if ( newPos > 0 )
		{
			newPos /= 2;
		}
		else if ( newPos < -1 * windowWidth * this.maxIndex )
		{
			newPos = ( newPos + windowWidth * this.maxIndex ) / 2 - windowWidth * this.maxIndex;
		}
		
		this.containerObject.css( 'left', newPos );
		
	};
	
	Slideshow.prototype.swipeStop = function Slideshow$swipeStop( event ) {
		
		var timeDelta = new Date().getTime() - this.currentDrag.startTime,
			currentX = this.currentDrag.currentX,
			currentY = this.currentDrag.currentY,
			startX = this.currentDrag.startX,
			posDelta = currentX - startX,
			triggerSlide = false,
			isTouch = (event.type === 'touchend' || event.type === 'touchcancel');
		
		// make sure events are consistent
		if ( isTouch !== this.currentDrag.isTouch )
		{
			return;
		}
		
		// user didn't move very far--interpret as a click and close the slideshow
		if ( Math.abs( this.currentDrag.startY - currentY ) < 5 && Math.abs( startX - currentX ) < 5 )
		{
			this.hideSlideshow();
			this.currentDrag = {};
			return;
		}
								
		// trigger a slide in two scenarios:
		if ( timeDelta < 250 && Math.abs( posDelta ) > 20 )
		{
			// 1) short, quick swipes
			triggerSlide = true;
		}
		else if ( Math.abs( posDelta ) > this.currentDrag.windowWidth / 2 )
		{
			// 2) long, slow swipes (more than 50% the slide width)
			triggerSlide = true;
		}
		
		if ( triggerSlide )
		{
			if ( posDelta > 0 )
			{
				this.prevSlide();
			}
			else
			{
				this.nextSlide();
			}
		}
		else
		{
			this.slideTo( this.currentSlide );
		}
		
		this.currentDrag = {};
		
	};
	
	Slideshow.prototype.turnOffAutomaticMode = function Slideshow$turnOffAutomaticMode() {
	
		this.isAutomaticMode = false;
		
		$('.icon-play', this.playPauseButton ).show();
		$('.icon-pause', this.playPauseButton ).hide();
		
		clearTimeout( this.timeoutId );
		
	};
	
	Slideshow.prototype.setSlideTimeout = function Slideshow$setSlideTimeout() {
	
		var _this = this;
		
		this.timeoutId = setTimeout( function Slideshow$nextSlideDelegate() {
				_this.nextSlide();
			},
			this.options.delay
		);
		
	};
	
	Slideshow.prototype.toggleAutomaticMode = function Slideshow$toggleAutomaticMode() {
	
		this.isAutomaticMode = !this.isAutomaticMode;

		if ( this.isAutomaticMode ) {
			$( '.icon-pause', this.playPauseButton ).show();
			$( '.icon-play', this.playPauseButton ).hide();
			
			this.setSlideTimeout();
		}
		else {
			$( '.icon-play', this.playPauseButton ).show();
			$( '.icon-pause', this.playPauseButton ).hide();
		
			clearTimeout( this.timeoutId );
		}
		
	};
	
	Slideshow.prototype.toggleFullscreen = function Slideshow$toggleFullscreen() {
										
		this.isFullscreen = !this.isFullscreen;

		if ( this.isFullscreen ) {
			$( '.icon-resize-small', this.fullscreenButton ).show();
			$( '.icon-resize-full', this.fullscreenButton ).hide();
		}
		else {
			$( '.icon-resize-full', this.fullscreenButton ).show();
			$( '.icon-resize-small', this.fullscreenButton ).hide();
		}
		
		this.resizeAllImages();
	};
	
	Slideshow.prototype.prevSlide = function Slideshow$prevSlide() {
		
		if ( this.currentSlide > 0 )
		{
			this.slideTo( this.currentSlide - 1 );
		}
		else
		{
			this.slideTo( 0 );
		}
		
	};
	
	Slideshow.prototype.nextSlide = function Slideshow$nextSlide() {
	
		if ( this.currentSlide < this.maxIndex )
		{
			this.slideTo( this.currentSlide + 1 );
		}
		else
		{
			this.slideTo( this.maxIndex );
		}
		
		if ( this.isAutomaticMode ) {
		
			if ( this.currentSlide === this.maxIndex ) {
				this.turnOffAutomaticMode();
			}
			else {
				this.setSlideTimeout();
			}
		}
		
	};
	
	Slideshow.prototype.slideTo = function Slideshow$slideTo( index, suppressAnimation ) {
	
		var slideObject,
			_this = this;
	
		if ( index < 0 || index > this.maxIndex )
		{
			// don't try to slide past boundaries
			return;
		}
		
		slideObject = this.slideObjects[ index ];
		
		// disable the previous button if we're on the first slide
		if (index === 0)
		{
			this.prevButton.attr( 'disabled', 'disabled' );
		}
		else
		{
			this.prevButton.removeAttr( 'disabled' );
		}
				
		// disable the next button if we're on the last slide				
		if (index === this.maxIndex)
		{
			this.nextButton.attr( 'disabled', 'disabled' );
		}
		else
		{
			this.nextButton.removeAttr( 'disabled' );
		}
								
		this.preloadImage( slideObject );
		
		if ( index > 0 )
		{
			// queue up the previous image for quick slide action
			this.preloadImage( this.slideObjects[ index - 1 ] );
		}
		
		if ( index < this.maxIndex )
		{
			// queue up the next image for quick slide action
			this.preloadImage( this.slideObjects[ index + 1 ] );
		}
		
		this.currentSlide = index;
		
		this.footerObject.text( slideObject.data( 'slideshow-slide-desc' ) );
								
		if ( suppressAnimation ) {
			this.containerObject.css(
				{
					'left': -1 * index * $(window).width()
				}
			);
			this.showSlideshow();
		}
		else {
			this.containerObject.animate(
				{
					'left': -1 * index * $(window).width()
				},
				{
					'complete': function Slideshow$showSlideshowWrapper() {
						_this.showSlideshow();
					}
				}
			);
		}
		
	};
	
	Slideshow.prototype.keypressHandler = function Slideshow$keypressHandler( event ) {
	
		var whichKey = event.keyCode;
		
		console.log('keypress: ' + whichKey);
		
		switch ( whichKey ) {
		
			case 27:  // escape - closes the slideshow
				event.preventDefault();
				event.stopPropagation();
				this.hideSlideshow();
				break;
				
			case 36:  // home - go to first slide
				event.preventDefault();
				event.stopPropagation();
				this.slideTo( 0 );
				break;
				
			case 35:  // end - go to last slide
				event.preventDefault();
				event.stopPropagation();
				this.slideTo( this.maxIndex );
				break;
				
			case 37:  // left arrow - go to previous slide
			case 38:  // up arrow - go to previous slide
			case 33:  // page up - go to previous slide
			case 8:  // backspace - go to previous slide
				event.preventDefault();
				event.stopPropagation();
				this.prevSlide();
				break;
				
			case 39:  // right arrow - go to next slide
			case 40:  // up arrow - go to next slide
			case 34:  // page down - go to next slide
			case 13:  // enter - go to next slide
			case 32:  // space bar - go to next slide
			case 9:  // tab - go to next slide
				event.preventDefault();
				event.stopPropagation();
				this.nextSlide();
				break;
		
		}
		
	};
	
	Slideshow.prototype.showSlideshow = function Slideshow$showSlideshow() {
	
		var _this = this;
		
		if ( this.isVisible ) {
			return;
		}

		this.wireUpListeners();
	
		this.backdropObject.show();
		this.isVisible = true;
		
	};
	
	Slideshow.prototype.hideSlideshow = function Slideshow$hideSlideshow() {
	
		// stop listening for events
		$(document).off('.slideshow');
		
		if ( !this.isVisible ) {
			return;
		}
		
		this.backdropObject.hide();
		this.isVisible = false;
		
		this.turnOffAutomaticMode();
		
	};
	
	Slideshow.prototype.buildBackdrop = function Slideshow$buildBackdrop() {
		
		// build a backdrop object and insert it after the gallery
		this.backdropObject = $('<div>')
			.addClass('slideshow-backdrop slideshow-expand')
			.hide();
			
		// tack this backdrop element onto the document after the gallery
		$(this.element).after(this.backdropObject);
	};
	
	Slideshow.prototype.expandDivs = function Slideshow$expandDivs() {
				
		var window_width = $(window).width(),
			window_height = $(window).height(),
			index = 0;
	
		$('.slideshow-expand').css(
			{
				'width': window_width,
				'height': window_height
			}
		);
		
		$('.slideshow-header, .slideshow-footer').css(
			{
				'width': window_width
			}
		);
		
		$('.slideshow-slide').each(
			function Slideshow$AssignCSS()
			{
				$(this).css('left', (index++) * window_width);
			}
		);
	};
	
	Slideshow.prototype.getContainer = function Slideshow$getContainer() {
		
		if ( this.containerObject ) {
			return this.containerObject;
		}
		
		this.containerObject = $('<div>')
			.addClass('slideshow-deck slideshow-expand');
				
		return this.containerObject;
	};
	
	Slideshow.prototype.initSlides = function Slideshow$initSlides() {
		
		var index = 0,
			_this = this;
		
		// assign each link a unique index
		$('a', this.element ).each(
			function Slideshow$BuildSlide() {
			
				// store index with the link, image with the slide
				var link = $(this),
					slideObject;
				link.data('slideshow-slide-index', index);
				
				// build a container div for the slide
				slideObject = $('<div>')
						.addClass('slideshow-slide slideshow-expand')
						.data(
							{
								'slideshow-slide-index': index,
								'slideshow-slide-image': link.attr('href'),
								'slideshow-slide-desc': link.attr('title')
							});
							
				_this.containerObject.append( slideObject );
				_this.slideObjects[ index ] = slideObject;
				index++;
			}
		).click(
			function Slideshow$ImageClickHandler(clickEvent) {
					
				clickEvent.preventDefault();							
				
				_this.slideTo( $(this).data( 'slideshow-slide-index' ) );
				
			}
		);
		
		// store the max index so we'll know when we've hit the end
		this.maxIndex = index - 1;
	};
	
	Slideshow.prototype.getHeader = function Slideshow$getHeader() {
		
		var prevnextButtonGroup,
			playpauseButtonGroup,
			fullscreenButtonGroup,
			exitButtonGroup;
			
		if ( this.headerObject ) {
			return this.headerObject;
		}
		
		this.headerObject = $('<div>')
			.addClass('slideshow-header');
		
		this.prevButton = $('<button>')
			.addClass('btn btn-inverse')
			.append('<i class="icon-arrow-left icon-white"></i>');
			
		this.nextButton = $('<button>')
			.addClass('btn btn-inverse')
			.append('<i class="icon-arrow-right icon-white"></i>');
		
		this.playPauseButton = $('<button>')
			.addClass('btn btn-inverse')
			.append('<i class="icon-play icon-white"></i><i class="icon-pause icon-white"></i>');
		
		if (this.isAutomaticMode)
		{
			$( '.icon-play', this.playPauseButton ).hide();
		}
		else
		{
			$( '.icon-pause', this.playPauseButton ).hide();
		}
		
		this.exitButton = $('<button>')
			.addClass('btn btn-inverse')
			.append('<i class="icon-remove icon-white"></i>');
		
		this.fullscreenButton = $('<button>')
			.addClass('btn btn-inverse')
			.append('<i class="icon-resize-full icon-white"></i><i class="icon-resize-small icon-white"></i>');
			
		
		if (this.isFullscreen)
		{
			$( '.icon-resize-full', this.fullscreenButton ).hide();
		}
		else
		{
			$( '.icon-resize-small', this.fullscreenButton ).hide();
		}
		
		prevnextButtonGroup = $('<div>')
			.addClass('btn-group slideshow-button-group-left')
			.append( this.prevButton )
			.append( this.nextButton );
			
		playpauseButtonGroup = $('<div>')
			.addClass('btn-group slideshow-button-group-left slideshow-button-group-edge')
			.append( this.playPauseButton );
			
		fullscreenButtonGroup = $('<div>')
			.addClass('btn-group slideshow-button-group-right')
			.append( this.fullscreenButton );
			
		exitButtonGroup = $('<div>')
			.addClass('btn-group slideshow-button-group-right slideshow-button-group-edge')
			.append( this.exitButton );
		
		this.headerObject.append( playpauseButtonGroup );
		this.headerObject.append( prevnextButtonGroup );
		this.headerObject.append( exitButtonGroup );
		this.headerObject.append( fullscreenButtonGroup );
		
		return this.headerObject;
	};
	
	Slideshow.prototype.getFooter = function Slideshow$getHeader() {
		
		if ( this.footerObject ) {
			return this.footerObject;
		}
	
		this.footerObject = $('<div>')
			.addClass('slideshow-footer');
			
		return this.footerObject;
	};
	
	$.fn[pluginName] = function ( options ) {
	
		return this.each(
			function () {
				if ( !$.data( this, 'plugin_' + pluginName ) ) {
					$.data( this, 'plugin_' + pluginName, new Slideshow( this, options ) );
				}
			}
		);
	
	};
	
})( jQuery, window, document );

