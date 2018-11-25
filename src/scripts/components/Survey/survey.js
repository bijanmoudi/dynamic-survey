
import React from 'react';
import PropTypes from 'prop-types';
import Progress from '../Progress';
import Tooltip from '../Tooltip';
import Question from '../Question';
import Summary from '../Summary';


const Survey = ( props ) => {

	const {

		id,
		back,
		next,
		reset,
		title,
		prompt,
		isLast,
		isFirst,
		isValid,
		question,
		questions,
		summaryId,
		className,
		showPrompt,
		totalCount,
		currentIndex,
		setValidation,
		...restProps

	} = props;

	const ariaLablledBy = title && {

		'aria-labelledby' : `survey-${ id }-title`

	};

	return (

		<div className={ `m-wizard clearfix ${ className }` } { ...ariaLablledBy } { ...restProps }>
			{
				title &&
				<h2 id={ `survey-${ id }-title` } className="wizard__title">{ title }</h2>
			}
			<div className="wizard__wrapper clearfix">
				<div className="wizard__body">
					<Progress
						className="wizard__progress"
						totalSteps={ totalCount }
						currentStep={ currentIndex + 1 }
						currentLabel={
							question == summaryId
								? (
									<span>
										<span>✔</span>
										<span className="hidden--md">Summary</span>
									</span>
								)
								: `Q${ currentIndex + 1 }`
						}
					/>
					<div className="wizard__content">
						{
							question == summaryId
								? (
									questions &&
									<Summary
										data={ questions }
										className="wizard__summary"
									/>
								)
								: (
									question &&
									<Question
										key={ question.id }
										next={ next }
										data={ question }
										prompt={ showPrompt }
										validate={ setValidation }
										className="wizard__question"
										errorMessageElementId={ `survey-${ id }-validation-hint` }
									/>
								)
						}
					</div>
				</div>
				<nav className="wizard__navigation clearfix" aria-label="Navigation">
					<ul className="navigation__items">
						{
							isLast
								? (
									<li className="navigation__item">
										<button type="submit" onClick={ reset } className="navigation__button button--next m-button button--primary" aria-hidden={ ! isLast }>Restart</button>
									</li>
								)
								: (
									<li className="navigation__item">
										<button type="submit" onClick={ next } className="navigation__button button--next m-button button--primary" disabled={ ! isValid } aria-hidden={ isLast }>Next</button>
									</li>
								)
						}
						<li className="navigation__item">
							<button type="button" onClick={ back } className="navigation__button button--prev m-button" aria-hidden={ isFirst }>Back</button>
						</li>
					</ul>
					{
						prompt &&
						<Tooltip
							role="alert"
							color="gray-dark"
							direction="tr"
							className="navigation__tip"
							id={ `survey-${ id }-validation-hint` }
						>{ prompt }</Tooltip>
					}
				</nav>
			</div>
		</div>

	);

};

Survey.propTypes = {

	back          : PropTypes.func.isRequired,
	next          : PropTypes.func.isRequired,
	reset         : PropTypes.func.isRequired,
	title         : PropTypes.string,
	prompt        : PropTypes.string,
	isLast        : PropTypes.bool.isRequired,
	isFirst       : PropTypes.bool.isRequired,
	isValid       : PropTypes.bool.isRequired,
	questions     : PropTypes.array.isRequired,
	showPrompt    : PropTypes.func.isRequired,
	totalCount    : PropTypes.number.isRequired,
	currentIndex  : PropTypes.number.isRequired,
	setValidation : PropTypes.func.isRequired,
	id            : PropTypes.oneOfType([

		PropTypes.number.isRequired,
		PropTypes.string.isRequired

	]),
	question      : PropTypes.oneOfType([

		PropTypes.object.isRequired,
		PropTypes.string.isRequired

	]),
	summaryId     : PropTypes.oneOfType([

		PropTypes.number.isRequired,
		PropTypes.string.isRequired

	])

};

Survey.defaultProps = {

	id            : '',
	back          : null,
	next          : null,
	reset         : null,
	prompt        : null,
	isLast        : true,
	isFirst       : true,
	isValid       : false,
	question      : {},
	questions     : [],
	summaryId     : '',
	showPrompt    : null,
	totalCount    : 1,
	currentIndex  : 0,
	setValidation : null,

};


export default Survey;
