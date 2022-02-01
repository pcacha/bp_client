import * as actions from "./actionsTypes";

const initialState = {
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

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case actions.LOGOUT_SUCCESS:
            return {...initialState};
        case actions.LOGIN_SUCCESS:
            return {
                ...action.payload,
            }
        case actions.SET_USERNAME:
            return {
                ...state,
                username: action.payload,
            }
        case actions.SET_EMAIL:
            return {
                ...state,
                email: action.payload,
            }
        case actions.SET_IS_INSTITUTION_OWNER:
            return {
                ...state,
                isInstitutionOwner: action.payload,
            }
        default:
            return state;
    }
}
