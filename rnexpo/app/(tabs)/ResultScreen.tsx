import React, { useState, useEffect } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";

const ResultsScreen = ({ route }) => {
  const { score, total, quizType } = route.params || {};

  const [refreshing, setRefreshing] = useState(false);
  const [resultsData, setResultsData] = useState([]);

  useEffect(() => {
    if (score !== undefined && total !== undefined) {
      const newResult = {
        nick: "Ty",
        score,
        total,
        type: quizType || "Ogólne",
        date: new Date().toISOString().split("T")[0],
      };
      setResultsData((prevData) => [newResult, ...prevData]);
    }
  }, [score, total]);

  const fetchResults = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("https://tgryl.pl/quiz/results?last=30");
      const data = await response.json();
      setResultsData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchResults();
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultCard}>
      <Text style={styles.resultTitle}>{item.nick}</Text>
      <View style={styles.resultDetails}>
        <Text style={styles.resultText}>Wynik: {item.score}/{item.total}</Text>
        <Text style={styles.resultText}>Typ: {item.type}</Text>
        <Text style={styles.resultDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wyniki</Text>
      <FlatList
        data={resultsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  resultCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    width: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resultDetails: {
    marginTop: 10,
  },
  resultText: {
    fontSize: 16,
    color: "#555",
  },
  resultDate: {
    marginTop: 5,
    fontSize: 14,
    color: "#888",
  },
});

export default ResultsScreen;
