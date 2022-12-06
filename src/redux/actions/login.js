import { INIT_LOGIN } from "../constants";
import { OUT_LOGIN } from "../constants";
export const initLogin=(userInfo)=>({type:INIT_LOGIN,userInfo})

export const outLogin=(userInfo)=>({type:OUT_LOGIN})