/* eslint-disable prettier/prettier */
// AuthScreen.tsx
import React, { useState, useContext } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { AuthContext } from "../../contexts/AuthContext"; // Make sure the path is correct
import { useLazyQuery } from "@apollo/client";
import { LOGIN } from "../../contexts/Queries";

const AuthScreen: React.FC = () => {
  const [niu, setNiu] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");

  const { signin } = useContext(AuthContext);

  // Utiliza useLazyQuery para realizar la consulta de inicio de sesión
  const [
    executeLogin,
    { data: loginData, loading: queryLoading, error: queryError },
  ] = useLazyQuery(LOGIN, {
    fetchPolicy: "no-cache",
    onCompleted: (_data) => {
      if (loginData?.login?.userdata) {
        //setCurrentUser(loginData.login.userdata); // Usar loginData en lugar de data
        setIsLoading(false);
      } else {
        // Manejar la situación donde la data no tiene la estructura esperada
        setErrorLogin("Unexpected response structure");
        setIsLoading(false);
      }
    },
    onError: (error) => {
      Alert.alert("Authentication Failed", error.message);
      setErrorLogin(error.message);
      setIsLoading(false);
    },
  });

  const handleSignIn = () => {
    setIsLoading(true);
    setErrorLogin("");
    // Ejecutar la consulta de inicio de sesión con las variables niu y password
    executeLogin({ variables: { niu, password } });
  };

  // Actualización de la UI según el estado de la carga
  if (queryLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="NIU"
        value={niu}
        onChangeText={setNiu}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {queryError ? (
        <Text style={styles.error}>{queryError.message}</Text>
      ) : null}
      <Button
        title={isLoading ? "Loading..." : "Sign In"}
        onPress={handleSignIn}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
  },
});

export default AuthScreen;
