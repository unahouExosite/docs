Preprocessing
=============

The first processing stage, that every resource passes input values
through, is preprocessing. Preprocessing is generic across all resource
types. Preprocessing can be viewed as the conditioning of input values
prior to their actual processing by the main, resource specific
processing stage.

Format
------

Preprocessing is specified as a list of operation-constant pairs. If an
empty list is given, it signifies no-operation or pass-through. If
multiple operations are specified, they will be executed in the order
they are specified in, each operation feeding its return value to the
next operation as its input value. The return value of the last
operation will be the output of the preprocessing.

Boolean Operations
------------------

The following preprocessing operations with boolean output, 'true' or
'false', are currently supported by the One Platform.

### gt - greater than

Checks if the input value is greater than the constant specified in the
operation.

### lt - less than

Checks if the input value is less than the constant specified in the
operation.

### eq - equal to

Checks if the input value is equal to the constant specified in the
operation.

### geq - greater than or equal to

Checks if the input value is greater than or equal to the constant
specified in the operation.

### leq - less than or equal to

Checks if the input value is less than or equal to the constant
specified in the operation.

### neq - not equal to

Checks if the input value is not equal to the constant specified in the
operation.

Numerical Operations
--------------------

The following preprocessing operations with numerical output are
currently supported by the One Platform.

### add - addition

Adds the input value to the constant specified in the operation and
returns the sum of the two values.

### sub - subtraction

Subtracts the constant specified in the operation from the input value
and returns the remainder.

### mul - multiplication

Multiplies the input value by the constant specified in the operation
and returns the product.

### div - division

Divides the input value by the constant specified in the operation and
returns the quotient.

### mod - modulo

Divides the input value by the constant specified in the operation and
returns the remainder after the division.
