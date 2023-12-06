import { gql } from "@apollo/client";

export const ZONES_QUERY = gql`
  query {
    zoneIds 
  }
`;

export const STATISTICS_QUERY = gql`
  query Query($zoneId: String!, $duration: String!) {
    dashboardStatistics(zoneId: $zoneId, duration: $duration) {
      containerId
      records {
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
  }
`;

export const DASHBOARD_HTS_QUERY = gql`
  query Query($zoneId: String!) {
    dashboardHTS(zoneId: $zoneId) {
      containerId
      date
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
