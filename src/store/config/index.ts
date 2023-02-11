import { configureStore } from '@reduxjs/toolkit';
import setAlertDialogReducer from '@src/store/reducers/setAlertDialogReducer';
import updateTaskReducer from '@src/store/reducers/updateTaskReducer';
export const store = configureStore({
    reducer: {
        setAlertDialog: setAlertDialogReducer,
        updateTask: updateTaskReducer
    }
});
