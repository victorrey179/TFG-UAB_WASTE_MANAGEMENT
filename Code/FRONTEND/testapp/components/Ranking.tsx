import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RankingItem = ({ rank, name, score }: { rank: number, name: string, score: number }) => (
  <View style={styles.item}>
    <Text style={styles.rank}>{rank}</Text>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.score}>{score}</Text>
  </View>
);

const RankingList = ({ data }: { data: any }) => (
  <View style={styles.list}>
    {data.map((item: { name: string; score: number; }, index: React.Key | null | undefined) => (
      <RankingItem
        key={index}
        rank={index as number + 1}
        name={item.name}
        score={item.score}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  list: {
    // estilos para la lista
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    // más estilos para cada ítem
  },
  rank: {
    // estilos para el ranking
  },
  name: {
    // estilos para el nombre
  },
  score: {
    // estilos para la puntuación
  },
});

export default RankingList;
