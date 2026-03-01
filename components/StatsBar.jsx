export default function StatsBar({ stats }) {
  const items = [
    { label: "Visits",   value: stats.visits,   title: "Times this app was opened in this browser" },
    { label: "Projects", value: stats.projects,  title: "Total projects created" },
    { label: "Tickets",  value: stats.tickets,   title: "Total bug tickets generated" },
    { label: "Exports",  value: stats.exports,   title: "Times a ticket was copied to clipboard" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(({ label, value, title }) => (
        <div
          key={label}
          title={title}
          className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-center"
        >
          <p className="text-2xl font-bold text-indigo-600">{value}</p>
          <p className="mt-0.5 text-xs text-gray-500 font-medium uppercase tracking-wide">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
