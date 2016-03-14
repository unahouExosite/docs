---
title: XMPP Commander
---

<div class="messagebox warning">This API has been depricated and should not be used for new designs.</div>

# Commander Chat

The Commander is a XMPP bot that allows any authenticated XMPP client 
(typically a remote user) to initiate a XMPP Chat in order to issue commands
to the One Platform through the Commander.

The Commander interfaces to the One Platform on behalf of the connected 
client. Given sufficient access rights the client may perform some or part of
the following functions through the Commander:

* Read and write client resource values
* Create, delete and list data sources for client resources
* Count and read data source records

## Common Responses

When an XMPP Chat session is started with the Commander, all commands will 
receive a response. If a command fails for any reason, the bot replies with 
an error message in this format:

```
error: <reason>
```

If a command is successful the bot will reply with a command-specific 
response value.

### Common Success Responses

* `ok`

### Common Error Responses

* `error: no identity`
* `error: invalid parameters`
* `error: unavailable`
* `error: not implemented`


# Command Set

## commanderid - commander ID string

Gets the ID string of the running XMPP Commander instance.

Note: it is not necessary to start a chat session to send this command. It
may be sent in either a XMPP Chat or XMPP Message body.

```
commanderid
```

####response

Response is the bot name and version.

```
XMPP Commander 0.2
```

## version - get API version

Gets the version number of the running XMPP Commander instance.

Note: it is not necessary to start a chat session to send this command. It 
may be sent in either a XMPP Chat or XMPP Message body.

```
version
```

####response

Response is the version string.

```
0.2
```

## help

Lists commands and help command syntax.

Note: it is not necessary to start a chat session to send this command. It 
may be sent in either a XMPP Chat or XMPP Message body.

```
help [<command>]
```

* `<command>` specifies the command for which to request help. It is optional.


####response

Response is help information, either for a specified command, or general information.

####examples 

```
> help
Type ‘help ‘ where is one of: commanderid, dscount, dscreate, dsdelete, 
dslist, dsread, dswrite, help, read, setcik, version, write
```

```
> help dswrite
Write historical data to the named Portals data source

dswrite <alias> <timestamp> <value>
```

## setcik - set client interface key

Sets the Client Interface Key (CIK) to the specified value. Setting the CIK 
starts a chat session. Chat sessions timeout after 5 minutes of inactivity. 

This command is required. It must be the first command sent, else all other 
commands will fail.

Ensure your client is using an encrypted connection. Otherwise, your private 
Client Interface Key will be exposed to third parties and could be exploited.

```
setcik <value>
```

* `<value>` is a CIK that identifies the client to the One Platform. Certain 
commands may not be available depending on the access rights associated with 
the given CIK.

####response

```
ok
```

Response may also be:

* `error: Invalid key`

####examples

```
>setcik 19cbdefad0b8e90b4d691376d5997f04c1acc18e
ok
```

## write

Sends a data value for a specific client resource to the One Platform for 
storage and processing.

```
write <alias> <value>
```

* `<alias>` is the client resource identifier.
* `<value>` is the data value to write.

####response

```
ok
```

Response may also be:

* `error: duplicate timestamp`

####examples

To post the value 1043 for resource 1:

```
> write 1 1043
ok
```

## read

Reads up to the last 24 hours of written values for the specified client 
resource.

```
read <alias> [<count>]
```

* `<alias>` is the client resource identifier.
* `<count>` is the maximum number of data points to return, beginning at the
most recent to the least recent. If not specified, it defaults to 1.

####response

Response is a number of data points in CSV format.

```
<timestamp>,<value>
```

* `<timestamp>` is the UNIX timestamp
* `<value>` is the value

####examples

```
> read 1
1267806955,1043
```

## dscreate - create a data source 

Creates a data source having a `<name>` for the `<alias>` to be stored. The 
`<format>` of the data source may be specified. Before storing a reported 
value, the value may be normalized with an `<operation>` one of `add`, `sub`, 
`mul`, `div` or `mod` using the given `<constant>` value. To store data 
values without normalization, specify `na` for `<operation>`.

```
dscreate <name> <alias> [<operation> <constant> <format>]
```

* `<name>` is the friendly name of the data source to create.
* `<alias>` is the resource identifier used when reporting data from the 
client.
* `<operation>` is the preprocessing operation to be performed when data 
is written to the datasource. Defaults to `na`

    `add` : Add `<constant>` to `<value>` and store the result.
    `sub` : Subtract `<constant>` from `<value>` and store the result.
    `mul` : Multiply `<value>` by `<constant>` and store the product.
    `div` : Divide `<value>` by `<constant>` and store the quotient.
    `mod` : Divide `<value>` by `<constant>` and store the remainder.
    `na` : Store `<value>` without normalization.

* `<constant>` is the second operand for `<operation>`, a number to apply to 
`<value>` using the given `<operation>`. It is ignored if `<operation>` is 
`na`.

* `<format>` is the storage format of the data. It defaults to `float` if `op` 
is specified, otherwise defaults to `string`.

    `integer`
    `float`
    `string`

####response

```
ok
```

Response may also be:

* `error: invalid or duplicate data source`
* `error: too many data sources`

####examples

```
> dscreate “office temp” temp div 20
ok
```

```
> dscreate Temperature 1 mul 5 integer
ok
```

## dsdelete - delete data source

Deletes the specified data source and all associated data. Warning: once data 
is deleted, it may not be recovered.

```
dsdelete <alias>
```

* `<alias>` is the resource identifier of the datasource to delete.

####response

```
ok
```

Response may also be:
* `error: invalid data source`


####examples

```
> dsdelete temp
ok
```

## dswrite - write data source

Write data records to the data source identified by `<alias>` and timestamp 
`<timestamp>`.

```
dswrite <alias> <timestamp> <value>
```

* `<alias>` is the resource identifier of the data source to write to.
* `<timestamp>` is the UNIX timestamp to index the data by.
* `<value>` is the data value to write.

####response

```
ok
```

####examples

```
> dswrite temp 1300777704 1067
ok
```

## dsread - read data source

Reads historical data records from the data source identified by `<alias>`.

```
dsread <alias> <count> [<start> [<end>]]
```

* `<alias>` is the resource identifier of the data source to read from.
* `<count>` is the maximum number of data records to return, beginning at the
most recent to the least recent.
* `<start>` and `<end>` are the earliest and latest timestamp for which to
retrieve historical data records.

####response

Response is unix timestamp and data value pairs in CSV format.

```
<timestamp 1>,<value 1>
<timestamp 2>,<value 2>
...
```

####examples

```
> dsread temp 3
1300796584,52.7
1300796577,52.15
1300777704,53.35
```

## dslist - list data sources

Lists all created data sources.

```
dslist [<detail>]
```

* `<detail>` is the detail level of the list to return. Defaults to `name`.
    `name` returns the data source name only.
    `full` returns the data source name, resource, operation, and constant 
    values.

####response

A list of data source information is returned in CSV format.

```
<name 1>,<resourceid 1>,<operation 1>,<constant 1>
<name 2>,<resourceid 2>,<operation 2>,<constant 2>
...
```

####examples

```
> dslist
office temp
office humidity
outside temp
outside humidity
```

```
> dslist full
office temp,1,div,20
office humidity,10,div,100
outside temp,2,div,20
outside humidity,11,div,100
```


## dscount - count data source records

Counts the number of historical data records from the data source identified 
by `<alias>`.

```
dscount <alias> [<start> [<end>]]
```

* `<alias>` is the resource identifier of the data source to count records from.

* `<start>` is the earliest UNIX timestamp for which to start counting 
historical data records. This parameter is optional.

* `<end>` is the latest UNIX timestamp for which to stop counting 
historical data records. This parameter is optional.

####response

The number of historical records that exist in the range specified. If no 
range is given, then all records are counted.

####examples


```
> dscount temp 1300777704 1300796584
3
```

