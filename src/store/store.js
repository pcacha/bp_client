import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import authReducer from "./authReducer";
import * as apiCalls from "../apiCalls/apiCalls";
import * as authActions from "./authActions";

let localStorageData = localStorage.getItem("user");

// init redux state
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
        // try to parse stored redux state
        persistedState = JSON.parse(localStorageData);
        const currentTime = Date.now() / 1000;
        if (persistedState.expiredAt > currentTime) {
            // if token is not expired use this state
            apiCalls.setAuthorizationHeader(persistedState);
            validToken = true;
        } else {
            // if token is expired reset state to init state
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
    // create store including redux dev tools
    store = createStore(
        authReducer,
        persistedState,
        compose(
            applyMiddleware(...middleware),
            reactReduxDevTools
        )
    );
} else {
    // create store without redux dev tools
    store = createStore(
        authReducer,
        persistedState,
        compose(applyMiddleware(...middleware))
    );
}

// subscribe to every state change
store.subscribe(() => {
    const user = store.getState();
    // save redux state
    localStorage.setItem("user", JSON.stringify(user));
    // set new authorization header
    apiCalls.setAuthorizationHeader(user);

    // get fresh token before current one expire
    setTimeout(() => {
        if (user.id === store.getState().id) {
            store.dispatch(authActions.getFreshToken());
        }
    }, 600000000);
})

// get fresh token
if (validToken) {
    store.dispatch(authActions.getFreshToken());
}

export default store;
