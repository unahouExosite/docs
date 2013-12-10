Description
===========

When a resource is to be created or updated, the One Platform is given a
description of the resource. The properties making up this description
ultimately define the resource. The description of a resource will
appear the same to any and all clients that have the necessary access to
observe the resource. A resource's description can be specified via the
'create' API, modified via the 'update' API and queried using the 'info'
API.

### format

Each resource has a database associated with it. When creating a new
resource, the type of data the resource will have to store after its
processing stage has to be specified so that the One Platform can set up
a correctly formatted database. The format field specifies this.
Although certain restrictions apply, it will take one of the following
values: binary, boolean, float, integer or string.

### name

Because the standard way resources are identified is by random,
40-character hexadecimal identifiers, the One Platform provides the name
property to allow users to give their resources a human readable,
descriptive name. This property can hold a string of up to 250
characters in length.

### preprocess

The first stage of processing a resource does on its input value is
specified by the preprocess field. The supported types of operations are
common across all resource types. The following is a list of all
supported preprocess operations: gt, lt, eq, geq, leq, neq, add, sub,
mul, div, mod. The preprocess field takes zero, one or more of these
operations along with a constant, as value. For further information,
reference the 'Preprocessing' section.

### retention

Processed input values will be stored and kept in the associated
database. According to the combination of metrics specified in the
subfields of this property, the One Platform will regularly purge excess
data. That is, the metrics specify the guaranteed minimum retention of
data. Note, that although excess data may be retained for short periods
of time, application software should not be designed around that
possibility. Each one of the metrics can be specified or omitted as
appropriate for the particular use. The retention metrics may not be
user configurable for each type of resource, however, and other
restrictions may apply. Reference the One Platform Reference document
for details.

#### count

The guaranteed number of records to be kept for this resource. Must be a
non-negative integer or the term 'infinity'.

#### duration

The guaranteed number of hours the One Platform will retain records for,
for this resource. Must be a non-negative integer or the term
'infinity'.

### subscribe

A resource receives its input value either by directly writing to it,
using the Platform API, or setting this property to another resource's
identifier, in other words, subscribing to another resource. Must be
either a 40-character resource identifier or "". Note, when a resource
is subscribed to another one, direct writes to it are not allowed.

### type

This property determines which of the four supported types this resource
is. It can take one of the following values: client, dataport, datarule
or dispatch. For further details on each of the resource types,
reference the respective resource under 'Types' section.

