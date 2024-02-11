// TabOneScreen.js
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-snap-carousel";
import Card from "./Card";
import ClassificationChart from "./charts/ClassificationChart";

const screenWidth = Dimensions.get("window").width;
const cardMargin = 15;

export default function Caroussel() {
  // Datos de ejemplo para los carruseles
  const carouselItems = [
    {
      title: "Clasificaciones por contenedores",
      data: "classification",
    },
    {
      title: "Puntos por contenedores",
      data: "points",
    },
    // Agrega más elementos según sea necesario
  ];

  // Renderiza un elemento del carrusel
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <Card
        title={item.title}
        children={
          <ClassificationChart show={item.data} />
        }
      />
    );
  };

  return (
    <View>
      <Carousel
        data={carouselItems}
        renderItem={renderItem}
        sliderWidth={screenWidth - 2 * cardMargin}
        itemWidth={screenWidth - 2 * cardMargin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  
});
