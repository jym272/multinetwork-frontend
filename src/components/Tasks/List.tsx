import React from 'react';
import styled from 'styled-components';
import { TaskComponent } from '@src/components';

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
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 1rem;
`;

export const TaskList = ({ list }: { list: Task[] }) => {
    return (
        <ListGridDynamicContainer>
            {list.map((task, index) => (
                <TaskComponent key={index} task={task} />
            ))}
        </ListGridDynamicContainer>
    );
};
