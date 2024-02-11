import React from "react";
import { StyleSheet, Dimensions, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { View } from "../Themed";
import { useServer } from "@/contexts/ServerContext";

const screenWidth = Dimensions.get("window").width;

const ClassificationChart: React.FC<{ show: string }> = ({ show }) => {
  const { totalPoints, pointsPerContainer } = useServer();
  if (pointsPerContainer) {
    if (show === "points") {
      const barData = [
        {
          value: pointsPerContainer.pointsPerContainer.azul.points,
          frontColor: "rgba(0, 123, 255, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(0, 123, 255, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.azul.points}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
          spacing: 30,
        },
        {
          value: pointsPerContainer.pointsPerContainer.amarillo.points,
          frontColor: "rgba(255, 193, 7, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(255, 193, 7, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.amarillo.points}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
          spacing: 30,
        },
        {
          value: pointsPerContainer.pointsPerContainer.verde.points,
          frontColor: "rgba(40, 167, 69, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(40, 167, 69, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.verde.points}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
          spacing: 30,
        },
        {
          value: pointsPerContainer.pointsPerContainer.marron.points,
          frontColor: "rgba(150, 75, 0, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(150, 75, 0, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.marron.points}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
          spacing: 30,
        },
        {
          value: pointsPerContainer.pointsPerContainer.gris.points,
          frontColor: "rgba(108, 117, 125, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(108, 117, 125, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.gris.points}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
        },
      ];
      return (
        <BarChart
          barWidth={25}
          barBorderRadius={4}
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          isAnimated={true}
          hideYAxisText
          hideRules
          width={screenWidth - 50}
          height={220}
        />
      );
    } else {
      const barData = [
        {
          value: pointsPerContainer.pointsPerContainer.azul.items,
          frontColor: "rgba(0, 123, 255, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(0, 123, 255, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.azul.items}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
          spacing: 30,
        },
        {
          value: pointsPerContainer.pointsPerContainer.amarillo.items,
          frontColor: "rgba(255, 193, 7, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(255, 193, 7, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.amarillo.items}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
          spacing: 30,
        },
        {
          value: pointsPerContainer.pointsPerContainer.verde.items,
          frontColor: "rgba(40, 167, 69, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(40, 167, 69, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.verde.items}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
          spacing: 30,
        },
        {
          value: pointsPerContainer.pointsPerContainer.marron.items,
          frontColor: "rgba(150, 75, 0, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(150, 75, 0, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.marron.items}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
          spacing: 30,
        },
        {
          value: pointsPerContainer.pointsPerContainer.gris.items,
          frontColor: "rgba(108, 117, 125, 1)",
          topLabelComponent: () => (
            <Text
              style={{
                color: "rgba(108, 117, 125, 1)",
                fontSize: 16,
                marginBottom: 0,
                width: 50,
                textAlign: "center",
              }}
            >
              {pointsPerContainer.pointsPerContainer.gris.items}
            </Text>
          ),
          onPress: () => console.log("Pressed"),
        },
      ];
      return (
        <BarChart
          barWidth={25}
          barBorderRadius={4}
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          isAnimated={true}
          hideYAxisText
          hideRules
          width={screenWidth - 50}
          height={220}
        />
      );
    }
  } else {
    console.log("hola");
  }
};

export default ClassificationChart;

const styles = StyleSheet.create({});
