export const simpleDispatchProps = (dispatch, actions) => {
  return Object.assign({}, ...Object.keys(actions).map(actionName => {
    return {
      [actionName]: (...args) => dispatch(actions[actionName](...args))
    }
  }))
}

export const simpleMapDispatchToProps = (actions) => (dispatch) =>
  simpleDispatchProps(dispatch, actions)