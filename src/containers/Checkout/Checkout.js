import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";
import { connect } from "react-redux";
import { purchaseInit } from "../../store/actions/index";

class Checkout extends Component {
    componentWilMount(){
        this.props.onInitPurchase()
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    render(){
        let summary = <Redirect to="/" />        
        const purchasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
        if(this.props.ings) {
            summary = (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary 
                        ingredients={this.props.ings} 
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinued={this.checkoutContinuedHandler}
                    />
                    <Route 
                        path={this.props.match.url + "/contact-data"}
                        component={ContactData} 
                    />
                </div>
            );
        }
        return summary
    }
}

const mapStateToProps = state => {    
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
};

const mapDispatchToProps =  dispatch => {
    return {
        onInitPurchase: () => dispatch(purchaseInit())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);