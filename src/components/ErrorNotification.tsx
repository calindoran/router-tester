export default function ErrorNotification({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-center">
      <div className="rounded-2xl bg-linear-to-br from-indigo-50 to-pink-50 p-8 shadow-lg">
        <h1 className="text-3xl font-semibold">Error</h1>
        <p className="mt-4 text-slate-600">{error?.message || "Something went wrong."}</p>
      </div>
    </div>
  );
}
