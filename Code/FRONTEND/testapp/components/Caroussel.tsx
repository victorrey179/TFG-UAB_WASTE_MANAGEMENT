// TabOneScreen.js
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";
import Card from "./Card";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  // Datos de ejemplo para los carruseles
  const carouselItems = [
    {
      title: "Cardio",
      subtitle: "20 Minutes",
    },
    {
      title: "Strength",
      subtitle: "15 Minutes",
    },
    // Agrega más elementos según sea necesario
  ];

  // Renderiza un elemento del carrusel
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <Card title={item.title} subtitle={item.subtitle} children={undefined} />
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={carouselItems}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={300}
      />
      <Carousel
        data={carouselItems}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={300}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#f0f0f0",
  },
});
