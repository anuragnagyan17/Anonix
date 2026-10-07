'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState , useEffect} from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"
import { signInSchema } from "@/Schemas/signInSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signUpSchema } from "@/Schemas/signUpSchema"

const page = () => {
  const [username, setUsername] = useState("")
  const [userMessage, setUserMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  

  const [debouncedUsername] = useDebounceValue(username, 500)

  const router = useRouter();


  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
    if (username) {
      setIsCheckingUsername(true)
      setUserMessage("")
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`)
        let message = response.data.message
        setUserMessage(message)
      } catch (error: any) {
        const axiosError = error as AxiosError<ApiResponse>;
        let message = axiosError.response?.data.message || "Error checking username"
        setUserMessage(message);
      } finally {
        setIsCheckingUsername(false)
      }
    }
  }
  checkUsernameUnique()
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
      toast.add({
        title: "Success", 
        description: response.data.message,
        type: "success"
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Error in signup if user",error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast.add({
        title: "Sign up failed",
        description: errorMessage,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

    function debounced(value: string) {
        throw new Error("Function not implemented.")
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
          <p className="mb-4">Sign in to start YourAnonymous Feedback adventure</p>
        </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} 
                  onChange={(e) =>{
                    field.onChange(e);
                    setUsername(e.target.value);
                  }}
                  />
                  {}
                </FormControl>
                {isCheckingUsername && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <p className={`text-sm ${userMessage === 'Username is available' ? 'text-green-500' : 'text-red-500'}`}>  {userMessage}</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            { isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Plese wait
              </>
            ) : (
              'Sign up'
            )}
          </Button>
        </form>
        </Form>
      </div>
      
      
    </div>
  )
}

export default page;
