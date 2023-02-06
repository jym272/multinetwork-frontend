import React from 'react';
import styled from 'styled-components';
import { LoginComponent } from '@src/components';
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #e4e4e4;
    width: 100vw;
`;

const Login = () => {
    return (
        <Container>
            <LoginComponent />
        </Container>
    );
};

export default Login;
