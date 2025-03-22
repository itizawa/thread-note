import { urls } from "@/consts/urls";
import Link from "next/link";

export const Footer = () => (
  <footer className="bg-gray-800 text-white py-6">
    <div className="container mx-auto text-center space-y-8">
      <div className="container mx-auto text-center space-y-2">
        <h2 className="text-2xl font-bold">Thread Note</h2>
        <nav className="space-x-6">
          <Link href={urls.terms} className="text-gray-300 hover:text-white">
            利用規約
          </Link>
          <a
            href="https://site.wai-ware.com/"
            className="text-gray-300 hover:text-white"
            target="blank"
          >
            運営団体
          </a>
        </nav>
      </div>
      <p className="text-sm">&copy; 2025 Thread Note. All rights reserved.</p>
    </div>
  </footer>
);
