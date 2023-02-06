import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const LayoutContainer = styled.div`
    display: block;
    height: 100vh;
    width: 100vw;
    background-color: #f7f0f0;
`;

const LogoutContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background: azure;
`;

const LogoutButton = styled.div`
    cursor: pointer;
    padding: 10px;
    border-radius: 5px;
    background-color: #f7f0f0;
    color: #000;
    font-weight: bold;
    &:hover {
        background-color: #000;
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
