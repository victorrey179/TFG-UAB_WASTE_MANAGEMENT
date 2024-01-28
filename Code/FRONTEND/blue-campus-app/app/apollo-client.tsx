import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
  split,
} from "@apollo/client";
// import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: "https://928f-83-44-136-253.ngrok-free.app/graphql",
});
// const wsLink = new WebSocketLink({
//   uri: "ws://192.168.1.33:4000/graphql",
//   options: { reconnect: true },
// });

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  //   wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
