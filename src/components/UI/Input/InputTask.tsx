import styled, { css } from 'styled-components';
import { useEffect, useState } from 'react';
import { Control, FieldErrors, RegisterOptions, UseFormRegister, useWatch } from 'react-hook-form';
import { TaskInputs } from '@src/types';

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 10px;
    font-family: 'Roboto Mono', monospace;
    line-height: 14px;
`;

const Label = styled.label<{ $inputFocus: boolean; $error: boolean }>`
    position: absolute;
    color: #a29e9e;
    transform: translate(21px, 20px);
    transition: all 0.2s ease-in-out;
    z-index: 3;
    cursor: text;
    user-select: none;
    ${props =>
        props.$inputFocus &&
        css`
            transform: translate(19px, 4px);
            font-size: 10px;
            color: #435757;
            background-color: #ffffff;
            padding: 0 3px;
            border-radius: 3px;
        `}
    ${props =>
        props.$error &&
        css`
            color: #ff0000;
        `}
`;

const Input = styled.input<{ $error: boolean }>`
    width: 500px;
    height: 35px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #dfd9d9;
    padding: 12px;
    z-index: 2;
    outline: none;
    font-family: 'Roboto Mono', monospace;

    &:hover {
        //border: 1px solid #172a2a;
    }
    &:focus {
        //border: 2px solid #172a2a;
    }
    ${props =>
        props.$error &&
        css`
            border: 2px solid #ff0000;
        `}
`;

const TextArea = styled.textarea<{ $error: boolean }>`
    width: 500px;
    height: 60px;
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #dfd9d9;
    padding: 12px;
    z-index: 2;
    outline: none;
    resize: none;

    &:hover {
        //border: 1px solid #172a2a;
    }
    &:focus {
        //border: 2px solid #172a2a;
    }
    ${props =>
        props.$error &&
        css`
            border: 2px solid #ff0000;
        `}
`;

const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const ErrorMessage = styled.div`
    position: absolute;
    color: #ef6c1e;
    font-size: 11px;
    bottom: 3%;
    left: 4%;
`;

export const InputTaskComponent = ({
    name,
    register,
    control,
    errors,
    registerOptions
}: {
    name: keyof TaskInputs;
    register: UseFormRegister<TaskInputs>;
    control: Control<TaskInputs>;
    errors: FieldErrors<TaskInputs>;
    registerOptions: RegisterOptions;
}) => {
    const value = useWatch({
        control,
        name
    });
    const [inputFocus, setInputFocus] = useState(false);
    const [isTextArea, setIsTextArea] = useState(false);
    useEffect(() => {
        if (name === 'description') {
            setIsTextArea(true);
        }
    }, [name]);

    return (
        <InputContainer>
            <Label $error={!!errors[name]} $inputFocus={inputFocus || !!value} htmlFor={name}>
                {capitalize(name)}
            </Label>
            {!isTextArea && (
                <Input
                    {...register(name, { required: `${capitalize(name)} is requerid`, ...registerOptions })}
                    type="text"
                    placeholder=""
                    id={name}
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    aria-invalid={errors[name] ? 'true' : 'false'}
                    $error={!!errors[name]}
                />
            )}
            {isTextArea && (
                <TextArea
                    {...register(name, { required: `${capitalize(name)} is requerid`, ...registerOptions })}
                    placeholder=""
                    id={name}
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    aria-invalid={errors[name] ? 'true' : 'false'}
                    $error={!!errors[name]}
                />
            )}

            {errors[name] && <ErrorMessage>{errors[name]?.message}</ErrorMessage>}
        </InputContainer>
    );
};
