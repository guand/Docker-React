import axios from 'axios'

export function fetchUser(email) {
  return function(dispatch) {
    dispatch({ type: 'USER_FETCH' })
    return axios
      .get(`http://local.test-app.com:3000/user/${email}`)
      .then((response) => {
        dispatch({ type: 'USER_FETCH_FULFILLED', payload: response.data })
      })
      .catch((error) => {
        dispatch({ type: 'USER_FETCH_REJECTED', payload: error })
      })
  }
}