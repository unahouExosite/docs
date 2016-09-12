---
title: Record Product Metrics
template: default
---

# Tutorial: Record Product Metrics

A common need when managing a fleet of devices is to track metrics and error logs. This tutorial demonstrates how to use Murano's [Keystore service](../../services/keystore#) to [collect metrics](#collect-metrics) and [expose those metrics](#expose-metrics) from a custom API endpoint.

## Prerequisites

* A Murano account with a solution. To create a solution you can follow the [getting started guide](../../get-started/solutions/exampleapp/#).


## Collect Metrics

A first step for monitoring your device fleet is to collect information from devices. To keep things simple we will collect two types of data about incoming messages from devices.

* The number of messages per day
* The contents of the last 10 messages

Murano solutions provide a _datapoint_ event that gives you an opportunity to respond to incoming device data. When handling datapoints you may perform data conversion, store data, or send alerts. You may modify the way your solution responds to data by editing the handler for the _datapoint_ event in Murano's web-based code editor or by uploading code using the command line tool. For the purpose of this tutorial let's use the web-based editor. To modify the datapoint event handler, click on the _SERVICES_ tab of your solution, select _Products_, and select the code tab. The code found here is executed when any devices with product types associated with the solution send data. You can now add code to store metrics to the Keystore service.

### Increasing a daily metric counter

To make a daily counter, we can use `incrby` command. This command adds one to the `"dailyCount"` key, setting it to 1 if the key doesn't already exist. It does so atomically, so you won't miss any incoming data points.

```lua
Keystore.command({ command = "incrby", key = "dailyCount", args = {1}})
```

To only keep the count for the current day, we can take advantage of the expire command which will automatically handle the value expiration at the given time.

```lua
-- Tomorrow midnight timestamp in seconds
local expiration = math.floor(1 + os.time()/86400) * 86400

-- Set the expiration time for next day midnight
Keystore.command({ command = "expireat", key = "dailyCount", args = {expiration} })
```

### Log the last 10 messages from the Device

To log message content from your devices, you can use the [data.value event argument](../../services/device/#datapoint) provided to the _datapoint_ event handler. The first value found in data.value is the message timestamp, and the second is the message itself. (Note that in most cases, you'd want to also filter on `data.alias` rather than log all messages.)

```lua
local message = data.value[2]
```

Next we'll push the message to a list in the `Keystore` service using the `lpush` command. This will allow us to see the last few device messages, which can be useful for debugging.

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

The easiest way to expose our collected data is to create an API route endpoint. Endpoints can be created with the "+" button on the _ROUTES_ tab of your solution. When you create a new route, you'll be prompted to specify the path and HTTP method for the route. Create a new route in your solution with the path `/metrics` and method `GET`.

Once the route is created, you can write an _endpoint script_ which runs when your API route endpoint is called. You can learn more about endpoint scripts on the [Webservice reference page](../../services/webservice).

Exposing the count only requires we get the counter value store in the `Keystore` service with the `get` operation.

```lua
  local dailyCount = Keystore.get({ key = "dailyCount" })
```

Logs can use the `lrange` command which return a range of elements from our list. Note that `{0, -1}` indicates we want everything from the most recent log entry (`0`) to the oldest log entry (`-1`).

```lua
  local logs = Keystore.command({ command = "lrange", key = "logs", args = {0, -1}})
```

To make our endpoint return the values of `dailyCount` and `logs`, we can simply return them in a Lua table. 

```lua
return { dailyCount = dailyCount.value, logs = logs.value }
```

This works because endpoint scripts return a 200 HTTP status code by default, and Lua tables are automatically transformed into JSON response bodies. However we could also set these manually by setting `response.code` and `response.body` instead.

### All together

Here's our API route endpoint code in its entirety:

```lua

-- Get the dailyCount value
local dailyCount = Keystore.get({ key = "dailyCount" })

-- Get the last n logs, -1 means all items
local logs = Keystore.command({ command = "lrange", key = "logs", args = {0, -1}})

-- Reponse a 200 HTTP response with a JSON body object
return { dailyCount = dailyCount.value, logs = logs.value }

```

## Generate some product data

To test your scripts you need to send data to from your device to Murano. Here's how to do that:

1. Create a Product or use an existing one from the Murano portal and note its **product_id**.
2. If you create a new Product, be sure to add it to the Products configuration under the _SERVICES_ tab of the solution.
3. Define a **resource** to send data under the _DEFINITION_ tab. For example, you could create a resource of type _string_ with alias _message_.
4. Create a device on the _DEVICES_ panel and note its **identity**.
5. Activate the device to get the device _CIK_. A simple HTTP request on the provisioning API will do. Normally this step is done by a device, but here's how to do that using curl. Be sure to substitute the items in brackets with your values.

```
curl https://<product_id>.m2.exosite.com/provision/activate \
-H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
-d "vendor=<product_id>&model=<product_id>&sn=<identity>"
```

The **CIK** for the device is returned. See the [device API documentation](../../products/device_api/http/#activate) for more about the activation step.

With the CIK in hand you are ready to write data. If you don't have a physical device, you can simulate one by sending data with the _write_ operation of the [device API](../../products/device_api/http#write). Here's how to do that using curl. Again, be sure to substitute the items in brackets with your values.

```
curl https://<product_id>.m2.exosite.com/onep:v1/stack/alias \
-H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
-d "<resource_alias>=<value>"
```

## Test

You can now retrieve your metrics data by opening the `/metrics` endpoint you defined in your web browser. For example, if your solution name was `my-iot-solution` then you would go to this address:

```
https://my-iot-solution.apps.exosite.io/metrics
```

Your metrics data looks like this:

```JSON
{
  "dailyCount": "1",
  "logs": [ "hello world" ]
}
```

That's it! We've demonstrated how to use the Murano Keystore service to track product metrics for your connected devices.
