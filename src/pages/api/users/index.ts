import { NextApiRequest, NextApiResponse } from 'next';
import { usersApiUrl } from '@src/utils';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const route = req.headers['users-route'] as 'login' | 'signup';

    const response = await fetch(`${usersApiUrl}/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    });
    const data = (await response.json()) as { message: string } | { token: string };
    const statusCode = response.status;
    res.status(statusCode).json(data);
};

export default handler;
