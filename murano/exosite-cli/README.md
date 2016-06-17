---
title: Exosite Command Line Interface
template: default
---

# Exosite Command Line Interface (CLI)
The Murano Command Line Interface is a tool that enables web application developers to use their local development environments to develop IoT application software and then to publish it online. 

Open a terminal window to run the commands below.

<ul><li>Install the Exosite CLI: ```$ sudo pip install exosite``` In OS X, you may need to use the built-in system dependencies by running ```$ sudo pip install --upgrade exosite --ignore-installed six --ignore-installed prompt-toolkit --ignore-installed requests```</li>
<li>List commands: ```$ exosite -h```</li>
<li>Initialize your solution: ```$ exosite --init --host biz-internal-api.exosite-dev.com```</li>
<li>Deploy your solution: ```$ exosite --deploy --host biz-internal-api.exosite-dev.com```</li>
</ul>
