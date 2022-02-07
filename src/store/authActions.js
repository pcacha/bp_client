import * as apiCalls from "../apiCalls/apiCalls";
import * as actionsTypes from "./actionsTypes";
import jwt_decode from "jwt-decode";

/**
 * logs user in
 * @param credentials login credentials
 */
export const login = (credentials) => {
    return dispatch => {
        return apiCalls.login(credentials).then(response => {
            // when login is successful parse token and log in
            dispatch(loginSuccess(response.data.token));
            return response;
        })
    }
}

/**
 * logs user in based on information encoded in token
 * @param token jwt
 */
const loginSuccess = (token) => {
    // decode jwt
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

    // return user
    return {
        type: actionsTypes.LOGIN_SUCCESS,
        payload: user,
    };
}

/**
 * gets fresh token from server
 */
export const getFreshToken = () => {
    return dispatch => {
        apiCalls.getFreshToken().then(response => {
            // if fresh token acquire si successful set new token to redux
            dispatch(loginSuccess(response.data.token));
        });
    }
}

/**
 * registers new user in the system
 * @param user new user
 */
export const signup = (user) => {
    return dispatch => {
        return apiCalls.signup(user).then(response => {
            const credentials = {
                username: user.username,
                password: user.password
            }
            // logs user in after successful sign up
            return dispatch(login(credentials));
        });
    }
}

/**
 * logs user out
 */
export const logout = () => {
    return {
        type: actionsTypes.LOGOUT_SUCCESS
    }
}

/**
 * set username to redux state
 * @param username username
 */
export const setUsername = (username) => {
    return {
        type: actionsTypes.SET_USERNAME,
        payload: username,
    }
}

/**
 * set email to redux state
 * @param email email
 */
export const setEmail = (email) => {
    return {
        type: actionsTypes.SET_EMAIL,
        payload: email,
    }
}

/**
 * set if user is institution owner to redux state
 * @param value if user is institution owner
 */
export const setIsInstitutionOwner = (value) => {
    return {
        type: actionsTypes.SET_IS_INSTITUTION_OWNER,
        payload: value,
    }
}