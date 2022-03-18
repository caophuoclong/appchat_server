export interface IUser {
    username: string;
    password: string;
    dateOfBirth: {
        date: number,
        month: number,
        year: number,
    };
    email: string;
    numberPhone?: string;
    gender: "male" | "female" | "other";
}