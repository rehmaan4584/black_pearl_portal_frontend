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
        localStorage.setItem("token", token);
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
    <Card className="border-border/80 shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-border/70 bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.22),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(234,179,8,0.12),transparent_55%)]" />
          <div className="leading-none">
            <div className="text-sm font-semibold tracking-[0.22em] text-foreground">
              BLACK PEARL
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              merchant portal
            </div>
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Sign in
          </CardTitle>
          <CardDescription>
            Use your merchant credentials to access the dashboard.
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
