
import React from 'react';
import Survey from './index';
import renderer from 'react-test-renderer';

describe( 'Testing "Survey" component', () => {

	it( 'Output should be the same as previous snapshot', () => {

		var component = renderer.create( <Survey id={ 1 } /> );
		expect( component.toJSON() ).toMatchSnapshot();

	});

});
