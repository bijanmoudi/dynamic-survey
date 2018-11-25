
import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Survey from './components/Survey';


window.DynamicSurvey = ( function() {

	'use strict';

	const app = {};

	app.base = {

		vars : {},

		init : function() {

			app.surveys.init();

		}

	};

	app.surveys = {

		vars : {

			routePattern : /\/surveys\/([\d]+)/,
			surveyIdAttr : 'data-survey-id'

		},

		init : function() {

			this.mock();
			this.load();

		},

		mock : function() {

			const mock = new MockAdapter( axios, { delayResponse: 2000 } );
			const mockSurvey1 = require( '../data/survey-1.json' );
			const mockSurvey2 = require( '../data/survey-2.json' );

			mock.onGet( this.vars.routePattern )
				.reply( ( config ) => {

					const components = this.vars.routePattern.exec( config.url );
					const id = components && components.length > 1 ? ( components[1] <= 2 ? components[1] : null ) : null;

					return id ? [ 200, id == 1 ? mockSurvey1 : mockSurvey2 ] : [ 404 ];


				});

		},

		load : function() {
			
			const surveys = [].slice.call( document.querySelectorAll( `[ ${ this.vars.surveyIdAttr } ]` ) );

			surveys.reverse().forEach( ( surveyElement ) => {

				this.render( surveyElement.getAttribute( this.vars.surveyIdAttr ), surveyElement, surveys.length );

			});

		},

		render : function( id = null, element = null, totalCount = 1 ) {

			if ( id != null && element != null ) {

				ReactDOM.render( <Survey id={ id } totalCount={ totalCount } />, element );

			}

		}

	};

	// Let's Go!
	app.base.init();

	return app;

}());
