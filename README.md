# SignalK I2C Reader Plugin

A SignalK server plugin to read data from I2C devices and feed it into the SignalK data model. Ideal for environmental sensors such as temperature or humidity.

## Features

- Read from multiple I2C devices 
- Configure each device with address, register, and SignalK path to update
- Supports unit conversion via simple linear equation
- Periodically updates SignalK data with sensor readings

## Installation

1. Navigate to your SignalK server plugin directory:
   ```bash
   cd ~/.signalk/node_modules
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/allco/signalk-i2c-reader-plugin
   ```

3. Restart the SignalK server:
   ```bash
   systemctl restart signalk
   ```

4. Open the SignalK web UI → **Server / Plugin Config** → Enable and configure the plugin.

## Configuration

The plugin schema includes:

- **Global settings** (e.g. I2C bus number, polling interval)
- **Devices** array where each I2C device has:
  - `name`: Device name
  - `address`: I2C address (e.g. 8)
  - `register`: Register to read from
  - `signalk.path`: SignalK path to update
  - `signalk.units`: Units (e.g. `K`, `%`)
  - `signalk.converter`: Optional `a` and `b` values for conversion `a * value + b`

Example:
```json
{
  "global": {
    "busNumber": 1,
    "pollingInterval": 10000
  },
  "devices": [
    {
      "name": "Interior Temp Sensor",
      "address": 8,
      "register": 0,
      "signalk": {
        "path": "environment.inside.temperature",
        "units": "K",
        "converter": {
          "a": 1,
          "b": 273.15
        }
      }
    }
  ]
}
```

## Development

Install dependencies:

```bash
npm install
```

To run locally:

```bash
node index.js
```

## License

Apache-2.0

## Author
  
GitHub: [allco](https://github.com/allco)

## Links

- SignalK: https://signalk.org
- Plugin Repository: https://github.com/allco/signalk-i2c-reader-plugin
