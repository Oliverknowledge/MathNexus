
import { signIn } from "@/auth"
import { Button } from "./ui/button"
 
export default function SignIn() {
  return (
    <Button onClick={() => signIn("google")}>Sign in with Google</Button>
  )
} 