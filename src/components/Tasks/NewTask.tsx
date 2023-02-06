import { useSWRConfig } from 'swr';
import { InputTaskComponent, Task } from '@src/components';
import { SubmitHandler, useForm } from 'react-hook-form';
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { ScopedMutator } from 'swr/_internal';

const Container = styled.div`
    background-color: #ffffff;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const FormContainer = styled.form`
    background-color: #7fda96;
    height: 300px;
    width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #07968b;
    border-radius: 25px;
`;
const Button = styled.button`
    background-color: #07968b;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    width: 100px;

    &:hover {
        background-color: #06a99d;
        color: #fff;
    }

    &:focus {
        background-color: #07968b;
        color: #fff;
    }
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
        setValue,
        formState: { errors }
    } = useForm<TaskInputs>();

    const { mutate } = useSWRConfig();

    const router = useRouter();
    const onSubmit: SubmitHandler<TaskInputs> = async data => {
        const localToken = localStorage.getItem('token');
        if (!localToken) {
            return router.push('/login');
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

        const result = (await response.json()) as Task;
        const mutator = mutate as ScopedMutator<Task[]>;
        await mutator(['/api/tasks', localToken], list => {
            if (list) return [...list, result];
        });
        setValue('name', '');
        setValue('description', '');
    };

    return (
        <Container className="row">
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <InputTaskComponent
                    name="name"
                    register={register}
                    control={control}
                    errors={errors}
                    registerOptions={{
                        pattern: {
                            value: /^[a-zA-Z0-9]{3,}$/,
                            message: 'At least 3 characters for the name'
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
                            value: /^[a-zA-Z0-9]{3,}$/,
                            message: 'At least 3 characters for the description'
                        }
                    }}
                />

                <Button type="submit">new Task</Button>
            </FormContainer>
        </Container>
    );
};
