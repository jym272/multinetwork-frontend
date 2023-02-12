import { store } from '@src/store';
import { Task } from '@src/components';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface AlertDialogState {
    trigger: boolean;
    message: string;
    key: string;
}

export interface TaskState {
    task: Task;
    loaded: boolean;
}
