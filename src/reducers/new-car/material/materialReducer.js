const InitialState = require('./materialInitialState').default;

const {
  GET_NEWCAR_MATERIAL_REQUEST,
  GET_NEWCAR_MATERIAL_SUCCESS,
  GET_NEWCAR_MATERIAL_FAILURE,

  SET_NEWCAR_MATERIAL_PAGE,
} = require('../../constants').default;

const initialState = new InitialState;

export default function activityReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case GET_NEWCAR_MATERIAL_REQUEST:
    return state.set('isFetching', true);

  case GET_NEWCAR_MATERIAL_SUCCESS:
    const { list, total } = action.payload;
    return state.set('isFetching', false).set('list', list).set('total', parseInt(total, 10));

  case GET_NEWCAR_MATERIAL_FAILURE:
    return state.set('isFetching', false);
  case SET_NEWCAR_MATERIAL_PAGE:
    return state.set('page', action.payload);
  }

  return state;
}
