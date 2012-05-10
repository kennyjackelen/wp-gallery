(function($)
{
	$.fn.extend({
		slideshow: function(options)
			{			
				// set default values
				var defaults = {
					index: 0,
					speed: 300,
					delay: 0			
				};
				
				var options = $.extend(defaults, options);
				
				var expandDivs = function Slideshow$ExpandDivs()
				{				
					var window_width = $(window).width();
					var window_height = $(window).height();
				
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
					
					var index = 0;
					$('.slideshow-slide').each(
						function Slideshow$AssignCSS()
						{
							$(this).css('left', (index++) * window_width);
						}
					);
				};
				
				var resizeImage = function Slideshow$ResizeImage(image_object)
				{
					var window_height = $(window).height();
					var window_width = $(window).width();
					var image_height = image_object.get(0).height;
					var image_width = image_object.get(0).width;
					
					// scale image to fit in parent
					if (image_height > window_height || image_width > window_width)
					{
						console.log('bigger');
						image_object.height(window_height);
						image_height = window_height;
						image_width = image_object.get(0).width;
						if(image_width > window_width)
						{
							image_object.width(window_width);
							image_width = window_width;
						}
					}
					
					// center image in the div
					image_object.css(
						{
							'top': (window_height - image_height)/2,
							'left': (window_width - image_width)/2
						}
					);
				};
				
				var preloadImage = function Slideshow$PreloadImage(slide_object)
				{
					// slide already contains an image, leave it be
					if ($('img',slide_object).length !== 0)
					{
						return;
					}
					var img_object = $('<img>')
						.attr('src', slide_object.data('slideshow-slide-image'))
						.addClass('slideshow-image')
						.css(
							{
								'border': 'none',
								'position': 'relative',
								'margin': 0,
								'padding': 0
							}
						);
						
					slide_object.append(img_object);
					
					img_object.load(
						function Slideshow$ImageLoaded()
						{
							resizeImage($(this));
						}
					);
				};
				
				return this.each(
					function()
					{
						var o = options;
						
						var obj = $(this);
						
						// this thing needs an ID. needs it!
						var source_id = obj.attr('id');
						if (source_id === '')
						{
							return;
						}
						
						var current_index;
						var max_index;
						var isVisible = false;
						
						var dragStartTime;
						var dragWindowWidth;
						var dragMouseStart;
						var dragElementStart;
						var dragPosition;
						var isDragging;
						
						// build a backdrop object and insert it after the gallery
						var backdrop_id = source_id + '-slideshow-backdrop';
						var backdrop_object = $('<div>')
							.attr('id',backdrop_id)
							.addClass('slideshow-expand')
							.css(
								{
									'margin': 0,
									'padding': 0,
									'border': 0,
									'outline': 0,
									'position': 'fixed',
									'top': 0,
									'left': 0,
									'background-color': '#232927',
									'background-color': 'rgba(0,0,0,0.75)',
									'z-index': 10000
								})
							.hide();
						obj.after(backdrop_object);
						
						// build a container object for the slideshow and insert it inside the backdrop
						var container_id = source_id + '-slideshow';
						var container_object = $('<div>')
							.attr('id',container_id)
							.addClass('slideshow-expand')
							.css(
								{
									'position': 'fixed',
									'top': 0,
									'left': 0
								});
						backdrop_object.append(container_object);
						

						var header_object = $('<div>')
							.addClass('slideshow-header')
							.css(
								{
									'padding': '15px',
									'padding-right': '150px',
									'position': 'fixed',
									'top': '0',
									'left': 0,
									'background-color': '#000000',
									'background-color': 'rgba(0,0,0,0.5)',
									'z-index': 20000								
								}
							);
						
						var prev_button_object = $('<button>')
							.addClass('btn')
							.addClass('btn-inverse')
							.click(
								function Slideshow$PrevClicked(clickEvent)
								{
									container_object.trigger('prev');
								}
							)
							.append('<i class="icon-arrow-left icon-white">');
						var next_button_object = $('<button>')
							.addClass('btn')
							.addClass('btn-inverse')
							.click(
								function Slideshow$NextClicked(clickEvent)
								{
									container_object.trigger('next');
								}
							)
							.append('<i class="icon-arrow-right icon-white">');
						
						var exit_button_object = $('<button>')
							.addClass('btn')
							.addClass('btn-inverse')
							.click(
								function Slideshow$ExitClicked(clickEvent)
								{
									// close the slideshow
									backdrop_object.hide();
									isVisible = false;

								}
							)
							.append('<i class="icon-remove icon-white">');
						
						var fullscreen_button_object = $('<button>')
							.addClass('btn')
							.addClass('btn-inverse')
							.click(
								function Slideshow$FullscreenClicked(clickEvent)
								{
									// nothing yet
								}
							)
							.append('<i class="icon-resize-full icon-white">');
							
						
						var prevnext_button_group = $('<div>')
							.css('float','left')
							.addClass('btn-group')
							.append(prev_button_object)
							.append(next_button_object);
							
						var fullscreen_button_group = $('<div>')
							.css('float','left')
							.addClass('btn-group')
							.append(fullscreen_button_object);
							
						var exit_button_group = $('<div>')
							.css('float','left')
							.addClass('btn-group')
							.append(exit_button_object);
						
						header_object.append(exit_button_group);
						header_object.append(prevnext_button_group);
						header_object.append(fullscreen_button_group);
						
						backdrop_object.append(header_object);
						
						// assign each link a unique index
						var index = 0;
						$('a', obj).each(
							function Slideshow$AssignID()
							{
								var slide_id = container_id + '-' + index;
								
								// build a container div for the slide
								var slide_object = $('<div>')
									.attr('id',slide_id)
									.addClass('slideshow-slide')
									.addClass('slideshow-expand')
									.css(
										{
											'position': 'absolute',
											'top': 0
										});
									/*	
									.click(
										function Slideshow$SlideClicked(clickEvent)
										{
											console.log('slide clicked');
											container_object.trigger('next');
										}
									);*/
										
								container_object.append(slide_object);
																
								// store index with the link, image with the slide
								var link = $(this);
								link.data('slideshow-slide-index', index);
								slide_object.data('slideshow-slide-index', index);
								slide_object.data('slideshow-slide-image', link.attr('href'));
								slide_object.data('slideshow-slide-desc', link.attr('title'));
								
								index++;
							}
						).click(
							function Slideshow$ImageClicked(clickEvent)
							{
								clickEvent.preventDefault();
								
								var link = $(this);								
								
								// populate the slide event
								var slideEvent = jQuery.Event('slide-to');
								slideEvent.slideIndex = link.data('slideshow-slide-index');
								
								// tell the container to slide to the clicked image
								container_object.trigger(slideEvent);
							}
						);
						
						// store the max index so we'll know when we've hit the end
						max_index = index - 1;
						
						
						var footer_object = $('<div>')
							.addClass('slideshow-footer')
							.css(
								{
									'height': '10%',
									'position': 'fixed',
									'top': '90%',
									'left': 0,
									'background-color': '#000000',
									'background-color': 'rgba(0,0,0,0.5)',
									'text-align': 'center',
									'z-index': 20000								
								}
							);
						backdrop_object.append(footer_object);
						
						
						container_object
						.on('slide-to',
							function Slideshow$SlideHandler(slideEvent)
							{
								var index = slideEvent.slideIndex;
								
								console.log('slide to ' + index);
								
								// check if we've hit a boundary
								if (index < 0 || index > max_index)
								{
									// close the slideshow
									backdrop_object.hide();
									isVisible = false;
									return;
								}
								
								if (index === 0)
								{
									prev_button_object.attr('disabled','disabled');
								}
								else
								{
									prev_button_object.removeAttr('disabled');
								}
								
								if (index === max_index)
								{
									next_button_object.attr('disabled','disabled');
								}
								else
								{
									next_button_object.removeAttr('disabled');
								}
								
								current_index = index;
								
								var slide_object = $('#' + container_id + '-' + index);
								
								preloadImage($('#' + container_id + '-' + index));
								
								if (index > 0)
								{
									// queue up the previous image for quick slide action
									preloadImage($('#' + container_id + '-' + (index-1) ));
								}
								
								if (index < max_index)
								{
									// queue up the next image for quick slide action
									preloadImage($('#' + container_id + '-' + (index+1) ));
								}
								
								footer_object.text(slide_object.data('slideshow-slide-desc'));
								
								container_object.animate(
									{
										'left': '-' + index * $(window).width()
									},
									{
										'complete': function Slideshow$AnimationComplete()
											{
												backdrop_object.show();
												isVisible = true;

											}
									}
								);
								
							}
						)
						.on('prev',
							function Slideshow$PrevHandler(prevEvent)
							{
								console.log('prev');
								
								// populate the slide event
								var slideEvent = jQuery.Event('slide-to');
								slideEvent.slideIndex = current_index - 1;
								
								// tell the container to slide to the previous slide
								container_object.trigger(slideEvent);
							}
						)
						.on('next',
							function Slideshow$NextHandler(nextEvent)
							{
								console.log('next');
								
								// populate the slide event
								var slideEvent = jQuery.Event('slide-to');
								slideEvent.slideIndex = current_index + 1;
								
								// tell the container to slide to the previous slide
								container_object.trigger(slideEvent);
							}
						)
						.on('mousedown touchstart',
							function Slideshow$MouseDownHandler(mouseEvent)
							{
								var isTouch = (mouseEvent.type === 'touchstart');
							
								// only care about left-click
								if (mouseEvent.which !== 1)
								{
									return;
								}
								
								mouseEvent.preventDefault();
								mouseEvent.stopPropagation();
								
								// set up module-level variables
								dragWindowWidth = $(window).width();
								dragStartTime = new Date().getTime();
								if (isTouch)
								{
									dragMouseStart = mouseEvent.targetTouches[0].pageX;
								}
								else
								{
									dragMouseStart = mouseEvent.pageX;
								}
								dragElementStart = container_object.position().left;
								isDragging = true;
								
								//console.log('mouse down at x=' + mouseEvent.pageX + ' y=' + mouseEvent.pageY);
								
								$(this).on('mousemove touchmove',
									function Slideshow$MouseMoveHandler(mouseEvent)
									{
										if (!isDragging)
										{
											// shouldn't happen, but just in case
											return;
										}
										
										var isTouch = (mouseEvent.type === 'touchmove');
								
										mouseEvent.preventDefault();
										mouseEvent.stopPropagation();
										
										//console.log('mouse move to x=' + mouseEvent.pageX + ' y=' + mouseEvent.pageY);
										
										if (isTouch)
										{
											dragPosition = mouseEvent.targetTouches[0].pageX;
										}
										else
										{
											dragPosition = mouseEvent.pageX;
										}
										
										var newPos = dragElementStart + dragPosition - dragMouseStart;
										
										// increase resistance if dragging past boundaries
										if (newPos > 0)
										{
											newPos /= 2;
										}
										else if (newPos < -1 * dragWindowWidth* max_index)
										{
											newPos = (newPos + dragWindowWidth * max_index)/2 - dragWindowWidth * max_index;
										}
										
										$(this).css('left', newPos);
									}
								);
							}
						)
						.on('mouseup mouseleave touchend touchcancel',
							function Slideshow$MouseUpHandler(mouseEvent)
							{
								if (!isDragging)
								{
									return;
								}
								
								//console.log('mouse up at x=' + mouseEvent.pageX + ' y=' + mouseEvent.pageY);
								
								mouseEvent.preventDefault();
								mouseEvent.stopPropagation();
								
								isDragging = false;
								
								var timeDelta = new Date().getTime() - dragStartTime;
								var posDelta = dragPosition - dragMouseStart;
								var slideOffset = 0;
								
								// trigger a slide in two scenarios:
								if (timeDelta < 250 && Math.abs(posDelta) > 20)
								{
									// 1) short, quick swipes
									slideOffset = 1;
								}
								else if (Math.abs(posDelta) > dragWindowWidth / 2)
								{
									// 2) long, slow swipes (more than 50% the slide width)
									slideOffset = 1;
								}
								
								if (posDelta > 0)
								{
									slideOffset *= -1;
								}
								
								// don't slide past the boundaries
								if (current_index === 0 && slideOffset === -1)
								{
									slideOffset = 0;
								}
								else if (current_index === max_index && slideOffset === 1)
								{
									slideOffset = 0;
								}
																
								// populate the slide event
								var slideEvent = jQuery.Event('slide-to');
								slideEvent.slideIndex = current_index + slideOffset;
							
								// tell the container to slide to the current slide
								container_object.trigger(slideEvent);
									
								$(this).off('mousemove touchmove');
							}
						);
						
						// forward the window resize event to the container object
						$(window).resize(
							function Slideshow$WindowResize(resizeEvent)
							{
								expandDivs();
								
								// if the slideshow is visible, re-slide to the current slide to fix up the layout
								if (isVisible)
								{
									// populate the slide event
									var slideEvent = jQuery.Event('slide-to');
									slideEvent.slideIndex = current_index;
								
									// tell the container to slide to the current slide
									container_object.trigger(slideEvent);
								}
								
								$('.slideshow-image').each(
									function Slideshow$ResizeAllImages()
									{
										resizeImage($(this));
									}
								);
								
							}
						);
						
						expandDivs();
						
						return;
					}
				);
			}
		}); // extend
})(jQuery);

