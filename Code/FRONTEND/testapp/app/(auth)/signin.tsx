// /* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext"; // Asegúrate de que la ruta es correcta
import { useLazyQuery } from "@apollo/client";
import { LOGIN } from "../../contexts/Queries";

export default function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");
  const [niu, setNiu] = useState("");
  const [password, setPassword] = useState("");

  const { signin } = useAuth();
  const [executeLogin, { loading, error, data }] = useLazyQuery(LOGIN, {
    onCompleted: (data) => {
      // Aquí manejas los datos recibidos
      signin(data.login.userdata); // Ejemplo: función signin con los datos de usuario
      setIsLoading(false); // Desactivar el indicador de carga
    },
    onError: (error) => {
      // Aquí manejas el error
      console.log(error);
      setErrorLogin(error.message); // Actualizar el estado con el mensaje de error
      setIsLoading(false); // Desactivar el indicador de carga
    }
  });

  const handleSignIn = () => {
    setIsLoading(true);
    setErrorLogin(""); // Limpiar errores previos
    executeLogin({ variables: { niu, password } }); // Ejecutar la consulta
  };

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
      {loading || isLoading ? (
        // Mostrar el ActivityIndicator cuando la consulta está cargando
        <ActivityIndicator size="large" />
      ) : (
        // Mostrar el botón de inicio de sesión cuando la consulta no está cargando
        <Button
          title="Sign In"
          onPress={handleSignIn}
          disabled={isLoading}
        />
      )}
      {error || errorLogin ? (
        // Mostrar el mensaje de error si hay alguno
        <Text style={styles.error}>{error ? error.message : errorLogin}</Text>
      ) : null}
    </View>
  );
}

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
