import React, {Component} from "react";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary"
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/WithErrorHandler/WithErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: null
    }

    componentDidMount(){
        axios.get("https://burger-builder-13779.firebaseio.com/ingredients.json")
        .then(response => {
           this.setState({
               ingredients: response.data
           })
        })
        .catch(error =>{
            this.setState({
                error: true
            })
        })
    }

    updatePurchaseState = (ingredients) => {
       const count =  Object.keys(ingredients).reduce((acc, igKey) => {
        return acc + ingredients[igKey]
       }, 0);       
       this.setState({
        purchasable: count > 0
       })
    }

    addIngredientHandler = type => {        
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = { 
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients)
    }

    removeIngredientHandler = type => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) return;
        const updatedCount = oldCount - 1;
        const updatedIngredients = { 
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        })
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    }

    purchaseContinueHandler = () => {
        // alert('Contine...')
        // for firebase use orders and json as suffix.
        // in firebase orders is created
        // this.setState({ loading: true })
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice.toFixed(2),
        //     customer: {
        //         name: "Surya Krishna Moorthy",
        //         address: {
        //             street: "Teststreet",
        //             zipCode: "12345",
        //             country: "USA"
        //         },
        //         email: "test@test.com",
        //     },
        //     deliveryMethod: "fastest"
        // }

        // axios.post("/orders.json", order)
        // .then(response => {
        //     console.log(response);
        //     this.setState({ loading: false, purchasing: false })
        // })
        // .catch(error => {
        //     console.log(error);
        //     this.setState({ loading: false,  purchasing: false })
        // });
        this.props.history.push("/checkout");  
    }

    render(){        
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;

        if(this.state.loading){
            orderSummary = <Spinner />  
        }
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> :<Spinner />

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                        <BuildControls 
                        ingredientAdded={this.addIngredientHandler} 
                        ingredientRemoved={this.removeIngredientHandler} 
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        />
                </Aux>)

            orderSummary = <OrderSummary ingredients={this.state.ingredients} 
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.state.totalPrice} />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);