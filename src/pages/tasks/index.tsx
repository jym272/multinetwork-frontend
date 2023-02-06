import React, { useEffect, useState } from 'react';
import { Layout, NewTask, Task, TaskList } from '@src/components';
import useSWR, { Fetcher } from 'swr';
import { useRouter } from 'next/router';

// const fetchWithToken1 = (url: string, token: string) =>
//     fetch(url, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             'tasks-route': 'get-all'
//         }
//     }).then(r => r.json() as Promise<Task[]>);

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

    if (!token || !data) return <div>loading...</div>;
    if (error) return router.push('/login');

    return (
        <>
            <Layout>
                <NewTask />
                {list.length > 0 ? <TaskList list={list} /> : <div>No tasks</div>}
            </Layout>
        </>
    );
};

export default Task;
