import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertDialogState } from '@src/store';

const initialState: AlertDialogState = {
    trigger: false,
    message: ''
};

const setAlertDialog = createSlice({
    name: 'setAlertDialog',
    initialState,
    reducers: {
        setAlert: (state, action: PayloadAction<{ message: string }>) => {
            const { message } = action.payload;
            state.trigger = true;
            state.message = message;
        },
        resetAlert: state => {
            state.trigger = false;
            state.message = '';
        }
    }
});

export const { setAlert, resetAlert } = setAlertDialog.actions;

export default setAlertDialog.reducer;
