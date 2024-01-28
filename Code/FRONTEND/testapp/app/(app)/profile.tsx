import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Platform,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function ProfileScreen() {
  const { userData, user, signout } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      <View style={styles.profileHeader}>
        <Icon name="user-circle" size={100} color="#4F8EF7" />
        <Text style={styles.profileName}>
          {userData.name} {userData.surname}
        </Text>
      </View>

      <View style={styles.profileDetails}>
        <ProfileDetailItem label="Estudios" value={userData.studies} />
        <ProfileDetailItem label="Universidad" value={userData.college} />
        <ProfileDetailItem label="NIU" value={user} />
        <ProfileDetailItem
          label="Puntos totales"
          value={userData.totalpoints.toString()}
        />
      </View>

      <TouchableOpacity onPress={signout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const ProfileDetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600", // iOS-like font weight
    marginTop: 10,
    color: "#333", // Dark text for readability
  },
  profileDetails: {
    width: "100%",
    paddingHorizontal: 20,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea", // Soft border color
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  logoutButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 30,
    backgroundColor: "#007AFF", // iOS blue color
    alignSelf: "center",
    width: "90%",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
