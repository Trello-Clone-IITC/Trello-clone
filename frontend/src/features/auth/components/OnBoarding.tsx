import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { useOnBoarding } from "../hooks/useOnBoarding";

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name is required")
    .regex(/^[A-Za-z]+ [A-Za-z]+$/, "Enter first and last name"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function Onboarding() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { signUp } = useSignUp();
  const { mutateAsync } = useOnBoarding();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [firstName, ...rest] = values.fullName.trim().split(" ");
    const lastName = rest.join(" ");
    try {
      await mutateAsync({ firstName, lastName, password: values.password });
      navigate("/");
    } catch (err) {
      console.log(
        `Error: ${err instanceof Error ? err.message : "Unkown Error"}`
      );
      navigate("/login");
    }
  };

  return (
    <div className="bg-[#fafbfc] min-h-screen w-full flex justify-center items-center">
      <Card className="w-[400px] md:w-[450px] bg-white px-8 py-10">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <h2 className="text-xl font-bold text-center mb-6">
                Complete Your Account
              </h2>

              {signUp?.emailAddress && (
                <p className="text-center text-sm text-gray-600 mb-4">
                  Signing up with:{" "}
                  <span className="font-medium">{signUp.emailAddress}</span>
                </p>
              )}

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#0052cc]/90 hover:bg-[#0052cc]"
              >
                Complete Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
