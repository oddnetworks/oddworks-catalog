'use strict';

const filepath = require('filepath');
const Bloxx = require('bloxx');

exports.initialize = function initializeModels(plugin) {
	// plugin.store must be a fully initialized, podjs compliant store API.
	const registry = Bloxx.Registry.create({store: plugin.store});

	// Load each module in the the models/ directory and register it.
	filepath.create(__dirname)
		.list()
		.filter(function (path) {
			return path.toString() !== __filename && path.isFile();
		})
		.map(function (path) {
			return require(path.toString());
		})
		.reduce(function (registry, Model) {
			return registry.register(Model);
		}, registry);

	// Define the plugin model registry as plugin.models so that other modules
	// can do `plugin.models.get(type)` to get a Model.
	plugin.models = registry;

	return plugin;
};
