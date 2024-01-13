
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";
const fetch = require("node-fetch");
const transactionController = require("../controllers/transaction.controller.js")
const db = require("../models");
const Project = db.projects;
const ProjectReport = db.projects_reports;
const projectReportController = require("../controllers/project_report.controller.js");
const PaymentAccount = db.payment_accounts
const Issue = db.issues;


const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

/**
* Create an order to start the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
*/


const createOrder = async (data) => {
  // use the product information passed from the front-end to calculate the purchase unit details
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: data.currenry_code,
          value: data.product_cost,
          breakdown:
          {
            item_total: {
              currency_code: data.currenry_code,
              value: data.product_cost,
            }
          }
        },
        items: [
          {
            name: data.item_name,
            quantity: 1,
            description: data.description,
            sku: data.sku,
            unit_amount: {
              currency_code: data.currenry_code,
              value: data.product_cost,
            }
          }
        ]
      }
    ],
    payment_source: {
      paypal: {
        email_address: data.email,
        name: {
          given_name: data.first_name,
          surname: data.last_name
        },
        phone:
        {
          phone_type: "HOME",
          phone_number: {
            national_number: data.phone
          }
        }
      }
    }
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
* Capture payment for the created order to complete the transaction.
* @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
*/


const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};


const maxRetries = 100;
const interval = 500;
async function fetchDataWithRetry(url, accessToken) {
  return new Promise((resolve, reject) => {
    function waitingForTransactionComplete() {
      let retries = 0;
      console.log("test promise");

      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        method: "GET"
      }).then(
        data => data.json()
      ).then(response => {
        console.log("test promise response: ", response);
        console.log("test promise status: ", response.status);
        if (response.batch_header.batch_status == 'SUCCESS') {
          // Request is successful, resolve the promise
          resolve(response);
        } else if (retries < maxRetries) {
          // Request is accepted, but not complete yet, retry after the interval
          retries++;
          console.log("reponse retry: ", retries);
          setTimeout(waitingForTransactionComplete, interval);
        } else {
          // Request failed or exceeded max retries, reject the promise
          console.log("reponse status fail");
          reject(new Error(`Failed with status: ${response.status}`));
        }
      })
        .catch(error => {
          // Handle network errors
          reject(error);
        });
    }

    waitingForTransactionComplete();
  });
}
// create a function to mapping the data passed from frontend to generate items that send moneys to multiple receiver
const createItems = (data) => {
  const items = [];
  for (let i = 0; i < data.receivers.length; i++) {
    items.push({
      amount: {
        value: data.costs[i],
        currency: data.currency,
      },
      sender_item_id: data.sender_item_ids[i],
      recipient_wallet: "PAYPAL",
      receiver: data.receivers[i]
    })
  }
  return items;
}


const createPayoutBatch = async (data) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v1/payments/payouts`;
  const payload = {
    sender_batch_header: {
      sender_batch_id: data.batch_id,
      recipient_type: "EMAIL",
      email_subject: data.subject,
      email_message: data.message
    },
  
    items: createItems(data)

  };
  console.log(payload)

  try
  {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    let jsonResponse;
    jsonResponse = await response.json();
    console.log("payout batch: ", jsonResponse);
    const batch_detail_url = url + `/${jsonResponse.batch_header.payout_batch_id}`
    
    try {
      const response = await fetchDataWithRetry(batch_detail_url, accessToken)
      console.log('Data received:', response);
      return {
        jsonResponse: response,
        httpStatusCode: 201,
      };
    }
    catch (error) {
      console.error('Error fetching data:', error.message);
      return {
        jsonResponse: error,
        httpStatusCode: 500,
      };
    };
  }
  catch (error)
  {
    console.error('Error creating bayout batch', error.message);
        return {
          jsonResponse: error,
          httpStatusCode: 500,
        };
  };
}


async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

exports.apiCreatePayoutBatch = async (req, res) => {
  try {
    const data = req.body;
    const { jsonResponse, httpStatusCode } = await createPayoutBatch(data);
    res.status(httpStatusCode).json(jsonResponse);
  }
  catch (error) {
    console.error("Failed to create batch:", error);
    res.status(500).json({ error: "Failed to create batch." });
  }
}


//    app.post("/api/orders", 
exports.apiCreateOrders = async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const data = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(data);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

exports.apiPrePaidCreateProject = async (req, res) => {
  // console.log(req.body)
  // if((req.body.tran_amount == req.body.budget && req.body.status == 2) 
  //     || (req.body.tran_amount == req.body.budget * 30 / 100 && req.body.status == 1))
  {

    const projectId = req.body.id;
    const project = await Project.findByPk(projectId)
      .then(async (project_data) => {
        const project_status = project_data.status;
        if ((req.body.tran_amount == req.body.budget && req.body.status == 2 && project_status == 0)
          || (req.body.tran_amount == req.body.budget * 30 / 100 && req.body.status == 1 && project_status == 0)
          || (req.body.tran_amount == req.body.budget * 70 / 100 && req.body.status == 2 && project_status == 1)
        ) {
          try {
            const { orderID } = req.params;
            // use the cart information passed from the front-end to calculate the order amount detals
            // const data = req.body;
            const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
            // const response = projectController.update(req, res);
            if (httpStatusCode == 201) {
              const response = transactionController.createTransactionAndUpdateProject(req, res)
            }
            else res.status(500).json({ error: "Failed to pay prepaid" });
            // res.status(httpStatusCode).json(jsonResponse);
          } catch (error) {
            console.error("Failed to pay prepaid:", error);
            res.status(500).json({ error: "Failed to pay prepaid" });
          }
        }
        else res.status(400).json({ error: "Bad request, the amount paid dont match with configure of the project." });

      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Project with id=" + id
        });
      });

  }
  // else res.status(400).json({ error: "Bad request, the amount paid dont match with configure of the project." });

};

//   app.post("/api/orders/:orderID/capture",
exports.apiCaptureOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};


exports.apiAcceptProject = async (req, res) => {
  try {
    const reportId = req.body.report_id;
    ProjectReport.findByPk(reportId, { include: [{ model: Project, as: "project", attributes: ['id', 'status'] }] })
      .then(async (projectReport_data) => {
        // console.log(projectReport_data);
        if (projectReport_data.status == 0 && projectReport_data.project.status == 2) {
          PaymentAccount.findOne({ where: { user_id: req.body.receiverIds[0] } })
            .then(async (receiver) => {
              if (receiver) {
                console.log(receiver)
                req.body.receivers = [receiver.account_address];
                const data = req.body;
                const { jsonResponse, httpStatusCode } = await createPayoutBatch(data);
                if (httpStatusCode == 201)
                {
                  req.transactionId = jsonResponse.items[0].transaction_id ; 
                  // projectReportController.accept(req, res);
                  transactionController.createTransactionAndAcceptProject(req, res);

                }
                else res.status(500).json({ error: "Failed to pay prepaid" });
              }
              else {
                res.status(404).json({ error: "User payment account not found." });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Error retrieving user payment account."
              });
            });
        }
        else res.status(400).json({ error: "Bad request, the project is not ready to be accepted or the report is invalid." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Project. Error: " + err
        });
      });

  }
  catch (err) {
    console.error("Failed to accept project:", err);
    res.status(500).json({ error: "Failed to accept project:" + err });
  }
}

// create a api reject project that first check the status of the project, second check the payment account of both owner and member, then call report controller to reject the project to update the status of report to 4

exports.apiRejectProject = async (req, res) => {
  try {
    const reportId = req.body.report_id;
    ProjectReport.findByPk(reportId, { include: [{ model: Project, as: "project", attributes: ['id', 'status'] }] })
      .then(async (projectReport_data) => {
        // console.log(projectReport_data);
        if (projectReport_data.status == 0 && projectReport_data.project.status == 2) {
          // find all payment accounts of member and owner
          console.log(req.body.receiverIds)
          PaymentAccount.findAll({ where: { user_id: req.body.receiverIds } })
            .then(async (receivers) => {
              console.log(receivers);
              if (receivers) {
                console.log(receivers)
                let sorted_receivers = receivers.sort((a, b) => req.body.receiverIds.indexOf(a.user_id) - req.body.receiverIds.indexOf(b.user_id));

                req.body.receivers = [];
                for (let i = 0; i < sorted_receivers.length; i++) {
                  req.body.receivers.push(sorted_receivers[i].account_address);
                }
                const data = req.body;
                const { jsonResponse, httpStatusCode } = await createPayoutBatch(data);
                if (httpStatusCode == 201)
                {
                  // res.status(httpStatusCode).json(jsonResponse);
                  req.transactionIds = [];
                  for (let i = 0; i < jsonResponse.items.length; i++) {
                    req.transactionIds.push(jsonResponse.items[i].transaction_id);
                  }
                  transactionController.createTransactionAndRejectProject(req, res);

                }
                else res.status(500).json({ error: "Failed to pay refound on reject report." });
              }
              else {
                res.status(404).json({ error: "User payment account not found." });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Error retrieving user payment account."
              });
            });
        }
        else res.status(400).json({ error: "Bad request, the project is not ready to be accepted or the report is invalid." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Project with id=" + id
        });
      });

  }
  catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}



exports.apiResolveComplaint = async (req, res) => {
  try {
    const issueId = req.params.issueId;
    Issue.findByPk(issueId,{
      include: [{ model: Project, as: "project", attributes: ['status'] }]
    })
      .then(async (issue_data) => {
        // console.log(projectReport_data);
        if (issue_data.status == 0 && issue_data.project.status != 3 && issue_data.project.status != 5) {
          // find all payment accounts of member and owner
          // console.log(req.body.receiverIds)
          PaymentAccount.findOne({ where: { user_id: issue_data.userId } })
            .then(async (receiver) => {
              if (receiver) {
                
                console.log(receiver)
                if(req.body.accept)
                {
                  req.body.costs = [issue_data.amount];
                  req.body.receiverIds = [issue_data.userId];
                  req.body.receivers = [receiver.account_address];
                  const data = req.body;
                  console.log(data);
                  const { jsonResponse, httpStatusCode } = await createPayoutBatch(data);
                  console.log("test 4");
                  if (httpStatusCode == 201)
                  {
                    // res.status(httpStatusCode).json(jsonResponse);
                    req.transactionIds = [];
                    for (let i = 0; i < jsonResponse.items.length; i++) {
                      req.transactionIds.push(jsonResponse.items[i].transaction_id);
                    }
                    transactionController.createTransactionAndResolveComplaint(req, res);
                  }
                  else res.status(500).json({ error: "Failed to pay refound on reject report." });
  
                }
                else
                {
                  req.body.costs = [issue_data.amount];
                  req.body.receiverIds = [issue_data.uesrId];
                  req.body.receivers = [receiver.account_address];
                }
              }
              else {
                res.status(404).json({ error: "User payment account not found." });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: `Error retrieving user payment account. Error: ${err}`
              });
            });
        }
        else res.status(400).json({ error: "Bad request, the complain is already be solved or the project is out of issue accepted đate." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving issue with error: " + err
        });
      });

  }
  catch (err) {
    // console.error("Failed to create order:", error);
    res.status(500).json({ error: "Error resolving issue: " + err });
  }
}