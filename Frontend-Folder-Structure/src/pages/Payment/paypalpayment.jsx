import React, {useState} from "react";
import { PayPalScriptProvider,  PayPalButtons } from "@paypal/react-paypal-js";
import paymentServices from "@/services/paymentServices";
import { getCurrentDateTime } from "@/helper/helper";


// const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

const PayPalPayment = () => {
    const [paySucess, setPaySuccess] = useState(false);

    const payload = {
      product_cost: "50",
      currenry_code: "USD",
      item_name: "Budget for project Đi đà lạt",
      description: "Initial budget for set up project",
      sku: "ID of project post/ freelancer post go here",
      email: "example@client.email.com",
      first_name: "Nobita",
      last_name: "Nobi",
      phone: "8412345678"
    }

    const payoutPayload = {
      batch_id: getCurrentDateTime(),
      subject: "This is subject of the payout",
      message: "This is message to send",
      cost: "50",
      currency: "USD",
      sender_item_id: "123456789",
      receiver: "sb-3di0w28451063@personal.example.com"
    }

    const createOrder = async (data) => {
        // Order is created on the server and the order id is returned
        // console.log(data)
        try {
          const response = await paymentServices.createOrder(payload);
          console.log(response.data); // Log the response data
          const order = response.data;
          return order.id;
        } catch (error) {
          console.error("Error creating order:", error);
          throw error;
        }
      };


      const onApprove = async (data) => {
        try {
          const response = await paymentServices.onAprrove(data)
          console.log("Payment successful", response); // Log the response data
          setPaySuccess(true);
          return response.data;
        } catch (error) {
          setPaySuccess(false);
          console.error("Error capturing PayPal order:", error);
          throw error;
        }
      };


      const createPayoutBacth = async () => {
        try {
          const response = await paymentServices.createPayoutBatch(payoutPayload)
          setPaySuccess(true)
          console.log(response)
        }
        catch (error){
          setPaySuccess(false);
          console.error("Error ceate payout order:", error);
          throw error;
        }
      }


      return (
        <div >
          <div hidden={paySucess ? true : false}>
          <h2>Item name: {payload.item_name}</h2>
            <h2>Description: {payload.description}</h2>
            <h2>Total cost: {payload.product_cost}</h2>
            <h2>Payer: {payload.first_name} {payload.last_name}</h2>
            <h2>email: {payload.email} </h2>
            <h2>SKU: {payload.sku}</h2>
            <PayPalButtons
          createOrder={(data, actions) => createOrder(data, actions)}
          onApprove={(data, actions) => onApprove(data, actions)}
              />  
          </div>

          <button onClick={createPayoutBacth}>
            Click to create Payout
          </button>

          <div hidden={paySucess ? false : true}>Payment success!</div>
          
        </div>

        
      );
};

export default PayPalPayment;