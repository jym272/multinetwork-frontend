import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertDialogState } from '@src/store';

const initialState: { alerts: AlertDialogState[] } = {
    alerts: []
};

const setAlertDialog = createSlice({
    name: 'setAlertDialog',
    initialState,
    reducers: {
        setAlert: (state, action: PayloadAction<{ message: string; key: string }>) => {
            const { message, key } = action.payload;
            const index = state.alerts.findIndex(alert => alert.key === key);
            if (index !== -1) {
                state.alerts[index].trigger = true;
                state.alerts[index].message = message;
                return;
            }
            const newAlert: AlertDialogState = {
                trigger: true,
                message,
                key
            };
            state.alerts.push(newAlert);
        },
        resetAlert: (state, action: PayloadAction<{ key: string }>) => {
            const { key } = action.payload;
            const index = state.alerts.findIndex(alert => alert.key === key);
            if (index === -1) {
                return;
            }
            state.alerts[index].trigger = false;
        },
        deleteAlert: (state, action: PayloadAction<{ key: string }>) => {
            const { key } = action.payload;
            const index = state.alerts.findIndex(alert => alert.key === key);
            if (index === -1) {
                return;
            }
            state.alerts.splice(index, 1);
        }
    }
});

export const { setAlert, resetAlert, deleteAlert } = setAlertDialog.actions;

export default setAlertDialog.reducer;
