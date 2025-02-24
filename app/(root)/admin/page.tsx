"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }).email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export default function Admin() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 

  function onSubmit(values: z.infer<typeof formSchema>) {
    
    console.log(values)
  }


  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-r text-white via-black from-green-950/95 to-green-950/95">
    <div className = " border-2 border-gray-100 p-4 rounded-lg w-[600px] ">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Confidential" {...field} />
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
                <Input placeholder="Confidential" {...field} />
              </FormControl>
              <FormDescription>
                Admin password is required to access the admin panel.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant={"modernDark"}>Submit</Button>
      </form>
    </Form>
    </div>
  </div>
  )
}