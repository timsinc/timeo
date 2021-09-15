function Init( el )
{
	// initialize variables
	let tag = el;
	let url = tag.getAttribute('data-timeo-src') || false; 								// (str) youtube id
	let width = tag.getAttribute('data-timeo-width') || 480; 							// (int) max video width
	let align = tag.getAttribute('data-timeo-align').toLowerCase() || 'left';			// (str) left, right, center
	let poster = tag.getAttribute('data-timeo-poster') || false;						// (str) poster image url
	let autoplay = !! parseFloat( tag.getAttribute('data-timeo-autoplay') ) || false;	// (int) autoplay bool 1 or 0

	// create dom elements
	let viewport = document.createElement('div');
	let wrapper = document.createElement('div');
	let video = document.createElement('video');
	let button = document.createElement('button');

	// add dom element classes
	tag.classList.add('timeo');
	viewport.classList.add('timeo-viewport');
	wrapper.classList.add('timeo-wrapper');
	button.classList.add('timeo-button');

	// set video width
	tag.style.maxWidth = `${width}px`;

	// set video alignment
	if ( align == 'center' ) tag.style.margin = '0 auto';
	if ( align == 'left' ) tag.style.margin = '0 auto 0 0';
	if ( align == 'right' ) tag.style.margin = '0 0 0 auto';
	
	// hide viewport until the video player is ready to prevent playback attempts before the video is ready
	viewport.style.visibility = 'hidden';

	// when the video player is ready, unhide the video window
	video.addEventListener( 'canplay', ( event ) => {
		viewport.style.visibility = 'visible';
	});

	// if video has a poster image, show it when the video ends
	if ( !! poster )
	{
		video.addEventListener( 'ended', ( event ) => {
			Object.assign( button.style, {
				transition: 'none',
				visibility: 'visible',
				opacity: '1',
			});
		});	
	}

	// initialize video player
	video.src = url;
	video.controls = true;
	video.preload = 'metadata';
	video.setAttribute( 'controlsList', 'nodownload' );
	video.setAttribute( 'disablepictureinpicture', true );

	if ( autoplay )
	{
		video.autoplay = true;
		video.muted = true;
		video.loop = true;
	}
	
	// if this video has a poster image
	if ( !! poster )
	{
		// hide the video wrapper until the play button is clicked
		wrapper.style.visibility = 'hidden';

		// set button label text
		button.setAttribute( 'aria-label', 'Play Video' );

		// set poster image
		button.style.backgroundImage = `url(${poster})`;

		// when the play button is clicked
		button.addEventListener( 'click', function() 
		{
			// show the video wrapper
			wrapper.style.visibility = 'visible';

			// when the fade transition has ended
			button.addEventListener( 'transitionend', () => 
			{
				// hide the button so that video player interactions are accessible
				button.style.visibility = 'hidden';
			}, { 
				// run this listener only once
				once: true, 
			});

			// define and apply our button fadeout transition
			Object.assign( button.style, {
				transition: 'opacity .5s linear .5s',
				opacity: '0',
			});

			// play the video
			video.play();
		});

		// append button to viewport
		viewport.appendChild( button );
	}

	// append dom elements
	tag.appendChild( viewport );
	viewport.appendChild( wrapper );
	wrapper.appendChild( video );
}

export default Init;