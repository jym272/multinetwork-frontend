import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TaskComponent } from '@src/components';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { Task } from '@src/types';

const ListGridDynamicContainer = styled.div`
    display: grid;
    align-items: baseline;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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
