
import React from 'react';
import PropTypes from 'prop-types';


const Message = ( props ) => {


	const {

		type,
		fullWidth,
		className,
		children,
		...restProps

	} = props;

	return (

		<span
			type={ type }
			className={ `m-message ${ className } ${ type && ( 'message--' + type ) } ${ fullWidth ? 'message--fullwidth' : '' }` }
			{ ...restProps }
		>{ children }</span>

	);


};

Message.propTypes = {

	type      : PropTypes.string,
	fullWidth : PropTypes.bool,
	className : PropTypes.string

};

Message.defaultProps = {

	type      : 'info',
	fullWidth : true,
	className : ''

};


export default Message;