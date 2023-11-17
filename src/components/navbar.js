import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.logoOuter}>
        Good Neigh<Text style={styles.logoInner}>UB</Text>ors
      </Text>
      <Pressable onPress={() => navigation.navigate("Home")}>
        <Text style={styles.navbarButton}>Home</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.navbarButton}>Profile</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    backgroundColor: "grey",
    height: 50,
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    flexDirection: "row",
  },
  logoOuter: {
    fontWeight: "bold",
    fontSize: 30,
    color: "blue",
  },
  logoInner: {
    fontWeight: "bold",
    fontSize: 30,
    color: "white",
  },
  navbarButton: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
});

export default Navbar;
