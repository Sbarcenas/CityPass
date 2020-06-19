const search = (state = {}, { type, text }) => {
  switch (type) {
    case "UPDATE_SEARCH_TEXT":
      return { text };
    default:
      return state;
  }
};

export default search;
