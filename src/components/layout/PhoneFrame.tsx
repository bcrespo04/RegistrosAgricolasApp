import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-100 flex items-start justify-center py-6 px-3">
      <div className="w-full max-w-sm">
        <div className="rounded-[2.25rem] border-8 border-stone-900 bg-stone-50 shadow-2xl overflow-hidden">
          <div className="h-7 bg-stone-900 flex items-center justify-center">
            <div className="h-1 w-16 rounded-full bg-stone-700" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
