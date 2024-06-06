"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schemas/signInSchema";
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
import { Typography, typographyVariants } from "@/components/ui/typography";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function SignInPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const res = await signIn("credentials", {
      identifier: values.identifier,
      password: values.password,
      redirect: false,
    });
    console.log(res);
    if (res?.error) {
      toast({
        title: "Sign in failed",
        description: res.error,
        variant: "destructive",
      });
    }
    if (res?.url) {
      router.replace("/dashboard");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Typography variant={"h2"} className="text-center">
          Sign In
        </Typography>
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email or username" {...field} />
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
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Remember me</FormLabel>
              </FormItem>
            )}
          />
          <Link
            className={cn(
              typographyVariants({
                variant: "link",
                className: "text-blue-500",
              })
            )}
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <FormSubmitButton
          loading={form.formState.isSubmitting}
          loadingText="Please wait"
          className="w-full"
        >
          Sign In
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
          href="/sign-up"
        >
          Sign Up
        </Link>
      </div>
    </Form>
  );
}

export default SignInPage;
