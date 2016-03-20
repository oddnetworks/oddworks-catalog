'use strict';

const U = require('./u');
const lib = require('./');

exports.createQueryFactory = function (factory) {
	return function (plugin, options, next) {
		return factory(plugin, options, next || U.identity);
	};
};

exports.fetchEntity = exports.createQueryFactory((plugin, options, next) => {
	const Model = plugin.models.get(options.type);

	return function fetchEntityQuery(args) {
		return Model.create({id: args.id}).fetch({include: args.include}).then(next);
	};
});

exports.fetchEntitiesByOrganization = exports.createQueryFactory((plugin, options, next) => {
	const type = options.type;
	const Model = plugin.models.get('organization');

	return function fetchEntitiesByOrganizationQuery(args) {
		const include = args.include;
		let promise = Model.create({id: args.organization}).fetchRelationships(type);

		if (include) {
			promise = promise.then(entities => {
				return Promise.all(entities.map(entity => {
					return entity.fetch({include: include});
				}));
			});
		}

		return promise.then(next);
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
