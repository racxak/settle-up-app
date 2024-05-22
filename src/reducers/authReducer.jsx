const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, token: action.payload.token, userId: action.payload.userId };
    case LOGOUT:
      return { ...state, token: null, userId: null };
    default:
      return state;
  }
};

const initialState = {
  token: null,
  userId: null,
};

export { authReducer, initialState, LOGIN, LOGOUT };
