import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirect: "/"
};

const authStart = (state, action) => updateObject(state, {loading: true, error: null});
const authSuccess = (state,action) => updateObject(state, {userId: action.userId, token: action.idToken, loading: false, error: null});
const authFail = (state, action) => updateObject(state, {loading: false, error: action.error});
const authLogout = (state, action) => updateObject(state, {token: null, userId: null});
const authSetRedirect = (state, action) => updateObject(state, {authRedirect: action.path});

const reducer = (state=initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_AUTH_REDIRECT: return authSetRedirect(state, action);
        default: return state;
    }
}

export default reducer;