import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import global_en from "./locale/en/global.json";
import global_es from "./locale/es/global.json";
import global_ca from "./locale/ca/global.json";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({ uri: "http://192.168.1.34:4000/graphql" });
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: { reconnect: true },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

i18next.init({
  interpolation: { escapeValue: true },
  lng: "es",
  resources: {
    en: {
      global: global_en,
    },
    es: {
      global: global_es,
    },
    ca: {
      global: global_ca,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ApolloProvider client={client}>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </ApolloProvider>
);

reportWebVitals();
