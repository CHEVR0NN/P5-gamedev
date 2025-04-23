import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function HomePage() {
  const router = useRouter();

  const startGame = () => {
    router.push("./game");
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Image
          source={require("../assets/images/play.png")}
          style={styles.playImage}
        />
      </TouchableOpacity>
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
    marginTop: 300,
  },
  playImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.4,
  },
});