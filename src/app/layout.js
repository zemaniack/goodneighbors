"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import "./globals.css";
import Navbar from "@/components/navbar";
import { app, db } from "../../firebaseConfig";

export default function RootLayout({ children }) {
  const router = useRouter();
  const auth = getAuth(app);

  const checkUser = () => {
    if (auth.currentUser) {
      console.log("User is logged in");
    } else {
      console.log("No user is logged in");
      router.push("/authentication");
    }
  };
  checkUser();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/authentication");
      }
    });
  }, []);

  return (
    <html lang="en">
      <body className="">
        <Navbar />
        <div className="h-auto">{children}</div>
      </body>
    </html>
  );
}
