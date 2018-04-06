// Actions
const PREFIX = "counter/";
export const REQUEST_INCREMENT: string = `${PREFIX}REQUEST_INCREMENT`;
export const INCREMENT: string = `${PREFIX}INCREMENT`;
export const DECREMENT: string = `${PREFIX}DECREMENT`;
export const GO_BACK: string = `${PREFIX}GO_BACK`;
export const GO_DETAIL: string = `${PREFIX}GO_DETAIL`;
export const GO_HOME: string = `${PREFIX}GO_HOME`;
export const GO_LOGIN: string = `${PREFIX}GO_LOGIN`;
export const GO_SELECT_COUNTRY: string = `${PREFIX}GO_SELECT_COUNTRY`;

// Action Creators
export const requestIncrement = () => ({ type: REQUEST_INCREMENT });
export const increment = () => ({ type: INCREMENT });
export const decrement = () => ({ type: DECREMENT });
export const goBack = payload => ({ type: GO_BACK });
export const goDetail = () => ({ type: GO_DETAIL });
export const goHome = () => ({ type: GO_HOME });
export const goLogin = () => ({ type: GO_LOGIN });
export const goSelectCountry = payload => ({
  type: GO_SELECT_COUNTRY,
  params: payload
});
