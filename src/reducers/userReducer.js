const initialState = {
  data: {
    id: null,
    first_name: '',
    last_name: '',
    email: ''
  },
  fetching: false,
  fetched: false,
  error: null
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'USER_FETCH': {
      return { ...state, fetching: true }
    }
    case 'USER_FETCH_REJECTED': {
      return { ...state, fetching: false, error: action.payload }
    }
    case 'USER_FETCH_FULFILLED': {
      return {
        ...state,
        fetching: false,
        fetched: true,
        data: action.payload
      }
    }
    default: {
      return state
    }
  }
}