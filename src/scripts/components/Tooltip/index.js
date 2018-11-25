
import React from 'react';
import PropTypes from 'prop-types';


const Progress = ( props ) => {


	const {

		role,
		color,
		direction,
		className,
		children,
		...restProps

	} = props;

	return (

		<span
			role={ role }
			className={ `m-tooltip ${ className } ${ direction && ( 'tooltip--' + direction ) } ${ color && ( 'tooltip--' + color ) }` }
			{ ...restProps }
		>{ children }</span>

	);


};

Progress.propTypes = {

	role      : PropTypes.string,
	color     : PropTypes.string,
	direction : PropTypes.string,
	className : PropTypes.string

};

Progress.defaultProps = {

	role      : 'tooltip',
	color     : null,
	direction : null,
	className : ''

};


export default Progress;
