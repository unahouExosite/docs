# GWE Solution App

This guide provides an example solution displaying all the telemetric data from Gateway Engine as well as showing a Custom Gateway Application: "gmq-sine-demo". For additional information and resources, please refer back to the Gateway Engine documentation home page (http://docs.exosite.com/exositeready/gwe/).

# Getting Started

## Configure Murano

1. Create a Murano account (https://exosite.com/signup/) or log in to your existing account (https://www.exosite.io/).

2. Choose to create a New Product. Select *Start from scratch* as a starting point. You may use any product name you like.

	![Step 2](assets/step_2.png)

3. Navigate to the *DEVICES* tab to add a New Device called "Gateway". Use your gateway's MAC address as the *Identity*. Example format "00:08:00:4A:02:25".

	![Step 3](assets/step_3.png)

4. Add another New Device called "Test Data". Use "12345" as the *Identity*.

	![Step 4](assets/step_4.png)

5. Click on your Test Data device and add a New Resource with the *Alias* “test” and *Data format* “float". 

	![Step 5](assets/step_5.png)

6. Add the "usage_report", "engine_report", "device_info", "update_interval", "engine_fetch", and "fetch_status" resources to your "Gateway" device as strings.

	![Step 6](assets/step_6.png)

7. Navigate to the *Solutions* screen and create an New Solution. Select *Start from scratch* as a starting point. Name it whatever you like. 

	![Step 7](assets/step_7.png)

8. Install the Exosite CLI tool. https://github.com/exosite/exosite-cli

	```
	pip install exosite
	```

9. Clone the GWE Seed App repository to your machine.

	```
	git clone https://github.com/exosite/GWE-Seed-App
	```

10. Init the Exosite program and log in using your exosite.io credentials. 

	```
	cd GWE-Seed-App
	exosite --init
	```

11. Deploy the solution.

	```
	exosite --deploy
	```

## Configure The Gateway 

1. Install GWE on your gateway following the [GWE Getting-started guide](http://docs.exosite.com/exositeready/gwe/getting_started/).

2. Set the update interval to post data every minute.

	```
	gwe -t 60
	```

3. Install the gmq-sine-demo onto the Gateway using the documentation https://github.com/exosite/gmq-sine-demo. Use the device identity as the Serial when prompted (12345).

4. Navigate to your solution page and check to see the data is flowing.

If you encounter any issues, please contact the dedicated GWE support team at [gwesupport@exosite.com](mailto:gwesupport@exosite.com).
