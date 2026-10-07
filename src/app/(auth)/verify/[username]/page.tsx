'use client'
import React from "react";
import { useParams } from "next/navigation";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/Schemas/signInSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { verifySchema } from "@/Schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VerifyAccount = () => {
    const router = useRouter()
    const param = useParams<{username:string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
        
      })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
      try {
        const response = await axios.post(`/api/verify-code`,
            {
                username:param.username,
                code:data.code
            }
        )
        toast({
          title: "Success",
          description: response.data.message,
         
        })
        router.replace(`/sign-in`);
        
      } catch (error) {
        console.error("Error in signup if user",error)
      const axiosError = error as AxiosError<ApiResponse>;
      
      toast({
        title: "Sign up failed",
        description: axiosError.response?.data.message,
        variant: "destructive"
      });
    }
    };
    return( 
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
            <div className="text-center">
               <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
               <p className="mb-4">Enter the Verification code sent to your email</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input  placeholder="Code" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
    )
}

export default VerifyAccount;