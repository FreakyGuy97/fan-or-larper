import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUESTIONS, getVerdict, shuffled } from './questions';

const SCORE_KEY = 'fanorlarper:scores';
const TOTAL = QUESTIONS.length;

const COLORS = {
  bg: '#0d0d16',
  card: '#171726',
  text: '#f2f2fa',
  dim: '#9a9ab5',
  green: '#2bff88',
  purple: '#a855f7',
  red: '#ff5c5c',
  gold: '#ffd23f',
};

export default function App() {
  const [screen, setScreen] = useState('home'); // home | quiz | result
  const [name, setName] = useState('');
  const [round, setRound] = useState([]); // shuffled questions for this game
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null); // option index chosen, or null
  const [board, setBoard] = useState([]); // leaderboard entries

  useEffect(() => {
    loadBoard();
  }, []);

  async function loadBoard() {
    try {
      const raw = await AsyncStorage.getItem(SCORE_KEY);
      setBoard(raw ? JSON.parse(raw) : []);
    } catch {
      setBoard([]);
    }
  }

  async function saveScore(playerName, finalScore) {
    const entry = {
      name: playerName || 'Anonymous',
      score: finalScore,
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [...board, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setBoard(next);
    try {
      await AsyncStorage.setItem(SCORE_KEY, JSON.stringify(next));
    } catch {}
  }

  function startGame() {
    setRound(shuffled(QUESTIONS));
    setIndex(0);
    setScore(0);
    setPicked(null);
    setScreen('quiz');
  }

  function choose(i) {
    if (picked !== null) return; // lock in the first tap
    setPicked(i);
    if (i === round[index].answer) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= round.length) {
      const finalScore = score;
      saveScore(name.trim(), finalScore);
      setScreen('result');
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      {screen === 'home' && (
        <HomeScreen
          name={name}
          setName={setName}
          board={board}
          onStart={startGame}
        />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          q={round[index]}
          index={index}
          picked={picked}
          onChoose={choose}
          onNext={next}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          name={name.trim() || 'Anonymous'}
          score={score}
          board={board}
          onReplay={startGame}
          onHome={() => setScreen('home')}
        />
      )}
    </SafeAreaView>
  );
}

/* ------------------------------ HOME ------------------------------ */

function HomeScreen({ name, setName, board, onStart }) {
  return (
    <ScrollView contentContainerStyle={styles.center}>
      <Text style={styles.kicker}>VIDEO GAME TRIVIA</Text>
      <Text style={styles.title}>
        FAN <Text style={styles.titleAccent}>or</Text> LARPER?
      </Text>
      <Text style={styles.subtitle}>
        {TOTAL} questions. Real fans rise. Larpers get exposed.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your gamer tag"
        placeholderTextColor={COLORS.dim}
        value={name}
        onChangeText={setName}
        maxLength={16}
      />

      <Pressable style={styles.primaryBtn} onPress={onStart}>
        <Text style={styles.primaryBtnText}>START QUIZ</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>HALL OF FAME (and shame)</Text>
      {board.length === 0 ? (
        <Text style={styles.dim}>No scores yet. Be the first legend.</Text>
      ) : (
        board.slice(0, 5).map((e, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.rowRank}>#{i + 1}</Text>
            <Text style={styles.rowName}>{e.name}</Text>
            <Text style={styles.rowScore}>
              {e.score}/{TOTAL}
            </Text>
          </View>
        ))
      )}
      <Text style={styles.hint}>
        Party mode: pass the phone around, everyone plays, lowest score buys snacks.
      </Text>
    </ScrollView>
  );
}

/* ------------------------------ QUIZ ------------------------------ */

function QuizScreen({ q, index, picked, onChoose, onNext }) {
  if (!q) return null;
  const revealed = picked !== null;

  return (
    <View style={styles.quizWrap}>
      <Text style={styles.progress}>
        QUESTION {index + 1} / {TOTAL}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${((index + 1) / TOTAL) * 100}%` }]}
        />
      </View>

      <Text style={styles.question}>{q.q}</Text>

      {q.options.map((opt, i) => {
        let btnStyle = styles.option;
        let txtStyle = styles.optionText;
        if (revealed) {
          if (i === q.answer) {
            btnStyle = [styles.option, styles.optionCorrect];
            txtStyle = [styles.optionText, styles.optionTextDark];
          } else if (i === picked) {
            btnStyle = [styles.option, styles.optionWrong];
            txtStyle = [styles.optionText, styles.optionTextDark];
          } else {
            btnStyle = [styles.option, styles.optionDimmed];
          }
        }
        return (
          <Pressable
            key={i}
            style={btnStyle}
            onPress={() => onChoose(i)}
            disabled={revealed}
          >
            <Text style={txtStyle}>{opt}</Text>
          </Pressable>
        );
      })}

      {revealed && (
        <View style={styles.factBox}>
          <Text style={styles.fact}>{q.fact}</Text>
          <Pressable style={styles.primaryBtn} onPress={onNext}>
            <Text style={styles.primaryBtnText}>
              {index + 1 >= TOTAL ? 'SEE MY VERDICT' : 'NEXT'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/* ----------------------------- RESULT ----------------------------- */

function ResultScreen({ name, score, board, onReplay, onHome }) {
  const verdict = getVerdict(score);
  const exposed = score <= 4;

  return (
    <ScrollView contentContainerStyle={styles.center}>
      <Text style={styles.kicker}>THE VERDICT IS IN</Text>
      <Text style={[styles.title, exposed && styles.titleRed]}>
        {verdict.title}
      </Text>
      <Text style={styles.subtitle}>{verdict.line}</Text>

      <Text style={styles.bigScore}>
        {score}
        <Text style={styles.bigScoreTotal}>/{TOTAL}</Text>
      </Text>
      <Text style={styles.dim}>{name} took the test.</Text>

      <Pressable style={styles.primaryBtn} onPress={onReplay}>
        <Text style={styles.primaryBtnText}>RUN IT BACK</Text>
      </Pressable>
      <Pressable style={styles.ghostBtn} onPress={onHome}>
        <Text style={styles.ghostBtnText}>HOME</Text>
      </Pressable>

      <Text style={styles.sectionLabel}>LEADERBOARD</Text>
      {board.slice(0, 5).map((e, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.rowRank}>#{i + 1}</Text>
          <Text style={styles.rowName}>{e.name}</Text>
          <Text style={styles.rowScore}>
            {e.score}/{TOTAL}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* ----------------------------- STYLES ----------------------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  kicker: {
    color: COLORS.purple,
    fontWeight: '800',
    letterSpacing: 3,
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleAccent: {
    color: COLORS.green,
    fontStyle: 'italic',
  },
  titleRed: {
    color: COLORS.red,
    fontSize: 32,
  },
  subtitle: {
    color: COLORS.dim,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  primaryBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#0d0d16',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  ghostBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a40',
    marginBottom: 8,
  },
  ghostBtnText: {
    color: COLORS.dim,
    fontWeight: '700',
    letterSpacing: 1,
  },
  sectionLabel: {
    color: COLORS.dim,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 11,
    marginTop: 28,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  rowRank: {
    color: COLORS.gold,
    fontWeight: '900',
    width: 40,
  },
  rowName: {
    color: COLORS.text,
    fontWeight: '700',
    flex: 1,
  },
  rowScore: {
    color: COLORS.green,
    fontWeight: '900',
  },
  dim: {
    color: COLORS.dim,
    fontSize: 13,
    textAlign: 'center',
  },
  hint: {
    color: COLORS.dim,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
  quizWrap: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  progress: {
    color: COLORS.purple,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.card,
    borderRadius: 3,
    marginBottom: 24,
  },
  progressFill: {
    height: 6,
    backgroundColor: COLORS.purple,
    borderRadius: 3,
  },
  question: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 24,
  },
  option: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  optionCorrect: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  optionWrong: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },
  optionDimmed: {
    opacity: 0.4,
  },
  optionTextDark: {
    color: '#0d0d16',
  },
  factBox: {
    marginTop: 8,
  },
  fact: {
    color: COLORS.dim,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 20,
  },
  bigScore: {
    color: COLORS.green,
    fontSize: 72,
    fontWeight: '900',
    marginVertical: 8,
  },
  bigScoreTotal: {
    fontSize: 28,
    color: COLORS.dim,
  },
});
