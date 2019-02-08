import React, { Component } from "react";
import CheckoutSummary from "../../components/UI/Order/CheckoutSummary/CheckoutSummary";

class Checkout extends Component {
    state={
        ingredients: {
            salad:1,
            cheese: 1,
            bacon: 1,
            meat: 1
        }
    }
    render(){
        return (
             <div>
                <CheckoutSummary ingredients={this.state.ingredients} clicked/>
             </div>
        )
    }
}

export default Checkout;