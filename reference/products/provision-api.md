---
title: Murano Provisioning
template: default
---

# Unofficial Murano Provision API

Here is how to call the provision APIs in general. First, get a token for a Murano user:

```
curl -s  -H 'Content-Type: application/json' -X POST 'https://bizapi.hosted.exosite.io/api:1/token/' -d '{"email":"...", "password":"...."}'
```

Next, using the token returned, you can call provision APIs as documented here: http://docs.exosite.com/provision/

The provision endpoints paths should be appended to the bizapi URL `https://bizapi.hosted.exosite.io/api:1/product/<productID>/proxy/`. For example, to list content:

```
curl -s  -H 'Authorization: token 0000000000376925b22a4d9ad40b96185f9c5340' -H 'Content-Type: application/json' -X GET 'https://bizapi.hosted.exosite.io/api:1/product/zxxak388kb3gnwmi/proxy/provision/manage/content/zxxak388kb3gnwmi/'
```

If that call fails with 403, then you need a new token. Token expires after a few hours.
