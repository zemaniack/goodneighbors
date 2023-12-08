import { collection, getDocs, query, where } from "firebase/firestore";
import { app, db } from "../../firebaseConfig";

const fetchNeeds = async (userId = null) => {
  let needsList = [];
  if (userId) {
    const needsRef = collection(db, "needs");
    const q = query(needsRef, where("uid", "==", userId));
    const needs = await getDocs(q);
    needsList = needs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    const needsRef = collection(db, "needs");
    const needs = await getDocs(needsRef);
    needsList = needs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  return needsList;
};

export default fetchNeeds;
