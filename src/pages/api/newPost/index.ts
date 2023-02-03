import { NextApiRequest, NextApiResponse } from 'next';
import { newPostUrl } from '@src/utils';
import { PostData } from '@src/types';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await fetch(newPostUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    });
    const data = (await response.json()) as PostData;
    res.status(200).json(data);
};

export default handler;
