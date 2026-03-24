import { useAuth } from "@/auth/AuthProvider";
import { sleep } from "@/utils/sleep";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import * as React from "react";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
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
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="p-6">
          <h3 className="text-xl">Login</h3>
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
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select a role</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isLoggingIn ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
