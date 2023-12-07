import firebase from "firebase/app";
import "firebase/firestore";
import XLSX from "xlsx";
import { db } from "../firebaseConfig";

const exportFirestoreDataToExcel = async () => {
  const fetchDataFromFirestore = async () => {
    try {
      const snapshot = await db.collection("needs").get();
      const data = [];

      snapshot.forEach((doc) => {
        // Assuming your Firestore data structure has fields 'field1', 'field2', etc.
        const docData = doc.data();
        data.push({
          dateRequested: docData.dateRequested,
          description: docData.description,
          fulfillment: docData.fulfillment,
          lat: docData.lat,
          lng: docData.lng,
          urgency: docData.urgency,
          name: docData.name,
          uid: docData.uid,
          category: docData.category,
        });
      });

      return data;
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
      return null;
    }
  };

  const exportDataToExcel = async () => {
    const data = await fetchDataFromFirestore();

    if (!data) {
      console.error("No data available to export.");
      return;
    }

    // Prepare data as an array of objects
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FirestoreData");

    // Generate a file and trigger download
    XLSX.writeFile(workbook, "FirestoreData.xlsx");
  };

  // Call the export function to trigger the process
  await exportDataToExcel();
};

const addDataToExcel = async (newDataItem) => {
  try {
    const existingFilePath = "FirestoreData.xlsx";
    const workbook = XLSX.readFile(existingFilePath);

    let existingData = [];
    if (workbook.Sheets && workbook.SheetNames.length) {
      existingData = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );
    }

    // Add the new data item to the existing data
    existingData.push(newDataItem);

    // Create a new worksheet with updated data
    const worksheet = XLSX.utils.json_to_sheet(existingData);

    // Update the existing workbook with the new worksheet
    workbook.Sheets[workbook.SheetNames[0]] = worksheet;

    // Save the updated workbook back to the file
    XLSX.writeFile(workbook, existingFilePath);
  } catch (error) {
    console.error("Error adding data to Excel file:", error);
  }
};

export { exportFirestoreDataToExcel, addDataToExcel };
