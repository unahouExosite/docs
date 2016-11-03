One Platform Resource Architectures
===================================

This section of the Gateway Engine documentation is intended to
demystify the how resources can be organized in One Platform. Not all
IoT gateway solutions are the same and, as such, probably require some
different methods of organizing their data.

This document will use [plantuml](http://plantuml.com) to graphically
illustrate topographies and architectures.

Typically, these all fit together like this:

This image illustrates how One Platform clients are organized in a tree
of resource ownership. The Container client owns the "My device" client,
and the Domain client owns the Container client. Now let's take a look
at some real One Platform architectures.

The simplest possible One Platform Architecture
-----------------------------------------------

The following architecture is probably only valid for development cases
and illustration purposes. It defines a Domain-level client (the root
node) and a single client for interfacing with a device that reports a
floating point number.

This style of illustration depicts the "My device" client as a resource
that is "within" or "inside of" the "Domain" client. Another way to
depict this relationship is by showing their relationship on a "tree".

The Exosite "Portals" Architecture
----------------------------------

The Exosite product called "Portals" is a web application that
developers can use to quickly create IoT solutions. It has a
characteristic architecture that looks like the diagram below.

The Portals architecture is a strictly flat architecture at the "Portal"
level. The above diagram organizes the domain as having a Portal and
that Portal having any number of devices underneath it. Many domains
that use the Portals architecture have multiple Portals.

The architecture of Portals isn't set in stone, but the domain defaults
place restrictions on the 3rd generation devices - in this case the
Gateway. The main restriction is around clients. In the Portals webapp,
the child clients of a "Portal" client cannot have child clients of
thier own. So, in our example of Gateway Engine clients, above, the
Gateway Engine clients would need modifications to their client
properties in order to have their own clients. And if they did, the
Portals webapp would not be able to display them.

<div class="admonition tip">

In the context of One Platform architectures, most of the "structure"
comes from the hierarchy of the clients. When we talk about the Domain
and the Portal, we're just talking about One Platform clients. The
distinguishing features of the Domain and Portal clients are that they
have specific purposes and their organization provides the One Platform
architecture of the IoT solution.

</div>

Geneologies and Topographies
----------------------------

So far in this document on architecture, we've gone over what a typical
One Platform architecture can look like and we've started to use terms
like "3rd generation", so now is a good time to define a terminology
around how to talk about architectures.

### The Root

Every One Platform IoT Solution has a beginning. This is typically
called the "root node" or the "domain-level" client. This sounds really
important and scary, but all the root node is is a One Platform client
just like a Portal and one of our Gateway Engine clients. It is
typically just a container client from which all other clients
originate.

### Parent

A One Platform client is a Parent client to any other clients it has as
its own resources. The parent of a Portal client is the Domain. The
parent of a Gateway Engine client is typically a Portal.

### Children

Any client in a One Platform domain can be said to be the child of
another client. The Portal is a child client of the Domain. The Gateway
Engine client is a child of a Portal client.

### Siblings

In a One Platform solution with multiple Portal clients, they would be
said to be siblings of each other. In the same way, the Gateway Engine
clients in a given Portal would be siblings of each other. But Gateway
Engine clients are **not** siblings with other Gateway Engine clients if
they aren't in the same Portal. These would be **cousins**.

### Generations

This topic can be a little tricky and a bit confusing, but anyone who
has tried to describe their own family tree in spoken language has
invariably run into this same failure of the English language. Talking
and writing about One Platform hierarchies is not much different because
there are many parallels one can draw between them and family trees.

Take the following hierachy:

From this picture, we can say that Portal\_1 and Portal\_2 are child
resources of the root node (the Domain client). And all the the GWE
clients are children of Portal clients. We can also say the GWE\_1 is a
cousin of GWE\_4, but a sibling of GWE\_2. So far, this is the most
complex architecture we've discussed.

Now let's take a look at another way to organize One Platform clients,
but in this example we'll just focus on a single Portal client and a
single Gateway Engine client in order to keep the image small enough to
fit on this page:

From this picture we can see multiple generations of clients. Starting
from the root node we can see a standard One Platform hierarchy unfold
with a container client and then some other clients like Gateway Engine.
But this time the Gateway Engine client has child clients. And one of
its child clients has its own child clients. In hierarchies like this,
the concept of Generations becomes very useful.

The GWE\_1 client is a 2nd generation client of the root node. The
BLE\_1\_N1 client is a 2nd generation client of GWE\_1 and a 4th
generation client of the root node.
