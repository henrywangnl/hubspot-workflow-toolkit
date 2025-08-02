# Resources

[HubSpot API Endpoints](https://developers.hubspot.com/docs/reference/api)
From here you can find all relevant API endpoints within HubSpot.

# Authentication

All API calls use the HubSpot API client with an access token:

```javascript
const hubspotClient = new hubspot.Client({
  accessToken: process.env.customCodeToken,
});
```

# CRM Search

## Standard objects

Each standard object has similar way for searches.
For example, [search for companies](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fsearch)

```javascript
const searchResponse = await hubspotClient.crm.companies.searchApi.doSearch({
  filterGroups: [
    {
      filters: [
        {
          propertyName: "name",
          operator: "EQ",
          value: "HubSpot",
        },
      ],
    },
  ],
  properties: ["hubspot_owner_id", "name"],
  limit: 1, // Limit to just 1 matching company
});
```

## Custom objects

You need to specify the correct object type, as shown [here](https://developers.hubspot.com/docs/reference/api/crm/objects/objects#post-%2Fcrm%2Fv3%2Fobjects%2F%7Bobjecttype%7D%2Fsearch)

```javascript
const searchResponse = await hubspotClient.crm.objects.searchApi.doSearch(
  "2-123456789", // custom object type
  {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "name",
            operator: "EQ",
            value: "HubSpot",
          },
        ],
      },
    ],
    properties: ["hubspot_owner_id", "name"],
    limit: 1, // Limit to just 1 matching result
  }
);
```

# Get/Update Object By ID

## Standard Objects

```javascript
const apiResponse = await hubspotClient.crm.deals.basicApi.getById(
  dealId,
  undefined, // properties returned
  ["amount"], // propertiesWithHistory
  undefined, // associations
  false, // archived
  undefined // undefined
);
```

```javascript
// Update the new datetime property
await hubspotClient.crm.deals.basicApi.update(dealId, {
  properties: {
    first_activity_datetime: timestamp.toISOString(),
  },
});
```

## Custom Objects

[Read a custom object by id](https://developers.hubspot.com/docs/reference/api/crm/objects/objects#get-%2Fcrm%2Fv3%2Fobjects%2F%7Bobjecttype%7D%2F%7Bobjectid%7D)

```javascript
const petResponse = await hubspotClient.crm.objects.basicApi.getById(
  "2-123456789", // custom object type
  "123456789", // custom object id
  undefined, // properties returned
  ["amount"], // propertiesWithHistory
  undefined, // associations
  false, // archived
  undefined // undefined
);
```

# Fetch Associations

[Association API Endpoints](https://developers.hubspot.com/docs/reference/api/crm/associations/association-details)

For example, fetch associated deals with a specific company:

```javascript
const associationsResp =
  await hubspotClient.crm.associations.v4.basicApi.getPage(
    "companies", // from object type
    "123456789", // from object id
    "deals" // to object type
  );
```

# Update Properties

# Get Property Hisotry Values

# Working with dates

# Call External APIs

# Best Practices

## Rate Limits

## Test API Calls via API Documents

HubSpot API reference site provides a way to test api calls so it's useful to build a request and check the response schema upfront.

## Review Workflow Issues

After turning on workflows, always come check their performance later on.
