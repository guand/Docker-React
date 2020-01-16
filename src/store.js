import { applyMiddleware, createStore, compose } from "redux"

import { createLogger } from "redux-logger"
import promise from "redux-promise-middleware"
import thunk from "redux-thunk"
import reducer from "./reducers"
const middleware = process.env.NODE_ENV === 'DEVELOPMENT' ? applyMiddleware(promise(), thunk, createLogger()) : applyMiddleware(promise(), thunk)

let store = createStore(reducer, middleware)

if(process.env['REDUX'] === "ON") {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  store = createStore(reducer, composeEnhancers(middleware))
}

export default store