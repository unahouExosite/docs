# Python Simulator Setup

This portion of the tutorial will help you run the Python simulator and connect the data to the solution you have already deployed.

# Requirements

## Hardware Setup

No hardware is required to complete this portion of the tutorial. 

## Software Setup

### Python

All code written for the simulator in this tutorial has been written to work with Python, which can be downloaded from the [Python website](https://www.python.org/).

# Simulator Setup

The simulator requires Python. You can ensure Python is available on your system by executing the following command.

```sh
$ which python
```

If Python is not available, please follow the official documentation to get started:
[https://www.python.org/downloads/](https://www.python.org/downloads/)

In the `hvac-reference-application` folder, install requirements. The only requirement for this simulator is `requests`. The requests library is used for executing HTTP requests to Exosite and the Weather Underground API.

```sh
$ cd hvac-reference-application
$ pip install -r requirements.txt
```

Next you will need to obtain an API key from Weather Underground and configure the product scripts.

Navigate to Weather Underground and log in or sign up for an API key. All plans are free for development use, as such it makes sense to sign up for the ANVIL plan.

[https://www.wunderground.com/weather/api/](https://www.wunderground.com/weather/api/)

Once you obtain your API, add it to the `config.ini` file in the `product` folder.

```
[main]
cik =
wuapi = aen23n5215a235jkjh
```

The CIK value will be automatically added during the activation step below.

## Add a Device

Now you will add your device to your product in Murano

1. In Murano select *Products*.

   ![image alt text](../assets/products_tab.png)

2. Select your product.

3. Select *DEVICES*.

   ![image alt text](../assets/devices_tab.png)

4. Click "+ NEW DEVICE."

   ![image alt text](../assets/new_device_popup.png)

5. Add a device with a *Name* and *Identity*. The name can be any string to help remember which device it is. The identity can be `00001` for the purpose of testing with the Python simulator.

### Simulator Activation and Execution

At this point, you will need to activate your device by running the simulator code.

```
$ cd product
$ python3 ./hvac-simulator.py <product_id> <device_id>
```

The script will now pull historical data from the Weather Underground API to simulate weather. The "building" will heat and cool relative to the ambient temperature. After the temperature reaches a certain level, either the AC or HEAT will be activated. Adjustments to the temperature settings can be made from the solution interface.
