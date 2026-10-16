"use client";
const icons = {
  system: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  dark: <path d="M20.5 14a8.5 8.5 0 0 1-10.5-10.5A8.5 8.5 0 1 0 20.5 14Z" />,
};
export default function ThemePicker({
  value: theme,
  onChange: setTheme,
  labels,
}) {
  return (
    <div className="theme-picker" role="group" aria-label={labels.themeLabel}>
      {Object.entries(icons).map(([value, icon]) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          aria-label={labels[value]}
          title={labels[value]}
          onClick={() => setTheme(value)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {icon}
          </svg>
        </button>
      ))}
    </div>
  );
}
