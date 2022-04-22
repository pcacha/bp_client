import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import Spinner from "../components/Spinner";
import UserManagerRow from "../components/UserManagerRow";
import handleError from "../shared/failureHandler";
import NoContentMessage from "../components/NoContentMessage";

/**
 * page for managing users
 */
class UserManagerPage extends Component {

    /**
     * current page state
     */
    state = {
        users: [],
        filtered: [],
        pendingApiCall: false,
        search: "",
    };

    /**
     * called when page is mounted
     */
    componentDidMount() {
        this.setState({pendingApiCall: true})
        // fetch users from server
        apiCalls.getUsers().then(response => {
            this.setState({users: response.data, filtered: response.data, pendingApiCall: false});
        }).catch(error => {
            // handle unauthenticated state
            return handleError(error);
        })
    }

    /**
     * Called when user changes value in search field
     * @param event input event
     */
    onSearchChange = (event) => {
        const value = event.target.value;
        if(this.state.search === "") {
            // if search filed is empty show all users
            let filtered = [...this.state.users];
            this.setState({filtered, search: value});
        }
        else {
            // if search field has text filter users
            let filtered = this.state.users.filter(u => u.username.includes(value) || u.email.includes(value));
            this.setState({filtered, search: value});
        }
    }

    /**
     * renders page for user management
     * @returns {JSX.Element}
     */
    render() {
        const {users, pendingApiCall, search, filtered} = this.state;

        // define content
        let content = <Spinner/>;
        if (!pendingApiCall) {
            content = users.length === 0 ?
                <NoContentMessage text="There are no users"/>
                :
                <>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Search user" name="search" value={search} onChange={this.onSearchChange} />
                        <div className="input-group-append">
                                <span className="input-group-text">
                                    <i className="fa fa-search" />
                                </span>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-dark table-striped table-bordered table-hover">
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Registration date</th>
                                <th scope="col">E-mail</th>
                                <th scope="col">Detail</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filtered.map(u => <UserManagerRow {...u} />)}
                            </tbody>
                        </table>
                    </div>
                </>

        }

        // render page
        return (
            <div className="mx-auto mt-5 border rounded p-md-5 p-2 container gray-noise-background mb-3">
                <h2 className="mb-5">User Manager</h2>
                {content}
            </div>
        );
    }
}

export default UserManagerPage;