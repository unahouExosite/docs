Provisioning
============

Provisioning allows for a One Platform resource template to be defined
as the representation of a manufactured device, allowing the device to
automatically start reporting data without having to first create it's
representational resources. Such a template is configured under a device
model and assigned ranges of serial numbers that may activate for the
model. Additionally a device model may have downloadable content
associated with it for activated devices to receive as infield updates.

Model
-----

Custom device models may be defined, providing a unique model type name,
model serial numbers and a One Platform clone template resource.

Serial Number
-------------

Serial numbers are associated with a device model type. A device
activates using its unique serial number and model type, establishing
its access to the One Platform.

Serial numbers have status and may be in one of several states.

-   Unused
-   Enabled
-   Expired
-   Activated

When a serial number is enabled, it is ready to be activated. If the
serial number is not activated within the configured time it will expire
and must be re-enabled in order to be ready again for activation. Once
activated, a device has access to the One Platform and downloadable
content associated with its model type.

Template
--------

A One Platform client resource may be tagged as a clone for use as a
provisioning model template. When a serial number is enabled, the
template is cloned.

Content (future only)
---------------------

Downloadable content blobs can be made available for specific model
types as infield firmware updates, configuration management and other
use cases.
