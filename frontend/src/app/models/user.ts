export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'owner' | 'admin';
    token?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
}
