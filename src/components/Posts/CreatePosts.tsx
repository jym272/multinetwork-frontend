import styled from 'styled-components';
import React, { useState } from 'react';
import { PostData } from '@src/types';
import { useDispatch } from 'react-redux';
import { newPost } from '@src/store';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    & input {
        width: 100%;
        margin-bottom: 1rem;
    }
    & button {
        width: 100%;
        margin-bottom: 1rem;
    }
`;

const PostContainer = styled.section`
    display: flex;
    flex-direction: column;
    width: 80%;
    background: #cb5252;
    border: 1px solid black;

    & h1 {
        color: white;
    }
`;

export const CreatePosts = () => {
    const [title, setTitle] = useState<string>('');
    const dispatch = useDispatch();

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (title.trim() === '') {
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        };
        const response = await fetch('/api/newPost', requestOptions);
        const data = (await response.json()) as PostData;
        dispatch(newPost(data));
        setTitle('');
    };

    return (
        <>
            <PostContainer>
                <h3>Create a Post</h3>
                <Form onSubmit={submitHandler}>
                    <label htmlFor="title">Title</label>
                    <input type="text" onChange={e => setTitle(e.target.value)} value={title} />
                    <button type="submit">Submit</button>
                </Form>
            </PostContainer>
        </>
    );
};
