import React from "react";
import {
  Text,
  SafeAreaView,
  View,
  Button,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { app, db } from "../firebaseConfig";
import "../assets/defaultProfileIcon.png";
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uploadImage from "../../hooks/uploadImage";
import pickImage from "../../hooks/pickImage";
import Navbar from "../../components/navbar";

const ProfileScreen = ({ navigation }) => {
  // Profile information states
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [accountType, setAccountType] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [emergencyContactName, setEmergencyContactName] = React.useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] =
    React.useState("");
  const [emergencyContactEmail, setEmergencyContactEmail] = React.useState("");
  const [numberOfChildren, setNumberOfChildren] = React.useState("");
  const [numberOfAdults, setNumberOfAdults] = React.useState("");
  const [numberOfPets, setNumberOfPets] = React.useState("");
  const [medicalConditions, setMedicalConditions] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [profilePicture, setProfilePicture] = React.useState(null);

  // Modal usage state
  const [modalVisible, setModalVisible] = React.useState(false);

  // Instantiation of auth
  const auth = getAuth(app);

  // If on web all good, other platforms require permissions
  React.componentDidMount = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  // When page loads, get user information
  React.useEffect(() => {
    const loadData = async () => {
      const docSnap = await getSnapshot();

      if (docSnap.exists()) {
        const data = docSnap.data();
        setEmail(data?.email ?? "");
        setUsername(data?.username ?? "");
        setAddress(data?.address ?? "");
        setAccountType(data?.accountType ?? "");
        setPhoneNumber(data?.phoneNumber ?? "");
        setDob(data?.dob ?? "");
        setEmergencyContactName(data?.emergencyContactName ?? "");
        setEmergencyContactNumber(data?.emergencyContactNumber ?? "");
        setEmergencyContactEmail(data?.emergencyContactEmail ?? "");
        setNumberOfChildren(data?.numberOfChildren ?? "");
        setNumberOfAdults(data?.numberOfAdults ?? "");
        setNumberOfPets(data?.numberOfPets ?? "");
        setMedicalConditions(data?.medicalConditions ?? "");
        setFirstName(data?.firstName ?? "");
        setLastName(data?.lastName ?? "");
      } else {
        console.log("No such document!");
      }
    };
    loadData();
  }, []);

  const getSnapshot = async () => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
  };

  const handleSave = async () => {
    const docSnap = await getSnapshot();

    await updateDoc(doc(db, "users", docSnap.id), {
      email: email,
      username: username,
      address: address,
      accountType: accountType,
      phoneNumber: phoneNumber,
      dob: dob,
      emergencyContactName: emergencyContactName,
      emergencyContactNumber: emergencyContactNumber,
      emergencyContactEmail: emergencyContactEmail,
      numberOfChildren: numberOfChildren,
      numberOfAdults: numberOfAdults,
      numberOfPets: numberOfPets,
      medicalConditions: medicalConditions,
      firstName: firstName,
      lastName: lastName,
    })
      .then(() => {
        console.log("Document successfully written!");
        navigation.reset({
          index: 0,
          routes: [{ name: "Profile" }],
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const uploadPhoto = async () => {
    const uri = await pickImage();
    if (uri !== null) {
      const url = await uploadImage(uri);
      setProfilePicture(url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.container}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.profileContainer}>
            <LinearGradient
              colors={["#192f6a", "#3b5998", "#4c669f"]}
              style={styles.bubble}
              start={{ x: 0, y: 0.75 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.header}>Public Profile</Text>
              <View style={styles.imageContainer}>
                {profilePicture === null ? (
                  <Image
                    source={require("../assets/defaultProfileIcon.png")}
                    style={styles.profilePicture}
                  />
                ) : (
                  <Image
                    source={{ uri: profilePicture }}
                    style={styles.profilePicture}
                  />
                )}

                <Button title="Upload Photo" onPress={() => uploadPhoto()} />
              </View>
              <Text style={styles.profileName}>
                {auth.currentUser.displayName}
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.infoContainer}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
              // style={styles.editInfoModal}
            >
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={["#192f6a", "#3b5998", "#4c669f"]}
                  style={styles.bubbleModal}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                >
                  <Text style={styles.header}>Edit Account Information</Text>
                  <ScrollView style={styles.infoSection}>
                    <View style={styles.namesLabelContainer}>
                      <Text style={[styles.label, styles.name]}>
                        First Name
                      </Text>
                      <Text style={[styles.label, styles.name]}>Last Name</Text>
                    </View>
                    <View style={styles.namesContainer}>
                      <TextInput
                        style={[styles.input, styles.name]}
                        autoCapitalize="none"
                        placeholder="Jane"
                        value={firstName}
                        onChangeText={(text) => setFirstName(text)}
                      />
                      <TextInput
                        style={[styles.input, styles.name]}
                        autoCapitalize="none"
                        placeholder="Smith"
                        value={lastName}
                        onChangeText={(text) => setLastName(text)}
                      />
                    </View>
                    {/* </View> */}
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="email@email.com"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                    />
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="BuffaloBillsFan123"
                      value={username}
                      onChangeText={(text) => setUsername(text)}
                    />
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="123 Street Name, County, State Zip"
                      value={address}
                      onChangeText={(text) => setAddress(text)}
                    />
                    <Text style={styles.label}>Account Type</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="(basic, volunteer, authority, authority coordinator)"
                      value={accountType}
                      onChangeText={(text) => setAccountType(text)}
                    />
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="(123)-456-7890"
                      value={phoneNumber}
                      onChangeText={(text) => setPhoneNumber(text)}
                    />
                    <Text style={styles.label}>Date of Birth</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="January 1, 2000"
                      value={dob}
                      onChangeText={(text) => setDob(text)}
                    />
                    <Text style={[styles.label, styles.sectionTitle]}>
                      Emergency Contact Information
                    </Text>
                    <Text style={styles.description}>
                      This will be used only in emergency situations, such as
                      being incapacitated or unable to be reached during a
                      disaster situation.
                    </Text>
                    <Text style={styles.label}>Emergency Contact Name</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="John Smith"
                      value={emergencyContactName}
                      onChangeText={(text) => setEmergencyContactName(text)}
                    />
                    <Text style={styles.label}>Emergency Contact Number</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="(123)-456-7890"
                      value={emergencyContactNumber}
                      onChangeText={(text) => setEmergencyContactNumber(text)}
                    />
                    <Text style={styles.label}>Emergency Contact Email</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="email@email.com"
                      value={emergencyContactEmail}
                      onChangeText={(text) => setEmergencyContactEmail(text)}
                    />
                    <Text style={[styles.label, styles.sectionTitle]}>
                      Household Information
                    </Text>
                    <Text style={styles.description}>
                      This information will be used to help first responders
                      determine the number of people and pets that may need
                      assistance during a disaster situation.
                    </Text>
                    <Text style={styles.label}>Number of Adults</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="2"
                      value={numberOfAdults}
                      onChangeText={(text) => setNumberOfAdults(text)}
                    />
                    <Text style={styles.label}>Number of Children</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="3"
                      value={numberOfChildren}
                      onChangeText={(text) => setNumberOfChildren(text)}
                    />
                    <Text style={styles.label}>Number of Pets</Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="Number of Pets"
                      value={numberOfPets}
                      onChangeText={(text) => setNumberOfPets(text)}
                    />
                    <Text style={styles.label}>
                      Significant Medical Conditions or Disabilities
                    </Text>
                    <TextInput
                      style={styles.input}
                      autoCapitalize="none"
                      placeholder="Chronic Heart Disease, Asthma, Depression, etc."
                      value={medicalConditions}
                      onChangeText={(text) => setMedicalConditions(text)}
                    />
                  </ScrollView>
                  <View style={styles.infoFooter}>
                    <Pressable
                      onPress={() => handleSave()}
                      style={styles.saveModal}
                    >
                      Save Info
                    </Pressable>
                    <Pressable
                      onPress={() => setModalVisible(false)}
                      style={styles.closeModal}
                    >
                      Close modal
                    </Pressable>
                  </View>
                </LinearGradient>
              </View>
            </Modal>
            <LinearGradient
              colors={["#192f6a", "#3b5998", "#4c669f"]}
              style={styles.bubble}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
              <Text style={styles.header}>Account Information</Text>
              <View>
                <Text style={[styles.label, styles.sectionTitle]}>
                  Personal Information
                </Text>
                <Text style={styles.label}>
                  Significant Medical Conditions or Disabilities
                </Text>
              </View>
              <View>
                <Text style={[styles.label, styles.sectionTitle]}>
                  Household Information
                </Text>
                <Text style={styles.label}>
                  Number of Adults: {numberOfAdults}
                </Text>
                <Text style={styles.label}>
                  Number of Children: {numberOfChildren}
                </Text>
                <Text style={styles.label}>Number of Pets: {numberOfPets}</Text>
                <Text style={styles.label}>
                  Significant Medical Conditions or Disabilities:{" "}
                  {medicalConditions}
                </Text>
              </View>
              <View>
                <Text style={[styles.label, styles.sectionTitle]}>
                  Emergency Contact Information
                </Text>
              </View>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={styles.modalOpen}
              >
                Edit account information
              </Pressable>
            </LinearGradient>
          </View>
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    top: 0,
  },
  sectionContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  infoContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  imageContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  namesContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 10,
  },
  namesLabelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  bubble: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bubbleModal: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    flex: 1,
    width: "50%",
    height: "100%",
    alignContent: "center",
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    placeholderTextColor: "grey",
  },
  infoSection: {
    width: "100%",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  names: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    width: "100%",
  },
  infoFooter: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    margin: 10,
  },
  label: {
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    borderTopWidth: 1,
    borderTopColor: "black",
    marginRigth: 15,
  },
  description: {
    margin: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  modalContainer: {
    width: "100%",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
  },
  closeModal: {
    backgroundColor: "grey",
    borderRadius: 10,
    borderColor: "red",
    borderWidth: 4,
    padding: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },
  saveModal: {
    backgroundColor: "grey",
    borderRadius: 10,
    borderColor: "blue",
    borderWidth: 4,
    padding: 10,
    fontWeight: "bold",
  },
  modalOpen: {
    backgroundColor: "grey",
    borderRadius: 10,
    borderColor: "blue",
    borderWidth: 4,
    padding: 10,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
