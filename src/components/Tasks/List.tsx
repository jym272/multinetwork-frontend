import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TaskComponent } from '@src/components';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';

export interface Task {
    id: number;
    name: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const ListGridDynamicContainer = styled.div`
    display: grid;
    align-items: baseline;
    //justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    grid-auto-flow: row dense;
    grid-gap: 2rem;
    background-color: #172a2a;
    padding: 2rem;
`;

export const TaskList = ({ list: taskList }: { list: Task[] }) => {
    const [list, setList] = useState(taskList);
    const { loaded } = useSelector((state: RootState) => state.updateTask);

    useEffect(() => {
        setList(taskList);
    }, [taskList, loaded]);

    return (
        <ListGridDynamicContainer>
            {list
                .sort((a, b) => a.id - b.id)
                .map(task => (
                    <TaskComponent key={task.id} task={task} />
                ))}
        </ListGridDynamicContainer>
    );
};
