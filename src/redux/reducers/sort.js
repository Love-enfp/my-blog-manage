import { INIT_SORTS } from "../constants";

// defaultState为默认的articles值
const defaultState= []

const sorts=(state=defaultState,action)=>{
    switch (action.type) {
        case INIT_SORTS:
            return action.sorts
        default:
                return state;
    }

}

export default sorts