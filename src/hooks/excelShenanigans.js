import firebase from "firebase/app";
import "firebase/firestore";
import { writeFile, readFile, utils } from "xlsx";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

const exportFirestoreDataToExcel = async () => {
  const fetchDataFromFirestore = async () => {
    try {
      console.log("Fetching data from Firestore...");
      // const snapshot = await db.collection("needs").get();
      const needsRef = collection(db, "needs");
      const snapshot = await getDocs(needsRef);
      console.log(snapshot);
      const data = [];

      // Convert the date to a format that Excel can understand
      const convertDate = (timestamp) => {
        const dateObject = timestamp.toDate();
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();
        return `${month}/${day}/${year}`;
      };

      // data["dateRequested"] = convertDate(data["dateRequested"]);

      snapshot.forEach((doc) => {
        // Assuming your Firestore data structure has fields 'field1', 'field2', etc.
        const docData = doc.data();
        docData["dateRequested"] = convertDate(docData["dateRequested"]);
        data.push({
          address: docData.address,
          category: docData.category,
          dateRequested: docData.dateRequested,
          description: docData.description,
          dob: docData.dob,
          fulfilled: docData.fulfilled,
          lat: docData.lat,
          lng: docData.lng,
          name: docData.name,
          needName: docData.needName,
          phoneNumber: docData.phoneNumber,
          uid: docData.uid,
          urgency: docData.urgency,
          volunteer: docData.volunteer,
        });
      });

      return data;
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      return null;
    }
  };

  const exportDataToExcel = async () => {
    console.log("Preparing data to export...");
    const data = await fetchDataFromFirestore();

    if (!data) {
      console.error("No data available to export.");
      return;
    }

    // Prepare data as an array of objects
    const worksheet = utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "FirestoreData");

    // Generate a file and trigger download
    writeFile(workbook, "FirestoreData.xlsx");
  };

  // Call the export function to trigger the process
  await exportDataToExcel();
};

const addDataToExcel = async (newDataItem) => {
  try {
    const existingFilePath = "FirestoreData.xlsx";
    const workbook = readFile(existingFilePath);

    let existingData = [];
    if (workbook.Sheets && workbook.SheetNames.length) {
      existingData = utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
    }

    // Add the new data item to the existing data
    existingData.push(newDataItem);

    // Create a new worksheet with updated data
    const worksheet = utils.json_to_sheet(existingData);

    // Update the existing workbook with the new worksheet
    workbook.Sheets[workbook.SheetNames[0]] = worksheet;

    // Save the updated workbook back to the file
    writeFile(workbook, existingFilePath);
  } catch (error) {
    console.error("Error adding data to Excel file:", error);
  }
};

export { exportFirestoreDataToExcel, addDataToExcel };
