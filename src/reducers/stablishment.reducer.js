const INITIAL_STATE = {
  isLoading: false
};

export default function(state = INITIAL_STATE, payload) {
  switch (payload.type) {
    case "GET_HISTORY":
      return { ...state, isLoading: true };
    case "IS_LOADED":
      return { ...state, isLoading: false };
    default:
      return state;
  }
}
