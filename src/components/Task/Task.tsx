import { CrossDeleteButton, Task } from '@src/components';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import { ScopedMutator } from 'swr/_internal';

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 200px;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
`;

const DeleteButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #f44336;
    cursor: pointer;
    &:hover {
        background-color: #e53935;
    }
`;

export const TaskComponent = ({ task }: { task: Task }) => {
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const deleteTaskHandler = async (id: number) => {
        const localToken = localStorage.getItem('token');
        if (!localToken) {
            return router.push('/login');
        }

        const response = await fetch('/api/tasks', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'tasks-route': 'delete-task',
                'task-id': `${id}`,
                Authorization: `Bearer ${localToken}`
            }
        });
        if (response.ok) {
            const mutator = mutate as ScopedMutator<Task[]>;
            await mutator(['/api/tasks', localToken], tasks => {
                if (tasks) {
                    return tasks.filter(task => task.id !== id);
                }
            });
        }
    };
    return (
        <CardContainer>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p>{task.status}</p>
            <p>{task.createdAt}</p>
            <p>{task.updatedAt}</p>
            <DeleteButtonContainer onClick={() => deleteTaskHandler(task.id)}>
                <CrossDeleteButton />
            </DeleteButtonContainer>
        </CardContainer>
    );
};
