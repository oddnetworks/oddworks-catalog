'use strict';

const Bloxx = require('bloxx');
const BaseMixin = require('./base-mixin');

module.exports = Bloxx.createModel({
	type: 'organization'
}, BaseMixin);
