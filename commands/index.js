'use strict';

const U = require('../lib/u');
const helpers = require('../lib/command-helpers');

exports.initialize = function initializeCommands(plugin) {
	U.each(exports.commandFactories, factory => {
		factory(plugin);
	});

	return plugin;
};

exports.commandFactories = {
	upsertCollection(plugin) {
		const pattern = {
			comp: 'catalog',
			role: 'command',
			cmd: 'upsertCollection'
		};

		const guard = [
			['id', {type: 'string', required: false}],
			['organization', {type: 'string', required: true}],
			['title', {type: 'string', required: true}],
			['relationships', {type: 'map', required: true}]
		];

		const handler = U.compose(
			helpers.guard(pattern, guard),
			helpers.createUpsertCommand(plugin, {type: 'collection'}),
			helpers.broadcast(plugin, pattern)
		);

		plugin.commandChannel.receive(pattern, handler);
	},

	deleteCollection(plugin) {
		const pattern = {
			comp: 'catalog',
			role: 'command',
			cmd: 'deleteCollection'
		};

		const guard = [
			['id', {type: 'string', required: true}]
		];

		const handler = U.compose(
			helpers.guard(pattern, guard),
			helpers.createDeleteCommand(plugin, {type: 'collection'}),
			helpers.broadcast(plugin, pattern)
		);

		plugin.commandChannel.receive(pattern, handler);
	}
};
