import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommentData, PostData, QueryData } from '@src/types';
import { QueryDataState } from '@src/store';

const initialState: QueryDataState = {
    data: []
};

export const queryDataSlice = createSlice({
    name: 'queryData',
    initialState,
    reducers: {
        updateData: (state, action: PayloadAction<QueryData[]>) => {
            state.data = action.payload;
        },
        newPost: (state, action: PayloadAction<PostData>) => {
            const newData = [...state.data];
            newData.push({
                id: 0, // the correct value of id is returned from the microservice in the refetching
                postId: action.payload.id,
                postTitle: action.payload.title,
                comments: []
            });
            state.data = newData;
        },
        newComment: (state, action: PayloadAction<CommentData>) => {
            const newData = [...state.data];
            const postIndex = newData.findIndex(item => item.postId === action.payload.postId);
            if (postIndex !== -1) {
                newData[postIndex].comments.push(action.payload);
            }
            state.data = newData;
        }
    }
});

export const { updateData, newPost, newComment } = queryDataSlice.actions;

export default queryDataSlice.reducer;
