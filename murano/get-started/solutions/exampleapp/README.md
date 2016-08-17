---
title: Murano Solution Example App
template: default
---

# GETTING STARTED - CREATE A SOLUTION & DEPLOY CHANGES
This is a quick start guide to using Exosite Murano Solutions.  When you are done following this guide, you will have built, deployed, and used an example IoT application with the following features:

* User Login
* User Profiles
* Device Provisioning
* Real Time Device Data
* Device Control

If you already have a Murano account, lets get started! If not
<a class="btn orange" href="https://exosite.com/business/signup">Sign Up for Beta Access to Murano</a>


# STEP 1: CREATE A SOLUTION USING THE HOME AUTOMATION EXAMPLE

Create a solution - using the home automation example as a starting point - here:
<a href="https://www.exosite.io/business/solutions" target="_blank">https://www.exosite.io/business/solutions</a>

**Note: You may have to delete your previous solution if you are on a free account.**

<!--![Select menu](assets/solution_select_menu.png)
![Select solutions](assets/solution_select_menu_option.png) -->
![+New Solution](assets/solution_add_new.png)

Notice the Home Automation Example will pull in a public Github repository. Note: If you're using your own Github repository in the future, it will not be linked to your solution (e.g. push to your Github repository and see changes on your solution). It consumes the repository when creating the solution, and you can push changes using the <a href="../../../exosite-cli/" target="_blank">Exosite CLI</a>.


![new solution](assets/new_solution.png)


To verify the Template File worked, click the "Routes" menu item - you should see something like this: 
![Routes Example](assets/routes_example.png)

**Awesome! You created a custom API, owner and guest roles with device-level permissions, a responsive web app (which we'll make changes to later), and an empty user database.**


# STEP 2: LINK YOUR PRODUCT WITH YOUR SOLUTION

**Note: If you haven’t created a product yet, create one here:**
<a href="https://exosite.io/business/products" target="_blank">https://exosite.io/business/products</a>

You can plug in all kinds of services into your solution. Products are linked to your solution as a "service", similar to the way you can integrate Twilio. We'll continue to add services that you can plug in and save development time.

1) In your solution, click on the services tab <br />
2) Select "Products" <br />
3) Select the settings icon <br />
4) Select the products you want to include in the solution <br />
5) Hit "apply" <br />

![Link product to solution](assets/solution_link_product.png)

**Your product is now linked to your solution - and can be added as a device.**


# STEP 2: SIGN UP FOR A NEW ACCOUNT ON THE WEB APP

Open your solution URL
![Open Solution Domain](assets/solution_open_domain_link.png)

Sign up for an account on your new example app. <div style="background-color: #00BCD6; display: inline-block;">NOTE: You will not be able to login with your Exosite Murano credentials.</div> This is a totally separate application that you just deployed on the Murano platform, with a separate user database.

If you used the Home Automation Example, it should look like this:
![Example App Screenshot](assets/solution_home_automation_example_app.png)

After signing up, click on the email verification link, then login.

In the new web app, add a lightbulb using the Identity of the device you added earlier (e.g. if you <a href="../../products/pythonsim/" target="_blank">simulated a device using a Python script</a>, your device identity would most likely be 000001). <div style="background-color: #00BCD6; display: inline-block;">NOTE: If you haven't added a device yet, it will throw an error.</div>

You should see data from the lightbulb - current humidity, temperature, and whether it's on or off. Note: If you simulated a device using the Python Script, keep the script running so data will continue to flow into the application. It should look like this:
![Example app - lightbulb added](assets/solution_example_app_with_lightbulb.png)


**Congratulations, you've connected a device to your web app and are seeing live data.**


# ADVANCED: DEPLOY CHANGES TO THE EXAMPLE SOLUTION 

** NOTE: This is a technical tutorial. You’ll need some familiarity with your operating system’s terminal. In order to complete this tutorial, you will need git, node.js & npm, and python & pip installed on your system.** 

Clone this github repo: 

```
git clone https://github.com/exosite/home-automation-example
```

CD to the directory

```
cd home-automation-example
```

Install the Exosite CLI

```
sudo pip install exosite
```

To confirm the Exosite CLI was installed correctly, type in: 

```
exosite -h
```
**If it returns “command not found”, you may need to install pip with brew on your specific OS. NOTE: There's a known issue in OS X - if you've upgraded to "El Capitan", you may need to go around the built-in system dependencies on “six” by running:**
```
sudo pip install --upgrade exosite --ignore-installed six --ignore-installed prompt-toolkit --ignore-installed requests
```

Once you’ve confirmed the Exosite CLI was successfully installed, run the following 3 commands: 

```
npm install
```
```
npm run compile
```
```
exosite --init
```

Login with your Exosite credentials, and enter your product and solution IDs (hint: try the typeahead)
![cli login](assets/cli_login.png)

Make a change to home-automation-example > app > components > Login.js. Change the text from “Login” to “Login HERE” to make sure changes are deployed.
![rename login](assets/rename_login.png)

Then compile your code
```
npm run compile
```

And deploy your solution from the top level directory (you may need to cd back up to home-automation-example directory)
```
exosite --deploy
```

Open the URL (cmd/ctrl + click to open in default browser, or copy paste the link)
![deploy change](assets/deploy_change.png)


Voila! Your Changes have been deployed: 

![Example app change](assets/solution_example_app_change.png)


# SETTING UP LOCAL DEVELOPMENT

To run the web application static assets locally, create a .env file in the root of the project with your solution URL, like this (name it anything):

API_BASE_URL=https://<solution-name>.apps.exosite-dev.io

**NOTE: the Chrome plugin in the next step may change the appearance of certain websites (e.g. github.com) until you disable it. You can easily disable the plugin by going to Chrome > Preferences > Extensions > Disable ModHeader**

Install this <a href="https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj/related?hl=en" target="_blank">Google Chrome plugin</a> and import this configuration: 

```
{"title":"Local Debugging","hideComment":true,"headers":[{"enabled":true,"name":"","value":"","comment":""}],"respHeaders":[{"enabled":true,"name":"Access-Control-Allow-Origin","value":"http://localhost:8080","comment":""},{"enabled":true,"name":"Access-Control-Allow-Credentials","value":"true","comment":""}],"filters":[],"appendMode":""}
```
![Import Config](assets/import_config.png)

![Import Profile](assets/import_profile.png)


Then cd to the home-automation-example directory in terminal, and paste this command:
```
npm run start:dev
```

Go to <a href="http://localhost:8080" target="_blank">http://localhost:8080</a> in your browser.

To push your solution changes to Exosite, simply run 
```
npm run compile 
``` 
Then deploy your solution changes to Exosite:
```
exosite --deploy 
```
<div style="padding-bottom: 30px"></div>

**Sweet! You can now develop locally, compile your app, and push to the cloud.**

<!-- Weaver's suggestion to add a link to learn more is valid and needed, but we don't talk about these things in the docs yet-->
<!--For more information about the powerful capabilities of Routes and Services (not to mention Hosting, Users, Roles and more, please check out <a href="../../">our getting started documentation</a>. -->
<div style="padding-bottom: 50px"></div>



Next up (if you haven’t already):
<a class="btn orange" href="http://docs.exosite.com/murano/get-started/">CREATE A PRODUCT >></a>
<div style="padding-bottom: 300px"></div>
