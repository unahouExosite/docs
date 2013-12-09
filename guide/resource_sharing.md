Sharing
=======

Normally, clients have access to owned and descendant resources only.
Resources positioned on different ownership branches of the hierarchy
tree are considered unrelated. A client can be given access to an
unrelated resource by sharing it with the client. The access level
thereby granted is read-only. Shares can be created and subsequently
revoked, and in the meantime, activated or their metrics updated.

Creation
--------

Sharing of a resource is always initiated by the owner client of the
resource to be shared. Using the 'share' API, the client will create a
share with some metrics describing it. It is possible to create multiple
shares of the same resource, potentially specifying different metrics.
The fact that a share has been created is recorded by the One Platform
and an activation key is generated and returned to the creating client.
This key can then be handed out to clients, thereby granting them the
right to activate access to the now shared resource. The key is a
random, 40-character hexadecimal number and its distribution to other
clients is outside the One Platform's scope of operation.

Activation
----------

Clients wanting access to a non-descendant or non-public resource, will
need a share activation key to it. Such a key must have previously been
created as described above. Once a key has been obtained, it must be
used to activate the share in order for the share to become accessible
to the activating client. Activation is carried out using the 'activate'
API. Once activated, the One Platform will give the activating client
read-only access to the shared resource. Note, that a client can hold
only a single share activation of the same resource at any one time.

Revoking
--------

Shares remain active until, based on their metrics, they either expire
or have their key revoked via the 'revoke' API. Only the owner client
can revoke a share key. If a share key is revoked, clients that had used
that key to activate the share will no longer have access to the
resource.

Updating
--------

Updating a share is possible using the overloaded 'share' API. If a
share activation key is also supplied to the API, intead of creating a
new share, it will update the existing one with the given metrics. Note,
that restrictions on how a share can be updated, apply.

Metrics
-------

When creating a share, a few metrics will also be specified, either by
default values or by the creating client providing these metrics.
Metrics of a share control how many times a share can be activated and
when, if ever, it expires.
