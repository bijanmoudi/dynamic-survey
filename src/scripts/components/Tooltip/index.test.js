
import React from 'react';
import Tooltip from './index';
import renderer from 'react-test-renderer';

describe( 'Testing "Tooltip" component', () => {

	it( 'Output should be the same as previous snapshot', () => {

		var component = renderer.create( <Tooltip color="red" direction="rt" role="alert">Just a simple alert tooltip</Tooltip> );
		expect( component.toJSON() ).toMatchSnapshot();

	});

});
