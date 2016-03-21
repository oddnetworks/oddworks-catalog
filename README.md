# odd-catalog
Catalog datastore plugin for the Oddworks video broadcasting platform.

### Example Initialization
```JS
const oddcast = require('oddcast');
const dynamoDB = require('dynamodb-engine');
const catalog = require('odd-catalog');

// After creating Oddcast channels, they can be reused over and over
// for different Oddworks plugins.
const commandChannel = oddcast.commandChannel();
const requestChannel = oddcast.requestChannel();
const eventChannel = oddcast.eventChannel();

// Be sure to hook up an error handler to each Oddcast channel.
commandChannel.on('error', reportError);
requestChannel.on('error', reportError);
eventChannel.on('error', reportError);

// You can mount different transports to the Oddcast channels by pattern.
// This is the minimum of what you need for the oddworks-catalog plugin to work.
commandChannel.use({plugin: 'catalog'}, oddcast.inprocessTransport());
requestChannel.use({plugin: 'catalog'}, oddcast.inprocessTransport());
eventChannel.use({plugin: 'catalog'}, oddcast.inprocessTransport());

// Create the store API. This one uses AWS DynamoDB.
const catalogStore = dynamoDB.create({
    accessKeyId     : 'foo',
    secretAccessKey : 'bar',
    region          : 'us-west-2',
    tablePrefix     : 'dev_catalog'
});

// Create the app Object that will be passed into plugins. Once this is
// created it can be used over and over to initialize all the oddworks plugins.
const app = {
    API: {
        catalogStore   : catalogStore,
        commandChannel : commandChannel,
        requestChannel : requestChannel,
        eventChannel   : eventChannel
    }
};

// Initialize the oddworks-catalog plugin.
catalog(app);

function reportError(err) {
    console.error(err.stack || err.message || err);
}
```

### Example Usage
Assuming you've already initialized like the example above:
```JS
// Any number of Observers can be attached to an Oddcast Event Channel.
// Log out the command, or maybe update a cached view.
eventChannel.observe({plugin: 'catalog', role: 'command'}, function (entity) {
    console.log('Entity type %s modified at id: %s', entity.type, entity.id);
});

// Send and forget. There is no response from an Oddcast Command Channel. It
// assumes you may be using a queue transport.
commandChannel.send({plugin: 'catalog', role: 'command', cmd: 'upsertCollection'}, {
    organization: 'odd-networks',
    title: 'Best clips of all time',
    description: 'Yeah, right!',
    relationships: {
        entities: []
    }
});

// Oddcast Request Channels do have a response in the form of a Promise.
requestChannel.request(
    {plugin: 'catalog', role: 'query', query: 'fetchCollection'},
    {id: 'abc-123', include: '*'},
).then(function (res) {
    console.log(
        'Collection %s has %d items',
        res.title,
        res.relationships.entities.length
    );
});
```

### TODO
* __Dependency__: The [Oddcast library](https://github.com/oddnetworks/oddcast) needs a couple small tweaks.
* __Dependency__: The [Bloxx](https://github.com/kixxauth/bloxx) modeling library needs some API upgrades and tests before it will be ready to use in the oddworks-catalog plugin.
* __Dependency__: The [DynamoDB Engine](https://github.com/oddnetworks/dynamodb-engine) library will need a few small API updates to use in the oddworks-catalog plugin.

License
-------
Apache 2.0 © [Odd Networks Inc.](http://oddnetworks.com)
