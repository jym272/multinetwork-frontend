import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ScopedMutator } from 'swr/_internal';
import { Task } from '@src/components';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';

const Menu = styled.div`
    position: absolute;
    top: 100%;
    left: 50%;
    font-size: 14px;
    padding: 0.3rem 0;
    white-space: nowrap;
    background-color: #435757;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.71);
    z-index: 1;
    @keyframes MenuAnimationAppear {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    animation: MenuAnimationAppear 0.15s ease-out;
`;

const MenuItem = styled.div`
    width: 100%;
    color: #ffffff;
    padding: 0.3rem 0.6rem;
    user-select: none;
    &:hover {
        background-color: #d3fbd8;
        color: #172a2a;
        cursor: pointer;
    }
`;

const ThreePoints = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    transition: all 0.2s ease-out;
    user-select: none;

    & > div {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #d3fbd8;
        margin: 2px;
    }

    &:hover {
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.11);
        cursor: pointer;
    }
`;

export const ThreePointsMenu = ({
    taskId,
    open,
    setOpen,
    setTaskHasBeenDeleted
}: {
    taskId: number;
    setOpen: Dispatch<SetStateAction<boolean>>;
    open: boolean;
    setTaskHasBeenDeleted: Dispatch<SetStateAction<boolean>>;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { mutate } = useSWRConfig();

    const deleteTaskHandler = async () => {
        const localToken = localStorage.getItem('token');
        if (!localToken) {
            await router.push('/login');
            return;
        }

        const response = await fetch('/api/tasks', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'tasks-route': 'delete-task',
                'task-id': `${taskId}`,
                Authorization: `Bearer ${localToken}`
            }
        });
        if (response.ok) {
            setTaskHasBeenDeleted(true);
            setTimeout(async () => {
                const mutator = mutate as ScopedMutator<Task[]>;
                await mutator(['/api/tasks', localToken], tasks => {
                    if (tasks) {
                        return tasks.filter(task => task.id !== taskId);
                    }
                });
            }, 500);
        }
    };

    const threePointsClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    };
    const menuItemDeleteTaskHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        void deleteTaskHandler();
        setOpen(false);
    };

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        },
        [setOpen]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);
    return (
        <>
            <ThreePoints onClick={threePointsClickHandler}>
                <div />
                <div />
                <div />
            </ThreePoints>
            {open && (
                <Menu ref={ref}>
                    <MenuItem onClick={menuItemDeleteTaskHandler}>Delete task</MenuItem>
                    {/*<MenuItem onClick={menuItemClickHandler}>Delete tas asd asd asdk</MenuItem>*/}
                </Menu>
            )}
        </>
    );
};
