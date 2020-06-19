const initialState = { city_id: 1 };

const user = (state = initialState, { type, user, city_id }) => {
  switch (type) {
    case "UPDATE_USER":
      return {
        ...state,
        ...user
      };
    case "SET_USER_CITY":
      return {
        ...state,
        city_id
      };
    case "LOGOUT":
      return {
        user: {
          city_id: undefined
        }
      };
    case "WIPE":
      console.log("wipe");
      state = {};
      return state;
    default:
      return state;
  }
};

export default user;
