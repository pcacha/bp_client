import React, {Component} from 'react';
import * as apiCalls from "../apiCalls/apiCalls";
import Spinner from "../components/Spinner";
import UserManagerRow from "../components/UserManagerRow";
import handleError from "../shared/failureHandler";

class UserManagerPage extends Component {

    state = {
        users: [],
        filtered: [],
        pendingApiCall: false,
        search: "",
    };

    componentDidMount() {
        this.setState({pendingApiCall: true})
        apiCalls.getUsers().then(response => {
            this.setState({users: response.data, filtered: response.data, pendingApiCall: false});
        }).catch(error => {
            return handleError(error);
        })
    }

    onSearchChange = (event) => {
        const value = event.target.value;
        if(this.state.search === "") {
            let filtered = [...this.state.users];
            this.setState({filtered, search: value});
        }
        else {
            let filtered = this.state.users.filter(u => u.username.includes(value) || u.email.includes(value));
            this.setState({filtered, search: value});
        }
    }

    render() {
        const {users, pendingApiCall, search, filtered} = this.state;

        let content = <Spinner/>;
        if (!pendingApiCall) {
            content = users.length === 0 ?
                <h3>There are no users</h3>
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
                                <th scope="col">Register date</th>
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

        return (
            <div className="mx-auto mt-5 border rounded p-md-5 p-2 container gray-noise-background mb-3">
                <h2 className="mb-5">User Manager</h2>
                {content}
            </div>
        );
    }
}

export default UserManagerPage;