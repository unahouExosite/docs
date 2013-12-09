Input
=====

The main function of resources is the processing of values supplied to
them at their input. There are two ways to supply input values to a
resource: directly writing to it, or subscribing it to another resource.

Live entries
------------

Using the 'write' API, or via subscription, input values are delivered
to a resource without a timestamp. These values are considered live
entries and are automatically timestamped by the One Platform.

### Direct writes

Values can be directly written to a resource's input using the 'write'
API. Direct writes are only possible if the resource is not subscribed
to another resource, that is, the resource's 'subscribe' description
property is set to "". Otherwise, write attempts will result in the
error 'restricted'.

### Subscription

A resource can receive input values automatically if it is subscribed to
another resource's output. That is, everytime the publishing resource
produces an output value, the subscribing resource will receive it. This
can be achieved by setting the subscribing resource's 'subscribe'
property to the identifier of the publishing resource.

Historical entries
------------------

Restricted to dataport type resources only, if the user already has
historical, timestamped data, they can use the 'record' API to enter
that data to the One Platform. Note, that the processing results of
historical entries will not be published from the resource.
