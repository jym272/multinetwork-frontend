import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const LayoutContainer = styled.div`
    display: block;
    height: 100vh;
    width: 100vw;
    background-color: #172a2a;
    position: relative;
    .simplebar-scrollbar::before {
        background: rgba(67, 87, 87, 0.91);
        border-radius: 0;
    }
`;

const LogoutContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background: #172a2a;
`;

const LogoutButton = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    color: #d3fbd8;
    font-size: 14px;
    padding: 10px 15px;
    margin-right: 10px;
    box-shadow: 0 0 3px 0 #000000;
    height: 36px;
    user-select: none;
    font-family: 'Roboto Mono', monospace;
    transition: all 0.3s ease-in-out;

    &:hover {
        background-color: #d96326;
        color: #fff;
    }
`;

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const logoutHandler = () => {
        localStorage.removeItem('token');
        void router.push('/login');
    };
    return (
        <LayoutContainer>
            <LogoutContainer>
                <LogoutButton onClick={logoutHandler}>Logout</LogoutButton>
            </LogoutContainer>
            {children}
        </LayoutContainer>
    );
};
