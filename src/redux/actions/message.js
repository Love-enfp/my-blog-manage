import { INIT_MESSAGE ,DELETE_MESSAGE} from "../constants";

export const initMessage=(messages)=>({type:INIT_MESSAGE,messages})
export const deleteMessage=(id)=>({type:DELETE_MESSAGE,id})

