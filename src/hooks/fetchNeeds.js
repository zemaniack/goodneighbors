import { collection, getDocs, query, where } from "firebase/firestore";
import { app, db } from "../../firebaseConfig";

const fetchNeeds = async (userId = null) => {
  console.log("here");
  let needsList = [];
  if (userId) {
    const needsRef = collection(db, "needs");
    const q = query(needsRef, where("uid", "==", userId));
    const needs = await getDocs(q);
    needsList = needs.docs.map((doc) => doc.data());
  } else {
    const needsRef = collection(db, "needs");
    const needs = await getDocs(needsRef);
    needsList = needs.docs.map((doc) => doc.data());
  }
  console.log(needsList);
  return needsList;
};

export default fetchNeeds;
