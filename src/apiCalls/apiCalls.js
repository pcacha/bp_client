import axios from "axios";

/**
 * Sets authorization jwt
 * @param token jwt
 * @param isLoggedIn whether user is logged in
 */
export const setAuthorizationHeader = ({token, isLoggedIn}) => {
    if(isLoggedIn) {
        axios.defaults.headers.common["Authorization"] = token;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
}

/**
 * Logs user in
 * @param credentials password and username
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const login = credentials => {
    return axios.post("/users/login", credentials);
}

/**
 * Registers new user
 * @param user user info
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const signup = user => {
    return axios.post("/users/register", user);
}

/**
 * Gets fresh jwt
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getFreshToken = () => {
    return axios.get("/users/token");
}

/**
 * Updates user info
 * @param user user info
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateUser = user => {
    return axios.put("/users/updateUser", user);
}

/**
 * Updates users password
 * @param password password
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updatePassword = password => {
    return axios.put("/users/updatePassword", password);
}

/**
 * Gets info of user's institution
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getMyInstitution = () => {
    return axios.get("/institutions/myInstitution");
}

/**
 * Saves new user's institution
 * @param institution institution
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const saveMyInstitution = institution => {
    return axios.post("/institutions/myInstitution", institution);
}

/**
 * Updates institution image
 * @param img image base64 encoded
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateInstitutionImage = img => {
    return axios.put("/institutions/myInstitution/updateImage", img);
}

/**
 * Updates institution info
 * @param institution updated institution
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateInstitution = institution => {
    return axios.put("/institutions/myInstitution", institution);
}

/**
 * Gets all languages of user's institution
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getMyInstitutionLanguages = () => {
    return axios.get("/institutions/myInstitution/languages");
}

/**
 * Adds new language to user's institution
 * @param languageId language id
 * @returns {Promise<AxiosResponse<any>>} reponse
 */
export const addInstitutionLanguage = languageId => {
    return axios.post("/institutions/myInstitution/languages/" + languageId);
}

/**
 * Adds new exhibit to institution
 * @param exhibit new exhibit
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const addExhibit = exhibit => {
    return axios.post("/exhibits", exhibit);
}

/**
 * Gets all exhibits of user's institution
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getAllExhibitsOfMyInstitution = () => {
    return axios.get("/exhibits/all");
}

/**
 * Deletes exhibit from user's institution
 * @param exhibitId exhibit id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const deleteExhibit = exhibitId => {
    return axios.delete("/exhibits/" + exhibitId);
}

/**
 * Gets exhibit based on its id
 * @param exhibitId exhibit id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getExhibit = exhibitId => {
    return axios.get("/exhibits/" + exhibitId);
}

/**
 * Updates exhibit image
 * @param exhibitId exhibit id
 * @param img base64 encoded image
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateExhibitImage = (exhibitId, img) => {
    return axios.put("/exhibits/" + exhibitId + "/updateImage", img);
}

/**
 * Updates exhibit info label
 * @param exhibitId exhibit id
 * @param img base64 encoded info label image
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateExhibitInfoLabelImage = (exhibitId, img) => {
    return axios.put("/exhibits/" + exhibitId + "/updateInfoLabel", img);
}

/**
 * Updates exhibit information
 * @param exhibitId exhibit id
 * @param exhibit updated exhibit
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateExhibit = (exhibitId, exhibit) => {
    return axios.put("/exhibits/" + exhibitId, exhibit);
}

/**
 * Adds manager to institution
 * @param email new manager's email
 * @returns {Promise<AxiosResponse<ny>>} response
 */
export const addInstitutionManager = email => {
    return axios.post("/institutions/myInstitution/addManager", email);
}

/**
 * Deletes institution
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const deleteInstitution = () => {
    return axios.delete("/institutions/myInstitution");
}

/**
 * Gets all registered institutions
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getAllInstitutions = () => {
    return axios.get("/institutions");
}

/**
 * Gets all exhibits and allowed languages of an institution
 * @param institutionId institution id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getExhibitsTranslate = institutionId => {
    return axios.get("/exhibits/translate/" + institutionId);
}

/**
 * Gets info for creating new translation
 * @param exhibitId exhibit id
 * @param languageId language id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getNewTranslation = (exhibitId, languageId) => {
    return axios.get("/translations/new/" + exhibitId + "/" + languageId);
}

/**
 * Saves new translation
 * @param exhibitId exhibit id
 * @param languageId language id
 * @param translation translation id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const saveNewTranslation = (exhibitId, languageId, translation) => {
    return axios.post("/translations/new/" + exhibitId + "/" + languageId, translation);
}

/**
 * Gets translations of given exhibit and language for rating
 * @param exhibitId exhibit id
 * @param languageId language id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getRateOverview = (exhibitId, languageId) => {
    return axios.get("/translations/rate/" + exhibitId + "/" + languageId);
}

/**
 * Sets like/unlike to given translation
 * @param translationId translation id
 * @param value new like value
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const setLike = (translationId, value) => {
    return axios.put("/translations/like/" + translationId, value);
}

/**
 * Gets all exhibits and allowed languages to user's instituion
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getExhibitsApproveTranslations = () => {
    return axios.get("/exhibits/approveTranslations");
}

/**
 * Sets translation official/unofficial
 * @param translationId translation id
 * @param value new official value
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const setOfficial = (translationId, value) => {
    return axios.put("/translations/official/" + translationId, value);
}

/**
 * Gets translator's translation sequences
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getMyTranslationSequences = () => {
    return axios.get("/translations/sequences");
}

/**
 * Deletes translation sequence
 * @param exhibitId exhibit id
 * @param languageId language id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const deleteSequence = (exhibitId, languageId) => {
    return axios.delete("/translations/sequences/" + exhibitId + "/" + languageId);
}

/**
 * Gets translation of translation sequence
 * @param exhibitId exhibit id
 * @param languageId language id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getMyTranslationSequence = (exhibitId, languageId) => {
    return axios.get("/translations/sequence/" + exhibitId + "/" + languageId);
}

/**
 * Rollbacks translation sequence to given translation
 * @param translationId translation id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const rollbackTranslation = translationId => {
    return axios.delete("/translations/sequence/" + translationId);
}

/**
 * Gets all system users
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getUsers = () => {
    return axios.get("/admin/users");
}

/**
 * Gets users details
 * @param userId user id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getUser = userId => {
    return axios.get("/admin/users/" + userId);
}

/**
 * Updates username of user
 * @param userId user id
 * @param username new username
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const adminUpdateUsername = (userId, username) => {
    return axios.put("/admin/users/" + userId + "/updateUsername", username);
}

/**
 * Changes password of given user by sending it to his email
 * @param userId user id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const adminChangePassword = userId => {
    return axios.put("/admin/users/" + userId + "/updatePassword");
}

/**
 * Changes user's rights to translate
 * @param userId user id
 * @param value new rights value
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const adminChangeTranslator = (userId, value) => {
    return axios.put("/admin/users/" + userId + "/updateTranslator", value);
}

/**
 * Changes user's rights to log into the system and perform actions
 * @param userId user id
 * @param value new ban value
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const adminChangeBan = (userId, value) => {
    return axios.put("/admin/users/" + userId + "/updateBan", value);
}

/**
 * Removes institution from user
 * @param userId user ud
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const adminRemoveInstitution = userId => {
    return axios.put("/admin/users/" + userId + "/removeInstitution");
}

/**
 * Gets QR code for given exhibit
 * @param exhibitId exhibit id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getQRCode = exhibitId => {
    return axios.get("/exhibits/" + exhibitId + "/qrcode");
}

/**
 * Gets all buildings of institution
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getBuildings = () => {
    return axios.get("/location/buildings");
}

/**
 * Saves new building
 * @param building new building
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const saveBuilding = building => {
    return axios.post("/location/buildings", building);
}

/**
 * Deletes building
 * @param buildingId building id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const deleteBuilding = buildingId => {
    return axios.delete("/location/buildings/" + buildingId);
}

/**
 * Gets details about building
 * @param buildingId building id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getBuilding = buildingId => {
    return axios.get("/location/buildings/" + buildingId);
}

/**
 * Updates building
 * @param updatedBuilding updated building
 * @param buildingId building id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateBuilding = (updatedBuilding, buildingId) => {
    return axios.put("/location/buildings/" + buildingId, updatedBuilding);
}

/**
 * Deletes room
 * @param roomId room id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const deleteRoom = roomId => {
    return axios.delete("/location/rooms/" + roomId);
}

/**
 * Gets all rooms for given building
 * @param buildingId building id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getRooms = buildingId => {
    return axios.get("/location/rooms/all/" + buildingId);
}

/**
 * Saves new room
 * @param room new room
 * @param buildingId building id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const saveRoom = (room, buildingId) => {
    return axios.post("/location/rooms/" + buildingId, room);
}

/**
 * Gets details about room
 * @param roomId room id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getRoom = roomId => {
    return axios.get("/location/rooms/" + roomId);
}

/**
 * Updates room
 * @param updatedRoom updated room
 * @param roomId room id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateRoom = (updatedRoom, roomId) => {
    return axios.put("/location/rooms/" + roomId, updatedRoom);
}

/**
 * Deletes showcase
 * @param showcaseId showcase id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const deleteShowcase = showcaseId => {
    return axios.delete("/location/showcases/" + showcaseId);
}

/**
 * Gets all showcases for given room
 * @param roomId room id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getShowcases = roomId => {
    return axios.get("/location/showcases/all/" + roomId);
}

/**
 * Saves new showcase
 * @param showcase new showcase
 * @param roomId room id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const saveShowcase = (showcase, roomId) => {
    return axios.post("/location/showcases/" + roomId, showcase);
}

/**
 * Gets details about showcase
 * @param showcaseId showcase id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const getShowcase = showcaseId => {
    return axios.get("/location/showcases/" + showcaseId);
}

/**
 * Updates showcase
 * @param updatedShowcase updated showcase
 * @param showcaseId showcase id
 * @returns {Promise<AxiosResponse<any>>} response
 */
export const updateShowcase = (updatedShowcase, showcaseId) => {
    return axios.put("/location/showcases/" + showcaseId, updatedShowcase);
}