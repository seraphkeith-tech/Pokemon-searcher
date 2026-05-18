export default function Skeleton() {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-8 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="mt-4 flex justify-center">
        <div className="h-32 w-32 rounded-full bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}
