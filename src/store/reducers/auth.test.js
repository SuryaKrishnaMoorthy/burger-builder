import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import reducer from "./auth";
import * as actionTypes from "../actions/actionTypes";

configure({ adapter: new Adapter() });

describe('auth reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirect: "/"
        })
    });

    it('should store token upon login', () => {
        expect(reducer({
                token: null,
                userId: null,
                error: null,
                loading: false,
                authRedirect: "/"
            }, { 
                type: actionTypes.AUTH_SUCCESS ,
                idToken: "some-token",
                userId: "some-userid"
            })
        ).toEqual({
            token: "some-token",
            userId: "some-userid",
            error: null,
            loading: false,
            authRedirect: "/"
        })
    })
});