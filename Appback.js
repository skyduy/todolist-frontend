import React, {Component} from 'react';
import './App.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import TaskList from './core.js'


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordering: 0,
            completed: 0,
        };
        this.orderings = [[0, '创建时间'], [1, '优先级'], [2, '即将截止']];
        this.orderings = ['created', 'priority', 'expired'];
        this.categories = [[0, 'TODO'], [1, '已完成'], [2, '所有任务']];
        this.completed = ['false', 'true', 'true,false'];
        this.render = this.render.bind(this);
        this.renderList = this.renderList.bind(this);
        this.showOrder = this.showOrder.bind(this);
        this.showCats = this.showFilter.bind(this);
        this.updateOrder = this.updateOrder.bind(this);
        this.updateCat = this.updateFilter.bind(this);
    }

    renderList(){
        console.log('test');
        return <TaskList data={this.state} />
    }

    updateOrder(value, e) {
        this.setState({
            ordering: value
        });
        // TaskList.setState({
        //     orderings: this.orderings[value]
        // })
    }

    updateFilter(value, e) {
        this.setState({
            completed: value
        });
        // TaskList.setState({
        //     completed: value
        // })
    }

    showOrder(ele) {
        let className = "btn btn-link";
        if (ele[0] === this.state.orderings) {
            className += " disabled";
        }
        return <li className="nav-item" key={ele[0]}>
            <button className={className}
                    onClick={(e) => this.updateOrder(ele[0], e)}
            >{ele[1]}</button>
        </li>
    }

    showFilter(ele) {
        let className = "btn btn-link";
        if (ele[0] === this.state.completed) {
            className += " disabled";
        }
        return <li className="nav-item" key={ele[0]}>
            <button className={className}
                    onClick={(e) => this.updateFilter(ele[0], e)}
            >{ele[1]}</button>
        </li>
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
                            {this.orderings.map((ele) => {
                                return this.showOrder(ele);
                            })}
                        </ul>
                        <span className="badge badge-primary">排序</span>
                        <ul className="nav flex-column">
                            {this.categories.map((ele) => {
                                return this.showFilter(ele);
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
