function onPageLoad()
{
	$('.dropdown-toggle').dropdown();
	$('.gallery').slideshow();
	
	if (Modernizr.csstransforms)
	{
		/*$('.gallery').each(setupGallery);*/
		
	}
}

function setupGallery()
{
	var galleryObject = $(this);
	var galleryId = galleryObject.attr('id');
	var swipeId = galleryId + '-swipe';
	var swipeMain = $('<div id="' + swipeId + '"></div>');
	var swipeList = $('<ul></ul>');
	var swipeContainer = $('<div id=' + swipeId + '-container' + '"></div>');
	var swipeHeader = $('<div id=' + swipeId + '-header' + '"></div>');
	var swipeFooter = $('<div id=' + swipeId + '-footer' + '"></div>');
	
	swipeContainer.css(
		{
			'top': 0,
			'left': 0,
			'position': 'fixed',
			'width': '100%',
			'height': '100%',
			'background-color': '#232927',
			'background-color': 'rgba(0,0,0,0.5)',
			'z-index': 10000
		}
	).hide();
	
	swipeHeader.css(
		{
			'height': '10%',
			'width': '100%',
			'position': 'fixed',
			'top': 0,
			'left': 0,
			'background-color': '#000000',
			'background-color': 'rgba(0,0,0,0.5)',
			'text-align': 'center',
			'z-index': 20000	
		}
	).text('header');
	
	swipeFooter.css(
		{
			'height': '10%',
			'width': '100%',
			'position': 'fixed',
			'top': '90%',
			'left': 0,
			'background-color': '#000000',
			'background-color': 'rgba(0,0,0,0.5)',
			'text-align': 'center',
			'z-index': 20000	
		}
	).text('footer');
	
	// insert the swipe element into the DOM after the gallery
	galleryObject.after(swipeContainer);
	swipeContainer.append(swipeHeader);
	swipeContainer.append(swipeMain);
	swipeContainer.append(swipeFooter);
	swipeMain.append(swipeList);
	
	var index = 0;
	$('a', galleryObject)
	.each(
		function()
		{
			var linkObject = $(this);
			var imgUrl = linkObject.attr('href');
			
			if (index == 0)
			{
				swipeList.append('<li style="display:block"><img src="' + imgUrl + '"></li>');
			}
			else
			{
				swipeList.append('<li style="display:none"><img src="' + imgUrl + '"></li>');
			}
			
			linkObject.data('swipe-index',index);
			
			index++;
		}
	);

	var swipeObject = new Swipe(swipeMain.get(0));
	
	swipeContainer.show();
}

$(onPageLoad);
