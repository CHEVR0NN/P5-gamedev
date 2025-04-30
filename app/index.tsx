import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function HomePage() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const startGame = () => {
    if (playerName.trim() === "") {
      alert("Name not entered.");
      return;
    }
    setModalVisible(false);
    router.push({ pathname: "./game", params: { playerName } });
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => setModalVisible(true)}
      >
        <Image
          source={require("../assets/images/play.png")}
          style={styles.playImage}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Your Name</Text>
            <TextInput
              style={styles.input}
              value={playerName}
              onChangeText={setPlayerName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={startGame}>
              <Text style={styles.modalButtonText}>Let's Go !</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  playImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.4,
    gap: 0,
    display: "flex",
    flexDirection: "column",
    marginTop: SCREEN_HEIGHT * 0.35,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#fdc854",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#5e0d30",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "PixelifySans",
    color: "#5e0d30",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontFamily: "PixelifySans",
    fontSize: 18,
    color: "#5e0d30",
  },
  modalButton: {
    backgroundColor: "#5e0d30",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "PixelifySans",
    fontSize: 18,
  },
});