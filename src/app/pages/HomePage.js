import React from "react";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";
import Navbar from "../components/navbar";
import getUserInfo from "../hooks/getUserInfo";
import { WebView } from "react-native-webview";
import generateJwt from "../hooks/generateToken";

const HomeScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    async function loadUserInfo() {
      const userInformation = await getUserInfo();
      // setUserInfo(userInformation);
      // pageContent();
      console.log(userInfo);
      const token = await generateJwt();
    }
    loadUserInfo();
    console.log(userInfo);
  }, []);

  const pageContent = () => {
    if (userInfo === null) {
      <View>
        <Text>Loading...</Text>
      </View>;
    } else {
      if (!userInfo.accountSetup) {
        return (
          <View>
            <Text>Looks like you haven't set up your account yet!</Text>
          </View>
        );
      } else {
        return (
          <View>
            <Text>Good job creating your account!</Text>
          </View>
        );
      }
    }
  };

  const tableauUrl =
    "https://prod-useast-b.online.tableau.com/t/communitydashboard/views/disabilities_communities/Dashboard2/b347fd8f-9ae1-4fc9-8c1a-867b5bdd6120/8c879fdb-6fd7-46a4-bb88-a01be172d755?:embed=yes";

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.container}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.container}>
          {pageContent()}
          {/* <WebView
            source={{ uri: tableauUrl }} // Pass the Tableau embed code as HTML
          /> */}
          <iframe src={tableauUrl} height={"90%"} width={"90%"} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});

export default HomeScreen;
