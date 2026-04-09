import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ComponentProps } from "react";

export function SignupForm({ className, ...props }: ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Signup to LearnHanzi</h1>
          <p className="text-sm text-muted-foreground">
            Enter email, name and password to create account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Name</FieldLabel>
          <Input
            id="name"
            type="name"
            placeholder="e.g. MagicznyKrzysztof"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit">Signup</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
