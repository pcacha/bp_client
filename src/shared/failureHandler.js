import store from "../store/store";
import * as authActions from "../store/authActions";

export default function handleError(error) {
    return new Promise((resolve, reject) => {
        const status = error.response.status;
        if (status === 401 || status === 403) {
            store.dispatch(authActions.logout());
        }
        reject(error);
    });
}