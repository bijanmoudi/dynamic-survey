
import React from 'react';
import PropTypes from 'prop-types';


const Summary = ( props ) => {


	const getQuestionByIndex = ( index = null ) => {

		return index && props.data && props.data[ index ]
			? props.data[ index ]
			: null;

	};

	const getTitle = ( index = null ) => {

		const question = getQuestionByIndex( index );
		const title = question && question.title ? question.title : '';

		return index ? `Q${ parseInt( index ) + 1 }. ${ title }` : '';

	};

	const getAnswer = ( index = null ) => {

		const question = getQuestionByIndex( index );

		if (

			question &&
			question.type &&
			[ 'radio', 'select' ].includes( question.type ) &&
			question.options &&
			question.options.length &&
			question.default

		) {

			const options = question.options;
			const selectedOption = Object.keys( options ).filter( ( optionIndex ) => {

				return options[ optionIndex ].id && options[ optionIndex ].id.toString() == question.default;

			});

			return options[ selectedOption ].title ? options[ selectedOption ].title : null;

		}

		return question.default ? question.default : null;

	};

	const {

		data,
		className,
		...restProps

	} = props;

	return (

		<div className={ `m-summary ${ className }` }>
			{
				data.length
					? (
						<ol className="summary__items">
							{
								Object.keys( data ).map( ( index ) => {
									const answer = getAnswer( index );
									return (
										<li className="summary__item" key={ index }>
											<div className="m-question">
												<h3 className="question__title">{ getTitle( index ) }</h3>
												<p className={ `question__answer ${ answer ? '' : 'answer--null' }` }>{ answer ? answer : 'not answered' }</p>
											</div>
										</li>
									);
								})
							}
						</ol>
					)
					: (
						<p>No answer available.</p>
					)
			}
		</div>

	);


};

Summary.propTypes = {

	data : PropTypes.array.isRequired,

};

Summary.defaultProps = {

	data : []

};


export default Summary;
