import React, { useEffect, useState } from "react";


import axios from "axios";


import { PaymentElement,useStripe,useElements} from "@stripe/react-stripe-js";


import { useNavigate } from "react-router-dom";


function Payment({ clientSecret }) {


    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        const { error, paymentIntent }  = await stripe.confirmPayment({elements,confirmParams: {
                return_url: "http://localhost:5173/success",
            },
            redirect: "if_required"
        });
       console.log(error);
        console.log(paymentIntent);


        if (error) {
        console.log(error);
        alert(error.message);
        } else {
        console.log(paymentIntent.status);


        if (paymentIntent.status === "succeeded") {
            alert("Payment Successful");
             navigate("/success");


           
        } else {
            alert(paymentIntent.status);
        }
        }
    };
   
    return (
        <div
            style={{
                width: "400px",
                margin: "50px auto",
            }}
        >
            <h2>Stripe Demo</h2>


            <form onSubmit={handleSubmit}>


                <PaymentElement/>


                <button
                    style={{
                        marginTop: 20,
                        padding: 10,
                    }}
                >
                    Pay $10
                </button>
            </form>
        </div>
    );
}
export default Payment;
