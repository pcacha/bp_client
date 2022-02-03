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

export const addInstitutionLanguage = languageId => {
    return axios.post("/institutions/myInstitution/languages/" + languageId);
}

export const addExhibit = exhibit => {
    return axios.post("/exhibits", exhibit);
}

export const getAllExhibitsOfMyInstitution = () => {
    return axios.get("/exhibits/all");
}

export const deleteExhibit = exhibitId => {
    return axios.delete("/exhibits/" + exhibitId);
}

export const getExhibit = exhibitId => {
    return axios.get("/exhibits/" + exhibitId);
}

export const updateExhibitImage = (exhibitId, img) => {
    return axios.put("/exhibits/" + exhibitId + "/updateImage", img);
}

export const updateExhibitInfoLabelImage = (exhibitId, img) => {
    return axios.put("/exhibits/" + exhibitId + "/updateInfoLabel", img);
}

export const updateExhibit = (exhibitId, exhibit) => {
    return axios.put("/exhibits/" + exhibitId, exhibit);
}

export const addInstitutionManager = email => {
    return axios.post("/institutions/myInstitution/addManager", email);
}

export const deleteInstitution = () => {
    return axios.delete("/institutions/myInstitution");
}

export const getAllInstitutions = () => {
    return axios.get("/institutions");
}

export const getExhibitsTranslate = institutionId => {
    return axios.get("/exhibits/translate/" + institutionId);
}

export const getNewTranslation = (exhibitId, languageId) => {
    return axios.get("/translations/new/" + exhibitId + "/" + languageId);
}

export const saveNewTranslation = (exhibitId, languageId, translation) => {
    return axios.post("/translations/new/" + exhibitId + "/" + languageId, translation);
}

export const getRateOverview = (exhibitId, languageId) => {
    return axios.get("/translations/rate/" + exhibitId + "/" + languageId);
}

export const setLike = (translationId, value) => {
    return axios.put("/translations/like/" + translationId, value);
}

export const getExhibitsApproveTranslations = () => {
    return axios.get("/exhibits/approveTranslations");
}

export const setOfficial = (translationId, value) => {
    return axios.put("/translations/official/" + translationId, value);
}

export const getMyTranslationSequences = () => {
    return axios.get("/translations/sequences");
}