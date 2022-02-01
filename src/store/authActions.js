import * as apiCalls from "../apiCalls/apiCalls";
import * as actionsTypes from "./actionsTypes";
import jwt_decode from "jwt-decode";

export const login = (credentials) => {
    return dispatch => {
        return apiCalls.login(credentials).then(response => {
            dispatch(loginSuccess(response.data.token));
            return response;
        })
    }
}

const loginSuccess = (token) => {
    const decodedToken = jwt_decode(token);

    const user = {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email,
        createdAt: decodedToken.createdAt,
        isTranslator: decodedToken.isTranslator,
        isInstitutionOwner: decodedToken.isInstitutionOwner,
        isAdmin: decodedToken.isAdmin,
        isLoggedIn: true,
        token: token,
        expiredAt: decodedToken.exp,
    }

    return {
        type: actionsTypes.LOGIN_SUCCESS,
        payload: user,
    };
}

export const getFreshToken = () => {
    return dispatch => {
        apiCalls.getFreshToken().then(response => {
            dispatch(loginSuccess(response.data.token));
        });
    }
}

export const signup = (user) => {
    return dispatch => {
        return apiCalls.signup(user).then(response => {
            const credentials = {
                username: user.username,
                password: user.password
            }
            return dispatch(login(credentials));
        });
    }
}

export const logout = () => {
    return {
        type: actionsTypes.LOGOUT_SUCCESS
    }
}

export const setUsername = (username) => {
    return {
        type: actionsTypes.SET_USERNAME,
        payload: username,
    }
}

export const setEmail = (email) => {
    return {
        type: actionsTypes.SET_EMAIL,
        payload: email,
    }
}

export const setIsInstitutionOwner = (value) => {
    return {
        type: actionsTypes.SET_IS_INSTITUTION_OWNER,
        payload: value,
    }
}