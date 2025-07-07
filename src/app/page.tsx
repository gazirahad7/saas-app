import LoginPage from "@/components/Login";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* <h1 className="text-3xl font-bold ">
        Welcome to Next.js with Tailwind CSS!
      </h1> */}

        <h1 className="text-3xl font-bold mb-4  text-center py-20">
          Landing Page
        </h1>
      </div>
    </>
  );
}
