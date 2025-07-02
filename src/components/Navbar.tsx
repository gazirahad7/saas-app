"use client";

import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="text-white hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/middleware" className="text-white hover:text-gray-300">
              Middleware
            </Link>
          </li>

          <li>
            <Link href="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
          </li>

          <li>
            <Link href="/signup" className="text-white hover:text-gray-300">
              Signup
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
