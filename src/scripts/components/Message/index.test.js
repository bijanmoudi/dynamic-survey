
import React from 'react';
import Message from './index';
import renderer from 'react-test-renderer';

describe( 'Testing "Message" component', () => {

	it( 'Output should be the same as previous snapshot', () => {

		var component = renderer.create( <Message type="error">An error occured.</Message> );
		expect( component.toJSON() ).toMatchSnapshot();

	});

});
