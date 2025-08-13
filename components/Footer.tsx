"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaTelegramPlane,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-transparent px-4 py-8">
      <div className="bg-sky-100 text-black max-w-6xl mx-auto rounded-2xl p-6 shadow-md">
        <div className="flex flex-wrap justify-between">
          <Link href="/">
            <Image
              src="/images/image.png"
              alt="AppAstra Logo"
              width={100}
              height={100}
              className="inline-block mr-2 rounded-full border-2 border-blue-600 shadow-md hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="mb-6 min-w-[150px]">
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/terms-conditions" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:underline">
                  Refunds & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="mb-6 min-w-[150px]">
            {/* Download App */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Download App</h3>
              <a
                href="#"
                className="inline-block bg-white text-sky-700 px-4 py-1 rounded-md border hover:bg-gray-100 transition"
              >
                Coming Soon
              </a>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-semibold mb-2">Follow us</h3>
              <div className="flex space-x-4 text-sky-600 text-xl">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-blue-700"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="hover:text-blue-400"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="hover:text-red-600"
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-pink-500"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="hover:text-sky-700"
                >
                  <FaTelegramPlane />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 mt-6">
          &copy; {new Date().getFullYear()} AppAstra. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
