import { ThreePointsMenu } from '@src/components';
import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { AppDispatch, loadTask, RootState } from '@src/store';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '@src/types';

const CardContainer = styled.div<{ $transition: { start: boolean; x: number; y: number }; $fadeCard: boolean }>`
    display: flex;
    flex-direction: column;
    min-width: 270px;
    padding: 3px;
    font-family: 'Roboto Mono', monospace;
    min-height: 110px;
    border: 1px solid #d3fbd8;
    border-radius: 10px;
    background-color: #172a2a;
    color: #ffffff;
    transition: all 0.2s ease-in-out;
    position: relative;
    user-select: none;
    max-height: 450px;

    @keyframes widthAnimationCardContainer {
        0% {
            width: 270px;
        }
        100% {
            width: 500px;
        }
    }

    ${({ $transition }) =>
        $transition.start &&
        css`
            transform: translate(${`${$transition.x}px`}, ${`${$transition.y}px`});
            z-index: 1;
            opacity: 0;
        `}

    @keyframes cardContainerFadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

    ${({ $fadeCard }) =>
        $fadeCard &&
        css`
            animation: cardContainerFadeOut 0.4s ease-in-out forwards;
        `}
`;

const Title = styled.div`
    font-size: 18px;
    font-weight: 600;
    margin: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 1.2em;
`;

const Description = styled.div`
    position: relative;
    font-size: 14px;
    margin: 10px;
    min-height: 1.2em;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    overflow: hidden;
    line-height: 1.2rem;
`;

const getRefContainerTopLeft = () => {
    const refContainer = document.getElementById('ref_container');
    if (!refContainer) return { topRef: 0, leftRef: 0 };
    const { top: topRef, left: leftRef } = refContainer.getBoundingClientRect();
    return { topRef, leftRef };
};

const getCardContainerTopLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return { top: 0, left: 0 };
    const { top, left } = ref.current.getBoundingClientRect();
    return { top, left };
};

const ThreePointsContainer = styled.div`
    position: absolute;
    bottom: 0;
    top: 0;
    right: 2%;
`;

const OptionsButtons = styled.div<{ $show: boolean }>`
    position: relative;
    min-height: 40px;
    width: 100%;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease-in-out;
    ${({ $show }) =>
        $show &&
        css`
            opacity: 1;
            visibility: visible;
        `}
`;

const BlurredDescription = styled.div<{ $show: boolean }>`
    background: linear-gradient(transparent, #172a2a);
    bottom: -1%;
    height: 8%;
    position: absolute;
    visibility: hidden;
    width: 100%;
    ${({ $show }) =>
        $show &&
        css`
            visibility: visible;
        `}
`;

export const TaskComponent = ({ task }: { task: Task }) => {
    const dispatch: AppDispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [taskHasBeenDeleted, setTaskHasBeenDeleted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [menuInOptionsIsOpen, setMenuInOptionsIsOpen] = useState(false);
    const [transition, setTransition] = useState({ start: false, x: 0, y: 0 });
    const [span, setSpan] = useState(0);

    const {
        task: { id: taskId },
        loaded
    } = useSelector((state: RootState) => state.updateTask);

    useEffect(() => {
        if (taskId === task.id && !loaded) {
            setTransition({ start: false, x: 0, y: 0 });
        }
    }, [taskId, loaded, task.id]);

    useEffect(() => {
        if (!ref.current) return;
        const { height } = ref.current.getBoundingClientRect();
        ref.current.style.gridRow = '';
        if (height > 240) {
            const spanNumber = Math.floor(height / 120);
            setSpan(spanNumber);
            ref.current.style.gridRow = `span ${spanNumber}`;
        }
    }, [loaded]);

    const startTransition = () => {
        dispatch(loadTask({ task, loaded: true }));
        setTimeout(() => {
            const { topRef, leftRef } = getRefContainerTopLeft();
            const { top, left } = getCardContainerTopLeft(ref);
            const x = leftRef - left;
            const y = topRef - top;
            setTransition({ start: true, x, y });
        }, 25);
    };

    return (
        <>
            <CardContainer
                onMouseEnter={() => setShowOptions(true)}
                onMouseLeave={() => setShowOptions(false)}
                ref={ref}
                $fadeCard={taskHasBeenDeleted}
                $transition={transition}
                onClick={() => startTransition()}
            >
                <Title>{task.name}</Title>
                {/*<Divider />*/}
                <Description>
                    {task.description} <BlurredDescription $show={span === 3} />
                </Description>
                <OptionsButtons $show={showOptions || menuInOptionsIsOpen}>
                    <ThreePointsContainer>
                        <ThreePointsMenu
                            taskId={task.id}
                            setOpen={setMenuInOptionsIsOpen}
                            open={menuInOptionsIsOpen}
                            setTaskHasBeenDeleted={setTaskHasBeenDeleted}
                        />
                    </ThreePointsContainer>
                </OptionsButtons>
            </CardContainer>
        </>
    );
};
