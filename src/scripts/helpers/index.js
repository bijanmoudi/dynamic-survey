
import React from 'react';


export function getText( element = null ) {

	if ( typeof element == 'string' ) {

		return element;

	} else if ( typeof element == 'number' ) {

		return element.toString();

	} else if ( element.constructor === Array ) {

		
		let elementTextComponents = [];

		element.forEach( ( elem ) => {

			const elementText = getText( elem );

			if ( elementText ) {

				elementTextComponents.push( elementText );

			};

		});

		return elementTextComponents.join( ' ' );

	} else if ( React.isValidElement( element ) ) {

		return getText( element.props.children );

	}

	return '';

};


export default {

	getText

};