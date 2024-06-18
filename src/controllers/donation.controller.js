import Donation from "../models/donation.model.js";

import User from "../models/user.model.js";
import sendEmail from "../utils/sendmail.js";
import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const createDonation = async (req, res)=>{
    const {amount}=req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount:amount*100, //amount in cents
            currency:'usd',
            payment_method_types:['card']

        });

        res.status(201).json({
            clientSecret:paymentIntent.client_secret
        });

    } catch (error) {
        res.status(500).json({message:error.message});
    }
};


const donationWebhook = async (req, res)=>{
    const sig=req.headers['stripe-signature'];
    const payload = req.body;
    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);

    } catch (error) {
        return res.status(400).send(`webhook Error: ${error.message}`);

    }
    if (event.type==='payment_intent.succeeded'){
        const paymentIntent=event.data.object;
        console.log('PaymentIntent details:', paymentIntent);
        const user = await User.findById(req.user._id);
        console.log('Found user:', user);

        if(user){
            const donation = new Donation({
                user:user._id,
                amount:paymentIntent.amount/100, // amount in dollars
                status:'succeeded'
            });

            await donation.save();
            console.log('Saved donation:', donation);

            await sendEmail(user.email, 'Donation Receipt', `Thank you for your donation of $ ${paymentIntent.amount/100}.`);

            setTimeout(()=>{
                //invalid token or session
                //this depends on how you manage user sessions
            }, 10000);
            res.status(200).json({received:true});
        } else {
            res.status(404).json({message:'User not found'});
        }
    } else {
        res.status(400).json({message: 'Event not Handled'});
    }
};

export {createDonation, donationWebhook};
