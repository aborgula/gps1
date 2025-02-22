import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const TestListScreen = ({ navigation }) => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('https://tgryl.pl/quiz/tests');
        const data = await response.json();
        console.log(data);
        setTests(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu testów:', error);
      }
    };

    fetchTests();
  }, []);

  const renderTestItem = ({ item }) => (
    <TouchableOpacity
      style={styles.testButton}
      onPress={() => navigation.navigate('Test', { testId: item.id })}
    >
      <Text style={styles.buttonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dostępne testy</Text>
      <FlatList
        data={tests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTestItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default TestListScreen;
