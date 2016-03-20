'use strict';

const U = require('../lib/u');
const helpers = require('../lib/query-helpers');

exports.initialize = function initializeQueries(plugin) {
	U.each(exports.queryFactories, factory => {
		factory(plugin);
	});

	return plugin;
};

exports.queryFactories = {
	fetchCollection(plugin) {
		const pattern = {
			comp: 'catalog',
			role: 'query',
			cmd: 'fetchCollection'
		};

		const guard = [
			['id', {type: 'string', required: true}],
			['include', {type: 'string', required: false}]
		];

		const handler = U.compose(
			helpers.guard(pattern, guard),
			helpers.fetchEntity(plugin, {type: 'collection'})
		);

		plugin.requestChannel.respond(pattern, handler);
	},

	fetchCollections(plugin) {
		const pattern = {
			comp: 'catalog',
			role: 'query',
			cmd: 'fetchCollections'
		};

		const guard = [
			['organization', {type: 'string', required: true}],
			['include', {type: 'string', required: false}]
		];

		const handler = U.compose(
			helpers.guard(pattern, guard),
			helpers.fetchEntitiesByOrganization(plugin, {type: 'collection'})
		);

		plugin.requestChannel.respond(pattern, handler);
	}
};
