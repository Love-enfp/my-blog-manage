import { combineReducers } from "redux";

import articles from './articles'
import sorts from './sort'
import labels from './label'
import comments from "./comment";
import bullets from "./bullet";
import messages from "./message";
import login from "./login";
const rootReducer=combineReducers({
    // 此层为最外面一层
    articles,
    sorts,
    labels,
    comments,
    bullets,
    messages,
    login
})


export default rootReducer

