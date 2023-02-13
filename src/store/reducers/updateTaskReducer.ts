import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskState } from '@src/store';
import { Task } from '@src/types';

const initialState: TaskState = {
    task: {
        id: 0,
        name: '',
        description: '',
        status: '',
        createdAt: '',
        updatedAt: ''
    },
    loaded: false
};

const updateTaskSlice = createSlice({
    name: 'updateTask',
    initialState,
    reducers: {
        loadTask: (state, action: PayloadAction<TaskState>) => {
            const { task, loaded } = action.payload;
            state.task = task;
            state.loaded = loaded;
        },
        downloadTask: (state, action: PayloadAction<Task>) => {
            state.task = action.payload;
            state.loaded = false;
        }
    }
});

export const { downloadTask, loadTask } = updateTaskSlice.actions;

export default updateTaskSlice.reducer;
