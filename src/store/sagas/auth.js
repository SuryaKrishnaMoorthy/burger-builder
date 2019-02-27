import { put } from "redux-saga";

import * as actionTypes from "./actionTypes";

// * is converting function in to generator

export function* logoutSaga(action) {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('expirationDate');
    yield localStorage.removeItem('userId');
    yield put({
            type: actionTypes.AUTH_INITIATE_LOGOUT
        })
}