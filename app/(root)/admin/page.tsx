"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Import icons for better UX
import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function Admin() {
  const [isView, setIsView] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      const user = await signIn("credentials", 
        {email, password, redirect: false}
      
    );
      if (user?.error) {
        setError(user.error);
        return;
      }

     


      router.push("/admin/Add"); 

    } else {
      
      setError("Login failed. Please try again.");
    }
  }

  return (
    <div className="flex justify-center flex-col items-center h-screen w-screen bg-gradient-to-r text-white via-black from-green-950/95 to-green-950/100 px-4">
      
      <h1 className="text-5xl font-bold text-center mb-10">Admin Login</h1>

      <div className="border border-gray-100 p-6 rounded-lg w-full max-w-md shadow-lg ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter admin email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Admin email is required to access the admin panel.
                  </FormDescription>
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
                    <div className="relative">
                      <Input
                        type={isView ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                      <Button
                        type="button"
                        onClick={() => setIsView(!isView)}
                        className="absolute right-0 -translate-y-[100%] text-gray-400 hover:text-white bg-transparent hover:bg-transparent"
                      >
                        {isView ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          
            {error && <p className="text-red-400 text-center">{error}</p>}

            <Button type="submit" className="w-full hover:bg-green-700" variant="modernDark">
              Login
            </Button>
          </form>
        </Form>
     </div>
    </div>
  );
}
