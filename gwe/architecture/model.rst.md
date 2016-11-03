Gateway Engine Client Model
===========================

A client model for an Exosite IoT solution has a specific meaning. For a
full description of One Platform clients and client models, please read
the following support documents as they are very descriptive and written
by Exosite Support experts:

-   [One Platform
    Clients](https://support.exosite.com/hc/en-us/articles/200397956)
-   [One Platform Client
    Models](https://support.exosite.com/hc/en-us/articles/200491563-Client-Models)

While these articles are important for your understanding, we're still
going to briefly describe clients and client models and how they apply
to a Gateway Engine architecture.

Terms
-----

Let's make sure we're all speaking the same language here. In
conversation and documentation, words can get minced and meanings
obscured by overloaded words and usage that varies. Before submerging
ourselves too deep on this dive, let's first covers some terms that we
constantly use when talking about IoT architectures and infrastructures.

<div class="admonition">

Examples of these terms used in sentences.

-   The gateways in my IoT solution are based on the **gateway\_engine**
    client model.
-   The path to the spec file that extends my project's
    **gateway\_engine** model is /path/to/spec\_file.yml.
-   The additional alias that we added to the **gateway\_engine** base
    client model is `coffee_dataport`.

</div>

With these terms defined, lets see how they apply to the base Gateway
Engine client model.

### The **gateway\_engine** Client Model

When looking at Gateway Engine as an application framework installed and
executed on gateway devices, we're talking about `GatewayEngine` the
python package. At the time of this writing `GatewayEngine`'s default
behavior is to interface with a prescribed set of dataports directly
under One Platform clients of the **gateway\_engine** base model. Every
One Platform client can be fully described by the client model within
its spec file. A `GatewayEngine` client is no different except that it
is based off of an *extensible* client model.

<div class="admonition">

Client lineage

A One Platform client that isn't based on any Client Model is a
"generic" client. The attributes of generic clients are typically based
on the attributes of its parent client.

</div>

What is an *extensible* client model?
-------------------------------------

In nearly every One Platform IoT solution, devices put their data into
dataports. A dataport is a child resource of a One Platform client. When
a device writes its data to a dataport, it typically refers to the
client's dataport alias and all child aliases **must** be unique. These
relationships are described in client models, but
not all relationship have to be defined in a single spec file. Since we
can describe some attributes in spec file A, and others in spec file B,
we can base our clients off of both spec files.

The `GatewayEngine` client model, at the time of this writing , only
defines a few dataport resources. During the design and development
phases of your solution you might find that there is need for extra
dataports, dispatches or lua scripts as child resources of your
**gateway\_engine** clients. This is why the `GatewayEngine` client
model is only a minimal set of parts. Some parts never change, others
are specific to your application and others might be added later on in
the development process. Some IoT solutions might not add anything to
the `GatewayEngine` model. In this way, the `GatewayEngine` client model
is *extensible* because it defines a baseline set of features that are
common among all Gateway Engine IoT solutions. Design decisions like the
client model name, the vendor name and any other features needed for the
application/solution are reserved for the individual needs of the
current project.

On a per-dataport level, the baseline client model for `GatewayEngine`
is as follows:

Aliases explained further
-------------------------

One Platform provides the concept of an "alias" as a programmatic means
for referring to a resource without knowing its RID. This comes in handy
when you need to iterate over a number of clients and, for instance,
look at the latest value in the `coffee_dataport` dataport. The alias is
actually `coffee_dataport`, but it's easier to refer to the alias rather
than the RID. Since all RIDs are unique in a "tree" and
**gateway\_engine** clients are **sibling** devices of other
**gateway\_engine** clients. If you wanted to look at the version of the
current `GatewayEngine` software installed on your gateways you would
have to look up all of the individual RIDs of all of your
**gateway\_engine** clients.

-   All One Platform entities (clients, dataports, etc.) are "resources"
    of one type or another.
-   All resources have a Resource ID (RID).
-   All RIDs are unique.
-   All resource types (clients, dataports, etc.) can have "aliases".

Anatomy of a Spec File
----------------------

Before looking at the spec file for `GatewayEngine`, lets take a look at
the spec file for a fictitious device that reports the amount of coffee
left in a decanter. This simple spec file illustrates an application
that is about as simplistic as it can get. The client model name we
chose is `coffee_reporter` (from the Tutorials section of these docs).
The key points here are:

-   The spec file fully describes the client model.
-   The `model`, `vendor` and required dataports are all included.

``` {.sourceCode .yaml}
# spec_coffee_reporter.yml
device:

    model: "coffee_reporter"
    vendor: "BestCoffee"

dataports:

-   alias: coffee_dataport
    name: Coffee Level
    format: string
    description: 'This dataport contains time-series data about the coffee level in a given coffee_reporter example application.'
```

Now take a look the spec file for the base `GatewayEngine` client model:

``` {.sourceCode .yaml}
# spec_gateway_engine.yml
dataports:

-   alias: usage_report
    name: GatewayEngine Usage
    format: string
    description: 'Dataport for JSON formatted usage statements sent by gateway.'

-   alias: engine_report
    name: Engine Report
    format: string/json
    description: 'Report of all running applications currently managed by Engine.'

-   alias: engine_fetch
    name: Install Apps
    format: string/json
    description: 'Load new applications onto the 400AP running GatewayEngine from the content area by writing the content-area tarball name into this dataport.'

-   alias: device_info
    name: Device Info
    format: string
    description: 'View version and other device properties.'

-   alias: update_interval
    name: Update Interval
    format: string
    description: 'Time, in seconds, that GatewayEngine will report its usage_report and fetch any new updates.'
```

What you may or may not have noticed is that the `vendor` and `model`
data is missing from the baseline `GatewayEngine` spec file. This, in
large part, is what makes it extensible.

Extending the base `GatewayEngine` client model
-----------------------------------------------

Next, let's look at a practical example of how to extend the baseline
`GatewayEngine` client model for the Best Coffee© company.

Are you ready? We're done! Yes, we've already done all the work required
to extend the **gateway\_engine** client model to suit the design of the
Best Coffee gateway IoT solution.

The two spec files, `spec_coffee_reporter.yml` and
`spec_gateway_engine.yml`, have all of the information needed to fully
describe the **best\_coffee** client model. The `model`, `vendor` and
`coffee_dataport` information is all there in its own spec file as well
as the baseline `GatewayEngine` client model in its spec file.

Applying these two spec files separately to a One Platform client would
accomplish the same as combining them and applying a single spec file.

To "spec" a client
------------------

When we talk about applying a client model to a client, sometimes we
call it "spec'ing". This means we have a client resource to use as the
interface to a gateway device with `GatewayEngine` installed and that
we're going to create all resource and apply all attribute in the given
spec file to that client.

Methods for spec'ing a client with a given model can vary, but at
Exosite, most developers use the command line tool
[exoline](https://github.com/exosite/exoline).

Here's how one could use `exoline` and [CIK
Fountain](http://cik.herokuapp.com) to create and spec a One Platform
client:

``` {.sourceCode .console}
# CIK=$(curl -s cik.herokuapp.com)
# exo spec $CIK spec_coffee_reporter.yml --create
Running spec on: da89e4227becf3b85a86d6ff1028245d0e1e7d1c
coffee_dataport not found.
Creating dataport with name: Coffee Level, alias: coffee_dataport, format: string
# exo spec $CIK spec_gateway_engine.yml --create
Running spec on: da89e4227becf3b85a86d6ff1028245d0e1e7d1c
usage_report not found.
Creating dataport with name: GatewayEngine Usage, alias: usage_report, format: string
engine_report not found.
Creating dataport with name: Engine Report, alias: engine_report, format: string
Spec requires engine_report be in JSON format, but it is empty.
engine_fetch not found.
Creating dataport with name: Install Apps, alias: engine_fetch, format: string
Spec requires engine_fetch be in JSON format, but it is empty.
device_info not found.
Creating dataport with name: Device Info, alias: device_info, format: string
update_interval not found.
Creating dataport with name: Update Interval, alias: update_interval, format: string
```

<div class="admonition tip">

During development it is often useful to have access to a temporary
client. The webapp [CIK Fountain](http://cik.herokuapp.com) was created
as a developer tool to solve this very problem. When you get a CIK from
CIK Fountain you don't have to worry about cleaning it up, tearing it
down when you're done, who owns it or anything like that. CIK Fountain
gives you a valid CIK (with some limits) so you can develop as though
you're in an IoT sandbox. The CIK will get destroyed about an hour after
creating it.

</div>

Now that we have created and spec'ed our new **gateway\_engine** client,
let's verify that everything is as we expect:

``` {.sourceCode .console}
$ exo twee $CIK
Temporary CIK   cl cik: da89e4227becf3b85a86d6ff1028245d0e1e7d1c
  ├─Coffee Level        dp.s coffee_dataport: 
  ├─Device Info         dp.s device_info: 
  ├─Engine Report       dp.s engine_report: 
  ├─GatewayEngine Usage dp.s usage_report: 
  ├─Install Apps        dp.s engine_fetch: 
  └─Update Interval     dp.s update_interval: 
```

<div class="admonition note">

You may have noticed that the output of the spec command warned that
"Spec requires &lt;alias&gt; be in JSON format, but it is empty.".
Please see the section about JSON Schemas in the advanced section.

</div>
