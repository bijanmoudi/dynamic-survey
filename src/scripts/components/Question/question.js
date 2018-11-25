
import React from 'react';
import PropTypes from 'prop-types';


const Question = ( props ) => {


	const {

		id,
		type,
		title,
		options,
		pattern,
		centered,
		required,
		onChange,
		onSubmit,
		isInvalid,
		className,
		placeholder,
		defaultValue,
		errorMessageElementId,
		...restProps

	} = props;

	const ariaErrorMessage = errorMessageElementId && {

		'aria-errormessage' : errorMessageElementId

	};

	const roleGroup = type == 'radio' && {

		role : 'group'

	};

	const selectedOptionIds = type == 'radio' && options.filter( ( option ) => option.id.toString() == defaultValue.toString() );

	return (

		<div className={ `m-question ${ className }` } role="presentation" { ...restProps }>
			<form className="question__form" onSubmit={ onSubmit } noValidate>
				<fieldset className="question__wrapper clearfix">
					<legend className="question__title">{ title }</legend>
					<div className="question__input-container" { ...roleGroup }>
						{
							type == 'radio'
								? (
									options.map( ( option, key ) => {
										return (
											<label key={ key } className={ `question__input m-input input--radio ${ centered ? 'input--centered' : '' }` }>
												<input
													autoFocus
													type="radio"
													name={ id }
													value={ option.id }
													required={ required }
													checked={ option.id.toString() == defaultValue.toString() }
													onChange={ onChange }
													aria-invalid={ isInvalid }
													{ ...ariaErrorMessage }
												/>
												<span className="input__label">{ option.title }</span>
											</label>
										);
									})
								)
								: (
									<label className={ `question__input m-input input--${ type } ${ centered ? 'input--centered' : '' }` }>
										{
											type == 'text'
												? (
													<input
														autoFocus
														type="text"
														name={ id }
														value={ defaultValue }
														placeholder={ placeholder }
														required={ required }
														aria-invalid={ isInvalid }
														onChange={ onChange }
														pattern={ pattern ? `/${ pattern }/` : '' }
														spellCheck="false"
														autoCapitalize="off"
														autoCorrect="off"
														autoComplete="off"
														{ ...ariaErrorMessage }
													/>
												)
												: (
													<select
														autoFocus
														name={ id }
														required={ required }
														defaultValue={
															defaultValue
																? defaultValue.toString()
																: (
																	required ? '' : ( options.length ? options[0].value : '' )
																)
														}
														onChange={ onChange }
														aria-invalid={ isInvalid }
														{ ...ariaErrorMessage }
													>
														{
															required && ! defaultValue
																?  <option key="default" value="" disabled />
																: null
														}
														{
															options.map( ( option, key ) => {
																return (
																	<option
																		key={ key }
																		value={ option.id }
																	>{ option.title }</option>
																);
															})
														}
													</select>
												)
										}
									</label>
								)
						}
					</div>
				</fieldset>
				<input type="submit" className="hidden--visually" tabIndex="-1" />
			</form>
		</div>

	);


};

Question.propTypes = {

	type                  : PropTypes.oneOf([ 'text', 'select', 'radio' ]),
	title                 : PropTypes.string.isRequired,
	options               : PropTypes.array,
	pattern               : PropTypes.string,
	centered              : PropTypes.bool,
	required              : PropTypes.bool,
	onChange              : PropTypes.func.isRequired,
	onSubmit              : PropTypes.func.isRequired,
	isInvalid             : PropTypes.bool,
	className             : PropTypes.string,
	errorMessageElementId : PropTypes.string,
	placeholder           : PropTypes.string,
	defaultValue          : PropTypes.oneOfType([

		PropTypes.number.isRequired,
		PropTypes.string.isRequired

	]),
	id                    : PropTypes.oneOfType([

		PropTypes.number.isRequired,
		PropTypes.string.isRequired

	])

};

Question.defaultProps = {

	id                    : '',
	type                  : '',
	title                 : '',
	pattern               : '',
	options               : [],
	centered              : true,
	onChange              : null,
	onSubmit              : null,
	required              : true,
	isInvalid             : true,
	className             : '',
	placeholder           : '',
	defaultValue          : '',
	errorMessageElementId : ''

};


export default Question;
