import React from 'react'
import { render } from 'react-dom'
import { Provider } from "react-redux"
import store from './store'
import Root from './Root'
import './assets/styles/main.css'

class Index extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
       <Provider store={store}><Root /></Provider>
    )
  }
}

render(React.createElement(Index), document.getElementById('index'))