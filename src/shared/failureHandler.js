import store from "../store/store";
import * as authActions from "../store/authActions";

/**
 * handles errors that were caused by lack of rights
 * @param error http error
 */
export default function handleError(error) {
    return new Promise((resolve, reject) => {
        const status = error.response.status;
        if (status === 401 || status === 403) {
            // logout when user is not authorized enough
            store.dispatch(authActions.logout());
        }
        reject(error);
    });
}