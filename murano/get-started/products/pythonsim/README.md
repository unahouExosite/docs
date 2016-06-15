---
title: Murano Getting Started - Products - Python Simulator Script
template: default
---

# Murano Example - Python Simulator Script Smart Lightbulb

This example walks through using a [Python](https://en.wikipedia.org/wiki/Python_(programming_language) script to act as a Smart Lightbulb with Murano.  Users can feel free to customize after walking through this guide as you'll have created a full Product instance that supports a deployment of devices specific to that Product.
Product definition can be updated and more devices can be added.  After walking through these steps,
users will be interacting with simulated device data (generated from your computer running the script) using a prototype developer dashboard tool.  
After this, users can go through the Murano Solution examples to deploy a Example consumer web application that works with this product demo.

# Hardware Setup
There is no hardware used for this example, only your computer that can run a Python script.

# Software Setup
## Python
0. Download and Install Python (if you haven't used it before) [https://www.python.org/](https://www.python.org/downloads/)



# Murano Product Setup
## Create Your Product.

1. Create a Product in Murano.  

   When creating a product, Murano allows you to use a `product template` spec file to setup the product definition. For this example, you can use the following url (copy the whole thing):

  ```https://raw.githubusercontent.com/exosite-garage/arduino_exosite_library/master/examples/Murano-SmartLightBulb-ThingDevBoard/product_spec_smart_lightbulb_example.yaml```

  ![create new](assets/add_new_product.png)
  ![create new window](assets/add_new_product_window.png)

  After creating a product, take note of the Product ID which will be used for the device simulation script in later steps.  The Product ID can always be found on the `Info` tab on the Product page.

  ![product id](assets/get_product_id.png)

  Your `Definition` tab should look like this:
  ![resources](assets/adding_resources.png)

  _Note: If you did not use the template previous step, you can manually set up your Product Definition. Go to the Product Definition Tab and set up your dataport resources as specified here. Also, set the default value for `state` to 0 so the device has a default value it reads to know to turn   on or off the LED. Click on the `state` resource in the Definition tab and write a 0 to the value._

  * alias: _temperature_, format: _float_
  * alias: _humidity_, format: _float_
  * alias: _uptime_, format: _integer_
  * alias: _state_, format: _integer_

  ![default state](assets/set_light_status_default_value.png)

## Run the Python Script

1. Create a new Arduino Sketch.
2. Get the Example Sketch from the Exosite library called 'murano_example_smart_lightbulb_sensor', which will load a new Sketch with the example device application code.

   ![example](assets/select_example.png)

5. In your sketch, edit the WiFi configuration parameters for your local WiFi network (SSID and Password).  
   ![change](assets/your_customizations.png)

6. In your sketch, edit Exosite Product ID from your Murano product
   ![sketch](assets/sketch_edit_parameters.png)

7. Make sure board is connected to your computer via USB port and select the correct Port from the Arudino Tools menu.
   ![port](assets/arduino_serial_port_selector.png)

8. Select the correct board before you compile your code from the Tools menu.
   ![board](assets/board_selection.png)

9. Click the Upload button which will first compile and then download to your plugged in board.
   ![upload](assets/compile_upload_button.png)

8. Open the Serial Monitor.  
   ![serial](assets/serial_monitor.png)

9. Copy Device Identifier (MAC Address) from the Serial Monitor Output.  
   ![compile download](assets/run_debug_get_unique_identifier.png)
   _(You can click the Autoscroll if the log window goes past the top)_

## Add Device to Murano Product
1. Add Device to Product in Murano using the Device Identifier (MAC Address)
  ![add device](assets/add_unique_device.png)
  ![not activated](assets/not_activated_devices.png)
2. If you have used this hardware before with Exosite's Library, restart your Device by either using the boards On/Off Switch or Uploading your Sketch again to the board.  
2. Verify Device Provisions using the Arduino Serial Output.
if previously used and may have a old CIK (private device API key) stored in it's non-volatile memory (EEPROM).
   ![activation log](assets/debug_output_activation_text.png)
3. View Device Resources (click on device)
   ![device resources](assets/device_resources_new_data.png)

## Run the Product Dashboard Developer Tool
1. On the Device page, click the 'Dashboard' tab - which is a link to the Murano Product Dashboard Developer Tool.  This opens a new browser tab.  
   ![dashboard link](assets/dashboard_link.png)
   ![dashboard empty](assets/dashboard_empty.png)
2. Add a pane, then add a widget to the pane.
  ![dashboard add widget](assets/dashboard_add_widget.png)
3. Interact with live data
  ![dashboard](assets/dashboard_live_data.png)
4. Done!
