
import React from 'react';
import PropTypes from 'prop-types';
import Question from './question';


export default class QuestionContainer extends React.Component {


	constructor( props ) {

		super( props );

		this.state = {

			value     : '',
			isInvalid : true

		};

		this.patternPrompt = 'You need to enter a valid context to proceed.';
		this.requiredPrompt = 'Please enter or choose a context to be able to move forward.';

	}

	componentDidMount() {

		const { data: { default: defaultValue } } = this.props;

		this.setState({ value: defaultValue }, () => {

			this.validate();

		});


	}

	validate() {

		const {

			data: {

				type,
				validation: {

					pattern,
					required,
					prompts: {

						pattern: patternPrompt,
						required: requiredPrompt

					}

				}

			},
			prompt,
			validate

		} = this.props;

		const currentValue = this.state.value;

		let isInvalid = required && ! currentValue;
		let promptMessage = requiredPrompt ? requiredPrompt : this.requiredPrompt;

		if ( ! isInvalid && type == 'text' && pattern ) {

			const re = new RegExp( pattern );

			isInvalid = ! re.test( currentValue );
			promptMessage = patternPrompt ? patternPrompt : this.patternPrompt;

		}

		this.setState({ isInvalid });
		validate( ! isInvalid, currentValue );
		prompt( isInvalid ? promptMessage : null );


	}

	onChange( event ) {

		this.setState({ value: event.target.value }, () => {

			this.validate();

		});

	}

	onSubmit( event ) {

		event.preventDefault();

		if ( ! this.state.isInvalid ) {

			this.props.next();

		}

	}

	render() {

		const {

			data: {

				id,
				type,
				title,
				options,
				centered,
				placeholder,
				validation: {

					required,
					pattern

				}

			},
			next,
			prompt,
			validate,
			...restProps

		} = this.props;

		return (

			<Question
				id={ id }
				type={ type }
				title={ title }
				options={ options }
				pattern={ pattern }
				centered={ !! centered }
				required={ !! required }
				onChange={ ( event ) => { this.onChange( event ); } }
				onSubmit={ ( event ) => { this.onSubmit( event ); } }
				isInvalid={ !! this.state.isInvalid }
				placeholder={ placeholder }
				defaultValue={ this.state.value }
				{ ...restProps }
			/>

		);

	}


}

QuestionContainer.propTypes = {

	data     : PropTypes.object.isRequired,
	next     : PropTypes.func.isRequired,
	prompt   : PropTypes.func.isRequired,
	validate : PropTypes.func.isRequired

};

QuestionContainer.defaultProps = {

	data     : {},
	next     : null,
	prompt   : null,
	validate : null

};
