The Client
==========

Resources of 'client' type are special in a number of ways. First, they
don't represent data sources, instead they represent management roles
for other resources that do represent data sources. Clients play a role
in defining the ownership hierarchy among resources. Clients represent
users of the One Platform and allow them to connect to it in order to
feed in data for and manage their owned resources. What clients don't
have is data input. In other words, clients can not be written to and
they can not subscribe to other resources.

Description
-----------

In addition to the common set of description properties, clients require
the following description items.

### limits

The number of resources a client can create and own as well as other
metrics of the One Platform services a client can access may be limited.
There are two categories of limits: ownership and activity. Subfields of
this property, each controls one ownership or activity metric.
Regardless of category, the subfields take a non-negative integer or the
term 'infinity' as value.

Ownership limits are expressed as the total number of owned resources a
client can own at once. That is, if a client had reached its ownership
limit of dataports, but has subsequently dropped one of them, it can
create a new one. In other words, these limits do not control the act of
creation but the state of current ownership.

Activity limits are expressed as the total number of actions, specific
to the limit, a client is allowed to perform during a 24-hour period.
The 24-hour period is midnight to midnight UTC time.

Limits specified for a sub-client draw against the owner's respective
limits. That is, a client's limits are the total of the controlled
metric down the client hierarchy tree. If 'infinity' is specified for a
limit, the metric will be limited by the owner client's respective
limit. If the owner specifies 'infinity', too, the ownership chain will
be walked upwards until a finite limit is encountered. This feature
allows clients to distribute their limits across multiple sub-clients
dynamically, without preset limits for the sub-clients.

### locked

Clients can be locked out of the One Platform to prevent them from
accessing its services. A client can be locked out only by its direct
owner, that is, the One Platform requires full access for this
operation. The reason why a client would need to be locked out is left
to the discretion of the client's owner. The One Platform, or Exosite,
does not provision a specific reason. This property takes the boolean
value 'true' or 'false', with the respective meaning of being locked or
unlocked.

Processing
----------

Client resources do not currently implement processing of data. Values
written, or otherwise delivered to, client resources will not be
processed and the error 'restricted' will be returned.
