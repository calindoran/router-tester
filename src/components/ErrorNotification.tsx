import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function ErrorNotification({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-center">
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.message || "Something went wrong."}</AlertDescription>
      </Alert>
    </div>
  );
}
