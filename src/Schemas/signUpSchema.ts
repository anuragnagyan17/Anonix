import {z} from "zod";

export const UsernameValidation = z
.string()
.min(2, "Username must be atleast 2 characters")
.max(20,"Username must be less than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must contain only letters, numbers and underscores")


export const signUpSchema = z.object({
    username: UsernameValidation,
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, {message:"Password must be at least 8 characters long"}),
});