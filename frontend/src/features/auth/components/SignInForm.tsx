import { Card, CardContent } from "@/components/ui/card";
import signInImg from "@/assets/sign-in-bg.webp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
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
import { NavLink, useNavigate } from "react-router-dom";
import { useEmailPasswordSignIn } from "../hooks/useEmailPasswordSignIn";
import { ClockLoader } from "react-spinners";
import { useSignInWithGoogle } from "../hooks/useSignInWithGoogle";

const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, {
      error: "Password must be at least 6 characters",
    })
    .max(25, { error: "Password cant be more than 25 characters" }),
});

export default function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { theme } = useTheme();
  const navigate = useNavigate();
  const { isLoaded, signInWithGoogle } = useSignInWithGoogle();
  const { signInWithPassword, submitting, error } = useEmailPasswordSignIn();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;
    const signInSuccess = await signInWithPassword(email, password);
    if (!signInSuccess) {
      navigate("/error-page");
    }
    navigate("/");
    form.reset();
  };

  return (
    <Card className="overflow-hidden p-0 bg-transparent dark:bg-black/50 backdrop-blur-lg">
      <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
          <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your matchUp account
                </p>
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormDescription>Your account email.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-2 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Your account password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {error && <span className="text-[#da565f]">{error}</span>}
              <Button type="submit" className="w-full cursor-pointer">
                {submitting ? (
                  <ClockLoader
                    size={25}
                    color={theme === "dark" ? "#25103e" : "#f8f8f9"}
                  />
                ) : (
                  "Sign In"
                )}
              </Button>
              <div className="flex items-center">
                <div className="h-px bg-border flex-1"></div>
                <span className="mx-3 text-muted-foreground text-sm whitespace-nowrap">
                  Or continue with
                </span>
                <div className="h-px bg-border flex-1"></div>
              </div>
              <div className="flex">
                <Button
                  onClick={signInWithGoogle}
                  variant="outline"
                  type="button"
                  className="w-full bg-[var(--secondary)] cursor-pointer"
                  disabled={!isLoaded}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <NavLink to="/sign-up" className="underline underline-offset-4">
                  Sign up
                </NavLink>
              </div>
            </div>
          </form>
        </Form>
        <div className="bg-muted relative hidden md:block">
          <img
            src={signInImg}
            alt="Two people riding bikes"
            className="absolute inset-0 h-full w-full object-cover dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  );
}
