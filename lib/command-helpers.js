'use strict';

const U = require('./u');
const lib = require('./');

exports.createCommandFactory = function (factory) {
	return function (plugin, options, next) {
		return factory(plugin, options, next || U.identity);
	};
};

exports.createUpsertCommand = exports.createCommandFactory((plugin, options, next) => {
	const Model = plugin.models.get(options.type);

	return function upsertEntityCommand(payload) {
		return Model.create(payload).updateOrCreate().then(next);
	};
});

exports.createDeleteCommand = exports.createCommandFactory((plugin, options, next) => {
	const Model = plugin.models.get(options.type);

	return function deleteEntityCommand(payload) {
		return Model.create(payload).destroy().then(next);
	};
});

exports.guard = function (pattern, guardConfig) {
	const guard = lib.guard(guardConfig);
	return function commandGuard(payload) {
		// TODO: Capture the validation error thrown by the guard and rethrow
		// it with better messaging using the `pattern` argument passed in above.
		return guard(payload);
	};
};

exports.broadcast = function (plugin, pattern) {
	return function (entity) {
		plugin.eventChannel.broadcast(pattern, entity);
		return entity;
	};
};
