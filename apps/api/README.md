# Readme
For naming routes, check the routing conventions. 

## Error Handling
Define errors in the schema using the helper function `createErrorSchemaObject` with a constant array of strings. So for instances: 
```ts
createErrorSchemaObject(["BAD_TOKEN", "EXPIRED_TOKEN"] as const)
```

Then, throw the error from the route: 
```ts 
return c.json({
  code: "BAD_TOKEN" as const,
  message: "any string"
})
```

The reason for this additional boiler plate is so that error strings are enums instead of just strings, strictly enforced.
