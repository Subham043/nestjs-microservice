export type JwtPayload = {
    id: number;
    name: string;
    email: string;
    role: string;
    blocked: boolean;
    isVerified: boolean;
}

export type Token = {
    access_token: string;
    refresh_token: string;
};

export type JwtRefreshPayload = JwtPayload & { refreshToken: string };