import axios from "axios";

export const setAuthorizationHeader = ({token, isLoggedIn}) => {
    if(isLoggedIn) {
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

export const login = (credentials) => {
    return axios.post("/users/login", credentials);
}

export const signup = (user) => {
    return axios.post("/users/register", user);
}

export const getFreshToken = () => {
    return axios.get("/users/token");
}

export const updateUser = user => {
    return axios.put("/users/updateUser", user);
}

export const updatePassword = password => {
    return axios.put("/users/updatePassword", password);
}