import styled from 'styled-components';
import React from 'react';
import { CommentData } from '@src/types';
import { useDispatch } from 'react-redux';
import { AppDispatch, newComment } from '@src/store';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100px;
    padding: 10px;
    box-sizing: border-box;

    textarea {
        flex: 1;
        height: 100%;
        width: 100%;
        resize: none;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        font-size: 1em;
    }

    button {
        width: 100px;
        height: 30px;
        border: none;
        border-radius: 5px;
        background-color: #ccc;
        color: #fff;
        font-size: 1em;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        &:hover {
            background-color: #000;
        }
    }
`;

export const SubmitComment = ({ postId }: { postId: number }) => {
    const dispatch: AppDispatch = useDispatch();
    const [commentText, setCommentText] = React.useState<string>('');

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (commentText.length === 0) return;
        const response = await fetch(`/api/newPostComment/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: commentText
            })
        });
        const data = (await response.json()) as CommentData;
        dispatch(newComment(data));
        setCommentText('');
    };

    return (
        <Form onSubmit={submitHandler}>
            <textarea placeholder="Comment" value={commentText} onChange={e => setCommentText(e.target.value)} />
            <button>Submit</button>
        </Form>
    );
};
