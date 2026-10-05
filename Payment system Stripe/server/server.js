import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
dotenv.config();
const app = express();
app.use(cors());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res) => {


        const signature = req.headers["stripe-signature"];


        let event;


        try {


            event = stripe.webhooks.constructEvent(


                req.body,


                signature,


                process.env.STRIPE_WEBHOOK_SECRET


            );


        } catch (err) {


            console.log(err.message);


            return res.sendStatus(400);


        }


        switch (event.type) {


            case "payment_intent.succeeded":


                const paymentIntent = event.data.object;


                console.log(paymentIntent.id);


                console.log(paymentIntent.amount/100);


                console.log("Payment Successful");


                /**
                 *
                 * Update MongoDB
                 *
                 * Order Status = Paid
                 *
                 * Send Email
                 *
                 */


                break;


            case "payment_intent.payment_failed":


                console.log("Payment Failed");


                break;


            default:


                console.log(event.type);


        }


        res.sendStatus(200);


    }
);

app.use(express.json());

app.post('/create-payment-intent', async(req,res)=>{
    try{
        console.log(req.body);
        const {amount} = req.body;


        const customer = await stripe.customers.create({
            name: "Piyush Nakrani",
            email: "piyush@example.com",
             address: {
                line1: "Yogi Chowk",
                city: "Surat",
                state: "Gujarat",
                postal_code: "395006",
                country: "IN",
            },
        });


        const paymentAmount = await stripe.paymentIntents.create({
            amount:amount*100,
            currency:'inr',
            customer : customer.id,
            description: "Purchase of React Course", // Required for Indian Stripe accounts
            automatic_payment_methods: {
                enabled: true,
            },
        })
        return res.send({
            clientSecret : paymentAmount.client_secret,
        })
    }
    catch(err){
        return res.status(500).send({
            err : err.message
        })
    }
});


 const PORT = process.env.PORT 

 app.listen(PORT,  (err)=>{
    if(err){
        console.log("SomeThing wrong", err);
        
    }
    console.log("Server is running on port", PORT);
    
 } )