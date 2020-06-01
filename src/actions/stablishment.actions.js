import { benefitHistory, userHistory } from "../feathers";

export const GET_BENEFITS_HISTORY = () => dispatch => {
  dispatch({
    type: "GET_HISTORY"
  });
  return benefitHistory
    .create({})
    .then(res => {
      dispatch({
        type: "IS_LOADED"
      });
      return res;
    })
    .catch(e => {
      dispatch({
        type: "IS_LOADED"
      });
    });
};

export const GET_USERS_HISTORY = () => dispatch => {
  dispatch({
    type: "GET_HISTORY"
  });
  return userHistory
    .create({})
    .then(res => {
      dispatch({
        type: "IS_LOADED"
      });
      return res;
    })
    .catch(e => {
      dispatch({
        type: "IS_LOADED"
      });
    });
};
