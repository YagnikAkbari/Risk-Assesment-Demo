export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Dashboard navigation/sidebar can be added here */}
      <main>{children}</main>
    </div>
  );
}
