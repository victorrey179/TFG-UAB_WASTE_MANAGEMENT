/* eslint-disable prettier/prettier */
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
// import { WebSocketLink } from "@apollo/client/link/ws";
//import {getMainDefinition} from '@apollo/client/utilities';

// const httpLink = new HttpLink({
//   uri: 'http://192.168.1.33:4000/graphql',
// });
// const wsLink = new WebSocketLink({
//   uri: "ws://192.168.1.33:4000/graphql",
//   options: { reconnect: true },
// });

// const link = split(
//   ({query}) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   //   wsLink,
//   httpLink,
// );

const client = new ApolloClient({
  uri: "http://192.168.1.34:4000/graphql",
  cache: new InMemoryCache(),
});

export default client;
