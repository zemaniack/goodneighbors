import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

// This will get the user's info from the database and return it as an object
const getUserInfo = async () => {
  const auth = getAuth(app);
  let user;
  let userData;

  await onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user = currentUser.uid;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        userData = querySnapshot.docs[0].data();
      } else {
        console.log("No such document!");
      }
    } else {
      user = null;
    }
  });

  console.log("getUserInfo returning");

  return userData;
};

export default getUserInfo;
