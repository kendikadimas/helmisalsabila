interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-6 flex items-stretch gap-3.5 ${className}`}>
      <div className="w-1.5 bg-[#26A69A] rounded-full shrink-0 self-stretch" />
      <div className="flex flex-col justify-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
