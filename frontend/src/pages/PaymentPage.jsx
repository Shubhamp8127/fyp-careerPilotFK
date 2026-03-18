import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
CreditCard,
Smartphone,
Landmark,
User,
ShieldCheck,
Check
} from "lucide-react";

import "../styles/PaymentPage.css";

export default function PaymentPage() {


const navigate = useNavigate();

const location = useLocation();
const { plan, price, billingCycle, currency } = location.state || {};
const total = Number(price);

const [coupon,setCoupon] = useState("");
const [discount,setDiscount] = useState(0);
const [couponMessage,setCouponMessage] = useState("");
const [couponSuccess,setCouponSuccess] = useState(false);

const subtotal = Math.max(total - discount, 0);
const tax = subtotal * 0.05;
const finalPrice = subtotal + tax;

const [method,setMethod] = useState("card");
const [loading,setLoading] = useState(false);
// PaymentPage.jsx ke top me
const symbol = currency === "INR" ? "₹" : "$";
const user = JSON.parse(localStorage.getItem("user"));
const [cardName,setCardName] = useState("");
const [cardNumber,setCardNumber] = useState("");
const [expiry,setExpiry] = useState("");
const [cvv,setCvv] = useState("");

const [upi,setUpi] = useState("");
const [bank,setBank] = useState("");

const formatCardNumber = (value) => {
return value
.replace(/\D/g,"")        // sirf numbers allow
.replace(/(.{4})/g,"$1 ") // 4 digit ke baad space
.trim();
};

const formatExpiry = (value) => {
return value
.replace(/\D/g,"")
.replace(/(\d{2})(\d)/,"$1/$2")
.substring(0,5);
};
const applyCoupon = () => {

if(coupon === "CAREER50"){
setDiscount(total * 0.5);
setCouponMessage("Coupon Applied 🎉 50% Discount");
setCouponSuccess(true);
}

else if(coupon === "CAREER20"){
setDiscount(total * 0.2);
setCouponMessage("Coupon Applied 🎉 20% Discount");
setCouponSuccess(true);
}

else{
setCouponMessage("Invalid Coupon Code");
setCouponSuccess(false);
}

};


const transactionId = "CPAY" + Math.floor(Math.random()*1000000);

/* PLAN DATA */

const planData = {

basic:{
name:"Basic Plan",
features:[
"AI Career Chatbot",
"Basic Career Assessment",
"College Database Access",
"Email Support"
]
},

premium:{
name:"Premium Plan",
features:[
"Everything in Basic",
"AI Roadmap Generator",
"Unlimited Roadmaps",
"Priority Support"
]
},

elite:{
name:"Elite Plan",
features:[
"Everything in Premium",
"ChatGPT + Gemini Pro",
"Brock AI Assistant",
"24/7 Support"
]
}

};

const selectedPlan = planData[plan] || planData.basic;

const handlePayment = () => {

if(method === "card"){
if(!cardName || !cardNumber || !expiry || !cvv){
alert("Please fill card details");
return;
}
}

if(method === "upi"){

const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

if(!upi){
alert("Please enter UPI ID");
return;
}

if(!upiRegex.test(upi)){
alert("Enter valid UPI ID (example@upi)");
return;
}

}

if(method === "bank"){
if(!bank || bank === "Select Bank"){
alert("Please select a bank");
return;
}
}

setLoading(true);

setTimeout(()=>{

const transactionId = "CPAY" + Math.floor(Math.random()*1000000);



navigate("/payment-success",{
state:{
transactionId,
plan:selectedPlan.name,
total:finalPrice.toFixed(2),
originalPrice: total,
discount,
tax,
currency,
billingCycle,
name:user?.name,
email:user?.email
}
});

},2000);

};

return (

<div className="payment-page">

<h1 className="payment-title">
Complete Your Enrollment
</h1>

<div className="payment-grid">

{/* LEFT PAYMENT SECTION */}

<div className="payment-card">

<h3>Payment Method</h3>

<div className="payment-tabs">

<button
className={method==="card"?"active":""}
onClick={()=>setMethod("card")}
>
<CreditCard size={18}/> Card
</button>

<button
className={method==="upi"?"active":""}
onClick={()=>setMethod("upi")}
>
<Smartphone size={18}/> UPI
</button>

<button
className={method==="bank"?"active":""}
onClick={()=>setMethod("bank")}
>
<Landmark size={18}/> Net Banking
</button>

</div>

{/* CARD FORM */}

{method==="card" && (

<div className="form">

<div className="input-box">
<User size={16}/>
<input
type="text"
placeholder="Cardholder Name"
value={cardName}
onChange={(e)=>setCardName(e.target.value)}
/>
</div>

<div className="input-box">
<CreditCard size={16}/>
<input
type="text"
placeholder="Card Number"
value={cardNumber}
maxLength={19}
onChange={(e)=>setCardNumber(formatCardNumber(e.target.value))}
/>
</div>

<div className="row">

<div className="input-box">
<input
type="text"
placeholder="MM/YY"
value={expiry}
onChange={(e)=>setExpiry(formatExpiry(e.target.value))}
/>
</div>

<div className="input-box">
<ShieldCheck size={16}/>
<input
type="password"
placeholder="CVV"
maxLength={3}
value={cvv}
onChange={(e)=>setCvv(e.target.value.replace(/\D/g,""))}
/>
</div>

</div>

</div>

)}

{/* UPI */}

{method==="upi" && (

<div className="form">

<div className="input-box">
<Smartphone size={16}/>
<input
type="text"
placeholder="Enter UPI ID (example@upi)"
value={upi}
onChange={(e)=>setUpi(e.target.value)}
/>
</div>

</div>

)}

{/* NETBANKING */}

{method==="bank" && (

<div className="form">

<div className="input-box">
<Landmark size={16}/>
<select value={bank} onChange={(e)=>setBank(e.target.value)}>
<option value="">Select Bank</option>
<option>State Bank of India</option>
<option>HDFC Bank</option>
<option>ICICI Bank</option>
<option>Axis Bank</option>
</select>
</div>

</div>

)}

<div className="coupon-box">

<input
type="text"
placeholder="Enter Coupon Code"
value={coupon}
onChange={(e)=>setCoupon(e.target.value)}
className="coupon-input"
/>

<button onClick={applyCoupon} className="coupon-btn">
Apply
</button>

</div>

{couponMessage && (
<p className={couponSuccess ? "coupon-success" : "coupon-error"}>
{couponMessage}
</p>
)}


<button
  className="pay-btn"
  onClick={handlePayment}
  disabled={loading}
>
  {loading ? "Processing Payment..." : `Confirm & Pay ${symbol}${finalPrice.toFixed(2)}`}
</button>

</div>

{/* RIGHT PLAN DETAILS */}

<div className="plan-box">

<div className="badge">
Monthly Billing
</div>

<h3>
{selectedPlan.name} Details
</h3>

<ul>

{selectedPlan.features.map((feature,index)=>(

<li key={index}>
<Check size={16}/> {feature}
</li>

))}

</ul>

<div className="price-breakdown">

<div className="price-row">
<span>Plan Price</span>
<span>{symbol}{total.toFixed(2)}</span>
</div>

{discount > 0 && (
<div className="price-row discount">
<span>Coupon Discount</span>
<span>- {symbol}{discount.toFixed(2)}</span>
</div>
)}

{discount > 0 && (
<p className="savings-text">
You saved {symbol}{discount.toFixed(2)} with this coupon 🎉
</p>
)}

<div className="price-row">
<span>Tax (5%)</span>
<span>{symbol}{tax.toFixed(2)}</span>
</div>

<div className="price-divider"></div>

<div className="price-total">
<span>Total</span>
<span>{symbol}{finalPrice.toFixed(2)}</span>
</div>

<span className="billing-text">
/ {billingCycle === "quarterly" ? "3 months" : "month"}
</span>

</div>

</div>

</div>
</div>

);
}
