import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';

const Container = styled.div<{ $trigger: boolean }>`
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 30px;
    background-color: #ffffff;
    //width: 200px;
    height: 120px;
    font-size: 20px;

    ${({ $trigger }) =>
        $trigger &&
        css`
            display: block;
            z-index: 100;
        `}
`;

const Dialog = styled.div<{ $hide: boolean }>`
    display: block;
    //flex-direction: column;
    //align-items: center;
    //justify-content: center;
    height: 100%;
    width: 100%;
    transform: translateY(100%);
    background-color: #bc3e3e;
    transition: all 0.9s ease-in-out;
    animation: slideIn 0.5s ease-in-out forwards;

    @keyframes slideIn {
        0% {
            transform: translateY(100%);
        }
        100% {
            transform: translateY(0%);
        }
    }

    ${({ $hide }) =>
        $hide &&
        css`
            animation: slideOut 0.5s ease-in-out forwards;
        `}
    @keyframes slideOut {
        0% {
            transform: translateY(0%);
        }
        100% {
            transform: translateY(100%);
        }
    }
`;

export const AlertDialog = () => {
    const { message, trigger: triggerAlertDialog } = useSelector((state: RootState) => state.setAlertDialog);

    const [trigger, setTrigger] = useState(false);
    const [hideDialog, setHideDialog] = useState(false);

    useEffect(() => {
        if (triggerAlertDialog) {
            setTrigger(triggerAlertDialog);
        }
    }, [triggerAlertDialog]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (trigger && !triggerAlertDialog) {
            setHideDialog(true);
            timeout = setTimeout(() => {
                setTrigger(false);
                setHideDialog(false);
            }, 500);
        }
        return () => {
            clearTimeout(timeout);
            setHideDialog(false);
        };
    }, [trigger, triggerAlertDialog]);

    return (
        <>
            <Container $trigger={trigger}>{trigger && <Dialog $hide={hideDialog}>{message}</Dialog>}</Container>
        </>
    );
};
