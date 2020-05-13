/**
 * @author Leandro Panegassi <leandropanegassi89@gmail.com
 *
 * AnalyticsAbstract
 */
var AnalyticsAbstract = {
		
	
	_config: {
		/**
	 	 * @varabiel platform
	 	 * @type string
	 	 *
	 	 * @values 'APP_VIEW': para os aplicativos mbj, mbf, spd, wallet
	 	 * @values 'WEB_PAGE': para os sites ibj, ibf
	 	*/
		platform 	: undefined,
		payload 	: {}
	},


	_variables: {
		/**
		 * @variable eventName
		 * @type string
		 *
		 * @values 'VIEW': para pageviews e screenviews
		 * @values 'EVENT': para eventos de interação
		 */
		eventName 			: undefined,

		/**
		 * @variable eventName
		 * @type string
		 *
		 * @values /pagePath para as URLs dos sites
		 * @values screenName para o nome das telas em aplicativos
		 */
		pathName 			: undefined,

		/**
		 * @variable title - exclusivo para @platform 'WEB_PAGE'
		 * @type string
		 *
		 * @values título das páginas
		 */
		title 				: undefined,

		/**
		 * @variable eventCategory
		 * @type string
		 *
		 * @values categoria de seu evento
		 */
		eventCategory 		: undefined,

		/**
		 * @variable eventAction
		 * @type string
		 *
		 * @values ação de seu evento
		 */
		eventAction 		: undefined,

		/**
		 * @variable eventLabel
		 * @type string
		 *
		 * @values rótulo de seu evento
		 */
		eventLabel 			: undefined,

		/**
		 * @variable eventCategory
		 * @type float
		 *
		 * @values valor de seu evento
		 */
		eventValue 			: undefined,

		/**
		 * @variable eventNonInteraction - exclusivo para @eventName 'EVENT'
		 * @type boolean
		 *
		 * @values true - se o evento for de não interação
		 * @values false (default) - se o evento for de interação
		 */
		eventNonInteraction	: undefined,

		/**
		 * @variable customDimensions
		 * @type object
		 *
		 * @values customDimensions: { dimension1: value, dimension2: value }
		 */
		customDimensions 	: undefined,

		/**
		 * @variable customMetrics
		 * @type object
		 *
		 * @values customMetrics: { metric1: value, metric2: value }
		 */
		customMetrics		: undefined,

		/**
		 * @variable contentGroupping
		 * @type string
		 *
		 * @values grupo de conteudo
		 */
		contentGroupping 	: undefined,

		/**
		 * @variable ecommerce
		 * @type object
		 *
		 * @values ecommerce: { actionField: {}, products: {} }
		 */
		ecommerce 			: undefined
	},


	init: function(platform) {
		this.initDataLayer();
		this.setConfigPlatform(platform);
	}, // functio init


	initDataLayer() {
		window.dataLayer = window.dataLayer || [];
	},


	/**
	 * @function sendEvent: envia os dados de evento
	 *
	 * @param hit
	 * @type object
	 */
	sendEvent: function(hit) {

		if (!this.isVariableUndefined(hit.title))
			this.setVariablesTitle(hit.title);

		if (!this.isVariableUndefined(hit.pathName))
			this.setVariablesPathName(hit.pathName);

		if (!this.isVariableUndefined(hit.eventName))
			this.setVariablesEventName(hit.eventName);

		if (!this.isVariableUndefined(hit.eventCategory))
			this.setVariablesEventCategory(hit.eventCategory);

		if (!this.isVariableUndefined(hit.eventAction))
			this.setVariablesEventAction(hit.eventAction);

		if (!this.isVariableUndefined(hit.eventLabel))
			this.setVariablesEventLabel(hit.eventLabel);

		if (!this.isVariableUndefined(hit.eventValue))
			this.setVariablesEventValue(hit.eventValue);

		if (!this.isVariableUndefined(hit.eventNonInteraction))
			this.setVariablesEventNonInteraction(hit.eventNonInteraction);

		if (!this.isVariableUndefined(hit.contentGroupping))
			this.setVariablesContentGroupping(hit.contentGroupping);

		if (!this.isVariableUndefined(hit.customDimensions))
			this.setVariablesCustomDimensions(hit.customDimensions);

		if (!this.isVariableUndefined(hit.customMetrics))
			this.setVariablesCustomMetrics(hit.customMetrics);

		if (!this.isVariableUndefined(hit.ecommerce))
			this.setVariablesEcommerce(hit.ecommerce);

		this.preparePayloadEvent();
		this._dispatch();
		
	}, // function sendEvent


	/**
	 * @function sendView: envia os dados de pageview/screenview
	 *
	 * @param hit
	 * @type object
	 */
	sendView: function(hit) {

		if (!this.isVariableUndefined(hit.title))
			this.setVariablesTitle(hit.title);

		if (!this.isVariableUndefined(hit.pathName))
			this.setVariablesPathName(hit.pathName);

		if (!this.isVariableUndefined(hit.eventName))
			this.setVariablesEventName(hit.eventName);

		if (!this.isVariableUndefined(hit.contentGroupping))
			this.setVariablesContentGroupping(hit.contentGroupping);

		if (!this.isVariableUndefined(hit.customDimensions))
			this.setVariablesCustomDimensions(hit.customDimensions);

		if (!this.isVariableUndefined(hit.customMetrics))
			this.setVariablesCustomMetrics(hit.customMetrics);

		if (!this.isVariableUndefined(hit.ecommerce))
			this.setVariablesEcommerce(hit.ecommerce);

		this.preparePayloadView();
		this._dispatch();

	}, // function sendView



	preparePayloadView: function() {

		this.addPathNameData();
		this.addTitleData();
		this.addContentGrouppingData();
		this.addEcommerceData();
		this.addCustomVariables();

	}, // preparePayloadView



	preparePayloadEvent: function() {

		this.addPathNameData();
		this.addContentGrouppingData();
		this.addEventCategoryData();
		this.addEventActionData();
		this.addEventLabelData();
		this.addEventValueData();
		this.addEventNonInteractionData();
		this.addEcommerceData();
		this.addCustomVariables();

	}, // preparePayloadEvent



	_dispatch() {

		try {

			var data = this.getConfigPayload();
			if (!this.isPlatformWebPage()) {

				this.logEvent(this.getVariablesEventName(), data);
			} else {

				this.addTitleData();
				this.addEventNameData();
				window.dataLayer.push(data);
			}

			this._resetValues();

		} catch (e) {
			console.error(e.message);
		}

	}, // function _dispatch



	addCustomVariables: function() {

		let customDimensions 	= this.getVariablesCustomDimensions();
		let customMetrics 		= this.getVariablesCustomMetrics();

		if (!this.isVariableUndefined(customDimensions)) {
			Object.entries(customDimensions).forEach(function(key, value) {
				AnalyticsAbstract.setConfigPayloadKeyValue(key[0], key[1]);
			});
		}	

		if (!this.isVariableUndefined(customMetrics)) {
			Object.entries(customMetrics).forEach(function(key, value) {
				AnalyticsAbstract.setConfigPayloadKeyValue(key[0], key[1]);
			});
		}

	}, // function addCustomVariables


	addEcommerceData: function() {

		let ecommerce = this.getVariablesEcommerce();

		if (!this.isVariableUndefined(ecommerce)) {
			this.setConfigPayloadKeyValue('ecommerce', ecommerce);
		}

	}, // function addEcommerceData


	addContentGrouppingData: function() {

		let contentGroupping = this.getVariablesContentGroupping();

		if (!this.isVariableUndefined(contentGroupping)) {
			this.setConfigPayloadKeyValue('contentGroupping', contentGroupping);
		}

	}, // function addContentGrouppingData


	addTitleData: function() {

		let title = this.getVariablesTitle();

		if (!this.isVariableUndefined(title)) {
			this.setConfigPayloadKeyValue('title', title);
		}

	}, // function addTitleData


	addPathNameData: function() {

		let pathName = this.getVariablesPathName();

		if (!this.isVariableUndefined(pathName)) {
			this.setConfigPayloadKeyValue('name', pathName);
		}

	}, // function addPathNameData


	addEventNameData: function() {

		let eventName = this.getVariablesEventName();

		if (!this.isVariableUndefined(eventName)) {
			this.setConfigPayloadKeyValue('event', eventName);
		}

	}, // function addEventNameData


	addEventCategoryData: function() {

		let eventCategory = this.getVariablesEventCategory();

		if (!this.isVariableUndefined(eventCategory)) {
			this.setConfigPayloadKeyValue('eventCategory', eventCategory);
		}

	}, // function addEventCategoryData


	addEventActionData: function() {

		let eventAction = this.getVariablesEventAction();

		if (!this.isVariableUndefined(eventAction)) {
			this.setConfigPayloadKeyValue('eventAction', eventAction);
		}

	}, // function addEventActionData


	addEventLabelData: function() {

		let eventLabel = this.getVariablesEventLabel();

		if (!this.isVariableUndefined(eventLabel)) {
			this.setConfigPayloadKeyValue('eventLabel', eventLabel);
		}

	}, // function addEventLabelData


	addEventValueData: function() {

		let eventValue = this.getVariablesEventValue();

		if (!this.isVariableUndefined(eventValue)) {
			this.setConfigPayloadKeyValue('eventValue', eventValue);
		}

	}, // function addEventValueData


	addEventNonInteractionData: function() {

		let eventNonInteraction = this.getVariablesEventNonInteraction();

		if (!this.isVariableUndefined(eventNonInteraction)) {
			this.setConfigPayloadKeyValue('eventNonInteraction', eventNonInteraction);
		}

	}, // function addEventNonInteractionData



	isVariableUndefined: function(value) {
		return (value === undefined) ? true : false;
	},

	isPlatformWebPage: function() {
		return (this.getConfigPlatform() === 'WEB_PAGE') ? true : false;
	},

	isPlatformAppView: function() {
		return (this.getConfigPlatform() === 'APP_VIEW') ? true : false;
	},



	resetConfigPlatform: function() {
		this._config.platform = undefined;
	},

	setConfigPlatform: function(value) {
		this._config.platform = value;
	},

	getConfigPlatform: function() {
		return this._config.platform;
	},


	resetConfigPayload: function() {
		this._config.payload = undefined;
		this._config.payload = {};
	},

	setConfigPayload: function(value) {
		this._config.payload = value;
	},

	setConfigPayloadKeyValue: function(key, value) {
		this._config.payload[key] = value;
	},

	getConfigPayload: function() {
		return this._config.payload;
	},


	resetVariablesEcommerce: function() {
		this._variables.ecommerce = undefined;
	},

	setVariablesEcommerce: function(value) {
		this._variables.ecommerce = value;
	},

	getVariablesEcommerce: function() {
		return this._variables.ecommerce;
	},


	resetVariablesContentGroupping: function() {
		this._variables.contentGroupping = undefined;
	},

	setVariablesContentGroupping: function(value) {
		this._variables.contentGroupping = value;
	},

	getVariablesContentGroupping: function() {
		return this._variables.contentGroupping;
	},


	resetVariablesCustomDimensions: function() {
		this._variables.customDimensions = undefined;
	},

	setVariablesCustomDimensions: function(value) {
		this._variables.customDimensions = value;
	},

	getVariablesCustomDimensions: function() {
		return this._variables.customDimensions;
	},


	resetVariablesCustomMetrics: function() {
		this._variables.customMetrics = undefined;
	},

	setVariablesCustomMetrics: function(value) {
		this._variables.customMetrics = value;
	},

	getVariablesCustomMetrics: function() {
		return this._variables.customMetrics;
	},


	resetVariablesEventName: function() {
		this._variables.eventName = undefined;
	},

	setVariablesEventName: function(value) {
		this._variables.eventName = value;
	},

	getVariablesEventName: function() {
		return this._variables.eventName;
	},


	resetVariablesTitle: function() {
		this._variables.title = undefined;
	},

	setVariablesTitle: function(value) {
		this._variables.title = value;
	},

	getVariablesTitle: function() {
		return this._variables.title;
	},


	resetVariablesPathName: function() {
		this._variables.pathName = undefined;
	},

	setVariablesPathName: function(value) {
		this._variables.pathName = value;
	},

	getVariablesPathName: function() {
		return this._variables.pathName;
	},


	resetVariablesEventCategory: function() {
		this._variables.eventCategory = undefined;
	},

	setVariablesEventCategory: function(value) {
		this._variables.eventCategory = value;
	},

	getVariablesEventCategory: function() {
		return this._variables.eventCategory;
	},


	resetVariablesEventAction: function() {
		this._variables.eventAction = undefined;
	},

	setVariablesEventAction: function(value) {
		this._variables.eventAction = value;
	},

	getVariablesEventAction: function() {
		return this._variables.eventAction;
	},


	resetVariablesEventLabel: function() {
		this._variables.eventLabel = undefined;
	},

	setVariablesEventLabel: function(value) {
		this._variables.eventLabel = value;
	},

	getVariablesEventLabel: function() {
		return this._variables.eventLabel;
	},
		

	resetVariablesEventValue: function() {
		this._variables.eventValue = undefined;
	},

	setVariablesEventValue: function(value) {
		this._variables.eventValue = value;
	},

	getVariablesEventValue: function() {
		return this._variables.eventValue;
	},


	resetVariablesEventNonInteraction: function() {
		this._variables.eventNonInteraction = undefined;
	},

	setVariablesEventNonInteraction: function(value) {
		this._variables.eventNonInteraction = value;
	},

	getVariablesEventNonInteraction: function() {
		return this._variables.eventNonInteraction;
	},


	_resetValues: function() {

		this.resetVariablesEventName();
		this.resetVariablesPathName();
		this.resetVariablesTitle();
		this.resetVariablesEventCategory();
		this.resetVariablesEventAction();
		this.resetVariablesEventLabel();
		this.resetVariablesEventValue();
		this.resetVariablesEventNonInteraction();
		this.resetVariablesEcommerce();
		this.resetVariablesCustomDimensions();
		this.resetVariablesCustomMetrics();
		this.resetVariablesContentGroupping();
		this.resetConfigPayload();

	}, // function _resetValues


	/**
	 * @function Firebase Analytics WebView
	 */
	logEvent: function(name, params) {
	
		if (!name) {
			return;
		}

		if (window.AnalyticsWebInterface) {
	   		// Call Android interface
			window.AnalyticsWebInterface.logEvent(name, JSON.stringify(params));
	 	} else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.firebase) {
			// Call iOS interface
			var message = {
				command: 'logEvent',
				name: name,
				parameters: params
			};
			window.webkit.messageHandlers.firebase.postMessage(message);
		} else {
			// No Android or iOS interface found
			console.log("No native APIs found.");
		}
	}, // function logEvent


	setUserProperty: function(name, value) {
	  		
		if (!name || !value) {
			return;
		}

		if (window.AnalyticsWebInterface) {
			// Call Android interface
			window.AnalyticsWebInterface.setUserProperty(name, value);
		} else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.firebase) {
			// Call iOS interface
			var message = {
				command: 'setUserProperty',
				name: name,
				value: value
			};
			window.webkit.messageHandlers.firebase.postMessage(message);
		} else {
			// No Android or iOS interface found
			console.log("No native APIs found.");
		}
	} // funcion setUserProperty

	/**
	 * End Firebase Analytics WebView
	 */


} // var analyticsFactory




/**
 * how to use
 */

/**
 * webview application
 *
 * AnalyticsAbstract.setConfigPlatform('APP_VIEW');
 */


/**
 * website application
 *
 * AnalyticsAbstract.init('WEB_PAGE');
 */

AnalyticsAbstract.sendEvent({
	'title': 'titttle',
	'eventName': 'event',
	'pathName': 'pathname',
	'eventCategory': 'category',
	'eventAction': 'action',
	'eventLabel': 'label',
	'eventValue': 1,
	'contentGroupping': 'contee',
	'customDimensions': {
		'dimension1': 'customDimension1Event',
		'dimension2': 'customDimension2Event'
	},
	'customMetrics': {
		'customMetric1Event': 1
	},
	'ecommerce': {
		'actionField': {
			'coupon': 'teste'
		},
		'products': {
			'name': 'nome-do-produto'
		}
	}
});



AnalyticsAbstract.sendView({
	'eventName': 'view',
	'pathName': 'pathName',
	'contentGroupping': 'grupo-e-conteudo',
	'customDimensions': {
		'dimension1': 'customDimension1View',
		'dimension2': 'customDimension2View'
	},
	'customMetrics': {
		'metric1': 1
	},
	'ecommerce': {
		'actionField': {
			'coupon': 'teste'
		},
		'products': {
			'name': 'nome-do-produto'
		}
	}

});

