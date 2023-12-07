"use client";
import React from "react";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";
import getUserInfo from "../../hooks/getUserInfo";
const HomeScreen = () => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [mainContent, setMainContent] = React.useState("dashboard");

  React.useEffect(() => {
    async function loadUserInfo() {
      const userInformation = await getUserInfo();
      // setUserInfo(userInformation);
      // pageContent();
      console.log(userInfo);
      // const token = await generateJwt();
    }
    loadUserInfo();
    console.log(userInfo);
  }, []);

  const pageContent = () => {
    return (
      <div className="flex flex-row justify-around center-items w-full h-full">
        <div
          className="rounded-lg shadow-lg overflow-hidden p-5 m-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            width: "25%",
            // borderRadius: "5px",
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl font-bold border-b border-white">
              Send an Alert
            </h1>
            <br />
            <div></div>
          </div>
        </div>
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
              View Dashboard
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
              ? tableauContent()
              : userNeedsContent()}
          </div>
        </div>
      </div>
    );
  };

  const userNeedsContent = () => {
    return <div>User Needs</div>;
  };

  const tableauContent = () => {
    if (userInfo === null) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    } else {
      if (!userInfo.accountSetup) {
        return (
          <div>
            <p>Looks like you haven't set up your account yet!</p>
          </div>
        );
      } else {
        return (
          <div>
            <p>Good job creating your account!</p>
            <tableau-viz
              id="tableauViz"
              src="https://your-tableau-server/views/my-workbook/my-view"
              token="JWT generated from connected app secrets"
            ></tableau-viz>
          </div>
        );
      }
    }
  };

  const tableauUrl =
    "https://prod-useast-b.online.tableau.com/t/communitydashboard/views/disabilities_communities/Dashboard2/b347fd8f-9ae1-4fc9-8c1a-867b5bdd6120/8c879fdb-6fd7-46a4-bb88-a01be172d755?:embed=yes";

  return (
    <div className="flex flex-col items-center justify-center h-full w-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      {pageContent()}
      {/* <iframe src={tableauUrl} height="90%" width="90%" /> */}
    </div>
  );
};

export default HomeScreen;
