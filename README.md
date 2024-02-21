
# BlueCampus

BlueCampus es un sistema de gestión de residuos inteligente diseñado para la Universidad Autónoma de Barcelona (UAB). Utilizando tecnología IoT y LoRaWAN, el proyecto busca optimizar la recogida de residuos mediante el monitoreo en tiempo real de los contenedores, la optimización de rutas de recolección y el fomento de la participación de la comunidad universitaria a través de una aplicación móvil y web.

## Cómo Empezar



## Requisitos previos

 - [Node.js](https://nodejs.org/en)
 - [React (para desarrollo frontend)](https://es.react.dev/)
 - [MongoDB o una base de datos no relacional similar](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)
 - [Expo](https://expo.dev/)
 - [GraphQL](https://graphql.org/)
 - [ApolloServer](https://www.apollographql.com/docs/apollo-server/)
 - [Acceso a una red LoRaWAN o dispositivos compatibles con LoRa para pruebas](https://becolve.com/blog/que-es-lorawan/)
 - [API OpenAI](https://openai.com/blog/openai-api)



## Instalación

Clona el repositorio en tu máquina local

```bash
  git clone https://github.com/victorrey179/TFG-UAB_WASTE_MANAGEMENT.git
```
Instala las dependencias del proyecto:

```bash
  cd TFG-UAB_WASTE_MANAGEMENT
  npm install
```
Configura las variables de entorno necesarias para conectar con tu base de datos y otros servicios.

### Instala Arduino IDE

- [ArduinoIDE](https://www.arduino.cc/en/software)





## Inicio Server

Para iniciar el server ir a la carpeta BACKEND/apolloServer/src

```bash
  npm install
  npm run build
```
```bash
  npm start
```

## Inicio web

Para iniciar la web ir a la carpeta FRONTEND/green-campus-web

```bash
  npm install
  npm start
```

## Inicio app

Para iniciar la app ir a la carpeta FRONTEND/testapp

```bash
  npm install expo
  npm install
  npx expo start
```
