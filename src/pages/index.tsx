import React from 'react';
import { Login } from '@src/components';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #e4e4e4;
    width: 100vw;
`;

export default function Home() {
    return (
        <Container>
            <Login />
        </Container>
    );
}
