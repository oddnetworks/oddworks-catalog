function Plugin(spec) {
	this.store = spec.store || null;
	this.models = spec.models || null;
	this.commandChannel = spec.commandChannel || null;
	this.requestChannel = spec.requestChannel || null;
	this.eventChannel = spec.eventChannel || null;
}

Plugin.create = function (app) {
	return new Plugin({
		store: app.API.catalogStore,
		commandChannel: app.API.commandChannel,
		requestChannel: app.API.requestChannel,
		eventChannel: app.API.eventChannel
	});
};

module.exports = Plugin;
