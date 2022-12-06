import { legacy_createStore as createStore } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "../reducers";

// 使用redux-persit解决了刷新redux数据丢失的问题
import { persistStore, persistReducer } from 'redux-persist';

import storage from 'redux-persist/lib/storage'; //localStorage机制

const storageConfig = {
    key: 'root', // 必须有的
    storage: storage, // 缓存机制
    blacklist: [], // reducer 里不持久化的数据,除此外均为持久化数据
  };
  
const myPersistReducer = persistReducer(storageConfig, rootReducer);


const store = createStore(myPersistReducer,composeWithDevTools());
// 通过createStore创建仓库
// const store=createStore(rootReducer,composeWithDevTools())

export const persistor = persistStore(store);
export default store;
