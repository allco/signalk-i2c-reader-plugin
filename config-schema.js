// config-schema.js

const converterSchema = {
    type: 'object',
    title: 'Converter',
    require: ['a', 'b'],
    description: '`a` and `b` for equation: `a*X + b`. E.g. `a=1` and `b=273.15` for Celsius to Kelvin conversion',
    properties: {
        a: {type: 'number', title: 'a', default: 1},
        b: {type: 'number', title: 'b', default: 0}
    }
};

const signalKSchema = {
    type: 'object',
    title: 'SignalK configuration',
    required: ['path', 'units'],
    properties: {
        path: {
            type: 'string',
            title: 'Path',
            description: 'E.g. `environment.inside.temperature`',
            default: ''
        },
        units: {
            type: 'string',
            title: 'Units',
            description: 'E.g. `C`, `K`, `%`',
            default: ''
        },
    }
};

const deviceSchema = {
    type: 'object',
    required: ['name', 'address', 'register', 'converter', 'signalk'],
    properties: {
        name: {
            type: 'string',
            title: 'Device name',
            description: 'E.g. "Interior temperature"'
        },
        address: {
            type: 'number',
            title: 'Address',
            description: 'Found using `i2cdetect`, e.g. `8`'
        },
        register: {
            type: 'number',
            title: 'Register address',
            description: 'One device may have multiple registers'
        },
        converter: converterSchema,
        signalk: signalKSchema
    }
};

const pluginSchema = {
    type: 'object',
    properties: {
        global: {
            type: 'object',
            title: 'I2C Reader Configuration',
            required: ['busNumber', 'pollingInterval'],
            properties: {
                busNumber: {
                    type: 'number',
                    title: 'I2C bus number',
                    default: 0x1
                },
                pollingInterval: {
                    type: 'number',
                    title: 'Polling interval (ms)',
                    description: 'How often to poll I2C devices and update SignalK',
                    default: 10000
                }
            }
        },
        devices: {
            type: 'array',
            title: 'I2C Devices',
            items: deviceSchema
        }
    }
};

module.exports = pluginSchema;
