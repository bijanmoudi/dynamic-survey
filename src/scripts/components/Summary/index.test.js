
import React from 'react';
import Summary from './index';
import renderer from 'react-test-renderer';

describe( 'Testing "Summary" component', () => {

	it( 'Output should be the same as previous snapshot', () => {

		var component = renderer.create( 
			<Summary
				data={[{
					id: 1,
					title: 'How old are you?',
					type: 'select',
					default: '31',
					centered: true
				}]}
			/>
		);
		expect( component.toJSON() ).toMatchSnapshot();

	});

});
