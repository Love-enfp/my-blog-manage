import { INIT_BULLET } from "../constants";
// defaultState为默认的articles值
const defaultState= []

const bullets=(state=defaultState,action)=>{
    switch (action.type) {
        case INIT_BULLET:
            return action.bullets
        default:
                return state;
    }

}

export default bullets