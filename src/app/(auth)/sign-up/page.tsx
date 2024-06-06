"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSubmitButton,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useDebounceCallback } from "usehooks-ts";
import axios from "@/lib/axios";
import { ApiResponse } from "@/types/ApiResponse";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon, CircleX, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Typography, typographyVariants } from "@/components/ui/typography";
import Link from "next/link";

function SignUpPage() {
  const [usernameMessage, setUsernameMessage] = React.useState("");
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    },
    mode: "all",
  });
  const debouncedValue = useDebounceCallback(setUsername, 500);

  useEffect(() => {
    // return () => {};
    (async () => {
      if (!username) return;
      setUsernameMessage("");
      setIsCheckingUsername(true);

      try {
        const res = (await axios.get(
          `/user/check-unique-username?username=${username}`
        )) as ApiResponse;
        setUsernameMessage(res.message);
        setUsername("");
      } catch (error: any) {
        setUsernameMessage(error?.message);
      } finally {
        setIsCheckingUsername(false);
      }
    })();
  }, [username]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      await axios.post("/user/signup", values);
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account",
      });
      router.replace(`/verify/${values.username}`);
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: (error as ApiResponse)?.message || "Failed to sign up",
        variant: "destructive",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Typography variant={"h2"} className="text-center">
          Creae a new account
        </Typography>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your username"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    debouncedValue(e.target.value);
                  }}
                />
              </FormControl>
              {isCheckingUsername && (
                <div className="mt-2">
                  <Loader2 className="size-4 animate-spin" />
                </div>
              )}
              {usernameMessage && !form.formState.errors.username && (
                <FormMessage
                  className={cn(
                    "flex items-center gap-1",
                    usernameMessage === "username is available"
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {usernameMessage === "username is available" ? (
                    <CheckCircle2Icon className="size-4" />
                  ) : (
                    <CircleX className="size-4" />
                  )}
                  {usernameMessage}
                </FormMessage>
              )}
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
                <Input type="email" placeholder="Enter your email" {...field} />
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
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton
          loading={form.formState.isSubmitting}
          loadingText="Please wait"
          className="w-full"
        >
          Sign up
        </FormSubmitButton>
      </form>
      <div className="mt-2 flex items-center gap-1 justify-center">
        <Typography>Already have an account? </Typography>
        <Link
          className={cn(
            typographyVariants({
              variant: "link",
              className: "text-blue-500",
            })
          )}
          href="/sign-in"
        >
          Sign In
        </Link>
      </div>
    </Form>
  );
}

export default SignUpPage;
