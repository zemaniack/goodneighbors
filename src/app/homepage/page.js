"use client";
import React from "react";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";
import getUserInfo from "../../hooks/getUserInfo";
import generateJwt from "../../hooks/generateToken";
import fetchNeeds from "@/hooks/fetchNeeds";

const HomeScreen = () => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [mainContent, setMainContent] = React.useState("dashboard");
  const [needs, setNeeds] = React.useState(null);

  React.useEffect(() => {
    // loads the Tableau Embedding API for embedding the dashboard.
    async function loadTableauLibrary() {
      const script = document.createElement("script"); // create a script element for the tableau
      script.type = "module";
      script.src =
        "https://embedding.tableauusercontent.com/tableau.embedding.3.1.0.min.js";

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
    loadTableauLibrary();
    console.log("Tableau Embedding Library loaded.");
  }, []);

  React.useEffect(() => {
    async function loadUserInfo() {
      try {
        const userInformation = await getUserInfo();
        setUserInfo(userInformation);
        const needs = await fetchNeeds();
        setNeeds(needs);
      } catch {
        console.log("Failed to get user info.");
      }
    }
    loadUserInfo();
    console.log(userInfo);
  }, []);

  React.useEffect(() => {
    async function getToken() {
      try {
        const token = await generateJwt(); // generate and set token for Tableau access
        console.log("Generated token: ", token);
        setToken(token);
      } catch (error) {
        console.error("Error generating token.", error);
      }
    }
    if (token === null) {
      getToken();
      console.log("Generated token: ", token);
    }
    // setToken(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyZWRmODE3LTk2ZGItNDc1Zi1hNzNhLThjNTMyZWZkYjkzMCIsImlzcyI6ImQ2OTUyYjNiLTVjNGQtNGZlNC1hM2U1LTBiNzA2ZGFjYTE1MCJ9.eyJqdGkiOiI1MDVjMzc1MS1iMWJkLTQ1Y2QtOTE3NC00YWYzNTIxZDcxOGYiLCJhdWQiOiJ0YWJsZWF1Iiwic3ViIjoidGFibGVhOTU1NUBnbWFpbC5jb20iLCJzY3AiOlsidGFibGVhdTp2aWV3czplbWJlZCIsInRhYmxlYXU6dmlld3M6ZW1iZWRfYXV0aG9yaW5nIiwidGFibGVhdTphc2tfZGF0YTplbWJlZCJdLCJraWQiOiIxMmVkZjgxNy05NmRiLTQ3NWYtYTczYS04YzUzMmVmZGI5MzAiLCJpc3MiOiJkNjk1MmIzYi01YzRkLTRmZTQtYTNlNS0wYjcwNmRhY2ExNTAiLCJpYXQiOjE3MDIwMDk5MDcsImV4cCI6MTcwMjAxMDUwN30.HmuNUdV2eqGCls0kXs_2moyKE_tNTe2ou5tZ3hcqBwY
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyZWRmODE3LTk2ZGItNDc1Zi1hNzNhLThjNTMyZWZkYjkzMCIsImlzcyI6ImQ2OTUyYjNiLTVjNGQtNGZlNC1hM2U1LTBiNzA2ZGFjYTE1MCJ9.eyJqdGkiOiI1MDVjMzc1MS1iMWJkLTQ1Y2QtOTE3NC00YWYzNTIxZDcxOGYiLCJhdWQiOiJ0YWJsZWF1Iiwic3ViIjoidGFibGVhOTU1NUBnbWFpbC5jb20iLCJzY3AiOlsidGFibGVhdTp2aWV3czplbWJlZCIsInRhYmxlYXU6dmlld3M6ZW1iZWRfYXV0aG9yaW5nIiwidGFibGVhdTphc2tfZGF0YTplbWJlZCJdLCJraWQiOiIxMmVkZjgxNy05NmRiLTQ3NWYtYTczYS04YzUzMmVmZGI5MzAiLCJpc3MiOiJkNjk1MmIzYi01YzRkLTRmZTQtYTNlNS0wYjcwNmRhY2ExNTAiLCJpYXQiOjE3MDIwMDk5MDcsImV4cCI6MTcwMjAxMDUwN30.HmuNUdV2eqGCls0kXs_2moyKE_tNTe2ou5tZ3hcqBwY`);
  }, []);

  const pageContent = () => {
    return (
      <div className="flex flex-row justify-around center-items w-full h-full">
        <div
          className="rounded-lg shadow-lg overflow-hidden p-3 m-5 flex flex-col justify-around"
          style={{
            width: "70%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            className="w-full flex flex-row justify-around"
            style={{ height: "7%" }}
          >
            <div
              className={
                "rounded-lg shadow-lg overflow-hidden p-2 text-xl font-bold cursor-pointer h-min"
              }
              style={{
                backgroundColor:
                  mainContent === "dashboard"
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
              onClick={() => setMainContent("dashboard")}
            >
              View Needs Dashboard
            </div>
            <div
              className={
                "rounded-lg shadow-lg overflow-hidden p-2 text-xl font-bold cursor-pointer h-min"
              }
              style={{
                backgroundColor:
                  mainContent === "alerts"
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
              onClick={() => setMainContent("alerts")}
            >
              Send Alerts
            </div>
            <div
              v
              className={
                "rounded-lg shadow-lg overflow-hidden p-2 text-xl font-bold cursor-pointer h-min"
              }
              style={{
                backgroundColor:
                  mainContent === "needs"
                    ? "rgba(255, 255, 255, 0.25)"
                    : "rgba(255, 255, 255, 0.1)",
              }}
              onClick={() => setMainContent("needs")}
            >
              View User Needs
            </div>
          </div>
          <div
            className="rounded-lg shadow-lg overflow-hidden p-2 w-full h-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              height: "90%",
            }}
          >
            {mainContent === "dashboard"
              ? tableauContent1()
              : mainContent === "alerts"
              ? tableauContent2()
              : userNeedsContent()}
          </div>
        </div>
      </div>
    );
  };

  const userNeedsContent = () => {
    return (
      <div className="overflow-hidden p-5 w-full overflow-y-auto h-[70vh]">
        <div className="flex flex-wrap justify-around">
          {needs.map((need) => {
            let date;
            if (need.dateRequested instanceof Date) {
              date = need.dateRequested;
            } else if (need.dateRequested?.toDate) {
              date = need.dateRequested.toDate();
            } else if (
              need.dateRequested &&
              !isNaN(Date.parse(need.dateRequested))
            ) {
              date = new Date(need.dateRequested);
            } else {
              console.error(`Invalid date: ${need.dateRequested}`);
              return null; // Skip this item if the date is invalid
            }
            const dateString = date.toISOString().split("T")[0];
            return (
              <div
                className="flex flex-col flex-grow h-full justify-around rounded-lg shadow-lg p-2 m-2 h-min"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  maxWidth: "300px",
                }}
              >
                <h2 className="text-xl font-bold border-b-2 border-white flex flex-row justify-between">
                  {need.needName}
                </h2>
                <div>
                  <span className="font-bold">Description:</span>{" "}
                  {need.description}
                </div>
                <div>
                  <span className="font-bold">Urgency:</span> {need.urgency}
                </div>
                <div>
                  <span className="font-bold">Date Requested:</span>{" "}
                  {dateString}
                </div>
                <div>
                  <span className="font-bold">Fulfilled:</span>{" "}
                  {need.fulfillment ? "Yes" : "No"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const tableauContent1 = () => {
    const tableauUrl =
      "https://prod-useast-b.online.tableau.com/t/communityserver95/views/map/Dashboard1";
    if (userInfo === null) {
      return (
        <div className="w-full h-full align-center">
          <p>Loading...</p>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full">
          <tableau-viz
            id="tableauViz"
            width="100%"
            height="100%"
            hide-tabs="false"
            src={tableauUrl}
            device="Desktop"
            toolbar="bottom"
            token={token}
          ></tableau-viz>
        </div>
      );
    }
  };

  const tableauContent2 = () => {
    const tableauUrl =
      "https://prod-useast-b.online.tableau.com/#/site/communityserver95/views/disabilities_communities/Dashboard2/84185b2a-686a-4709-892c-d1a022f473d6/6ec1fe26-7aea-41cd-92ad-ca31a14be50a";
    if (userInfo === null) {
      return (
        <div className="w-full h-full align-center">
          <p>Loading...</p>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full">
          <tableau-viz
            id="tableauViz"
            width="100%"
            height="100%"
            hide-tabs="false"
            src={tableauUrl}
            device="Desktop"
            toolbar="bottom"
            token={token}
          ></tableau-viz>
        </div>
      );
    }
  };
  // new url

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      {pageContent()}
      {/*<iframe src={tableauUrl} height="90%" width="90%" />*/}
    </div>
  );
};

export default HomeScreen;
