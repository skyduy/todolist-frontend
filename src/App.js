import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';
const server = 'http://127.0.0.1:8000';  // put it in etc/settting


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            age: 0
        };
        this.change = this.change.bind(this);
        this.write = this.write.bind(this);
        this.read = this.read.bind(this);
    }

    change(key, e) {
        this.setState({
            [key]: e.target.value
        });
    }

    async write() {
        let data = {};
        console.log(data);
        let res = await axios.post(`${server}/todolist`, data)
        console.log(res)
    }

    async read() {
        let res = await axios.get(`${server}/todolist/`);
        console.log(res);
    }

    render() {
        // TODO 从这个文件开始学习
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to todolist</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to
                    reload.
                </p>
                <input onChange={(e) => (this.change('name', e))}/>
                <br/>
                <input onChange={(e) => (this.change('age', e))}/>
                <br/>
                <button onClick={this.write}>write</button>
                <button onClick={this.read}>read</button>
            </div>
        );
    }
}

export default App;
