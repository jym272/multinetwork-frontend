import { NextApiRequest, NextApiResponse } from 'next';
import { newPostCommentUrl } from '@src/utils';
import { CommentData } from '@src/types';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const postId = req.query.postId as string;
    const response = await fetch(`${newPostCommentUrl}/${postId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    });
    const data = (await response.json()) as CommentData;
    res.status(200).json(data);
};

export default handler;
