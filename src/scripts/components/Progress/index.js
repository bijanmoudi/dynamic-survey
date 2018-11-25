
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../Tooltip';
import {

	getText

} from '../../helpers';


const Progress = ( props ) => {


	const {

		animated,
		className,
		totalSteps,
		currentStep,
		currentLabel,
		...restProps

	} = props;

	const percentage = ( ( currentStep - 1 ) / ( totalSteps - 1 ) ) * 100;
	const ariaValueText = currentLabel && {

		'aria-valuetext' : getText( currentLabel )

	};

	return (

		<div className={ `m-progress ${ className } ${ animated ? 'progress--animated' : '' }` } { ...restProps }>
			{
				currentLabel &&
				<Tooltip
					role="tooltip"
					color="red"
					direction="bl"
					className="progress__status"
					style={{ left: `${ percentage }%` }}
				>{ currentLabel }</Tooltip>
			}
			<div className="progress__rail">
				<div
					className="progress__bar"
					style={{ width: `${ percentage }%` }}
					role="progressbar"
					aria-valuemin="1"
					aria-valuenow={ currentStep }
					aria-valuemax={ totalSteps }
					{ ...ariaValueText }
				></div>
			</div>
		</div>

	);


};

Progress.propTypes = {

	animated     : PropTypes.bool,
	className    : PropTypes.string,
	totalSteps   : PropTypes.number.isRequired,
	currentStep  : PropTypes.number.isRequired,
	currentLabel : PropTypes.oneOfType([

		PropTypes.number,
		PropTypes.string,
		PropTypes.element

	])

};

Progress.defaultProps = {

	className    : '',
	animated     : true,
	totalSteps   : null,
	currentStep  : null,
	currentLabel : null

};


export default Progress;
