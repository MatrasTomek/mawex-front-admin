import request from "../../helpers/request";
import { addSpinner, removeSpinner } from "../spinner";
import { timeoutShowTask } from "../task-informations";

export const GET_ALL_BLOG_ITEMS = "GET_ALL_BLOG_ITEMS";
export const ADD_BLOG_ITEM = "ADD_BLOG_ITEM";
export const EDIT_BLOG_ITEM = "EDIT_BLOG_ITEM";
export const DELETE_BLOG_ITEM = "DELETE_BLOG_ITEM";

export const getAllBlogItems = () => async (dispatch) => {
	dispatch(addSpinner());
	const { data, status } = await request.get("/posts");

	if (status === 200) {
		dispatch(removeSpinner());
		dispatch({
			type: GET_ALL_BLOG_ITEMS,
			payload: data.data,
		});
	} else if (status === 404) {
		dispatch(removeSpinner());
		dispatch(timeoutShowTask("Nie ma żadnych elemetów do wyświetlenia"));
	} else {
		dispatch(removeSpinner());
		dispatch(timeoutShowTask(data.message || data.error));
	}
};

export const addMainInfoItem = (mainInfoItemData) => async (dispatch) => {
	dispatch(addSpinner());
	const { data, status } = await request.post("posts/add", mainInfoItemData, {
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		withCredentials: true,
	});

	if (status === 201) {
		dispatch(removeSpinner());
		dispatch({
			type: ADD_BLOG_ITEM,
			payload: data.data,
		});
	} else {
		dispatch(removeSpinner());
		dispatch(timeoutShowTask(data.message || data.error));
	}
};

export const editMainInfoItem = (mainInfoItemData) => async (dispatch) => {
	dispatch(addSpinner());
	const { data, status } = await request.put("/posts", mainInfoItemData, {
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		withCredentials: true,
	});

	if (status === 202) {
		dispatch(removeSpinner());
		dispatch({
			type: EDIT_BLOG_ITEM,
			payload: data.data,
		});
	} else {
		dispatch(removeSpinner());
		dispatch(timeoutShowTask(data.message || data.error));
	}
};

export const deleteMainInfoItem = (id) => async (dispatch) => {
	dispatch(addSpinner());
	const { data, status } = await request.delete(`info-main/${id}`, {
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		withCredentials: true,
	});

	if (status === 200) {
		dispatch(removeSpinner());
		dispatch({
			type: DELETE_BLOG_ITEM,
			payload: id,
		});
	} else {
		dispatch(removeSpinner());
		dispatch(timeoutShowTask(data.message || data.error));
	}
};
