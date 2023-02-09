import { Task, ThreePointsMenu } from '@src/components';
import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { AppDispatch, loadTask, RootState } from '@src/store';
import { useDispatch, useSelector } from 'react-redux';

const CardContainer = styled.div<{ $transition: { start: boolean; x: number; y: number }; $fadeCard: boolean }>`
    display: flex;
    flex-direction: column;
    min-width: 270px;
    //max-width: 270px;
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

            //width: 500px;
            //animation: widthAnimationCardContainer 0.2s ease-in-out forwards;

            z-index: 1; // high
            opacity: 1;
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
    word-break: break-word;
`;

const Description = styled.div`
    font-size: 14px;
    margin: 10px;
    word-break: break-word;
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
    height: 40px;
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
        if (height > 220) {
            const spanNumber = Math.floor(height / 110);
            setSpan(spanNumber);
            ref.current.style.gridRow = `span ${spanNumber}`;
        }
    }, [loaded]);

    const startTransition = () => {
        const { topRef, leftRef } = getRefContainerTopLeft();
        const { top, left } = getCardContainerTopLeft(ref);
        const x = leftRef - left;
        const y = topRef - top;
        setTransition({ start: true, x, y });
        dispatch(loadTask({ task, loaded: true }));
    };

    const mouseEnterHandler = () => {
        setShowOptions(true);
    };

    const mouseLeaveHandler = () => {
        setShowOptions(false);
    };

    return (
        <>
            <CardContainer
                onMouseEnter={mouseEnterHandler}
                onMouseLeave={mouseLeaveHandler}
                ref={ref}
                $fadeCard={taskHasBeenDeleted}
                $transition={transition}
                onClick={() => startTransition()}
            >
                <Title>{task.name}</Title>
                {/*<Divider />*/}
                <Description>{task.description}</Description>
                {/*<p>{task.status}</p>*/}
                {/*<p>{task.createdAt}</p>*/}
                {/*<p>{task.updatedAt}</p>*/}
                {/*<DeleteButtonContainer onClick={() => deleteTaskHandler(task.id)}>*/}
                {/*    <CrossDeleteButton />*/}
                {/*</DeleteButtonContainer>*/}
                <OptionsButtons $show={showOptions || menuInOptionsIsOpen}>
                    <ThreePointsContainer>
                        <ThreePointsMenu
                            taskId={task.id}
                            setOpen={setMenuInOptionsIsOpen}
                            open={menuInOptionsIsOpen}
                            setTaskHasBeenDeleted={setTaskHasBeenDeleted}
                        />
                        {/*{spanNumber}*/}
                    </ThreePointsContainer>
                    {span} {task.id}
                </OptionsButtons>
            </CardContainer>
        </>
    );
};
