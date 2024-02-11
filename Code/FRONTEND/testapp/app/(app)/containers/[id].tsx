import React, { useState } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Link, router } from "expo-router";
import { Modal } from 'react-native';

function getColor(idContainer: string) {
  switch (idContainer) {
    case "amarillo" && "yellow":
      return "yellow";
    case "azul" && "blue":
      return "blue";
    case "verde" && "green":
      return "green";
    case "marron" && "brown":
      return "brown";
    default:
      return "gray";
  }
}

const CustomAlert = ({ visible, onClose, totalPoints, containerCount }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Puntos Ganados</Text>
        <Text>Has ganado {totalPoints} puntos por seleccionar {containerCount} contenedores!</Text>
        <Button onPress={onClose} title="OK" />
      </View>
    </View>
  </Modal>
);

const IdZonePage = () => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const { containers } = useLocalSearchParams();
  const containerColors = containers ? (Array.isArray(containers) ? containers[0] : containers).split(",") : [];

  const handlePress = () => {
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
    router.navigate("/");
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      {containerColors.map((colorName, index) => (
        <View key={index} style={{ flex: 1, backgroundColor: getColor(colorName.trim()) }} />
      ))}
      <View style={{ padding: 20 }}>
        <Button title="Presiona aquí" onPress={handlePress} />
      </View>
      <CustomAlert
        visible={isAlertVisible}
        onClose={handleCloseAlert}
        totalPoints={containerColors.length * 10}
        containerCount={containerColors.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold"
  }
});

export default IdZonePage;
