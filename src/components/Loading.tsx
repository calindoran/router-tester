export default function Loading() {
	return (
		<div className="mx-auto max-w-4xl px-6 py-16 text-center">
			<div className="bg-linear-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-lg p-8">
				<h1 className="text-3xl font-semibold">Loading...</h1>
				<p className="mt-4 text-slate-600">
					Please wait while the data is being loaded.
				</p>
			</div>
		</div>
	);
}
