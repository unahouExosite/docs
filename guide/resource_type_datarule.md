The Datarule
============

Datarules currently implement a flexible eventing system. Not yet fully
scriptable, but using a number of preconceived, configurable rule
definitions, relatively complex real-world scenarios can be translated
to One Platform terms and acted upon. An Event's state is either entered
or left as determined by the evaluation of an Event Condition. A
condition may be evaluated many times without any change to the Event's
state. Normally, anytime a condition is satisfied, if the rule was
already in a "true" state, a subsequent "true" is not output. However,
every rule type can be configured so that every time the condition is
satisfied, "true" will be published regardless of its previous state.
"false" is only published once on transition from "true".

Description
-----------

In addition to the common description, datarules require the following
description items.

### rule

This property specifies the datarule to evaluate everytime an input is
received or, if applicable, a timeout occurs. Currently, one and only
one of five types of eventing scenarios can be specified for a datarule,
configuring the respective type of eventing scheme. Detailed description
of each eventing type is given in the Processing section.

Processing
----------

Every rule type works based on the concept of comparisons and
conditions. Conditions are logic rules with the boolean result of either
"true" or "false" based on their internal logic and input. Inputs can be
one of two types: values and timeouts. The following sections describe
the available rule types.

### simple

When a value is received, it is used in the comparison, and the
comparison result is the result of the condition.

### timeout

A timeout is always running. If a value is received, the timeout is
restarted, otherwise the timeout repeatedly elapses and restarts. When a
value is received, the condition result is "false". When a timeout
elapses, the condition result is "true".

### interval

It is a simple comparison, repeated every timeout, as long as the simple
condition remains true. The timeout is reset every time a datapoint is
received that satisfies the condition. The timeout is canceled when a
datapoint received does not satisfy the condition.

### duration

When a value is received, it is used in the comparison. If the
comparison result is "true" then a timeout is started. If the comparison
is "false" then any existing timeout is canceled and the condition
result is "false". When a timeout elapses, the condition result is
"true" and the timer is restarted.

### count

When a value is received, it is used in the comparison. If the
comparison result is "true" and there is no existing timeout, then a
timeout is started and an internal counter is set to 1. If a timeout
already exists then the internal counter is incremented. A comparison
result of "false", regardless of the existence of timeout, is ignored.
If the internal counter matches the count configuration parameter, then
timeout is restarted, the internal counter is set to 0 and the condition
evaluates to "true". If the timeout elapses, the counter is set to 0,
the timeout is canceled and the condition evaluates to "false".
