import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, downloadTask, RootState } from '@src/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Task, ThreePointsMenu } from '@src/components';
import { ScopedMutator } from 'swr/_internal';
import { useSWRConfig } from 'swr';
import { isValidString } from '@src/utils/validation';

const RefContainer = styled.div<{ $show: boolean }>`
    display: flex;
    flex-direction: column;
    font-family: 'Roboto Mono', monospace;
    width: 600px;
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 1rem;
    position: fixed;
    top: 45%;
    left: 50%;
    opacity: 0;

    transform: translate(-50%, -50%);
    z-index: -1;
    ${({ $show }) =>
        $show &&
        css`
            background-color: #172a2a;
            transition: all 0.4s ease-in-out;
            opacity: 1;
            z-index: 1;
        `}
    ${({ $show }) =>
        !$show &&
        css`
            background-color: rgba(255, 255, 255, 0.9);
            transition: all 0.2s ease-in-out;
            opacity: 0;
            z-index: -1;
        `}
`;

const Modal = styled.div<{ $show: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    //z-index: -1;
    ${({ $show }) =>
        $show &&
        css`
            transition: all 0.4s ease-in-out;
            opacity: 1;
            z-index: 1;
        `}
    ${({ $show }) =>
        !$show &&
        css`
            transition: all 0.2s ease-in-out;
            opacity: 0;
            z-index: -1;
        `}
`;

const Title = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin: 10px;
    outline: none;
`;

const Description = styled.div`
    font-size: 16px;
    margin: 10px;
    word-break: break-word;
    outline: none;
`;

const OptionsButtons = styled.div`
    position: relative;
    height: 40px;
    width: 100%;
    opacity: 1;
    transition: all 0.2s ease-in-out;
`;

const ThreePointsContainer = styled.div`
    position: absolute;
    bottom: 0;
    top: 0;
    right: 2%;
`;

const CloseContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    padding: 10px;
    background: #172a2a;
`;

const CloseButton = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    color: #d3fbd8;
    font-size: 14px;
    padding: 10px 15px;
    margin-right: 10px;
    height: 36px;
    user-select: none;
    font-family: 'Roboto Mono', monospace;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #d96326;
        color: #fff;
    }
`;

export const UpdateTask = () => {
    const dispatch: AppDispatch = useDispatch();
    const refTitle = useRef<HTMLDivElement>(null);
    const refDescription = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const { task, loaded } = useSelector((state: RootState) => state.updateTask);
    const [menuInOptionsIsOpen, setMenuInOptionsIsOpen] = useState(false);
    const [taskHasBeenDeleted, setTaskHasBeenDeleted] = useState(false);

    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);

    const ref = useRef<HTMLDivElement>(null);

    const updateTaskHandler = useCallback(async () => {
        if (!name || !description || !isValidString(name) || !isValidString(description)) {
            dispatch(downloadTask(task));
            return;
        }
        if (name === task.name && description === task.description) {
            dispatch(downloadTask(task));
            return;
        }
        const localToken = localStorage.getItem('token');
        if (!localToken) {
            await router.push('/login');
            return;
        }
        const data = {
            ...task,
            name,
            description
        };
        const response = await fetch('/api/tasks', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'tasks-route': 'update-task',
                'task-id': `${task.id}`,
                Authorization: `Bearer ${localToken}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            dispatch(downloadTask(data));
            const mutator = mutate as ScopedMutator<Task[]>;
            await mutator(['/api/tasks', localToken], tasks => {
                if (tasks) {
                    const index = tasks.findIndex(task => task.id === data.id);
                    tasks[index] = data;
                    return tasks;
                }
            });
            return;
        }
    }, [name, description, task, router, dispatch, mutate]);
    const handleClickOutside = useCallback(
        async (event: MouseEvent) => {
            event.stopPropagation();
            if (ref.current && !ref.current.contains(event.target as Node) && loaded) {
                await updateTaskHandler();
            }
        },
        [loaded, updateTaskHandler]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        setName(task.name);
        setDescription(task.description);
    }, [task, loaded]);

    useEffect(() => {
        if (!taskHasBeenDeleted) return;
        dispatch(downloadTask(task));
        setTaskHasBeenDeleted(false);
    }, [dispatch, task, taskHasBeenDeleted]);

    const pasteEventPreventDefaultActionAndPasteTextOnly = useCallback((event: ClipboardEvent) => {
        event.preventDefault();
        const text = event.clipboardData?.getData('text/plain');
        document.execCommand('insertHTML', false, text);
    }, []);

    useEffect(() => {
        document.addEventListener('paste', pasteEventPreventDefaultActionAndPasteTextOnly);
        return () => {
            document.removeEventListener('paste', pasteEventPreventDefaultActionAndPasteTextOnly);
        };
    }, [pasteEventPreventDefaultActionAndPasteTextOnly]);

    return (
        <Modal $show={loaded}>
            <RefContainer $show={loaded} ref={ref} id="ref_container">
                <Title
                    ref={refTitle}
                    suppressContentEditableWarning={true}
                    contentEditable={true}
                    onInput={e => setName(e.currentTarget.textContent!)}
                >
                    {task.name}
                </Title>
                <Description
                    ref={refDescription}
                    suppressContentEditableWarning={true}
                    contentEditable={true}
                    onInput={e => setDescription(e.currentTarget.textContent!)}
                >
                    {task.description}
                </Description>
                <OptionsButtons>
                    <CloseContainer>
                        <CloseButton onClick={updateTaskHandler}>Close</CloseButton>
                    </CloseContainer>
                    <ThreePointsContainer>
                        <ThreePointsMenu
                            taskId={task.id}
                            setOpen={setMenuInOptionsIsOpen}
                            open={menuInOptionsIsOpen}
                            setTaskHasBeenDeleted={setTaskHasBeenDeleted}
                        />
                    </ThreePointsContainer>
                </OptionsButtons>
            </RefContainer>
        </Modal>
    );
};
