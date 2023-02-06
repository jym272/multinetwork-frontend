import { getEnvOrFail } from '@src/utils/env';

export const usersApiUrl = `http://${getEnvOrFail('USERS_API_HOST')}:${getEnvOrFail('USERS_API_PORT')}`;
export const tasksApiUrl = `http://${getEnvOrFail('TASKS_API_HOST')}:${getEnvOrFail('TASKS_API_PORT')}`;
