import React, {Component} from 'react'
import {Table, Checkbox, Button} from 'semantic-ui-react'
import TodoItem from './TodoItem'
import styled from 'styled-components'

const NewTodo = styled.input`
    width: 100%;
    height: 50px;
    padding: 15px;
    border-radius: 10px;
    border-color: #7fe0fd;
    font-size: 1.5em;
`;

const headers = {
  'Content-Type': 'application/json'
}

class TodoApp extends Component {
  state = {
    todos : [  ],
    newTodo: ''
  }

  componentDidMount() {
      this.fetchTodos()
    }

  fetchTodos = () => {
    fetch('/todos')
      .then(data => data.json())
      .then(todos => this.setState({todos}))
      .catch(err => console.log({err}))
  }

  Click(todo, index) {
    const {id, completed} = todo
    fetch(`/todos/${id}`,{
      method: 'PATCH',
      headers,
      body: JSON.stringify({completed: !completed})
    }).then(this.fetchTodos)
  }

  handleToggleAll = (allToggled) => {
    const {todos} = this.state
    Promise.all(todos.map(todo =>
      fetch(`/todos/${todo.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({completed: !allToggled})
        })
      )
    ).then(this.fetchTodos)
  }

  handleClearCompleted = () => {
    const {todos} = this.state
    const completedTodos = todos.filter(
      todo => todo.completed
    )

    Promise.all(completedTodos.map(todo =>
      fetch(`/todos/${todo.id}`, {
        method: 'DELETE',
        headers,
      })
    )).then(this.fetchTodos)
  }

  handleInputChange = event => {
    const value=event.target.value
    this.setState({newTodo: value})
  }

  handleNewTodoKeyDown = event => {
    if (this.state.todos.length >= 10) {
      return //Only allows for 10 inputs
    }

    if (event.keyCode!==13) {
      return //Only add when eneter key is hit
    }

    event.preventDefault()

    const {newTodo} = this.state
    var value = newTodo.trim()
    if (value) {
      fetch('/todos',{
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: value,
          completed: false
          })
        })
          .then(this.fetchTodos)
          .then(() => this.setState({newTodo:''}))
      }
    }

  handleDelete = id =>{
    fetch(`/todos/${id}`, {
      method: 'DELETE',
      headers,
    }).then(this.fetchTodos)
  }

  render() {
    const {todos} = this.state
    const allToggled = todos.every(todo => todo.completed)
    return (
        <div className='todo-container'>
          <NewTodo
            id='new-todo'
            placeholder='Start a new task?'
            autoFocus
            onChange={this.handleInputChange}
            onKeyDown={this.handleNewTodoKeyDown}
            value = {this.state.newTodo}
          />
          <label
            htmlFor='new-todo'
            style={{display: 'none'}}
          >
            New Todo
          </label>
          {todos.length===0 ? (
            <Table color='teal'>
              <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                      Nothing todo!
                    </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
          ) : <Table color='teal' unstackable={true} celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign='center'>
                  <Checkbox
                    checked = {allToggled}
                    onChange={()=>this.handleToggleAll(allToggled)}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Toggle All
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {this.state.todos.map((todo, i) => (
              <TodoItem
                key = {i}
                todo={todo}
                handleToggle={() => this.Click(todo, i)}
                handleDelete={() => this.handleDelete(todo.id)}
              />
              ))}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='2'>
                  <Button
                    size='small'
                    onClick={this.handleClearCompleted}
                  >
                    Clear completed
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        }
        </div>
    )
  }
}

export default TodoApp;
