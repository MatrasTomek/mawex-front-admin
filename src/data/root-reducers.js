import { combineReducers } from "redux";
import { sessionStorageReducer } from "./session-storage";
import { userReducer } from "./user";
import { spinnerReducer } from "./spinner";
import { taskReducer } from "./task-informations";

export const rootReducers = combineReducers({
	session: sessionStorageReducer,
	user: userReducer,
	spinner: spinnerReducer,
	tasks: taskReducer,
});