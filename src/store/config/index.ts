import { configureStore } from '@reduxjs/toolkit';
import queryDataReducer from '@src/store/reducers/queryDataReducer';
import updateTaskReducer from '@src/store/reducers/updateTaskReducer';
export const store = configureStore({
    reducer: {
        queryData: queryDataReducer,
        updateTask: updateTaskReducer
    }
});
