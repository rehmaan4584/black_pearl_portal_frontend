"use client";

import { apiRequest } from "@/lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BlackPearlLogo } from "./BlackPearlLogo";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  type RegisterFormData = {
    name: string;
    email: string;
    password: string;
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await apiRequest("auth/register", "POST", data);
      toast.success("Account created. You can sign in now.");
      router.push("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    }
  };

  return (
    <Card className="border-white/10 glass shadow-2xl overflow-hidden relative">
      <div className="absolute -right-20 -top-20 size-64 bg-primary/10 blur-[100px] rounded-full" />
      <CardHeader className="space-y-8 relative z-10">
        <BlackPearlLogo size="lg" />
        <div className="space-y-1">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">
            Get Started
          </CardTitle>
          <CardDescription className="text-secondary/80">
            Join the futuristic merchant community.
          </CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Ahmed Ali"
              aria-invalid={!!errors.name}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 120,
                  message: "Name must be at most 120 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={!!errors.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: emailPattern,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Use at least 8 characters",
                },
                maxLength: {
                  value: 128,
                  message: "Password is too long",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              At least 8 characters. Use a mix of letters and numbers in
              production.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t pt-6">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
