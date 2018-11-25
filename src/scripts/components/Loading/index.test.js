
import React from 'react';
import Loading from './index';
import renderer from 'react-test-renderer';

describe( 'Testing "Loading" component', () => {

	it( 'Output should be the same as previous snapshot', () => {

		var component = renderer.create( <Loading /> );
		expect( component.toJSON() ).toMatchSnapshot();

	});

});
