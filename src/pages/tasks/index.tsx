import React, { useEffect, useState } from 'react';
import { Layout, NewTask, Task, TaskList, UpdateTask } from '@src/components';
import useSWR, { Fetcher } from 'swr';
import { useRouter } from 'next/router';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const fetchWithToken = async (url: string, token: string) => {
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            'tasks-route': 'get-all'
        }
    });

    if (!res.ok) {
        const { message } = (await res.json()) as { message: string | undefined };
        throw new Error(message ?? 'An error occurred while fetching the data.');
    }
    return res.json() as Promise<Task[]>;
};
const fetcher: Fetcher<Task[], string[]> = ([url, token]) => fetchWithToken(url, token);

const Task = () => {
    const [token, setToken] = useState<string | null>(null);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [list, setList] = useState<Task[]>([]);
    const router = useRouter();

    const { data, error } = useSWR<Task[], Error>(shouldFetch ? ['/api/tasks', token] : null, fetcher);

    useEffect(() => {
        if (data) {
            setList(data);
        }
    }, [data]);

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        if (!localToken) {
            void router.push('/login');
            return;
        }
        setShouldFetch(true);
        setToken(localToken);
    }, [router]);
    useEffect(() => {
        if (error) {
            void router.push('/login');
            return;
        }
    }, [error, router]);

    if (!token || !data) return <div>loading...</div>;

    return (
        <>
            <UpdateTask />
            <Layout>
                <SimpleBar style={{ height: 'calc(100vh - 100px)' }}>
                    <NewTask />
                    {list.length > 0 ? <TaskList list={list} /> : <div>No tasks</div>}
                </SimpleBar>
            </Layout>
        </>
    );
};

export default Task;
