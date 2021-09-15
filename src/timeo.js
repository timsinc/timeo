import './timeo.css';
import YouTube from './inc/youtube';
import Vimeo from './inc/vimeo';
import MP4 from './inc/mp4';

const Init = function( selector )
{
	if ( typeof selector === 'undefined' ) 
	{
		console.error('Timeo video selector not provided.');
		return false;
	}

	const items = document.querySelectorAll( selector );

	items.forEach( item => 
	{
		const type = item.getAttribute('data-timeo').toLowerCase() || false;

		if ( ! type )
		{
			console.error('Timeo video type attribute [data-timeo] not defined.');
			return false;
		}
		
		const types = [ 'youtube', 'vimeo', 'mp4' ];

		if ( ! types.includes( type ) )
		{
			console.error('Timeo invalid video type provided. Available types are youtube, vimeo and mp4.');
			return false;
		}

		if ( type === 'youtube' ) YouTube( item );
		if ( type === 'vimeo' ) Vimeo( item );
		if ( type === 'mp4' ) MP4( item );
	});
};

window.Timeo = { Init };