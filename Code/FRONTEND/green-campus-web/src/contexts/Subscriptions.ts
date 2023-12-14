import { gql } from "@apollo/client";


export const UPDATED_DATA= gql`
subscription UpdatedData {
    updatedData {
      date
      id
      measurements {
        acceleration
        distance
        humidity
        signal
        temperature
      }
    }
  }
`;

export const CREATED_DATA= gql`
subscription CreatedData {
    createdData {
      _id
      idZone
      containers {
        data {
          date
          id
          measurements {
            acceleration
            distance
            humidity
            signal
            temperature
          }
        }
        idContainer
      }
    }
  }
`;

