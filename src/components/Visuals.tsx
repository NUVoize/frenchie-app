export type IconName =
  | "home"
  | "search"
  | "pencil"
  | "star"
  | "review"
  | "arrow"
  | "back"
  | "book"
  | "bolt"
  | "target"
  | "chart"
  | "settings"
  | "check";
const paths: Record<IconName, string> = {
  home: "m3 10 9-7 9 7v11h-6v-7H9v7H3Z",
  search: "M21 21l-6-6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  pencil: "m3 21 1-6L16 3l5 5L9 20Zm11-16 5 5",
  star: "m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
  review: "M7 3h13v18H4V6h3Zm0 0v5M8 12h8M8 16h6",
  arrow: "m9 5 7 7-7 7",
  back: "m15 5-7 7 7 7",
  book: "M12 5v16M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-6-2-10 1Z",
  bolt: "m13 2-9 12h7l-1 8 10-13h-8Z",
  target: "M21 12a9 9 0 1 1-9-9M16 12a4 4 0 1 1-4-4M12 12l9-9m-5 0h5v5",
  chart: "M3 14h4v7H3ZM10 9h4v12h-4ZM17 3h4v18h-4Z",
  settings:
    "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2",
  check: "m5 12 4 4L20 5",
};
export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={`icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
export function Bridge() {
  return (
    <svg
      className="bridge"
      viewBox="0 0 720 200"
      fill="none"
      aria-hidden="true"
    >
      <g fill="currentColor" opacity=".18">
        <path d="M0 195V142h26v-35h20v88h14v-68h25v-24h15v92h18v-46h30v46h420v-62h20v-28h28v90h18v-80h30v80h22v-48h34v48Z" />
      </g>
      <g stroke="currentColor" strokeWidth="4" strokeLinejoin="round">
        <path d="M-20 152h760M-20 166h760M145 198V60l18-18 18 18v138M535 198V60l18-18 18 18v138M145 75h36m354 0h36M0 140l145-65 115 60h175l118-60 167 65M0 140h720" />
        <path
          strokeWidth="2"
          d="m20 132 35 20 35-53 35 53 38-66 38 66 35-30 35 30 35-17 35 17 35-17 35 17 35-17 35 17 35-36 35 36 33-66 35 66 35-49 35 49 35-21M163 42V25m390 17V25M145 94l36 31-36 26m390-57 36 31-36 26"
        />
      </g>
    </svg>
  );
}
export function Meter({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="meter"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
