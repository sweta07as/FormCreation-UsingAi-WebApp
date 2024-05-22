import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import formReducer from "./reducers/formReducer";

const reducer = combineReducers({
  form: formReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
