import { store } from '@src/store';
import { QueryData } from '@src/types';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface QueryDataState {
    data: QueryData[];
}
