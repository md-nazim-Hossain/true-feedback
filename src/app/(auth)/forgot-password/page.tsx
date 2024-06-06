"use client";
import React from "react";
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
import { Typography, typographyVariants } from "@/components/ui/typography";
import Link from "next/link";
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { cn } from "@/lib/utils";

function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Typography variant={"h2"} className="text-center">
          Send Reset Link
        </Typography>
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

        <FormSubmitButton
          loading={form.formState.isSubmitting}
          loadingText="Please wait"
          className="w-full"
        >
          Send
        </FormSubmitButton>
      </form>
      <div className="mt-2 flex items-center gap-1 justify-center">
        <Typography>Back to</Typography>
        <Link
          className={cn(
            typographyVariants({ variant: "link", className: "text-blue-500" })
          )}
          href="/sign-in"
        >
          Sign In
        </Link>
      </div>
    </Form>
  );
}

export default ForgotPasswordPage;
