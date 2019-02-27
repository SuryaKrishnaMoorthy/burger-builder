import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};

export const authSuccess = (idToken, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken,
        userId
    }
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    }
};

export const logout = () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('expirationDate');
    // localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

export const authCheckTimeout = expirationDate => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationDate*1000)
    }
}

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email,
            password,
            returnSecureToken: true
        };
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAFCdAxjIvh8EKUt_SiBw5MthwsftIFqgU';
        if(!isSignUp){
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAFCdAxjIvh8EKUt_SiBw5MthwsftIFqgU';
        }
        axios.post(url, authData)
        .then(response => {
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(authCheckTimeout(response.data.expiresIn));
        })
        .catch(error => {
            dispatch(authFail(error.response.data.error));
        })    
    }
};

export const setAuthRedirect = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT,
        path
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout());
        }else {
            const expirationDate = localStorage.getItem('expirationDate');
            if(expirationDate > new Date()) {
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token, userId));
                dispatch(authCheckTimeout((expirationDate.getTime() - new Date().getTime() / 1000)));
            }else {
                dispatch(logout());
            }
        }
    }
}


