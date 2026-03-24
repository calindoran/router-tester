type SpinnerProps = {
  show?: boolean;
  wait?: `delay-${number}`;
};

export function Spinner(props: SpinnerProps) {
  return (
    <div
      className={`inline-block animate-spin px-3 transition ${
        props.show
          ? `opacity-100 duration-500 ${props.wait ?? "delay-300"}`
          : "opacity-0 delay-0 duration-500"
      }`}
    >
      <svg
        className="h-5 w-5 text-slate-600"
        viewBox="0 0 24 24"
        fill="none"
        role="status"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M22 12a10 10 0 0 0-10-10v4a6 6 0 0 1 6 6h4z"
        />
      </svg>
    </div>
  );
}
