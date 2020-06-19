import {
  SET_BENEFITS,
  SET_HISTORY_BENEFITS,
  START_LOADING_BENEFITS,
  END_LOADING_BENEFITS
} from "../constants/actionsTypes";

const initialState = {
  benefits: [],
  loading: false,
  historyBenefits: []
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BENEFITS:
      return {
        ...state,
        benefits: action.payload
      };
    case SET_HISTORY_BENEFITS:
      return {
        ...state,
        historyBenefits: action.payload
      };
    case START_LOADING_BENEFITS:
      return {
        ...state,
        loading: true
      };
    case END_LOADING_BENEFITS:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default walletReducer;
