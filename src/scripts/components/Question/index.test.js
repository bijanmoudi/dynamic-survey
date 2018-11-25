
import React from 'react';
import Question from './index';
import renderer from 'react-test-renderer';

describe( 'Testing "Question" component', () => {

	it( 'Output should be the same as previous snapshot', () => {

		var component = renderer.create(
			<Question
				data={{
					id: 1,
					title: 'How old are you?',
					type: 'select',
					default: '31',
					centered: true,
					validation: {
						required: false,
						pattern: '',
						prompts: {
							required: '',
							pattern: ''
						}
					}
				}}
				next={ () => {} }
				prompt={ () => {} }
				validate={ () => {} }
			/>
		);
		expect( component.toJSON() ).toMatchSnapshot();

	});

});
