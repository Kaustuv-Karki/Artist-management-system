export type PostUserRequest = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    dob: Date;
    gender: "male" | "female" | "other";
    phone: string;
}