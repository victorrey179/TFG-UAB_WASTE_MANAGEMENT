import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from "react-native";
import Card from "../../../components/Card";
import Colors from "../../../constants/Colors";
import Caroussel from "@/components/Caroussel";
import RankingList from "@/components/Ranking";

const screenWidth = Dimensions.get("window").width;
const cardMargin = 15; // Margen a derecha e izquierda para cada tarjeta

const getCurrentDate = () => {
  const weekDays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const date = new Date();
  const weekDay = weekDays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${weekDay}, ${day} de ${month}`;
};

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const currentDate = getCurrentDate();
  return (
    <ScrollView
      style={{
        ...styles.scrollView,
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      <View
        style={{
          ...styles.container,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text
            style={{
              ...styles.title,
              color: Colors[colorScheme ?? "light"].text,
            }}
          >
            Resumen
          </Text>
        </View>
        <View style={styles.cardContainer}>
          <Caroussel />
        </View>
        {/* <View style={styles.cardContainer}>
          <Card title="Ranking" children={<RankingList/>} />
        </View> */}
        <View style={styles.cardContainer}>
          <Card title="Premios" children={undefined} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  date: {
    fontSize: 18,
    color: "gray",
  },
  titleContainer: {
    paddingBottom: 20, // Ajusta según necesidad
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 30, // Ajusta el tamaño según necesidad
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: screenWidth - 2 * cardMargin, // Ancho de la pantalla menos los márgenes
    marginHorizontal: cardMargin, // Margen horizontal para el contenedor de la tarjeta
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    width: "100%", // La tarjeta ocupa todo el ancho del contenedor
  },
  scrollView: {
    flex: 1,
  },
});
