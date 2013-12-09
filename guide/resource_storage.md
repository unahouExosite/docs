Storage
=======

Fully processed values, output from the main processing stage, will get
stored in a time-series database which is an integral part of each
resource. Two features of the database are of interest to the user,
explained below.

Format
------

When a resource is first created using the 'create' API, the format of
data to be stored in the database must be specified via the 'format'
description property. Exceptions to this are certain restrictions which
are noted in the respective resource pages. During normal operation of a
resource, the processing output will be converted to that format before
storing the value in the database. Note, that the format of the database
can not be altered via the 'update' API. The following database formats
are supported currently.

### binary

...

### boolean

...

### float

...

### integer

...

### string

...

Retention
---------

The One Platform provides the user with a mechanism with which they can
manage how much of their data is stored and for how long it is
subsequently retained by the One Platform, on a per resource basis.
Retention control works in conjunction with a client's allotted disk
space usage in the sense that it should be configured so as not to hit
the owner client's disk space usage limit. Hence, retention should be
considered as a helper mechanism to ensure a client's disk usage be kept
within its limit. Depending on the user's application needs, retention
of data can be specified as the combination of two different metrics,
discussed below.

### Record count

This retention metric gives the user the ability to specify the count of
value entries the resource should keep before the One Platform would
automatically start dropping the oldest entries. This retention metric
is set via the resource description property 'retention.count'.

### Duration

If the user's application requires that data be kept for a specific
timespan, regardless of entry count, this metric can be used to specify
that duration, expressed in hours. This metric is configured via the
resource description property 'retention.duration'.

When more than one retention metric is set, the effective retention will
be determined as the most limiting of all. For example, with record
count set to 100 and duration set to 24 hours, old entries will start to
get dropped in either of the two cases: 1) when record count has reached
100, with the oldes entry younger than 24 hours; 2) when the oldest
entry has become 24 hours old, with less than 100 entries collected.

Updating the retention via the 'update' API is allowed but has
consequences. After an update, the One Platform looks at the amount of
data stored for the resource and the oldest entry's timestamp. If the
updated retention is more limiting than the old one, the One Platform
will drop any entries that do not meet the newly enforced retention
metrics. Note, that this update is irreversible causing the permanent
loss of the dropped data. If the new retention is less limiting, no
change will take place to the existing data.
