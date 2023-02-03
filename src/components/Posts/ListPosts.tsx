import styled from 'styled-components';
import { ListComments, SubmitComment } from '@src/components';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';

const NoPosts = styled.p`
    color: gray;
    font-style: italic;
`;

const PostsContainer = styled.ul`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
`;

const PostContainer = styled.li`
    border: 1px solid #eee;
    padding: 1rem;
    background: #9ee0b7;
    border-radius: 5px;
`;

export const ListPosts = () => {
    const queryData = [...useSelector((state: RootState) => state.queryData.data)];

    return (
        <>
            {queryData.length !== 0 && (
                <PostsContainer>
                    {queryData
                        .sort((a, b) => b.postId - a.postId)
                        .map(queryData => {
                            const { postTitle, postId, comments } = queryData;
                            return (
                                <PostContainer key={postId}>
                                    <h2>{postTitle}</h2>
                                    <ListComments comments={comments} />
                                    <SubmitComment postId={postId} />
                                </PostContainer>
                            );
                        })}
                </PostsContainer>
            )}
            {queryData.length === 0 && <NoPosts>No posts yet</NoPosts>}
        </>
    );
};
