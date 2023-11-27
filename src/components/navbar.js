import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full h-10 flex justify-between items-center bg-blue-500">
      <h1 className="text-2xl">Good NeighUBors</h1>
      <div className="links flex space-x-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/settings">Settings</Link>
      </div>
    </div>
  );
};

export default Navbar;
