
import React from 'react';
import Progress from './index';
import renderer from 'react-test-renderer';

describe( 'Testing "Progress" component', () => {

	it( 'Output should be the same as previous snapshot', () => {

		var component = renderer.create( <Progress totalSteps={ 5 } currentStep={ 1 } currentLabel="Q1" /> );
		expect( component.toJSON() ).toMatchSnapshot();

	});

});
