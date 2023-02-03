import { NextApiRequest, NextApiResponse } from 'next';
import { queryPostsUrl } from '@src/utils';
import { QueryData } from '@src/types';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = await fetch(queryPostsUrl);
    const data = (await response.json()) as QueryData[];
    res.status(200).json(data);
};

export default handler;
