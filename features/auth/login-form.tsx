"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DASHBOARD_PATH } from "@/features/auth/constants";
import { login } from "@/features/auth/api";
import { loginSchema, type LoginFormValues } from "@/features/auth/schema";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@acowale.local",
      password: "Admin@123"
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);

    const response = await login(values);

    if (!response.success) {
      toast.error(response.message, {
        description: response.errors.join(" ")
      });
      setIsSubmitting(false);
      return;
    }

    setUser(response.data.user);
    toast.success(response.message);
    router.push(DASHBOARD_PATH);
    router.refresh();
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        <p className="text-sm text-destructive">{form.formState.errors.email?.message}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            className="pr-10"
            {...form.register("password")} 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-sm text-destructive">{form.formState.errors.password?.message}</p>
      </div>
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Log in"}
      </Button>
    </form>
  );
}
