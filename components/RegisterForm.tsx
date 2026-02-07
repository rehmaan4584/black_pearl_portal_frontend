"use client";

import { apiRequest } from "@/lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from 'next/navigation'; 
import Image from "next/image";
import { useForm } from "react-hook-form";
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
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await apiRequest("auth/register","POST",data);
      router.push('/login');
      console.log(res);
    } catch (error:any) {
      console.error(error);
      throw new Error(error?.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      action=""
      className="flex flex-col gap-4 w-96 p-6 bg-white text-[#2A1E0F] rounded-xl border border-[#E6C98A] shadow-[0_10px_30px_rgba(212,175,55,0.25)]"
    >
      <div>
        <Image
          src="/black_pearl_logo.svg"
          alt="brand logo"
          width={83}
          height={40}
        />
      </div>

      <label htmlFor="name">Full Name</label>
      <Input id="name" {...register("name", { required: "Name Required" })} />
      {errors.name && (
        <span style={{ color: "red", fontSize: "0.875rem" }}>
          {errors.name.message}
        </span>
      )}
      <label htmlFor="email">Email</label>
      <Input
        id="email"
        {...register("email", { required: "Email required" })}
      />
      {errors.email && (
        <span style={{ color: "red", fontSize: "0.875rem" }}>
          {errors.email.message}
        </span>
      )}
      <label htmlFor="password">Password</label>
      <Input
        id="password"
        type="password"
        {...register("password", { required: "Password required" })}
      />
      {errors.password && (
        <span style={{ color: "red", fontSize: "0.875rem" }}>
          {errors.password.message}
        </span>
      )}
      <Button
        variant="outline"
        className="bg-white text-black rounded-1 mt-1 p-1"
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}
