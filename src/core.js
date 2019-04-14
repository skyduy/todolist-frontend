import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import ListGroup from 'react-bootstrap/ListGroup'
import App from './App'

axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';
const server = 'http://127.0.0.1:8000';  // put it in etc/settting


class Task extends Component {
    constructor(props) {
        let data = props["data"];
        super(props);
        this.state = {
            created: data.created,
            completed: data.completed,
            context: data.context,
            priority: data.priority,
            expired: data.expired,
        };
        this.change = this.change.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.handleKeyDown = this.render.bind(this);
    }

    change(key, e) {
        this.setState({
            [key]: e.target.value
        });
    }

    async update() {
        let data = {};
        console.log(data);
        let res = await axios.post(`${server}/todolist`, data);
        console.log(res);
    }

    render() {
        return (
            <ListGroup.Item>
                <div className="input-group">

                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <input type="checkbox"/>
                        </div>
                        <div className="input-group-text">
                            <input maxLength="3"
                                   style={{width: "53px", height: "24px"}}/>
                        </div>
                    </div>
                    <input type="text" className="form-control"
                           defaultValue={this.state.context}
                           aria-label="Text input with dropdown button"/>
                    <button className="btn btn-outline-danger"
                            type="button">删除
                    </button>
                </div>
            </ListGroup.Item>
        );
    }
}
