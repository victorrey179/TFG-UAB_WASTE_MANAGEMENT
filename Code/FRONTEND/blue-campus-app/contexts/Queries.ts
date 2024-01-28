/* eslint-disable prettier/prettier */
import {gql} from '@apollo/client';

export const ADD_POINTS = gql`
  mutation Mutation($niu: String!, $container: String!, $items: Int!) {
    addPoints(niu: $niu, container: $container, items: $items) {
      userdata {
        niu
        totalpoints
        container_data {
          amarillo {
            points
            items
          }
          azul {
            points
            items
          }
          verde {
            points
            items
          }
          marron {
            points
            items
          }
          gris {
            points
            items
          }
        }
      }
    }
  }
`;

export const TOTAL_POINTS_USER = gql`
  query Query($niu: String!) {
    totalPointsUser(niu: $niu)
  }
`;

export const POINTS_PER_CONTAINER = gql`
  query PointsPerContainer($niu: String!) {
    pointsPerContainer(niu: $niu) {
      amarillo {
        points
        items
      }
      azul {
        points
        items
      }
      verde {
        points
        items
      }
      marron {
        points
        items
      }
      gris {
        points
        items
      }
    }
  }
`;

export const MODIFY_USER = gql`
  mutation Mutation(
    $name: String!
    $surname: String!
    $password: String!
    $studies: String!
    $college: String!
    $niu: String!
  ) {
    modifyUser(
      name: $name
      surname: $surname
      password: $password
      studies: $studies
      college: $college
      niu: $niu
    ) {
      userdata {
        name
        surname
        password
        studies
        college
        niu
        totalpoints
        container_data {
          verde {
            points
            items
          }
          marron {
            points
            items
          }
          gris {
            points
            items
          }
          amarillo {
            points
            items
          }
          azul {
            points
            items
          }
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation(
    $name: String!
    $surname: String!
    $password: String!
    $studies: String!
    $college: String!
    $niu: String!
  ) {
    addUser(
      name: $name
      surname: $surname
      password: $password
      studies: $studies
      college: $college
      niu: $niu
    ) {
      userdata {
        college
        name
        niu
        password
        studies
        surname
        totalpoints
        container_data {
          amarillo {
            items
            points
          }
          azul {
            points
            items
          }
          gris {
            points
            items
          }
          marron {
            points
            items
          }
          verde {
            points
            items
          }
        }
      }
    }
  }
`;

export const LOGIN = gql`
  query Query($niu: String!, $password: String!) {
    login(niu: $niu, password: $password) {
      userdata {
        name
        surname
        password
        studies
        college
        niu
        totalpoints
        container_data {
          amarillo {
            points
            items
          }
          azul {
            points
            items
          }
          verde {
            points
            items
          }
          marron {
            points
            items
          }
          gris {
            points
            items
          }
        }
      }
    }
  }
`;
