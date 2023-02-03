import styled from 'styled-components';
import { CommentData } from '@src/types';

const CommentaryRejectedStyled = styled.p`
    color: red;
    font-style: italic;
`;
const NoComments = styled.p`
    color: gray;
    font-style: italic;
`;

const ListContainer = styled.ul`
    display: flex;
    flex-direction: column;
    grid-gap: 0.7rem;
    width: 100%;
    list-style: none;
    padding: 10px;
`;

const CommentsStyled = styled.li`
    border: 1px solid #eee;
    padding: 0.5rem;
    background: #9ee0b7;
    border-radius: 5px;
`;

export const ListComments = ({ comments }: { comments: CommentData[] }) => {
    return (
        <ListContainer>
            {comments.map(comment => {
                const status = comment.status;
                return (
                    <CommentsStyled key={comment.id}>
                        {status === 'approved' && <p>{comment.text}</p>}
                        {status === 'rejected' && (
                            <CommentaryRejectedStyled>Commentary rejected</CommentaryRejectedStyled>
                        )}
                        {status === 'pending' && <p>Waiting for moderation..</p>}
                    </CommentsStyled>
                );
            })}
            {comments.length === 0 && <NoComments>No comments yet</NoComments>}
        </ListContainer>
    );
};
