/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {
  ADD_POINTS,
  TOTAL_POINTS_USER,
  POINTS_PER_CONTAINER,
  MODIFY_USER,
  ADD_USER,
} from './Queries';

interface IContainerData {
  points: number;
  items: number;
}

interface IUserData {
  name: string;
  surname: string;
  password: string;
  studies: string;
  college: string;
  niu: string;
  totalpoints: number;
  container_data: {
    amarillo: IContainerData;
    azul: IContainerData;
    verde: IContainerData;
    marron: IContainerData;
    gris: IContainerData;
  };
}

interface IUser {
  _id: string;
  userdata: IUserData;
}

interface ServerContextData {
  addUser: (
    name: string,
    surname: string,
    password: string,
    studies: string,
    college: string,
    niu: string,
  ) => Promise<IUser | null>;
  modifyUser: (
    name: string,
    surname: string,
    password: string,
    studies: string,
    college: string,
    niu: string,
  ) => Promise<IUser | null>;
  addPoints: (
    niu: string,
    container: string,
    items: number,
  ) => Promise<IUser | null>;
  totalPointsUser: (niu: string) => Promise<number>;
  pointsPerContainer: (niu: string) => Promise<IContainerData[]>;

}

const defaultContextValue: ServerContextData = {
  addUser: async () => null,
  modifyUser: async () => null,
  addPoints: async () => null,
  totalPointsUser: async () => 0,
  pointsPerContainer: async () => [],

};

export const ServerContext =
  createContext<ServerContextData>(defaultContextValue);

interface ServerProviderProps {
  children: ReactNode;
}

export const ServerProvider: React.FC<ServerProviderProps> = ({children}) => {
  const [addPointsMutation] = useMutation(ADD_POINTS);
  const [modifyUserMutation] = useMutation(MODIFY_USER);
  const [addUserMutation] = useMutation(ADD_USER);


  const addUser = async (
    name: string,
    surname: string,
    password: string,
    studies: string,
    college: string,
    niu: string,
  ) => {
    const {data} = await addUserMutation({
      variables: {name, surname, password, studies, college, niu},
    });
    return data?.addUser;
  };

  const modifyUser = async (
    name: string,
    surname: string,
    password: string,
    studies: string,
    college: string,
    niu: string,
  ) => {
    const {data} = await modifyUserMutation({
      variables: {name, surname, password, studies, college, niu},
    });
    return data?.modifyUser;
  };

  const addPoints = async (niu: string, container: string, items: number) => {
    const {data} = await addPointsMutation({
      variables: {niu, container, items},
    });
    return data?.addPoints;
  };

  const totalPointsUser = async (niu: string) => {
    const {data} = await useQuery(TOTAL_POINTS_USER, {variables: {niu}});
    return data?.totalPointsUser;
  };

  const pointsPerContainer = async (niu: string) => {
    const {data} = await useQuery(POINTS_PER_CONTAINER, {variables: {niu}});
    return data?.pointsPerContainer;
  };


  // Provide functions and state through context
  return (
    <ServerContext.Provider
      value={{
        addUser,
        modifyUser,
        addPoints,
        totalPointsUser,
        pointsPerContainer,
      }}>
      {children}
    </ServerContext.Provider>
  );
};

export const useServerContext = () => useContext(ServerContext);

export default ServerProvider;
