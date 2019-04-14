import React, {Component} from 'react';
import './App.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import ListGroup from "react-bootstrap/ListGroup";
import cloneDeep from 'lodash/cloneDeep';
import axios from "axios";
import moment from 'moment'
import './App.css';


axios.defaults.withCredentials = false;
axios.defaults.headers.post['Content-Type'] = 'application/json';
const server = 'http://127.0.0.1:8000';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordering: 0,
            category: 0,

            count: 0,
            url: null,
            next: null,
            previous: null,
            results: [],

            priority: null,
            expired: null,
            context: "",

            dateformat: null,
        };

        this.orderings = [[0, '最近创建'], [1, '最高优先'], [2, '最快截止']];
        this.categories = [[0, 'TODO'], [1, '已完成'], [2, '所有任务']];
        this.showOrder = this.showOrder.bind(this);
        this.showCats = this.showCats.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.updateCat = this.updateCat.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderList = this.renderList.bind(this);
        this.render = this.render.bind(this);

        this.fetchList = this.fetchList.bind(this);
        this.fetchPage = this.fetchPage.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.updateCompleted = this.updateCompleted.bind(this);
        this.updateContext = this.updateContext.bind(this);
        this.updateExpired = this.updateExpired.bind(this);
        this.updatePriority = this.updatePriority.bind(this);
        this.fetchList();

        this.change = this.change.bind(this);
        this.post = this.post.bind(this);
    }

    async fetchList() {
        const orderList = ['-created', '-priority', 'expired'];
        const catList = ['false', 'true', 'true,false'];
        let params = {
            'ordering': orderList[this.state.ordering],
            'completed': catList[this.state.category]
        };
        let response = await axios.get(`${server}/todolist/`,
            {params: params});
        if (response.status === 200) {
            let data = response.data;
            this.setState({
                url: `${server}/todolist/`,
                count: data.count,
                next: data.next,
                previous: data.previous,
                results: data.results,
            })
        }
    }

    fetchPage(url) {
        if (url != null) {
            axios.get(url).then(
                (response) => {
                    let data = response.data;
                    this.setState({
                        url: url,
                        count: data.count,
                        next: data.next,
                        previous: data.previous,
                        results: data.results,
                    })

                }
            ).catch(
                (error) => {
                    let previous = this.state.previous;
                    this.setState({
                        previous: null,
                    });
                    this.fetchPage(previous);
                }
            )
        } else {
            this.fetchList();
        }
    }

    updateOrder(value, e) {
        this.setState({
            ordering: value
        }, this.fetchList);
    }

    showOrder(ele) {
        let className = "btn btn-link";
        if (ele[0] === this.state.ordering) {
            className += " disabled";
        }
        return <li className="nav-item" key={ele[0]}>
            <button className={className}
                    onClick={(e) => this.updateOrder(ele[0], e)}
            >{ele[1]}</button>
        </li>
    }

    updateCat(value, e) {
        this.setState({
            category: value
        }, this.fetchList);
    }

    showCats(ele) {
        let className = "btn btn-link";
        if (ele[0] === this.state.category) {
            className += " disabled";
        }
        return <li className="nav-item" key={ele[0]}>
            <button className={className}
                    onClick={(e) => this.updateCat(ele[0], e)}
            >{ele[1]}</button>
        </li>
    }

    change(key, value) {
        this.setState({
            [key]: value
        });
    }

    post() {
        let data = {
            "priority": this.state.priority,
            "context": this.state.context,
        };
        if (this.state.expired) {
            data["expired"] = this.state.expired + "T23:59";
        }
        axios.post(`${server}/todolist/`, data).then(
            (response) => {
                this.fetchList();
            }
        );
    }

    updateCompleted(data) {
        data["completed"] = 1 - data.completed;
        axios.put(data.url, data).then(
            (response) => {
                this.setState({
                    completed: data["completed"],
                });
                if (this.state.ordering === 2) {
                    this.fetchList();
                }
            }
        );
    }

    updateContext(data) {
        axios.put(data.url, data).then(
            (response) => {
            }
        );
    }

    updateExpired(data) {
        data['expired'] += "T23:59";
        axios.put(data.url, data).then(
            (response) => {
                if (this.state.ordering === 2) {
                    this.fetchList();
                }
            }
        );
    }

    updatePriority(data) {
        if (!data['priority']) data['priority'] = 0;
        axios.put(data.url, data).then(
            (response) => {
                if (this.state.category !== 2) {
                    if (this.state.previous === null) {
                        this.fetchList();
                    } else {
                        let url = this.state.results.length > 1 ?
                            this.state.url : this.state.previous;
                        this.fetchPage(url);
                    }
                }
            }
        );
    }

    deleteItem(url) {
        axios.delete(url).then(
            (response) => {
                let url = this.state.results.length > 1 ?
                    this.state.url : this.state.previous;
                this.fetchPage(url);
            }
        )
    }

    renderItem(data) {
        const raw = cloneDeep(data);
        return (
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text">
                        <input type="checkbox"
                               defaultChecked={data.completed}
                               onChange={(e) => (
                                   this.updateCompleted(data)
                               )}/>
                    </div>
                    <div className="input-group-text">
                        <input maxLength="5"
                               defaultValue={data.priority ? data.priority : ""}
                               style={{width: "53px", height: "24px"}}
                               onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                       this.updatePriority(data);
                                       e.target.blur();
                                   } else if (e.key === 'Escape') {
                                       e.target.value = raw.priority;
                                       e.target.blur();
                                   }
                               }}
                               onChange={(e) => {
                                   data.priority = e.target.value;
                               }}/>
                    </div>
                </div>
                <input maxLength="10"
                       defaultValue={data.expired ? data.expired.slice(0, 10) : ""}
                       onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                               let date = moment(data.expired);
                               if (date.isValid()) {
                                   data.expired = date.format('YYYY-MM-DD');
                                   this.updateExpired(data);
                                   e.target.blur();
                                   this.setState({
                                       dateformat: null,
                                   })
                               } else {
                                   e.target.value = raw.expired ? raw.expired.slice(0, 10) : "";
                                   e.target.blur();
                                   this.setState({
                                       dateformat: "Format: YYYY-MM-DD",
                                   });
                               }
                           } else if (e.key === 'Escape') {
                               e.target.value = raw.expired ? raw.expired.slice(0, 10) : "";
                               e.target.blur();
                           }
                       }}
                       onChange={(e) => {
                           data.expired = e.target.value;
                       }}/>
                <input type="text" className="form-control"
                       defaultValue={data.context}
                       aria-label="Text input with dropdown button"
                       onKeyDown={(e) => {
                           console.log(e.key);
                           if (e.key === 'Enter') {
                               this.updateContext(data);
                               raw.context = data.context;
                               e.target.blur();
                           } else if (e.key === 'Escape') {
                               e.target.value = raw.context;
                               e.target.blur();
                           }
                       }}
                       onChange={(e) => (
                           data.context = e.target.value
                       )}/>
                <button className="btn btn-outline-danger"
                        type="button"
                        onClick={(e) => (
                            this.deleteItem(data.url)
                        )}>删除
                </button>
            </div>
        );
    }

    renderList() {
        return (
            <div className="col-10">
                <div>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <div className="input-group">

                                <div className="input-group-prepend">
                                    <div className="input-group-text">
                                        <input type="checkbox"
                                               disabled={true}/>
                                    </div>
                                    <div className="input-group-text">
                                        <input maxLength="3"
                                               placeholder="优先级"
                                               value={this.state.priority ? this.state.priority : ""}
                                               style={{
                                                   width: "53px",
                                                   height: "24px"
                                               }}
                                               onChange={(e) => (this.change('priority', e.target.value))}/>
                                    </div>
                                </div>

                                <input maxLength="10"
                                       placeholder={this.state.dateformat ? this.state.dateformat : "截止日期（可选）"}
                                       value={this.state.expired ? this.state.expired : ""}
                                       onChange={(e) => (this.change('expired', e.target.value))}/>
                                <input type="text"
                                       className="form-control"
                                       placeholder="任务内容（必填）"
                                       value={this.state.context}
                                       aria-label="Text input with dropdown button"
                                       onChange={(e) => (this.change('context', e.target.value))}/>
                                <button
                                    className="btn btn-outline-success"
                                    type="button"
                                    onClick={(e) => {
                                        let date = moment(this.state.expired);
                                        if (date.isValid()) {
                                            this.post();
                                            this.setState({
                                                priority: null,
                                                expired: null,
                                                context: "",
                                                dateformat: null,
                                            })
                                        } else {
                                            this.setState({
                                                expired: null,
                                                dateformat: "Format: YYYY-MM-DD",
                                            });
                                        }
                                    }}>新增
                                </button>
                            </div>
                        </ListGroup.Item>
                        {this.state.results.map((task) => {
                            return <ListGroup.Item key={task.id}>
                                {this.renderItem(task)}
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </div>
                <div className="text-center">
                    <div className="btn-group" role="group"
                         aria-label="Basic example">
                        <button
                            className={this.state.previous != null ? "btn btn-link" : "btn btn-link disabled"}
                            onClick={(e) => this.fetchPage(this.state.previous)}>上一页
                        </button>
                        <button
                            className={this.state.next != null ? "btn btn-link" : "btn btn-link disabled"}
                            onClick={(e) => this.fetchPage(this.state.next)}>下一页
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                <header className="App-header">
                    <h1 className="App-title">TodoList</h1>
                </header>
                <div className="row">
                    <div className="col-2">
                        <span className="badge badge-primary">类别</span>
                        <ul className="nav flex-column">
                            {this.categories.map((ele) => {
                                return this.showCats(ele);
                            })}
                        </ul>
                        <span className="badge badge-primary">排序</span>
                        <ul className="nav flex-column">
                            {this.orderings.map((ele) => {
                                return this.showOrder(ele);
                            })}
                        </ul>
                    </div>
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

export default App;
