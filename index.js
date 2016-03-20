'use strict';

// Provides:
//
// CommandChannel receives:
//   {plugin: 'catalog', role: 'command', cmd: STRING}
//
// RequestChannel responds:
//   {plugin: 'catalog', role: 'query', query: STRING}
//
// EventChannel broadcasts:
//   {plugin: 'catalog', role: 'command', cmd: STRING}

const Plugin = require('./lib/plugin');
const Models = require('./models/');
const Queries = require('./queries/');
const Commands = require('./commands/');

const U = require('./lib/u');

// Params:
// app - Object hash
// app.API - Object hash
// app.API.catalogStore - Fully initialized datastore
// app.API.commandChannel - Oddcast CommandChannel Object.
// app.API.requestChannel - Oddcast RequestChannel Object.
// app.API.eventChannel - Oddcast EventChannel Object.
module.exports = function initializeCatalogPlugin(app) {
	const initialize = U.compose(
		Models.initialize,
		Queries.initialize,
		Commands.initialize
	);

	return initialize(Plugin.create(app)).then(U.constant(app));
};
