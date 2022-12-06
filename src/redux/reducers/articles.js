import { INIT_ARTICLES } from "../constants";

// defaultState为默认的articles值
const defaultState= []

const articles=(state=defaultState,action)=>{
    switch (action.type) {
        case INIT_ARTICLES:
            return action.articles
        default:
                return state;
    }

}

export default articles