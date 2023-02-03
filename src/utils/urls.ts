import { getEnvOrFail } from '@src/utils/env';

export const newPostUrl = `http://${getEnvOrFail('POSTS_HOST')}:${getEnvOrFail('POSTS_PORT')}/newpost`;
export const queryPostsUrl = `http://${getEnvOrFail('QUERY_HOST')}:${getEnvOrFail('QUERY_PORT')}/query-posts`;
export const newPostCommentUrl = `http://${getEnvOrFail('COMMENTS_HOST')}:${getEnvOrFail(
    'COMMENTS_PORT'
)}/newpostcomment`;
