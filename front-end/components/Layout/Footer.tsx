import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { History } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-transparent">
      <Link href="/profile" passHref>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 transition ${
            pathname === "/profile" ? "bg-black" : "bg-white"
          }`}
        >
          <InformationCircleIcon
            className={`w-6 h-6 transition ${
              pathname === "/profile" ? "text-white" : "text-gray-600"
            }`}
          />
        </div>
      </Link>

      <Link href="/" passHref>
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 transition ${
            pathname === "/"
              ? "bg-black border-white"
              : "bg-white border-gray-200"
          }`}
        >
          <HomeIcon
            className={`w-7 h-7 transition ${
              pathname === "/" ? "text-white" : "text-gray-400"
            }`}
          />
        </div>
      </Link>

      <Link href="/report" passHref>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 transition ${
            pathname === "/report" ? "bg-black" : "bg-white"
          }`}
        >
          <History
            className={`w-5 h-5 transition ${
              pathname === "/report" ? "text-white" : "text-gray-600"
            }`}
          />
        </div>
      </Link>
    </div>
  );
}
