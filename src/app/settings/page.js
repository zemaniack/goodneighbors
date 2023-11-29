"use client";
import React from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app, db } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import Link from "next/link";

const SettingsScreen = () => {
  const auth = getAuth(app);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful.");
      router.push("/authentication");
    } catch (error) {
      console.log("An error happened.");
    }
  };

  const handleDelete = async () => {
    try {
      // await db.collection("users").doc(auth.currentUser.uid).delete();
      await auth.currentUser.delete();
      console.log("Account deleted.");
      router.push("/authentication");
    } catch (error) {
      console.log("An error happened.");
    }
  };

  return (
    <div className="pt-10 min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-5">Settings Screen</h1>
      <div className="w-auto flex-col items-center justify-center space-y-5">
        <div
          className="rounded-full h-auto w-auto flex bg-teal-400 p-2 cursor-pointer items-center justify-center"
          onClick={handleSignOut}
        >
          Sign Out
        </div>
        <Link
          href="/profile"
          className="rounded-full h-auto w-auto flex bg-blue-400 p-2 cursor-pointer items-center justify-center"
        >
          Back to Profile
        </Link>
        <div
          className="rounded-full h-auto w-auto flex bg-red-400 p-2 cursor-pointer items-center justify-center"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete your account?")
            ) {
              handleDelete();
            }
          }}
        >
          Delete Account
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
