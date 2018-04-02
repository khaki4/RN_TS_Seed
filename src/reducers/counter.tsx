const PREFIX = "counter/";
export const REQUEST_INCREMENT: string = `${PREFIX}REQUEST_INCREMENT`;
export const INCREMENT: string = `${PREFIX}INCREMENT`;
export const DECREMENT: string = `${PREFIX}DECREMENT`;

// Actions
export const requestIncrement = () => ({ type: REQUEST_INCREMENT });
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });

// Reducers
export interface Counter {
  count: number;
}

export interface AppState {
  counter: Counter;
}
const initialState = {
  count: 0
};
export default (state: Counter = initialState, action): Counter => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + 1
      };
    case DECREMENT:
      return {
        ...state,
        count: state.count - 1
      };
    default:
      return state;
  }
};
