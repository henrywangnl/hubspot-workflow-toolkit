// This script checks for open deals associated with a company
// It returns the most recent open deal and whether it's less than 7 days old

const hubspot = require("@hubspot/api-client");

const PIPELINES = ["default", "123456789", "234567890"]; // internal pipeline ids

// Properties to fetch from deals
const DEAL_PROPERTIES = ["pipeline", "closedate", "hs_is_closed", "createdate"];

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.customCodeToken,
  });

  const dealId = event.object.objectId;
  const companyId = event.inputFields["primary_company_id"];

  // Return early if no company ID
  if (!companyId) {
    return callback({
      outputFields: {
        error: "No company ID found in input fields",
        inputFields: JSON.stringify(event.inputFields),
      },
    });
  }

  try {
    // Using Basic API to get associations
    const associationsResp =
      await hubspotClient.crm.associations.v4.basicApi.getPage(
        "companies", // from object type
        companyId, // from object id
        "deals" // to object type
      );

    // Extract deal IDs (excluding current deal)
    const dealIds = (associationsResp.results || [])
      .map((result) => result.toObjectId)
      .filter((id) => id !== dealId);

    let output = {};

    // --- New logic for open deals ---
    let mostRecentOpenDeal = null;
    let openDealLessThan7Days = false;
    let mostRecentOpenDealId = null;

    if (dealIds.length > 0) {
      // Get deal details
      const dealsResp = await hubspotClient.crm.deals.batchApi.read({
        inputs: dealIds.map((id) => ({ id: String(id) })),
        properties: DEAL_PROPERTIES,
      });

      // Filter by pipelines and sort by createdate
      const relevantDeals = dealsResp.results
        .filter((d) => PIPELINES.includes(d.properties.pipeline))
        .sort((a, b) => {
          const dateA = new Date(a.properties.createdate);
          const dateB = new Date(b.properties.createdate);
          return dateB - dateA;
        });

      // --- Find most recent open deal ---
      const openDeals = relevantDeals.filter(
        (d) => d.properties.hs_is_closed !== "true"
      );
      if (openDeals.length > 0) {
        mostRecentOpenDeal = openDeals[0];
        mostRecentOpenDealId = mostRecentOpenDeal.id;
        // Check if open less than 7 days
        if (mostRecentOpenDeal.properties.createdate) {
          const createdDate = new Date(
            mostRecentOpenDeal.properties.createdate
          );
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          openDealLessThan7Days = createdDate >= sevenDaysAgo;
        }
      }
      output.most_recent_open_deal_id = mostRecentOpenDealId;
      output.most_recent_open_deal_less_than_7_days = openDealLessThan7Days;
      output.has_other_open_deals = openDeals.length > 0;
      // --- End new logic ---
    }

    callback({ outputFields: output });
  } catch (e) {
    console.error("Error details:", e);
    callback({
      outputFields: {
        error:
          e.message === "HTTP request failed"
            ? JSON.stringify(e.response, null, 2)
            : String(e),
      },
    });
  }
};
