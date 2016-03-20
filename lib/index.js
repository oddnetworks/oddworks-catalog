'use strict';

// TODO: Implement a real guard function that actually checks the
// given object. Maybe use http://validatejs.org/
exports.guard = function () {
	return function libGuard(obj) {
		return obj;
	};
};
