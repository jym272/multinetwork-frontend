import { useSWRConfig } from 'swr';
import { InputTaskComponent, Task } from '@src/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { ScopedMutator } from 'swr/_internal';

const Container = styled.div`
    background-color: #172a2a;
    width: 100%;
    display: flex;
    margin-top: 10px;
    justify-content: center;
`;

const FormContainer = styled.form`
    background-color: #435757;
    height: 180px;
    width: 630px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    box-shadow: 0 0 10px 0 #000000;
    position: relative;
`;
const Button = styled.button`
    background-color: #172a2a;
    color: #d3fbd8;
    border: none;
    border-radius: 10px;
    margin-bottom: 9px;
    margin-left: 15px;
    margin-right: 5px;
    cursor: pointer;
    width: 60px;
    height: 70%;

    user-select: none;
    font-family: 'Roboto Mono', monospace;
    transition: all 0.15s ease-in-out;

    &:hover {
        background-color: #d96326;
        color: #fff;
    }
    &:active {
        background-color: #ef6c1e;
        color: #fff;
        transform: scale(0.95);
    }
`;
const ServerError = styled.div`
    position: absolute;
    height: 20px;
    bottom: -1%;
    display: flex;
    justify-content: flex-end;
    width: 95%;
    font-size: 12px;
    font-weight: 400;
    color: #ef6c1e;
    font-family: 'Ubuntu Mono', monospace;
`;

export interface TaskInputs {
    name: string;
    description: string;
}

export const NewTask = () => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setFocus,
        setError,
        clearErrors,
        formState: { errors, isSubmitSuccessful }
    } = useForm<TaskInputs>();

    const { mutate } = useSWRConfig();

    const router = useRouter();
    const onSubmit: SubmitHandler<TaskInputs> = async data => {
        // @ts-expect-error name type in clearErrors and setError is not the same
        clearErrors('root.serverError');
        const localToken = localStorage.getItem('token');
        if (!localToken) {
            await router.push('/login');
            return;
        }
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'tasks-route': 'new-task',
                Authorization: `Bearer ${localToken}`
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = (await response.json()) as Task;
            const mutator = mutate as ScopedMutator<Task[]>;
            await mutator(['/api/tasks', localToken], list => {
                if (list) return [...list, result];
            });
            setFocus('name');
            return;
        }
        const result = (await response.json()) as { message: string | undefined };
        setError('root.serverError', {
            type: '400',
            message: result.message ?? 'Something went wrong, try again later'
        });
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({ name: '', description: '' });
        }
    }, [isSubmitSuccessful, reset]);

    return (
        <Container>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <InputTaskComponent
                        name="name"
                        register={register}
                        control={control}
                        errors={errors}
                        registerOptions={{
                            pattern: {
                                value: /^[\s\S]{1,1000}$/,
                                message: 'At least 1 character for the name'
                            }
                        }}
                    />
                    <InputTaskComponent
                        name="description"
                        register={register}
                        control={control}
                        errors={errors}
                        registerOptions={{
                            pattern: {
                                value: /^[\s\S]{1,1000}$/,
                                message: 'At least 1 character for the description'
                            }
                        }}
                    />
                    {errors.root?.serverError.type === '400' && (
                        <ServerError>{errors.root.serverError.message}</ServerError>
                    )}
                </div>
                <Button type="submit">new Task</Button>
            </FormContainer>
        </Container>
    );
};
