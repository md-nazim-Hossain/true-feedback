"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSubmitButton,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/lib/axios";
import { verifySchema } from "@/schemas/verifyShema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function VerifyPage() {
  const { username } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });
  async function onSubmit(values: z.infer<typeof verifySchema>) {
    try {
      await axios.post(`/user/verify-code`, {
        code: values.code,
        username,
      });
      router.replace(`/sign-in`);
    } catch (error) {
      toast({
        title: "Failed to verify",
        description: (error as ApiResponse)?.message || "Failed to verify",
        variant: "destructive",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verify Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton
          loading={form.formState.isSubmitting}
          loadingText="Verifying..."
        >
          Verify
        </FormSubmitButton>
      </form>
    </Form>
  );
}

export default VerifyPage;
