const InitialState = require('./qaInitialState').default;

const {
  GET_QA_REQUEST,
  GET_QA_SUCCESS,
  GET_QA_FAILURE,

  SET_QA_PAGE,
} = require('../../constants').default;

const initialState = new InitialState;

export default function activityReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case GET_QA_REQUEST:
    return state.set('isFetching', true);

  case GET_QA_SUCCESS:
    const { list, total } = action.payload;
    return state.set('isFetching', false).set('list', list).set('total', parseInt(total, 10));

  case GET_QA_FAILURE:
    return state.set('isFetching', false);

  case SET_QA_PAGE:
    return state.set('page', action.payload);
  }

  return state;
}
