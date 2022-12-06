import { INIT_MESSAGE ,DELETE_MESSAGE} from "../constants";

// defaultState为默认的articles值
const defaultState= []

const messages=(state=defaultState,action)=>{
    switch (action.type) {
        case INIT_MESSAGE:
            return action.messages
        case DELETE_MESSAGE:
            const currentIndex=state.findIndex(item=>item===action.id)
            return [
                ...state.slice(0,currentIndex),
                ...state.slice(currentIndex+1)
            ]
        default:
                return state;
    }

}

export default messages