import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import axios from 'axios'
import Payment from './Payment.jsx'


const stripePromise =await loadStripe('pk_test_51UJspUDsnn8vqJzspUpDY6aQ6fe6vTuHhuFnTUoGzZ47P4x6lOOYHIlK8QwqzXAw3cOBs8uOfkhfDvj4YVDLV03v00UNxCqKbq');
// const stripePromise =await loadStripe('pk_test_51U1RbUJvx72XzeCCMoXyaiYAyvVS0RFRhPAaNCSzVtdFMM58gC7oPiqwmVWjAcweTve3Knd31flqTGmONrIdEnNk00vu6Qvc3q');
function App() {
  const [clientSecret, setClientSecret] = useState('');
  const handlePayment = async ()=>{
axios.post("http://localhost:5000/create-payment-intent",{amount:500}).then(async(res)=>{
            console.log(res.data)
            setClientSecret(res.data.clientSecret)
        })
        .catch((err)=>{
          console.log("Something wrong:",err);
        })
  }
  return (
    <div style={{width:"400px",margin:"50px auto"}}>
    {clientSecret==''?
    <button onClick={handlePayment}>Checkout</button>:
    <Elements stripe={stripePromise} options={{clientSecret}}>
      <h1>Stripe</h1>    
        <Payment clientSecret={clientSecret}/>
    </Elements>
  }
    </div>
  )
}
export default App

