import styled, { css } from 'styled-components';

import Image from 'next/image';
import { useState } from 'react';
import { InputLoginComponent } from '@src/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { LoginInputs } from '@src/types';

const Container = styled.div`
    display: flex;
    justify-content: center;
    color: rgb(45, 51, 58);
    font-size: 14px;
    font-family: 'BlinkMacSystemFont', sans-serif;
    line-height: 14px;
    font-weight: 400;
    flex-direction: column;
    background-color: #ffffff;
    height: 540px;
    min-height: 540px;
    width: 400px;
    border-radius: 5px;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.52);
`;

const Header = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    height: 218px;
    width: 100%;
`;

const LoginContainer = styled.div<{ $fadeOut: boolean; $fadeIn: boolean }>`
    overflow: hidden;
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    height: 100%;
    width: 100%;
    ${props =>
        props.$fadeOut &&
        css`
            animation: fadeOutLoginContainer 0.5s ease-in-out forwards;
            @keyframes fadeOutLoginContainer {
                0% {
                    scale: 1;
                    opacity: 1;
                }
                20% {
                    scale: 1.1;
                    opacity: 1;
                }
                100% {
                    scale: 0.7;
                    opacity: 0;
                }
            }
        `}
    ${props =>
        props.$fadeIn &&
        css`
            animation: fadeInLoginContainer 0.5s ease-in-out forwards;
            @keyframes fadeInLoginContainer {
                0% {
                    scale: 0;
                    opacity: 0;
                }
                50% {
                    opacity: 0.3;
                }
                100% {
                    scale: 1;
                    opacity: 1;
                }
            }
        `}

    .title {
        height: 40px;
        font-size: 24px;
        font-weight: 400;
    }

    .subtitle {
        height: 10px;
    }

    .image {
        scale: 1.2;
        height: 80px;
    }

    .sign_up {
        height: 0px;
        margin-top: 10px;

        span {
            color: #07968b;

            &:hover {
                color: #07968b;
                text-decoration: underline;
                cursor: pointer;
                text-shadow: 0 0 1px rgba(7, 150, 139, 0.49);
            }
        }
    }
`;

const SignUpContainer = styled.div<{ $fadeOut: boolean }>`
    overflow: hidden;
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    height: 100%;
    width: 100%;
    scale: 0;
    opacity: 0;
    animation: fadeInSignUpContainer 0.6s ease-in-out forwards;
    @keyframes fadeInSignUpContainer {
        0% {
            scale: 0;
            opacity: 0;
        }
        50% {
            opacity: 0.3;
        }
        100% {
            scale: 1;
            opacity: 1;
        }
    }
    ${props =>
        props.$fadeOut &&
        css`
            animation: fadeOutLoginContainer 0.5s ease-in-out forwards;
            @keyframes fadeOutLoginContainer {
                0% {
                    scale: 1;
                    opacity: 1;
                }
                20% {
                    scale: 1.1;
                    opacity: 1;
                }
                100% {
                    scale: 0.7;
                    opacity: 0;
                }
            }
        `}
    .title {
        height: 50px;
        font-size: 24px;
        font-weight: 400;
    }

    .image {
        scale: 1.2;
        height: 90px;
    }

    .login {
        height: 0px;
        //margin-top: 10px;

        span {
            color: #07968b;

            &:hover {
                color: #07968b;
                text-decoration: underline;
                cursor: pointer;
                text-shadow: 0 0 1px rgba(7, 150, 139, 0.49);
            }
        }
    }
`;

const LoginForm = styled.form`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 188px;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const ButtonTitle = styled.div`
    height: 20px;
    font-size: 16px;
    font-weight: 400;
`;

const Button = styled.button`
    width: 300px;
    height: 45px;
    margin: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #000;
    padding: 5px;
    background-color: #000;
    color: #fff;
    transition: all 0.25s ease-in-out;
    &:hover {
        background-color: #fff;
        color: #000;
        cursor: pointer;
    }
    &:active {
        transform: scale(0.95);
    }
    ${props =>
        props.disabled &&
        css`
            background-color: #000;
            color: #fff;
            opacity: 0.5;
            cursor: not-allowed;
            &:hover {
                background-color: #000;
                color: #fff;
                opacity: 0.5;
                cursor: not-allowed;
            }
            &:active {
                transform: scale(1);
            }
        `}
`;

const ServerError = styled.div`
    position: absolute;
    height: 20px;
    bottom: -10%;
    font-size: 12px;
    font-weight: 400;
    color: #ff0000;
    font-family: 'Ubuntu Mono', monospace;
`;

export const LoginComponent = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<LoginInputs>();

    const [isLogin, setIsLogin] = useState(true);
    const [buttonTitle, setButtonTitle] = useState('Login');
    const [isSignUp, setIsSignUp] = useState(false);
    const [activateFadeOut, setActivateFadeOut] = useState(false);
    const [activateFadeIn, setActivateFadeIn] = useState(false);

    const onSubmit: SubmitHandler<LoginInputs> = async data => {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

                'users-route': isLogin ? 'login' : 'signup'
            },
            body: JSON.stringify(data)
        });

        const result = (await response.json()) as { message?: string; token?: string };

        if (response.status >= 400) {
            setError('root.serverError', {
                type: '400',
                message: result.message ?? 'Something went wrong, try again later'
            });
            return;
        }
        let token: string | undefined;
        if (isSignUp) {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'users-route': 'login'
                },
                body: JSON.stringify(data)
            });
            const result = (await response.json()) as { message?: string; token?: string };

            if (response.status >= 400) {
                setError('root.serverError', {
                    type: '400',
                    message: result.message ?? 'Something went wrong, try again later'
                });
                return;
            }
            token = result.token!;
        }

        localStorage.setItem('token', token ?? result.token!);
        await router.push('/tasks');
    };
    const changeToSignUpHandler = () => {
        setActivateFadeOut(true);
        setActivateFadeIn(false);
        setButtonTitle('Sign Up');
        setTimeout(() => {
            setIsLogin(false);
        }, 500);
        setIsSignUp(true);
        // @ts-expect-error name type in clearErrors and setError is not the same
        clearErrors('root.serverError');
    };
    const changeToLoginHandler = () => {
        setIsLogin(true);
        setButtonTitle('Login');
        setTimeout(() => {
            setIsSignUp(false);
        }, 500);
        setActivateFadeIn(true);
        // @ts-expect-error name type in clearErrors and setError is not the same
        clearErrors('root.serverError');
    };
    return (
        <Container>
            <Header>
                {isLogin && (
                    <LoginContainer $fadeOut={activateFadeOut} $fadeIn={activateFadeIn}>
                        <div className={'image'}>
                            <Image src="/login.png" alt="login" width="64" height="64" />
                        </div>
                        <h3 className={'title'}>Welcome</h3>
                        <div className={'subtitle'}>Enter your username and password to log in</div>
                        <div className={'sign_up'}>
                            or&nbsp;
                            <span onClick={changeToSignUpHandler}>sign up</span>
                        </div>
                    </LoginContainer>
                )}
                {isSignUp && (
                    <SignUpContainer $fadeOut={activateFadeIn}>
                        <div className={'image'}>
                            <Image src="/sign_up.svg" alt="login" width="64" height="64" />
                        </div>
                        <h3 className={'title'}>Create an account</h3>
                        <div className={'login'}>
                            or&nbsp;
                            <span onClick={changeToLoginHandler}>login</span>
                        </div>
                    </SignUpContainer>
                )}
            </Header>
            <LoginForm onSubmit={handleSubmit(onSubmit)}>
                <InputLoginComponent
                    name="email"
                    register={register}
                    control={control}
                    errors={errors}
                    registerOptions={{
                        pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: 'Please enter a valid email address'
                        }
                    }}
                />
                <InputLoginComponent
                    name="password"
                    register={register}
                    control={control}
                    errors={errors}
                    registerOptions={{
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                            message: 'At least 8 characters, 1 uppercase, 1 lowercase and 1 number'
                        }
                    }}
                />
                <Button disabled={!!(errors.email ?? errors.password)} type="submit">
                    <ButtonTitle>{buttonTitle}</ButtonTitle>
                </Button>
                {errors.root?.serverError.type === '400' && (
                    <ServerError>{errors.root.serverError.message}</ServerError>
                )}
            </LoginForm>
        </Container>
    );
};
