import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import signUpImg from "@/assets/sign-up-bg.webp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { Checkbox } from "@/components/ui/checkbox";
import { NavLink, useNavigate } from "react-router-dom";
import { ClockLoader } from "react-spinners";
import { useTheme } from "@/hooks/useTheme";
import { useEmailPasswordSignup } from "../hooks/useEmailPasswordSignUp";
import { useEmailVerification } from "../hooks/useEmailVerification";
import { useUpsertUser } from "../hooks/useUpsertUser";
import { useSignInWithGoogle } from "../hooks/useSignInWithGoogle";

const formSchema = z
  .object({
    email: z.email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(25, { message: "Password can't be more than 25 characters" }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignUpForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });
  const navigate = useNavigate();
  const {
    submit,
    submitting,
    error: emailPasswordError,
  } = useEmailPasswordSignup();
  const { verify, verifying, error: verifyError } = useEmailVerification();
  const { isLoaded, signInWithGoogle } = useSignInWithGoogle();
  const { mutateAsync: upsertUser } = useUpsertUser();
  const [phase, setPhase] = useState<"form" | "verify">("form");
  const [code, setCode] = useState("");
  const [pendingProfile, setPendingProfile] = useState<{
    email: string;
  } | null>(null);
  const { theme } = useTheme();

  const onSubmit = async (values: FormValues) => {
    const { email, password } = values;
    await submit(email, password);
    setPendingProfile({ email });
    setPhase("verify");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingProfile) {
      throw new Error("Error getting email.");
    }
    await verify(code);
    const payload = {
      email: pendingProfile.email,
    };
    await upsertUser(payload);

    navigate("/on-boarding");
  };

  const Loader = (
    <ClockLoader size={22} color={theme === "dark" ? "#25103e" : "#f8f8f9"} />
  );

  return (
    <Card className="self-center overflow-hidden p-0 bg-transparent dark:bg-black/50 backdrop-blur-lg max-w-3xl my-8 mx-4">
      <CardContent className="grid p-0 md:grid-cols-2">
        <div className="p-6 md:p-8">
          {phase === "form" ? (
            <Form {...form}>
              <form
                className="grid gap-3"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Create your MatchUp account
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Sign up to get started
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be your account email.
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
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Create your password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Confirm your password.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                            onBlur={field.onBlur}
                            ref={field.ref}
                            className="cursor-pointer"
                          />
                        </FormControl>
                        <FormLabel>Accept terms and conditions</FormLabel>
                      </div>
                      <FormDescription>
                        By clicking this checkbox, you agree to the Terms of
                        Service and Privacy Policy.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {emailPasswordError && (
                  <span className="text-[#da565f]">{emailPasswordError}</span>
                )}
                <div
                  id="clerk-captcha"
                  data-cl-theme={theme === "dark" ? "dark" : "light"}
                  data-cl-size="normal"
                />
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={submitting}
                >
                  {submitting ? Loader : "Sign Up"}
                </Button>

                <div className="flex items-center">
                  <div className="h-px bg-border flex-1" />
                  <span className="mx-3 text-muted-foreground text-sm whitespace-nowrap">
                    Or continue with
                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div className="flex">
                  <Button
                    onClick={signInWithGoogle}
                    variant="outline"
                    type="button"
                    className="w-full cursor-pointer"
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
                  Have an account?{" "}
                  <NavLink
                    to="/sign-in"
                    className="underline underline-offset-4"
                  >
                    Sign In
                  </NavLink>
                </div>
              </form>
            </Form>
          ) : (
            <form
              className="flex flex-col items-center justify-center gap-8"
              onSubmit={handleVerify}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <h1 className="text-2xl font-bold">Verify your email</h1>
                <p className="text-muted-foreground">
                  We sent a 6-digit code to {pendingProfile?.email}
                </p>
              </div>
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {verifyError && (
                <span className="text-[#da565f]">{verifyError}</span>
              )}
              <div className="flex items-center justify-center gap-6">
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={verifying}
                >
                  {verifying ? Loader : "Verify & Continue"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() => setPhase("form")}
                >
                  Back
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-muted relative hidden md:block">
          <img
            src={signUpImg}
            alt="Two people riding bikes"
            className="absolute inset-0 h-full w-full object-cover dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  );
}
