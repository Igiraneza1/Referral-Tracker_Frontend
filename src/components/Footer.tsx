export default function Footer() {
  return (
    <footer className="bg-[#1a1a4e] text-gray-400 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs">
        <p>© {new Date().getFullYear()} Referral Tracker - Healthcare System</p>
        <p>Built for better patient care</p>
      </div>
    </footer>
  );
}