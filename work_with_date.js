// This is a sample workflow for a HubSpot CRM automation.
// This workflow will parse a date field and determine if it is in the past, present, or future.
// It will also determine the number of days since the date.
// It will also determine the start of the current month.
// It will also determine the status of the date.
exports.main = async (event, callback) => {
  /*****
    Use inputs to get data from any action in your workflow and use it in your code instead of having to use the HubSpot API.
  *****/
  const customer_churn_date = event.inputFields["customer_churn_date"]; // from a date property in HubSpot
  const churnDateParsed = new Date(parseInt(customer_churn_date, 10));
  const today = new Date();
  const churnBefore = churnDateParsed < today ? "past date" : "future date";
  const daysSinceChurn = Math.floor(
    (today - churnDateParsed) / (1000 * 60 * 60 * 24)
  );

  // Get current date and start of current month for additional analysis
  const startOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  let churnStatus;
  if (churnDateParsed > today) {
    churnStatus = "future_date";
  } else if (
    churnDateParsed >= startOfCurrentMonth &&
    churnDateParsed <= today
  ) {
    churnStatus = "past_in_current_month";
  } else {
    churnStatus = "before_current_month";
  }

  console.log(`Churn Date: ${customer_churn_date}`);
  console.log(`Churn Date Parsed: ${churnDateParsed}`);
  console.log(`Today: ${today}`);
  console.log(`Churn Before: ${churnBefore}`);
  console.log(`Days since Churn: ${daysSinceChurn}`);
  console.log(`Start of Current Month: ${startOfCurrentMonth}`);
  console.log(`Churn Status: ${churnStatus}`);

  /*****
    Use the callback function to output data that can be used in later actions in your workflow.
  *****/
  callback({
    outputFields: {
      customer_churn_date: customer_churn_date,
      churnDateParsed: churnDateParsed,
      today: today,
      churnBefore: churnBefore,
      daysSinceChurn: daysSinceChurn,
      churn_date_status: churnStatus,
    },
  });
};
