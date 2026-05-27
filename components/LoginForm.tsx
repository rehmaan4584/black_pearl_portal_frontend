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
import { persistToken } from "@/lib/auth-token";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  type LoginFormData = {
    email: string;
    password: string;
  };

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await apiRequest("auth/login", "POST", data);
      const token = res?.token;
      if (token) {
        persistToken(token);
        toast.success("Signed in successfully");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("No token returned. Please try again.");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Sign in failed";
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
            Sign in
          </CardTitle>
          <CardDescription className="text-secondary/80">
            Access your futuristic command center.
          </CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-4">
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
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
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
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
