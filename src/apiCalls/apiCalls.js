import axios from "axios";

export const setAuthorizationHeader = ({token, isLoggedIn}) => {
    if(isLoggedIn) {
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

export const login = credentials => {
    return axios.post("/users/login", credentials);
}

export const signup = user => {
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

export const getMyInstitution = () => {
    return axios.get("/institutions/myInstitution");
}

export const saveMyInstitution = institution => {
    return axios.post("/institutions/myInstitution", institution);
}

export const updateInstitutionImage = img => {
    return axios.put("/institutions/myInstitution/updateImage", img);
}

export const updateInstitution = institution => {
    return axios.put("/institutions/myInstitution", institution);
}

export const getMyInstitutionLanguages = () => {
    return axios.get("/institutions/myInstitution/languages");
}

export const addInstitutionLanguage = (languageId) => {
    return axios.post("/institutions/myInstitution/languages/" + languageId);
}