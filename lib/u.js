const Brixx = require('brixx');
const U = require('lodash');

module.exports = U.mixin({
	ensure: Brixx.ensure,
	deepFreeze: Brixx.deepFreeze,
	exists: Brixx.exists,
	stringify: Brixx.stringify
});
