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
    background-color: transparent;
    height: 150px;

    ${({ $trigger }) =>
        $trigger &&
        css`
            display: block;
            z-index: 100;
        `}
`;

const Dialog = styled.div<{ $hide: boolean }>`
    display: flex;
    align-items: center;
    padding: 20px;
    height: 100%;
    min-width: 327px;
    transform: translateY(100%);
    background-color: #bc3e3e;
    color: #e8c4ad;
    font-family: 'Akkurat', monospace;
    font-size: 17px;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.5);

    animation: slideIn 0.5s ease-in-out forwards;
    opacity: 0;

    @keyframes slideIn {
        0% {
            transform: translateY(100%);
            opacity: 0;
        }
        100% {
            transform: translateY(0%);
            opacity: 1;
        }
    }

    ${({ $hide }) =>
        $hide &&
        css`
            animation: slideOut 0.5s ease-in-out forwards;
        `} @keyframes slideOut {
        0% {
            transform: translateY(0%);
            opacity: 1;
        }
        100% {
            transform: translateY(100%);
            opacity: 0;
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
