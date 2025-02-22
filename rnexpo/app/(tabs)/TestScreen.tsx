import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const tasks = [
  {
    question: "Który wódz po śmierci Gajusza Mariusza prowadził wojnę domową z Sullą?",
    answers: [
      { content: "LUCJUSZ CYNNA", isCorrect: true },
      { content: "JULIUSZ CEZAR", isCorrect: false },
      { content: "LUCJUSZ MURENA", isCorrect: false },
      { content: "MAREK KRASSUS", isCorrect: false },
    ],
    duration: 30,
  },
  {
    question: "Który pierwiastek chemiczny ma symbol 'O'?",
    answers: [
      { content: "Tlen", isCorrect: true },
      { content: "Węgiel", isCorrect: false },
      { content: "Azot", isCorrect: false },
      { content: "Hel", isCorrect: false },
    ],
    duration: 20,
  },
  {
    question: "Jak nazywa się stolica Francji?",
    answers: [
      { content: "Berlin", isCorrect: false },
      { content: "Madryt", isCorrect: false },
      { content: "Paryż", isCorrect: true },
      { content: "Rzym", isCorrect: false },
    ],
    duration: 15,
  },
];

const TestScreen = ({ route, navigation }) => {
  const quizType = route?.params?.quizType || "Ogólne"; // Pobranie quizType z parametrów lub domyślnie "Ogólne"
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < tasks.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
  };

 const sendResults = async (nick, score, total, quizType) => {
   try {
     const response = await fetch("http://tgryl.pl/quiz/result", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         nick: nick,
         score: score,
         total: total,
         type: quizType,
       }),
     });
     if (response.ok) {
       console.log("Wyniki zostały pomyślnie wysłane.");
     } else {
       console.error("Błąd podczas wysyłania wyników:", response.status);
     }

   } catch (error) {
     console.error("Błąd podczas wysyłania wyników:", error);
     const text = await error.response.text(); // Logowanie odpowiedzi serwera
     console.log("Serwer odpowiedział:", text);
   }
 };



  if (showResults) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz zakończony!</Text>
        <Text style={styles.text}>Twój wynik: {score} / {tasks.length}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            sendResults("Gracz", score, tasks.length, quizType); // Wysłanie wyników
            navigation.navigate("Results", {
              nick: "Gracz",
              score: score,
              total: tasks.length,
              quizType: quizType,
              date: new Date().toISOString().split("T")[0],
            });
            resetQuiz(); // Resetowanie quizu po zakończeniu
          }}
        >
          <Text style={styles.buttonText}>Zobacz wyniki</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={resetQuiz} // Opcja rozpoczęcia quizu od nowa
        >
          <Text style={styles.buttonText}>Zacznij od nowa</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.quizType}>Kategoria: {quizType}</Text>
      <Text style={styles.title}>{tasks[currentQuestionIndex].question}</Text>
      {tasks[currentQuestionIndex].answers.map((answer, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => handleAnswer(answer.isCorrect)}
        >
          <Text style={styles.buttonText}>{answer.content}</Text>
        </TouchableOpacity>
      ))}
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
  quizType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
 fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TestScreen;
