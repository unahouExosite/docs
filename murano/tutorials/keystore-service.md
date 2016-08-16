---
title: Murano Metrics Tutorial
template: default
---

# Murano metrics with keystore service tutorial

One common need when managing a fleet of Devices is to get some quick and easy way to get metrics and error logs.
We are going to present here a simple implementation based the Murano KeyStore service which allows you to store boolean, number or text values under a given key. The KeyStore service documentation is available on the [KeyStore service reference page](../services/keystore#) and you can find there more details about each operations and parameters.

In this page you will find some common use cases for the KeyStore service.

* [Collect Metrics](#Collect-Metrics)
* [Expose Metrics](#Expose-metrics)
* [Test it](#Test-it)

## Pre-Requisit

You have a Murano account with a solution. To get there you can follow [The getting started guide](../get-started/solutions/exampleapp/#).


## Collect Metrics

A first step for monitoring your devices fleet is to collect the related information. We will collect here 2 types of data:
* The number of messages per day
* The last 10 messages

This data collection has to be made when the data are processed by Murano. Which happen when a _datapoint_ event is triggered by the _Device_ service.
Under the _SERVICES_ tab of your solution the list of service configuration and trigger event is available.
Select **Products** and the script editor let you write the logic executed when IoT devices send data to your solution.

We can now write the script to collect the data.

### Increasing a daily metric counter

To make a daily counter, we can simply use the power of the increment command available.

```lua
Keystore.command({ command = "incrby", key = "dailyCount", args = {1}})
```

To only keep the count for the current day, one possible option is to take advantage of the expire command whic will automatically handle the value expiration at the give time.

```lua
-- Tomorrow midnight timestamp in seconds
local expiration = math.floor(1 + os.time()/86400) * 86400

-- Set the expiration time for next day midnight
Keystore.command({ command = "expireat", key = "dailyCount", args = {expiration} })
```

### Log the last 10 messages from the Device

We get now the incoming device data from the [data.value event argument](../services/device/#datapoint).
The data.value first value is the message timestamp, and the 2nd is the message itself.

```lua
  local message = data.value[2]
end
```

A convenient way to keep some temporary data is to use a list, which allow to push new data as in a queue structure.
```lua
Keystore.command({ command = "lpush", key = "logs", args = {message}})
```

We then keep only the last logs items with the trimming command by specifying a range of data to keep. Note that the list index starts at 0.
Therefore in order to keep the last 10 logs the target list range index is 0 to 9.

```lua
Keystore.command({ command = "ltrim", key = "logs", args = {0, 9}})
```

### All together

```lua

local message = data.value[2]

-- Increment the counter
Keystore.command({ command = "incrby", key = "dailyCount", args = {1}})

-- Tomorrow midnight timestamp in seconds
local expiration = math.floor(1 + os.time()/86400) * 86400

-- Set the expiration time for next day midnight
Keystore.command({ command = "expireat", key = "dailyCount", args = {expiration} })

-- Push the new message to the logs list, not in lua the first element start at index 1
Keystore.command({ command = "lpush", key = "logs", args = {message}})

-- Only keep the last 10 logs, the trim command requires a range of index to keep (starting with 0).
Keystore.command({ command = "ltrim", key = "logs", args = {0, 9}})

```


## Expose Metrics

The easiest way to expose our collected data, is to create a route endpoint. Endpoints can be created with the "+" button on the _ROUTES_ tab of your solution and prompt you for the endpoint path and HTTP method.
The script editor then allow to write _endpoint script_ which are directly routed from your solution custom API.
You can learn more about the _endpoint scripting_ on the [Webservice reference page](../services/webservice).

Exposing the count only requires to return the counter value store in the _Keystore_ service with the _get_ operation.

```lua
  local dailyCount = Keystore.get({ key = "dailyCount" })
```

Logs can use the _lrange_ command which return a rang of element from our list. Note 0 = last log, -1 = all logs

```lua
  local logs = Keystore.command({ command = "lrange", key = "logs", args = {0, -1}})
```

As we use a _endpoint script_ a 200 HTTP status code is automatically handler and our lua map is transformed into a JSON structure. However we could specify a different one by using the _response.code_ instead.

```lua
return { dailyCount = dailyCount.value, logs = logs.value }
```

### All together

```lua

-- Get the last n logs, -1 means all items
local dailyCount = Keystore.get({ key = "dailyCount" })

-- Get the last n logs, -1 means all items
local logs = Keystore.command({ command = "lrange", key = "logs", args = {0, -1}})

-- Reponse a 200 HTTP response with a JSON body object
return { dailyCount = dailyCount.value, logs = logs.value }

```

## Test it

To test your scripts you need to send data to from your device to Murano.

To get there you need to:

1. Create a Product or use an existing one from the Murano portal and note its **product_id**.
2. If you create a new Product add it to the Products configuration under the _SERVICES_ tab of the solution.
3. Define a **data-port** channel to send data under the _DEFINITION_ tab. For this example use a data-port of type _string_.
4. Create a device on the _DEVICES_ panel and note its **identity** (also called sn) string.
5. Activate the device to get the device _CIK_. A simple HTTP request on the provisioning API will do. Here using a linux terminal.

```
curl https://<product_id>.m2.exosite.com/provision/activate \
-H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
-d "vendor=<product_id>&model=<product_id>&sn=<identity>" \
-k
```
The **CIK** token is returned. Find more information on the [device API documentation](http://docs.exosite.com/murano/products/device_api/http/#activate).


With this token you are ready to transmit data, if you dont have a physical device, you can simulate it by sending data with the _write_ operation of the [device API](http://docs.exosite.com/murano/products/device_api/http#write).


```
curl http://m2.exosite.com/onep:v1/stack/alias \
   -H 'X-Exosite-CIK: <CIK>' \
   -H 'Accept: application/x-www-form-urlencoded; charset=utf-8' \
   -d '<data-port>=helloworld'
```


### Display the info

You can now get your devices latest info by opening your solution /info endpoint into your web-browser. (You can find your custom domain on the _solution_ page).

Something similar to
```
https://<mysolution>.apps.exosite.io/info
```

Will return
```JSON
{
  "dailyCount": "1",
  "logs": [ "helloworld" ]
}
```
