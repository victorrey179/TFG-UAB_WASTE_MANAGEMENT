import React from "react";
import { StyleSheet, Dimensions, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { View } from "../Themed";

const screenWidth = Dimensions.get("window").width;

const ClassificationChart: React.FC = () => {
  const barData = [
    {
      value: 1000,
      frontColor: "rgba(0, 123, 255, 1)",
      topLabelComponent: () => (
        <Text
          style={{
            color: "rgba(0, 123, 255, 1)",
            fontSize: 18,
            marginBottom: 6,
            width: 50,
            textAlign: "center",
          }}
        >
          1000
        </Text>
      ),
      onPress: () => console.log("Pressed"),
      spacing: 30,
    },
    {
      value: 745,
      frontColor: "rgba(255, 193, 7, 1)",
      topLabelComponent: () => (
        <Text
          style={{
            color: "rgba(255, 193, 7, 1)",
            fontSize: 18,
            marginBottom: 6,
            width: 50,
            textAlign: "center",
          }}
        >
          745
        </Text>
      ),
      onPress: () => console.log("Pressed"),
      spacing: 30,
    },
    {
      value: 600,
      frontColor: "rgba(40, 167, 69, 1)",
      topLabelComponent: () => (
        <Text
          style={{
            color: "rgba(40, 167, 69, 1)",
            fontSize: 18,
            marginBottom: 6,
            width: 50,
            textAlign: "center",
          }}
        >
          600
        </Text>
      ),
      onPress: () => console.log("Pressed"),
      spacing: 30,
    },
    {
      value: 500,
      frontColor: "rgba(150, 75, 0, 1)",
      topLabelComponent: () => (
        <Text
          style={{
            color: "rgba(150, 75, 0, 1)",
            fontSize: 18,
            marginBottom: 6,
            width: 50,
            textAlign: "center",
          }}
        >
          500
        </Text>
      ),
      onPress: () => console.log("Pressed"),
      spacing: 30,
    },
    {
      value: 745,
      frontColor: "rgba(108, 117, 125, 1)",
      topLabelComponent: () => (
        <Text
          style={{
            color: "rgba(108, 117, 125, 1)",
            fontSize: 18,
            marginBottom: 6,
            width: 50,
            textAlign: "center",
          }}
        >
          745
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
};

export default ClassificationChart;

const styles = StyleSheet.create({});
