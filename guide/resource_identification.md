Identification
==============

Every resource, regardless of type, must be uniquely identified to and
within the One Platform. Four methods have been designed to meet this
requirement, each one with a different additional goal in mind. The
following subsections introduce the different methods, along with their
respective intended use explained.

Resource ID
-----------

The primary method of identification of resources to and within the One
Platform is by randomly generated, globally unique 40-character
hexadecimal identifiers. When the One Platform is requested to create a
new resource, it will generate a unique identifier, associate it with
the resource and return it to the caller. Anytime after that, the
resource can be identified by referencing this identifier. Note, that
for security reasons, clients are not allowed to identify themselves to
the One Platform using their Resource ID.

Client Interface Key
--------------------

As a security measure, clients must not externally identify themselves
to the One Platform using their Resource ID. Instead, they are given a
Client Interface Key, or CIK, to do so. CIKs are also random
40-character identifiers, therefore, carrying the same level of
uniqueness as their Resource ID counterparts. The difference is that
they are loosly coupled with the client they represent and can be
replaced with another such ID if needed. CIKs give full access to the
features and services that are available to a client.

Authorization token (future only)
---------------------------------

Authorization tokens work exactly the same way as CIKs do, with one
important exception. While CIKs give a client full access to the One
Platform functionality, authorization keys allow only a subset of that.
The definition of what that subset is, is configurable. Once this
feature becomes supported, further details will follow here.

Alias
-----

Aliases are a human comprehensible, easy to remember way to identify
resources. Resources can be looked up by providing their aliases to the
'lookup' API. Also, at the One Platform interface level, everywhere a
Resource ID is accepted, an alias mapped to that Resource ID is also
accepted (future only). Aliases are strings of up to 250 characters in
length.
