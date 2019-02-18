import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import { auth, setAuthRedirect } from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";
import { checkValidaity } from "../../shared/utility";
class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: true
    };

    componentDidMount(){
        if(!this.props.buildingBurger && this.props.authRedirectPath !== "/"){
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (e, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: e.target.value,
                valid: checkValidaity(e.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        };
        
        this.setState({ controls: updatedControls })
    }

    submitHandler = (e) => {
        e.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);

    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp}
        });
    }

    render() {
        const formElementArray = [];
        for (let key in this.state.controls){
            formElementArray.push({
                id:key,
                config: this.state.controls[key]
            })
        }
        let form  = formElementArray.map(formElement => {
           return  <Input 
                key={formElement.id}
                elementType={formElement.config.elementType} 
                elementConfig={formElement.config.elementConfig} 
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(e) => this.inputChangedHandler(e, formElement.id)}
            />
        });

        if(this.props.loading) {
            form = <Spinner />
        };

        let errorMessage = null;

        if(this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            )
        }
        let authRedirect = null
        if(this.props.isAuthenticated){            
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                {form}
                <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirect
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(setAuthRedirect("/"))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);