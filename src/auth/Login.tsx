import { useAuth } from "@/auth/AuthProvider";
import { sleep } from "@/utils/sleep";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-xs text-destructive">{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? (
        <span className="text-xs text-muted-foreground">Validating...</span>
      ) : null}
    </>
  );
}

export const Login = () => {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isLoggingIn = isSubmitting;

  const form = useForm({
    defaultValues: {
      username: "",
      role: "",
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (!values.value.username) return;
        await auth.login({
          username: values.value.username,
          role: values.value.role.toLowerCase() as "user" | "admin",
        });
        await sleep(1);
      } catch (error) {
        console.error("Error logging in: ", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 bg-linear-to-b sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="mt-4 max-w-lg"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="grid min-w-75 items-center gap-2">
              <label htmlFor="username-input" className="text-sm font-medium">
                Username
              </label>
              <form.Field
                name="username"
                validators={{
                  onChange: ({ value }) =>
                    !value
                      ? "A name is required"
                      : value.length < 3
                        ? "Name must be at least 3 characters"
                        : undefined,
                  onChangeAsyncDebounceMs: 2000,
                  onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return value.includes("error") && 'No "error" allowed in first name';
                  },
                }}
              >
                {(field) => (
                  <>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your username"
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
              <label htmlFor="role-select" className="text-sm font-medium">
                Role
              </label>
              <form.Field
                name="role"
                validators={{
                  onChange: ({ value }) => (!value ? "Role is required" : undefined),
                }}
              >
                {(field) => (
                  <>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.handleChange(value)}
                      onOpenChange={(open) => {
                        if (!open) field.handleBlur();
                      }}
                    >
                      <SelectTrigger id={field.name} className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
            </div>

            <Button type="submit" className="mt-4 w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
