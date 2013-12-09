Output
======

The final result of processing a resource does is not only stored in the
dedicated time-series database, but is also published from the resource,
on certain conditions. Output from a resource will be received by other
resources that are subscribed to this resource. This is how complex data
processing can be realized by chaining up more than one resource. This
feature also allows users to reuse processing definitions and avoid
redundancy. Values output from a resource, as well as their format,
exactly match those stored in the resource's time-series database.

Resources will not publish an output value in two cases:

-   if the actual processing produces no output from the input value,
-   if the input value was a historical entry, delivered to the resource
    via the 'record' API.

