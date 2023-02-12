import styled, { css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, downloadTask, resetAlert, RootState, setAlert } from '@src/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Task, ThreePointsMenu } from '@src/components';
import { ScopedMutator } from 'swr/_internal';
import { useSWRConfig } from 'swr';
import { isNotAValidKey, isValidString } from '@src/utils/validation';
import { TASKS } from '@src/utils/constants';
import SimpleBar from 'simplebar-react';
import SimpleBarCore from 'simplebar-core';

const {
    NAME_MAX_LENGTH,
    DESCRIPTION_MAX_LENGTH,
    THRESHOLD_CHARS_LEFT_BEFORE_WARNING,
    UPDATE_TASK_CONTENT_MAX_HEIGHT: maxHeight
} = TASKS;

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
    transition: all 0.4s ease-in-out;
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
    min-height: 24px;
    word-break: break-word;
`;

const Description = styled.div`
    font-size: 16px;
    margin: 10px;
    overflow-wrap: break-word;
    outline: none;
    min-height: 19px;
    white-space: pre-wrap;
`;

const OptionsButtons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    height: 40px;
    width: 100%;
`;

const CloseButton = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    color: #d3fbd8;
    font-size: 14px;
    padding: 9px 13px;
    user-select: none;
    font-family: 'Roboto Mono', monospace;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #d96326;
        color: #fff;
    }
`;

const BlurredDescription = styled.div<{ $show: boolean }>`
    background: linear-gradient(transparent, #172a2a);
    bottom: -1%;
    height: 3.5%;
    position: absolute;
    visibility: hidden;
    width: 100%;
    ${({ $show }) =>
        $show &&
        css`
            visibility: visible;
        `}
`;

const Content = styled.div`
    position: relative;
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
    const [showBlurredDescription, setShowBlurredDescription] = useState(false);

    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);

    const ref = useRef<HTMLDivElement>(null);
    const simpleBarRef = useRef<SimpleBarCore | null>(null);

    const updateTaskHandler = useCallback(async () => {
        dispatch(resetAlert({ key: 'description' }));
        dispatch(resetAlert({ key: 'name' }));
        const localToken = localStorage.getItem('token');
        if (!localToken) {
            await router.push('/login');
            return;
        }
        if (name === task.name && description === task.description) {
            dispatch(downloadTask(task));
            return;
        }
        let dataName = name;
        let dataDescription = description;
        if (!isValidString(name, NAME_MAX_LENGTH)) {
            dataName = task.name;
            if (refTitle.current) {
                refTitle.current.innerHTML = task.name;
            }
        }

        if (!isValidString(description, DESCRIPTION_MAX_LENGTH)) {
            dataDescription = task.description;
            if (refDescription.current) {
                refDescription.current.innerHTML = task.description;
            }
        }
        const data = {
            ...task,
            name: dataName,
            description: dataDescription
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

    const listenToEscapeKey = useCallback(
        async (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                await updateTaskHandler();
            }
        },
        [updateTaskHandler]
    );
    useEffect(() => {
        document.addEventListener('keydown', listenToEscapeKey);
        return () => {
            document.removeEventListener('keydown', listenToEscapeKey);
        };
    }, [listenToEscapeKey]);

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
        if (!loaded) {
            setName('');
            setDescription('');
            return;
        }
        setName(task.name);
        setDescription(task.description);
    }, [task, loaded]);

    useEffect(() => {
        if (!taskHasBeenDeleted) return;
        dispatch(downloadTask(task));
        dispatch(resetAlert({ key: 'description' }));
        dispatch(resetAlert({ key: 'name' }));
        setTaskHasBeenDeleted(false);
    }, [dispatch, task, taskHasBeenDeleted]);

    const listenPasteInTitle = useCallback(
        (event: ClipboardEvent) => {
            event.preventDefault();
            const text = event.clipboardData?.getData('text/plain');
            if (!text) return;
            const charLeft = NAME_MAX_LENGTH - name.length;
            if (charLeft === 0) return;

            let textToBeCopied = text;
            if (charLeft < text.length) {
                textToBeCopied = text.slice(0, charLeft);
            }
            document.execCommand('insertHTML', false, textToBeCopied);
        },
        [name.length]
    );

    useEffect(() => {
        const refTitleCurrent = refTitle.current;
        if (!refTitleCurrent) return;
        refTitleCurrent.addEventListener('paste', listenPasteInTitle);
        return () => {
            refTitleCurrent.removeEventListener('paste', listenPasteInTitle);
        };
    }, [listenPasteInTitle]);

    const listenPasteInDescription = useCallback(
        (event: ClipboardEvent) => {
            event.preventDefault();
            const text = event.clipboardData?.getData('text/plain');
            if (!text) return;
            const charLeft = DESCRIPTION_MAX_LENGTH - description.length;
            if (charLeft === 0) return;

            let textToBeCopied = text;
            if (charLeft < text.length) {
                textToBeCopied = text.slice(0, charLeft);
            }
            document.execCommand('insertHTML', false, textToBeCopied);
        },
        [description.length]
    );

    useEffect(() => {
        const refDescriptionCurrent = refDescription.current;
        if (!refDescriptionCurrent) return;
        refDescriptionCurrent.addEventListener('paste', listenPasteInDescription);
        return () => {
            refDescriptionCurrent.removeEventListener('paste', listenPasteInDescription);
        };
    }, [listenPasteInDescription]);

    useEffect(() => {
        if (loaded) {
            const length = description.length;
            if (length > DESCRIPTION_MAX_LENGTH - THRESHOLD_CHARS_LEFT_BEFORE_WARNING) {
                const charLeft = DESCRIPTION_MAX_LENGTH - length;
                dispatch(
                    setAlert({
                        message: `You have ${charLeft} characters left`,
                        key: 'description'
                    })
                );
                return;
            }
            dispatch(resetAlert({ key: 'description' }));
        }
    }, [description, dispatch, loaded]);

    useEffect(() => {
        if (loaded) {
            const length = name.length;
            if (length > NAME_MAX_LENGTH - THRESHOLD_CHARS_LEFT_BEFORE_WARNING) {
                const charLeft = NAME_MAX_LENGTH - length;
                dispatch(
                    setAlert({
                        message: `You have ${charLeft} characters left`,
                        key: 'name'
                    })
                );
                return;
            }
            dispatch(resetAlert({ key: 'name' }));
        }
    }, [name, dispatch, loaded]);

    const listenDescriptionKeys = useCallback(
        (event: KeyboardEvent) => {
            if (description.length > DESCRIPTION_MAX_LENGTH - 1 && isNotAValidKey(event.key)) {
                event.preventDefault();
                return;
            }
            if (event.key === 'Enter') {
                document.execCommand('insertLineBreak');
                event.preventDefault();
            }
        },
        [description]
    );

    useEffect(() => {
        const refDescriptionCurrent = refDescription.current;
        if (!refDescriptionCurrent) return;
        refDescriptionCurrent.addEventListener('keydown', listenDescriptionKeys);
        return () => {
            refDescriptionCurrent.removeEventListener('keydown', listenDescriptionKeys);
        };
    }, [listenDescriptionKeys]);

    const listenTitleKeys = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                refDescription.current?.focus();
                return;
            }
            if (name.length > NAME_MAX_LENGTH - 1 && isNotAValidKey(event.key)) {
                event.preventDefault();
            }
        },
        [name]
    );

    useEffect(() => {
        const refTitleCurrent = refTitle.current;
        if (!refTitleCurrent) return;
        refTitleCurrent.addEventListener('keydown', listenTitleKeys);
        return () => {
            refTitleCurrent.removeEventListener('keydown', listenTitleKeys);
        };
    }, [listenTitleKeys]);

    useEffect(() => {
        if (!simpleBarRef.current) return;
        const { height } = simpleBarRef.current.getScrollElement()!.getBoundingClientRect();
        setShowBlurredDescription(height > maxHeight - 1);
    }, [description]);

    return (
        <Modal $show={loaded}>
            <RefContainer $show={loaded} ref={ref} id="ref_container">
                <Content>
                    <SimpleBar ref={simpleBarRef} style={{ maxHeight: `${maxHeight}px` }}>
                        <Title
                            aria-label="title"
                            aria-multiline={false}
                            ref={refTitle}
                            suppressContentEditableWarning={true}
                            contentEditable={true}
                            onInput={e => setName(e.currentTarget.innerText)}
                        >
                            {task.name}
                        </Title>
                        <Description
                            aria-label="description"
                            aria-multiline={true}
                            role="textbox"
                            spellCheck={true}
                            ref={refDescription}
                            suppressContentEditableWarning={true}
                            contentEditable={true}
                            onInput={e => setDescription(e.currentTarget.innerText)}
                        >
                            {task.description}
                        </Description>
                    </SimpleBar>
                    <BlurredDescription $show={showBlurredDescription} />
                </Content>
                <OptionsButtons>
                    <CloseButton onClick={updateTaskHandler}>Close</CloseButton>
                    <ThreePointsMenu
                        taskId={task.id}
                        setOpen={setMenuInOptionsIsOpen}
                        open={menuInOptionsIsOpen}
                        setTaskHasBeenDeleted={setTaskHasBeenDeleted}
                    />
                </OptionsButtons>
            </RefContainer>
        </Modal>
    );
};
