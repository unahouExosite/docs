## Portals Custom Widget API

Portals provides a Javascript API for developing custom dashboard widgets. If you need to develop a custom widget, you've come to the right place. This document will describe how to create a custom widget in Portals, the data Portals passes to widgets when they load, and the API widgets can use to interact with Portals and the One Platform.

### Table of Contents

[Create a Widget](#create-a-widget)

[Widget Function](#widget-function)

[Portal Resources](#portal-resources)

[Portal Resources Example](#portal-resources-example)

#### API

[read](#read)

[write](#write)

[update](#update)

[drop](#drop)

[subscribe](#subscribe)

[publish](#publish)

[getWidgetInfo](#getwidgetinfo)

[Google Loader API](#google-loader-api)

[Widget Examples](#widget-examples)


### Create a Widget

To create a custom widget on a Portals dashboard:

- Click the Add Widget button in the upper right

- Set the Widget Type to Custom Widget, enter a title of your choice, and click Continue.

- Set the Widget Size. Portals dashboards are laid out in a grid, and the Widget Size is defined in grid units. Each grid unit in Portals is 248px wide and 204px tall, with default spacing of 16px. So, for example, the default setting of 2x2 defines a widget that is 2 * 248px + 16px wide and 2 * 204px + 16px tall. Here's an illustration of the dashboard layout:

![Portals Dashboard Layout](images/layout.png)

Note that the maximum width of a widget is 4 grid units, since that is the default maximum width of a custom dashboard. The dashboard width may also be increased to 6 grid units, which allows wider widgets. The widget height does not have a maximum for practical purposes. 

- Select the device data sources this widget will use.

- Select the range of data the widget will consume, in number of points (e.g. last 1 point) or time period (e.g. all points in last 2 days).

- Optionally select a script template to use as a starting point.

- Enter script code.

![Portals script code](images/script.png)

- Press Save.

- The new widget is displayed in the dashboard.

Note that the these setup instructions cover portal-level widgets. With a [whitelabel account](http://exosite.com/platform/oem-whitelabel/) you can also create widgets at the domain level and that can operate on types of devices (client models in Exosite terminology) without needing to be configured with a concrete device. The API for domain widgets is identical to portal widgets, but the setup process is somewhat different and not covered here.

### Widget Function

Custom widgets define a function that is called by their containing sandbox environment when they are loaded. The following example displays "Hello World" inside its widget container area.

```javascript
function(container, portal) {
    /* CODE HERE */
    $(container).html("Hello, World!");
}
```

The widget function takes two parameters: `container` and `portal`.

- `container` is an HTMLDivElement container for the widget. It can be used to write widget content.

- `portal` is a Javascript object containing a snapshot of device and dataport information, including datapoints. See [Portal Resources](#portal-resources) for more.

### Portal Resources

The second argument to the widget function is a Javascript object containing a snapshot of device and dataport information at the time the widget loaded. The object has this format:

```
{ 
  "clients": [Client,...],
  "dataports": [Dataport,...] 
} 
```

#### Client

Each `Client` contains JSON formatted information from the client in the One Platform including its alias, name, meta, and array of dataports (data sources).

```
{
  "alias":string :: null,
  "dataports":[Dataport,...],
  "info":{
    "description":{
      "meta":DeviceMeta,
      "name":string :: "" 
    }
  }
}
```

##### DeviceMeta

`DeviceMeta` is a JSON string that may be parsed with [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse). It contains the meta information for the client in the One Platform.

```
{
  "activetime":ActiveTimeRange,
  "timezone":Timezone,
  "location":Location,
  "device":{
    "type":"generic" | "vendor"
  }
}
```

- `"ActiveTimeRange"` is a string set by the number of minutes user input in the device popup. If the device received any data source within the last N minutes, the device is considered to be active. N here is the ActiveTimeRange.

- `"Timezone"` is a string set by the timezone user chose in the device popup.

- `"Location"` is a string set by the location user input in the device popup.

#### Dataport

`Dataport` contains JSON formatted information from the dataport in the One Platform including its alias, name, meta, format, and array of data values.  

```
{
  "alias":string :: null,
  "data":[[Timestamp ,Value],...],
  "info":{
    "description":{
      "format":"binary" | "boolean" | "float" | "integer" | "string",
      "meta":DataSourceMeta,
      "name":string :: ""
    }
  }
}
```

##### DataSourceMeta

`DeviceMeta` is a JSON string that may be parsed with [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse). It contains the meta information for the dataport in the One Platform.

```
{
  "datasource":{
    "unit": string :: ""
  }
}
```

- `unit` is a string set by the user input in the device popup.


#### Portal Resources Example

The above section defines the individual parts of the portals resources object passed to the widget function. Let's bring that together by looking at a concrete example. Here's an custom widget configured to load the temperature in Antarctica from the virtual device that comes with a new Portals Community account.

![Widget Config Example](images/widget_config_example.png)

In the example widget code, the line `console.log(JSON.stringify(portal, null, 2));` converts `portal` to a string so that we can see its contents in the browser console. Here's the output of that script, with comments added.

```
{
  // portal level dataports
  "dataports": [],
  // devices configured to be included
  "clients": [
    {
      // this device has no alias assigned
      "alias": null,
      "info": {
        "description": {
          // Portals-specific metadata
          "meta": "{\"timezone\":\"America/Chicago\",\"location\":\"United States\",\"device\":{\"type\":\"generic\"}}",
          // device's name
          "name": "Exosite Device",
          // whether the device is public
          "public": false
        }
      },
      // dataports contained in this device
      "dataports": [
        {
          // dataport alias
          "alias": "Antarctica Temperature",
          "info": {
            "description": {
              // format of dataport data
              "format": "string",
              // Portals-specific metadata (see below)
              "meta": "{\"alias\":\"antarctica_temperature\",\"datasource\":{\"description\":\"Temperature data for Antarctica\",\"unit\":\"°C\"}}",
              // dataport name
              "name": "Antarctica Temperature",
              // no preprocessing
              "preprocess": [],
              // this is a public dataport 
              "public": true,
              // how much historical data to retain
              "retention": {
                "count": "infinity",
                "duration": "infinity"
              },
              // see RPC info command 
              "subscribe": null
            }
          },
          "data": [
            // single datapoint
            [
              // unix timestamp
              1384536323,
              // temperature value
              "-8.0"
            ]
          ]
        }
      ]
    }
  ]
}
```

In the example, we learn that the temperature in Antarctica on Nov 15, 2013 at 5:25PM UTC was -8°C. The name of the device producing this data is "Exosite Device".

#### Data Availability

The contents of the `portal` parameter are are based on what dataports and time periods are set in the widget configuration. 

In the case of a domain widget, a domain administrator may additionally select a client model whose data should be included.

### Procedures

The custom widget sandbox environment exposes an API of functions for interacting with Portals and the One Platform. 

#### read

Reads data from the One Platform resource(s) specified. This throws an exception if there is any error in the arguments.

```
read(TargetResource, Options) -> Deferred
```

- `TargetResource` is an array of resource aliases

- `Options` has the following format: 

```
{
  "starttime":number,
  "endtime":number,
  "limit":number,
  "sort":"asc" | "desc"
}
```

- `Deferred` is an object that may be called with `done()` and/or `fail()` callbacks to handle success or failure condition. The callback passed to the deferred object’s done method will get the data passed as arguments.

Example: 

```
read(["some_device", "some_data_source"])
  .done(function()
  {
    var data = arguments;
    // means succeeded to read data from a resource
    // and data is the result you requested
  })
  .fail(function()
  {
    // means failed to read data from a resource
  })
;
```


#### write

Writes a single value to the One Platform resource(s) specified. This throws an exception if there is any error in the arguments.

```
write(TargetResource, Value) -> Deferred
```

- `"TargetResource"` is an array of resource aliases
- `"Value"` may be a boolean, number, or string value

Example:
```
try
{
  write(["blog", "message"], "hello")
    .done(function()
    {
      // means succeeded to write to the data source, message, owned by the
      // device, blog.
    })
    .fail(function()
    {
      // means failed to write to the data source, message, owned by the
      // device, blog.
    })
  ;
}
catch ()
{
  // means error in the arguments e.g. ["blog", "message"] is not accessible
  // for this widget or doesn't exist.
}
```

#### update

Update a device’s description. This throws an exception if there is any error in the arguments.

```
update(TargetResource, Description) -> Deferred
```

- `"TargetResource"` is an array of device aliases.
- `"Description"` is an object containing `"meta"` (device metadata as a JSON string) and `"name"` (name of device). Note that custom widgets may only modify `"location"` in `"meta"`.

```
{
  "meta":Meta :: "",
  "name":string :: ""
}
``` 

Example:

```
var description =
    {
      "meta":
      {
        "location": "new location"
      },
      "name": "new name"
    };
description.meta = JSON.stringify(description.meta);
update(["some_device"], description)
  .done(function()
  {
    // means succeeded to update a device
  })
  .fail(function()
  {
    // means failed to update a device
  })
;
```



#### drop 

Drop a device. This throws an exception if there is any error in the arguments.

```
drop(TargetResource) -> Deferred
```

- `TargetResource` is an array of device aliases

- `Deferred` is an object that may be called with `done()` and/or `fail()` callbacks to handle success or failure condition.

Example:

```
drop(["some_device"])
  .done(function()
  {
    // succeeded to drop a device
  })
  .fail(function()
  {
    // failed to drop a device
  })
;
```

#### subscribe

Register a callback function to handle a named event. Once registered, the function is called when [`publish`](#publish) is called for the named event. This may be used to react to user interface events that occur in another custom widget.

```
subscribe(Event, Callback[, SubscribeOptions]) -> undefined
```

- `Event` is the name of the event to subscribe to. This should match the name passed to `publish`.

- `Callback` is a function to invoke when the event occurs. When this function is invoked, its arguments are the messages passed to the publish function.

- `SubscribeOptions` is an optional object like this:

```
{
  "context": anything :: undefined,
  "id":string :: ""
}
```

- `"context"` is the context of the callback. If specified, this provides the value of the keyword `this` in the callback.
- `"id"` defines the id of the callback. This id is unique among all callbacks of each event. This may be used to prevent a callback from subscribing the same event multiple times.

Example 1:

```
// this example demonstrates how the callback parameter works.
var callback;
callback = function(papasDinner, mamasDinner) {
  console.log(papasDinner, mamasDinner);
};
subscribe("dinner", callback);
// this shows "Rice noodle" "Stinky tofu" in the debug console.
publish("dinner", "Rice noodle", "Stinky tofu");
```

Example 2:

```
// this example demonstrates how the context option works.
var callback,
    context,
    options;
callback = function() {
  console.log(this.name);
};
context = {
  name: "Exosite Pidgin"
};
options = {
  context: context
};
subscribe("birthday", callback, options);
// this shows "Exosite Pidgin" in the debug console.
publish("birthday");
```

Example 3:

```
// this example demonstrates how the id option works.
var callback;
var options;
options = {
  id: "birthday"
};
callback = function() {
  console.log("Spring");
};
// this call is replaced later. Thus it won't work.
subscribe("season", callback, options);
callback = function() {
  console.log("Autumn");
};
// this call replaces the callback with the same id among the subscribers of
// the event.
subscribe("season", callback, options);
// this shows "Autumn" in the debug console.
publish("season");
```

#### publish

Publish to a named event. The optional parameters to `publish` following the event name are passed as parameters to all callback functions that have been registered using [`subscribe`](#subscribe).

```
publish(Event[, Message1, Message2, ...]) -> undefined
```

- `Event` is the name of the event to subscribe to
- `Message` may be anything. These arguments ae passed to the subscriber callbacks as parameters

Example:

```
// this example demonstrates how the callback parameter works.
var callback;
callback = function(papasDinner, mamasDinner)
{
  console.log(papasDinner, mamasDinner);
};
subscribe("dinner", callback);
// this shows "Rice noodle" "Stinky tofu" in the debug console.
publish("dinner", "Rice noodle", "Stinky tofu");
```

#### getWidgetInfo

Get information about of the current widget. If the info of the `PropertyName` doesn’t exist, `undefined` is returned.

```
getWidgetInfo(PropertyName) -> PropertyValue
```

- `"PropertyName"` may take any of the following:

    `"id"` gets the identifier of the current widget in this page. This is useful if two custom widgets shares the same code and they both subscribe to a certain event providing an ID. In this case, only one widget can successfully subscribe to the event. With this function, they both can subscribe to the same event.

- `"PropertyValue"` is the value of the property

Example:

```
// this example demonstrates how the getWidgetInfo works
var callback,
    options;
options =
{
  id: "color" + getWidgetInfo("id")
};
callback = function()
{
  console.log("yellow");
};
subscribe("color", callback, options);
// this shows "yellow" in the debug console.
publish("color");
```

#### Google Loader API

The Google Loader API is available in the widget sandbox. Please see this link for more information:

[https://developers.google.com/loader/](https://developers.google.com/loader/)

### Widget Examples

There are a number of widget examples available in the "Script Template" drop down available when editing a widget.

More example code can be found here: [Custom Widget Example Code](https://github.com/exosite-garage/custom_widget_scripts).

