import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SquareArrowOutUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";

import { NavLink, useNavigate } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";
// import { useEmailPasswordSignIn } from "../hooks/useEmailPasswordSignIn";
// import { ClockLoader } from "react-spinners";
import { useOuthSignIn } from "../hooks/useSignInWithGoogle";

const formSchema = z.object({
  email: z.email(),
  remember: z.boolean().optional(),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      remember: false,
    },
  });

  const isMobile = useMediaQuery("(max-width: 425px)");

  const { setTheme } = useTheme();
  setTheme("light");
  const navigate = useNavigate();
  const { isLoaded, oauthsignIn } = useOuthSignIn();
  // const { signInWithPassword, submitting, error } = useEmailPasswordSignIn();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO: Implement actual sign in logic
    console.log("Login values:", values);
    navigate("/");
    form.reset();
  };

  const trelloLogo = (
    <svg height="40" viewBox="0 0 113 32">
      <path
        fill="var(--text-color, #172b4d)"
        d="M104.97 25.64c-4.6 0-7.3-3.4-7.3-8s2.7-7.94 7.3-7.94c4.57 0 7.24 3.34 7.24 7.94s-2.67 8-7.24 8m0-13.49c-3.28 0-4.72 2.58-4.72 5.49s1.44 5.55 4.72 5.55c3.25 0 4.66-2.64 4.66-5.55s-1.41-5.49-4.66-5.49M96.21 25.3c-.21.06-.67.12-1.35.12-2.51 0-4.11-1.19-4.11-4.02V3.59h2.64V21.1c0 1.38.92 1.87 2.06 1.87.28 0 .46 0 .77-.03zm-8 0c-.21.06-.67.12-1.35.12-2.51 0-4.11-1.19-4.11-4.02V3.59h2.64V21.1c0 1.38.92 1.87 2.06 1.87.28 0 .46 0 .77-.03zM72.86 12.09c-2.79 0-4.2 1.81-4.48 4.48h8.56c-.15-2.85-1.44-4.48-4.08-4.48m5.89 12.64c-1.26.67-3.19.92-4.75.92-5.73 0-8.25-3.31-8.25-8 0-4.63 2.58-7.94 7.24-7.94 4.72 0 6.62 3.28 6.62 7.94v1.2H68.42c.37 2.61 2.05 4.29 5.67 4.29 1.78 0 3.28-.34 4.66-.83zm-19.48-8.44v9.05h-2.58V10h2.58v2.7c.89-1.81 2.42-3.1 5.43-2.91v2.58c-3.37-.34-5.43.67-5.43 3.93M40.28 5.19h15.09v2.64H49.2v17.51h-2.76V7.82h-6.16z"
      ></path>
      <path
        fill="var(--tile-color,#1558bc)"
        d="M0 8a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8z"
      ></path>
      <path
        fill="var(--icon-color, white)"
        d="M12.9 24c.62 0 1.13-.49 1.13-1.1V9.1c0-.61-.5-1.1-1.13-1.1H8.13C7.51 8 7 8.49 7 9.1v13.8c0 .61.5 1.1 1.13 1.1zm10.97-6.34c.62 0 1.13-.49 1.13-1.1V9.1c0-.61-.5-1.1-1.13-1.1H19.1c-.62 0-1.13.49-1.13 1.1v7.47c0 .61.5 1.1 1.13 1.1z"
      ></path>
    </svg>
  );

  const atlassianLogo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 198 32"
      focusable="false"
      aria-hidden="true"
      height="24"
      fill="none"
    >
      <path
        fill="#6C6F77"
        d="M22.878 24.378 12.293 3.208c-.208-.458-.416-.541-.666-.541-.209 0-.459.083-.709.5-1.5 2.375-2.167 5.125-2.167 8 0 4.001 2.042 7.752 5.043 13.794.333.667.583.792 1.166.792h7.335c.542 0 .833-.208.833-.625 0-.208-.041-.333-.25-.75M7.501 14.377c-.833-1.25-1.083-1.334-1.292-1.334s-.333.083-.708.834L.208 24.46c-.166.334-.208.459-.208.625 0 .334.292.667.917.667h7.46c.5 0 .874-.416 1.083-1.208.25-1 .333-1.876.333-2.917 0-2.917-1.292-5.751-2.292-7.251z"
      ></path>
      <path
        fill="#6C6F77"
        d="M107.447 10.828c0 2.972 1.345 5.308 6.795 6.37 3.185.707 3.893 1.203 3.893 2.265 0 1.061-.708 1.698-2.973 1.698-2.619 0-5.733-.92-7.785-2.123v4.813c1.627.778 3.751 1.698 7.785 1.698 5.662 0 7.856-2.548 7.856-6.228m0 .07c0-3.538-1.84-5.166-7.148-6.298-2.902-.637-3.61-1.274-3.61-2.194 0-1.133 1.062-1.628 2.973-1.628 2.335 0 4.6.708 6.794 1.698v-4.6c-1.557-.779-3.892-1.345-6.653-1.345-5.237 0-7.927 2.265-7.927 5.945m72.475-5.803v20.17h4.318V9.979l1.769 4.035 6.087 11.324h5.379V5.166h-4.247v13.022l-1.628-3.821-4.883-9.201zm-27.319 0h-4.671v20.17h4.671zm-10.05 14.154c0-3.538-1.841-5.166-7.149-6.298-2.902-.637-3.609-1.274-3.609-2.194 0-1.133 1.061-1.628 2.972-1.628 2.336 0 4.601.708 6.795 1.699v-4.6c-1.557-.78-3.893-1.346-6.653-1.346-5.238 0-7.927 2.265-7.927 5.946 0 2.972 1.344 5.308 6.794 6.37 3.185.707 3.893 1.203 3.893 2.264 0 1.062-.708 1.699-2.973 1.699-2.618 0-5.733-.92-7.785-2.123v4.812c1.628.779 3.751 1.699 7.785 1.699 5.592 0 7.857-2.548 7.857-6.3M71.069 5.166v20.17h9.625l1.486-4.387h-6.44V5.166zm-19.039 0v4.317h5.167v15.854h4.741V9.483h5.592V5.166zm-6.866 0h-6.157L32 25.336h5.379l.99-3.396c1.204.353 2.478.566 3.752.566s2.548-.213 3.751-.567l.991 3.398h5.379c-.07 0-7.078-20.171-7.078-20.171M42.05 18.259c-.92 0-1.77-.141-2.548-.354L42.05 9.13l2.548 8.776a9.6 9.6 0 0 1-2.548.354zM97.326 5.166H91.17l-7.078 20.17h5.38l.99-3.396c1.203.353 2.477.566 3.751.566s2.548-.213 3.751-.567l.991 3.398h5.379zm-3.114 13.093c-.92 0-1.77-.141-2.548-.354l2.548-8.776 2.548 8.776a9.6 9.6 0 0 1-2.548.354m75.306-13.093h-6.157l-7.007 20.17h5.379l.991-3.396c1.203.353 2.477.566 3.751.566s2.548-.213 3.751-.567l.991 3.398h5.379zm-3.043 13.093c-.92 0-1.77-.141-2.548-.354l2.548-8.776 2.548 8.776a10 10 0 0 1-2.548.354"
      ></path>
    </svg>
  );

  return (
    <div className="bg-[#fafbfc] min-h-screen w-full flex justify-center items-center overflow-y-clip">
      <img
        className="absolute bottom-0 right-0 w-90 h-90 "
        src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/trello-right.e6e102c7.svg"
        alt="Trello"
      />
      <img
        className="absolute bottom-0 left-0 w-90 h-90"
        src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/trello-left.4f52d13c.svg"
        alt="Trello"
      />
      <Card
        className={`overflow-hidden px-4 md:px-8 py-10 rounded-none bg-[white] backdrop-blur-lg min-h-[725px] flex justify-start items-center h-[725px] w-[400px] ${
          isMobile ? "w-full min-h-screen" : "md:w-[400px] md:min-w-[400px]"
        }`}
      >
        <CardContent className="h-[686px] w-full px-0">
          <Form {...form}>
            <form className="" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="h-8 mb-2">{trelloLogo}</div>
                  <p className="text-[#172b4d] text-balance font-bold ">
                    Sign up to continue
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-[12px] text-[#44546f] text-left">
                    By signing up, I accept the Atlassian{" "}
                    <a
                      href="https://www.atlassian.com/legal/atlassian-customer-agreement"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[#2777e7] underline underline-offset-1 hover:no-underline"
                      aria-label="Atlassian Customer Agreement, (opens new window)"
                    >
                      Cloud Terms of Service
                      <SquareArrowOutUpRight className="w-3 h-3 ml-1 inline" />
                    </a>{" "}
                    and acknowledge the{" "}
                    <a
                      href="https://www.atlassian.com/legal/privacy-policy"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[#2777e7] underline underline-offset-1 hover:no-underline"
                      aria-label="Privacy Policy, (opens new window)"
                    >
                      Privacy Policy
                      <SquareArrowOutUpRight className="w-3 h-3 ml-1 inline" />
                    </a>
                  </p>
                </div>

                {/* {error && <span className="text-[#da565f]">{error}</span>} */}
                <div id="clerk-captcha" data-cl-size="normal" />
                <Button
                  type="submit"
                  className="w-full h-[40px] px-[10px] py-0 bg-[#0052cc]/90 hover:bg-[#0055cc] cursor-pointer rounded"
                >
                  {/* {submitting ? (
                  <ClockLoader
                    size={25}
                    color={theme === "dark" ? "#25103e" : "#f8f8f9"}
                  />
                ) : ( */}
                  Sign up
                  {/* )} */}
                </Button>
                <div className="flex items-center">
                  <div className="h-px bg-border flex-1"></div>
                  <span className="mx-3 text-muted-foreground text-sm whitespace-nowrap">
                    Or continue with
                  </span>
                  <div className="h-px bg-border flex-1"></div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <Button
                      onClick={() => oauthsignIn("oauth_google")}
                      variant="outline"
                      type="button"
                      className="w-full bg-transparent hover:bg-[#fafbfb] border-1 border-[#c1c7d0] cursor-pointer h-[40px] rounded"
                      disabled={!isLoaded}
                    >
                      <img
                        src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/google-logo.5867462c.svg"
                        alt="Google"
                        className="w-6 h-6 mr-[2px]"
                      />
                      <span className="text-[#172b4d] font-bold">Google</span>
                      <span className="sr-only">Login with Google</span>
                    </Button>
                  </div>
                  <div>
                    <Button
                      onClick={() => oauthsignIn("oauth_microsoft")}
                      variant="outline"
                      type="button"
                      className="w-full bg-transparent hover:bg-[#fafbfb] border-1 border-[#c1c7d0] cursor-pointer h-[40px] rounded"
                      disabled={!isLoaded}
                    >
                      <img
                        src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/microsoft-logo.c73d8dca.svg"
                        alt="Microsoft"
                        className="w-6 h-6 mr-[2px]"
                      />
                      <span className="text-[#172b4d] font-bold">
                        Microsoft
                      </span>
                      <span className="sr-only">Login with Microsoft</span>
                    </Button>
                  </div>
                  <div className="">
                    <Button
                      onClick={() => oauthsignIn("oauth_slack")}
                      variant="outline"
                      type="button"
                      className="w-full bg-transparent hover:bg-[#fafbfb] border-1 border-[#c1c7d0] cursor-pointer h-[40px] rounded"
                      disabled={!isLoaded}
                    >
                      <img
                        src="https://id-frontend.prod-east.frontend.public.atl-paas.net/assets/slack-logo.5d730c10.svg"
                        alt="Slack"
                        className="w-6 h-6 mr-[2px]"
                      />
                      <span className="text-[#172b4d] font-bold">Slack</span>
                      <span className="sr-only">Login with Slack</span>
                    </Button>
                  </div>
                </div>
                <div className="text-center text-sm flex justify-center items-center border-b-1 border-[#c1c7d0] py-4">
                  <NavLink
                    to="/login"
                    className="text-[#2777e7]  hover:underline"
                  >
                    Already have an Atlassian account? Log in
                  </NavLink>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className=" flex flex-col items-center gap-2 pt-2">
              {atlassianLogo}
              <p className="text-[11px] text-center text-[#172b4d] flex items-center gap-1">
                One account for Trello, Jira, Confluence, and{" "}
                <NavLink
                  to="/support"
                  className="text-[#2777e7] underline underline-offset-1 hover:no-underline flex items-center"
                >
                  more <SquareArrowOutUpRight className="w-3 h-3 ml-1" />
                </NavLink>
              </p>
            </div>
            <div className=" text-[11px] text-[#172b4d] text-center">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#2777e7] underline underline-offset-1 hover:no-underline"
                aria-label="Google Privacy Policy, (opens new window)"
              >
                Privacy Policy
                <SquareArrowOutUpRight className="w-3 h-3 ml-1 inline" />
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#2777e7] underline underline-offset-1 hover:no-underline"
                aria-label="Google Terms of Service, (opens new window)"
              >
                Terms of Service
                <SquareArrowOutUpRight className="w-3 h-3 ml-1 inline" />
              </a>{" "}
              apply.
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
