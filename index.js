const i2c = require('i2c-bus');
const pluginSchema = require('./config-schema');
const createLogger = require('./logging');


module.exports = function (app) {

    const plugin = {unsubscribes: []};
    const {logDebug, logError} = createLogger(app);

    plugin.schema = pluginSchema;
    plugin.id = 'i2c-reader'
    plugin.name = 'I2C Reader'
    plugin.description = 'Plugin that reads data from I2C devices and updates SignalK database. '

    let count = 0
    let lastMessage = ''
    plugin.statusMessage = function () {
        return `${lastMessage} ${count > 0 ? '- sesors read ' + count + ' times' : ''}`
    }

    let interval

    plugin.start = function (config) {

        logDebug('I2C Reader plugin started. Config:' + JSON.stringify(config, null, 2))

        if (config.global === undefined) {
            logError('I2C Reader plugin: global config is missing')
            return
        }

        if (config.devices === undefined) {
            logError('I2C Reader plugin: devices config is missing')
            return
        }

        const pollingInterval = config.global.pollingInterval ?? 10_000;
        const bus = i2c.openSync(config.global.busNumber ?? 1); // Bus 1 on most devices
        const devices = config.devices;
        interval = setInterval(() => {
            try {
                let status = "";
                devices.forEach(device => {
                    const originalValue = bus.readByteSync(device.address, device.register);
                    const adjustedValue = convertValue(originalValue, device);
                    logDebug(`Device read, name: ${device.name}, value: ${adjustedValue}`);
                    updateSignalK(app, device, adjustedValue);
                    status += `${device.name}: ${adjustedValue}(${originalValue})${device.signalk.units}, `;
                });

                app.setPluginStatus(status);

            } catch (err) {
                logError(`Error reading from I2C device. Details: ${err.message}`);
            }
        }, pollingInterval);


    }

    plugin.stop = function () {
        if (typeof interval !== 'undefined') {
            clearInterval(interval);
        }
        logDebug('I2C Reader plugin stopped')
    }


    function convertValue(originalValue, device) {
        return device.converter.a * originalValue + device.converter.b;
    }

    function updateSignalK(app, device, value) {

        if (device.signalk === undefined) {
            logError('I2C Reader plugin: signalk config is missing for device: ', device.name);
            return;
        }

        const messageId = `i2c-reader-device-${device.name}`;
        const signalk = device.signalk;
        const path = signalk.path;
        const units = signalk.units;
        const displayName = device.name;
        app.handleMessage(messageId, {
            updates: [{
                source: {
                    label: `i2c-device-${device.name}`,
                },
                values: [{
                    path: path,
                    value: value
                }]
            }],
            meta: [{
                path: path,
                value: {
                    units: units,
                    displayName: displayName
                }
            },
            ]
        });
    }

    return plugin
}