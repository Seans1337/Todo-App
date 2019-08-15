import React, {Component} from 'react'
import styled from 'styled-components'
import TodoApp from './components/TodoApp'
import './App.css'

const AppBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px 1fr;
  grid-template-rows: 1fr auto 1fr;
  height: 100vh;
`;


class App extends Component {
    render() {
    return (
      <AppBody>
        <TodoApp />
      </AppBody>
    )
  }
}

export default App;
