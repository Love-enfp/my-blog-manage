import { INIT_COMMENTS } from "../constants";

// defaultState为默认的articles值
const defaultState= []

const comments=(state=defaultState,action)=>{
    switch (action.type) {
        case INIT_COMMENTS:
            return action.comments
        default:
                return state;
    }

}

export default comments