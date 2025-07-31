import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const SlerfEarnApp());
}

class SlerfEarnApp extends StatelessWidget {
  const SlerfEarnApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => SlerfEarnState(),
      child: MaterialApp(
        title: 'SlerfEarn',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
        ),
        home: const SlerfEarnHomePage(),
      ),
    );
  }
}

class SlerfEarnState extends ChangeNotifier {
  var current = WordPair.random();

  void generateNext() {
    current = WordPair.random();
    notifyListeners();
  }
}

class SlerfEarnHomePage extends StatelessWidget {
  const SlerfEarnHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    var appState = context.watch<SlerfEarnState>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('SlerfEarn Generator'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Your Slerf Idea:',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(
              appState.current.asPascalCase,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => context.read<SlerfEarnState>().generateNext(),
              icon: const Icon(Icons.refresh),
              label: const Text('New Idea'),
            ),
          ],
        ),
      ),
    );
  }
}
