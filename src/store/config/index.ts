import { configureStore } from '@reduxjs/toolkit';
import queryDataReducer from '@src/store/reducers/queryDataReducer';

export const store = configureStore({
    reducer: {
        queryData: queryDataReducer
    }
});
