import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { UsernameValidation } from "@/Schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: UsernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParams);
console.log(result);
return Response.json(result);

        // if (!result.success) {
        //     const usernameErrors = result.error.format().username?._errors || [];
        //     return Response.json(
        //         { success: false, message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid username" },
        //         { status: 400 }
        //     );
        // }
        // const { username } = result.data;
        // const user = await UserModel.findOne({ username, isVerified: true });

        // if (user) {
        //     return Response.json(
        //         { success: false, message: "Username already taken" },
        //         { status: 400 }
        //     );
        // }
        // return Response.json(
        //     { success: true, message: "Username is available" },
        //     { status: 200 }
        // );
    } catch (error) {
        console.error("Error checking username", error);
        
        return Response.json(
            { success: false, message: "Error checking username" },
            { status: 500 }
        );
    }
}


    