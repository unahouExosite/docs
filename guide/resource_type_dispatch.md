The Dispatch
============

The resource type 'dispatch' takes an input value, applies the
configured preprocessing to it, sends the configured value to the
configured recipient, using the configured dispatch method and stores
the dispatch delivery status in the associated time series database. The
dispatch delivery status will also get published to subscribed
resources.

Description
-----------

In addition to the common description, dispatches require the following
description items.

### locked

This property controls whether an activated dispatch will occur or not.
A dispatch can be locked by setting this property to 'true'. This
property takes the boolean values 'true' or 'false'.

### message

This is the string that will be sent to the dispatch recipient. If it is
an empty string, the output from the preprocessing stage of the dispatch
resource will be sent instead. The string can be up to 1000 characters
long.

### method

The transport mechanism used to dispatch a value is specified in this
property. It can take one of the following values: email, http\_post,
http\_put, sms and xmpp.

### recipient

The intended recipient of the dispatched value must be specified in this
property. The recipient must be valid for the dispatch method set in the
property 'method'.

### subject

For dispatch methods that support a subject line, a string to be sent as
the subject line can be specified in this property. For dispatch methods
not supporting a subject line, this property is ignored. The string can
be up to 250 characters long.

Processing
----------

The processing role of dispatch resources is to send out a preset, or
dynamic, message to the configured recipient using the configured
delivery method. The result of the processing stored in the associated
time series database, and published, is either 'delivered' or
'undelivered'.

### Activation (future only)

When a dispatch resource is first created, the specified recipient and
delivery method combination needs to be activated. In order for this to
happen, upon creation of a dispatch, the One Platform checks if the
newly specified recipient-method combination has been activated yet. If
it has, no further action is needed and the dispatching of messages from
this resource will commence. If this combination has never been
activated, the One Platform will send out an activation request, with an
activation code included, to the recipient, using the specified delivery
method. The user will then need to reply to the request, again, with the
activation code included. Dispatches from this resource will not start
until the activation request has been replied to.

Note, that the current version of the One Platform does not yet support
dispatch activation. Dispatches will be automatically activated.

### Message body

If a message body is supported by the particular dispatch method, such
as email or sms, it can be specified in the 'message' property. If no
message body is specified, then the output from the preprocessing stage
will be converted to string and subsequently sent to the recipient.

### Subject line

Dispatch delivery methods that support a subject line, such as email,
will send the string specified in the 'subject' property as the subject
line. If the subject property is the empty string, the standard "Exosite
Dispatch - timestamp" subject will be used. If subject line is not
supported for a particular deliver method, this feature will be ignored.

### Suspension

In case messages from a dispatch resource temporarily become undesirable
or impractical, delivery of subsequent messages can be disabled and
later enabled. This can be achieved by changing the 'locked' property to
'true' and 'false', respectively, using the 'update' API.
