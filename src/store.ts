// src/store.ts
import { createStore } from 'redux';
import rootReducer from './reducers'; // Assuming you have a root reducer

const store = createStore(rootReducer);

export default store;
