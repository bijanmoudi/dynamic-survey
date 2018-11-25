
import React from 'react';
import PropTypes from 'prop-types';
import Survey from './survey';
import Message from '../Message';
import Loading from '../Loading';
import axios from 'axios';
import {

	Route,
	Redirect,
	HashRouter as Router

} from 'react-router-dom';


export default class SurveyContainer extends React.Component {


	constructor( props ) {

		super( props );

		this.state = {

			data      : {},
			value     : '',
			error     : null,
			prompt    : '',
			isValid   : false,
			activeId  : null,
			isLoading : false

		};

		this.summaryId = '✓';
		this.survey    = null;
		this.router    = null;
		this.statuses  = null;
		this.anchor    = '/surveys';
		this.remote    = '/surveys/:id';
		this.cashId    = `survey-${ this.props.id }-data`;
	}

	componentDidMount() {

		this.init();

	}

	init() {

		this.setState({ isLoading: true });

		this.getSurvey()
			.then( ({ data, source }) => {

				if ( data ) {

					this.setSurvey( data, source );

				}

				this.setState({ isLoading: false });

			});

	}

	async getSurvey() {

		let source = 'cache';
		let data = localStorage.getItem( this.cashId );

		if ( data ) {

			data = JSON.parse( data );

		} else {

			source = 'remote';

			try {

				const response = await axios.get( this.remote.replace( ':id', this.props.id ) );
				data = response.data;

			} catch ( error ) {

				this.setState({ error });

			}
		}

		return {

			data,
			source

		};

	}

	setSurvey( data = null, source = null ) {

		if ( data ) {

			this.setState({ data });

		}

		if ( source != 'cache' ) {

			data = data || this.state.data;
			localStorage.setItem( this.cashId, JSON.stringify( data ) );

		}

	}

	getStatuses( statuses = null ) {

		let surveys = {};

		statuses = statuses || this.statuses;
		statuses = typeof statuses == 'string'
			? (
				statuses.indexOf( ',' ) != -1
					? statuses.split( ',' )
					: [ statuses ]
			)
			: [];

		statuses.forEach( ( status ) => {

			status = status.indexOf( ':' ) != -1 ? status.split( ':' ) : [ status ];
			surveys[ status[0] ] = status[1];

		});

		return surveys;

	}

	getAllowedId() {

		let activeId = this.getActiveId();

		if ( ! ( activeId && this.hasQuestion( activeId ) && this.isValid( this.getPrevId( activeId ) ) ) ) {

			activeId = this.getFirstId();
			
			let questions = this.state.data && this.state.data.questions ? this.state.data.questions : {};

			if ( questions && questions.length ) {

				questions = questions.filter( ( question ) => question._validated );

				if ( questions.length ) {

					const nextId = this.getNextId( questions[ questions.length - 1 ].id );

					activeId = nextId ? this.getNextId( questions[ questions.length - 1 ].id ) : activeId;

				}

			}

		}

		return activeId;

	}

	getActiveId( statuses = null ) {

		statuses = this.getStatuses( statuses || this.statuses );

		return statuses[ this.props.id ];

	}

	setActiveId( id = null ) {

		if ( id != this.state.activeId ) {

			this.setState({ activeId: id }, () => {

				this.router.history.push( this.getLink( id ) );

			});

		}

	}

	getLink( id = null ) {

		let linkComponents = [];
		let surveys = this.getStatuses();

		surveys[ this.props.id ] = this.hasQuestion( id ) ? id : this.getActiveId();

		Object.keys( surveys ).map( ( surveyId ) => {

			const surveyStatus = surveys[ surveyId ] ? `${ surveyId }:${ surveys[ surveyId ] }` : surveyId;
			linkComponents = [ ...linkComponents, surveyStatus ];

		});

		return `${ this.anchor }/${ linkComponents.join( ',' ) }`;

	}

	getQuestion( id = null ) {

		id = id || this.getActiveId();

		if (
			id == this.summaryId ||
			(
				this.state.data &&
				this.state.data.questions
			)
		) {

			const question = this.state.data && this.state.data.questions
				? this.state.data.questions.filter( question => question.id.toString() == id.toString() )
				: [];

			return question.length ? question[0] : ( id == this.summaryId ? this.summaryId : null );

		}

		return null;

	}

	hasQuestion( id = null ) {

		return this.getQuestion( id ) != null ;

	}

	getQuestionIds() {

		const questions = this.state.data && this.state.data.questions ? this.state.data.questions : {};

		return Object.keys( questions ).map( ( index ) => questions[ index ].id.toString() );

	}

	getIndex( id = null ) {

		id = id || this.getActiveId();

		const questionIds = this.getQuestionIds();

		return id
			? (

				id == this.summaryId
					? questionIds.length
					: questionIds.indexOf( id.toString() )

			)
			: 0;

	}

	isValid( id = null ) {

		if ( id ) {

			const question = this.getQuestion( id );

			return ! question || question._validated;

		}

		return true;

	}

	isFirst( id = null ) {

		return this.getIndex( id ) < 1;

	}

	isLast( id = null ) {

		return ! ( this.state.data && this.state.data.questions ) || this.getIndex( id ) == this.state.data.questions.length;

	}

	getFirstId() {

		const { data: { questions } } = this.state;

		return (

			questions &&
			questions[0] &&
			questions[0].id
				? questions[0].id
				: null

		);

	}

	getNextId( id = null ) {

		if ( ! this.isLast( id ) ) {

			const questionIds = this.getQuestionIds();
			const currentIndex = this.getIndex( id );

			return currentIndex == questionIds.length - 1 ? this.summaryId : questionIds[ currentIndex + 1 ];

		}

		return null;

	}

	getPrevId( id = null ) {

		if ( ! this.isFirst( id ) ) {

			const questionIds = this.getQuestionIds();
			const currentIndex = this.getIndex( id );

			return currentIndex == this.summaryId ? questionIds[ questionIds.length - 1 ] : questionIds[ currentIndex - 1 ];

		}

		return null;

	}

	back() {

		if ( this.props.totalCount > 1 ) {

			this.setActiveId( this.getPrevId() );

		} else {

			this.setState({ activeId: this.getPrevId() });
			this.router.history.goBack();

		}
		

	}

	next() {

		if ( this.state.isValid ) {

			let data = this.state.data;

			data.questions[ this.getIndex() ].default = this.state.value;
			data.questions[ this.getIndex() ]._validated = true;
			this.setSurvey( data, 'form' );

			this.setActiveId( this.getNextId() );

		}

	}

	reset() {

		this.setActiveId( this.getFirstId() );
		localStorage.removeItem( this.cashId );
		this.init();

	}

	getCount() {

		return this.state.data && this.state.data.questions ? Object.keys( this.state.data.questions ).length + 1 : 1;

	}

	prompt( content = null ) {

		this.setState({ prompt: content });

	}

	setValidation( isValid = false, value = '' ) {


		this.setState({ isValid, value });

	}

	render() {

		const {

			id,
			totalCount,
			...restProps

		} = this.props;

		const {

			data: {

				title,
				questions

			},
			error,
			prompt,
			isValid,
			isLoading

		} = this.state;

		return (

			isLoading
				? (
					<Loading />
				)
				: (
					error
						? (
							<Message type="error" fullWidth={ false }>
								Error occured while loading survey.
							</Message>
						)
						: (

							<Router>
								<Route path="(/surveys)?/:status?" render={ ({ ...router }) => {
									const { match: { params: { status } } } = router;
									this.router = router;
									this.statuses = status;
									const activeId = this.getActiveId();
									const allowedId = this.getAllowedId();
									return activeId == allowedId
										? (
											<Survey
												id={ id }
												back={ () => { this.back(); } }
												next={ () => { this.next(); } }
												reset={ () => { this.reset(); } }
												title={ title }
												prompt={ prompt }
												isLast={ this.isLast() }
												isFirst={ this.isFirst() }
												isValid={ isValid }
												question={ this.getQuestion() }
												questions={ questions ? questions : [] }
												summaryId={ this.summaryId }
												showPrompt={ ( content ) => { this.prompt( content ); } }
												totalCount={ this.getCount() }
												currentIndex={ this.getIndex() }
												setValidation={ ( isValid, value ) => {
													this.setValidation( isValid, value );
												}}
												{ ...restProps }
											/>
										)
										: (
											<Redirect to={ this.getLink( allowedId ) } />
										);
								}} />
							</Router>

						)
				)

		);

	}


}

SurveyContainer.propTypes = {

	id : PropTypes.oneOfType([

		PropTypes.number.isRequired,
		PropTypes.string.isRequired

	]),
	totalCount : PropTypes.number

};

SurveyContainer.defaultProps = {

	id : '',
	totalCount : 1

};
