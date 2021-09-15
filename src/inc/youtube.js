function Init( el )
{
	if ( typeof window.timeoYouTubeAPIReady === 'undefined' )
	{
		window.timeoYouTubeAPIReady = false;
	}

	window.onYouTubeIframeAPIReady = function()
	{
		window.timeoYouTubeAPIReady = true;
	}

	if ( ! document.querySelector( 'script#timeo-youtube-api' ) )
	{
		let apiScript = document.createElement('script');
		apiScript.id = 'timeo-youtube-api';
		apiScript.src = 'https://www.youtube.com/iframe_api';
		let firstScript = document.getElementsByTagName('script')[0];
		firstScript.parentNode.insertBefore( apiScript, firstScript );
	}

	let waiter = window.setInterval( function() 
	{
		if ( window.timeoYouTubeAPIReady )
		{
			clearInterval( waiter );
			Display( el );
		}
	}, 100 );
};

function Display( el )
{
	// initialize variables
	let tag = el;
	let id = tag.getAttribute('data-timeo-src') || false; 								// (str) youtube id
	let width = tag.getAttribute('data-timeo-width') || 480; 							// (int) max video width
	let align = tag.getAttribute('data-timeo-align').toLowerCase() || 'left';			// (str) left, right, center
	let poster = tag.getAttribute('data-timeo-poster') || false;						// (str) poster image url
	let autoplay = !! parseFloat( tag.getAttribute('data-timeo-autoplay') ) || false;	// (int) autoplay bool 1 or 0

	// create dom elements
	let viewport = document.createElement('div');
	let wrapper = document.createElement('div');
	let embed = document.createElement('div');
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
				'transition' : 'opacity 1s linear .5s',
				'opacity' : '0',
			});

			// play the video
			YouTubePlayer.playVideo();
		});

		// append button to viewport
		viewport.appendChild( button );
	}

	// append dom elements
	tag.appendChild( viewport );
	viewport.appendChild( wrapper );
	wrapper.appendChild( embed );

	let playerVars = {
		'playsinline': 1,
	};

	if ( autoplay )
	{
		Object.assign( playerVars, {
			'autoplay' : 1,
			'mute' : 1,
			'loop' : 1,
			'playlist': id,
		});
	}
	
	// initialize youtube player
	let YouTubePlayer = new YT.Player( embed, {
		width: '800',
		height: '450',
		videoId: id,
		playerVars: playerVars,
		events: {
			'onReady': ( event ) => {
				// unhide the video window when the video player is ready
				viewport.style.visibility = 'visible';
			},
			'onStateChange': ( event ) => {
				// if video has a poster image, show it when the video ends
				if ( !! poster && event.data === 0 )
				{
					Object.assign( button.style, {
						'transition' : 'none',
						'visibility' : 'visible',
						'opacity' : '1',
					});
				}
			},
		},
	});	
}

export default Init;