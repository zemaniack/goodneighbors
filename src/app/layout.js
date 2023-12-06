"use client";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, db } from "../../firebaseConfig";
import "./globals.css";
import Navbar from "@/components/navbar";

export default function RootLayout({ children }) {
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/authentication");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-grow pt-20">{children}</div>
      </body>
    </html>
  );
}
