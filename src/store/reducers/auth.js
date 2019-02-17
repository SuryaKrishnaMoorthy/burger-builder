import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
};

const authStart = (state, action) => updateObject(state, {loading: true, error: null});
const authSuccess = (state,action) => updateObject(state, {userId: action.userId, token: action.idToken, loading: false, error: null});
const authFail = (state, action) => updateObject(state, {loading: false, error: action.error});
const authLogout = (state, action) => updateObject(state, {token: null, userId: null})
const reducer = (state=initialState, action) => {
    switch(action.type){
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        default: return state;
    }
}

export default reducer;