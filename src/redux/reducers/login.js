import { INIT_LOGIN } from "../constants";
import { OUT_LOGIN } from "../constants";
// defaultState为默认的articles值
const defaultState= []

const login=(state=defaultState,action)=>{
    switch (action.type) {
        // 初始化登录
        case INIT_LOGIN:
            return action.userInfo
        case OUT_LOGIN:
            return []
        default:
                return state;
    }

}

export default login