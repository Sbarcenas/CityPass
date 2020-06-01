export const arrToString = (arr: number[], separator) => {
  let finalText = "";
  arr.map((el, index) =>
    index === 0 ? (finalText += `${el}`) : (finalText += `${separator}${el}`)
  );
  return finalText;
};
