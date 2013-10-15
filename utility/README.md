## Utility API procedures

The following procedures are general purpose utilities on the One Platform.

For general information about accessing these procedures, see the [provisioning API](../provision/README.md).

### Table of Contents

[/ip](#ip) - get the server IP

[/jsonp](#jsonp) - get data using token

[/jsonp/register](#jsonpregister) - create data access token

[/timestamp](#timestamp) - get server timestamp

### /ip

#### GET - get server IP

Returns ip address and port of the server, encoded in 6 comma separated octets
as a string, where the first 4 are the ip and the last 2 are the port,
e.g.,  "192,168,0,1,0,80".

```
GET /ip HTTP/1.1
Host: m2.exosite.com
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<server ip and port>
```

### /jsonp

#### GET - get data for token

Returns data for a collection of aliases in timestamp-ascending order, 
starting at `<p>` * `<limit>` offset into `<starttime>` and `<endtime>` 
window, limited to `<limit>` count, as specified by the token, wrapped
as the parameter to the 'callback' function. If `<p>` is not specified, it 
defaults to 0. `<token>` is obtained by the `POST /jsonp/register` API.

```
GET /jsonp?token=<token>&callback=<callback>&show[]=data{&p=<p>} HTTP/1.1
Host: m2.exosite.com
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<callback>({
      "result":{
          "<alias1>":{"data":[[<ts1>,<value1>]...,[<tsN>,<valueN>]]},
          ...
          "<aliasN>":{"data":[[<ts1>,<value1>]...,[<tsN>,<valueN>]]},
      }});
```


### /jsonp/register 

#### POST - get data access token

Returns a token that will be valid until `<expire>` timestamp and can be
used to read lists of timestamp-value pairs from the specified aliases between
`<starttime>` and `<endtime>`, `<limit>` count pairs at a time.

```
POST /provision/register HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Content-Type: application/x-www-form-urlencoded; charset=utf-8

alias[]=<alias1>...&alias[]=<aliasN>&starttime=<starttime>&endtime=<endtime>
&limit=<limit>&access[]=data&expire=<expire>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<token>
```

### /timestamp

#### GET - get server timestamp

Get the current time according to the server.

```
GET /timestamp HTTP/1.1
Host: m2.exosite.com
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<timestamp>
```



