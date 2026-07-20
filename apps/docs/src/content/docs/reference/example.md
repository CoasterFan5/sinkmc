---
title: Api Routes
description: Temp reference page before I setup openapi compatability to auto generate docs.
---

```
/v1/session
```
Get details about the current token passed via bearer auth. This endpoint requires auth.

```
/v1/resources
```
Get: Get a list of all resources. (no auth)
Post: Create a new resource (requires auth)

```
/v1/resources/:id|slug
```
Get a resource based on id or slug. Slugs are technically prefered but all ids are prefixed so in practice ids are safe. (no auth)

```
/v1/resources/:id|slug/versions
```
Get a list of versions with artifacts (no auth)

```
/v1/version
```
Post: create a new version, this will be deprecated soon and moved to /v1/resources/:id|slug/version post

```
/v1/resources/:locator/download
```
Download a resource, specify the hash with a query param

## Further reading

- Read [about reference](https://diataxis.fr/reference/) in the Diátaxis framework
