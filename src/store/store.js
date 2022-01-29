import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import authReducer from "./authReducer";
import * as apiCalls from "../apiCalls/apiCalls";
import * as authActions from "./authActions";

let localStorageData = localStorage.getItem("user");

let initState = {
    id: 0,
    username: "",
    email: "",
    createdAt: null,
    isTranslator: false,
    isInstitutionOwner: false,
    isAdmin: false,
    isLoggedIn: false,
    token: "",
    expiredAt: null,
}
let persistedState = initState;
let validToken = false;

if (localStorageData) {
    try {
        persistedState = JSON.parse(localStorageData);
        const currentTime = Date.now() / 1000;
        if (persistedState.expiredAt > currentTime) {
            apiCalls.setAuthorizationHeader(persistedState);
            validToken = true;
        } else {
            persistedState = initState;
        }
    } catch (error) {
        console.log("Error parsing stored user");
    }
}

const reactReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const middleware = [thunk];
let store;

if (window.navigator.userAgent.includes("Chrome") && reactReduxDevTools) {
    store = createStore(
        authReducer,
        persistedState,
        compose(
            applyMiddleware(...middleware),
            reactReduxDevTools
        )
    );
} else {
    store = createStore(
        authReducer,
        persistedState,
        compose(applyMiddleware(...middleware))
    );
}

store.subscribe(() => {
    const user = store.getState();
    localStorage.setItem("user", JSON.stringify(user));
    apiCalls.setAuthorizationHeader(user);

    setTimeout(() => {
        if (user.id === store.getState().id) {
            store.dispatch(authActions.getFreshToken());
        }
    }, 600000000);
})

if (validToken) {
    store.dispatch(authActions.getFreshToken());
}

export default store;
