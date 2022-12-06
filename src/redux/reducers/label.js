import { INIT_LABELS } from "../constants";

// defaultState为默认的articles值
const defaultState= []

const labels=(state=defaultState,action)=>{
    switch (action.type) {
        case INIT_LABELS:
            return action.labels
        default:
                return state;
    }

}

export default labels