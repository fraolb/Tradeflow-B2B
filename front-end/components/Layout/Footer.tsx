import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { History } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white p-2 rounded-full shadow-lg border border-[#E9ECEF]">
      <Link href="/profile" passHref>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
            pathname === "/profile"
              ? "bg-[#4361EE] text-white"
              : "bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]"
          }`}
        >
          <InformationCircleIcon className="w-6 h-6" />
        </div>
      </Link>

      <Link href="/" passHref>
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
            pathname === "/"
              ? "bg-[#4361EE] text-white"
              : "bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]"
          }`}
        >
          <HomeIcon className="w-7 h-7" />
        </div>
      </Link>

      <Link href="/report" passHref>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
            pathname === "/report"
              ? "bg-[#4361EE] text-white"
              : "bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E9ECEF]"
          }`}
        >
          <History className="w-5 h-5" />
        </div>
      </Link>
    </div>
  );
}
