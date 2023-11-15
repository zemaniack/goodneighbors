import React from "react";
import { SafeAreaView, Text, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { app } from "../firebaseConfig";
import Navbar from "../components/navbar";

const SettingsScreen = ({ navigation }) => {
  const auth = getAuth(app);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Sign-out successful.");
        console.log(auth.currentUser);
        navigation.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        });
      })
      .catch((error) => {
        // An error happened.
        console.log("An error happened.");
      });
  };

  return (
    <SafeAreaView>
      <Navbar />
      <Text>Settings Screen</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Back to Profile" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

export default SettingsScreen;
