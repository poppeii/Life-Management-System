export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#eaf8ff] p-3 text-ink sm:p-4 lg:p-5">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(255,255,255,0.95),transparent_28%),radial-gradient(circle_at_44%_12%,rgba(109,213,250,0.72),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(41,128,185,0.38),transparent_30%),radial-gradient(circle_at_52%_96%,rgba(109,213,250,0.5),transparent_36%)] blur-2xl" />
      <div aria-hidden="true" className="absolute inset-0 bg-white/35" />

      <section className="auth-frame relative z-10 grid w-full max-w-[1320px] gap-3 overflow-hidden rounded-[30px] border-[8px] border-white/85 bg-white/80 p-2 shadow-[0_30px_90px_rgba(49,68,111,0.32)] backdrop-blur-xl lg:grid-cols-[1fr_1fr]">
        <aside className="relative hidden h-full min-h-0 overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#ffffff_0%,#6dd5fa_42%,#2980b9_100%)] p-7 lg:flex lg:flex-col lg:justify-between xl:p-9">
          <div aria-hidden="true" className="absolute left-8 top-[27%] whitespace-nowrap text-[106px] font-black leading-none tracking-normal text-white/90 xl:text-[126px]">
            LIFEOS
          </div>
          <div aria-hidden="true" className="absolute right-8 top-[34%] text-2xl font-semibold uppercase tracking-normal text-white/60">
            Assistance
          </div>
          <div aria-hidden="true" className="absolute -left-24 bottom-20 size-72 rounded-full bg-[#2980b9]/35 blur-3xl" />
          <div aria-hidden="true" className="absolute right-2 top-16 size-64 rounded-full bg-white/45 blur-3xl" />

          <div className="relative mx-auto mt-56 grid size-[260px] place-items-center xl:size-[310px]">
            <div aria-hidden="true" className="absolute inset-x-8 bottom-8 h-24 rounded-full bg-[#6dd5fa]/80 blur-3xl" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-10 h-16 bg-white/35 blur-xl" />
            <div aria-hidden="true" className="auth-glass-orb" />
          </div>

          <div className="relative max-w-[490px] pb-2">
            <h2 className="text-3xl font-bold tracking-normal text-slate-950 xl:text-4xl">Intelligent Life Assistance</h2>
            <p className="mt-4 max-w-[470px] text-lg leading-8 text-slate-700">
              จัดวัน เป้าหมาย และสิ่งสำคัญให้อยู่ในที่เดียว ด้วยจังหวะที่สงบและโฟกัสขึ้น
            </p>
          </div>
        </aside>

        <div className="grid h-full min-h-0">
          <div className="grid h-full min-h-0 place-items-center overflow-y-auto rounded-[22px] bg-[#f7fcff]/90 px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] sm:px-10 lg:px-14 xl:px-16">
            <div className="w-full max-w-[430px]">{children}</div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AuthPanelIntro({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <div className="mb-4 grid size-12 place-items-center rounded-2xl border border-white/70 bg-white/80 text-xl font-black text-slate-400 shadow-[0_10px_24px_rgba(34,31,45,0.12)] backdrop-blur">
        L
      </div>
      <h1 className="text-[2rem] font-black leading-tight tracking-normal text-slate-950 sm:text-[2.3rem]">{title}</h1>
      <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p>
    </div>
  );
}
