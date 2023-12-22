import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Colors from "../constants/Colors";

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.cardContainer}>
      <Text
        style={{
          ...styles.title,
          color: Colors[colorScheme ?? "light"].text,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          ...styles.card,
          backgroundColor: Colors[colorScheme ?? "light"].card,
        }}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 0,
  },
  card: {
    paddingTop: 20,
    paddingLeft: 15,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    position: "relative",
    top: 0, // Ajusta según necesidad
    left: 0, // Ajusta según necesidad
  },
});

export default Card;
