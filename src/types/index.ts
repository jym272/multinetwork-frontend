export interface Task {
    id: number;
    name: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginInputs {
    email: string;
    password: string;
}
export interface TaskInputs {
    name: string;
    description: string;
}
