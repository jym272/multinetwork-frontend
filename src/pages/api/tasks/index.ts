import { NextApiRequest, NextApiResponse } from 'next';
import { tasksApiUrl } from '@src/utils';
import { Task } from '@src/components';

type TasksRoute = 'new-task' | 'update-task' | 'delete-task' | 'get-all';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const route = req.headers['tasks-route'] as TasksRoute;
    const taskId = (req.headers['task-id'] as string | undefined) ?? '';

    const init = {
        method: '',
        headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization!
        }
    };
    switch (route) {
        case 'get-all':
            init.method = 'GET';
            break;
        case 'delete-task':
            init.method = 'DELETE';
            break;
        case 'new-task':
            init.method = 'POST';
            Object.assign(init, { body: JSON.stringify(req.body) });
            break;
        case 'update-task':
            init.method = 'PUT';
            Object.assign(init, { body: JSON.stringify(req.body) });
            break;
        default:
            break;
    }
    const response = await fetch(`${tasksApiUrl}/${route}/${taskId}`, init);
    const data = (await response.json()) as Task | { message: string };
    const statusCode = response.status;
    res.status(statusCode).json(data);
};

export default handler;
