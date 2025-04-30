import { Text, View, TouchableWithoutFeedback, Dimensions, StyleSheet, Animated, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const GRAVITY = 2;
const JUMP_FORCE = -20;
const PIPE_WIDTH = 80;
const PIPE_GAP = 250;
const PIPE_SPEED = 5;
const MAX_ROTATION = 50;

export default function Index() {
  const router = useRouter();
  const { playerName } = useLocalSearchParams(); 
  const [birdY, setBirdY] = useState(SCREEN_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: SCREEN_WIDTH, height: Math.random() * (SCREEN_HEIGHT - PIPE_GAP) }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const cloudAnimation = useRef(new Animated.Value(0)).current;

  const [clouds, setClouds] = useState(
    Array.from({ length: 5 }).map((_, i) => ({
      top: Math.random() * (SCREEN_HEIGHT * 0.2),
      left: i * (SCREEN_WIDTH / 2),
    }))
  );

  useEffect(() => {
    Animated.loop(
      Animated.timing(cloudAnimation, {
        toValue: -SCREEN_WIDTH,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    if (gameOver) {
      saveScore(playerName as string, score); 
      return;
    }

    const gameLoop = setInterval(() => {
      setVelocity((prev) => prev + GRAVITY);
      setBirdY((prev) => prev + velocity);

      setPipes((prev) => {
        const updated = prev
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter((pipe) => pipe.x + PIPE_WIDTH > 0);

        return updated;
      });

      if (pipes[0]?.x < SCREEN_WIDTH / 2 - PIPE_WIDTH / 2 && pipes.length === 1) {
        const newHeight = Math.random() * (SCREEN_HEIGHT - PIPE_GAP);
        setPipes([...pipes, { x: SCREEN_WIDTH, height: newHeight }]);
        setScore((prev) => prev + 1);
      }

      const birdHitsPipe = pipes.some(
        (pipe) =>
          (birdY < pipe.height || birdY > pipe.height + PIPE_GAP) &&
          pipe.x < SCREEN_WIDTH / 2 + 25 &&
          pipe.x + PIPE_WIDTH > SCREEN_WIDTH / 2 - 25
      );

      if (birdHitsPipe) setGameOver(true);
    }, 30);

    return () => clearInterval(gameLoop);
  }, [birdY, pipes, gameOver]);

  const birdRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    birdRotation.setValue(Math.min((velocity / JUMP_FORCE) * MAX_ROTATION, MAX_ROTATION));
  }, [velocity]);

  const jump = () => {
    if (!gameOver) {
      setVelocity(JUMP_FORCE);
    } else {
      setGameOver(false);
      setBirdY(SCREEN_HEIGHT / 2);
      setVelocity(0);
      setPipes([{ x: SCREEN_WIDTH, height: Math.random() * (SCREEN_HEIGHT - PIPE_GAP) }]);
      setScore(0);
    }
  };

  const birdRotationStyle = {
    transform: [
      {
        rotate: birdRotation.interpolate({
          inputRange: [-MAX_ROTATION, MAX_ROTATION],
          outputRange: ["25deg", "0deg"],
        }),
      },
    ],
  };

  const saveScore = async (name: string, score: number) => {
    try {
      const storedScores = await AsyncStorage.getItem("leaderboard");
      const scores = storedScores ? JSON.parse(storedScores) : [];
      const existingPlayerIndex = scores.findIndex((entry: { name: string; score: number }) => entry.name === name);
  
      if (existingPlayerIndex !== -1) {
        if (score > scores[existingPlayerIndex].score) {
          scores[existingPlayerIndex].score = score;
        }
      } else {
        scores.push({ name, score });
      }
  
      await AsyncStorage.setItem("leaderboard", JSON.stringify(scores));
    } catch (error) {
      console.error("Error hehe", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={jump}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
          <Image source={require("../assets/images/close.png")} style={styles.backImage} />
        </TouchableOpacity>
        {clouds.map((cloud, index) => (
          <Animated.View
            key={index}
            style={[
              styles.clouds,
              {
                transform: [{ translateX: cloudAnimation }],
                top: cloud.top,
                left: cloud.left,
              },
            ]}
          >
            <Image source={require("../assets/images/cloud.png")} style={styles.cloudImage} resizeMode="contain" />
          </Animated.View>
        ))}
        <Animated.Image
          source={require("../assets/images/bee.png")}
          style={[styles.bird, birdRotationStyle, { top: birdY }]}
          resizeMode="contain"
        />

        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            {Array.from({ length: Math.ceil(pipe.height / PIPE_WIDTH) }).map((_, i) => (
              <Image
                key={`top-${index}-${i}`}
                source={require("../assets/images/flowerpipe.png")}
                style={[
                  styles.pipeSegment,
                  {
                    left: pipe.x,
                    top: i * PIPE_WIDTH,
                    transform: [{ rotate: "180deg" }],
                  },
                ]}
                resizeMode="contain"
              />
            ))}
            {Array.from({ length: Math.ceil((SCREEN_HEIGHT - pipe.height - PIPE_GAP) / PIPE_WIDTH) }).map((_, i) => (
              <Image
                key={`bottom-${index}-${i}`}
                source={require("../assets/images/flowerpipe.png")}
                style={[
                  styles.pipeSegment,
                  {
                    left: pipe.x,
                    top: pipe.height + PIPE_GAP + i * PIPE_WIDTH,
                  },
                ]}
                resizeMode="contain"
              />
            ))}
          </React.Fragment>
        ))}

        <Text style={styles.score}>{score}</Text>
        {gameOver && (
          <>
            <Text style={styles.gameOver}>--- GAME OVER ---</Text>
            <TouchableOpacity style={styles.restartButton} onPress={() => router.push("/leaderboards")}>
              <Text style={styles.restartButtonText}>View Leaderboard</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
    overflow: "hidden",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backImage: {
    width: 40,
    height: 40,
  },
  clouds: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.2,
  },
  cloudImage: {
    width: SCREEN_WIDTH * 0.9,
    height: "100%",
  },
  bird: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_WIDTH * 0.12,
    position: "absolute",
    left: SCREEN_WIDTH / 2 - (SCREEN_WIDTH * 0.1) / 2,
    // borderWidth: 1, test q lng hitbox
  },
  pipeSegment: {
    position: "absolute",
    width: PIPE_WIDTH,
    height: PIPE_WIDTH,
  },
  score: {
    position: "absolute",
    top: 50,
    left: SCREEN_WIDTH / 2 - 25,
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontFamily: "PixelifySans",
    backgroundColor: "#3e96d780",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  gameOver: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2 - 30,
    fontSize: 40,
    color: "#000",
    fontWeight: "700",
    fontFamily: "PixelifySans",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    backgroundColor: "#ffffff99",
    width: SCREEN_WIDTH * 1,
    
  },
  restartButton: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2 + 30,
    backgroundColor: "#ff4a4a99",
    alignItems: "center",
    width: SCREEN_WIDTH * 1,
    padding: 10,
  },
  restartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    // width: "100%",
  },
});