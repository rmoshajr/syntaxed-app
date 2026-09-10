// ===== Syntaxed curriculum data (Python MVP) =====
// Teaching method: general/intuitive meaning first, precise definition reinforced after.

const THEMED_ERRORS = [
  "BUG DETECTED — the interpreter tripped over something. Squash it and retry.",
  "SYNTAX GREMLIN — that line confused the compiler. Check your syntax closely.",
  "OUTPUT MISMATCH — your code ran, but produced the wrong result. Recheck your logic.",
  "CONNECTION LOST — your code's logic didn't reach the expected destination. Retrace your steps.",
  "STACK OVERFLOW (of confidence) — something in there isn't quite right. Debug it.",
];
function randomThemedError() {
  return THEMED_ERRORS[Math.floor(Math.random() * THEMED_ERRORS.length)];
}

// Legacy per-object constants (still harmlessly present on lesson/quiz literals below,
// but award math no longer reads them directly — see lessonXpValue/perfectBonusXp).
const XP = { LESSON: 10, QUIZ: 50 };

// Most lessons across the curriculum are built from a standard 6-question pool; a
// lesson with more than that in its own pool counts as "more content" and pays out
// the higher XP tier.
const LARGE_LESSON_QUESTION_THRESHOLD = 7;

// Full-completion XP for a lesson/quiz — computed from content size rather than a
// hand-set field, so it applies uniformly across the whole curriculum.
function lessonXpValue(lesson) {
  if (!lesson) return 0;
  if (lesson.isQuiz) return 50;
  return (lesson.questions && lesson.questions.length >= LARGE_LESSON_QUESTION_THRESHOLD) ? 15 : 10;
}

// Small bonus on top of the full award for a mistake-free run.
function perfectBonusXp(lesson) {
  if (!lesson) return 0;
  if (lesson.isQuiz) return 4;
  return (lesson.questions && lesson.questions.length >= LARGE_LESSON_QUESTION_THRESHOLD) ? 3 : 2;
}

// Stable content signature for a question, used to guarantee nothing is ever asked
// twice in the same lesson/quiz/placement/test-out run even when pools are combined
// from multiple sources (a lesson's own questions + its review bank, etc).
function questionSignature(q) {
  return [q.type, q.prompt, JSON.stringify(q.options || q.pairs || null), q.expected || '', q.answer].join('|');
}
function dedupeQuestions(list) {
  const seen = new Set();
  const out = [];
  list.forEach(q => {
    const sig = questionSignature(q);
    if (seen.has(sig)) return;
    seen.add(sig);
    out.push(q);
  });
  return out;
}

// ---- Lessons ----
// Each lesson carries a POOL of questions (bigger than what's shown in one run).
// LessonEngine randomly samples from the pool each time a lesson is started or replayed.
const LESSONS = {
  // UNIT 1 — First Contact
  u1l1: {
    id: 'u1l1', unit: 'u1', title: 'What Is Code?', icon: '💾', xp: XP.LESSON,
    introLines: [
      "Forget the textbook definition for a second.",
      "Code is just a list of instructions you give a computer.",
      "Written so it can follow them exactly, one step at a time.",
    ],
    questions: [
      { type: 'mcq', prompt: "In the simplest sense, what is 'code'?", options: [
        "A list of instructions a computer follows", "A secret language only computers understand",
        "A type of computer hardware", "A file format for saving pictures" ], answer: 0 },
      { type: 'mcq', prompt: "What happens when you 'run' a program?", options: [
        "The computer follows the instructions in order", "The code is deleted",
        "The computer writes new code by itself", "Nothing, until it's printed on paper" ], answer: 0 },
      { type: 'mcq', prompt: "Which of these best describes a 'programmer'?", options: [
        "Someone who writes instructions for a computer", "Someone who repairs computer hardware",
        "Someone who only uses apps, never builds them", "A type of computer chip" ], answer: 0 },
      { type: 'truefalse', prompt: "Code is just a way of giving a computer step-by-step instructions.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A 'bug' means the computer itself is physically broken.", answer: false },
      { type: 'truefalse', prompt: "The computer decides what a program does, without needing instructions.", answer: false },
      { type: 'match', prompt: "Match each word to its plain-English meaning.", pairs: [
        ["Program", "A set of instructions that does something"],
        ["Programmer", "A person who writes code"],
        ["Bug", "A mistake that makes code behave wrong"],
        ["Run", "To make the computer follow the instructions"],
      ] },
      { type: 'match', prompt: "Match each word to its plain-English meaning.", pairs: [
        ["Instruction", "One single step the computer follows"],
        ["Software", "Another word for a program or app"],
        ["Debug", "To find and fix a mistake in code"],
      ] },
    ],
    // Larger, separately-worded pool sampled only in Review Mode, so reviewing a
    // completed lesson doesn't just replay the exact same questions.
    reviewPool: [
      { type: 'mcq', prompt: "Which statement is true about how a computer runs code?", options: [
        "It follows the instructions in the order they're written", "It picks random instructions to run",
        "It understands you the way a person would", "It writes its own instructions" ], answer: 0 },
      { type: 'mcq', prompt: "What's the best one-line description of 'software'?", options: [
        "A program, or set of instructions, for a computer", "A physical computer part",
        "A file format only images use", "A brand of computer" ], answer: 0 },
      { type: 'mcq', prompt: "If a program doesn't behave the way you expected, what do you call the mistake?", options: [
        "A bug", "A feature", "A variable", "A function" ], answer: 0 },
      { type: 'mcq', prompt: "Who typically writes code?", options: [
        "A programmer", "A hardware technician", "A network cable", "An operating system, on its own" ], answer: 0 },
      { type: 'match', prompt: "Match each word to its plain-English meaning.", pairs: [
        ["Code", "Instructions a computer can follow"],
        ["Software", "Another name for a program"],
        ["Run", "Execute the instructions"],
        ["Debug", "Find and fix a bug"],
      ] },
      { type: 'truefalse', prompt: "A program runs its instructions in the exact order they appear, unless told otherwise.", answer: true },
    ],
  },
  u1l2: {
    id: 'u1l2', unit: 'u1', title: 'Variables', icon: '📦', xp: XP.LESSON,
    introLines: [
      "Think of a variable as a labeled box.",
      "You put a value inside it...",
      "...and you can look at, or change, it later — just by using its label.",
    ],
    questions: [
      { type: 'mcq', prompt: "What's the best general way to think of a variable?", options: [
        "A labeled box that holds a value", "A math equation", "A type of loop", "A command that prints text" ], answer: 0 },
      { type: 'mcq', prompt: "Which of these is a valid variable name in Python?", options: [
        "2cool", "my_score", "my-score", "class" ], answer: 1 },
      { type: 'mcq', prompt: "What does `score = 0` do?", options: [
        "Creates a box named score holding 0", "Prints the number 0", "Deletes the variable score", "Compares score to 0" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Once you store a value in a variable, it can never be changed later.", answer: false },
      { type: 'truefalse', prompt: "`user_name = 'Alex'` stores the text Alex inside a box called user_name.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A variable's name can contain spaces in Python, like `my score = 10`.", answer: false },
      { type: 'match', prompt: "Match the code to what it actually does.", pairs: [
        ["x = 5", "Stores the number 5 in a box named x"],
        ["name = \"Ana\"", "Stores the text Ana in a box named name"],
        ["age = 10", "Stores the number 10 in a box named age"],
      ] },
      { type: 'match', prompt: "Match the code to what it actually does.", pairs: [
        ["score = 100", "Stores 100 in a box named score"],
        ["is_ready = True", "Stores True in a box named is_ready"],
        ["pi = 3.14", "Stores 3.14 in a box named pi"],
      ] },
    ],
    reviewPool: [
      { type: 'mcq', prompt: "Which phrase best captures what `age = 25` does?", options: [
        "Stores 25 in a box labeled age", "Compares age to 25", "Prints the number 25", "Deletes the variable age" ], answer: 0 },
      { type: 'mcq', prompt: "Which of these is NOT a valid Python variable name?", options: [
        "total_score", "_hidden", "3rd_try", "player2" ], answer: 2 },
      { type: 'mcq', prompt: "What happens if you later write `age = 26` after `age = 25`?", options: [
        "The box named age now holds 26", "Python creates a second box also named age",
        "It causes an error", "Nothing changes" ], answer: 0 },
      { type: 'mcq', prompt: "What's a good real-world way to think about a variable's name?", options: [
        "A label on a box telling you what's inside", "The exact value stored forever", "A type of loop", "A comment" ], answer: 0 },
      { type: 'match', prompt: "Match the code to what it actually does.", pairs: [
        ["total = 0", "Stores 0 in a box named total"],
        ["name = 'Sam'", "Stores the text Sam in a box named name"],
        ["is_done = False", "Stores False in a box named is_done"],
      ] },
      { type: 'truefalse', hard: true, prompt: "In Python, `my score = 5` (with a space in the name) is a valid variable name.", answer: false },
    ],
  },
  u1l3: {
    id: 'u1l3', unit: 'u1', title: 'Data Types', icon: '🔤', xp: XP.LESSON,
    introLines: [
      "An integer is a whole number.",
      "A float has a decimal point.",
      "A string is anything wrapped in quotes. A boolean is just True or False.",
      "That's it for now — the formal rules come later.",
    ],
    questions: [
      { type: 'mcq', prompt: "Using the general definitions above, what type is 7?", options: [
        "Integer", "Float", "String", "Boolean" ], answer: 0 },
      { type: 'mcq', prompt: "Which value is a string?", options: [ "42", '"42"', "4.2", "True" ], answer: 1 },
      { type: 'mcq', prompt: "What type is `19.99`?", options: [ "Integer", "Float", "String", "Boolean" ], answer: 1 },
      { type: 'mcq', hard: true, prompt: "Which of these is stored as a float, not an integer?", options: [ "5", "5.0", "'5'", "True" ], answer: 1 },
      { type: 'truefalse', hard: true, prompt: "3.0 and 3 are stored as the exact same data type in Python.", answer: false },
      { type: 'truefalse', prompt: "A boolean can only be True or False.", answer: true },
      { type: 'truefalse', hard: true, prompt: "The value \"5\" (in quotes) is treated as a number you can do math on directly.", answer: false },
      { type: 'match', prompt: "Match each value to its data type.", pairs: [
        ["7", "Integer — a whole number"],
        ["3.14", "Float — has a decimal point"],
        ["\"hello\"", "String — text in quotes"],
        ["True", "Boolean — true or false"],
      ] },
      { type: 'match', prompt: "Match each value to its data type.", pairs: [
        ["'Alex'", "String"], ["42", "Integer"], ["False", "Boolean"], ["2.0", "Float"],
      ] },
    ],
    reviewPool: [
      { type: 'mcq', prompt: "What type is `-8`?", options: [ "Integer", "Float", "String", "Boolean" ], answer: 0 },
      { type: 'mcq', prompt: "What type is `\"3.14\"` — in quotes?", options: [ "String", "Float", "Integer", "Boolean" ], answer: 0 },
      { type: 'mcq', prompt: "Which of these is a boolean value?", options: [ "False", "'False'", "0", "\"0\"" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Which value below is a float, not an integer?", options: [ "10", "10.5", "'10'", "False" ], answer: 1 },
      { type: 'match', prompt: "Match each value to its data type.", pairs: [
        ["12", "Integer"], ["12.0", "Float"], ["\"12\"", "String"], ["True", "Boolean"],
      ] },
      { type: 'truefalse', hard: true, prompt: "Every number in Python is automatically treated as a float.", answer: false },
    ],
  },
  u1l4: {
    id: 'u1l4', unit: 'u1', title: 'Comments & Readability', icon: '📝', xp: XP.LESSON,
    introLines: [
      "A comment is just a note left for humans.",
      "The computer skips right over it.",
      "In Python, anything after a # is ignored when the code runs.",
    ],
    questions: [
      { type: 'mcq', prompt: "What's the general idea of a comment in code?", options: [
        "A note for humans that the computer ignores", "An instruction that runs twice",
        "A type of variable", "An error message" ], answer: 0 },
      { type: 'mcq', prompt: "Why write comments at all?", options: [
        "To help humans (including future you) understand the code", "To make the program run faster",
        "Because Python requires one per line", "To store data" ], answer: 0 },
      { type: 'mcq', prompt: "Which line is a comment in Python?", options: [
        "# set the score to zero", "score = 0", "print(score)", "score == 0" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "In Python, a line starting with # is run by the computer as an instruction.", answer: false },
      { type: 'truefalse', prompt: "Comments can help explain WHY code does something, not just what it does.", answer: true },
      { type: 'match', prompt: "Match each line to what it is.", pairs: [
        ["# this explains the next line", "A comment"],
        ["x = 5", "An instruction the computer runs"],
      ] },
      { type: 'match', prompt: "Match each line to what it is.", pairs: [
        ["# TODO: fix this later", "A comment reminding the coder of future work"],
        ["x = 5  # starting score", "Code with a comment explaining it"],
      ] },
    ],
    reviewPool: [
      { type: 'mcq', prompt: "What's the main purpose of a code comment?", options: [
        "To explain something to a human reader", "To make the program run faster",
        "To store a value", "To create a new variable" ], answer: 0 },
      { type: 'mcq', prompt: "Which line does the Python interpreter skip entirely?", options: [
        "# calculate the total", "total = 0", "print(total)", "total = total + 1" ], answer: 0 },
      { type: 'mcq', prompt: "Good comments usually explain...", options: [
        "Why the code does something, not just what", "Only what a total beginner already knows",
        "Nothing useful", "The exact syntax rules of Python" ], answer: 0 },
      { type: 'mcq', prompt: "Which is generally true about well-placed comments?", options: [
        "They make code easier for others — and future you — to understand", "They slow the program down",
        "They're required on every single line", "They replace the need for good variable names" ], answer: 0 },
      { type: 'match', prompt: "Match each line to what it is.", pairs: [
        ["# reminder: refactor this", "A comment"],
        ["x = 10", "An instruction the computer runs"],
      ] },
      { type: 'truefalse', prompt: "Comments are optional — Python runs fine without any.", answer: true },
    ],
  },
  u1quiz: {
    id: 'u1quiz', unit: 'u1', title: 'Unit 1 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [
      "Time for a compiled quiz.",
      "It pulls from everything in First Contact.",
      "Let's see what stuck.",
    ],
    questions: [
      { type: 'mcq', prompt: "What is code, in plain terms?", options: [
        "A list of instructions a computer follows", "A kind of computer chip",
        "A picture format", "A password" ], answer: 0 },
      { type: 'mcq', prompt: "Which best describes what a program does when it runs?", options: [
        "It follows its instructions in order", "It rewrites itself randomly",
        "It waits for the computer to guess", "It deletes all variables" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Which value below is a float?", options: [ "7", "7.0", "'7'", "True" ], answer: 1 },
      { type: 'mcq', prompt: "Which is a valid variable name?", options: ["1st_place", "score_1", "score!", "for"], answer: 1 },
      { type: 'truefalse', prompt: "A variable can be thought of as a labeled box holding a value.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Comments are executed by the computer just like normal code.", answer: false },
      { type: 'truefalse', hard: true, prompt: "3 and 3.0 are the same data type in Python.", answer: false },
      { type: 'truefalse', prompt: "A comment can help explain the reasoning behind a piece of code.", answer: true },
      { type: 'match', prompt: "Match the value to its type.", pairs: [
        ["9", "Integer"], ["2.5", "Float"], ["\"hi\"", "String"], ["False", "Boolean"],
      ] },
    ],
  },

  // UNIT 2 — Operators & Expressions (code-writing begins here)
  u2l1: {
    id: 'u2l1', unit: 'u2', title: 'Math Operators', icon: '➕', xp: XP.LESSON,
    introLines: [
      "This is where you start actually writing code.",
      "First tool you need: print(). It displays whatever you put inside the parentheses.",
      "print(\"hi\") shows hi. print(total) shows whatever's stored in total.",
      "Now — the math. + adds, - subtracts, * multiplies, / divides.",
      "Simple as that, to start.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "You'll use this in every code exercise from here on — what does <code>print()</code> do?", options: [
        "Displays whatever value is inside the parentheses", "Saves the value permanently to a file",
        "Deletes the variable inside the parentheses", "Sends the value to another program" ], answer: 0 },
      { type: 'mcq', prompt: "In general, what does + do between two numbers?", options: [
        "Adds them together", "Compares them", "Divides them", "Stores them" ], answer: 0 },
      { type: 'mcq', prompt: "What does / do between two numbers?", options: [
        "Divides them", "Multiplies them", "Adds them", "Compares them" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "In Python, ** means 'to the power of' (exponent).", answer: true },
      { type: 'truefalse', hard: true, prompt: "In Python, `10 % 3` gives you the remainder after division.", answer: true },
      { type: 'match', prompt: "Match each operator to what it does.", pairs: [
        ["+", "Addition"], ["-", "Subtraction"], ["*", "Multiplication"], ["/", "Division"],
      ] },
      { type: 'code', prompt: "Create a variable called <code>total</code> that stores the result of <code>4 * 3</code>, then print it.",
        starter: "total = # your code here\nprint(total)", expected: "12", mustContain: ['*'] },
      { type: 'code', prompt: "Create a variable called <code>diff</code> that stores the result of <code>9 - 4</code>, then print it.",
        starter: "diff = # your code here\nprint(diff)", expected: "5", mustContain: ['-'] },
    ],
  },
  u2l2: {
    id: 'u2l2', unit: 'u2', title: 'Comparison Operators', icon: '⚖️', xp: XP.LESSON,
    introLines: [
      "== asks: 'are these equal?'",
      "It gives back True or False.",
      "That's different from a single =, which just stores a value.",
    ],
    questions: [
      { type: 'mcq', prompt: "What does == check?", options: [
        "Whether two values are equal", "Whether a variable exists", "Whether a value is a string", "Nothing — it's the same as =" ], answer: 0 },
      { type: 'mcq', prompt: "What does != check?", options: [
        "Whether two values are NOT equal", "Whether two values are equal", "Whether a value is negative", "Whether a variable is empty" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "= and == do the same thing in Python.", answer: false },
      { type: 'truefalse', hard: true, prompt: "`5 >= 5` evaluates to True.", answer: true },
      { type: 'match', prompt: "Match each operator to its meaning.", pairs: [
        ["==", "Are these equal?"], ["!=", "Are these NOT equal?"], [">", "Is the left side bigger?"], ["<=", "Is the left side smaller or equal?"],
      ] },
      { type: 'code', prompt: "Print whether <code>7</code> is greater than <code>3</code>. (Hint: use <code>print()</code>)",
        starter: "# your code here", expected: "True", mustContain: ['>'] },
      { type: 'code', prompt: "Print whether <code>2</code> is less than <code>9</code>. (Hint: use <code>print()</code>)",
        starter: "# your code here", expected: "True", mustContain: ['<'] },
    ],
  },
  u2l3: {
    id: 'u2l3', unit: 'u2', title: 'Logical Operators', icon: '🔗', xp: XP.LESSON,
    introLines: [
      "and, or, and not let you combine True/False checks.",
      "and needs both sides true. or just needs one.",
      "not simply flips a value.",
    ],
    questions: [
      { type: 'mcq', prompt: "What does 'and' do, in general?", options: [
        "Both sides have to be true", "Only one side has to be true", "It flips true to false", "It adds two numbers" ], answer: 0 },
      { type: 'mcq', prompt: "What does 'or' do, in general?", options: [
        "At least one side has to be true", "Both sides have to be true", "It flips true to false", "It compares two numbers" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "`True or False` evaluates to False.", answer: false },
      { type: 'truefalse', hard: true, prompt: "`not True` evaluates to False.", answer: true },
      { type: 'match', prompt: "Match each word to its meaning.", pairs: [
        ["and", "Both must be true"], ["or", "At least one must be true"], ["not", "Flips true to false, or false to true"],
      ] },
      { type: 'code', prompt: "Print the result of <code>True and False</code>.", starter: "# your code here", expected: "False", mustContain: ['and'] },
      { type: 'code', prompt: "Print the result of <code>not False</code>.", starter: "# your code here", expected: "True", mustContain: ['not'] },
    ],
  },
  u2l4: {
    id: 'u2l4', unit: 'u2', title: 'String Operators', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "You can use + and * on text — strings — too.",
      "+ joins two strings together.",
      "* repeats a string a number of times.",
    ],
    questions: [
      { type: 'mcq', prompt: "What does + do between two strings like 'sun' + 'flower'?", options: [
        "Joins them together", "Adds their lengths as a number", "Compares them", "Deletes both" ], answer: 0 },
      { type: 'mcq', prompt: "What does \"lo\" * 2 produce?", options: [
        '"lolo"', '"lo2"', "4", "An error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You can multiply a string by a number, like 'ha' * 3.", answer: true },
      { type: 'truefalse', hard: true, prompt: "You can add (+) a string and a number directly, like 'score: ' + 5, with no error.", answer: false },
      { type: 'match', prompt: "Match the expression to its result.", pairs: [
        ["\"sun\" + \"flower\"", "\"sunflower\""], ["\"ha\" * 3", "\"hahaha\""], ["\"a\" + \"b\"", "\"ab\""],
      ] },
      { type: 'code', prompt: "Print <code>\"ha\"</code> repeated 3 times using <code>*</code>.", starter: "# your code here", expected: "hahaha", mustContain: ['*'] },
      { type: 'code', prompt: "Print <code>\"go\"</code> joined with <code>\"go\"</code> using +, to make \"gogo\".", starter: "# your code here", expected: "gogo", mustContain: ['+'] },
    ],
  },
  u2quiz: {
    id: 'u2quiz', unit: 'u2', title: 'Unit 2 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [
      "Compiled quiz time — Operators & Expressions.",
      "Matching, true/false, and a real code exercise.",
      "Let's see what you've got.",
    ],
    questions: [
      { type: 'mcq', prompt: "What does * do between two numbers?", options: ["Multiplies them", "Compares them", "Joins them", "Divides them"], answer: 0 },
      { type: 'mcq', prompt: "What does != mean?", options: ["Not equal to", "Equal to", "Greater than", "Divide by"], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "== checks equality; = assigns a value. They are different.", answer: true },
      { type: 'truefalse', hard: true, prompt: "'lo' * 2 produces 'lolo'.", answer: true },
      { type: 'truefalse', hard: true, prompt: "`3 != 4` evaluates to True.", answer: true },
      { type: 'truefalse', prompt: "Both `and` and `or` are logical operators.", answer: true },
      { type: 'match', prompt: "Match the operator to its category.", pairs: [
        ["+", "Math operator"], ["==", "Comparison operator"], ["and", "Logical operator"],
      ] },
      { type: 'code', prompt: "Create a variable <code>result</code> equal to <code>10 / 2</code> and print it.",
        starter: "result = # your code here\nprint(result)", expected: "5.0", mustContain: ['/'] },
      { type: 'code', prompt: "Create a variable <code>msg</code> equal to <code>\"go\" * 2</code> and print it.",
        starter: "msg = # your code here\nprint(msg)", expected: "gogo", mustContain: ['*'] },
    ],
  },

  // UNIT 3 — Making Decisions
  u3l1: {
    id: 'u3l1', unit: 'u3', title: 'If Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "Sometimes code needs to make a choice.",
      "An if statement runs a block only when a condition is True.",
      "if score > 50: print(\"pass\") — the print only happens if the condition holds.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>if condition:</code> do?", options: [
        "Runs the indented block only when condition is True", "Runs the block every time",
        "Deletes the variable named condition", "Repeats the block forever" ], answer: 0 },
      { type: 'mcq', prompt: "In Python, what marks which lines belong to an if block?", options: [
        "Indentation", "Curly braces {}", "Semicolons", "Capital letters" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "If the condition is False, Python skips the indented block under the if.", answer: true },
      { type: 'truefalse', hard: true, prompt: "`if 0:` is treated the same as `if False:` in Python.", answer: true },
      { type: 'match', prompt: "Match each piece to what it means.", pairs: [
        ["if x > 0:", "Runs the block only when x is greater than 0"],
        ["Indentation", "How Python knows what's inside the if block"],
      ] },
      { type: 'code', prompt: "Write an if statement that prints <code>positive</code> if <code>n</code> is greater than 0. n is already 5.",
        starter: "n = 5\n# your code here", expected: "positive", mustContain: ['if', '>'] },
    ],
  },
  u3l2: {
    id: 'u3l2', unit: 'u3', title: 'If / Else / Elif', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "else catches everything the if didn't.",
      "elif lets you check another condition if the first was False.",
      "Python checks each one top to bottom and runs the first match — only one branch ever runs.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>else</code> do?", options: [
        "Runs when the if condition was False", "Runs no matter what", "Repeats the if block", "Only works with loops" ], answer: 0 },
      { type: 'mcq', prompt: "What is <code>elif</code> short for?", options: [ "else if", "end if", "else... if not", "exit if" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "In an if/elif/else chain, more than one branch can run for the same pass through the code.", answer: false },
      { type: 'truefalse', prompt: "elif is optional — you can have just if and else.", answer: true },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "Checks the first condition"], ["elif", "Checks another condition if the first was False"], ["else", "Runs if nothing above matched"],
      ] },
      { type: 'code', prompt: "n = 0. Print <code>zero</code> if n is 0, <code>positive</code> if greater than 0, else <code>negative</code>.",
        starter: "n = 0\n# your code here", expected: "zero", mustContain: ['if', 'elif', 'else'] },
    ],
  },
  u3l3: {
    id: 'u3l3', unit: 'u3', title: 'Nested Conditionals & Comparison Chains', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "You can put an if inside another if — that's nesting.",
      "Python also lets you chain comparisons: 0 < x < 10 checks both at once.",
      "and/or from Unit 2 work great here too, often instead of nesting.",
    ],
    questions: [
      { type: 'mcq', prompt: "What does 'nesting' an if statement mean?", options: [
        "Putting an if statement inside another if block", "Running two programs at once", "Deleting an if statement", "Combining two variables" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does <code>0 &lt; x &lt; 10</code> check?", options: [
        "Whether x is between 0 and 10 (both comparisons at once)", "Whether x equals 0 or 10", "Whether x is outside 0 to 10", "A syntax error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "`5 < 3 < 10` evaluates to False (because 5 < 3 is False).", answer: true },
      { type: 'truefalse', prompt: "Nested ifs and `and` can often achieve the same result.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Nested if", "An if statement inside another if"], ["Chained comparison", "0 < x < 10, checking two comparisons at once"],
      ] },
      { type: 'code', prompt: "Using one chained comparison, print <code>in range</code> if n (already 7) is between 1 and 10 inclusive.",
        starter: "n = 7\n# your code here", expected: "in range", mustContain: ['<', 'if'] },
    ],
  },
  u3quiz: {
    id: 'u3quiz', unit: 'u3', title: 'Unit 3 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Making Decisions.", "if / elif / else, nesting, and chained comparisons.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does an if statement do when its condition is False?", options: [
        "Skips the indented block", "Runs the block anyway", "Crashes the program", "Repeats forever" ], answer: 0 },
      { type: 'mcq', prompt: "Which keyword checks an additional condition after an if?", options: [ "elif", "else", "then", "or" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does `0 <= x <= 10` mean?", options: [
        "x is between 0 and 10, inclusive", "x equals 0 or 10 only", "x is never in range", "A syntax error" ], answer: 0 },
      { type: 'truefalse', prompt: "else runs only if no earlier if/elif condition matched.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Only one branch of an if/elif/else chain runs per pass.", answer: true },
      { type: 'truefalse', hard: true, prompt: "You can nest an if statement inside another if statement.", answer: true },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "The first condition checked"], ["elif", "An additional condition"], ["else", "Runs when nothing else matched"],
      ] },
      { type: 'code', prompt: "n = -3. Print <code>negative</code> if n is less than 0, else <code>non-negative</code>.",
        starter: "n = -3\n# your code here", expected: "negative", mustContain: ['if', 'else'] },
    ],
  },

  // UNIT 4 — Loops
  u4l1: {
    id: 'u4l1', unit: 'u4', title: 'While Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "A while loop repeats its block as long as a condition stays True.",
      "while count < 3: ... keeps going until count is no longer less than 3.",
      "Forget to change the condition inside, and you get an infinite loop.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a while loop do?", options: [
        "Repeats its block as long as the condition is True", "Runs its block exactly once", "Runs its block a fixed number of times only", "Skips its block entirely" ], answer: 0 },
      { type: 'mcq', prompt: "What causes an infinite loop with <code>while True:</code>?", options: [
        "Never having a way to make the loop stop (like break)", "Using elif inside it", "Using print() inside it", "Defining a variable inside it" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A while loop can run zero times if its condition starts out False.", answer: true },
      { type: 'truefalse', prompt: "You must update the condition variable somewhere inside a while loop, or it may never stop.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["while x < 5:", "Repeats while x is less than 5"], ["Infinite loop", "A loop whose condition never becomes False"],
      ] },
      { type: 'code', prompt: "Print the numbers 0, 1, 2 each on their own line using a while loop.",
        starter: "n = 0\n# your code here", expected: "0\n1\n2", mustContain: ['while'] },
    ],
  },
  u4l2: {
    id: 'u4l2', unit: 'u4', title: 'For Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "A for loop walks through a sequence, one item at a time.",
      "for i in range(3): loops with i = 0, then 1, then 2.",
      "range(n) is just a quick way to count from 0 up to (not including) n.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>for i in range(3):</code> do?", options: [
        "Runs the block 3 times, with i = 0, 1, then 2", "Runs the block exactly once", "Runs the block 4 times", "Creates a variable named range" ], answer: 0 },
      { type: 'mcq', prompt: "What does range(5) represent?", options: [ "The numbers 0 through 4", "The numbers 1 through 5", "The number 5, once", "An error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "range(2, 5) produces 2, 3, 4 — not 5.", answer: true },
      { type: 'truefalse', prompt: "A for loop can iterate directly over a string's characters.", answer: true },
      { type: 'match', prompt: "Match each loop to what it does.", pairs: [
        ["for i in range(4):", "Loops with i = 0,1,2,3"], ["for ch in \"hi\":", "Loops with ch = 'h', then 'i'"],
      ] },
      { type: 'code', prompt: "Use a for loop to print the numbers 1 through 3, each on its own line.",
        starter: "# your code here", expected: "1\n2\n3", mustContain: ['for', 'range'] },
    ],
  },
  u4l3: {
    id: 'u4l3', unit: 'u4', title: 'Loop Control', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "break exits a loop immediately, no matter what's left.",
      "continue skips the rest of this pass and jumps to the next one.",
      "Both work in while loops and for loops alike.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>break</code> do inside a loop?", options: [
        "Stops the loop immediately", "Skips to the next iteration", "Restarts the loop from 0", "Pauses the program forever" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>continue</code> do?", options: [
        "Skips the rest of the current iteration and moves to the next", "Ends the loop", "Deletes the loop variable", "Runs the block twice" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A for-else's else block is skipped if the loop was exited early with break.", answer: true },
      { type: 'truefalse', prompt: "break can be used in both while loops and for loops.", answer: true },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exit the loop right now"], ["continue", "Skip to the next pass through the loop"],
      ] },
      { type: 'code', prompt: "Loop i from 0 to 4 with range(5); print i but skip printing 2 using continue.",
        starter: "for i in range(5):\n    # your code here\n    print(i)", expected: "0\n1\n3\n4", mustContain: ['continue'] },
    ],
  },
  u4quiz: {
    id: 'u4quiz', unit: 'u4', title: 'Unit 4 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Loops.", "while, for, and loop control.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which loop keeps running as long as a condition is True?", options: [ "while", "for", "if", "def" ], answer: 0 },
      { type: 'mcq', prompt: "What does range(3) produce when looped over?", options: [ "0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "3, only" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does break do inside a loop?", options: [ "Exits the loop immediately", "Skips one iteration", "Restarts the loop", "Does nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "continue skips the rest of the current iteration only.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A while loop's condition is checked before each pass, including the first.", answer: true },
      { type: 'truefalse', hard: true, prompt: "range(1, 4) includes the number 4.", answer: false },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exits the loop"], ["continue", "Skips to next iteration"], ["for", "Iterates over a sequence"],
      ] },
      { type: 'code', prompt: "Print the numbers 5, 4, 3, 2, 1 using range with a step of -1.",
        starter: "# your code here", expected: "5\n4\n3\n2\n1", mustContain: ['range'] },
    ],
  },

  // UNIT 5 — Functions
  u5l1: {
    id: 'u5l1', unit: 'u5', title: 'Defining Functions', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A function is a named, reusable block of instructions.",
      "def greet(): ... creates it. Calling greet() later runs everything inside.",
      "Functions let you write something once and use it as many times as you want.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>def</code> do?", options: [ "Defines a new function", "Deletes a function", "Calls a function", "Imports a module" ], answer: 0 },
      { type: 'mcq', prompt: "How do you actually run a function named greet?", options: [ "greet()", "def greet", "run greet", "greet" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Defining a function with def runs its code immediately.", answer: false },
      { type: 'truefalse', prompt: "A function's code only runs when it's called.", answer: true },
      { type: 'match', prompt: "Match each line to what it does.", pairs: [
        ["def say_hi():", "Defines a function named say_hi"], ["say_hi()", "Calls (runs) the function say_hi"],
      ] },
      { type: 'code', prompt: "Define a function called greet that prints <code>hi</code>, then call it once.",
        starter: "# your code here", expected: "hi", mustContain: ['def', 'greet('] },
    ],
  },
  u5l2: {
    id: 'u5l2', unit: 'u5', title: 'Parameters & Arguments', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A parameter is a placeholder a function expects.",
      "def greet(name): — name is the parameter. greet(\"Ana\") passes \"Ana\" as the argument.",
      "Functions can take more than one parameter, separated by commas.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "In <code>def greet(name):</code>, what is <code>name</code>?", options: [
        "A parameter — a placeholder for a value the function needs", "A loop variable", "A built-in Python keyword", "The function's return value" ], answer: 0 },
      { type: 'mcq', prompt: "In <code>greet(\"Ana\")</code>, what is \"Ana\"?", options: [
        "The argument — the actual value passed in", "The parameter", "A comment", "A data type" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A function can have more than one parameter.", answer: true },
      { type: 'truefalse', prompt: "Calling a function without a required argument causes an error.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "The placeholder name in the function definition"], ["Argument", "The actual value you pass in when calling"],
      ] },
      { type: 'code', prompt: "Define <code>add(a, b)</code> that prints a + b, then call <code>add(2, 3)</code>.",
        starter: "# your code here", expected: "5", mustContain: ['def add', '+'] },
    ],
  },
  u5l3: {
    id: 'u5l3', unit: 'u5', title: 'Return Values & Scope', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "return sends a value back out of a function, instead of just printing it.",
      "That value can be stored in a variable, like result = add(2, 3).",
      "A variable created inside a function only exists inside it — that's called scope.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>return</code> do?", options: [
        "Sends a value back to wherever the function was called", "Prints a value to the screen", "Stops the whole program", "Deletes the function" ], answer: 0 },
      { type: 'mcq', prompt: "Why use return instead of just printing inside the function?", options: [
        "So the result can be stored and reused elsewhere in the code", "Because print() doesn't work inside functions", "Because return is faster to type", "There's no difference" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A variable created inside a function is accessible outside it by default.", answer: false },
      { type: 'truefalse', prompt: "A function without a return statement returns None.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["return x", "Sends x back out of the function"], ["Scope", "Where in the code a variable can be accessed"],
      ] },
      { type: 'code', prompt: "Define <code>square(n)</code> that returns n * n. Store <code>square(4)</code> in result and print result.",
        starter: "# your code here\nresult = square(4)\nprint(result)", expected: "16", mustContain: ['def square', 'return'] },
    ],
  },
  u5quiz: {
    id: 'u5quiz', unit: 'u5', title: 'Unit 5 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Functions.", "Defining, calling, parameters, and return values.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What keyword starts a function definition?", options: [ "def", "func", "define", "fn" ], answer: 0 },
      { type: 'mcq', prompt: "What does a parameter represent?", options: [ "A placeholder for a value the function expects", "The function's name", "An error message", "A loop counter" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does a function return if it has no return statement?", options: [ "None", "0", "An error", "An empty string" ], answer: 0 },
      { type: 'truefalse', prompt: "Calling a function runs the code inside it.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Variables defined inside a function are local to it by default.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A function can take zero parameters.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "Placeholder in the definition"], ["Argument", "Actual value passed in"], ["return", "Sends a value back"],
      ] },
      { type: 'code', prompt: "Define <code>double(n)</code> returning n * 2. Print <code>double(6)</code>.",
        starter: "# your code here\nprint(double(6))", expected: "12", mustContain: ['def double', 'return'] },
    ],
  },

  // UNIT 6 — Data Structures
  u6l1: {
    id: 'u6l1', unit: 'u6', title: 'Lists', icon: '📚', xp: XP.LESSON,
    introLines: [
      "A list is an ordered collection you can change — write it with square brackets.",
      "nums = [1, 2, 3] — access items by position, starting at 0: nums[0] is 1.",
      "Lists can grow with .append(), and you can check their size with len().",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>nums[0]</code> get you in <code>nums = [10, 20, 30]</code>?", options: [ "10", "20", "30", "An error" ], answer: 0 },
      { type: 'mcq', prompt: "What does .append() do to a list?", options: [ "Adds an item to the end", "Removes the first item", "Sorts the list", "Deletes the whole list" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "List indexing starts at 0, not 1.", answer: true },
      { type: 'truefalse', prompt: "len([1,2,3]) is 3.", answer: true },
      { type: 'match', prompt: "Match each expression to what it does.", pairs: [
        ["nums[1]", "The second item in the list"], ["len(nums)", "How many items are in the list"], ["nums.append(x)", "Adds x to the end of the list"],
      ] },
      { type: 'code', prompt: "Create a list called nums with 1, 2, 3. Append 4, then print nums.",
        starter: "# your code here", expected: "[1, 2, 3, 4]", mustContain: ['append'] },
    ],
  },
  u6l2: {
    id: 'u6l2', unit: 'u6', title: 'Dictionaries', icon: '📚', xp: XP.LESSON,
    introLines: [
      "A dictionary stores key -> value pairs, not just positions.",
      "person = {\"name\": \"Ana\"} — get the value back with person[\"name\"].",
      "Keys have to be unique, but values can be anything.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>person[\"name\"]</code> return, given <code>person = {\"name\": \"Ana\"}</code>?", options: [ "\"Ana\"", "\"name\"", "An error", "0" ], answer: 0 },
      { type: 'mcq', prompt: "What's stored in a dictionary?", options: [ "Key-value pairs", "Only numbers", "Only positions, like a list", "Only True/False values" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Dictionary keys must be unique.", answer: true },
      { type: 'truefalse', prompt: "You can add a new key to a dictionary just by assigning to it, like d[\"new\"] = 5.", answer: true },
      { type: 'match', prompt: "Match each expression to what it does.", pairs: [
        ["d[\"key\"]", "Gets the value stored under \"key\""], ["d[\"new\"] = 5", "Adds or updates the key \"new\""],
      ] },
      { type: 'code', prompt: "Create a dict scores with \"Ana\": 90. Print scores[\"Ana\"].",
        starter: "# your code here", expected: "90", mustContain: ['{', '}'] },
    ],
  },
  u6l3: {
    id: 'u6l3', unit: 'u6', title: 'Tuples & Sets', icon: '📚', xp: XP.LESSON,
    introLines: [
      "A tuple is like a list, but locked — you can't change it after creating it.",
      "Write one with parentheses: point = (3, 4).",
      "A set is an unordered collection with no duplicates — great for checking membership fast.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's the main difference between a tuple and a list?", options: [
        "A tuple can't be changed after it's created", "A tuple can only hold numbers", "A tuple has no order at all", "There is no difference" ], answer: 0 },
      { type: 'mcq', prompt: "What does a set automatically do with duplicate values?", options: [ "Removes them, keeping only one copy", "Doubles them", "Sorts them", "Raises an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Tuples use parentheses (), while lists use square brackets [].", answer: true },
      { type: 'truefalse', prompt: "set([1, 1, 2, 2, 3]) contains three items: 1, 2, 3.", answer: true },
      { type: 'match', prompt: "Match each value to its type.", pairs: [
        ["(1, 2)", "A tuple"], ["{1, 2, 3}", "A set"], ["[1, 2, 3]", "A list"],
      ] },
      { type: 'code', prompt: "Create a set called nums from the list [1,1,2,3,3] and print sorted(nums).",
        starter: "nums = set([1,1,2,3,3])\n# your code here", expected: "[1, 2, 3]", mustContain: ['sorted'] },
    ],
  },
  u6quiz: {
    id: 'u6quiz', unit: 'u6', title: 'Unit 6 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Data Structures.", "Lists, dictionaries, tuples, and sets.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which collection type uses square brackets and can change after creation?", options: [ "List", "Tuple", "Set", "String" ], answer: 0 },
      { type: 'mcq', prompt: "Which collection type stores key-value pairs?", options: [ "Dictionary", "List", "Tuple", "Set" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What happens to duplicates when you build a set?", options: [ "They're removed automatically", "They're kept and counted", "They cause an error", "They're sorted first" ], answer: 0 },
      { type: 'truefalse', prompt: "Tuples cannot be modified after creation.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Dictionary keys must be unique, but values don't have to be.", answer: true },
      { type: 'truefalse', hard: true, prompt: "List indexing starts at 1 in Python.", answer: false },
      { type: 'match', prompt: "Match each collection to its syntax.", pairs: [
        ["List", "[1, 2, 3]"], ["Tuple", "(1, 2, 3)"], ["Dictionary", "{\"a\": 1}"],
      ] },
      { type: 'code', prompt: "Create list nums = [3,1,2]. Print sorted(nums).",
        starter: "nums = [3, 1, 2]\n# your code here", expected: "[1, 2, 3]", mustContain: ['sorted'] },
    ],
  },

  // UNIT 7 — Working with Strings
  u7l1: {
    id: 'u7l1', unit: 'u7', title: 'String Methods', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "Strings come with built-in tools called methods, like .upper() and .lower().",
      "\"hi\".upper() gives you \"HI\" — the original string doesn't change, you get a new one back.",
      ".strip() removes extra whitespace from the ends.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>\"hi\".upper()</code> return?", options: [ "\"HI\"", "\"hi\"", "\"Hi\"", "An error" ], answer: 0 },
      { type: 'mcq', prompt: "What does .strip() do?", options: [ "Removes leading/trailing whitespace", "Converts to uppercase", "Reverses the string", "Splits the string into a list" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "String methods like .upper() change the original string in place.", answer: false },
      { type: 'truefalse', prompt: "\" hi \".strip() equals \"hi\".", answer: true },
      { type: 'match', prompt: "Match each method to what it does.", pairs: [
        [".upper()", "ALL CAPS version"], [".lower()", "all lowercase version"], [".strip()", "Removes edge whitespace"],
      ] },
      { type: 'code', prompt: "Print <code>\"cat\".upper()</code>.", starter: "# your code here", expected: "CAT", mustContain: ['.upper('] },
    ],
  },
  u7l2: {
    id: 'u7l2', unit: 'u7', title: 'String Formatting', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "f-strings let you drop variables straight into text: f\"Hi {name}\"",
      "Put an f before the opening quote, then wrap any expression in curly braces.",
      "Much cleaner than gluing strings together with +.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>f\"Score: {score}\"</code> produce if score = 10?", options: [
        "The string \"Score: 10\"", "The string \"Score: score\"", "An error", "The literal text \"Score: {score}\"" ], answer: 0 },
      { type: 'mcq', prompt: "What must come right before the opening quote to make an f-string?", options: [ "f", "%", "$", "#" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You can put any expression, like {2 + 2}, inside an f-string's curly braces.", answer: true },
      { type: 'truefalse', prompt: "f-strings require you to convert numbers to strings manually first.", answer: false },
      { type: 'match', prompt: "Match each expression to what it does.", pairs: [
        ["f\"{x}\"", "Inserts the value of x into the string"], ["\"a\" + \"b\"", "Joins two strings with +"],
      ] },
      { type: 'code', prompt: "n = 5. Print an f-string that says <code>n is 5</code>.",
        starter: "n = 5\n# your code here", expected: "n is 5", mustContain: ['f"', '{n}'] },
    ],
  },
  u7l3: {
    id: 'u7l3', unit: 'u7', title: 'Slicing & Indexing', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "Strings can be indexed just like lists: word[0] is the first character.",
      "Slicing grabs a range: word[1:3] gets characters at index 1 and 2 (not 3).",
      "Negative indexes count from the end: word[-1] is the last character.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "In <code>word = \"hello\"</code>, what is <code>word[0]</code>?", options: [ "\"h\"", "\"e\"", "\"o\"", "An error" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>word[1:3]</code> return for word = \"hello\"?", options: [ "\"el\"", "\"ell\"", "\"hel\"", "\"lo\"" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "word[-1] gets the last character of a string.", answer: true },
      { type: 'truefalse', prompt: "Slicing a string creates a new string; it doesn't modify the original.", answer: true },
      { type: 'match', prompt: "Match each expression to what it gets.", pairs: [
        ["word[0]", "First character"], ["word[-1]", "Last character"], ["word[1:3]", "Characters from index 1 up to (not including) 3"],
      ] },
      { type: 'code', prompt: "word = \"python\". Print word[0:3].", starter: "word = \"python\"\n# your code here", expected: "pyt", mustContain: ['[', ':'] },
    ],
  },
  u7quiz: {
    id: 'u7quiz', unit: 'u7', title: 'Unit 7 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Working with Strings.", "Methods, formatting, slicing.", "This one wraps up PCEP-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does .lower() return?", options: [ "An all-lowercase version of the string", "An all-uppercase version", "The string reversed", "The string's length" ], answer: 0 },
      { type: 'mcq', prompt: "What does an f-string let you do?", options: [ "Embed expressions directly inside a string", "Convert a string to a number", "Delete a string", "Sort a string" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does word[-1] return?", options: [ "The last character", "The first character", "An error", "The whole string" ], answer: 0 },
      { type: 'truefalse', prompt: "String methods return new strings rather than modifying the original.", answer: true },
      { type: 'truefalse', hard: true, prompt: "word[2:2] returns an empty string.", answer: true },
      { type: 'truefalse', hard: true, prompt: "f-strings need the f prefix directly before the opening quote.", answer: true },
      { type: 'match', prompt: "Match each expression to its result idea.", pairs: [
        [".strip()", "Removes edge whitespace"], ["f\"{x}\"", "Inserts x's value"], ["word[0]", "First character"],
      ] },
      { type: 'code', prompt: "word = \"syntaxed\". Print word[-5:].", starter: "word = \"syntaxed\"\n# your code here", expected: "taxed", mustContain: ['['] },
    ],
  },

  // UNIT 8 — Files & Errors
  u8l1: {
    id: 'u8l1', unit: 'u8', title: 'Handling Errors', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "Sometimes code fails at runtime — that's called an exception.",
      "try: risky_code() / except: handle_it() lets your program recover instead of crashing.",
      "You can catch specific error types, like except ValueError:",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a try/except block do?", options: [
        "Lets you handle an error instead of crashing the program", "Prevents all errors from ever happening", "Deletes the error message", "Only works with print statements" ], answer: 0 },
      { type: 'mcq', prompt: "What happens if code inside try raises an error and there's a matching except?", options: [
        "The except block runs instead of crashing", "The program crashes anyway", "The try block runs again", "Nothing happens" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You can catch a specific error type, like `except ValueError:`.", answer: true },
      { type: 'truefalse', prompt: "If no exception occurs, the except block is skipped entirely.", answer: true },
      { type: 'match', prompt: "Match each block to its role.", pairs: [
        ["try", "The code that might fail"], ["except", "Runs if an error happened in try"],
      ] },
      { type: 'code', prompt: "Wrap <code>int(\"oops\")</code> in a try/except that catches ValueError and prints <code>caught</code>.",
        starter: "try:\n    int(\"oops\")\n# your code here", expected: "caught", mustContain: ['except'] },
    ],
  },
  u8l2: {
    id: 'u8l2', unit: 'u8', title: 'Raising & Custom Exceptions', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "You can trigger your own error on purpose with raise.",
      "raise ValueError(\"bad input\") stops execution right there, unless something catches it.",
      "You can even define your own exception types by inheriting from Exception.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>raise ValueError(\"bad\")</code> do?", options: [
        "Immediately triggers a ValueError with that message", "Prints the message and continues", "Catches an existing error", "Defines a new function" ], answer: 0 },
      { type: 'mcq', prompt: "How do you define a custom exception type?", options: [
        "Create a class that inherits from Exception", "Use the keyword customerror", "Use try without except", "You can't — only built-in exceptions exist" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "raise stops the current function unless the error is caught somewhere.", answer: true },
      { type: 'truefalse', prompt: "A custom exception class typically inherits from Exception.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["raise ValueError(\"x\")", "Triggers a ValueError on purpose"], ["class MyError(Exception): pass", "Defines a custom exception type"],
      ] },
      { type: 'code', prompt: "Define MyError (inherits Exception), raise it inside a try/except that prints <code>caught custom</code>.",
        starter: "class MyError(Exception):\n    pass\n\ntry:\n    raise MyError(\"oops\")\n# your code here", expected: "caught custom", mustContain: ['except MyError'] },
    ],
  },
  u8l3: {
    id: 'u8l3', unit: 'u8', title: 'Reading & Writing Files', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "open(\"file.txt\", \"w\") opens a file for writing; \"r\" is for reading.",
      "Using `with open(...) as f:` automatically closes the file for you when you're done.",
      "f.write(text) writes; f.read() reads the whole thing back.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does the 'w' mode in <code>open(\"file.txt\", \"w\")</code> mean?", options: [
        "Open the file for writing", "Open the file for reading only", "Wait until the file exists", "Delete the file" ], answer: 0 },
      { type: 'mcq', prompt: "Why use <code>with open(...) as f:</code> instead of a plain open()?", options: [
        "It automatically closes the file when the block ends", "It reads the file faster", "It only works with images", "It prevents the file from being written to" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "f.read() returns the file's whole contents as a string.", answer: true },
      { type: 'truefalse', prompt: "Forgetting to close a file you opened manually can cause problems.", answer: true },
      { type: 'match', prompt: "Match each mode/pattern to its meaning.", pairs: [
        ["\"r\"", "Read mode"], ["\"w\"", "Write mode"], ["with open(...) as f:", "Auto-closes the file when done"],
      ] },
      { type: 'code', prompt: "Write <code>hi</code> to <code>test.txt</code> then read it back and print it.",
        starter: "with open(\"test.txt\", \"w\") as f:\n    f.write(\"hi\")\n# your code here", expected: "hi", mustContain: ['open(', 'r'] },
    ],
  },
  u8quiz: {
    id: 'u8quiz', unit: 'u8', title: 'Unit 8 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Files & Errors.", "try/except, raising, and file I/O.", "This unit kicks off PCAP-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does try/except let a program do?", options: [ "Recover from an error instead of crashing", "Prevent errors from occurring", "Run faster", "Skip loops" ], answer: 0 },
      { type: 'mcq', prompt: "What does raise do?", options: [ "Triggers an exception on purpose", "Catches an exception", "Closes a file", "Defines a function" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does 'r' mode do in open()?", options: [ "Opens a file for reading", "Opens a file for writing", "Deletes a file", "Renames a file" ], answer: 0 },
      { type: 'truefalse', prompt: "A custom exception class usually inherits from Exception.", answer: true },
      { type: 'truefalse', hard: true, prompt: "`with open(...) as f:` closes the file automatically, even if an error occurs inside.", answer: true },
      { type: 'truefalse', hard: true, prompt: "You can catch multiple specific exception types with separate except clauses.", answer: true },
      { type: 'match', prompt: "Match each keyword to its purpose.", pairs: [
        ["try", "Code that might fail"], ["except", "Handles the failure"], ["raise", "Triggers an exception"],
      ] },
      { type: 'code', prompt: "Write <code>data</code> to <code>log.txt</code>, then read and print it back.",
        starter: "with open(\"log.txt\", \"w\") as f:\n    f.write(\"data\")\n# your code here", expected: "data", mustContain: ['open('] },
    ],
  },

  // UNIT 9 — Modules & Standard Library
  u9l1: {
    id: 'u9l1', unit: 'u9', title: 'Importing Modules', icon: '📦', xp: XP.LESSON,
    introLines: [
      "A module is a file of pre-written code you can borrow from.",
      "import math gives you access to everything inside it, like math.sqrt(16).",
      "from math import sqrt lets you use sqrt(16) directly, without the math. prefix.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>import math</code> do?", options: [
        "Makes the math module's tools available, accessed like math.sqrt()", "Deletes the math module", "Runs every function in math immediately", "Only works one time per program" ], answer: 0 },
      { type: 'mcq', prompt: "What's the difference with <code>from math import sqrt</code>?", options: [
        "You can call sqrt() directly, without writing math. first", "It imports the entire Python language", "It's not valid Python", "It deletes the math module" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You must import a module before using anything inside it.", answer: true },
      { type: 'truefalse', prompt: "math.pi is a value already defined in the math module.", answer: true },
      { type: 'match', prompt: "Match each import style to how you'd use it.", pairs: [
        ["import math", "Access math.sqrt(), math.pi, etc."], ["from math import sqrt", "Use sqrt() directly"],
      ] },
      { type: 'code', prompt: "Import math and print <code>math.sqrt(16)</code>.", starter: "# your code here", expected: "4.0", mustContain: ['import math'] },
    ],
  },
  u9l2: {
    id: 'u9l2', unit: 'u9', title: 'The Math & Random Modules', icon: '📦', xp: XP.LESSON,
    introLines: [
      "The math module covers things like square roots, rounding, and constants.",
      "The random module can pick random numbers — random.randint(1, 6) simulates a die roll.",
      "Great for anything involving chance or precise calculation.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>random.randint(1, 6)</code> return?", options: [
        "A random whole number from 1 to 6, inclusive", "Always the number 6", "A random decimal between 0 and 1", "An error" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>math.floor(4.7)</code> return?", options: [ "4", "5", "4.7", "0" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "random.randint(1, 6) can return exactly 6.", answer: true },
      { type: 'truefalse', prompt: "math.ceil() rounds a number up to the next whole number.", answer: true },
      { type: 'match', prompt: "Match each call to what it does.", pairs: [
        ["math.sqrt(x)", "Square root of x"], ["math.floor(x)", "Rounds x down"], ["random.randint(a,b)", "Random whole number from a to b"],
      ] },
      { type: 'code', prompt: "Import math and print <code>math.ceil(4.1)</code>.", starter: "# your code here", expected: "5", mustContain: ['math.ceil'] },
    ],
  },
  u9l3: {
    id: 'u9l3', unit: 'u9', title: 'Datetime & OS Basics', icon: '📦', xp: XP.LESSON,
    introLines: [
      "The datetime module works with dates and times.",
      "date(2024, 1, 1) builds a specific calendar date.",
      "The os module lets code interact with the operating system, like listing files.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>from datetime import date</code> let you do?", options: [
        "Create date objects like date(2024, 1, 1)", "Get the current stock price", "Delete files", "Import random numbers" ], answer: 0 },
      { type: 'mcq', prompt: "What kind of tasks does the os module help with?", options: [
        "Interacting with the operating system, like file paths", "Only math calculations", "Only string formatting", "Drawing graphics" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "date(2024, 1, 1) represents January 1st, 2024.", answer: true },
      { type: 'truefalse', prompt: "The os module is part of Python's standard library — no install needed.", answer: true },
      { type: 'match', prompt: "Match each module to what it's for.", pairs: [
        ["datetime", "Working with dates and times"], ["os", "Interacting with the operating system"],
      ] },
      { type: 'code', prompt: "Import date from datetime, create date(2024, 1, 1), and print it.",
        starter: "from datetime import date\n# your code here", expected: "2024-01-01", mustContain: ['date('] },
    ],
  },
  u9quiz: {
    id: 'u9quiz', unit: 'u9', title: 'Unit 9 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Modules & Standard Library.", "Importing, math/random, datetime/os.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What must you do before using a standard library module?", options: [ "Import it", "Install it with pip first, always", "Nothing — it's automatic", "Restart Python" ], answer: 0 },
      { type: 'mcq', prompt: "Which module would you use to generate a random number?", options: [ "random", "math", "os", "datetime" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does math.floor(4.9) return?", options: [ "4", "5", "4.9", "0" ], answer: 0 },
      { type: 'truefalse', prompt: "`from X import Y` lets you use Y directly without the X. prefix.", answer: true },
      { type: 'truefalse', hard: true, prompt: "The math and random modules are both part of Python's standard library.", answer: true },
      { type: 'truefalse', hard: true, prompt: "date objects from the datetime module print in YYYY-MM-DD form by default.", answer: true },
      { type: 'match', prompt: "Match each module to its purpose.", pairs: [
        ["math", "Calculations like sqrt and floor"], ["random", "Random numbers"], ["datetime", "Dates and times"],
      ] },
      { type: 'code', prompt: "Import math and print <code>math.floor(9.9)</code>.", starter: "# your code here", expected: "9", mustContain: ['math.floor'] },
    ],
  },

  // UNIT 10 — OOP Foundations
  u10l1: {
    id: 'u10l1', unit: 'u10', title: 'Classes & Objects', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "A class is a blueprint; an object is something built from it.",
      "class Dog: ... then fido = Dog() creates an actual Dog object.",
      "Every object made from the same class shares its structure, but can hold different data.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a class?", options: [ "A blueprint for creating objects", "A single object", "A type of loop", "A built-in Python error" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>fido = Dog()</code> do?", options: [ "Creates a new Dog object named fido", "Defines the Dog class", "Deletes the Dog class", "Prints the word Dog" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Multiple objects can be created from the same class.", answer: true },
      { type: 'truefalse', prompt: "A class definition alone (without creating an object) doesn't run any object-specific code.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["class Dog:", "Defines the blueprint"], ["fido = Dog()", "Creates an object from the blueprint"],
      ] },
      { type: 'code', prompt: "Define an empty class Dog, create fido from it, then print <code>type(fido)</code>.",
        starter: "# your code here", expected: "<class '__main__.Dog'>", mustContain: ['class Dog'] },
    ],
  },
  u10l2: {
    id: 'u10l2', unit: 'u10', title: 'The __init__ Method', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "__init__ runs automatically every time you create a new object.",
      "It's where you set up an object's starting data, using self.",
      "self refers to the specific object being created — self.name = name stores it on that object.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "When does __init__ run?", options: [ "Automatically, every time a new object is created", "Only when you call it by name", "Never automatically", "Only once per program, ever" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>self</code> refer to inside a method?", options: [ "The specific object the method is being called on", "The class itself", "A global variable", "Nothing — it's optional" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "self must be the first parameter of every regular method, by convention.", answer: true },
      { type: 'truefalse', prompt: "self.name = name inside __init__ stores name onto that specific object.", answer: true },
      { type: 'match', prompt: "Match each term to its role.", pairs: [
        ["__init__", "Runs automatically when an object is created"], ["self", "The current object"],
      ] },
      { type: 'code', prompt: "Define class Dog with __init__(self, name) storing self.name. Create fido = Dog(\"Fido\") and print fido.name.",
        starter: "# your code here", expected: "Fido", mustContain: ['__init__', 'self.name'] },
    ],
  },
  u10l3: {
    id: 'u10l3', unit: 'u10', title: 'Inheritance Basics', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "A class can inherit from another, reusing its structure.",
      "class Puppy(Dog): — Puppy gets everything Dog has, plus anything new you add.",
      "This avoids rewriting the same code for closely related classes.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>class Puppy(Dog):</code> mean?", options: [ "Puppy inherits from Dog", "Puppy replaces Dog", "Dog inherits from Puppy", "A syntax error" ], answer: 0 },
      { type: 'mcq', prompt: "What's the main benefit of inheritance?", options: [
        "Reusing code from a parent class instead of duplicating it", "Making programs run faster", "It's required by Python syntax", "Deleting unused classes" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A subclass can add new methods that the parent class doesn't have.", answer: true },
      { type: 'truefalse', prompt: "A subclass automatically has access to its parent class's methods.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["class Puppy(Dog):", "Puppy is a subclass of Dog"], ["Parent class", "The class being inherited from"],
      ] },
      { type: 'code', prompt: "Define Animal with speak printing \"...\". Define Dog(Animal) overriding speak to print \"Woof\". Create Dog() and call .speak().",
        starter: "# your code here", expected: "Woof", mustContain: ['class Dog(Animal)'] },
    ],
  },
  u10quiz: {
    id: 'u10quiz', unit: 'u10', title: 'Unit 10 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — OOP Foundations.", "Classes, __init__, and inheritance.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does a class define?", options: [ "A blueprint for creating objects", "A single fixed value", "A type of loop", "A file format" ], answer: 0 },
      { type: 'mcq', prompt: "What method runs automatically on object creation?", options: [ "__init__", "__main__", "__call__", "__new__" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does class Cat(Animal) mean?", options: [ "Cat inherits from Animal", "Animal inherits from Cat", "They're unrelated", "A syntax error" ], answer: 0 },
      { type: 'truefalse', prompt: "self refers to the specific object a method is called on.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A subclass can override a method it inherited from its parent.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Multiple distinct objects can be created from the same class definition.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Class", "Blueprint"], ["Object", "An instance built from a class"], ["Inheritance", "Reusing a parent class's structure"],
      ] },
      { type: 'code', prompt: "Define class Cat with __init__(self, name) storing self.name. Create c = Cat(\"Milo\") and print c.name.",
        starter: "# your code here", expected: "Milo", mustContain: ['__init__'] },
    ],
  },

  // UNIT 11 — OOP In Depth
  u11l1: {
    id: 'u11l1', unit: 'u11', title: 'Encapsulation & Properties', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "Encapsulation means keeping an object's internal details protected from outside interference.",
      "A leading underscore, like _balance, is a convention meaning 'internal use only'.",
      "@property lets a method be accessed like an attribute, so you can add checks behind the scenes.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a leading underscore like _balance signal, by convention?", options: [
        "This is meant for internal use, not external access", "It's a required syntax for all variables", "It makes the variable a constant", "It's a built-in Python keyword" ], answer: 0 },
      { type: 'mcq', prompt: "What does @property let you do?", options: [
        "Access a method like a plain attribute, e.g. obj.value instead of obj.value()", "Make a variable global", "Delete a class", "Import a module automatically" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Python doesn't have true private variables the way some other languages do — it relies on naming conventions.", answer: true },
      { type: 'truefalse', prompt: "Encapsulation helps prevent code outside a class from directly messing with its internal state.", answer: true },
      { type: 'match', prompt: "Match each idea to its meaning.", pairs: [
        ["_balance", "Convention for 'internal use only'"], ["@property", "Access a method like an attribute"],
      ] },
      { type: 'code', prompt: "Define class Account with self._balance = 100 and a @property balance returning self._balance. Print acc.balance.",
        starter: "# your code here\nacc = Account()\nprint(acc.balance)", expected: "100", mustContain: ['@property'] },
    ],
  },
  u11l2: {
    id: 'u11l2', unit: 'u11', title: 'Polymorphism & Dunder Methods', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "Polymorphism means different classes can respond to the same call in their own way.",
      "Dunder (double-underscore) methods like __str__ customize built-in behavior.",
      "Define __str__ to control what print(obj) actually shows.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does defining __str__ on a class control?", options: [
        "What print() shows for objects of that class", "How many objects can be created", "Whether the class can be inherited", "The class's name" ], answer: 0 },
      { type: 'mcq', prompt: "What is polymorphism, in plain terms?", options: [
        "Different classes responding to the same method call in their own way", "Having only one class in a program", "Renaming a variable", "Deleting old code" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "\"Dunder\" refers to methods surrounded by double underscores, like __init__.", answer: true },
      { type: 'truefalse', prompt: "Two different classes can both define a method called speak(), each with its own behavior.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["__str__", "Controls what print(obj) displays"], ["Polymorphism", "Same call, different behavior per class"],
      ] },
      { type: 'code', prompt: "Define class Cat with __str__(self) returning \"Meow\". Print Cat().",
        starter: "# your code here", expected: "Meow", mustContain: ['__str__'] },
    ],
  },
  u11l3: {
    id: 'u11l3', unit: 'u11', title: 'Class vs Instance Data', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "An instance variable belongs to one object, set with self.x = ...",
      "A class variable is shared by every object made from that class.",
      "Change a class variable through the class itself, and every object sees the update.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Where is an instance variable typically set?", options: [
        "Inside a method using self.x = value", "Outside any class", "Only in __str__", "Only in loops" ], answer: 0 },
      { type: 'mcq', prompt: "What's true about a class variable?", options: [
        "It's shared across all instances of the class", "Each object gets its own separate copy automatically", "It can only be a number", "It must be named self" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Changing self.x only affects that one object, not others made from the same class.", answer: true },
      { type: 'truefalse', prompt: "A class variable is defined directly inside the class body, not inside __init__.", answer: true },
      { type: 'match', prompt: "Match each snippet to its category.", pairs: [
        ["self.x = 5", "Instance variable — belongs to one object"], ["count = 0 (in class body)", "Class variable — shared by all objects"],
      ] },
      { type: 'code', prompt: "Define class Dog with class variable species = \"Canine\". Create fido = Dog() and print fido.species.",
        starter: "# your code here", expected: "Canine", mustContain: ['species'] },
    ],
  },
  u11quiz: {
    id: 'u11quiz', unit: 'u11', title: 'Unit 11 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — OOP In Depth.", "Encapsulation, polymorphism, dunder methods, class vs instance data.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does @property let a method act like?", options: [ "A plain attribute", "A loop", "A module", "An exception" ], answer: 0 },
      { type: 'mcq', prompt: "What does __str__ control?", options: [ "What print() shows for an object", "Whether a class can be inherited", "How fast code runs", "The object's memory address" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Where does a class variable live?", options: [ "In the class body, shared by all instances", "Only inside __init__", "Only inside __str__", "Nowhere — they don't exist" ], answer: 0 },
      { type: 'truefalse', prompt: "Instance variables are typically set with self.x = value.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Dunder methods are surrounded by double underscores on both sides.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Two classes can each define their own version of a method with the same name.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["Encapsulation", "Protecting internal state"], ["Polymorphism", "Same call, different behavior"], ["Class variable", "Shared across all instances"],
      ] },
      { type: 'code', prompt: "Define class Robot with __str__ returning \"Beep\". Print Robot().",
        starter: "# your code here", expected: "Beep", mustContain: ['__str__'] },
    ],
  },

  // UNIT 12 — Comprehensions & Functional Tools
  u12l1: {
    id: 'u12l1', unit: 'u12', title: 'Comprehensions', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "A list comprehension builds a list in one line: [x * 2 for x in range(3)]",
      "That reads as: for each x in range(3), compute x * 2, collect the results.",
      "Dict and set comprehensions work the same way, just with {} instead of [].",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>[x * 2 for x in range(3)]</code> produce?", options: [ "[0, 2, 4]", "[0, 1, 2]", "[2, 4, 6]", "An error" ], answer: 0 },
      { type: 'mcq', prompt: "What's the main benefit of a list comprehension over a for loop that appends?", options: [
        "A more concise way to build a list in one line", "It runs on a different computer", "It only works with strings", "It removes the need for lists entirely" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You can add a condition to a comprehension, like [x for x in range(10) if x % 2 == 0].", answer: true },
      { type: 'truefalse', prompt: "{x: x*x for x in range(3)} is a dict comprehension.", answer: true },
      { type: 'match', prompt: "Match each syntax to its type.", pairs: [
        ["[x for x in range(3)]", "List comprehension"], ["{x for x in range(3)}", "Set comprehension"],
      ] },
      { type: 'code', prompt: "Use a list comprehension to build squares of 1,2,3 and print the list.",
        starter: "# your code here", expected: "[1, 4, 9]", mustContain: ['for', 'in'] },
    ],
  },
  u12l2: {
    id: 'u12l2', unit: 'u12', title: 'Lambda & Higher-Order Functions', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "A lambda is a small, unnamed function: lambda x: x * 2",
      "Higher-order functions take other functions as arguments — like map() and filter().",
      "map(func, list) applies func to every item; filter(func, list) keeps only items where func returns True.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>lambda x: x * 2</code> create?", options: [
        "A small anonymous function that doubles its input", "A variable named lambda", "A list of numbers", "A syntax error" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>filter(is_even, nums)</code> do?", options: [
        "Keeps only the items from nums where is_even returns True", "Doubles every item in nums", "Sorts nums", "Deletes nums" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A lambda can only contain a single expression, not multiple statements.", answer: true },
      { type: 'truefalse', prompt: "map() and filter() both take a function as their first argument.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["lambda x: x + 1", "Anonymous function adding 1"], ["map(f, items)", "Applies f to every item"],
      ] },
      { type: 'code', prompt: "Use map with a lambda to double each item in [1,2,3] and print the result as a list.",
        starter: "nums = [1, 2, 3]\n# your code here", expected: "[2, 4, 6]", mustContain: ['lambda', 'map('] },
    ],
  },
  u12l3: {
    id: 'u12l3', unit: 'u12', title: 'Iterators & Generators', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "An iterator produces values one at a time, on demand, instead of all at once.",
      "A generator function uses yield instead of return to produce a sequence lazily.",
      "Great for big or infinite sequences you don't want to build all in memory at once.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What keyword makes a function a generator instead of a regular function?", options: [ "yield", "return", "gen", "next" ], answer: 0 },
      { type: 'mcq', prompt: "What's the main advantage of a generator over building a full list?", options: [
        "It produces values one at a time, saving memory", "It's the only way to loop in Python", "It automatically sorts values", "It runs on a separate CPU core" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Calling a generator function doesn't run its code immediately — it returns a generator object.", answer: true },
      { type: 'truefalse', prompt: "next() retrieves the next value from an iterator or generator.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["yield x", "Produces x, then pauses until asked for the next value"], ["next(gen)", "Gets the next value from a generator"],
      ] },
      { type: 'code', prompt: "Define a generator count_to_three that yields 1, 2, 3. Print list(count_to_three()).",
        starter: "def count_to_three():\n    # your code here\n\nprint(list(count_to_three()))", expected: "[1, 2, 3]", mustContain: ['yield'] },
    ],
  },
  u12quiz: {
    id: 'u12quiz', unit: 'u12', title: 'Unit 12 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Comprehensions & Functional Tools.", "Comprehensions, lambdas, map/filter, generators.", "This one wraps up PCAP-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does a list comprehension build?", options: [ "A list, in one concise line", "A dictionary only", "A function", "A class" ], answer: 0 },
      { type: 'mcq', prompt: "What keyword defines an anonymous function?", options: [ "lambda", "def", "func", "anon" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does yield do inside a function?", options: [ "Produces a value and pauses, making it a generator", "Ends the program", "Imports a module", "Deletes a variable" ], answer: 0 },
      { type: 'truefalse', prompt: "map() applies a function to every item in an iterable.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Generators are useful for handling large sequences without holding them all in memory.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A lambda expression can contain multiple statements separated by semicolons.", answer: false },
      { type: 'match', prompt: "Match each tool to its purpose.", pairs: [
        ["map", "Transforms every item"], ["filter", "Keeps matching items"], ["lambda", "Small anonymous function"],
      ] },
      { type: 'code', prompt: "Use filter with a lambda to keep only even numbers from [1,2,3,4,5,6] and print as a list.",
        starter: "nums = [1, 2, 3, 4, 5, 6]\n# your code here", expected: "[2, 4, 6]", mustContain: ['filter(', 'lambda'] },
    ],
  },

  // UNIT 13 — Advanced OOP & Design
  u13l1: {
    id: 'u13l1', unit: 'u13', title: 'Abstract Base Classes', icon: '🏛️', xp: XP.LESSON,
    introLines: [
      "An abstract base class defines methods that subclasses MUST implement.",
      "Python's abc module provides ABC and @abstractmethod for this.",
      "You can't create an object directly from a class with unimplemented abstract methods.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does @abstractmethod mark?", options: [
        "A method that subclasses are required to implement", "A method that runs automatically on import", "A private variable", "A deprecated method" ], answer: 0 },
      { type: 'mcq', prompt: "What happens if you try to instantiate a class with an unimplemented abstract method?", options: [
        "Python raises a TypeError", "It works fine, just with a warning", "The method is silently skipped", "Nothing — it's the same as a normal class" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A class must inherit from ABC (or use ABCMeta) to use @abstractmethod meaningfully.", answer: true },
      { type: 'truefalse', prompt: "Abstract base classes are useful for defining a shared interface across subclasses.", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["ABC", "Base class for defining abstract classes"], ["@abstractmethod", "Marks a method subclasses must implement"],
      ] },
      { type: 'code', prompt: "Define abstract class Shape(ABC) with abstractmethod area. Define Square(Shape) with area returning 4. Print Square().area().",
        starter: "from abc import ABC, abstractmethod\n\n# your code here", expected: "4", mustContain: ['abstractmethod'] },
    ],
  },
  u13l2: {
    id: 'u13l2', unit: 'u13', title: 'Composition vs Inheritance', icon: '🏛️', xp: XP.LESSON,
    introLines: [
      "Inheritance says 'is-a' — a Puppy IS-A Dog.",
      "Composition says 'has-a' — a Car HAS-A Engine, stored as an attribute.",
      "Composition is often more flexible: swap out the engine without redesigning Car.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does composition mean in OOP?", options: [
        "Building a class out of other objects it contains — a 'has-a' relationship", "Always inheriting from a base class", "Deleting unused classes", "The same thing as inheritance" ], answer: 0 },
      { type: 'mcq', prompt: "Which describes an 'is-a' relationship?", options: [ "Inheritance, like Puppy(Dog)", "Composition, like Car has an Engine", "A for loop", "A dictionary" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Composition is often considered more flexible than inheritance for combining behaviors.", answer: true },
      { type: 'truefalse', prompt: "In composition, one class holds an instance of another as an attribute.", answer: true },
      { type: 'match', prompt: "Match each relationship to its pattern.", pairs: [
        ["Inheritance", "'is-a' relationship"], ["Composition", "'has-a' relationship"],
      ] },
      { type: 'code', prompt: "Define class Engine with start() printing \"vroom\". Define Car with self.engine = Engine() in __init__. Call car.engine.start().",
        starter: "# your code here", expected: "vroom", mustContain: ['self.engine'] },
    ],
  },
  u13l3: {
    id: 'u13l3', unit: 'u13', title: 'Operator Overloading & Static/Class Methods', icon: '🏛️', xp: XP.LESSON,
    introLines: [
      "Overload + on your own class by defining __add__.",
      "@staticmethod defines a method that doesn't need self at all — it's just grouped with the class.",
      "@classmethod receives the class itself (conventionally cls) instead of an instance.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does defining __add__ on a class let you do?", options: [
        "Use the + operator directly between objects of that class", "Add new methods at runtime", "Delete an object", "Multiply two objects" ], answer: 0 },
      { type: 'mcq', prompt: "What's different about a @staticmethod compared to a regular method?", options: [
        "It doesn't take self or cls — it's not tied to a specific instance", "It runs automatically at import time", "It can only return None", "It must be private" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "@classmethod methods receive the class itself as their first argument, conventionally named cls.", answer: true },
      { type: 'truefalse', prompt: "Operator overloading lets built-in operators like + work with custom objects.", answer: true },
      { type: 'match', prompt: "Match each decorator to its behavior.", pairs: [
        ["__add__", "Overloads the + operator"], ["@staticmethod", "A method not tied to an instance"], ["@classmethod", "Receives the class (cls) as its first argument"],
      ] },
      { type: 'code', prompt: "Define class Vec with __init__(self,x) and __add__(self,other) returning Vec(self.x+other.x). Print (Vec(2)+Vec(3)).x",
        starter: "# your code here", expected: "5", mustContain: ['__add__'] },
    ],
  },
  u13quiz: {
    id: 'u13quiz', unit: 'u13', title: 'Unit 13 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Advanced OOP & Design.", "ABCs, composition, operator overloading, static/class methods.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does @abstractmethod require of subclasses?", options: [ "They must implement that method", "They must never override it", "Nothing", "They must be named the same" ], answer: 0 },
      { type: 'mcq', prompt: "What relationship does composition represent?", options: [ "'has-a'", "'is-a'", "'was-a'", "None" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Which dunder method overloads the + operator?", options: [ "__add__", "__plus__", "__sum__", "__str__" ], answer: 0 },
      { type: 'truefalse', prompt: "A @staticmethod doesn't receive self or cls automatically.", answer: true },
      { type: 'truefalse', hard: true, prompt: "@classmethod's first parameter is conventionally named cls.", answer: true },
      { type: 'truefalse', hard: true, prompt: "You cannot instantiate a class that still has unimplemented abstract methods.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["ABC", "Defines a required interface"], ["Composition", "Has-a relationship"], ["__add__", "Overloads +"],
      ] },
      { type: 'code', prompt: "Define class Vec with __init__(self,x) and __str__ returning str(self.x). Print Vec(7).",
        starter: "# your code here", expected: "7", mustContain: ['__str__'] },
    ],
  },

  // UNIT 14 — Decorators & Context Managers
  u14l1: {
    id: 'u14l1', unit: 'u14', title: 'Writing Decorators', icon: '🎁', xp: XP.LESSON,
    introLines: [
      "A decorator wraps a function to add behavior, without changing its code.",
      "@my_decorator above a function is shorthand for func = my_decorator(func).",
      "You've already used decorators — @property, @staticmethod, @abstractmethod are all decorators.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>@my_decorator</code> above a function definition do?", options: [
        "Wraps the function with extra behavior from my_decorator", "Deletes the function", "Runs the function immediately, once", "Renames the function to my_decorator" ], answer: 0 },
      { type: 'mcq', prompt: "Which of these have you already used as decorators?", options: [ "@property and @staticmethod", "print() and input()", "if and else", "for and while" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A decorator is itself a function that takes a function and returns a (usually wrapped) function.", answer: true },
      { type: 'truefalse', prompt: "`@my_decorator` above `def f():` is equivalent to `f = my_decorator(f)`.", answer: true },
      { type: 'match', prompt: "Match each decorator to what it is.", pairs: [
        ["@property", "A built-in decorator for method-as-attribute"], ["Custom decorator", "A function that wraps another function"],
      ] },
      { type: 'code', prompt: "Define a decorator shout that uppercases a function's return value. Apply it to greet() returning \"hi\". Print greet().",
        starter: "def shout(func):\n    def wrapper():\n        return func().upper()\n    return wrapper\n\n# your code here\ndef greet():\n    return \"hi\"\n\nprint(greet())", expected: "HI", mustContain: ['@shout'] },
    ],
  },
  u14l2: {
    id: 'u14l2', unit: 'u14', title: 'Context Managers & with', icon: '🎁', xp: XP.LESSON,
    introLines: [
      "You've used `with open(...) as f:` — that's a context manager.",
      "It guarantees cleanup (like closing a file) even if an error happens inside.",
      "You can write your own using a class with __enter__ and __exit__.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What guarantee does a context manager (used with `with`) provide?", options: [
        "Cleanup code runs even if an error occurs inside the block", "The code inside runs twice", "No errors can ever happen inside", "It skips the block entirely" ], answer: 0 },
      { type: 'mcq', prompt: "Which two dunder methods make a class work with `with`?", options: [
        "__enter__ and __exit__", "__init__ and __str__", "__add__ and __sub__", "__len__ and __getitem__" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "`with open(...) as f:` automatically calls f.close() when the block ends.", answer: true },
      { type: 'truefalse', prompt: "__exit__ runs even if an exception was raised inside the with block.", answer: true },
      { type: 'match', prompt: "Match each method to when it runs.", pairs: [
        ["__enter__", "Runs when entering the with block"], ["__exit__", "Runs when leaving the with block, even on error"],
      ] },
      { type: 'code', prompt: "Define class Ctx with __enter__ printing \"enter\" (returning self) and __exit__ printing \"exit\". Use `with Ctx():` with pass inside.",
        starter: "class Ctx:\n    def __enter__(self):\n        print(\"enter\")\n        return self\n    def __exit__(self, *a):\n        print(\"exit\")\n\n# your code here", expected: "enter\nexit", mustContain: ['with Ctx()'] },
    ],
  },
  u14l3: {
    id: 'u14l3', unit: 'u14', title: 'Advanced Generators', icon: '🎁', xp: XP.LESSON,
    introLines: [
      "A generator expression is like a list comprehension, but with () instead of [] — and it's lazy.",
      "sum(x*x for x in range(4)) never builds a full list in memory.",
      "Generators remember exactly where they left off between values.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's different about <code>(x*x for x in range(4))</code> compared to <code>[x*x for x in range(4)]</code>?", options: [
        "It's a lazy generator expression, not a fully built list", "It only works with strings", "It's invalid syntax", "It runs slower with the same memory use" ], answer: 0 },
      { type: 'mcq', prompt: "Why might you prefer a generator expression for a huge range of numbers?", options: [
        "It avoids building the entire sequence in memory at once", "It's required by Python syntax", "It automatically sorts the values", "It prints results automatically" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A generator expression can be passed directly into functions like sum() or list().", answer: true },
      { type: 'truefalse', prompt: "Generators remember where they left off between each value produced.", answer: true },
      { type: 'match', prompt: "Match each syntax to what it builds.", pairs: [
        ["(x for x in range(3))", "Generator expression"], ["[x for x in range(3)]", "List comprehension — builds the whole list"],
      ] },
      { type: 'code', prompt: "Print <code>sum(x*x for x in range(4))</code>.", starter: "# your code here", expected: "14", mustContain: ['sum('] },
    ],
  },
  u14quiz: {
    id: 'u14quiz', unit: 'u14', title: 'Unit 14 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Decorators & Context Managers.", "Decorators, with-blocks, generator expressions.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does a decorator do to a function?", options: [ "Wraps it with extra behavior", "Deletes it", "Renames it permanently", "Converts it to a class" ], answer: 0 },
      { type: 'mcq', prompt: "Which dunder methods power a context manager?", options: [ "__enter__ and __exit__", "__init__ and __del__", "__str__ and __repr__", "__get__ and __set__" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What's a generator expression's syntax?", options: [ "(x for x in iterable)", "[x for x in iterable]", "{x for x in iterable}", "<x for x in iterable>" ], answer: 0 },
      { type: 'truefalse', prompt: "`@dec\\ndef f(): ...` is equivalent to `f = dec(f)`.", answer: true },
      { type: 'truefalse', hard: true, prompt: "__exit__ still runs even when an exception happens inside the with block.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Generator expressions build the entire sequence in memory immediately, just like lists.", answer: false },
      { type: 'match', prompt: "Match each concept to its purpose.", pairs: [
        ["Decorator", "Wraps a function with extra behavior"], ["Context manager", "Guarantees cleanup via with"], ["Generator expression", "Lazily produces values"],
      ] },
      { type: 'code', prompt: "Print <code>list(x for x in range(3))</code>.", starter: "# your code here", expected: "[0, 1, 2]", mustContain: ['list('] },
    ],
  },

  // UNIT 15 — Data Formats & Text
  u15l1: {
    id: 'u15l1', unit: 'u15', title: 'Working with JSON', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "JSON is a text format for structured data — it looks a lot like Python dicts and lists.",
      "json.dumps(obj) turns a Python object into a JSON string.",
      "json.loads(text) turns a JSON string back into Python data.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>json.dumps({\"a\": 1})</code> return?", options: [
        "The string '{\"a\": 1}'", "A Python dict", "A file object", "An error" ], answer: 0 },
      { type: 'mcq', prompt: "What does json.loads() do?", options: [
        "Converts a JSON string into Python data", "Converts Python data into a JSON string", "Deletes JSON data", "Opens a file" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "JSON objects map closely to Python dictionaries.", answer: true },
      { type: 'truefalse', prompt: "You need `import json` before using json.dumps or json.loads.", answer: true },
      { type: 'match', prompt: "Match each function to what it does.", pairs: [
        ["json.dumps(obj)", "Python object -> JSON string"], ["json.loads(text)", "JSON string -> Python object"],
      ] },
      { type: 'code', prompt: "Import json, convert {\"a\": 1} to a JSON string with dumps, and print it.",
        starter: "# your code here", expected: '{"a": 1}', mustContain: ['json.dumps'] },
    ],
  },
  u15l2: {
    id: 'u15l2', unit: 'u15', title: 'Regular Expressions', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "A regular expression (regex) is a pattern for matching text.",
      "re.search(r\"\\d+\", text) finds the first run of digits in text.",
      "They look cryptic at first, but they're incredibly powerful for pattern matching.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>re.search(r\"\\d+\", \"abc123\")</code> find?", options: [
        "\"123\" — the digits in the string", "\"abc\" — the letters", "Nothing, it errors", "The whole string" ], answer: 0 },
      { type: 'mcq', prompt: "What does \\d represent in a regex pattern?", options: [ "Any digit (0-9)", "Any letter", "A literal backslash", "End of string" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You need `import re` to use Python's regular expression tools.", answer: true },
      { type: 'truefalse', prompt: "re.search returns None if no match is found.", answer: true },
      { type: 'match', prompt: "Match each regex symbol to its meaning.", pairs: [
        ["\\d", "Any digit"], ["+", "One or more of the previous thing"],
      ] },
      { type: 'code', prompt: "Import re. Use re.search(r\"\\d+\", \"item42\") and print the match with .group().",
        starter: "import re\n# your code here", expected: "42", mustContain: ['re.search'] },
    ],
  },
  u15l3: {
    id: 'u15l3', unit: 'u15', title: 'CSV Files', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "CSV (comma-separated values) is a simple text format for tabular data.",
      "The csv module reads and writes it without you handling commas by hand.",
      "csv.reader(file) gives you each row as a list of strings.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does the csv module help with?", options: [
        "Reading and writing comma-separated tabular data", "Compressing files", "Sending emails", "Drawing charts" ], answer: 0 },
      { type: 'mcq', prompt: "What does csv.reader(file) give you per row?", options: [
        "A list of strings, one per column", "A single joined string", "A dictionary automatically", "A JSON object" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "CSV stands for comma-separated values.", answer: true },
      { type: 'truefalse', prompt: "csv.writer can write rows to a file the same way you'd write with a for loop.", answer: true },
      { type: 'match', prompt: "Match each tool to what it does.", pairs: [
        ["csv.reader", "Reads CSV rows as lists"], ["csv.writer", "Writes rows to a CSV file"],
      ] },
      { type: 'code', prompt: "Import csv and io. Read \"a,b\\n1,2\" (as a fake file via io.StringIO) with csv.reader, and print the second row.",
        starter: "import csv, io\nf = io.StringIO(\"a,b\\n1,2\")\nreader = csv.reader(f)\n# your code here", expected: "['1', '2']", mustContain: ['reader'] },
    ],
  },
  u15quiz: {
    id: 'u15quiz', unit: 'u15', title: 'Unit 15 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Data Formats & Text.", "JSON, regex, and CSV.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does json.loads() convert?", options: [ "A JSON string into Python data", "Python data into a JSON string", "A CSV row into a list", "A regex into a string" ], answer: 0 },
      { type: 'mcq', prompt: "What module handles regular expressions in Python?", options: [ "re", "regex", "json", "csv" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does \\d+ match?", options: [ "One or more digits", "One or more letters", "A single space", "The empty string only" ], answer: 0 },
      { type: 'truefalse', prompt: "csv.reader returns each row as a list of strings.", answer: true },
      { type: 'truefalse', hard: true, prompt: "json.dumps() converts Python data into a JSON-formatted string.", answer: true },
      { type: 'truefalse', hard: true, prompt: "re.search returns None when the pattern isn't found anywhere in the text.", answer: true },
      { type: 'match', prompt: "Match each module to its purpose.", pairs: [
        ["json", "Structured data as text"], ["re", "Pattern matching in text"], ["csv", "Tabular text data"],
      ] },
      { type: 'code', prompt: "Import json. Convert [1, 2, 3] to a JSON string with dumps and print it.",
        starter: "# your code here", expected: "[1, 2, 3]", mustContain: ['json.dumps'] },
    ],
  },

  // UNIT 16 — Testing & Debugging
  u16l1: {
    id: 'u16l1', unit: 'u16', title: 'Unit Testing', icon: '🧪', xp: XP.LESSON,
    introLines: [
      "Tests are code that checks your other code actually works.",
      "Python's built-in unittest module gives you assert-style checks like assertEqual.",
      "Writing tests catches bugs before your users do.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>self.assertEqual(a, b)</code> check in a unittest?", options: [
        "That a and b are equal, failing the test if not", "That a is always True", "That the program has no errors at all", "That a is a string" ], answer: 0 },
      { type: 'mcq', prompt: "What must a test class typically inherit from in unittest?", options: [ "unittest.TestCase", "object", "Exception", "dict" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A failing assertion inside a test method causes that test to fail, but others still run.", answer: true },
      { type: 'truefalse', prompt: "Automated tests help catch bugs when you change code later.", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["assertEqual(a, b)", "Checks a equals b"], ["unittest.TestCase", "Base class for test cases"],
      ] },
      { type: 'code', prompt: "Define TestMath(unittest.TestCase) with test_add asserting 2+2==4. Run it, then print \"done\".",
        starter: "import unittest\n\n# your code here\n\nunittest.main(argv=['x'], exit=False)\nprint(\"done\")", expected: "done", mustContain: ['assertEqual'] },
    ],
  },
  u16l2: {
    id: 'u16l2', unit: 'u16', title: 'Debugging Techniques', icon: '🧪', xp: XP.LESSON,
    introLines: [
      "print() statements are a fine first debugging tool — see what a variable actually holds.",
      "Reading a traceback from the bottom up usually tells you exactly where and why it failed.",
      "assert condition, \"message\" stops the program immediately if condition is False.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>assert x > 0, \"x must be positive\"</code> do if x is -1?", options: [
        "Raises an AssertionError with that message", "Silently continues", "Sets x to 0", "Prints x" ], answer: 0 },
      { type: 'mcq', prompt: "When reading a Python traceback, where's the most specific error info usually shown?", options: [
        "At the bottom", "At the very top only", "In the middle, always", "Nowhere — you have to guess" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Temporary print() statements are a legitimate, common debugging technique.", answer: true },
      { type: 'truefalse', prompt: "assert statements are meant for catching bugs during development, not for handling expected user errors.", answer: true },
      { type: 'match', prompt: "Match each concept to its meaning.", pairs: [
        ["assert cond, msg", "Stops the program if cond is False"], ["Traceback", "Shows where and why an error happened"],
      ] },
      { type: 'code', prompt: "Write an assert that checks 2 + 2 == 4, then print \"ok\".", starter: "# your code here\nprint(\"ok\")", expected: "ok", mustContain: ['assert'] },
    ],
  },
  u16l3: {
    id: 'u16l3', unit: 'u16', title: 'Logging', icon: '🧪', xp: XP.LESSON,
    introLines: [
      "logging is a more flexible alternative to scattering print() everywhere.",
      "logging.info(\"message\") records an event; levels like debug/info/warning/error show what matters.",
      "Unlike print, logging can be turned on/off or redirected without touching your code's logic.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's a key advantage of logging over print() for larger programs?", options: [
        "You can control what level of detail is shown without editing code logic", "It's the only way to print text", "It automatically fixes bugs", "It deletes old log files" ], answer: 0 },
      { type: 'mcq', prompt: "Which of these is NOT a standard logging level?", options: [ "random", "debug", "warning", "error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "logging.basicConfig() is commonly used to set up the logging level and format.", answer: true },
      { type: 'truefalse', prompt: "By default, logging.info() messages may not show unless the logging level is configured to show them.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["logging.info(msg)", "Logs an informational message"], ["logging.error(msg)", "Logs an error-level message"],
      ] },
      { type: 'code', prompt: "Import logging, set level to INFO with basicConfig, call logging.info(\"hi\"), then print \"done\".",
        starter: "import logging\nlogging.basicConfig(level=logging.INFO)\n# your code here\nprint(\"done\")", expected: "done", mustContain: ['logging.info'] },
    ],
  },
  u16quiz: {
    id: 'u16quiz', unit: 'u16', title: 'Unit 16 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Testing & Debugging.", "unittest, debugging technique, logging.", "This one wraps up PCPP1-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does assertEqual check in a test?", options: [ "That two values are equal", "That a value is a string", "That a file exists", "That a loop ran"], answer: 0 },
      { type: 'mcq', prompt: "What does an assert statement do when its condition is False?", options: [ "Raises an AssertionError", "Silently continues", "Fixes the bug automatically", "Prints nothing and exits cleanly" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Which logging level is typically more severe: warning or error?", options: [ "error", "warning", "They're equal", "Neither is a real level" ], answer: 0 },
      { type: 'truefalse', prompt: "unittest test classes typically inherit from unittest.TestCase.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Reading a traceback from the bottom often reveals the most specific cause of an error.", answer: true },
      { type: 'truefalse', hard: true, prompt: "logging can be configured to show or hide messages by severity level.", answer: true },
      { type: 'match', prompt: "Match each tool to its purpose.", pairs: [
        ["unittest", "Automated correctness checks"], ["assert", "Fails fast on a broken assumption"], ["logging", "Structured, level-based messages"],
      ] },
      { type: 'code', prompt: "Write an assert that checks 3 * 3 == 9, then print \"verified\".", starter: "# your code here\nprint(\"verified\")", expected: "verified", mustContain: ['assert'] },
    ],
  },

  // UNIT 17 — Design Patterns
  u17l1: {
    id: 'u17l1', unit: 'u17', title: 'Singleton & Factory', icon: '🗝️', xp: XP.LESSON,
    introLines: [
      "A design pattern is a proven, reusable solution to a common design problem.",
      "Singleton ensures a class only ever has one instance, shared everywhere.",
      "Factory hides the details of object creation behind a single function or method.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does the Singleton pattern guarantee?", options: [
        "Only one instance of a class ever exists", "A class can never be inherited", "A function runs exactly once", "Objects can't be deleted" ], answer: 0 },
      { type: 'mcq', prompt: "What's the main idea behind a Factory pattern?", options: [
        "A function/method that decides which class to instantiate and returns it", "A class with no methods", "A loop that creates infinite objects", "A way to delete unused classes" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Design patterns are general solutions, not specific pieces of code you copy verbatim.", answer: true },
      { type: 'truefalse', prompt: "A Singleton is often implemented by storing the one instance on the class itself.", answer: true },
      { type: 'match', prompt: "Match each pattern to its idea.", pairs: [
        ["Singleton", "Only one instance ever exists"], ["Factory", "Centralizes object creation logic"],
      ] },
      { type: 'code', prompt: "Implement a Singleton: class Config with class variable _instance and classmethod get_instance creating one if missing. Print Config.get_instance() is Config.get_instance().",
        starter: "# your code here", expected: "True", mustContain: ['_instance'] },
    ],
  },
  u17l2: {
    id: 'u17l2', unit: 'u17', title: 'Observer & Strategy', icon: '🗝️', xp: XP.LESSON,
    introLines: [
      "Observer lets objects subscribe to be notified when something changes.",
      "Strategy lets you swap out an algorithm at runtime by passing in different functions/objects.",
      "Both patterns favor flexible composition over hardcoding one fixed behavior.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does the Observer pattern let objects do?", options: [
        "Subscribe to be notified when another object's state changes", "Delete themselves automatically", "Run in parallel threads", "Become singletons" ], answer: 0 },
      { type: 'mcq', prompt: "What does the Strategy pattern let you do?", options: [
        "Swap out an algorithm/behavior at runtime", "Guarantee only one object exists", "Automatically log every function call", "Convert data to JSON" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "In the Strategy pattern, different strategies usually share a common interface (like the same method name).", answer: true },
      { type: 'truefalse', prompt: "Observer is commonly used for things like event systems and UI updates.", answer: true },
      { type: 'match', prompt: "Match each pattern to its idea.", pairs: [
        ["Observer", "Notifies subscribers of changes"], ["Strategy", "Swaps out an algorithm at runtime"],
      ] },
      { type: 'code', prompt: "Implement Strategy: define add(a,b) and mul(a,b). Store one in op = add. Print op(2,3).",
        starter: "def add(a, b): return a + b\ndef mul(a, b): return a * b\n\n# your code here", expected: "5", mustContain: ['op'] },
    ],
  },
  u17l3: {
    id: 'u17l3', unit: 'u17', title: 'The Decorator Pattern', icon: '🗝️', xp: XP.LESSON,
    introLines: [
      "The Decorator pattern wraps an object to add behavior — the same idea behind Python's @decorators.",
      "It lets you add features without modifying the original class.",
      "You can stack multiple decorators to combine behaviors.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's the core idea of the Decorator design pattern?", options: [
        "Wrap an object/function to add behavior without changing its original code", "Delete unused objects", "Ensure only one instance exists", "Convert an object to a string" ], answer: 0 },
      { type: 'mcq', prompt: "How does Python's @decorator syntax relate to the Decorator pattern?", options: [
        "It's a direct, built-in language feature implementing that same idea", "They're unrelated concepts that share a name by coincidence", "@decorator only works with classes, not functions", "It's a deprecated feature" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You can stack multiple decorators on the same function.", answer: true },
      { type: 'truefalse', prompt: "The Decorator pattern avoids modifying the original class or function's source code.", answer: true },
      { type: 'match', prompt: "Match each idea to the pattern.", pairs: [
        ["Decorator pattern", "Wraps to add behavior, original stays untouched"], ["@decorator syntax", "Python's built-in way to apply this pattern to functions"],
      ] },
      { type: 'code', prompt: "Stack two decorators, bold and italic, wrapping a function's return with \"*\" and \"_\". Apply both to text() returning \"hi\" and print text().",
        starter: "def bold(f):\n    def w():\n        return \"*\" + f() + \"*\"\n    return w\n\ndef italic(f):\n    def w():\n        return \"_\" + f() + \"_\"\n    return w\n\n@bold\n@italic\ndef text():\n    return \"hi\"\n\n# your code here", expected: "*_hi_*", mustContain: ['print(text())'] },
    ],
  },
  u17quiz: {
    id: 'u17quiz', unit: 'u17', title: 'Unit 17 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Design Patterns.", "Singleton, Factory, Observer, Strategy, Decorator.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which pattern ensures only one instance exists?", options: [ "Singleton", "Factory", "Observer", "Strategy" ], answer: 0 },
      { type: 'mcq', prompt: "Which pattern centralizes object creation?", options: [ "Factory", "Singleton", "Decorator", "Strategy" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Which pattern lets subscribers get notified of changes?", options: [ "Observer", "Strategy", "Singleton", "Factory" ], answer: 0 },
      { type: 'truefalse', prompt: "The Strategy pattern lets you swap algorithms at runtime.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Python's @decorator syntax directly implements the Decorator design pattern idea.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Design patterns are copy-paste code snippets rather than general solution shapes.", answer: false },
      { type: 'match', prompt: "Match each pattern to its idea.", pairs: [
        ["Singleton", "One instance only"], ["Factory", "Centralized creation"], ["Decorator", "Wraps to add behavior"],
      ] },
      { type: 'code', prompt: "Implement Strategy: define inc(n) returning n+1. Store op = inc. Print op(4).",
        starter: "def inc(n): return n + 1\n# your code here", expected: "5", mustContain: ['op'] },
    ],
  },

  // UNIT 18 — Concurrency
  u18l1: {
    id: 'u18l1', unit: 'u18', title: 'Threading Basics', icon: '⏱️', xp: XP.LESSON,
    introLines: [
      "A thread lets part of your program run alongside the rest.",
      "threading.Thread(target=func).start() kicks it off; .join() waits for it to finish.",
      "Threads are great for tasks that spend time waiting, like network requests.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does thread.start() do?", options: [
        "Begins running the thread's target function", "Ends the thread immediately", "Pauses the main program forever", "Deletes the thread" ], answer: 0 },
      { type: 'mcq', prompt: "What does thread.join() do?", options: [
        "Waits for the thread to finish before continuing", "Starts a new thread", "Kills the thread instantly", "Merges two threads into one" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Threads in Python are especially useful for tasks that spend a lot of time waiting, like I/O.", answer: true },
      { type: 'truefalse', prompt: "You need `import threading` to use Python's Thread class.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["Thread.start()", "Begins the thread"], ["Thread.join()", "Waits for the thread to finish"],
      ] },
      { type: 'code', prompt: "This in-browser sandbox can't spin up real OS threads. Import threading anyway (as real code would), then print <code>done</code> to confirm you read the lesson.",
        starter: "import threading\n# your code here", expected: "done", mustContain: ['import threading', 'print'] },
    ],
  },
  u18l2: {
    id: 'u18l2', unit: 'u18', title: 'Multiprocessing Basics', icon: '⏱️', xp: XP.LESSON,
    introLines: [
      "multiprocessing runs separate processes, each with its own memory — true parallelism.",
      "Great for CPU-heavy work, unlike threading which is better for waiting-heavy work.",
      "The API looks a lot like threading's, on purpose: Process(target=func).start()",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's the main advantage of multiprocessing over threading for CPU-heavy work?", options: [
        "Separate processes can truly run in parallel on multiple CPU cores", "It uses less memory", "It's simpler syntax", "It doesn't require importing anything" ], answer: 0 },
      { type: 'mcq', prompt: "What does each process in multiprocessing have that threads share?", options: [
        "Its own separate memory space", "The exact same variables as the main program", "No memory at all", "A shared GIL" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "multiprocessing.Process's API is intentionally similar to threading.Thread's.", answer: true },
      { type: 'truefalse', prompt: "Multiprocessing is generally better suited to CPU-bound tasks than threading is.", answer: true },
      { type: 'match', prompt: "Match each tool to what it's best for.", pairs: [
        ["threading", "Good for I/O-bound waiting tasks"], ["multiprocessing", "Good for CPU-bound parallel work"],
      ] },
      { type: 'code', prompt: "This in-browser sandbox can't spawn real OS processes. Import multiprocessing anyway (as real code would), then print <code>done</code> to confirm you read the lesson.",
        starter: "import multiprocessing\n# your code here", expected: "done", mustContain: ['import multiprocessing', 'print'] },
    ],
  },
  u18l3: {
    id: 'u18l3', unit: 'u18', title: 'Asyncio Fundamentals', icon: '⏱️', xp: XP.LESSON,
    introLines: [
      "asyncio runs many tasks cooperatively on a single thread, switching while one waits.",
      "async def defines a coroutine; await pauses it until something finishes.",
      "asyncio.run(main()) is the usual way to kick off an async program.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>async def</code> define?", options: [ "A coroutine function", "A regular synchronous function", "A class", "A decorator only" ], answer: 0 },
      { type: 'mcq', prompt: "What does await do inside an async function?", options: [
        "Pauses that coroutine until the awaited thing finishes, letting others run", "Stops the whole program permanently", "Runs a for loop", "Starts a new thread" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "asyncio achieves concurrency on a single thread by cooperatively switching between tasks.", answer: true },
      { type: 'truefalse', prompt: "asyncio.run() is the standard way to start running an async program's main coroutine.", answer: true },
      { type: 'match', prompt: "Match each keyword to its meaning.", pairs: [
        ["async def f():", "Defines a coroutine"], ["await something", "Pauses until something finishes"],
      ] },
      { type: 'code', prompt: "Define async def main() that prints \"hi\". Run it with asyncio.run(main()).",
        starter: "import asyncio\n\n# your code here", expected: "hi", mustContain: ['asyncio.run'] },
    ],
  },
  u18quiz: {
    id: 'u18quiz', unit: 'u18', title: 'Unit 18 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Concurrency.", "Threading, multiprocessing, asyncio.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which is best for CPU-heavy parallel work?", options: [ "multiprocessing", "threading", "asyncio", "None of these" ], answer: 0 },
      { type: 'mcq', prompt: "Which keyword pauses a coroutine until something finishes?", options: [ "await", "yield", "return", "pass" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does thread.join() do?", options: [ "Waits for the thread to finish", "Starts the thread", "Kills the thread", "Nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "Threads are well-suited to I/O-bound waiting tasks.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Each process in multiprocessing has its own separate memory space.", answer: true },
      { type: 'truefalse', hard: true, prompt: "asyncio.run() is the typical entry point for running an async program.", answer: true },
      { type: 'match', prompt: "Match each tool to its concurrency style.", pairs: [
        ["threading", "Concurrent, shared memory"], ["multiprocessing", "Parallel, separate memory"], ["asyncio", "Cooperative, single thread"],
      ] },
      { type: 'code', prompt: "Define async def main() printing \"go\". Run it with asyncio.run(main()).",
        starter: "import asyncio\n# your code here", expected: "go", mustContain: ['asyncio.run'] },
    ],
  },

  // UNIT 19 — Databases & Persistence
  u19l1: {
    id: 'u19l1', unit: 'u19', title: 'SQLite Basics', icon: '🗄️', xp: XP.LESSON,
    introLines: [
      "sqlite3 is a lightweight database built right into Python — no server needed.",
      "connect(\"file.db\") opens (or creates) a database file; cursor().execute(sql) runs SQL.",
      "commit() saves changes; fetchall() retrieves query results.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>sqlite3.connect(\"file.db\")</code> do?", options: [
        "Opens (or creates) a SQLite database file", "Deletes a database file", "Only works with in-memory databases", "Requires a separate database server" ], answer: 0 },
      { type: 'mcq', prompt: "What does cursor.fetchall() return after a SELECT query?", options: [
        "All matching rows as a list", "Only the first row", "Nothing — it just runs the query", "The database filename" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "SQLite databases don't require a separate server process to run.", answer: true },
      { type: 'truefalse', prompt: "You need to call commit() after making changes for them to be saved (outside of certain auto-commit contexts).", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["connect()", "Opens/creates a database file"], ["cursor.execute(sql)", "Runs a SQL statement"], ["fetchall()", "Gets all result rows"],
      ] },
      { type: 'code', prompt: "Create an in-memory db, create table t(x), insert 5, then select and print fetchone()[0].",
        starter: "import sqlite3\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE t (x INTEGER)\")\ncur.execute(\"INSERT INTO t VALUES (5)\")\n# your code here", expected: "5", mustContain: ['fetchone'] },
    ],
  },
  u19l2: {
    id: 'u19l2', unit: 'u19', title: 'Pickle & Shelve', icon: '🗄️', xp: XP.LESSON,
    introLines: [
      "pickle serializes almost any Python object into bytes you can save or send.",
      "pickle.dumps(obj) converts to bytes; pickle.loads(data) converts back.",
      "shelve builds on this to give you a simple, dictionary-like persistent store.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>pickle.dumps(obj)</code> produce?", options: [
        "A bytes representation of obj that can be saved or transmitted", "A JSON string", "A plain text summary", "A copy of obj in memory only" ], answer: 0 },
      { type: 'mcq', prompt: "What does shelve provide?", options: [
        "A dictionary-like object backed by persistent storage", "A way to draw shelves in a GUI", "A faster version of lists", "A networking protocol" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "pickle.loads() reverses pickle.dumps(), reconstructing the original object.", answer: true },
      { type: 'truefalse', prompt: "Unlike JSON, pickle can serialize most Python objects, not just basic data types.", answer: true },
      { type: 'match', prompt: "Match each call to its direction.", pairs: [
        ["pickle.dumps(obj)", "Object -> bytes"], ["pickle.loads(data)", "Bytes -> object"],
      ] },
      { type: 'code', prompt: "Pickle the list [1,2,3] with dumps, unpickle it with loads, and print the result.",
        starter: "import pickle\n# your code here", expected: "[1, 2, 3]", mustContain: ['pickle.loads'] },
    ],
  },
  u19l3: {
    id: 'u19l3', unit: 'u19', title: 'Context-Managed DB Access', icon: '🗄️', xp: XP.LESSON,
    introLines: [
      "Combine what you know: `with sqlite3.connect(...) as conn:` manages commits/rollbacks for you.",
      "On success, changes commit automatically; on error, they roll back.",
      "This is the pattern real-world Python database code actually uses.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does using <code>with sqlite3.connect(...) as conn:</code> help manage?", options: [
        "Automatically committing or rolling back the transaction", "Making queries run faster", "Creating tables automatically", "Deleting the database" ], answer: 0 },
      { type: 'mcq', prompt: "What happens to a with-managed sqlite3 connection's changes if an exception occurs inside the block?", options: [
        "The transaction is rolled back", "The changes still commit anyway", "Python crashes with no message", "The database file is deleted" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Using a context manager for database connections combines cleanup and error-handling in one pattern.", answer: true },
      { type: 'truefalse', prompt: "This pattern combines context managers (Unit 14) with databases (this unit).", answer: true },
      { type: 'match', prompt: "Match each call to what it does.", pairs: [
        ["with conn:", "Auto-commits or rolls back the transaction"], ["conn.execute(sql)", "Runs a SQL statement on the connection"],
      ] },
      { type: 'code', prompt: "Use `with sqlite3.connect(':memory:') as conn:` to create table t(x), insert 9, then select and print fetchone()[0].",
        starter: "import sqlite3\nwith sqlite3.connect(\":memory:\") as conn:\n    conn.execute(\"CREATE TABLE t (x INTEGER)\")\n    conn.execute(\"INSERT INTO t VALUES (9)\")\n    # your code here", expected: "9", mustContain: ['fetchone'] },
    ],
  },
  u19quiz: {
    id: 'u19quiz', unit: 'u19', title: 'Unit 19 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Databases & Persistence.", "SQLite, pickle/shelve, context-managed access.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does sqlite3.connect(\":memory:\") create?", options: [ "A temporary in-memory database", "A file on disk named memory", "A network connection", "Nothing — it's invalid" ], answer: 0 },
      { type: 'mcq', prompt: "What does pickle.dumps() produce?", options: [ "A bytes representation of a Python object", "A JSON string", "A CSV row", "A SQL query" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What happens on an exception inside a with-managed sqlite3 connection block?", options: [ "The transaction rolls back", "It commits anyway", "Python ignores it", "The file is deleted" ], answer: 0 },
      { type: 'truefalse', prompt: "SQLite doesn't require a separate database server.", answer: true },
      { type: 'truefalse', hard: true, prompt: "shelve provides a dictionary-like persistent store.", answer: true },
      { type: 'truefalse', hard: true, prompt: "fetchall() returns every matching row from the last query.", answer: true },
      { type: 'match', prompt: "Match each tool to its purpose.", pairs: [
        ["sqlite3", "Lightweight embedded database"], ["pickle", "Serialize Python objects to bytes"], ["shelve", "Dict-like persistent storage"],
      ] },
      { type: 'code', prompt: "Create an in-memory db, table t(x), insert 3, select and print fetchone()[0].",
        starter: "import sqlite3\nconn = sqlite3.connect(\":memory:\")\ncur = conn.cursor()\ncur.execute(\"CREATE TABLE t (x INTEGER)\")\ncur.execute(\"INSERT INTO t VALUES (3)\")\n# your code here", expected: "3", mustContain: ['fetchone'] },
    ],
  },

  // UNIT 20 — Professional Practices
  u20l1: {
    id: 'u20l1', unit: 'u20', title: 'Packaging & Virtual Environments', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "A virtual environment keeps a project's dependencies separate from everything else on your machine.",
      "python -m venv env creates one; you activate it, then pip install into it safely.",
      "A pyproject.toml describes a package well enough for others to install it.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What problem do virtual environments solve?", options: [
        "Keeping each project's dependencies isolated from other projects", "Making code run faster", "Automatically fixing bugs", "Replacing the need for pip" ], answer: 0 },
      { type: 'mcq', prompt: "What tool typically installs packages into a virtual environment?", options: [ "pip", "import", "venv install", "git" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Different projects can use different, even conflicting, versions of the same package when using separate virtual environments.", answer: true },
      { type: 'truefalse', prompt: "python -m venv env is a standard way to create a virtual environment named env.", answer: true },
      { type: 'match', prompt: "Match each tool to its role.", pairs: [
        ["venv", "Creates an isolated environment"], ["pip", "Installs packages into it"],
      ] },
      { type: 'code', prompt: "This step is conceptual (no real venv inside this browser sandbox). Just print \"noted\" to confirm you read the lesson.",
        starter: "# your code here", expected: "noted", mustContain: ['print'] },
    ],
  },
  u20l2: {
    id: 'u20l2', unit: 'u20', title: 'Code Style (PEP 8)', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "PEP 8 is Python's official style guide — consistent code is easier for everyone to read.",
      "Common rules: 4 spaces per indent level, snake_case for variables/functions, descriptive names.",
      "Tools like a linter can automatically flag style issues for you.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is PEP 8?", options: [
        "Python's official style guide for writing readable code", "A required syntax rule enforced by the interpreter", "A built-in module", "A type of error" ], answer: 0 },
      { type: 'mcq', prompt: "What naming style does PEP 8 recommend for variables and functions?", options: [ "snake_case", "camelCase", "PascalCase", "ALLCAPS" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "PEP 8 is a set of conventions, not something the Python interpreter enforces by itself.", answer: true },
      { type: 'truefalse', prompt: "Consistent style makes code easier for a team (or future you) to read and maintain.", answer: true },
      { type: 'match', prompt: "Match each naming style to its typical use.", pairs: [
        ["snake_case", "Recommended for variables/functions"], ["PascalCase", "Conventionally used for class names"],
      ] },
      { type: 'code', prompt: "Rename the poorly-named variable x1 to the descriptive snake_case name total_score and print it (it already equals 10).",
        starter: "x1 = 10\n# your code here", expected: "10", mustContain: ['total_score'] },
    ],
  },
  u20l3: {
    id: 'u20l3', unit: 'u20', title: 'Performance Profiling Basics', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "Before optimizing, measure — don't guess where the slow part actually is.",
      "The time module can do a rough measurement; cProfile gives a detailed breakdown.",
      "'Premature optimization' — tuning code that wasn't actually slow — wastes effort. Profile first.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What should you generally do before optimizing code?", options: [
        "Measure/profile it to find out what's actually slow", "Rewrite the whole program from scratch", "Add more comments", "Delete the tests" ], answer: 0 },
      { type: 'mcq', prompt: "What does the cProfile module help you do?", options: [
        "Get a detailed breakdown of where time is spent in your code", "Automatically fix slow code", "Convert code to a faster language", "Format code to PEP 8" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Optimizing code that isn't actually a bottleneck is often called 'premature optimization'.", answer: true },
      { type: 'truefalse', prompt: "time.time() can be used for simple before/after timing of a block of code.", answer: true },
      { type: 'match', prompt: "Match each tool to its purpose.", pairs: [
        ["time.time()", "Simple before/after timing"], ["cProfile", "Detailed performance breakdown"],
      ] },
      { type: 'code', prompt: "Import time, record a start timestamp, run a small loop, then print \"measured\" (not the actual duration, to keep output consistent).",
        starter: "import time\nstart = time.time()\nfor i in range(1000):\n    pass\n# your code here", expected: "measured", mustContain: ['time.time'] },
    ],
  },
  u20quiz: {
    id: 'u20quiz', unit: 'u20', title: 'Unit 20 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Professional Practices.", "Virtual environments, PEP 8, profiling.", "This is the final quiz on the roadmap to PCPP2." ],
    questions: [
      { type: 'mcq', prompt: "What do virtual environments isolate?", options: [ "A project's dependencies from other projects", "The CPU from the GPU", "Threads from processes", "Classes from functions" ], answer: 0 },
      { type: 'mcq', prompt: "What naming convention does PEP 8 recommend for functions?", options: [ "snake_case", "camelCase", "PascalCase", "kebab-case" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What should come before optimizing slow code?", options: [ "Profiling to find the actual bottleneck", "Rewriting everything", "Adding more print statements permanently", "Ignoring it" ], answer: 0 },
      { type: 'truefalse', prompt: "pip is commonly used to install packages into a virtual environment.", answer: true },
      { type: 'truefalse', hard: true, prompt: "PEP 8 compliance is checked by the Python interpreter and blocks execution if violated.", answer: false },
      { type: 'truefalse', hard: true, prompt: "cProfile gives a detailed breakdown of where time is spent in a program.", answer: true },
      { type: 'match', prompt: "Match each concept to its purpose.", pairs: [
        ["venv", "Isolated dependencies"], ["PEP 8", "Style guide"], ["cProfile", "Performance breakdown"],
      ] },
      { type: 'code', prompt: "Rename x2 to descriptive name user_count (already equals 42) and print it.",
        starter: "x2 = 42\n# your code here", expected: "42", mustContain: ['user_count'] },
    ],
  },
};

// ---- Stub / roadmap lessons (not yet built — shown locked in the skill tree) ----
// Empty for Python now that the full PCEP -> PCPP2 roadmap is built out; reused by
// future in-progress languages/units.
const STUB_LESSONS = {};

const UNITS = [
  { id: 'u1', tier: 'pcep', title: 'First Contact', icon: '👾', lessons: ['u1l1','u1l2','u1l3','u1l4','u1quiz'] },
  { id: 'u2', tier: 'pcep', title: 'Operators & Expressions', icon: '⚡', lessons: ['u2l1','u2l2','u2l3','u2l4','u2quiz'] },
  { id: 'u3', tier: 'pcep', title: 'Making Decisions', icon: '🔀', lessons: ['u3l1','u3l2','u3l3','u3quiz'] },
  { id: 'u4', tier: 'pcep', title: 'Loops', icon: '🔁', lessons: ['u4l1','u4l2','u4l3','u4quiz'] },
  { id: 'u5', tier: 'pcep', title: 'Functions', icon: '🧩', lessons: ['u5l1','u5l2','u5l3','u5quiz'] },
  { id: 'u6', tier: 'pcep', title: 'Data Structures', icon: '📚', lessons: ['u6l1','u6l2','u6l3','u6quiz'] },
  { id: 'u7', tier: 'pcep', title: 'Working with Strings', icon: '🧵', lessons: ['u7l1','u7l2','u7l3','u7quiz'] },
  { id: 'u8', tier: 'pcap', title: 'Files & Errors', icon: '🧯', lessons: ['u8l1','u8l2','u8l3','u8quiz'] },
  { id: 'u9', tier: 'pcap', title: 'Modules & Standard Library', icon: '📦', lessons: ['u9l1','u9l2','u9l3','u9quiz'] },
  { id: 'u10', tier: 'pcap', title: 'OOP Foundations', icon: '🏗️', lessons: ['u10l1','u10l2','u10l3','u10quiz'] },
  { id: 'u11', tier: 'pcap', title: 'OOP In Depth', icon: '🧬', lessons: ['u11l1','u11l2','u11l3','u11quiz'] },
  { id: 'u12', tier: 'pcap', title: 'Comprehensions & Functional Tools', icon: '🧠', lessons: ['u12l1','u12l2','u12l3','u12quiz'] },
  { id: 'u13', tier: 'pcpp1', title: 'Advanced OOP & Design', icon: '🏛️', lessons: ['u13l1','u13l2','u13l3','u13quiz'] },
  { id: 'u14', tier: 'pcpp1', title: 'Decorators & Context Managers', icon: '🎁', lessons: ['u14l1','u14l2','u14l3','u14quiz'] },
  { id: 'u15', tier: 'pcpp1', title: 'Data Formats & Text', icon: '🗂️', lessons: ['u15l1','u15l2','u15l3','u15quiz'] },
  { id: 'u16', tier: 'pcpp1', title: 'Testing & Debugging', icon: '🧪', lessons: ['u16l1','u16l2','u16l3','u16quiz'] },
  { id: 'u17', tier: 'pcpp2', title: 'Design Patterns', icon: '🗝️', lessons: ['u17l1','u17l2','u17l3','u17quiz'] },
  { id: 'u18', tier: 'pcpp2', title: 'Concurrency', icon: '⏱️', lessons: ['u18l1','u18l2','u18l3','u18quiz'] },
  { id: 'u19', tier: 'pcpp2', title: 'Databases & Persistence', icon: '🗄️', lessons: ['u19l1','u19l2','u19l3','u19quiz'] },
  { id: 'u20', tier: 'pcpp2', title: 'Professional Practices', icon: '🚀', lessons: ['u20l1','u20l2','u20l3','u20quiz'] },
];

// Prerequisite graph for the playable lessons (drives skill-tree locking).
// u1l3 and u1l4 both branch off u1l2 — non-linear within a unit, still gated overall.
const PREREQS = {
  u1l1: [],
  u1l2: ['u1l1'],
  u1l3: ['u1l2'],
  u1l4: ['u1l2'],
  u1quiz: ['u1l3', 'u1l4'],
  u2l1: ['u1quiz'],
  u2l2: ['u2l1'],
  u2l3: ['u2l2'],
  u2l4: ['u2l2'],
  u2quiz: ['u2l3', 'u2l4'],
  u3l1: ['u2quiz'], u3l2: ['u3l1'], u3l3: ['u3l2'], u3quiz: ['u3l3'],
  u4l1: ['u3quiz'], u4l2: ['u4l1'], u4l3: ['u4l2'], u4quiz: ['u4l3'],
  u5l1: ['u4quiz'], u5l2: ['u5l1'], u5l3: ['u5l2'], u5quiz: ['u5l3'],
  u6l1: ['u5quiz'], u6l2: ['u6l1'], u6l3: ['u6l2'], u6quiz: ['u6l3'],
  u7l1: ['u6quiz'], u7l2: ['u7l1'], u7l3: ['u7l2'], u7quiz: ['u7l3'],
  u8l1: ['u7quiz'], u8l2: ['u8l1'], u8l3: ['u8l2'], u8quiz: ['u8l3'],
  u9l1: ['u8quiz'], u9l2: ['u9l1'], u9l3: ['u9l2'], u9quiz: ['u9l3'],
  u10l1: ['u9quiz'], u10l2: ['u10l1'], u10l3: ['u10l2'], u10quiz: ['u10l3'],
  u11l1: ['u10quiz'], u11l2: ['u11l1'], u11l3: ['u11l2'], u11quiz: ['u11l3'],
  u12l1: ['u11quiz'], u12l2: ['u12l1'], u12l3: ['u12l2'], u12quiz: ['u12l3'],
  u13l1: ['u12quiz'], u13l2: ['u13l1'], u13l3: ['u13l2'], u13quiz: ['u13l3'],
  u14l1: ['u13quiz'], u14l2: ['u14l1'], u14l3: ['u14l2'], u14quiz: ['u14l3'],
  u15l1: ['u14quiz'], u15l2: ['u15l1'], u15l3: ['u15l2'], u15quiz: ['u15l3'],
  u16l1: ['u15quiz'], u16l2: ['u16l1'], u16l3: ['u16l2'], u16quiz: ['u16l3'],
  u17l1: ['u16quiz'], u17l2: ['u17l1'], u17l3: ['u17l2'], u17quiz: ['u17l3'],
  u18l1: ['u17quiz'], u18l2: ['u18l1'], u18l3: ['u18l2'], u18quiz: ['u18l3'],
  u19l1: ['u18quiz'], u19l2: ['u19l1'], u19l3: ['u19l2'], u19quiz: ['u19l3'],
  u20l1: ['u19quiz'], u20l2: ['u20l1'], u20l3: ['u20l2'], u20quiz: ['u20l3'],
};

// ---- Skill-tree graph layout (visual only — locking logic stays driven by PREREQS) ----
// col: horizontal grid position (0 = center); row: depth level (top to bottom).
// Nodes get a small deterministic jitter applied at render time so the tree reads as an
// organic "skill web" rather than a rigid grid — authoring only needs col/row here.
const TREE_LAYOUT = {
  u1l1: { col: 0, row: 0 }, u1l2: { col: 0, row: 1 },
  u1l3: { col: -1, row: 2 }, u1l4: { col: 1, row: 2 },
  u1quiz: { col: 0, row: 3 },
  u2l1: { col: 0, row: 4 }, u2l2: { col: 0, row: 5 },
  u2l3: { col: -1, row: 6 }, u2l4: { col: 1, row: 6 },
  u2quiz: { col: 0, row: 7 },
  u3l1: { col: 0, row: 8 }, u3l2: { col: 0, row: 9 }, u3l3: { col: 0, row: 10 }, u3quiz: { col: 0, row: 11 },
  u4l1: { col: 0, row: 12 }, u4l2: { col: 0, row: 13 }, u4l3: { col: 0, row: 14 }, u4quiz: { col: 0, row: 15 },
  u5l1: { col: 0, row: 16 }, u5l2: { col: 0, row: 17 }, u5l3: { col: 0, row: 18 }, u5quiz: { col: 0, row: 19 },
  u6l1: { col: 0, row: 20 }, u6l2: { col: 0, row: 21 }, u6l3: { col: 0, row: 22 }, u6quiz: { col: 0, row: 23 },
  u7l1: { col: 0, row: 24 }, u7l2: { col: 0, row: 25 }, u7l3: { col: 0, row: 26 }, u7quiz: { col: 0, row: 27 },
  cp_pcep: { col: 0, row: 28 },
  u8l1: { col: 0, row: 29 }, u8l2: { col: 0, row: 30 }, u8l3: { col: 0, row: 31 }, u8quiz: { col: 0, row: 32 },
  u9l1: { col: 0, row: 33 }, u9l2: { col: 0, row: 34 }, u9l3: { col: 0, row: 35 }, u9quiz: { col: 0, row: 36 },
  u10l1: { col: 0, row: 37 }, u10l2: { col: 0, row: 38 }, u10l3: { col: 0, row: 39 }, u10quiz: { col: 0, row: 40 },
  u11l1: { col: 0, row: 41 }, u11l2: { col: 0, row: 42 }, u11l3: { col: 0, row: 43 }, u11quiz: { col: 0, row: 44 },
  u12l1: { col: 0, row: 45 }, u12l2: { col: 0, row: 46 }, u12l3: { col: 0, row: 47 }, u12quiz: { col: 0, row: 48 },
  cp_pcap: { col: 0, row: 49 },
  u13l1: { col: 0, row: 50 }, u13l2: { col: 0, row: 51 }, u13l3: { col: 0, row: 52 }, u13quiz: { col: 0, row: 53 },
  u14l1: { col: 0, row: 54 }, u14l2: { col: 0, row: 55 }, u14l3: { col: 0, row: 56 }, u14quiz: { col: 0, row: 57 },
  u15l1: { col: 0, row: 58 }, u15l2: { col: 0, row: 59 }, u15l3: { col: 0, row: 60 }, u15quiz: { col: 0, row: 61 },
  u16l1: { col: 0, row: 62 }, u16l2: { col: 0, row: 63 }, u16l3: { col: 0, row: 64 }, u16quiz: { col: 0, row: 65 },
  cp_pcpp1: { col: 0, row: 66 },
  u17l1: { col: 0, row: 67 }, u17l2: { col: 0, row: 68 }, u17l3: { col: 0, row: 69 }, u17quiz: { col: 0, row: 70 },
  u18l1: { col: 0, row: 71 }, u18l2: { col: 0, row: 72 }, u18l3: { col: 0, row: 73 }, u18quiz: { col: 0, row: 74 },
  u19l1: { col: 0, row: 75 }, u19l2: { col: 0, row: 76 }, u19l3: { col: 0, row: 77 }, u19quiz: { col: 0, row: 78 },
  u20l1: { col: 0, row: 79 }, u20l2: { col: 0, row: 80 }, u20l3: { col: 0, row: 81 }, u20quiz: { col: 0, row: 82 },
  cp_pcpp2: { col: 0, row: 83 },
};

// Visual parent->child connections (superset of PREREQS — includes the roadmap chain,
// plus purely-decorative pass-through edges to/from certification checkpoint markers).
const TREE_EDGES = [
  ['u1l1','u1l2'], ['u1l2','u1l3'], ['u1l2','u1l4'], ['u1l3','u1quiz'], ['u1l4','u1quiz'],
  ['u1quiz','u2l1'], ['u2l1','u2l2'], ['u2l2','u2l3'], ['u2l2','u2l4'], ['u2l3','u2quiz'], ['u2l4','u2quiz'],
  ['u2quiz','u3l1'], ['u3l1','u3l2'], ['u3l2','u3l3'], ['u3l3','u3quiz'],
  ['u3quiz','u4l1'], ['u4l1','u4l2'], ['u4l2','u4l3'], ['u4l3','u4quiz'],
  ['u4quiz','u5l1'], ['u5l1','u5l2'], ['u5l2','u5l3'], ['u5l3','u5quiz'],
  ['u5quiz','u6l1'], ['u6l1','u6l2'], ['u6l2','u6l3'], ['u6l3','u6quiz'],
  ['u6quiz','u7l1'], ['u7l1','u7l2'], ['u7l2','u7l3'], ['u7l3','u7quiz'],
  ['u7quiz','cp_pcep'], ['cp_pcep','u8l1'],
  ['u8l1','u8l2'], ['u8l2','u8l3'], ['u8l3','u8quiz'],
  ['u8quiz','u9l1'], ['u9l1','u9l2'], ['u9l2','u9l3'], ['u9l3','u9quiz'],
  ['u9quiz','u10l1'], ['u10l1','u10l2'], ['u10l2','u10l3'], ['u10l3','u10quiz'],
  ['u10quiz','u11l1'], ['u11l1','u11l2'], ['u11l2','u11l3'], ['u11l3','u11quiz'],
  ['u11quiz','u12l1'], ['u12l1','u12l2'], ['u12l2','u12l3'], ['u12l3','u12quiz'],
  ['u12quiz','cp_pcap'], ['cp_pcap','u13l1'],
  ['u13l1','u13l2'], ['u13l2','u13l3'], ['u13l3','u13quiz'],
  ['u13quiz','u14l1'], ['u14l1','u14l2'], ['u14l2','u14l3'], ['u14l3','u14quiz'],
  ['u14quiz','u15l1'], ['u15l1','u15l2'], ['u15l2','u15l3'], ['u15l3','u15quiz'],
  ['u15quiz','u16l1'], ['u16l1','u16l2'], ['u16l2','u16l3'], ['u16l3','u16quiz'],
  ['u16quiz','cp_pcpp1'], ['cp_pcpp1','u17l1'],
  ['u17l1','u17l2'], ['u17l2','u17l3'], ['u17l3','u17quiz'],
  ['u17quiz','u18l1'], ['u18l1','u18l2'], ['u18l2','u18l3'], ['u18l3','u18quiz'],
  ['u18quiz','u19l1'], ['u19l1','u19l2'], ['u19l2','u19l3'], ['u19l3','u19quiz'],
  ['u19quiz','u20l1'], ['u20l1','u20l2'], ['u20l2','u20l3'], ['u20l3','u20quiz'],
  ['u20quiz','cp_pcpp2'],
];

// Which lesson node anchors each unit's floating label in the tree.
const UNIT_LABEL_ANCHOR = {
  u1: 'u1l1', u2: 'u2l1', u3: 'u3l1', u4: 'u4l1', u5: 'u5l1', u6: 'u6l1', u7: 'u7l1', u8: 'u8l1',
  u9: 'u9l1', u10: 'u10l1', u11: 'u11l1', u12: 'u12l1', u13: 'u13l1', u14: 'u14l1',
  u15: 'u15l1', u16: 'u16l1', u17: 'u17l1', u18: 'u18l1', u19: 'u19l1', u20: 'u20l1',
};

// ---- Certification checkpoints (drives roadmap markers + "ready to test" notifications) ----
const CERT_CHECKPOINTS = {
  python: [
    { id: 'cp_pcep', afterUnit: 'u7', name: 'PCEP', fullName: 'Certified Entry-Level Python Programmer', icon: '🎓' },
    { id: 'cp_pcap', afterUnit: 'u12', name: 'PCAP', fullName: 'Certified Associate in Python Programmer', icon: '🥈' },
    { id: 'cp_pcpp1', afterUnit: 'u16', name: 'PCPP1', fullName: 'Certified Professional in Python Programming 1', icon: '🥇' },
    { id: 'cp_pcpp2', afterUnit: 'u20', name: 'PCPP2', fullName: 'Certified Professional in Python Programming 2', icon: '🏆' },
  ],
};

function certScopeLessonIds(afterUnit, lang) {
  const UNITS = curriculum(lang).UNITS;
  const idx = UNITS.findIndex(u => u.id === afterUnit);
  return UNITS.slice(0, idx + 1).flatMap(u => u.lessons).filter(id => isPlayable(id, lang));
}

function certReadiness(lang, checkpoint) {
  const ids = certScopeLessonIds(checkpoint.afterUnit, lang);
  const done = ids.filter(id => isLessonComplete(lang, id)).length;
  return { ready: ids.length > 0 && done === ids.length, done, total: ids.length };
}

// Returns the first checkpoint that just became fully ready and hasn't been announced yet, or null.
function checkNewlyReadyCert(lang) {
  const ls = getLangState(lang);
  ls.certNotified = ls.certNotified || {};
  const checkpoints = CERT_CHECKPOINTS[lang] || [];
  for (const cp of checkpoints) {
    if (ls.certNotified[cp.id]) continue;
    if (certReadiness(lang, cp).ready) {
      ls.certNotified[cp.id] = true;
      save();
      return cp;
    }
  }
  return null;
}

// ---- Multi-language curriculum registry ----
// Each language's data lives under its own top-level consts (see below for Python's,
// prefixed variants for other languages). This registry + curriculum() accessor is the
// only thing that needs updating to plug a new language's data in — every helper below
// reads through it instead of touching a language's globals directly.
const CURRICULA = {
  python: { LESSONS, STUB_LESSONS, UNITS, PREREQS, TREE_LAYOUT, TREE_EDGES, UNIT_LABEL_ANCHOR },
};
// A language with no registered curriculum yet reads as genuinely empty (zero lessons/units)
// rather than silently falling back to another language's content.
const EMPTY_CURRICULUM = { LESSONS: {}, STUB_LESSONS: {}, UNITS: [], PREREQS: {}, TREE_LAYOUT: {}, TREE_EDGES: [], UNIT_LABEL_ANCHOR: {} };
function registerCurriculum(lang, data) { CURRICULA[lang] = data; }
function curriculum(lang) { return CURRICULA[lang] || EMPTY_CURRICULUM; }

function getLesson(id, lang) { const C = curriculum(lang); return C.LESSONS[id] || C.STUB_LESSONS[id] || null; }
function isPlayable(id, lang) { return !!curriculum(lang).LESSONS[id]; }

// Collect all prerequisite lesson ids (recursively) for a given lesson.
function collectPrereqs(lessonId, lang, seen) {
  seen = seen || new Set();
  const direct = curriculum(lang).PREREQS[lessonId] || [];
  direct.forEach(id => { if (!seen.has(id)) { seen.add(id); collectPrereqs(id, lang, seen); } });
  return Array.from(seen);
}

// Every question available for a lesson id: its own authored pool plus its review
// bank (if any) — the combined source placement/quiz/test-out sampling draws from.
function allQuestionsFor(lesson) {
  if (!lesson) return [];
  return [...lesson.questions, ...(lesson.reviewPool || [])];
}

// Every lesson sharing a unit with `lesson` (used to pull sibling review-bank
// questions into that unit's quiz).
function siblingLessonReviewQuestions(lesson, lang) {
  if (!lesson || !lesson.unit) return [];
  const unit = curriculum(lang).UNITS.find(u => u.id === lesson.unit);
  if (!unit) return [];
  const out = [];
  unit.lessons.forEach(id => {
    if (id === lesson.id) return;
    const l = curriculum(lang).LESSONS[id];
    if (l && l.reviewPool) out.push(...l.reviewPool);
  });
  return out;
}

// Gather every "hard" (test-out-eligible) question from a set of lesson ids.
function collectHardQuestions(lessonIds, lang) {
  const LESSONS = curriculum(lang).LESSONS;
  const out = [];
  lessonIds.forEach(id => {
    const lesson = LESSONS[id];
    if (!lesson) return;
    allQuestionsFor(lesson).filter(q => q.hard && q.type !== 'code').forEach(q => out.push({ ...q, sourceLesson: id }));
  });
  return dedupeQuestions(out);
}

// Placement test pulls only multiple-choice and code (compiling) questions — no true/false.
function collectPlacementQuestions(lessonIds, lang) {
  const LESSONS = curriculum(lang).LESSONS;
  const out = [];
  lessonIds.forEach(id => {
    const lesson = LESSONS[id];
    if (!lesson) return;
    allQuestionsFor(lesson).filter(q => q.type === 'mcq' || q.type === 'code').forEach(q => out.push({ ...q, sourceLesson: id }));
  });
  return dedupeQuestions(out);
}

// ===================================================================================
// ===== JavaScript curriculum (JSE -> JSP) =====
// Code exercises run natively in-browser (see CODE_RUNTIME in lesson-engine.js) —
// console.log output is formatted via JSON.stringify (no spaces), so `expected` strings
// for arrays/objects are written to match that exact format, e.g. "[1,2,3]", '{"a":1}'.
// ===================================================================================
const JS_LESSONS = {
  // UNIT 1 — First Contact
  j1l1: {
    id: 'j1l1', unit: 'j1', title: 'What Is JavaScript?', icon: '💾', xp: XP.LESSON,
    introLines: [
      "JavaScript is the language that makes web pages interactive.",
      "Code is just a list of instructions — JavaScript's runs in a browser (or via Node.js).",
      "console.log() is how you'll see output for now — think of it as JavaScript's print().",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>console.log()</code> do?", options: [
        "Prints (logs) a value so you can see it", "Deletes a variable", "Creates a new webpage", "Only works inside Node.js" ], answer: 0 },
      { type: 'mcq', prompt: "In the simplest sense, what is code?", options: [
        "A list of instructions a computer follows", "A type of file extension", "A design tool", "A database" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "JavaScript can only run inside a web browser.", answer: false },
      { type: 'truefalse', prompt: "console.log() is commonly used to see what a program is doing.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["console.log()", "Prints a value to the console"], ["JavaScript", "A programming language for interactive web pages"],
      ] },
      { type: 'code', prompt: "Log the text <code>hello</code> using console.log().", starter: "// your code here", expected: "hello", mustContain: ['console.log'] },
    ],
  },
  j1l2: {
    id: 'j1l2', unit: 'j1', title: 'Variables: let, const & var', icon: '📦', xp: XP.LESSON,
    introLines: [
      "A variable is a labeled box for a value.",
      "let score = 0; creates a box you can change later. const locks the value in — it can't be reassigned.",
      "var is the old way to declare variables — you'll see it in older code, but let/const are preferred today.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's the difference between let and const?", options: [
        "const can't be reassigned after its first value; let can", "They're identical in every way", "const is for numbers only", "let can only be used once" ], answer: 0 },
      { type: 'mcq', prompt: "Which is a valid variable name in JavaScript?", options: [ "myScore", "2cool", "my-score", "let" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A variable declared with const cannot be reassigned to a new value.", answer: true },
      { type: 'truefalse', prompt: "let userName = \"Alex\"; stores the text Alex in a box called userName.", answer: true },
      { type: 'match', prompt: "Match each declaration to what it does.", pairs: [
        ["let x = 5;", "Creates a variable that can be reassigned later"], ["const y = 10;", "Creates a variable that cannot be reassigned"],
      ] },
      { type: 'code', prompt: "Create a const variable called score equal to 10, then log it.", starter: "// your code here", expected: "10", mustContain: ['const', 'score'] },
    ],
  },
  j1l3: {
    id: 'j1l3', unit: 'j1', title: 'Data Types', icon: '🔤', xp: XP.LESSON,
    introLines: [
      "A number is any numeric value — JavaScript doesn't separate integers and decimals like some languages do.",
      "A string is text, wrapped in quotes. A boolean is true or false.",
      "typeof tells you a value's type: typeof 5 gives you \"number\".",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What type is <code>7</code> in JavaScript?", options: [ "number", "string", "boolean", "undefined" ], answer: 0 },
      { type: 'mcq', prompt: "Which value is a string?", options: [ '"42"', "42", "true", "undefined" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "JavaScript uses a single 'number' type for both whole numbers and decimals.", answer: true },
      { type: 'truefalse', prompt: "typeof true returns \"boolean\".", answer: true },
      { type: 'match', prompt: "Match each value to its type.", pairs: [
        ["7", "number"], ["\"hello\"", "string"], ["true", "boolean"],
      ] },
      { type: 'code', prompt: "Log the result of <code>typeof \"hi\"</code>.", starter: "// your code here", expected: "string", mustContain: ['typeof'] },
    ],
  },
  j1quiz: {
    id: 'j1quiz', unit: 'j1', title: 'Unit 1 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Time for a compiled quiz.", "It pulls from everything in First Contact.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does console.log(\"hi\") do?", options: [ "Prints hi to the console", "Deletes hi", "Creates a variable named hi", "Nothing" ], answer: 0 },
      { type: 'mcq', prompt: "Which keyword declares a variable that can't be reassigned?", options: [ "const", "let", "var", "static" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does typeof 3.5 return?", options: [ "\"number\"", "\"float\"", "\"decimal\"", "\"string\"" ], answer: 0 },
      { type: 'truefalse', prompt: "A variable can be thought of as a labeled box holding a value.", answer: true },
      { type: 'truefalse', hard: true, prompt: "let and const are both block-scoped.", answer: true },
      { type: 'truefalse', hard: true, prompt: "JavaScript has separate types for integers and decimals.", answer: false },
      { type: 'match', prompt: "Match each value to its type.", pairs: [
        ["9", "number"], ["\"hi\"", "string"], ["false", "boolean"],
      ] },
      { type: 'code', prompt: "Create a const named total equal to 5, then log it.", starter: "// your code here", expected: "5", mustContain: ['const'] },
    ],
  },

  // UNIT 2 — Operators & Expressions
  j2l1: {
    id: 'j2l1', unit: 'j2', title: 'Math Operators', icon: '➕', xp: XP.LESSON,
    introLines: [
      "+ adds, - subtracts, * multiplies, / divides — same as most languages.",
      "% gives you the remainder after division: 10 % 3 is 1.",
      "console.log(4 * 3) will show 12.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does % do between two numbers?", options: [
        "Gives the remainder after division", "Divides them", "Multiplies them", "Compares them" ], answer: 0 },
      { type: 'mcq', prompt: "What does ** do in JavaScript?", options: [ "Exponent (to the power of)", "Multiplication", "A comment marker", "Division" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "10 % 3 evaluates to 1.", answer: true },
      { type: 'truefalse', prompt: "In JavaScript, / between two integers can produce a decimal result.", answer: true },
      { type: 'match', prompt: "Match each operator to what it does.", pairs: [
        ["+", "Addition"], ["%", "Remainder"], ["**", "Exponent"],
      ] },
      { type: 'code', prompt: "Create a const total equal to 4 * 3 and log it.", starter: "// your code here", expected: "12", mustContain: ['*'] },
    ],
  },
  j2l2: {
    id: 'j2l2', unit: 'j2', title: 'Comparison Operators', icon: '⚖️', xp: XP.LESSON,
    introLines: [
      "== checks equality but allows type conversion; === checks both value AND type — always prefer ===.",
      "5 === '5' is false (different types), but 5 == '5' is true (converted).",
      "!== is the strict not-equal, mirroring ===.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Why is === generally preferred over ==?", options: [
        "It checks both value and type, avoiding surprising conversions", "It's shorter to type", "== doesn't work with numbers", "=== is deprecated" ], answer: 0 },
      { type: 'mcq', prompt: "What does 5 === '5' evaluate to?", options: [ "false", "true", "5", "an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "5 == '5' evaluates to true because == allows type conversion.", answer: true },
      { type: 'truefalse', prompt: "!== checks that two values are not equal, considering type.", answer: true },
      { type: 'match', prompt: "Match each operator to its meaning.", pairs: [
        ["===", "Strict equality (value and type)"], ["==", "Loose equality (allows conversion)"],
      ] },
      { type: 'code', prompt: "Log the result of 7 === 7.", starter: "// your code here", expected: "true", mustContain: ['==='] },
    ],
  },
  j2l3: {
    id: 'j2l3', unit: 'j2', title: 'Logical Operators & Template Literals', icon: '🔗', xp: XP.LESSON,
    introLines: [
      "&&, ||, and ! combine or flip true/false checks, just like other languages.",
      "Template literals use backticks: `Score: ${score}` inserts a variable right into a string.",
      "That's usually cleaner than joining strings with +.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a template literal use to insert a variable?", options: [
        "${...} inside backticks", "Curly braces alone", "Percent signs", "Square brackets" ], answer: 0 },
      { type: 'mcq', prompt: "What does && require?", options: [ "Both sides must be true", "Only one side needs to be true", "It flips true to false", "It's a string operator" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Template literals are written with backticks (`), not regular quotes.", answer: true },
      { type: 'truefalse', prompt: "true || false evaluates to true.", answer: true },
      { type: 'match', prompt: "Match each operator to its meaning.", pairs: [
        ["&&", "Both must be true"], ["||", "At least one must be true"], ["!", "Flips true/false"],
      ] },
      { type: 'code', prompt: "n = 5 (already defined). Log a template literal that says <code>n is 5</code>.",
        starter: "const n = 5;\n// your code here", expected: "n is 5", mustContain: ['`', '${n}'] },
    ],
  },
  j2quiz: {
    id: 'j2quiz', unit: 'j2', title: 'Unit 2 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Operators & Expressions.", "Math, comparison, logical, and template literals.", "Let's see what you've got." ],
    questions: [
      { type: 'mcq', prompt: "What does * do between two numbers?", options: [ "Multiplies them", "Compares them", "Joins them", "Divides them" ], answer: 0 },
      { type: 'mcq', prompt: "What does !== mean?", options: [ "Strictly not equal to", "Equal to", "Greater than", "Divide by" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does 3 === '3' evaluate to?", options: [ "false", "true", "3", "an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "=== checks both value and type; == only checks value (with conversion).", answer: true },
      { type: 'truefalse', hard: true, prompt: "Template literals are wrapped in backticks.", answer: true },
      { type: 'truefalse', prompt: "Both && and || are logical operators.", answer: true },
      { type: 'match', prompt: "Match the operator to its category.", pairs: [
        ["+", "Math operator"], ["===", "Comparison operator"], ["&&", "Logical operator"],
      ] },
      { type: 'code', prompt: "Create a const result equal to 10 / 2 and log it.", starter: "// your code here", expected: "5", mustContain: ['/'] },
    ],
  },

  // UNIT 3 — Making Decisions
  j3l1: {
    id: 'j3l1', unit: 'j3', title: 'If Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "An if statement runs a block only when a condition is true.",
      "if (score > 50) { console.log(\"pass\"); } — the block only runs if the condition holds.",
      "Notice the curly braces {} — they mark what's inside the block.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What do the curly braces {} mark in an if statement?", options: [
        "What's inside the block that runs conditionally", "A comment", "A function call", "An array" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>if (condition)</code> do?", options: [
        "Runs the block only when condition is true", "Runs the block every time", "Deletes a variable", "Repeats forever" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "If the condition is false, the block inside {} is skipped.", answer: true },
      { type: 'truefalse', hard: true, prompt: "if (0) is treated as false in JavaScript.", answer: true },
      { type: 'match', prompt: "Match each piece to what it means.", pairs: [
        ["if (x > 0) {...}", "Runs the block only if x is greater than 0"], ["{ }", "Marks the block of code that runs conditionally"],
      ] },
      { type: 'code', prompt: "n = 5 (already defined). Log <code>positive</code> if n is greater than 0.",
        starter: "const n = 5;\n// your code here", expected: "positive", mustContain: ['if', '>'] },
    ],
  },
  j3l2: {
    id: 'j3l2', unit: 'j3', title: 'If / Else / Else If', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "else runs when the if didn't.",
      "else if lets you check another condition.",
      "Only one branch in the chain ever runs.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>else</code> do?", options: [
        "Runs when the if condition was false", "Runs always", "Repeats the block", "Only works with loops" ], answer: 0 },
      { type: 'mcq', prompt: "How do you write 'else if' in JavaScript?", options: [ "else if", "elseif", "elif", "else.if" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Only one branch of an if/else if/else chain runs per pass.", answer: true },
      { type: 'truefalse', prompt: "else is optional — you can have just if.", answer: true },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "Checks the first condition"], ["else if", "Checks another condition"], ["else", "Runs if nothing matched"],
      ] },
      { type: 'code', prompt: "n = 0 (already defined). Log <code>zero</code> if n is 0, <code>positive</code> if greater, else <code>negative</code>.",
        starter: "const n = 0;\n// your code here", expected: "zero", mustContain: ['if', 'else if', 'else'] },
    ],
  },
  j3l3: {
    id: 'j3l3', unit: 'j3', title: 'Switch Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "A switch statement compares one value against several possible cases.",
      "Each case needs a break, or execution 'falls through' into the next one.",
      "default catches anything that didn't match a case.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does break do inside a switch case?", options: [
        "Stops execution from falling through to the next case", "Ends the whole program", "Starts a loop", "Deletes the switch" ], answer: 0 },
      { type: 'mcq', prompt: "What does the default case in a switch do?", options: [
        "Runs when no other case matched", "Always runs first", "Deletes the switch", "Only works with numbers" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Forgetting break in a switch case causes execution to fall through to the next case.", answer: true },
      { type: 'truefalse', prompt: "A switch statement can often replace a long if/else if chain.", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["case", "One possible matching value"], ["break", "Stops fall-through"], ["default", "Runs if nothing else matched"],
      ] },
      { type: 'code', prompt: "Use switch on day = \"mon\" (already defined) to log <code>weekday</code> for \"mon\", <code>weekend</code> otherwise (default).",
        starter: "const day = \"mon\";\n// your code here", expected: "weekday", mustContain: ['switch', 'case', 'default'] },
    ],
  },
  j3quiz: {
    id: 'j3quiz', unit: 'j3', title: 'Unit 3 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Making Decisions.", "if/else if/else, and switch.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What happens when an if condition is false?", options: [ "The block is skipped", "The block runs anyway", "The program crashes", "It repeats forever" ], answer: 0 },
      { type: 'mcq', prompt: "Which keyword checks an additional condition after if?", options: [ "else if", "else", "then", "or" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What happens if you forget break in a switch case?", options: [ "Execution falls through to the next case", "The switch stops entirely", "A syntax error occurs", "Nothing happens" ], answer: 0 },
      { type: 'truefalse', prompt: "else runs only if no earlier condition matched.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Only one branch of an if/else if/else chain runs per pass.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A switch statement's default case is required.", answer: false },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "First condition checked"], ["else", "Runs when nothing matched"], ["switch", "Compares one value against cases"],
      ] },
      { type: 'code', prompt: "n = -3 (already defined). Log <code>negative</code> if n is less than 0, else <code>non-negative</code>.",
        starter: "const n = -3;\n// your code here", expected: "negative", mustContain: ['if', 'else'] },
    ],
  },

  // UNIT 4 — Loops
  j4l1: {
    id: 'j4l1', unit: 'j4', title: 'While Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "while repeats its block as long as a condition stays true.",
      "while (count < 3) { ... } keeps going until count is no longer less than 3.",
      "Forget to update the condition inside, and you get an infinite loop.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a while loop do?", options: [
        "Repeats its block as long as the condition is true", "Runs its block exactly once", "Runs its block a fixed number of times only", "Never runs" ], answer: 0 },
      { type: 'mcq', prompt: "What commonly causes an infinite loop?", options: [
        "Never updating the condition so it stays true forever", "Using console.log inside it", "Declaring a const inside it", "Using else" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A while loop can run zero times if its condition starts out false.", answer: true },
      { type: 'truefalse', prompt: "You must update the condition variable inside a while loop, or it may never stop.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["while (x < 5) {...}", "Repeats while x is less than 5"], ["Infinite loop", "A loop whose condition never becomes false"],
      ] },
      { type: 'code', prompt: "Log 0, 1, 2 each on its own line using a while loop.",
        starter: "let n = 0;\n// your code here", expected: "0\n1\n2", mustContain: ['while'] },
    ],
  },
  j4l2: {
    id: 'j4l2', unit: 'j4', title: 'For Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "A for loop packs setup, condition, and update into one line.",
      "for (let i = 0; i < 3; i++) { ... } loops with i = 0, 1, then 2.",
      "i++ is shorthand for i = i + 1.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>for (let i = 0; i < 3; i++)</code> do?", options: [
        "Loops with i = 0, 1, then 2", "Loops exactly once", "Loops 4 times", "Creates a variable named for" ], answer: 0 },
      { type: 'mcq', prompt: "What does i++ mean?", options: [ "Increase i by 1", "Decrease i by 1", "Double i", "Compare i to 1" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "for (let i = 2; i < 5; i++) loops with i = 2, 3, 4 — not 5.", answer: true },
      { type: 'truefalse', prompt: "for...of can loop directly over an array's values.", answer: true },
      { type: 'match', prompt: "Match each loop to what it does.", pairs: [
        ["for (let i=0;i<4;i++)", "Loops with i = 0,1,2,3"], ["for (const ch of \"hi\")", "Loops with ch = 'h', then 'i'"],
      ] },
      { type: 'code', prompt: "Use a for loop to log 1, 2, 3, each on its own line.",
        starter: "// your code here", expected: "1\n2\n3", mustContain: ['for'] },
    ],
  },
  j4l3: {
    id: 'j4l3', unit: 'j4', title: 'Loop Control & for...of', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "break exits a loop immediately. continue skips to the next pass.",
      "for...of is the cleanest way to loop over an array's values directly.",
      "Both break and continue work inside for...of too.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does break do inside a loop?", options: [
        "Stops the loop immediately", "Skips to the next iteration", "Restarts the loop", "Pauses forever" ], answer: 0 },
      { type: 'mcq', prompt: "What does continue do?", options: [ "Skips the rest of the current iteration", "Ends the loop", "Deletes the loop variable", "Runs the block twice" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "for...of gives you each value in an array directly, without needing an index.", answer: true },
      { type: 'truefalse', prompt: "break and continue both work inside for...of loops.", answer: true },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exit the loop right now"], ["continue", "Skip to next iteration"], ["for...of", "Loop over array values directly"],
      ] },
      { type: 'code', prompt: "Loop over [0,1,2,3,4] with for...of; log each value but skip 2 using continue.",
        starter: "const nums = [0, 1, 2, 3, 4];\nfor (const n of nums) {\n  // your code here\n  console.log(n);\n}", expected: "0\n1\n3\n4", mustContain: ['continue'] },
    ],
  },
  j4quiz: {
    id: 'j4quiz', unit: 'j4', title: 'Unit 4 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Loops.", "while, for, for...of, and loop control.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which loop keeps running as long as a condition is true?", options: [ "while", "for...of", "switch", "function" ], answer: 0 },
      { type: 'mcq', prompt: "What does for (let i = 0; i < 3; i++) loop through?", options: [ "0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "3, only" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does break do inside a loop?", options: [ "Exits the loop immediately", "Skips one iteration", "Restarts the loop", "Does nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "continue skips the rest of the current iteration only.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A while loop's condition is checked before each pass, including the first.", answer: true },
      { type: 'truefalse', hard: true, prompt: "for...of gives you the index instead of the value.", answer: false },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exits the loop"], ["continue", "Skips to next iteration"], ["for...of", "Iterates over values"],
      ] },
      { type: 'code', prompt: "Use a for loop to log 5, 4, 3, 2, 1 (decrementing).", starter: "// your code here", expected: "5\n4\n3\n2\n1", mustContain: ['for'] },
    ],
  },

  // UNIT 5 — Functions
  j5l1: {
    id: 'j5l1', unit: 'j5', title: 'Defining Functions', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A function is a named, reusable block of instructions.",
      "function greet() { ... } defines it. Calling greet() later runs everything inside.",
      "Functions let you write something once and reuse it.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>function greet() {}</code> do?", options: [
        "Defines a function named greet", "Calls the function immediately", "Deletes a function", "Imports a module" ], answer: 0 },
      { type: 'mcq', prompt: "How do you run a function named greet?", options: [ "greet()", "function greet", "run greet", "greet" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Defining a function runs its code immediately.", answer: false },
      { type: 'truefalse', prompt: "A function's code only runs when it's called.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["function sayHi() {}", "Defines a function named sayHi"], ["sayHi()", "Calls (runs) the function"],
      ] },
      { type: 'code', prompt: "Define a function greet that logs <code>hi</code>, then call it once.",
        starter: "// your code here", expected: "hi", mustContain: ['function', 'greet('] },
    ],
  },
  j5l2: {
    id: 'j5l2', unit: 'j5', title: 'Parameters & Arguments', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A parameter is a placeholder a function expects.",
      "function greet(name) { ... } — name is the parameter. greet(\"Ana\") passes \"Ana\" as the argument.",
      "Functions can take more than one parameter, separated by commas.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "In <code>function greet(name) {}</code>, what is <code>name</code>?", options: [
        "A parameter — a placeholder for a value the function needs", "A loop variable", "A keyword", "The return value" ], answer: 0 },
      { type: 'mcq', prompt: "In <code>greet(\"Ana\")</code>, what is \"Ana\"?", options: [
        "The argument — the actual value passed in", "The parameter", "A comment", "A data type" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A function can take more than one parameter.", answer: true },
      { type: 'truefalse', prompt: "Calling a function without a required argument sets that parameter to undefined.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "The placeholder name in the function definition"], ["Argument", "The actual value you pass in when calling"],
      ] },
      { type: 'code', prompt: "Define <code>add(a, b)</code> that logs a + b, then call <code>add(2, 3)</code>.",
        starter: "// your code here", expected: "5", mustContain: ['function add', '+'] },
    ],
  },
  j5l3: {
    id: 'j5l3', unit: 'j5', title: 'Arrow Functions & Return Values', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "Arrow functions are a shorter way to write functions: (a, b) => a + b",
      "return sends a value back out of a function, instead of just logging it.",
      "A function without return gives back undefined.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>const add = (a, b) => a + b;</code> define?", options: [
        "An arrow function that returns a + b", "A regular variable holding a number", "A loop", "An object" ], answer: 0 },
      { type: 'mcq', prompt: "What does return do?", options: [
        "Sends a value back to wherever the function was called", "Logs a value to the console", "Stops the whole program", "Deletes the function" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A function without a return statement returns undefined.", answer: true },
      { type: 'truefalse', prompt: "Arrow functions can be a shorter way to write the same logic as function.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["return x;", "Sends x back out of the function"], ["(a) => a * 2", "An arrow function that doubles a"],
      ] },
      { type: 'code', prompt: "Define square as an arrow function returning n * n. Log square(4).",
        starter: "// your code here\nconsole.log(square(4));", expected: "16", mustContain: ['=>'] },
    ],
  },
  j5quiz: {
    id: 'j5quiz', unit: 'j5', title: 'Unit 5 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Functions.", "Defining, calling, parameters, arrow functions, and return values.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What keyword starts a regular function definition?", options: [ "function", "func", "define", "fn" ], answer: 0 },
      { type: 'mcq', prompt: "What does a parameter represent?", options: [ "A placeholder for a value the function expects", "The function's name", "An error message", "A loop counter" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does a function return if it has no return statement?", options: [ "undefined", "0", "an error", "an empty string" ], answer: 0 },
      { type: 'truefalse', prompt: "Calling a function runs the code inside it.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Arrow functions can be used as a shorter alternative to the function keyword.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A function can take zero parameters.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "Placeholder in the definition"], ["Argument", "Actual value passed in"], ["return", "Sends a value back"],
      ] },
      { type: 'code', prompt: "Define double as an arrow function returning n * 2. Log double(6).",
        starter: "// your code here\nconsole.log(double(6));", expected: "12", mustContain: ['=>'] },
    ],
  },

  // UNIT 6 — Arrays
  j6l1: {
    id: 'j6l1', unit: 'j6', title: 'Array Basics', icon: '📚', xp: XP.LESSON,
    introLines: [
      "An array is an ordered list of values, written with square brackets.",
      "const nums = [1, 2, 3]; access items by position, starting at 0: nums[0] is 1.",
      "nums.length tells you how many items it holds.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>nums[0]</code> get you in <code>const nums = [10, 20, 30]</code>?", options: [ "10", "20", "30", "undefined" ], answer: 0 },
      { type: 'mcq', prompt: "What does nums.length return for [1,2,3]?", options: [ "3", "2", "1", "undefined" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Array indexing starts at 0, not 1.", answer: true },
      { type: 'truefalse', prompt: "Arrays declared with const can still have their contents changed.", answer: true },
      { type: 'match', prompt: "Match each expression to what it does.", pairs: [
        ["nums[1]", "The second item"], ["nums.length", "How many items are in the array"],
      ] },
      { type: 'code', prompt: "Create const nums = [1,2,3]. Log nums.length.", starter: "// your code here", expected: "3", mustContain: ['.length'] },
    ],
  },
  j6l2: {
    id: 'j6l2', unit: 'j6', title: 'Array Methods', icon: '📚', xp: XP.LESSON,
    introLines: [
      "push() adds to the end; pop() removes from the end.",
      "slice() copies out a portion without changing the original.",
      "These methods are your main toolbox for working with arrays.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does .push() do to an array?", options: [ "Adds an item to the end", "Removes the first item", "Sorts the array", "Deletes the array" ], answer: 0 },
      { type: 'mcq', prompt: "What does nums.slice(0, 2) return for nums = [1,2,3,4]?", options: [ "[1,2]", "[1,2,3]", "[3,4]", "4" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "push() modifies the original array; slice() returns a new one without changing the original.", answer: true },
      { type: 'truefalse', prompt: "pop() removes and returns the last item of an array.", answer: true },
      { type: 'match', prompt: "Match each method to what it does.", pairs: [
        ["push(x)", "Adds x to the end"], ["pop()", "Removes the last item"], ["slice(a,b)", "Copies a portion, unchanged original"],
      ] },
      { type: 'code', prompt: "Create const nums = [1,2,3]. Push 4, then log nums.",
        starter: "const nums = [1, 2, 3];\n// your code here", expected: "[1,2,3,4]", mustContain: ['push'] },
    ],
  },
  j6l3: {
    id: 'j6l3', unit: 'j6', title: 'Iterating Arrays', icon: '📚', xp: XP.LESSON,
    introLines: [
      "for...of is the cleanest way to visit every value in an array.",
      "forEach(callback) runs a function once per item — a common alternative style.",
      "Both achieve the same goal: doing something with each element.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does nums.forEach(callback) do?", options: [
        "Runs callback once for every item in nums", "Runs callback once total", "Deletes nums", "Sorts nums" ], answer: 0 },
      { type: 'mcq', prompt: "Which loop style visits each array value directly, without an index?", options: [ "for...of", "for...in only", "switch", "while (true)" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "forEach() runs its callback function once per array item.", answer: true },
      { type: 'truefalse', prompt: "for...of and forEach can both be used to visit every item in an array.", answer: true },
      { type: 'match', prompt: "Match each style to what it does.", pairs: [
        ["for (const n of nums)", "Visits each value directly"], ["nums.forEach(fn)", "Runs fn once per item"],
      ] },
      { type: 'code', prompt: "Use forEach to log every number in [1,2,3], each on its own line.",
        starter: "const nums = [1, 2, 3];\n// your code here", expected: "1\n2\n3", mustContain: ['forEach'] },
    ],
  },
  j6quiz: {
    id: 'j6quiz', unit: 'j6', title: 'Unit 6 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Arrays.", "Basics, methods, and iteration.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What syntax creates an array?", options: [ "Square brackets, like [1,2,3]", "Curly braces, like {1,2,3}", "Parentheses, like (1,2,3)", "Angle brackets" ], answer: 0 },
      { type: 'mcq', prompt: "What does .pop() do?", options: [ "Removes and returns the last item", "Adds an item to the start", "Sorts the array", "Deletes the whole array" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does [1,2,3].length return?", options: [ "3", "2", "1", "undefined" ], answer: 0 },
      { type: 'truefalse', prompt: "Array indexing starts at 0.", answer: true },
      { type: 'truefalse', hard: true, prompt: "forEach runs a callback once per item in the array.", answer: true },
      { type: 'truefalse', hard: true, prompt: "slice() modifies the original array.", answer: false },
      { type: 'match', prompt: "Match each method to its purpose.", pairs: [
        ["push", "Adds to the end"], ["pop", "Removes from the end"], ["slice", "Copies a portion"],
      ] },
      { type: 'code', prompt: "Create const nums = [1,2,3]. Push 4 and log nums.", starter: "const nums = [1, 2, 3];\n// your code here", expected: "[1,2,3,4]", mustContain: ['push'] },
    ],
  },

  // UNIT 7 — Objects & Strings
  j7l1: {
    id: 'j7l1', unit: 'j7', title: 'Object Literals', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "An object stores key-value pairs, written with curly braces.",
      "const person = { name: \"Ana\" }; get the value back with person.name or person[\"name\"].",
      "Objects are how JavaScript groups related data together.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>person.name</code> return, given <code>const person = { name: \"Ana\" }</code>?", options: [
        '"Ana"', '"name"', "undefined", "an error" ], answer: 0 },
      { type: 'mcq', prompt: "What's stored in an object?", options: [ "Key-value pairs", "Only numbers", "Only positions, like an array", "Only true/false values" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You can access an object's property with either dot notation or bracket notation.", answer: true },
      { type: 'truefalse', prompt: "You can add a new property to an object just by assigning to it, like person.age = 30.", answer: true },
      { type: 'match', prompt: "Match each expression to what it does.", pairs: [
        ["person.name", "Gets the value stored under name"], ["person.age = 30", "Adds or updates the age property"],
      ] },
      { type: 'code', prompt: "Create const scores = { ana: 90 }. Log scores.ana.", starter: "// your code here", expected: "90", mustContain: ['{', '}'] },
    ],
  },
  j7l2: {
    id: 'j7l2', unit: 'j7', title: 'String Methods', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "Strings come with built-in methods, like .toUpperCase() and .toLowerCase().",
      "\"hi\".toUpperCase() gives you \"HI\" — the original string doesn't change.",
      ".trim() removes extra whitespace from the ends.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>\"hi\".toUpperCase()</code> return?", options: [ '"HI"', '"hi"', '"Hi"', "an error" ], answer: 0 },
      { type: 'mcq', prompt: "What does .trim() do?", options: [ "Removes leading/trailing whitespace", "Converts to uppercase", "Reverses the string", "Splits into an array" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "String methods like .toUpperCase() return a new string rather than changing the original.", answer: true },
      { type: 'truefalse', prompt: "\" hi \".trim() equals \"hi\".", answer: true },
      { type: 'match', prompt: "Match each method to what it does.", pairs: [
        [".toUpperCase()", "ALL CAPS version"], [".toLowerCase()", "all lowercase version"], [".trim()", "Removes edge whitespace"],
      ] },
      { type: 'code', prompt: "Log <code>\"cat\".toUpperCase()</code>.", starter: "// your code here", expected: "CAT", mustContain: ['.toUpperCase('] },
    ],
  },
  j7l3: {
    id: 'j7l3', unit: 'j7', title: 'Template Literals & Destructuring', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "Template literals (backticks) let you embed expressions: `Total: ${a + b}`",
      "Destructuring pulls values out of arrays/objects in one line: const { name } = person;",
      "Both make working with data much less repetitive.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>const { name } = person;</code> do?", options: [
        "Pulls the name property out of person into its own variable", "Deletes the name property", "Creates a new object called name", "Converts person to a string" ], answer: 0 },
      { type: 'mcq', prompt: "What can go inside a template literal's ${}?", options: [ "Any expression", "Only variable names", "Only numbers", "Nothing — it's just decoration" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Array destructuring can pull out values by position: const [a, b] = [1, 2];", answer: true },
      { type: 'truefalse', prompt: "Template literals are written with backticks, not regular quotes.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["`${x}`", "Inserts x's value into the string"], ["const { name } = obj;", "Pulls out the name property"],
      ] },
      { type: 'code', prompt: "const person = { name: \"Ana\" } (already defined). Destructure name and log a template literal saying <code>Hi, Ana</code>.",
        starter: "const person = { name: \"Ana\" };\n// your code here", expected: "Hi, Ana", mustContain: ['const { name }', '`'] },
    ],
  },
  j7quiz: {
    id: 'j7quiz', unit: 'j7', title: 'Unit 7 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Objects & Strings.", "Object literals, string methods, template literals, destructuring.", "This one wraps up JSE-level material." ],
    questions: [
      { type: 'mcq', prompt: "What syntax creates an object?", options: [ "Curly braces with key: value pairs", "Square brackets", "Parentheses", "Angle brackets" ], answer: 0 },
      { type: 'mcq', prompt: "What does .toLowerCase() return?", options: [ "An all-lowercase version of the string", "An all-uppercase version", "The string reversed", "The string's length" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does const { a } = { a: 1, b: 2 }; do?", options: [ "Pulls a (value 1) into its own variable", "Deletes b", "Creates an array", "Throws an error" ], answer: 0 },
      { type: 'truefalse', prompt: "Object properties can be accessed with dot or bracket notation.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Template literals allow embedded expressions using ${}.", answer: true },
      { type: 'truefalse', hard: true, prompt: "String methods mutate (change) the original string.", answer: false },
      { type: 'match', prompt: "Match each expression to its result idea.", pairs: [
        [".trim()", "Removes edge whitespace"], ["`${x}`", "Inserts x's value"], ["obj.prop", "Accesses a property"],
      ] },
      { type: 'code', prompt: "const word = \"syntaxed\" (already defined). Log word.slice(-5).", starter: "const word = \"syntaxed\";\n// your code here", expected: "taxed", mustContain: ['.slice('] },
    ],
  },

  // UNIT 8 — Errors & Exceptions
  j8l1: {
    id: 'j8l1', unit: 'j8', title: 'Handling Errors', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "Sometimes code fails at runtime — that's called an exception.",
      "try { risky(); } catch (e) { handle(e); } lets your program recover instead of crashing.",
      "finally runs no matter what — success or failure.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a try/catch block do?", options: [
        "Lets you handle an error instead of crashing the program", "Prevents all errors from happening", "Deletes the error", "Only works with console.log" ], answer: 0 },
      { type: 'mcq', prompt: "When does the finally block run?", options: [
        "Always, whether or not an error occurred", "Only if there was an error", "Only if there wasn't an error", "Never automatically" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "The catch block receives the error object that was thrown.", answer: true },
      { type: 'truefalse', prompt: "If no exception occurs, the catch block is skipped entirely.", answer: true },
      { type: 'match', prompt: "Match each block to its role.", pairs: [
        ["try", "The code that might fail"], ["catch", "Runs if an error happened"], ["finally", "Always runs, error or not"],
      ] },
      { type: 'code', prompt: "Wrap <code>JSON.parse(\"bad\")</code> in try/catch; in catch, log <code>caught</code>.",
        starter: "try {\n  JSON.parse(\"bad\");\n// your code here", expected: "caught", mustContain: ['catch'] },
    ],
  },
  j8l2: {
    id: 'j8l2', unit: 'j8', title: 'Throwing & Custom Errors', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "You can trigger your own error on purpose with throw.",
      "throw new Error(\"bad input\") stops execution right there, unless something catches it.",
      "You can define custom error types by extending the built-in Error class.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>throw new Error(\"bad\")</code> do?", options: [
        "Immediately triggers an error with that message", "Logs the message and continues", "Catches an existing error", "Defines a new function" ], answer: 0 },
      { type: 'mcq', prompt: "How do you define a custom error type?", options: [
        "A class that extends Error", "Using the keyword customerror", "Using try without catch", "You can't — only built-in errors exist" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "throw stops the current function unless the error is caught somewhere.", answer: true },
      { type: 'truefalse', prompt: "A custom error class typically extends the built-in Error class.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["throw new Error(\"x\")", "Triggers an error on purpose"], ["class MyError extends Error {}", "Defines a custom error type"],
      ] },
      { type: 'code', prompt: "Define class MyError extends Error {}. Throw it inside try/catch that logs <code>caught custom</code>.",
        starter: "class MyError extends Error {}\n\ntry {\n  throw new MyError(\"oops\");\n// your code here", expected: "caught custom", mustContain: ['catch'] },
    ],
  },
  j8l3: {
    id: 'j8l3', unit: 'j8', title: 'Debugging Basics', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "console.log() is a fine first debugging tool — see what a variable actually holds.",
      "Reading an error's message and stack trace usually tells you exactly where it failed.",
      "console.error() is a variant meant specifically for error messages.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is console.error() typically used for?", options: [
        "Logging error-level messages, distinct from regular logs", "Deleting errors", "Only works in Node", "Stopping the program" ], answer: 0 },
      { type: 'mcq', prompt: "What's a common first step in debugging unexpected behavior?", options: [
        "Log the values of relevant variables to see what they actually are", "Delete the code and start over", "Ignore it", "Add more comments only" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Temporary console.log() statements are a common, legitimate debugging technique.", answer: true },
      { type: 'truefalse', prompt: "An error's stack trace can help show where in the code it happened.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["console.log", "General-purpose output"], ["console.error", "Error-specific output"],
      ] },
      { type: 'code', prompt: "Log the value of mystery (already set to 42) to see what it holds.",
        starter: "const mystery = 42;\n// your code here", expected: "42", mustContain: ['console.log'] },
    ],
  },
  j8quiz: {
    id: 'j8quiz', unit: 'j8', title: 'Unit 8 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Errors & Exceptions.", "try/catch/finally, throwing, and debugging.", "This unit kicks off JSP-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does try/catch let a program do?", options: [ "Recover from an error instead of crashing", "Prevent errors from occurring", "Run faster", "Skip loops" ], answer: 0 },
      { type: 'mcq', prompt: "What does throw do?", options: [ "Triggers an error on purpose", "Catches an error", "Closes a file", "Defines a function" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "When does finally run?", options: [ "Always, error or not", "Only on success", "Only on failure", "Never automatically" ], answer: 0 },
      { type: 'truefalse', prompt: "A custom error class usually extends Error.", answer: true },
      { type: 'truefalse', hard: true, prompt: "catch receives the error object that was thrown.", answer: true },
      { type: 'truefalse', hard: true, prompt: "You can have multiple catch blocks for one try in JavaScript.", answer: false },
      { type: 'match', prompt: "Match each keyword to its purpose.", pairs: [
        ["try", "Code that might fail"], ["catch", "Handles the failure"], ["throw", "Triggers an error"],
      ] },
      { type: 'code', prompt: "Wrap JSON.parse(\"oops\") in try/catch; log <code>handled</code> in catch.",
        starter: "try {\n  JSON.parse(\"oops\");\n// your code here", expected: "handled", mustContain: ['catch'] },
    ],
  },

  // UNIT 9 — Higher-Order Functions
  j9l1: {
    id: 'j9l1', unit: 'j9', title: 'map, filter & reduce', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "map() transforms every item into something new, returning a new array.",
      "filter() keeps only the items that pass a test.",
      "reduce() folds an array down into a single value.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>[1,2,3].map(x => x * 2)</code> return?", options: [ "[2,4,6]", "[1,2,3]", "6", "an error" ], answer: 0 },
      { type: 'mcq', prompt: "What does filter(fn) do?", options: [ "Keeps only the items where fn returns true", "Doubles every item", "Sorts the array", "Deletes the array" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "map() always returns a new array the same length as the original.", answer: true },
      { type: 'truefalse', prompt: "reduce() can combine an array's items into a single total.", answer: true },
      { type: 'match', prompt: "Match each method to its purpose.", pairs: [
        ["map", "Transforms every item"], ["filter", "Keeps matching items"], ["reduce", "Folds into a single value"],
      ] },
      { type: 'code', prompt: "Use map to double each item in [1,2,3] and log the result.",
        starter: "const nums = [1, 2, 3];\n// your code here", expected: "[2,4,6]", mustContain: ['.map('] },
    ],
  },
  j9l2: {
    id: 'j9l2', unit: 'j9', title: 'forEach & sort', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "forEach runs a function once per item, without returning anything new.",
      "sort() rearranges an array in place — by default, alphabetically as strings!",
      "Pass a compare function to sort numbers correctly: (a, b) => a - b",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Why does <code>[10, 2, 1].sort()</code> NOT sort numerically by default?", options: [
        "Because sort() converts to strings and compares alphabetically by default", "Because sort() is broken", "Because arrays can't be sorted", "Because it requires an import" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>(a, b) => a - b</code> as a compare function achieve in sort()?", options: [
        "Correct ascending numeric order", "Reverses the array", "Removes duplicates", "Converts to strings" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "sort() modifies the original array in place.", answer: true },
      { type: 'truefalse', prompt: "forEach does not return a new array — it's just for running side effects like logging.", answer: true },
      { type: 'match', prompt: "Match each method to its purpose.", pairs: [
        ["forEach", "Runs a function per item, no return value"], ["sort((a,b)=>a-b)", "Sorts numbers in ascending order"],
      ] },
      { type: 'code', prompt: "Sort [3,1,2] numerically ascending and log the result.",
        starter: "const nums = [3, 1, 2];\n// your code here", expected: "[1,2,3]", mustContain: ['.sort('] },
    ],
  },
  j9l3: {
    id: 'j9l3', unit: 'j9', title: 'Callbacks', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "A callback is a function passed into another function to be called later.",
      "map, filter, forEach, and sort all take callbacks — this pattern is everywhere in JS.",
      "Callbacks are the foundation that promises and async/await build on.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a callback?", options: [
        "A function passed into another function to be called later", "A type of loop", "A built-in error", "A variable declaration" ], answer: 0 },
      { type: 'mcq', prompt: "Which of these methods take a callback function?", options: [ "map, filter, and forEach", "only console.log", "only switch", "only while" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Callbacks are a foundational pattern that async/await and promises build on.", answer: true },
      { type: 'truefalse', prompt: "A callback function can be written inline as an arrow function.", answer: true },
      { type: 'match', prompt: "Match each snippet to its role.", pairs: [
        ["nums.map(x => x*2)", "x => x*2 is the callback"], ["Callback", "A function passed to run later"],
      ] },
      { type: 'code', prompt: "Use filter with a callback to keep even numbers from [1,2,3,4,5,6] and log the result.",
        starter: "const nums = [1, 2, 3, 4, 5, 6];\n// your code here", expected: "[2,4,6]", mustContain: ['.filter('] },
    ],
  },
  j9quiz: {
    id: 'j9quiz', unit: 'j9', title: 'Unit 9 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Higher-Order Functions.", "map/filter/reduce, forEach, sort, and callbacks.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does map() return?", options: [ "A new array of transformed values", "A single number", "The original array unchanged", "undefined" ], answer: 0 },
      { type: 'mcq', prompt: "What does a callback let you do?", options: [ "Pass a function to be called later by another function", "Delete a function", "Create a new class", "Import a module" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What's needed to sort numbers correctly with sort()?", options: [ "A compare function like (a,b) => a - b", "Nothing — default sort works fine for numbers", "Converting to strings first", "Using map instead" ], answer: 0 },
      { type: 'truefalse', prompt: "filter() returns only the items where the callback returns true.", answer: true },
      { type: 'truefalse', hard: true, prompt: "reduce() can fold an array down into a single accumulated value.", answer: true },
      { type: 'truefalse', hard: true, prompt: "forEach() returns a new transformed array like map() does.", answer: false },
      { type: 'match', prompt: "Match each method to its purpose.", pairs: [
        ["map", "Transform each item"], ["filter", "Keep matching items"], ["forEach", "Run a side effect per item"],
      ] },
      { type: 'code', prompt: "Use map with a callback to add 1 to each item in [1,2,3] and log the result.",
        starter: "const nums = [1, 2, 3];\n// your code here", expected: "[2,3,4]", mustContain: ['.map('] },
    ],
  },

  // UNIT 10 — OOP Foundations
  j10l1: {
    id: 'j10l1', unit: 'j10', title: 'Constructor Functions & this', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "A constructor function is a blueprint, called with new to create objects.",
      "Inside it, this refers to the object being created.",
      "function Dog(name) { this.name = name; } — then new Dog(\"Fido\") builds one.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>this</code> refer to inside a constructor function?", options: [
        "The specific object being created", "A global variable", "The function's name", "Nothing — it's optional" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>new Dog(\"Fido\")</code> do?", options: [
        "Creates a new Dog object with name set to Fido", "Defines the Dog function", "Deletes the Dog function", "Logs the word Dog" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Constructor function names are conventionally capitalized, like Dog.", answer: true },
      { type: 'truefalse', prompt: "Multiple objects can be created from the same constructor function.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["function Dog(name){this.name=name;}", "Defines a constructor"], ["new Dog(\"Fido\")", "Creates an object from it"],
      ] },
      { type: 'code', prompt: "Define function Dog(name) storing this.name. Create fido = new Dog(\"Fido\") and log fido.name.",
        starter: "// your code here", expected: "Fido", mustContain: ['this.name', 'new Dog'] },
    ],
  },
  j10l2: {
    id: 'j10l2', unit: 'j10', title: 'Classes', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "class is a cleaner, modern syntax for the same constructor-function idea.",
      "constructor(name) { this.name = name; } runs automatically when you create an object.",
      "Methods go directly inside the class body, no function keyword needed.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "When does a class's constructor method run?", options: [
        "Automatically, every time a new object is created with new", "Only when called by name", "Never automatically", "Once per program" ], answer: 0 },
      { type: 'mcq', prompt: "How do you create an object from class Dog?", options: [ "new Dog()", "Dog()", "create Dog()", "Dog.new()" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "class syntax is mostly a cleaner way to write the same thing as a constructor function.", answer: true },
      { type: 'truefalse', prompt: "Methods defined inside a class don't need the function keyword.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["class Dog {}", "Defines a class"], ["constructor(name){this.name=name;}", "Runs on object creation"],
      ] },
      { type: 'code', prompt: "Define class Dog with constructor(name) storing this.name. Create fido = new Dog(\"Fido\") and log fido.name.",
        starter: "// your code here", expected: "Fido", mustContain: ['class Dog', 'constructor'] },
    ],
  },
  j10l3: {
    id: 'j10l3', unit: 'j10', title: 'Inheritance with extends', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "A class can inherit from another using extends.",
      "class Puppy extends Dog {} gets everything Dog has, plus anything new.",
      "super() calls the parent class's constructor.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>class Puppy extends Dog {}</code> mean?", options: [ "Puppy inherits from Dog", "Puppy replaces Dog", "Dog inherits from Puppy", "A syntax error" ], answer: 0 },
      { type: 'mcq', prompt: "What does super() do inside a subclass's constructor?", options: [ "Calls the parent class's constructor", "Deletes the parent class", "Creates a new class", "Skips the constructor" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A subclass can override a method it inherited from its parent.", answer: true },
      { type: 'truefalse', prompt: "A subclass automatically has access to its parent class's methods.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["extends", "Inherits from a parent class"], ["super()", "Calls the parent constructor"],
      ] },
      { type: 'code', prompt: "Define class Animal with speak() logging \"...\". Define class Dog extends Animal overriding speak() to log <code>Woof</code>. Call new Dog().speak().",
        starter: "// your code here", expected: "Woof", mustContain: ['extends Animal'] },
    ],
  },
  j10quiz: {
    id: 'j10quiz', unit: 'j10', title: 'Unit 10 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — OOP Foundations.", "Constructor functions, classes, and inheritance.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What keyword creates an object from a class or constructor function?", options: [ "new", "class", "this", "extends" ], answer: 0 },
      { type: 'mcq', prompt: "What does this refer to inside a constructor?", options: [ "The object being created", "A global variable", "The class name", "Nothing" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does class Cat extends Animal mean?", options: [ "Cat inherits from Animal", "Animal inherits from Cat", "They're unrelated", "A syntax error" ], answer: 0 },
      { type: 'truefalse', prompt: "class syntax runs its constructor automatically on new.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A subclass can override a method it inherited from its parent.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Multiple distinct objects can be created from the same class.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Class", "Blueprint"], ["Object", "An instance built from a class"], ["extends", "Inherits from a parent"],
      ] },
      { type: 'code', prompt: "Define class Cat with constructor(name) storing this.name. Create c = new Cat(\"Milo\") and log c.name.",
        starter: "// your code here", expected: "Milo", mustContain: ['constructor'] },
    ],
  },

  // UNIT 11 — OOP In Depth
  j11l1: {
    id: 'j11l1', unit: 'j11', title: 'Getters, Setters & Static Members', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "get and set let you define properties that run code when accessed or assigned.",
      "static members belong to the class itself, not to individual objects.",
      "Great for validation logic or shared utility values.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a get accessor let you do?", options: [
        "Run code when a property is read, but access it like a plain property", "Only works with numbers", "Delete a property", "Replace a constructor" ], answer: 0 },
      { type: 'mcq', prompt: "What does static mean on a class member?", options: [
        "It belongs to the class itself, not individual instances", "It can never change", "It's automatically private", "It only works in loops" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A setter (set) runs code whenever that property is assigned a new value.", answer: true },
      { type: 'truefalse', prompt: "Static methods are called on the class itself, like ClassName.method(), not on an instance.", answer: true },
      { type: 'match', prompt: "Match each snippet to its role.", pairs: [
        ["get value()", "Runs when the property is read"], ["static create()", "Called on the class itself"],
      ] },
      { type: 'code', prompt: "Define class Circle with static PI = 3. Log Circle.PI.", starter: "// your code here", expected: "3", mustContain: ['static'] },
    ],
  },
  j11l2: {
    id: 'j11l2', unit: 'j11', title: 'Private Fields & Encapsulation', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "A field prefixed with # is truly private — inaccessible from outside the class.",
      "This is stronger than the naming-convention privacy some languages rely on.",
      "Encapsulation keeps an object's internals protected from outside interference.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a # prefix on a class field mean?", options: [
        "It's truly private, inaccessible from outside the class", "It's a comment", "It's a static member", "It's required on every field" ], answer: 0 },
      { type: 'mcq', prompt: "Why use encapsulation?", options: [
        "To protect an object's internal state from being changed directly from outside", "To make code run faster", "Because JavaScript requires it", "To delete unused classes" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Private fields (#field) cannot be accessed from outside the class, even by name.", answer: true },
      { type: 'truefalse', prompt: "Encapsulation is often paired with public getter/setter methods to control access.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["#balance", "A private field"], ["Encapsulation", "Protecting internal state"],
      ] },
      { type: 'code', prompt: "Define class Account with #balance = 100 set in the constructor and a getter balance returning it. Log acc.balance.",
        starter: "// your code here\nconst acc = new Account();\nconsole.log(acc.balance);", expected: "100", mustContain: ['#balance'] },
    ],
  },
  j11l3: {
    id: 'j11l3', unit: 'j11', title: 'Prototypes', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "Under the hood, JavaScript objects are linked through a prototype chain.",
      "Every object made from a class shares its methods via the prototype, not a copy each.",
      "This is why classes are memory-efficient — methods live in one shared place.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "How do objects made from the same class share methods?", options: [
        "Through the prototype — one shared copy, not one per object", "Each object gets its own separate copy", "They don't share anything", "Only static methods are shared" ], answer: 0 },
      { type: 'mcq', prompt: "What can you check with <code>fido instanceof Dog</code>?", options: [
        "Whether fido was created from the Dog class (or its prototype chain)", "Whether fido is a number", "Whether Dog is empty", "Whether fido has a name" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Class syntax in JavaScript is built on top of prototypes under the hood.", answer: true },
      { type: 'truefalse', prompt: "instanceof checks whether an object's prototype chain includes a given class.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Prototype", "Shared location for a class's methods"], ["instanceof", "Checks an object's prototype chain"],
      ] },
      { type: 'code', prompt: "class Dog {} (already defined). Create fido = new Dog(); log fido instanceof Dog.",
        starter: "class Dog {}\nconst fido = new Dog();\n// your code here", expected: "true", mustContain: ['instanceof'] },
    ],
  },
  j11quiz: {
    id: 'j11quiz', unit: 'j11', title: 'Unit 11 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — OOP In Depth.", "Getters/setters, static members, private fields, prototypes.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does a # prefix mean on a class field?", options: [ "It's private", "It's static", "It's a comment", "It's required" ], answer: 0 },
      { type: 'mcq', prompt: "What does static mean on a class member?", options: [ "Belongs to the class, not instances", "Can't be changed ever", "Automatically private", "Only works once" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does instanceof check?", options: [ "Whether an object's prototype chain includes a given class", "Whether a value is a number", "Whether a class is static", "Whether a field is private" ], answer: 0 },
      { type: 'truefalse', prompt: "A getter lets you run code when a property is read.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Private fields cannot be accessed from outside their class.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Every object gets its own separate copy of a class's methods.", answer: false },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["get/set", "Property accessors"], ["static", "Belongs to the class itself"], ["#field", "Truly private"],
      ] },
      { type: 'code', prompt: "Define class MathUtil with static double(n) returning n * 2. Log MathUtil.double(5).",
        starter: "// your code here", expected: "10", mustContain: ['static'] },
    ],
  },

  // UNIT 12 — Closures & Scope
  j12l1: {
    id: 'j12l1', unit: 'j12', title: 'Closures', icon: '🔗', xp: XP.LESSON,
    introLines: [
      "A closure is a function that remembers the variables from where it was created.",
      "Even after the outer function finishes, the inner function keeps access to those variables.",
      "This is how you build things like private counters.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a closure?", options: [
        "A function that remembers variables from where it was created, even after that scope ends", "A type of loop", "A built-in error", "A way to delete variables" ], answer: 0 },
      { type: 'mcq', prompt: "Why are closures useful for a counter function?", options: [
        "They let an inner function keep private access to a variable across calls", "They make code run faster", "They're required for all functions", "They delete unused variables" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A closure keeps access to variables from its outer scope even after that outer function has returned.", answer: true },
      { type: 'truefalse', prompt: "Closures are commonly used to create private state without using classes.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Closure", "Function + remembered variables from its creation scope"], ["makeCounter()", "Common example that returns a closure"],
      ] },
      { type: 'code', prompt: "Define makeCounter returning a function that increments and returns a count starting at 0. Call it twice and log the second result.",
        starter: "function makeCounter() {\n  let count = 0;\n  // your code here\n}\nconst counter = makeCounter();\ncounter();\nconsole.log(counter());", expected: "2", mustContain: ['count'] },
    ],
  },
  j12l2: {
    id: 'j12l2', unit: 'j12', title: 'Hoisting & let/const vs var', icon: '🔗', xp: XP.LESSON,
    introLines: [
      "var declarations are hoisted (moved to the top) and function-scoped — a common source of bugs.",
      "let and const are block-scoped, and don't have that same confusing hoisting behavior.",
      "This is why modern JavaScript almost always prefers let and const over var.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does 'block-scoped' mean for let and const?", options: [
        "They only exist inside the {} block where they're declared", "They're available everywhere in the file", "They can't be reassigned", "They must be declared at the top of a function" ], answer: 0 },
      { type: 'mcq', prompt: "Why do many style guides recommend avoiding var?", options: [
        "Its function-scoping and hoisting behavior can cause confusing bugs", "It's slower than let", "It doesn't work in loops", "It's been removed from JavaScript" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "var is function-scoped, while let and const are block-scoped.", answer: true },
      { type: 'truefalse', prompt: "Modern JavaScript style generally prefers let and const over var.", answer: true },
      { type: 'match', prompt: "Match each keyword to its scoping.", pairs: [
        ["var", "Function-scoped, hoisted"], ["let/const", "Block-scoped"],
      ] },
      { type: 'code', prompt: "Declare let x = 1 inside an if (true) block; outside it, log a separate outer variable (already 5) instead.",
        starter: "let outer = 5;\nif (true) {\n  let x = 1;\n}\n// your code here", expected: "5", mustContain: ['console.log(outer)'] },
    ],
  },
  j12l3: {
    id: 'j12l3', unit: 'j12', title: 'IIFEs & Modules', icon: '🔗', xp: XP.LESSON,
    introLines: [
      "An IIFE (Immediately Invoked Function Expression) runs itself right away: (function(){ ... })()",
      "It's an old trick for creating a private scope, before modules existed.",
      "Modern JavaScript modules (import/export) now do this job more cleanly.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does an IIFE do?", options: [
        "Defines and immediately runs a function, creating a private scope", "Defines a function without ever running it", "Deletes a function", "Imports another file" ], answer: 0 },
      { type: 'mcq', prompt: "What replaced most of the IIFE pattern's use case in modern JavaScript?", options: [
        "ES modules (import/export)", "for loops", "Arrays", "Template literals" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "An IIFE is wrapped in parentheses and called immediately: (function(){...})()", answer: true },
      { type: 'truefalse', prompt: "Modules let you export values from one file and import them in another.", answer: true },
      { type: 'match', prompt: "Match each concept to its role.", pairs: [
        ["IIFE", "Runs immediately, creates private scope"], ["import/export", "Modern module system"],
      ] },
      { type: 'code', prompt: "Write an IIFE that logs <code>ready</code> immediately.", starter: "// your code here", expected: "ready", mustContain: ['(function'] },
    ],
  },
  j12quiz: {
    id: 'j12quiz', unit: 'j12', title: 'Unit 12 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Closures & Scope.", "Closures, hoisting, var vs let/const, IIFEs.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does a closure remember?", options: [ "Variables from the scope where it was created", "Only global variables", "Nothing after the outer function returns", "Only its own parameters" ], answer: 0 },
      { type: 'mcq', prompt: "Which declaration is block-scoped?", options: [ "let", "var", "Both equally", "Neither" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does an IIFE do?", options: [ "Runs a function immediately after defining it", "Delays a function forever", "Deletes a variable", "Imports a module" ], answer: 0 },
      { type: 'truefalse', prompt: "Closures are commonly used to build private counters.", answer: true },
      { type: 'truefalse', hard: true, prompt: "var is scoped to the nearest enclosing function, not block.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Modules have made the IIFE pattern less necessary in modern code.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["Closure", "Remembers its creation scope"], ["var", "Function-scoped"], ["IIFE", "Runs immediately"],
      ] },
      { type: 'code', prompt: "Define makeAdder(x) returning a function that adds x to its argument. Log makeAdder(3)(4).",
        starter: "function makeAdder(x) {\n  // your code here\n}\nconsole.log(makeAdder(3)(4));", expected: "7", mustContain: ['return'] },
    ],
  },

  // UNIT 13 — Iterators, Generators & Async
  j13l1: {
    id: 'j13l1', unit: 'j13', title: 'Iterators & Generators', icon: '⏱️', xp: XP.LESSON,
    introLines: [
      "An iterator produces values one at a time, on demand.",
      "A generator function uses function* and yield to produce a sequence lazily.",
      "Calling a generator doesn't run its code immediately — it returns an iterator.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What keyword marks a generator function?", options: [ "function*", "function!", "gen function", "function#" ], answer: 0 },
      { type: 'mcq', prompt: "What does yield do inside a generator?", options: [
        "Produces a value and pauses until the next value is requested", "Ends the program", "Imports a module", "Deletes a variable" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Calling a generator function returns an iterator without running its body immediately.", answer: true },
      { type: 'truefalse', prompt: "[...generatorCall()] can collect all of a generator's yielded values into an array.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["function* gen(){}", "Defines a generator"], ["yield x", "Produces x, then pauses"],
      ] },
      { type: 'code', prompt: "Define function* countToThree that yields 1, 2, 3. Log [...countToThree()].",
        starter: "function* countToThree() {\n  // your code here\n}\nconsole.log([...countToThree()]);", expected: "[1,2,3]", mustContain: ['yield'] },
    ],
  },
  j13l2: {
    id: 'j13l2', unit: 'j13', title: 'Promises', icon: '⏱️', xp: XP.LESSON,
    introLines: [
      "A Promise represents a value that will be available later — like a receipt for future work.",
      "It settles as either resolved (success) or rejected (failure).",
      ".then() runs when it resolves; .catch() runs when it rejects.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a Promise represent?", options: [
        "A value that will be available later, once some async work finishes", "A value that's always available immediately", "A type of loop", "A syntax error" ], answer: 0 },
      { type: 'mcq', prompt: "What does .then() do on a Promise?", options: [ "Runs a function once the promise resolves", "Runs a function immediately", "Cancels the promise", "Deletes the promise" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A Promise settles as either resolved or rejected, never both.", answer: true },
      { type: 'truefalse', prompt: ".catch() handles a promise's rejection.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Promise", "A value available later"], [".then()", "Runs on success"], [".catch()", "Runs on failure"],
      ] },
      { type: 'code', prompt: "Create a Promise that resolves with 5. Use .then to log the resolved value.",
        starter: "const p = new Promise((resolve) => resolve(5));\n// your code here", expected: "5", mustContain: ['.then('] },
    ],
  },
  j13l3: {
    id: 'j13l3', unit: 'j13', title: 'Async/Await', icon: '⏱️', xp: XP.LESSON,
    introLines: [
      "async/await is a cleaner way to work with promises, without chaining .then().",
      "An async function always returns a promise. await pauses until that promise settles.",
      "You can only use await inside an async function.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does the await keyword do?", options: [
        "Pauses the async function until the awaited promise settles", "Stops the whole program", "Runs a loop", "Creates a new class" ], answer: 0 },
      { type: 'mcq', prompt: "What does an async function always return?", options: [ "A promise", "A number", "undefined, always", "An array" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "await can only be used inside a function marked async.", answer: true },
      { type: 'truefalse', prompt: "async/await is often considered more readable than chaining multiple .then() calls.", answer: true },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["async function", "Always returns a promise"], ["await promise", "Pauses until it settles"],
      ] },
      { type: 'code', prompt: "Define async function main that awaits Promise.resolve(7) and logs it. Call main().",
        starter: "async function main() {\n  // your code here\n}\nmain();", expected: "7", mustContain: ['await'] },
    ],
  },
  j13quiz: {
    id: 'j13quiz', unit: 'j13', title: 'Unit 13 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Iterators, Generators & Async.", "Generators, promises, async/await.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What keyword marks a generator function?", options: [ "function*", "async", "yield*", "gen" ], answer: 0 },
      { type: 'mcq', prompt: "What does a Promise represent?", options: [ "A value available later", "A value always available now", "A loop", "An array" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Where can await be used?", options: [ "Only inside an async function", "Anywhere in a program", "Only inside a generator", "Only at the top of a file" ], answer: 0 },
      { type: 'truefalse', prompt: "yield produces a value and pauses a generator.", answer: true },
      { type: 'truefalse', hard: true, prompt: "An async function always returns a promise.", answer: true },
      { type: 'truefalse', hard: true, prompt: ".then() runs only when a promise rejects.", answer: false },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["function*", "Defines a generator"], ["await", "Pauses for a promise"], [".catch()", "Handles rejection"],
      ] },
      { type: 'code', prompt: "Define async function main awaiting Promise.resolve(9) and logging it. Call main().",
        starter: "async function main() {\n  // your code here\n}\nmain();", expected: "9", mustContain: ['await'] },
    ],
  },

  // UNIT 14 — Working with Data
  j14l1: {
    id: 'j14l1', unit: 'j14', title: 'JSON', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "JSON is a text format for structured data — it looks a lot like JS objects and arrays.",
      "JSON.stringify(obj) turns a JS value into a JSON string.",
      "JSON.parse(text) turns a JSON string back into a JS value.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>JSON.stringify({a: 1})</code> return?", options: [ 'The string {"a":1}', "A JS object", "A file", "an error" ], answer: 0 },
      { type: 'mcq', prompt: "What does JSON.parse() do?", options: [ "Converts a JSON string into a JS value", "Converts a JS value into a JSON string", "Deletes JSON data", "Opens a file" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "JSON objects map closely to JavaScript objects.", answer: true },
      { type: 'truefalse', prompt: "JSON.parse(JSON.stringify(x)) is a common (if imperfect) way to deep-copy simple data.", answer: true },
      { type: 'match', prompt: "Match each function to what it does.", pairs: [
        ["JSON.stringify(obj)", "JS value -> JSON string"], ["JSON.parse(text)", "JSON string -> JS value"],
      ] },
      { type: 'code', prompt: "Convert {a: 1} to a JSON string with stringify and log it.", starter: "// your code here", expected: '{"a":1}', mustContain: ['JSON.stringify'] },
    ],
  },
  j14l2: {
    id: 'j14l2', unit: 'j14', title: 'Regular Expressions', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "A regular expression (regex) is a pattern for matching text.",
      "/\\d+/ matches one or more digits. .match() finds them in a string.",
      "They look cryptic at first, but they're incredibly powerful for pattern matching.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>\"item42\".match(/\\d+/)[0]</code> return?", options: [ '"42"', '"item"', "null", "an error" ], answer: 0 },
      { type: 'mcq', prompt: "What does \\d represent in a regex pattern?", options: [ "Any digit (0-9)", "Any letter", "A literal backslash", "End of string" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A regex literal is written between forward slashes, like /\\d+/.", answer: true },
      { type: 'truefalse', prompt: ".match() returns null if no match is found.", answer: true },
      { type: 'match', prompt: "Match each regex symbol to its meaning.", pairs: [
        ["\\d", "Any digit"], ["+", "One or more of the previous thing"],
      ] },
      { type: 'code', prompt: "Log <code>\"item42\".match(/\\d+/)[0]</code>.", starter: "// your code here", expected: "42", mustContain: ['.match('] },
    ],
  },
  j14l3: {
    id: 'j14l3', unit: 'j14', title: 'The DOM (Just Enough)', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "In a real browser, the DOM is JavaScript's live model of the webpage.",
      "document.querySelector(\"h1\") finds the first matching element on the page.",
      "This lesson's exercise stays sandboxed to plain JavaScript, since there's no live page here.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>document.querySelector(\"h1\")</code> do in a browser?", options: [
        "Finds the first <h1> element on the page", "Creates a new h1 element", "Deletes all h1 elements", "Only works on paragraphs" ], answer: 0 },
      { type: 'mcq', prompt: "What does element.textContent let you do?", options: [ "Read or set the text inside an element", "Delete the element", "Change the page's URL", "Only works on images" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "The DOM is JavaScript's live, in-memory model of a webpage's structure.", answer: true },
      { type: 'truefalse', prompt: "addEventListener lets you run code in response to something like a click.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["querySelector", "Finds a matching element"], ["addEventListener", "Reacts to events like clicks"],
      ] },
      { type: 'code', prompt: "This sandbox has no live page, so just log <code>dom ready</code> to confirm you read the lesson.",
        starter: "// your code here", expected: "dom ready", mustContain: ['console.log'] },
    ],
  },
  j14quiz: {
    id: 'j14quiz', unit: 'j14', title: 'Unit 14 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Working with Data.", "JSON, regex, and the DOM.", "This is the final quiz on the roadmap to JSP." ],
    questions: [
      { type: 'mcq', prompt: "What does JSON.parse() convert?", options: [ "A JSON string into a JS value", "A JS value into a JSON string", "An array into an object", "A regex into a string" ], answer: 0 },
      { type: 'mcq', prompt: "What does document.querySelector do?", options: [ "Finds the first matching element on the page", "Deletes an element", "Creates a promise", "Parses JSON" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does \\d+ match in a regex?", options: [ "One or more digits", "One or more letters", "A single space", "The empty string only" ], answer: 0 },
      { type: 'truefalse', prompt: "JSON.stringify() converts a JS value into a JSON-formatted string.", answer: true },
      { type: 'truefalse', hard: true, prompt: ".match() returns null when a regex pattern isn't found in the string.", answer: true },
      { type: 'truefalse', hard: true, prompt: "addEventListener lets code react to events like clicks.", answer: true },
      { type: 'match', prompt: "Match each tool to its purpose.", pairs: [
        ["JSON", "Structured data as text"], ["Regex", "Pattern matching in text"], ["DOM", "Live model of a webpage"],
      ] },
      { type: 'code', prompt: "Convert [1, 2, 3] to a JSON string with stringify and log it.", starter: "// your code here", expected: "[1,2,3]", mustContain: ['JSON.stringify'] },
    ],
  },
};

const JS_STUB_LESSONS = {};

const JS_UNITS = [
  { id: 'j1', tier: 'jse', title: 'First Contact', icon: '👾', lessons: ['j1l1','j1l2','j1l3','j1quiz'] },
  { id: 'j2', tier: 'jse', title: 'Operators & Expressions', icon: '⚡', lessons: ['j2l1','j2l2','j2l3','j2quiz'] },
  { id: 'j3', tier: 'jse', title: 'Making Decisions', icon: '🔀', lessons: ['j3l1','j3l2','j3l3','j3quiz'] },
  { id: 'j4', tier: 'jse', title: 'Loops', icon: '🔁', lessons: ['j4l1','j4l2','j4l3','j4quiz'] },
  { id: 'j5', tier: 'jse', title: 'Functions', icon: '🧩', lessons: ['j5l1','j5l2','j5l3','j5quiz'] },
  { id: 'j6', tier: 'jse', title: 'Arrays', icon: '📚', lessons: ['j6l1','j6l2','j6l3','j6quiz'] },
  { id: 'j7', tier: 'jse', title: 'Objects & Strings', icon: '🧵', lessons: ['j7l1','j7l2','j7l3','j7quiz'] },
  { id: 'j8', tier: 'jsp', title: 'Errors & Exceptions', icon: '🧯', lessons: ['j8l1','j8l2','j8l3','j8quiz'] },
  { id: 'j9', tier: 'jsp', title: 'Higher-Order Functions', icon: '🧠', lessons: ['j9l1','j9l2','j9l3','j9quiz'] },
  { id: 'j10', tier: 'jsp', title: 'OOP Foundations', icon: '🏗️', lessons: ['j10l1','j10l2','j10l3','j10quiz'] },
  { id: 'j11', tier: 'jsp', title: 'OOP In Depth', icon: '🧬', lessons: ['j11l1','j11l2','j11l3','j11quiz'] },
  { id: 'j12', tier: 'jsp', title: 'Closures & Scope', icon: '🔗', lessons: ['j12l1','j12l2','j12l3','j12quiz'] },
  { id: 'j13', tier: 'jsp', title: 'Iterators, Generators & Async', icon: '⏱️', lessons: ['j13l1','j13l2','j13l3','j13quiz'] },
  { id: 'j14', tier: 'jsp', title: 'Working with Data', icon: '🗂️', lessons: ['j14l1','j14l2','j14l3','j14quiz'] },
];

const JS_PREREQS = {
  j1l1: [], j1l2: ['j1l1'], j1l3: ['j1l2'], j1quiz: ['j1l3'],
  j2l1: ['j1quiz'], j2l2: ['j2l1'], j2l3: ['j2l2'], j2quiz: ['j2l3'],
  j3l1: ['j2quiz'], j3l2: ['j3l1'], j3l3: ['j3l2'], j3quiz: ['j3l3'],
  j4l1: ['j3quiz'], j4l2: ['j4l1'], j4l3: ['j4l2'], j4quiz: ['j4l3'],
  j5l1: ['j4quiz'], j5l2: ['j5l1'], j5l3: ['j5l2'], j5quiz: ['j5l3'],
  j6l1: ['j5quiz'], j6l2: ['j6l1'], j6l3: ['j6l2'], j6quiz: ['j6l3'],
  j7l1: ['j6quiz'], j7l2: ['j7l1'], j7l3: ['j7l2'], j7quiz: ['j7l3'],
  j8l1: ['j7quiz'], j8l2: ['j8l1'], j8l3: ['j8l2'], j8quiz: ['j8l3'],
  j9l1: ['j8quiz'], j9l2: ['j9l1'], j9l3: ['j9l2'], j9quiz: ['j9l3'],
  j10l1: ['j9quiz'], j10l2: ['j10l1'], j10l3: ['j10l2'], j10quiz: ['j10l3'],
  j11l1: ['j10quiz'], j11l2: ['j11l1'], j11l3: ['j11l2'], j11quiz: ['j11l3'],
  j12l1: ['j11quiz'], j12l2: ['j12l1'], j12l3: ['j12l2'], j12quiz: ['j12l3'],
  j13l1: ['j12quiz'], j13l2: ['j13l1'], j13l3: ['j13l2'], j13quiz: ['j13l3'],
  j14l1: ['j13quiz'], j14l2: ['j14l1'], j14l3: ['j14l2'], j14quiz: ['j14l3'],
};

const JS_TREE_LAYOUT = {
  j1l1: { col: 0, row: 0 }, j1l2: { col: 0, row: 1 }, j1l3: { col: 0, row: 2 }, j1quiz: { col: 0, row: 3 },
  j2l1: { col: 0, row: 4 }, j2l2: { col: 0, row: 5 }, j2l3: { col: 0, row: 6 }, j2quiz: { col: 0, row: 7 },
  j3l1: { col: 0, row: 8 }, j3l2: { col: 0, row: 9 }, j3l3: { col: 0, row: 10 }, j3quiz: { col: 0, row: 11 },
  j4l1: { col: 0, row: 12 }, j4l2: { col: 0, row: 13 }, j4l3: { col: 0, row: 14 }, j4quiz: { col: 0, row: 15 },
  j5l1: { col: 0, row: 16 }, j5l2: { col: 0, row: 17 }, j5l3: { col: 0, row: 18 }, j5quiz: { col: 0, row: 19 },
  j6l1: { col: 0, row: 20 }, j6l2: { col: 0, row: 21 }, j6l3: { col: 0, row: 22 }, j6quiz: { col: 0, row: 23 },
  j7l1: { col: 0, row: 24 }, j7l2: { col: 0, row: 25 }, j7l3: { col: 0, row: 26 }, j7quiz: { col: 0, row: 27 },
  cp_jse: { col: 0, row: 28 },
  j8l1: { col: 0, row: 29 }, j8l2: { col: 0, row: 30 }, j8l3: { col: 0, row: 31 }, j8quiz: { col: 0, row: 32 },
  j9l1: { col: 0, row: 33 }, j9l2: { col: 0, row: 34 }, j9l3: { col: 0, row: 35 }, j9quiz: { col: 0, row: 36 },
  j10l1: { col: 0, row: 37 }, j10l2: { col: 0, row: 38 }, j10l3: { col: 0, row: 39 }, j10quiz: { col: 0, row: 40 },
  j11l1: { col: 0, row: 41 }, j11l2: { col: 0, row: 42 }, j11l3: { col: 0, row: 43 }, j11quiz: { col: 0, row: 44 },
  j12l1: { col: 0, row: 45 }, j12l2: { col: 0, row: 46 }, j12l3: { col: 0, row: 47 }, j12quiz: { col: 0, row: 48 },
  j13l1: { col: 0, row: 49 }, j13l2: { col: 0, row: 50 }, j13l3: { col: 0, row: 51 }, j13quiz: { col: 0, row: 52 },
  j14l1: { col: 0, row: 53 }, j14l2: { col: 0, row: 54 }, j14l3: { col: 0, row: 55 }, j14quiz: { col: 0, row: 56 },
  cp_jsp: { col: 0, row: 57 },
};

const JS_TREE_EDGES = [
  ['j1l1','j1l2'], ['j1l2','j1l3'], ['j1l3','j1quiz'],
  ['j1quiz','j2l1'], ['j2l1','j2l2'], ['j2l2','j2l3'], ['j2l3','j2quiz'],
  ['j2quiz','j3l1'], ['j3l1','j3l2'], ['j3l2','j3l3'], ['j3l3','j3quiz'],
  ['j3quiz','j4l1'], ['j4l1','j4l2'], ['j4l2','j4l3'], ['j4l3','j4quiz'],
  ['j4quiz','j5l1'], ['j5l1','j5l2'], ['j5l2','j5l3'], ['j5l3','j5quiz'],
  ['j5quiz','j6l1'], ['j6l1','j6l2'], ['j6l2','j6l3'], ['j6l3','j6quiz'],
  ['j6quiz','j7l1'], ['j7l1','j7l2'], ['j7l2','j7l3'], ['j7l3','j7quiz'],
  ['j7quiz','cp_jse'], ['cp_jse','j8l1'],
  ['j8l1','j8l2'], ['j8l2','j8l3'], ['j8l3','j8quiz'],
  ['j8quiz','j9l1'], ['j9l1','j9l2'], ['j9l2','j9l3'], ['j9l3','j9quiz'],
  ['j9quiz','j10l1'], ['j10l1','j10l2'], ['j10l2','j10l3'], ['j10l3','j10quiz'],
  ['j10quiz','j11l1'], ['j11l1','j11l2'], ['j11l2','j11l3'], ['j11l3','j11quiz'],
  ['j11quiz','j12l1'], ['j12l1','j12l2'], ['j12l2','j12l3'], ['j12l3','j12quiz'],
  ['j12quiz','j13l1'], ['j13l1','j13l2'], ['j13l2','j13l3'], ['j13l3','j13quiz'],
  ['j13quiz','j14l1'], ['j14l1','j14l2'], ['j14l2','j14l3'], ['j14l3','j14quiz'],
  ['j14quiz','cp_jsp'],
];

const JS_UNIT_LABEL_ANCHOR = {
  j1: 'j1l1', j2: 'j2l1', j3: 'j3l1', j4: 'j4l1', j5: 'j5l1', j6: 'j6l1', j7: 'j7l1',
  j8: 'j8l1', j9: 'j9l1', j10: 'j10l1', j11: 'j11l1', j12: 'j12l1', j13: 'j13l1', j14: 'j14l1',
};

registerCurriculum('javascript', {
  LESSONS: JS_LESSONS, STUB_LESSONS: JS_STUB_LESSONS, UNITS: JS_UNITS, PREREQS: JS_PREREQS,
  TREE_LAYOUT: JS_TREE_LAYOUT, TREE_EDGES: JS_TREE_EDGES, UNIT_LABEL_ANCHOR: JS_UNIT_LABEL_ANCHOR,
});

CERT_CHECKPOINTS.javascript = [
  { id: 'cp_jse', afterUnit: 'j7', name: 'JSE', fullName: 'JavaScript Essentials (OpenEDG JS Institute)', icon: '🎓' },
  { id: 'cp_jsp', afterUnit: 'j14', name: 'JSP', fullName: 'JavaScript Programming (OpenEDG JS Institute)', icon: '🏆' },
];

// ===================================================================================
// ===== Java curriculum (OCA -> OCP) =====
// Code exercises compile & run for real via Judge0 (see CODE_RUNTIME in lesson-engine.js).
// Every code question's starter is a full compilable Main.java, since Judge0 needs a
// complete file — students fill in the marked blank rather than writing a bare snippet.
// ===================================================================================
const JAVA_LESSONS = {
  // UNIT 1 — First Contact
  v1l1: {
    id: 'v1l1', unit: 'v1', title: 'What Is Java?', icon: '💾', xp: XP.LESSON,
    introLines: [
      "Java is a language built around one core idea: 'write once, run anywhere.'",
      "Code is just a list of instructions — Java's needs to be organized inside a class.",
      "System.out.println() is how you'll see output — it's Java's version of print().",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>System.out.println()</code> do?", options: [
        "Prints (displays) a value, followed by a new line", "Deletes a variable", "Creates a new class", "Only works with numbers" ], answer: 0 },
      { type: 'mcq', prompt: "Why does Java code live inside a class?", options: [
        "Java requires every program's code to be organized inside a class", "It's optional stylistic preference", "Only for large programs", "Classes are only for OOP, not required otherwise" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Every Java program needs a main method as its starting point.", answer: true },
      { type: 'truefalse', prompt: "System.out.println() adds a new line after what it prints, unlike System.out.print().", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["System.out.println()", "Prints a value, then a new line"], ["public static void main(String[] args)", "The starting point of a Java program"],
      ] },
      { type: 'code', prompt: "Print (println) the text <code>hello</code>.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "hello", mustContain: ['System.out.println'] },
    ],
  },
  v1l2: {
    id: 'v1l2', unit: 'v1', title: 'Variables & Data Types', icon: '📦', xp: XP.LESSON,
    introLines: [
      "Unlike Python or JavaScript, Java wants you to declare a variable's type up front.",
      "int score = 0; creates a whole-number box. double, boolean, and String work the same way.",
      "Once declared, a variable can only ever hold that type.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>int score = 0;</code> do?", options: [
        "Creates a variable named score that can only hold whole numbers", "Creates a variable that can hold any type", "Prints the number 0", "Deletes a variable" ], answer: 0 },
      { type: 'mcq', prompt: "Which type would you use for text in Java?", options: [ "String", "int", "boolean", "double" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "In Java, a variable declared as int cannot later be assigned a String value.", answer: true },
      { type: 'truefalse', prompt: "double is used for numbers with decimal points.", answer: true },
      { type: 'match', prompt: "Match each type to what it holds.", pairs: [
        ["int", "Whole numbers"], ["double", "Decimal numbers"], ["String", "Text"], ["boolean", "true or false"],
      ] },
      { type: 'code', prompt: "Declare an int named score equal to 10, then println it.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "10", mustContain: ['int score'] },
    ],
  },
  v1l3: {
    id: 'v1l3', unit: 'v1', title: 'print/println & Comments', icon: '📝', xp: XP.LESSON,
    introLines: [
      "print() shows output without a new line after; println() adds one.",
      "// starts a single-line comment — the compiler skips right over it.",
      "/* ... */ marks a comment that can span multiple lines.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's the difference between print() and println()?", options: [
        "println() adds a new line after printing; print() doesn't", "print() is faster", "println() only works with numbers", "There is no difference" ], answer: 0 },
      { type: 'mcq', prompt: "Which line is a comment in Java?", options: [
        "// set the score to zero", "int score = 0;", "System.out.println(score);", "score == 0;" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Comments are skipped entirely when Java code compiles and runs.", answer: true },
      { type: 'truefalse', prompt: "/* ... */ comments can span multiple lines.", answer: true },
      { type: 'match', prompt: "Match each syntax to its type.", pairs: [
        ["//", "Single-line comment"], ["/* */", "Multi-line comment"],
      ] },
      { type: 'code', prompt: "Print (println) the text <code>ready</code>, with a // comment above it explaining what it does.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "ready", mustContain: ['//', 'System.out.println'] },
    ],
  },
  v1quiz: {
    id: 'v1quiz', unit: 'v1', title: 'Unit 1 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Time for a compiled quiz.", "It pulls from everything in First Contact.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does System.out.println(\"hi\") do?", options: [ "Prints hi, then a new line", "Deletes hi", "Creates a variable named hi", "Nothing" ], answer: 0 },
      { type: 'mcq', prompt: "Which type holds whole numbers?", options: [ "int", "String", "boolean", "void" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does a variable's declared type control?", options: [ "What kind of value it can hold", "Its name", "Whether it's a comment", "Nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "A variable can be thought of as a labeled, typed box holding a value.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Every Java program needs a main method.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Java lets a variable change its declared type after creation.", answer: false },
      { type: 'match', prompt: "Match each type to what it holds.", pairs: [
        ["int", "Whole numbers"], ["String", "Text"], ["boolean", "true or false"],
      ] },
      { type: 'code', prompt: "Declare an int named total equal to 5, then println it.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "5", mustContain: ['int total'] },
    ],
  },

  // UNIT 2 — Operators & Expressions
  v2l1: {
    id: 'v2l1', unit: 'v2', title: 'Math Operators', icon: '➕', xp: XP.LESSON,
    introLines: [
      "+ adds, - subtracts, * multiplies, / divides — same as most languages.",
      "% gives you the remainder after division: 10 % 3 is 1.",
      "Dividing two int values truncates any decimal part: 7 / 2 is 3, not 3.5.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does % do between two integers in Java?", options: [
        "Gives the remainder after division", "Divides them", "Multiplies them", "Compares them" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>7 / 2</code> evaluate to in Java, using two ints?", options: [ "3 (integer division truncates)", "3.5", "4", "an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Dividing two int values in Java truncates any decimal part.", answer: true },
      { type: 'truefalse', prompt: "10 % 3 evaluates to 1.", answer: true },
      { type: 'match', prompt: "Match each operator to what it does.", pairs: [
        ["+", "Addition"], ["%", "Remainder"], ["/", "Division"],
      ] },
      { type: 'code', prompt: "Declare int total equal to 4 * 3 and println it.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "12", mustContain: ['*'] },
    ],
  },
  v2l2: {
    id: 'v2l2', unit: 'v2', title: 'Comparison Operators', icon: '⚖️', xp: XP.LESSON,
    introLines: [
      "== compares primitive values like numbers directly.",
      "For objects like String, == compares identity, not content — use .equals() to compare text.",
      "!= checks not-equal.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "How should you compare two String values for equal content in Java?", options: [
        ".equals()", "==", "!=", "There's no way to compare strings" ], answer: 0 },
      { type: 'mcq', prompt: "What does == do between two int values?", options: [
        "Compares their numeric values directly", "Always compares memory addresses", "Always returns false", "Converts them to strings" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Using == to compare two String objects can give surprising results because it checks identity, not content.", answer: true },
      { type: 'truefalse', prompt: "5 != 4 evaluates to true.", answer: true },
      { type: 'match', prompt: "Match each operator to what it compares.", pairs: [
        ["==", "Compares primitive values directly"], [".equals()", "Compares object content, like Strings"],
      ] },
      { type: 'code', prompt: "Println the result of 7 == 7.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "true", mustContain: ['=='] },
    ],
  },
  v2l3: {
    id: 'v2l3', unit: 'v2', title: 'Logical Operators', icon: '🔗', xp: XP.LESSON,
    introLines: [
      "&&, ||, and ! combine or flip boolean checks.",
      "&& needs both sides true; || needs at least one.",
      "These only work with boolean values in Java — not 'truthy' values like some languages.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does && require?", options: [
        "Both sides must be true", "Only one side needs to be true", "It flips true to false", "It only works with numbers" ], answer: 0 },
      { type: 'mcq', prompt: "What type must the operands of && and || be in Java?", options: [ "boolean", "int", "String", "Any type" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Unlike some languages, Java's && and || only work with boolean values, not arbitrary 'truthy' values.", answer: true },
      { type: 'truefalse', prompt: "true || false evaluates to true.", answer: true },
      { type: 'match', prompt: "Match each operator to its meaning.", pairs: [
        ["&&", "Both must be true"], ["||", "At least one must be true"], ["!", "Flips true/false"],
      ] },
      { type: 'code', prompt: "Println the result of true && false.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "false", mustContain: ['&&'] },
    ],
  },
  v2quiz: {
    id: 'v2quiz', unit: 'v2', title: 'Unit 2 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Operators & Expressions.", "Math, comparison, and logical operators.", "Let's see what you've got." ],
    questions: [
      { type: 'mcq', prompt: "What does * do between two numbers?", options: [ "Multiplies them", "Compares them", "Joins them", "Divides them" ], answer: 0 },
      { type: 'mcq', prompt: "How do you compare String content in Java?", options: [ ".equals()", "==", "!=", "+" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does 7 / 2 evaluate to using two ints?", options: [ "3", "3.5", "4", "an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "== compares object identity for Strings, not their text content.", answer: true },
      { type: 'truefalse', hard: true, prompt: "&& and || require boolean operands in Java.", answer: true },
      { type: 'truefalse', prompt: "Both && and || are logical operators.", answer: true },
      { type: 'match', prompt: "Match the operator to its category.", pairs: [
        ["+", "Math operator"], ["==", "Comparison operator"], ["&&", "Logical operator"],
      ] },
      { type: 'code', prompt: "Declare int result equal to 10 / 2 and println it.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "5", mustContain: ['/'] },
    ],
  },

  // UNIT 3 — Making Decisions
  v3l1: {
    id: 'v3l1', unit: 'v3', title: 'If Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "An if statement runs a block only when a condition is true.",
      "if (score > 50) { System.out.println(\"pass\"); }",
      "The condition inside () must evaluate to a boolean.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What must the condition inside if() evaluate to?", options: [
        "A boolean (true or false)", "Any type", "A String", "An integer only" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>if (condition)</code> do?", options: [
        "Runs the block only when condition is true", "Runs the block every time", "Deletes a variable", "Repeats forever" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "If the condition is false, the block inside {} is skipped.", answer: true },
      { type: 'truefalse', hard: true, prompt: "In Java, `if (1)` is a compile error, unlike some other languages.", answer: true },
      { type: 'match', prompt: "Match each piece to what it means.", pairs: [
        ["if (x > 0) {...}", "Runs the block only if x is greater than 0"], ["boolean condition", "What if() requires"],
      ] },
      { type: 'code', prompt: "int n = 5; Println <code>positive</code> if n is greater than 0.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        int n = 5;\n        // your code here\n    }\n}",
        expected: "positive", mustContain: ['if', '>'] },
    ],
  },
  v3l2: {
    id: 'v3l2', unit: 'v3', title: 'If / Else / Else If', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "else runs when the if didn't.",
      "else if lets you check another condition.",
      "Only one branch in the chain ever runs.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>else</code> do?", options: [
        "Runs when the if condition was false", "Runs always", "Repeats the block", "Only works with loops" ], answer: 0 },
      { type: 'mcq', prompt: "How do you write 'else if' in Java?", options: [ "else if", "elseif", "elif", "else.if" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Only one branch of an if/else if/else chain runs per pass.", answer: true },
      { type: 'truefalse', prompt: "else is optional — you can have just if.", answer: true },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "Checks the first condition"], ["else if", "Checks another condition"], ["else", "Runs if nothing matched"],
      ] },
      { type: 'code', prompt: "int n = 0; Println <code>zero</code> if n is 0, <code>positive</code> if greater, else <code>negative</code>.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        int n = 0;\n        // your code here\n    }\n}",
        expected: "zero", mustContain: ['if', 'else if', 'else'] },
    ],
  },
  v3l3: {
    id: 'v3l3', unit: 'v3', title: 'Switch Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "A switch statement compares one value against several possible cases.",
      "Each case needs a break, or execution 'falls through' into the next one.",
      "default catches anything that didn't match a case.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does break do inside a switch case?", options: [
        "Stops execution from falling through to the next case", "Ends the whole program", "Starts a loop", "Deletes the switch" ], answer: 0 },
      { type: 'mcq', prompt: "What does the default case in a switch do?", options: [
        "Runs when no other case matched", "Always runs first", "Deletes the switch", "Only works with numbers" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Forgetting break in a switch case causes execution to fall through to the next case.", answer: true },
      { type: 'truefalse', prompt: "A switch statement can often replace a long if/else if chain.", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["case", "One possible matching value"], ["break", "Stops fall-through"], ["default", "Runs if nothing else matched"],
      ] },
      { type: 'code', prompt: "int day = 1; Use switch to println <code>weekday</code> for case 1, <code>weekend</code> otherwise (default).",
        starter: "public class Main {\n    public static void main(String[] args) {\n        int day = 1;\n        // your code here\n    }\n}",
        expected: "weekday", mustContain: ['switch', 'case', 'default'] },
    ],
  },
  v3quiz: {
    id: 'v3quiz', unit: 'v3', title: 'Unit 3 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Making Decisions.", "if/else if/else, and switch.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What happens when an if condition is false?", options: [ "The block is skipped", "The block runs anyway", "The program crashes", "It repeats forever" ], answer: 0 },
      { type: 'mcq', prompt: "Which keyword checks an additional condition after if?", options: [ "else if", "else", "then", "or" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What happens if you forget break in a switch case?", options: [ "Execution falls through to the next case", "The switch stops entirely", "A compile error occurs", "Nothing happens" ], answer: 0 },
      { type: 'truefalse', prompt: "else runs only if no earlier condition matched.", answer: true },
      { type: 'truefalse', hard: true, prompt: "The condition inside if() must be a boolean expression in Java.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A switch statement's default case is required.", answer: false },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "First condition checked"], ["else", "Runs when nothing matched"], ["switch", "Compares one value against cases"],
      ] },
      { type: 'code', prompt: "int n = -3; Println <code>negative</code> if n is less than 0, else <code>non-negative</code>.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        int n = -3;\n        // your code here\n    }\n}",
        expected: "negative", mustContain: ['if', 'else'] },
    ],
  },

  // UNIT 4 — Loops
  v4l1: {
    id: 'v4l1', unit: 'v4', title: 'While Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "while repeats its block as long as a condition stays true.",
      "while (count < 3) { ... } — same idea as other languages, just with typed variables.",
      "Forget to update the condition, and you get an infinite loop.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a while loop do?", options: [
        "Repeats its block as long as the condition is true", "Runs its block exactly once", "Runs a fixed number of times only", "Never runs" ], answer: 0 },
      { type: 'mcq', prompt: "What commonly causes an infinite loop?", options: [
        "Never updating the condition so it stays true forever", "Using System.out.println inside it", "Declaring an int inside it", "Using else" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A while loop can run zero times if its condition starts out false.", answer: true },
      { type: 'truefalse', prompt: "You must update the condition variable inside a while loop, or it may never stop.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["while (x < 5) {...}", "Repeats while x is less than 5"], ["Infinite loop", "A loop whose condition never becomes false"],
      ] },
      { type: 'code', prompt: "Println 0, 1, 2 each on its own line using a while loop.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        int n = 0;\n        // your code here\n    }\n}",
        expected: "0\n1\n2", mustContain: ['while'] },
    ],
  },
  v4l2: {
    id: 'v4l2', unit: 'v4', title: 'For Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "for (int i = 0; i < 3; i++) { ... } packs setup, condition, and update into one line.",
      "i++ is shorthand for i = i + 1.",
      "This is the most common loop style for counting in Java.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>for (int i = 0; i < 3; i++)</code> do?", options: [
        "Loops with i = 0, 1, then 2", "Loops exactly once", "Loops 4 times", "Creates a variable named for" ], answer: 0 },
      { type: 'mcq', prompt: "What does i++ mean?", options: [ "Increase i by 1", "Decrease i by 1", "Double i", "Compare i to 1" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "for (int i = 2; i < 5; i++) loops with i = 2, 3, 4 — not 5.", answer: true },
      { type: 'truefalse', prompt: "A for loop's three parts are: initialization, condition, and update.", answer: true },
      { type: 'match', prompt: "Match each part to its role.", pairs: [
        ["int i = 0", "Initialization"], ["i < 3", "Condition"], ["i++", "Update"],
      ] },
      { type: 'code', prompt: "Use a for loop to println 1, 2, 3.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "1\n2\n3", mustContain: ['for'] },
    ],
  },
  v4l3: {
    id: 'v4l3', unit: 'v4', title: 'Loop Control', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "break exits a loop immediately. continue skips to the next pass.",
      "Both work the same way in while and for loops.",
      "Use them to handle special cases without deeply nesting more ifs.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does break do inside a loop?", options: [
        "Stops the loop immediately", "Skips to the next iteration", "Restarts the loop", "Pauses forever" ], answer: 0 },
      { type: 'mcq', prompt: "What does continue do?", options: [ "Skips the rest of the current iteration", "Ends the loop", "Deletes the loop variable", "Runs the block twice" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "break and continue both work inside for and while loops.", answer: true },
      { type: 'truefalse', prompt: "continue jumps straight to the next iteration's condition check.", answer: true },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exit the loop right now"], ["continue", "Skip to next iteration"],
      ] },
      { type: 'code', prompt: "Loop i from 0 to 4 with a for loop; println i but skip 2 using continue.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        for (int i = 0; i < 5; i++) {\n            // your code here\n            System.out.println(i);\n        }\n    }\n}",
        expected: "0\n1\n3\n4", mustContain: ['continue'] },
    ],
  },
  v4quiz: {
    id: 'v4quiz', unit: 'v4', title: 'Unit 4 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Loops.", "while, for, and loop control.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which loop keeps running as long as a condition is true?", options: [ "while", "for", "switch", "void" ], answer: 0 },
      { type: 'mcq', prompt: "What does for (int i = 0; i < 3; i++) loop through?", options: [ "0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "3, only" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does break do inside a loop?", options: [ "Exits the loop immediately", "Skips one iteration", "Restarts the loop", "Does nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "continue skips the rest of the current iteration only.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A while loop's condition is checked before each pass, including the first.", answer: true },
      { type: 'truefalse', hard: true, prompt: "for (int i = 1; i < 4; i++) includes i = 4.", answer: false },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exits the loop"], ["continue", "Skips to next iteration"], ["for", "Counts through a range"],
      ] },
      { type: 'code', prompt: "Use a for loop to println 5, 4, 3, 2, 1 (decrementing).",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "5\n4\n3\n2\n1", mustContain: ['for'] },
    ],
  },

  // UNIT 5 — Arrays
  v5l1: {
    id: 'v5l1', unit: 'v5', title: 'Array Basics', icon: '📚', xp: XP.LESSON,
    introLines: [
      "An array is a fixed-size, ordered list of values of the same type.",
      "int[] nums = {1, 2, 3}; access items by position: nums[0] is 1.",
      "nums.length tells you how many items it holds — notice, no parentheses, it's a field, not a method.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "How do you get the number of items in a Java array?", options: [
        "arr.length (a field, no parentheses)", "arr.length()", "len(arr)", "arr.size()" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>nums[0]</code> get you in <code>int[] nums = {10, 20, 30};</code>?", options: [ "10", "20", "30", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Array indexing starts at 0, not 1.", answer: true },
      { type: 'truefalse', prompt: "A Java array's size is fixed once it's created.", answer: true },
      { type: 'match', prompt: "Match each expression to what it does.", pairs: [
        ["nums[1]", "The second item"], ["nums.length", "How many items (a field, not a method)"],
      ] },
      { type: 'code', prompt: "int[] nums = {1,2,3}; Println nums.length.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3};\n        // your code here\n    }\n}",
        expected: "3", mustContain: ['.length'] },
    ],
  },
  v5l2: {
    id: 'v5l2', unit: 'v5', title: 'Multi-dimensional Arrays', icon: '📚', xp: XP.LESSON,
    introLines: [
      "An array of arrays models a grid: int[][] grid = {{1, 2}, {3, 4}};",
      "grid[0][1] gets row 0, column 1.",
      "Useful for anything with rows and columns, like a board game.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>grid[0][1]</code> access in <code>int[][] grid = {{1,2},{3,4}};</code>?", options: [ "2 (row 0, column 1)", "1", "3", "4" ], answer: 0 },
      { type: 'mcq', prompt: "What does int[][] represent?", options: [ "A 2D array (an array of arrays)", "A single number", "A String", "A boolean" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Each row in a 2D array is itself a 1D array.", answer: true },
      { type: 'truefalse', prompt: "int[][] grid = {{1,2},{3,4}}; creates a 2-row, 2-column grid.", answer: true },
      { type: 'match', prompt: "Match each expression to what it gets.", pairs: [
        ["grid[0]", "The first row"], ["grid[0][1]", "Row 0, column 1"],
      ] },
      { type: 'code', prompt: "int[][] grid = {{1,2},{3,4}}; Println grid[1][0].",
        starter: "public class Main {\n    public static void main(String[] args) {\n        int[][] grid = {{1, 2}, {3, 4}};\n        // your code here\n    }\n}",
        expected: "3", mustContain: ['grid[1][0]'] },
    ],
  },
  v5l3: {
    id: 'v5l3', unit: 'v5', title: 'Array Utility Methods', icon: '📚', xp: XP.LESSON,
    introLines: [
      "System.out.println(arr) directly on an array prints a confusing memory reference, not its contents.",
      "Arrays.toString(arr) is what you actually want for readable output.",
      "Arrays.sort(arr) sorts an array in place.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>System.out.println(arr)</code> print for an int[] array?", options: [
        "A confusing memory-reference string, not the contents", "The array's contents nicely formatted", "A compile error", "Nothing" ], answer: 0 },
      { type: 'mcq', prompt: "What does Arrays.toString(arr) give you?", options: [
        "A readable String showing the array's contents", "The array's length", "A sorted copy", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You need `import java.util.Arrays;` to use Arrays.toString() and Arrays.sort().", answer: true },
      { type: 'truefalse', prompt: "Arrays.sort(arr) sorts the array in place.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["Arrays.toString(arr)", "Readable String of contents"], ["Arrays.sort(arr)", "Sorts in place"],
      ] },
      { type: 'code', prompt: "int[] nums = {3,1,2}; Sort it with Arrays.sort and println Arrays.toString(nums).",
        starter: "import java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] nums = {3, 1, 2};\n        // your code here\n    }\n}",
        expected: "[1, 2, 3]", mustContain: ['Arrays.sort', 'Arrays.toString'] },
    ],
  },
  v5quiz: {
    id: 'v5quiz', unit: 'v5', title: 'Unit 5 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Arrays.", "Basics, multi-dimensional arrays, and utility methods.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What syntax creates an array?", options: [ "Curly braces after a typed declaration, like int[] a = {1,2,3};", "Square brackets alone, like [1,2,3]", "Parentheses, like (1,2,3)", "Angle brackets" ], answer: 0 },
      { type: 'mcq', prompt: "How do you get an array's length?", options: [ "arr.length", "arr.length()", "len(arr)", "arr.size()" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does Arrays.toString() do that plain println(arr) doesn't?", options: [ "Shows the array's actual contents readably", "Sorts the array", "Deletes the array", "Nothing different" ], answer: 0 },
      { type: 'truefalse', prompt: "Array indexing starts at 0.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A Java array's size can grow after it's created.", answer: false },
      { type: 'truefalse', hard: true, prompt: "int[][] represents a two-dimensional array.", answer: true },
      { type: 'match', prompt: "Match each method to its purpose.", pairs: [
        ["Arrays.sort", "Sorts in place"], ["Arrays.toString", "Readable contents"], [".length", "Number of items"],
      ] },
      { type: 'code', prompt: "int[] nums = {3,1,2}; Sort with Arrays.sort and println Arrays.toString(nums).",
        starter: "import java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] nums = {3, 1, 2};\n        // your code here\n    }\n}",
        expected: "[1, 2, 3]", mustContain: ['Arrays.sort'] },
    ],
  },

  // UNIT 6 — Methods
  v6l1: {
    id: 'v6l1', unit: 'v6', title: 'Defining Methods', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A method is a named, reusable block of instructions, defined inside a class.",
      "static void greet() { ... } defines one. Calling greet(); later runs everything inside.",
      "static means it belongs to the class itself, not a specific object — more on that soon.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>static void greet() {}</code> define?", options: [
        "A method named greet that returns nothing", "A variable", "A class", "An array" ], answer: 0 },
      { type: 'mcq', prompt: "How do you run a method named greet from inside main?", options: [ "greet();", "void greet", "run greet", "greet" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Defining a method does not run its code immediately.", answer: true },
      { type: 'truefalse', prompt: "void means a method doesn't return a value.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["static void sayHi() {}", "Defines a method named sayHi"], ["sayHi();", "Calls (runs) the method"],
      ] },
      { type: 'code', prompt: "Define static void greet() that println's <code>hi</code>, then call it once from main.",
        starter: "public class Main {\n    // your code here\n\n    public static void main(String[] args) {\n        greet();\n    }\n}",
        expected: "hi", mustContain: ['static void greet'] },
    ],
  },
  v6l2: {
    id: 'v6l2', unit: 'v6', title: 'Parameters & Overloading', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A parameter is a typed placeholder a method expects: static void greet(String name)",
      "Overloading means multiple methods can share a name, as long as their parameters differ.",
      "Java picks the right one based on the arguments you pass.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "In <code>static void greet(String name) {}</code>, what is <code>name</code>?", options: [
        "A typed parameter — a placeholder for a String value", "A loop variable", "A keyword", "The return value" ], answer: 0 },
      { type: 'mcq', prompt: "What is method overloading?", options: [
        "Defining multiple methods with the same name but different parameters", "Calling a method twice", "Renaming a method", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Overloaded methods must differ in their parameter types or count, not just their return type.", answer: true },
      { type: 'truefalse', prompt: "Java picks which overloaded method to call based on the arguments you pass.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "Typed placeholder in the definition"], ["Overloading", "Same name, different parameters"],
      ] },
      { type: 'code', prompt: "Define static int add(int a, int b) returning a + b, then println add(2, 3) from main.",
        starter: "public class Main {\n    // your code here\n\n    public static void main(String[] args) {\n        System.out.println(add(2, 3));\n    }\n}",
        expected: "5", mustContain: ['static int add', 'return'] },
    ],
  },
  v6l3: {
    id: 'v6l3', unit: 'v6', title: 'Return Values & Scope', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "return sends a value back out of a method, instead of just printing it.",
      "A void method returns nothing at all — no value to use afterward.",
      "A variable declared inside a method only exists inside it — that's scope.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does return do?", options: [
        "Sends a value back to wherever the method was called", "Prints a value to the screen", "Stops the whole program", "Deletes the method" ], answer: 0 },
      { type: 'mcq', prompt: "What return type would you use for a method that returns nothing?", options: [ "void", "int", "null", "empty" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A variable declared inside a method isn't accessible outside it.", answer: true },
      { type: 'truefalse', prompt: "A method's return type must match what it actually returns.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["return x;", "Sends x back out of the method"], ["void", "A method that returns nothing"],
      ] },
      { type: 'code', prompt: "Define static int square(int n) returning n * n. Println square(4) from main.",
        starter: "public class Main {\n    // your code here\n\n    public static void main(String[] args) {\n        System.out.println(square(4));\n    }\n}",
        expected: "16", mustContain: ['static int square', 'return'] },
    ],
  },
  v6quiz: {
    id: 'v6quiz', unit: 'v6', title: 'Unit 6 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Methods.", "Defining, parameters, overloading, and return values.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What return type means a method returns nothing?", options: [ "void", "int", "null", "none" ], answer: 0 },
      { type: 'mcq', prompt: "What does a parameter represent?", options: [ "A typed placeholder for a value the method expects", "The method's name", "A compile error", "A loop counter" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What must differ between two overloaded methods?", options: [ "Their parameter types or count", "Only their return type", "Their access modifier", "Nothing — the name is enough" ], answer: 0 },
      { type: 'truefalse', prompt: "Calling a method runs the code inside it.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Variables declared inside a method are local to it.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A method can take zero parameters.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "Placeholder in the definition"], ["Argument", "Actual value passed in"], ["return", "Sends a value back"],
      ] },
      { type: 'code', prompt: "Define static int doubleIt(int n) returning n * 2. Println doubleIt(6) from main.",
        starter: "public class Main {\n    // your code here\n\n    public static void main(String[] args) {\n        System.out.println(doubleIt(6));\n    }\n}",
        expected: "12", mustContain: ['static int doubleIt', 'return'] },
    ],
  },

  // UNIT 7 — OOP Foundations
  v7l1: {
    id: 'v7l1', unit: 'v7', title: 'Classes & Objects', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "A class is a blueprint; an object is something built from it.",
      "class Dog { } then Dog fido = new Dog(); creates an actual Dog object.",
      "Every object made from the same class shares its structure, but can hold different data.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a class?", options: [ "A blueprint for creating objects", "A single object", "A type of loop", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>Dog fido = new Dog();</code> do?", options: [ "Creates a new Dog object named fido", "Defines the Dog class", "Deletes the Dog class", "Prints the word Dog" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Multiple objects can be created from the same class.", answer: true },
      { type: 'truefalse', prompt: "The new keyword is required to create an object from a class.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["class Dog {}", "Defines the blueprint"], ["new Dog()", "Creates an object from the blueprint"],
      ] },
      { type: 'code', prompt: "Define an empty class Dog (outside Main). In main, create Dog fido = new Dog(); and println(fido.getClass().getSimpleName()).",
        starter: "// your code here\n\npublic class Main {\n    public static void main(String[] args) {\n        Dog fido = new Dog();\n        System.out.println(fido.getClass().getSimpleName());\n    }\n}",
        expected: "Dog", mustContain: ['class Dog'] },
    ],
  },
  v7l2: {
    id: 'v7l2', unit: 'v7', title: 'Constructors', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "A constructor runs automatically when you create an object, setting up its starting data.",
      "class Dog { String name; Dog(String name) { this.name = name; } }",
      "this refers to the specific object being constructed.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "When does a constructor run?", options: [
        "Automatically, every time a new object is created with new", "Only when called by name", "Never automatically", "Once per program" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>this</code> refer to inside a constructor?", options: [ "The specific object being created", "A global variable", "The class's name", "Nothing — it's optional" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A constructor's name must match its class's name exactly.", answer: true },
      { type: 'truefalse', prompt: "this.name = name; stores the parameter's value onto the specific object being built.", answer: true },
      { type: 'match', prompt: "Match each snippet to its role.", pairs: [
        ["Dog(String name) {...}", "The constructor"], ["this.name", "The field on the current object"],
      ] },
      { type: 'code', prompt: "Define class Dog with a constructor Dog(String name) storing this.name. In main, create Dog fido = new Dog(\"Fido\"); and println fido.name.",
        starter: "class Dog {\n    // your code here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Dog fido = new Dog(\"Fido\");\n        System.out.println(fido.name);\n    }\n}",
        expected: "Fido", mustContain: ['Dog(String name)', 'this.name'] },
    ],
  },
  v7l3: {
    id: 'v7l3', unit: 'v7', title: 'Instance vs Static Members', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "An instance variable belongs to one object; a static variable is shared by the whole class.",
      "static String species = \"Canine\"; is shared — every reference sees the same value.",
      "Static members are accessed through the class name, not an object.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's true about a static field?", options: [
        "It's shared across all instances of the class", "Each object gets its own separate copy automatically", "It can only be a number", "It must be named this" ], answer: 0 },
      { type: 'mcq', prompt: "How do you access a static field named species on class Dog?", options: [ "Dog.species", "new Dog().species only", "species()", "Dog->species" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Changing an instance field on one object doesn't affect other objects of the same class.", answer: true },
      { type: 'truefalse', prompt: "A static field is declared with the static keyword directly in the class body.", answer: true },
      { type: 'match', prompt: "Match each snippet to its category.", pairs: [
        ["this.name = name;", "Instance field — belongs to one object"], ["static String species", "Static field — shared by all objects"],
      ] },
      { type: 'code', prompt: "Define class Dog with static String species = \"Canine\"; In main, println Dog.species.",
        starter: "class Dog {\n    // your code here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Dog.species);\n    }\n}",
        expected: "Canine", mustContain: ['static String species'] },
    ],
  },
  v7quiz: {
    id: 'v7quiz', unit: 'v7', title: 'Unit 7 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — OOP Foundations.", "Classes, constructors, instance vs static.", "This one wraps up OCA-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does a class define?", options: [ "A blueprint for creating objects", "A single fixed value", "A type of loop", "A file format" ], answer: 0 },
      { type: 'mcq', prompt: "When does a constructor run?", options: [ "Automatically on object creation", "Only when called by name", "Never automatically", "Once per program, ever" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "How is a static field accessed?", options: [ "Through the class name, like Dog.species", "Only through an instance", "It can't be accessed", "Through this only" ], answer: 0 },
      { type: 'truefalse', prompt: "this refers to the specific object a constructor is building.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A constructor's name must exactly match its class's name.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Multiple distinct objects can be created from the same class definition.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Class", "Blueprint"], ["Object", "An instance built from a class"], ["Constructor", "Runs on object creation"],
      ] },
      { type: 'code', prompt: "Define class Cat with a constructor Cat(String name) storing this.name. Create c = new Cat(\"Milo\") and println c.name.",
        starter: "class Cat {\n    // your code here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Cat c = new Cat(\"Milo\");\n        System.out.println(c.name);\n    }\n}",
        expected: "Milo", mustContain: ['Cat(String name)'] },
    ],
  },

  // UNIT 8 — Inheritance & Polymorphism
  v8l1: {
    id: 'v8l1', unit: 'v8', title: 'extends & super', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "A class can inherit from another using extends.",
      "class Puppy extends Dog {} gets everything Dog has, plus anything new.",
      "super(...) calls the parent class's constructor.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>class Puppy extends Dog {}</code> mean?", options: [ "Puppy inherits from Dog", "Puppy replaces Dog", "Dog inherits from Puppy", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What does super(...) do inside a subclass's constructor?", options: [ "Calls the parent class's constructor", "Deletes the parent class", "Creates a new class", "Skips the constructor" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A subclass automatically has access to its parent class's public and protected methods.", answer: true },
      { type: 'truefalse', prompt: "If used, super(...) must be the first statement in a subclass's constructor.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["extends", "Inherits from a parent class"], ["super()", "Calls the parent constructor"],
      ] },
      { type: 'code', prompt: "Define class Animal with a String name field and constructor storing it. Define class Dog extends Animal, calling super(name) in its own constructor. Create new Dog(\"Fido\") and println its name.",
        starter: "class Animal {\n    String name;\n    Animal(String name) {\n        this.name = name;\n    }\n}\n\n// your code here\n\npublic class Main {\n    public static void main(String[] args) {\n        Dog d = new Dog(\"Fido\");\n        System.out.println(d.name);\n    }\n}",
        expected: "Fido", mustContain: ['extends Animal', 'super(name)'] },
    ],
  },
  v8l2: {
    id: 'v8l2', unit: 'v8', title: 'Method Overriding & @Override', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "A subclass can override a parent's method to provide its own behavior.",
      "@Override isn't required, but it helps the compiler catch typos in the method signature.",
      "When you call the method on the object, Java runs the subclass's version.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does @Override help with?", options: [
        "Letting the compiler catch mistakes in an overriding method's signature", "Making a method run faster", "Making a method private", "Required for all methods" ], answer: 0 },
      { type: 'mcq', prompt: "When you call an overridden method on a subclass object, which version runs?", options: [ "The subclass's version", "The parent's version, always", "Both versions", "Neither" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "An overriding method must have the same name and parameter types as the method it overrides.", answer: true },
      { type: 'truefalse', prompt: "@Override is optional but considered good practice.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Overriding", "Subclass provides its own version of a method"], ["@Override", "Signals intent, lets compiler check it"],
      ] },
      { type: 'code', prompt: "Define class Animal with speak() printing \"...\". Define Dog extends Animal, @Override speak() printing <code>Woof</code>. Call new Dog().speak().",
        starter: "class Animal {\n    void speak() {\n        System.out.println(\"...\");\n    }\n}\n\n// your code here\n\npublic class Main {\n    public static void main(String[] args) {\n        new Dog().speak();\n    }\n}",
        expected: "Woof", mustContain: ['@Override'] },
    ],
  },
  v8l3: {
    id: 'v8l3', unit: 'v8', title: 'Abstract Classes & Interfaces', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "An abstract class can't be instantiated directly — it's meant to be extended.",
      "abstract void method(); declares a method with no body — subclasses must implement it.",
      "An interface is a pure contract — implementing classes agree to provide certain methods.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Can you create an object directly from an abstract class?", options: [
        "No — abstract classes can't be instantiated directly", "Yes, always", "Only with new()", "Only if it has no methods" ], answer: 0 },
      { type: 'mcq', prompt: "What must a concrete subclass of an abstract class do?", options: [
        "Implement all of its abstract methods", "Nothing special", "Redeclare it as abstract too", "Delete the abstract methods" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "An abstract method has no body — just a signature ending in a semicolon.", answer: true },
      { type: 'truefalse', prompt: "An interface defines a contract of methods that implementing classes must provide.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["abstract class", "Can't be instantiated, meant to be extended"], ["interface", "A pure contract of required methods"],
      ] },
      { type: 'code', prompt: "Define abstract class Shape with abstract double area(). Define class Square extends Shape with area() returning 4.0. Println new Square().area().",
        starter: "abstract class Shape {\n    // your code here\n}\n\n// define Square here\n\npublic class Main {\n    public static void main(String[] args) {\n        Shape s = new Square();\n        System.out.println(s.area());\n    }\n}",
        expected: "4.0", mustContain: ['abstract'] },
    ],
  },
  v8quiz: {
    id: 'v8quiz', unit: 'v8', title: 'Unit 8 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Inheritance & Polymorphism.", "extends, overriding, abstract classes, interfaces.", "This unit kicks off OCP-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does extends do?", options: [ "Makes a class inherit from a parent", "Deletes a class", "Creates an interface", "Overloads a method" ], answer: 0 },
      { type: 'mcq', prompt: "What does @Override signal?", options: [ "This method overrides one from the parent/interface", "This method is private", "This method is static", "This is required for every method" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Can an abstract class have regular (non-abstract) methods too?", options: [ "Yes", "No, only abstract methods", "Only static methods", "Only private methods" ], answer: 0 },
      { type: 'truefalse', prompt: "A subclass can override a method it inherited from its parent.", answer: true },
      { type: 'truefalse', hard: true, prompt: "An abstract class can be instantiated directly with new.", answer: false },
      { type: 'truefalse', hard: true, prompt: "An interface is a contract that implementing classes must fulfill.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["extends", "Inherits from a parent"], ["@Override", "Marks an overriding method"], ["abstract", "Can't be instantiated directly"],
      ] },
      { type: 'code', prompt: "Define class Animal with speak() printing \"...\". Define Cat extends Animal @Override speak() printing <code>Meow</code>. Call new Cat().speak().",
        starter: "class Animal {\n    void speak() {\n        System.out.println(\"...\");\n    }\n}\n\n// your code here\n\npublic class Main {\n    public static void main(String[] args) {\n        new Cat().speak();\n    }\n}",
        expected: "Meow", mustContain: ['@Override'] },
    ],
  },

  // UNIT 9 — Encapsulation & Object Class
  v9l1: {
    id: 'v9l1', unit: 'v9', title: 'Access Modifiers', icon: '🛡️', xp: XP.LESSON,
    introLines: [
      "private hides a member from outside the class entirely.",
      "public makes it accessible from anywhere. protected allows subclasses and the same package.",
      "Encapsulation usually means private fields with public getter/setter methods.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a private field mean?", options: [
        "It's only accessible from within its own class", "It's accessible from anywhere", "It's shared by all instances", "It can't be changed ever" ], answer: 0 },
      { type: 'mcq', prompt: "What's a common pattern for protecting a field while still allowing controlled access?", options: [
        "A private field with a public getter method", "A public field with no methods", "A static field only", "There's no way to do this" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "protected allows access from subclasses and code in the same package.", answer: true },
      { type: 'truefalse', prompt: "public members are accessible from any other class.", answer: true },
      { type: 'match', prompt: "Match each modifier to its access level.", pairs: [
        ["private", "Only within its own class"], ["public", "Accessible from anywhere"],
      ] },
      { type: 'code', prompt: "Define class Account with private int balance = 100; and public int getBalance() returning it. Println new Account().getBalance().",
        starter: "class Account {\n    // your code here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new Account().getBalance());\n    }\n}",
        expected: "100", mustContain: ['private int balance', 'getBalance'] },
    ],
  },
  v9l2: {
    id: 'v9l2', unit: 'v9', title: 'equals, hashCode & toString', icon: '🛡️', xp: XP.LESSON,
    introLines: [
      "toString() controls what an object looks like when printed.",
      "equals() defines what 'equal' means for your objects — by default it just compares identity.",
      "Overriding toString() is one of the most common customizations you'll make.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does overriding toString() control?", options: [
        "What System.out.println(obj) shows", "How many objects can be created", "Whether the class can be inherited", "The class's name" ], answer: 0 },
      { type: 'mcq', prompt: "By default (without overriding), what does equals() compare?", options: [
        "Object identity — whether it's literally the same object", "The objects' field values", "Nothing — it always returns false", "The class name only" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Every class inherits toString(), equals(), and hashCode() from Object, even if it doesn't define its own.", answer: true },
      { type: 'truefalse', prompt: "Overriding equals() is commonly paired with overriding hashCode() too.", answer: true },
      { type: 'match', prompt: "Match each method to its default job.", pairs: [
        ["toString()", "Controls printed representation"], ["equals()", "Defines what counts as 'equal'"],
      ] },
      { type: 'code', prompt: "Define class Point with @Override toString() returning <code>Point</code>. Println new Point().",
        starter: "class Point {\n    // your code here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new Point());\n    }\n}",
        expected: "Point", mustContain: ['toString'] },
    ],
  },
  v9l3: {
    id: 'v9l3', unit: 'v9', title: 'Immutability Basics', icon: '🛡️', xp: XP.LESSON,
    introLines: [
      "final on a variable means it can only be assigned once.",
      "An immutable object's state can't change after construction — safer to reason about.",
      "final fields are typically set once, in the constructor.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does the final keyword do on a variable?", options: [
        "It can only be assigned a value once", "It must be a number", "It's automatically private", "It makes the variable static" ], answer: 0 },
      { type: 'mcq', prompt: "What does 'immutable' mean for an object?", options: [
        "Its state can't change after construction", "It has no methods", "It can't be printed", "It's always static" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A final field is typically assigned once, often in the constructor.", answer: true },
      { type: 'truefalse', prompt: "String objects in Java are immutable.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["final", "Assignable only once"], ["Immutable object", "State can't change after creation"],
      ] },
      { type: 'code', prompt: "Define class Point with a public final int x, set in the constructor. Create new Point(5) and println p.x.",
        starter: "class Point {\n    // your code here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Point p = new Point(5);\n        System.out.println(p.x);\n    }\n}",
        expected: "5", mustContain: ['final int x'] },
    ],
  },
  v9quiz: {
    id: 'v9quiz', unit: 'v9', title: 'Unit 9 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Encapsulation & Object Class.", "Access modifiers, toString/equals, immutability.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which modifier restricts a member to its own class only?", options: [ "private", "public", "protected", "static" ], answer: 0 },
      { type: 'mcq', prompt: "What does overriding toString() change?", options: [ "What print shows for the object", "The object's type", "Whether it can be inherited", "Its memory address" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does final on a field typically pair with?", options: [ "Setting it once in the constructor", "Making it static automatically", "Making it private automatically", "Nothing in particular" ], answer: 0 },
      { type: 'truefalse', prompt: "Every class inherits toString() from Object by default.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A final variable can be reassigned after its first value is set.", answer: false },
      { type: 'truefalse', hard: true, prompt: "Encapsulation commonly pairs private fields with public getters/setters.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["private", "Only within its own class"], ["final", "Assignable once"], ["toString", "Controls printed form"],
      ] },
      { type: 'code', prompt: "Define class Box with private int size = 7; and public int getSize() returning it. Println new Box().getSize().",
        starter: "class Box {\n    // your code here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(new Box().getSize());\n    }\n}",
        expected: "7", mustContain: ['private int size'] },
    ],
  },

  // UNIT 10 — Exception Handling
  v10l1: {
    id: 'v10l1', unit: 'v10', title: 'try/catch/finally', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "Sometimes code fails at runtime — that's called an exception.",
      "try { risky(); } catch (Exception e) { handle(e); } lets your program recover instead of crashing.",
      "finally runs no matter what — success or failure.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a try/catch block do?", options: [
        "Lets you handle an error instead of crashing the program", "Prevents all errors from happening", "Deletes the error", "Only works with println" ], answer: 0 },
      { type: 'mcq', prompt: "When does the finally block run?", options: [
        "Always, whether or not an exception occurred", "Only if there was an exception", "Only if there wasn't one", "Never automatically" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "The catch block's parameter receives the exception object that was thrown.", answer: true },
      { type: 'truefalse', prompt: "If no exception occurs, the catch block is skipped entirely.", answer: true },
      { type: 'match', prompt: "Match each block to its role.", pairs: [
        ["try", "The code that might fail"], ["catch", "Runs if an exception happened"], ["finally", "Always runs, exception or not"],
      ] },
      { type: 'code', prompt: "Wrap <code>1 / 0</code> in try/catch(ArithmeticException e) that println's <code>caught</code>.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        try {\n            int x = 1 / 0;\n        // your code here\n    }\n}",
        expected: "caught", mustContain: ['catch'] },
    ],
  },
  v10l2: {
    id: 'v10l2', unit: 'v10', title: 'Checked vs Unchecked Exceptions', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "Checked exceptions (like IOException) must be declared or caught — the compiler enforces it.",
      "Unchecked exceptions (like ArithmeticException) extend RuntimeException and aren't enforced.",
      "This checked/unchecked split is a distinctly Java concept.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What makes an exception 'checked' in Java?", options: [
        "The compiler requires it to be declared or caught", "It's checked by a human before release", "It only happens during testing", "It can never be caught" ], answer: 0 },
      { type: 'mcq', prompt: "What do unchecked exceptions extend?", options: [ "RuntimeException", "Error", "Object directly", "They extend nothing" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "ArithmeticException is an unchecked exception.", answer: true },
      { type: 'truefalse', prompt: "The compiler enforces handling of checked exceptions but not unchecked ones.", answer: true },
      { type: 'match', prompt: "Match each type to its category.", pairs: [
        ["IOException", "Checked exception"], ["ArithmeticException", "Unchecked exception"],
      ] },
      { type: 'code', prompt: "Wrap <code>1 / 0</code> in try/catch(ArithmeticException e) that println's <code>caught</code>.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        try {\n            int x = 1 / 0;\n        // your code here\n    }\n}",
        expected: "caught", mustContain: ['ArithmeticException'] },
    ],
  },
  v10l3: {
    id: 'v10l3', unit: 'v10', title: 'Custom Exceptions', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "You can define your own exception type by extending Exception (checked) or RuntimeException (unchecked).",
      "An empty subclass only gets a no-arg constructor — to accept a message, add MyException(String message) { super(message); }",
      "Once that's in place, throw new MyException(\"message\"); works just like a built-in exception.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "How do you define a custom unchecked exception type?", options: [
        "A class that extends RuntimeException", "Using the keyword customerror", "Using try without catch", "You can't — only built-in exceptions exist" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Why does an empty `class MyException extends RuntimeException {}` reject `new MyException(\"bad\")`?", options: [
        "An empty subclass only gets a default no-arg constructor — it doesn't inherit the parent's String constructor", "Because RuntimeException can't be extended", "Because strings can't be exception messages", "It doesn't — this always works" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "throw stops the current method unless the exception is caught somewhere.", answer: true },
      { type: 'truefalse', prompt: "A custom exception class typically extends Exception or RuntimeException.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["throw new MyException(\"x\")", "Triggers an exception on purpose"], ["super(message);", "Forwards the message to the parent exception's constructor"],
      ] },
      { type: 'code', prompt: "Define class MyException extends RuntimeException with a constructor MyException(String message) calling super(message). Throw it inside try/catch that println's <code>caught custom</code>.",
        starter: "class MyException extends RuntimeException {\n    // your code here\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            throw new MyException(\"oops\");\n        } catch (MyException e) {\n            System.out.println(\"caught custom\");\n        }\n    }\n}",
        expected: "caught custom", mustContain: ['super(message)'] },
    ],
  },
  v10quiz: {
    id: 'v10quiz', unit: 'v10', title: 'Unit 10 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Exception Handling.", "try/catch/finally, checked vs unchecked, custom exceptions.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does try/catch let a program do?", options: [ "Recover from an exception instead of crashing", "Prevent exceptions from occurring", "Run faster", "Skip loops" ], answer: 0 },
      { type: 'mcq', prompt: "What must a checked exception be, by compiler rule?", options: [ "Declared or caught", "Ignored", "Always unchecked", "Static" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What do custom unchecked exceptions typically extend?", options: [ "RuntimeException", "Object", "Error", "Thread" ], answer: 0 },
      { type: 'truefalse', prompt: "finally runs whether or not an exception was thrown.", answer: true },
      { type: 'truefalse', hard: true, prompt: "ArithmeticException is checked, requiring explicit declaration.", answer: false },
      { type: 'truefalse', hard: true, prompt: "You can catch multiple specific exception types with separate catch blocks.", answer: true },
      { type: 'match', prompt: "Match each keyword to its purpose.", pairs: [
        ["try", "Code that might fail"], ["catch", "Handles the failure"], ["throw", "Triggers an exception"],
      ] },
      { type: 'code', prompt: "Wrap <code>1 / 0</code> in try/catch(ArithmeticException e) that println's <code>handled</code>.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        try {\n            int x = 1 / 0;\n        // your code here\n    }\n}",
        expected: "handled", mustContain: ['catch'] },
    ],
  },

  // UNIT 11 — Collections Framework
  v11l1: {
    id: 'v11l1', unit: 'v11', title: 'List & ArrayList', icon: '🗃️', xp: XP.LESSON,
    introLines: [
      "List<Integer> nums = new ArrayList<>(); is a resizable, ordered collection.",
      "nums.add(1); adds; nums.get(0); reads by position.",
      "Unlike arrays, Lists can grow and shrink as needed.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does nums.add(1) do to a List?", options: [ "Adds 1 to the end of the list", "Removes the first item", "Sorts the list", "Deletes the list" ], answer: 0 },
      { type: 'mcq', prompt: "What's the main advantage of a List over a plain array?", options: [ "It can grow and shrink dynamically", "It's always faster", "It can only hold numbers", "There's no difference" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "ArrayList is one common implementation of the List interface.", answer: true },
      { type: 'truefalse', prompt: "nums.get(0) retrieves the first item in the list.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["add(x)", "Adds x to the list"], ["get(i)", "Gets the item at position i"],
      ] },
      { type: 'code', prompt: "Create List&lt;Integer&gt; nums = new ArrayList&lt;&gt;(); add 1, 2, 3 and println nums.",
        starter: "import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "[1, 2, 3]", mustContain: ['ArrayList'] },
    ],
  },
  v11l2: {
    id: 'v11l2', unit: 'v11', title: 'Set & Map', icon: '🗃️', xp: XP.LESSON,
    introLines: [
      "A Set holds unique values — no duplicates allowed.",
      "A Map stores key-value pairs: map.put(\"a\", 1); map.get(\"a\");",
      "HashMap and HashSet are the most common implementations of each.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a Set guarantee?", options: [ "No duplicate values", "Values stay sorted", "Only numbers allowed", "Fixed size" ], answer: 0 },
      { type: 'mcq', prompt: "What does map.get(\"a\") do for a Map<String, Integer>?", options: [ "Returns the value stored under key \"a\"", "Removes key \"a\"", "Adds a new key", "Returns the map's size" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "HashMap is a common implementation of the Map interface.", answer: true },
      { type: 'truefalse', prompt: "map.put(\"a\", 1) adds or updates the key \"a\" with value 1.", answer: true },
      { type: 'match', prompt: "Match each type to what it stores.", pairs: [
        ["Set", "Unique values, no duplicates"], ["Map", "Key-value pairs"],
      ] },
      { type: 'code', prompt: "Create Map&lt;String, Integer&gt; scores = new HashMap&lt;&gt;(); put \"ana\", 90; println scores.get(\"ana\").",
        starter: "import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "90", mustContain: ['HashMap'] },
    ],
  },
  v11l3: {
    id: 'v11l3', unit: 'v11', title: 'Iterating Collections', icon: '🗃️', xp: XP.LESSON,
    introLines: [
      "A for-each loop is the cleanest way to visit every item in a List, Set, or array.",
      "for (int n : nums) { ... } reads as 'for each n in nums'.",
      "No index management needed — Java handles it for you.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>for (int n : nums)</code> do?", options: [
        "Visits each value in nums directly, one at a time", "Runs exactly once", "Only works with arrays, not Lists", "Deletes nums" ], answer: 0 },
      { type: 'mcq', prompt: "What's the benefit of for-each over a traditional indexed for loop?", options: [
        "No manual index management needed", "It's the only way to loop in Java", "It automatically sorts values", "It runs on a separate thread" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "For-each loops work on arrays, Lists, and Sets alike.", answer: true },
      { type: 'truefalse', prompt: "for-each reads as 'for each item in the collection'.", answer: true },
      { type: 'match', prompt: "Match each loop to what it does.", pairs: [
        ["for (int n : nums)", "Visits each value directly"], ["for (int i = 0; i < n; i++)", "Visits by index"],
      ] },
      { type: 'code', prompt: "List&lt;Integer&gt; nums = List.of(1, 2, 3); Use for-each to println each on its own line.",
        starter: "import java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> nums = List.of(1, 2, 3);\n        // your code here\n    }\n}",
        expected: "1\n2\n3", mustContain: ['for ('] },
    ],
  },
  v11quiz: {
    id: 'v11quiz', unit: 'v11', title: 'Unit 11 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Collections Framework.", "List, Set, Map, and iteration.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which collection guarantees no duplicates?", options: [ "Set", "List", "Array", "String" ], answer: 0 },
      { type: 'mcq', prompt: "Which collection stores key-value pairs?", options: [ "Map", "List", "Set", "Array" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does ArrayList implement?", options: [ "The List interface", "The Map interface", "The Set interface", "No interface" ], answer: 0 },
      { type: 'truefalse', prompt: "Lists can grow and shrink dynamically, unlike arrays.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A for-each loop works on Lists, Sets, and arrays.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Map keys must be unique, but values don't have to be.", answer: true },
      { type: 'match', prompt: "Match each collection to its syntax hint.", pairs: [
        ["List", "new ArrayList<>()"], ["Map", "new HashMap<>()"], ["Set", "new HashSet<>()"],
      ] },
      { type: 'code', prompt: "Create List&lt;Integer&gt; nums = new ArrayList&lt;&gt;(); add 4, 5 and println nums.",
        starter: "import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "[4, 5]", mustContain: ['ArrayList'] },
    ],
  },

  // UNIT 12 — Generics & Lambdas
  v12l1: {
    id: 'v12l1', unit: 'v12', title: 'Generic Types', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "List<String> means a List that can only hold Strings — checked at compile time.",
      "Generics let you write reusable code that stays type-safe.",
      "The <Type> part is called a type parameter.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does List<String> mean?", options: [
        "A List that can only hold String values, checked at compile time", "A List that holds anything", "A List with exactly one String", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What's the main benefit of generics?", options: [
        "Type safety — catching type mismatches at compile time", "Faster code execution", "Smaller file sizes", "They're required by Java syntax" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Trying to add an Integer to a List<String> is a compile-time error.", answer: true },
      { type: 'truefalse', prompt: "The <Type> part in List<Type> is called a type parameter.", answer: true },
      { type: 'match', prompt: "Match each declaration to what it holds.", pairs: [
        ["List<String>", "A list of Strings"], ["List<Integer>", "A list of Integers"],
      ] },
      { type: 'code', prompt: "Create List&lt;String&gt; names = new ArrayList&lt;&gt;(); add \"Ana\"; println names.get(0).",
        starter: "import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "Ana", mustContain: ['List<String>'] },
    ],
  },
  v12l2: {
    id: 'v12l2', unit: 'v12', title: 'Lambda Expressions & Functional Interfaces', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "A lambda is a compact way to write a function: (a, b) -> a + b",
      "It only works where Java expects a functional interface — one with a single abstract method.",
      "Runnable is a simple built-in functional interface: () -> { ... }",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>() -> System.out.println(\"hi\")</code> represent?", options: [
        "A lambda expression — a compact anonymous function", "A comment", "A String", "An array" ], answer: 0 },
      { type: 'mcq', prompt: "What is a functional interface?", options: [
        "An interface with exactly one abstract method", "Any interface at all", "A class with static methods", "An abstract class" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Lambdas can only be used where a functional interface is expected.", answer: true },
      { type: 'truefalse', prompt: "Runnable is a built-in functional interface with a single run() method.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it is.", pairs: [
        ["(a, b) -> a + b", "A lambda expression"], ["Runnable", "A functional interface"],
      ] },
      { type: 'code', prompt: "Define Runnable r = () -&gt; System.out.println(\"hi\"); then call r.run();",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "hi", mustContain: ['->'] },
    ],
  },
  v12l3: {
    id: 'v12l3', unit: 'v12', title: 'Streams Basics', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "Streams let you process collections in a pipeline: filter, map, and collect.",
      "nums.stream().map(n -> n * 2).forEach(System.out::println);",
      "Each step transforms the data, without changing the original collection.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does .stream() let you do with a collection?", options: [
        "Process it through a pipeline of operations like map and filter", "Delete it", "Sort it in place only", "Convert it to an array only" ], answer: 0 },
      { type: 'mcq', prompt: "What does .map(n -> n * 2) do in a stream pipeline?", options: [
        "Transforms each element by doubling it", "Removes elements", "Sorts elements", "Counts elements" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Stream operations don't modify the original collection.", answer: true },
      { type: 'truefalse', prompt: "forEach can be used to run an action on every element of a stream.", answer: true },
      { type: 'match', prompt: "Match each stream operation to its purpose.", pairs: [
        ["map", "Transforms each element"], ["forEach", "Runs an action per element"],
      ] },
      { type: 'code', prompt: "List&lt;Integer&gt; nums = List.of(1, 2, 3); Use stream().map(n -&gt; n * 2).forEach to println each doubled value.",
        starter: "import java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> nums = List.of(1, 2, 3);\n        // your code here\n    }\n}",
        expected: "2\n4\n6", mustContain: ['.stream('] },
    ],
  },
  v12quiz: {
    id: 'v12quiz', unit: 'v12', title: 'Unit 12 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Generics & Lambdas.", "Generic types, lambdas, functional interfaces, streams.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does List<String> guarantee?", options: [ "Only Strings can be added, checked at compile time", "Only one String can be added", "Nothing special", "It holds numbers only" ], answer: 0 },
      { type: 'mcq', prompt: "What is a lambda expression?", options: [ "A compact anonymous function", "A type of loop", "A compile error", "A variable declaration" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What must an interface have to be used with a lambda?", options: [ "Exactly one abstract method", "No methods at all", "At least two methods", "A constructor" ], answer: 0 },
      { type: 'truefalse', prompt: ".stream() lets you process a collection through a pipeline of operations.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Generics are checked at compile time, catching type errors early.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Stream operations modify the original collection in place.", answer: false },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["Generics", "Type-safe reusable code"], ["Lambda", "Compact anonymous function"], ["Stream", "Pipeline of operations"],
      ] },
      { type: 'code', prompt: "Define Runnable r = () -&gt; System.out.println(\"go\"); then call r.run();",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "go", mustContain: ['->'] },
    ],
  },

  // UNIT 13 — String Handling
  v13l1: {
    id: 'v13l1', unit: 'v13', title: 'StringBuilder', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "Strings in Java are immutable — every concatenation creates a new String.",
      "StringBuilder lets you build up text efficiently without that overhead.",
      "sb.append(\"more\") adds on; sb.toString() gives you the final String.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Why use StringBuilder instead of repeated String concatenation?", options: [
        "It avoids creating a new String object on every append", "It's required by Java syntax", "Strings can't be joined otherwise", "It makes text uppercase automatically" ], answer: 0 },
      { type: 'mcq', prompt: "What does sb.append(\"more\") do?", options: [ "Adds \"more\" onto the end of the builder's content", "Deletes the builder's content", "Converts it to a String immediately", "Sorts the content" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Java's String objects are immutable — they can't be changed after creation.", answer: true },
      { type: 'truefalse', prompt: "sb.toString() converts a StringBuilder's content into a regular String.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["append(x)", "Adds x to the end"], ["toString()", "Converts to a regular String"],
      ] },
      { type: 'code', prompt: "Use StringBuilder to build <code>ab</code> from appending \"a\" and \"b\", then println it.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "ab", mustContain: ['StringBuilder'] },
    ],
  },
  v13l2: {
    id: 'v13l2', unit: 'v13', title: 'String Formatting', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "String.format() and printf() let you build formatted text with placeholders.",
      "%d is for integers, %s for strings, %.2f for decimals with 2 places.",
      "This is much cleaner than gluing pieces together with +.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>String.format(\"Score: %d\", 5)</code> produce?", options: [
        "\"Score: 5\"", "\"Score: %d\"", "A compile error", "\"Score: five\"" ], answer: 0 },
      { type: 'mcq', prompt: "Which placeholder is used for a String value?", options: [ "%s", "%d", "%f", "%b" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "%.2f formats a decimal number with 2 digits after the point.", answer: true },
      { type: 'truefalse', prompt: "String.format() returns a new formatted String rather than printing directly.", answer: true },
      { type: 'match', prompt: "Match each placeholder to its type.", pairs: [
        ["%d", "Integer"], ["%s", "String"], ["%.2f", "Decimal with 2 places"],
      ] },
      { type: 'code', prompt: "int score = 5; Use String.format to build <code>Score: 5</code>; println the result.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        int score = 5;\n        // your code here\n    }\n}",
        expected: "Score: 5", mustContain: ['String.format'] },
    ],
  },
  v13l3: {
    id: 'v13l3', unit: 'v13', title: 'Common String Methods', icon: '🧵', xp: XP.LESSON,
    introLines: [
      ".substring(), .split(), .trim(), and .toUpperCase() are your everyday string toolbox.",
      "They all return a new String, since Strings are immutable.",
      "Between these, you can handle most everyday text tasks.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>\"cat\".toUpperCase()</code> return?", options: [ "\"CAT\"", "\"cat\"", "\"Cat\"", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What does .trim() do?", options: [ "Removes leading/trailing whitespace", "Converts to uppercase", "Reverses the string", "Splits into an array" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "String methods like .toUpperCase() return a new string rather than changing the original.", answer: true },
      { type: 'truefalse', prompt: "\" hi \".trim() equals \"hi\".", answer: true },
      { type: 'match', prompt: "Match each method to what it does.", pairs: [
        [".toUpperCase()", "ALL CAPS version"], [".trim()", "Removes edge whitespace"],
      ] },
      { type: 'code', prompt: "Println <code>\"cat\".toUpperCase()</code>.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "CAT", mustContain: ['.toUpperCase('] },
    ],
  },
  v13quiz: {
    id: 'v13quiz', unit: 'v13', title: 'Unit 13 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — String Handling.", "StringBuilder, formatting, common methods.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Why use StringBuilder over repeated concatenation?", options: [ "Avoids creating a new String each time", "It's required syntax", "It's the only way to join text", "It formats numbers" ], answer: 0 },
      { type: 'mcq', prompt: "Which placeholder formats an integer?", options: [ "%d", "%s", "%f", "%c" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Are Java Strings mutable or immutable?", options: [ "Immutable", "Mutable", "Depends on length", "Depends on content" ], answer: 0 },
      { type: 'truefalse', prompt: ".toLowerCase() returns a new lowercase string.", answer: true },
      { type: 'truefalse', hard: true, prompt: "StringBuilder is more efficient than String concatenation in a loop.", answer: true },
      { type: 'truefalse', hard: true, prompt: "String.format() prints directly to the console.", answer: false },
      { type: 'match', prompt: "Match each tool to its purpose.", pairs: [
        ["StringBuilder", "Efficient text building"], ["String.format", "Formatted text with placeholders"], [".trim()", "Removes edge whitespace"],
      ] },
      { type: 'code', prompt: "Use StringBuilder to build <code>xy</code> from appending \"x\" and \"y\", then println it.",
        starter: "public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}",
        expected: "xy", mustContain: ['StringBuilder'] },
    ],
  },

  // UNIT 14 — Advanced Topics
  v14l1: {
    id: 'v14l1', unit: 'v14', title: 'Nested Classes', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "A class defined inside another is a nested class — useful for tightly coupled helper types.",
      "static class Point { int x; } keeps a small helper type scoped to where it's used.",
      "Nested classes keep related code organized together.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a nested class?", options: [
        "A class defined inside another class", "A class with no methods", "An abstract class", "A private variable" ], answer: 0 },
      { type: 'mcq', prompt: "Why use a nested class?", options: [
        "To keep a small helper type organized alongside the class that uses it", "It's required for all classes", "It makes the class abstract", "It's faster than a regular class" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A static nested class doesn't need an instance of the outer class to be created.", answer: true },
      { type: 'truefalse', prompt: "Nested classes help keep tightly related code organized together.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Nested class", "A class defined inside another"], ["static class Point {}", "A static nested class"],
      ] },
      { type: 'code', prompt: "Inside Main, define static class Point { int x; }. In main, create Point p = new Point(); set p.x = 5; and println p.x.",
        starter: "public class Main {\n    // your code here\n\n    public static void main(String[] args) {\n        Point p = new Point();\n        p.x = 5;\n        System.out.println(p.x);\n    }\n}",
        expected: "5", mustContain: ['static class Point'] },
    ],
  },
  v14l2: {
    id: 'v14l2', unit: 'v14', title: 'Enums', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "An enum defines a fixed set of named constants: enum Day { MON, TUE, WED }",
      "Way clearer and safer than using plain integers or strings for fixed categories.",
      "Color c = Color.RED; picks one of the defined constants.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does an enum define?", options: [
        "A fixed set of named constant values", "A resizable list", "A type of loop", "A private field" ], answer: 0 },
      { type: 'mcq', prompt: "Why prefer an enum over plain integers for a fixed category like days of the week?", options: [
        "It's clearer and prevents invalid values", "It uses less memory always", "It's required by Java syntax", "There's no real benefit" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Enum constants are accessed like EnumName.CONSTANT.", answer: true },
      { type: 'truefalse', prompt: "An enum's set of values is fixed at compile time.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["enum Color { RED, GREEN }", "Defines a fixed set of constants"], ["Color.RED", "Accesses one constant"],
      ] },
      { type: 'code', prompt: "Define enum Color { RED, GREEN } (outside Main). In main, Color c = Color.RED; println c.",
        starter: "// your code here\n\npublic class Main {\n    public static void main(String[] args) {\n        Color c = Color.RED;\n        System.out.println(c);\n    }\n}",
        expected: "RED", mustContain: ['enum Color'] },
    ],
  },
  v14l3: {
    id: 'v14l3', unit: 'v14', title: 'File I/O Basics', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "FileWriter and BufferedReader let you write and read files, same idea as other languages.",
      "Wrap file operations in try/catch since I/O can fail.",
      "Always close what you open — or use try-with-resources to do it automatically.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does FileWriter let you do?", options: [
        "Write text to a file", "Only read files, not write", "Delete files", "Format text" ], answer: 0 },
      { type: 'mcq', prompt: "Why wrap file operations in try/catch?", options: [
        "File I/O can throw checked exceptions that must be handled", "It's optional decoration", "It makes the code run faster", "Files never fail to open" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "File I/O exceptions like IOException are checked exceptions in Java.", answer: true },
      { type: 'truefalse', prompt: "You should close a file resource when you're done with it.", answer: true },
      { type: 'match', prompt: "Match each class to its purpose.", pairs: [
        ["FileWriter", "Writes text to a file"], ["BufferedReader", "Reads text from a file"],
      ] },
      { type: 'code', prompt: "Write <code>hi</code> to test.txt with FileWriter, then read and println it back with BufferedReader. Wrap in try/catch(Exception e).",
        starter: "import java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            // your code here\n        } catch (Exception e) {\n            System.out.println(\"error\");\n        }\n    }\n}",
        expected: "hi", mustContain: ['FileWriter', 'BufferedReader'] },
    ],
  },
  v14quiz: {
    id: 'v14quiz', unit: 'v14', title: 'Unit 14 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Advanced Topics.", "Nested classes, enums, file I/O.", "This is the final quiz on the roadmap to OCP." ],
    questions: [
      { type: 'mcq', prompt: "What is a nested class?", options: [ "A class defined inside another class", "A private method", "An interface", "A generic type" ], answer: 0 },
      { type: 'mcq', prompt: "What does an enum define?", options: [ "A fixed set of named constants", "A resizable collection", "A type of exception", "A lambda" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What kind of exceptions does file I/O typically throw?", options: [ "Checked exceptions, like IOException", "Only unchecked exceptions", "No exceptions ever", "Only compile errors" ], answer: 0 },
      { type: 'truefalse', prompt: "Enum constants are accessed like EnumName.CONSTANT.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A static nested class needs an instance of the outer class to exist.", answer: false },
      { type: 'truefalse', hard: true, prompt: "File resources should be closed when you're done with them.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["Nested class", "Class inside a class"], ["enum", "Fixed set of constants"], ["FileWriter", "Writes to a file"],
      ] },
      { type: 'code', prompt: "Define enum Color { RED, GREEN } (outside Main). In main, Color c = Color.GREEN; println c.",
        starter: "// your code here\n\npublic class Main {\n    public static void main(String[] args) {\n        Color c = Color.GREEN;\n        System.out.println(c);\n    }\n}",
        expected: "GREEN", mustContain: ['enum Color'] },
    ],
  },
};

const JAVA_STUB_LESSONS = {};

const JAVA_UNITS = [
  { id: 'v1', tier: 'oca', title: 'First Contact', icon: '👾', lessons: ['v1l1','v1l2','v1l3','v1quiz'] },
  { id: 'v2', tier: 'oca', title: 'Operators & Expressions', icon: '⚡', lessons: ['v2l1','v2l2','v2l3','v2quiz'] },
  { id: 'v3', tier: 'oca', title: 'Making Decisions', icon: '🔀', lessons: ['v3l1','v3l2','v3l3','v3quiz'] },
  { id: 'v4', tier: 'oca', title: 'Loops', icon: '🔁', lessons: ['v4l1','v4l2','v4l3','v4quiz'] },
  { id: 'v5', tier: 'oca', title: 'Arrays', icon: '📚', lessons: ['v5l1','v5l2','v5l3','v5quiz'] },
  { id: 'v6', tier: 'oca', title: 'Methods', icon: '🧩', lessons: ['v6l1','v6l2','v6l3','v6quiz'] },
  { id: 'v7', tier: 'oca', title: 'OOP Foundations', icon: '🏗️', lessons: ['v7l1','v7l2','v7l3','v7quiz'] },
  { id: 'v8', tier: 'ocp', title: 'Inheritance & Polymorphism', icon: '🧬', lessons: ['v8l1','v8l2','v8l3','v8quiz'] },
  { id: 'v9', tier: 'ocp', title: 'Encapsulation & Object Class', icon: '🛡️', lessons: ['v9l1','v9l2','v9l3','v9quiz'] },
  { id: 'v10', tier: 'ocp', title: 'Exception Handling', icon: '🧯', lessons: ['v10l1','v10l2','v10l3','v10quiz'] },
  { id: 'v11', tier: 'ocp', title: 'Collections Framework', icon: '🗃️', lessons: ['v11l1','v11l2','v11l3','v11quiz'] },
  { id: 'v12', tier: 'ocp', title: 'Generics & Lambdas', icon: '🧠', lessons: ['v12l1','v12l2','v12l3','v12quiz'] },
  { id: 'v13', tier: 'ocp', title: 'String Handling', icon: '🧵', lessons: ['v13l1','v13l2','v13l3','v13quiz'] },
  { id: 'v14', tier: 'ocp', title: 'Advanced Topics', icon: '🚀', lessons: ['v14l1','v14l2','v14l3','v14quiz'] },
];

const JAVA_PREREQS = {
  v1l1: [], v1l2: ['v1l1'], v1l3: ['v1l2'], v1quiz: ['v1l3'],
  v2l1: ['v1quiz'], v2l2: ['v2l1'], v2l3: ['v2l2'], v2quiz: ['v2l3'],
  v3l1: ['v2quiz'], v3l2: ['v3l1'], v3l3: ['v3l2'], v3quiz: ['v3l3'],
  v4l1: ['v3quiz'], v4l2: ['v4l1'], v4l3: ['v4l2'], v4quiz: ['v4l3'],
  v5l1: ['v4quiz'], v5l2: ['v5l1'], v5l3: ['v5l2'], v5quiz: ['v5l3'],
  v6l1: ['v5quiz'], v6l2: ['v6l1'], v6l3: ['v6l2'], v6quiz: ['v6l3'],
  v7l1: ['v6quiz'], v7l2: ['v7l1'], v7l3: ['v7l2'], v7quiz: ['v7l3'],
  v8l1: ['v7quiz'], v8l2: ['v8l1'], v8l3: ['v8l2'], v8quiz: ['v8l3'],
  v9l1: ['v8quiz'], v9l2: ['v9l1'], v9l3: ['v9l2'], v9quiz: ['v9l3'],
  v10l1: ['v9quiz'], v10l2: ['v10l1'], v10l3: ['v10l2'], v10quiz: ['v10l3'],
  v11l1: ['v10quiz'], v11l2: ['v11l1'], v11l3: ['v11l2'], v11quiz: ['v11l3'],
  v12l1: ['v11quiz'], v12l2: ['v12l1'], v12l3: ['v12l2'], v12quiz: ['v12l3'],
  v13l1: ['v12quiz'], v13l2: ['v13l1'], v13l3: ['v13l2'], v13quiz: ['v13l3'],
  v14l1: ['v13quiz'], v14l2: ['v14l1'], v14l3: ['v14l2'], v14quiz: ['v14l3'],
};

const JAVA_TREE_LAYOUT = {
  v1l1: { col: 0, row: 0 }, v1l2: { col: 0, row: 1 }, v1l3: { col: 0, row: 2 }, v1quiz: { col: 0, row: 3 },
  v2l1: { col: 0, row: 4 }, v2l2: { col: 0, row: 5 }, v2l3: { col: 0, row: 6 }, v2quiz: { col: 0, row: 7 },
  v3l1: { col: 0, row: 8 }, v3l2: { col: 0, row: 9 }, v3l3: { col: 0, row: 10 }, v3quiz: { col: 0, row: 11 },
  v4l1: { col: 0, row: 12 }, v4l2: { col: 0, row: 13 }, v4l3: { col: 0, row: 14 }, v4quiz: { col: 0, row: 15 },
  v5l1: { col: 0, row: 16 }, v5l2: { col: 0, row: 17 }, v5l3: { col: 0, row: 18 }, v5quiz: { col: 0, row: 19 },
  v6l1: { col: 0, row: 20 }, v6l2: { col: 0, row: 21 }, v6l3: { col: 0, row: 22 }, v6quiz: { col: 0, row: 23 },
  v7l1: { col: 0, row: 24 }, v7l2: { col: 0, row: 25 }, v7l3: { col: 0, row: 26 }, v7quiz: { col: 0, row: 27 },
  cp_oca: { col: 0, row: 28 },
  v8l1: { col: 0, row: 29 }, v8l2: { col: 0, row: 30 }, v8l3: { col: 0, row: 31 }, v8quiz: { col: 0, row: 32 },
  v9l1: { col: 0, row: 33 }, v9l2: { col: 0, row: 34 }, v9l3: { col: 0, row: 35 }, v9quiz: { col: 0, row: 36 },
  v10l1: { col: 0, row: 37 }, v10l2: { col: 0, row: 38 }, v10l3: { col: 0, row: 39 }, v10quiz: { col: 0, row: 40 },
  v11l1: { col: 0, row: 41 }, v11l2: { col: 0, row: 42 }, v11l3: { col: 0, row: 43 }, v11quiz: { col: 0, row: 44 },
  v12l1: { col: 0, row: 45 }, v12l2: { col: 0, row: 46 }, v12l3: { col: 0, row: 47 }, v12quiz: { col: 0, row: 48 },
  v13l1: { col: 0, row: 49 }, v13l2: { col: 0, row: 50 }, v13l3: { col: 0, row: 51 }, v13quiz: { col: 0, row: 52 },
  v14l1: { col: 0, row: 53 }, v14l2: { col: 0, row: 54 }, v14l3: { col: 0, row: 55 }, v14quiz: { col: 0, row: 56 },
  cp_ocp: { col: 0, row: 57 },
};

const JAVA_TREE_EDGES = [
  ['v1l1','v1l2'], ['v1l2','v1l3'], ['v1l3','v1quiz'],
  ['v1quiz','v2l1'], ['v2l1','v2l2'], ['v2l2','v2l3'], ['v2l3','v2quiz'],
  ['v2quiz','v3l1'], ['v3l1','v3l2'], ['v3l2','v3l3'], ['v3l3','v3quiz'],
  ['v3quiz','v4l1'], ['v4l1','v4l2'], ['v4l2','v4l3'], ['v4l3','v4quiz'],
  ['v4quiz','v5l1'], ['v5l1','v5l2'], ['v5l2','v5l3'], ['v5l3','v5quiz'],
  ['v5quiz','v6l1'], ['v6l1','v6l2'], ['v6l2','v6l3'], ['v6l3','v6quiz'],
  ['v6quiz','v7l1'], ['v7l1','v7l2'], ['v7l2','v7l3'], ['v7l3','v7quiz'],
  ['v7quiz','cp_oca'], ['cp_oca','v8l1'],
  ['v8l1','v8l2'], ['v8l2','v8l3'], ['v8l3','v8quiz'],
  ['v8quiz','v9l1'], ['v9l1','v9l2'], ['v9l2','v9l3'], ['v9l3','v9quiz'],
  ['v9quiz','v10l1'], ['v10l1','v10l2'], ['v10l2','v10l3'], ['v10l3','v10quiz'],
  ['v10quiz','v11l1'], ['v11l1','v11l2'], ['v11l2','v11l3'], ['v11l3','v11quiz'],
  ['v11quiz','v12l1'], ['v12l1','v12l2'], ['v12l2','v12l3'], ['v12l3','v12quiz'],
  ['v12quiz','v13l1'], ['v13l1','v13l2'], ['v13l2','v13l3'], ['v13l3','v13quiz'],
  ['v13quiz','v14l1'], ['v14l1','v14l2'], ['v14l2','v14l3'], ['v14l3','v14quiz'],
  ['v14quiz','cp_ocp'],
];

const JAVA_UNIT_LABEL_ANCHOR = {
  v1: 'v1l1', v2: 'v2l1', v3: 'v3l1', v4: 'v4l1', v5: 'v5l1', v6: 'v6l1', v7: 'v7l1',
  v8: 'v8l1', v9: 'v9l1', v10: 'v10l1', v11: 'v11l1', v12: 'v12l1', v13: 'v13l1', v14: 'v14l1',
};

registerCurriculum('java', {
  LESSONS: JAVA_LESSONS, STUB_LESSONS: JAVA_STUB_LESSONS, UNITS: JAVA_UNITS, PREREQS: JAVA_PREREQS,
  TREE_LAYOUT: JAVA_TREE_LAYOUT, TREE_EDGES: JAVA_TREE_EDGES, UNIT_LABEL_ANCHOR: JAVA_UNIT_LABEL_ANCHOR,
});

CERT_CHECKPOINTS.java = [
  { id: 'cp_oca', afterUnit: 'v7', name: 'OCA', fullName: 'Oracle Certified Associate, Java SE Programmer', icon: '🎓' },
  { id: 'cp_ocp', afterUnit: 'v14', name: 'OCP', fullName: 'Oracle Certified Professional, Java SE Programmer', icon: '🏆' },
];

// ===================================================================================
// ===== C++ curriculum (CPA -> CPP) =====
// Code exercises compile & run for real via Judge0 (see CODE_RUNTIME in lesson-engine.js).
// Every starter is a full compilable program (#include + main()) — students fill in the
// marked blank. cout prints bool as 1/0 by default; expected strings match that exactly.
// ===================================================================================
const CPP_LESSONS = {
  // UNIT 1 — First Contact
  x1l1: {
    id: 'x1l1', unit: 'x1', title: 'What Is C++?', icon: '💾', xp: XP.LESSON,
    introLines: [
      "C++ is a powerful, compiled language used for everything from games to operating systems.",
      "Code is organized into functions — every program starts running from main().",
      "std::cout << ... is how you'll see output — it's C++'s version of print().",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>cout</code> do?", options: [
        "Sends output to the console", "Deletes a variable", "Creates a new function", "Only works with numbers" ], answer: 0 },
      { type: 'mcq', prompt: "Which function is the starting point of every C++ program?", options: [ "main()", "start()", "run()", "init()" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Every C++ program needs a main() function.", answer: true },
      { type: 'truefalse', prompt: "<< is used to send values to cout.", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["cout << x;", "Prints x to the console"], ["int main() { ... }", "The starting point of a C++ program"],
      ] },
      { type: 'code', prompt: "Print <code>hello</code> using cout.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "hello", mustContain: ['cout'] },
    ],
  },
  x1l2: {
    id: 'x1l2', unit: 'x1', title: 'Variables & Data Types', icon: '📦', xp: XP.LESSON,
    introLines: [
      "Like most compiled languages, C++ wants you to declare a variable's type up front.",
      "int score = 0; creates a whole-number box. double, bool, and string work the same way.",
      "Once declared, a variable's type can't change.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>int score = 0;</code> do?", options: [
        "Creates a variable named score that can only hold whole numbers", "Creates a variable that can hold any type", "Prints the number 0", "Deletes a variable" ], answer: 0 },
      { type: 'mcq', prompt: "Which type would you use for text in C++?", options: [ "string", "int", "bool", "double" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "In C++, a variable declared as int cannot later be assigned a string value.", answer: true },
      { type: 'truefalse', prompt: "double is used for numbers with decimal points.", answer: true },
      { type: 'match', prompt: "Match each type to what it holds.", pairs: [
        ["int", "Whole numbers"], ["double", "Decimal numbers"], ["string", "Text"], ["bool", "true or false"],
      ] },
      { type: 'code', prompt: "Declare an int named score equal to 10, then cout it.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "10", mustContain: ['int score'] },
    ],
  },
  x1l3: {
    id: 'x1l3', unit: 'x1', title: 'cout/cin & Comments', icon: '📝', xp: XP.LESSON,
    introLines: [
      "cout sends output to the console; cin reads input from the user.",
      "// starts a single-line comment — the compiler skips right over it.",
      "/* ... */ marks a comment that can span multiple lines.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does cin do?", options: [
        "Reads input from the user", "Prints output", "Deletes a variable", "Only works with numbers" ], answer: 0 },
      { type: 'mcq', prompt: "Which line is a comment in C++?", options: [
        "// set the score to zero", "int score = 0;", "cout << score;", "score == 0;" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Comments are skipped entirely when C++ code compiles and runs.", answer: true },
      { type: 'truefalse', prompt: "/* ... */ comments can span multiple lines.", answer: true },
      { type: 'match', prompt: "Match each syntax to its type.", pairs: [
        ["//", "Single-line comment"], ["/* */", "Multi-line comment"],
      ] },
      { type: 'code', prompt: "Print the text <code>ready</code> using cout, with a // comment above it explaining what it does.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "ready", mustContain: ['//', 'cout'] },
    ],
  },
  x1quiz: {
    id: 'x1quiz', unit: 'x1', title: 'Unit 1 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Time for a compiled quiz.", "It pulls from everything in First Contact.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does cout << \"hi\"; do?", options: [ "Prints hi to the console", "Deletes hi", "Creates a variable named hi", "Nothing" ], answer: 0 },
      { type: 'mcq', prompt: "Which type holds whole numbers?", options: [ "int", "string", "bool", "void" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does a variable's declared type control?", options: [ "What kind of value it can hold", "Its name", "Whether it's a comment", "Nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "A variable can be thought of as a labeled, typed box holding a value.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Every C++ program needs a main() function.", answer: true },
      { type: 'truefalse', hard: true, prompt: "C++ lets a variable change its declared type after creation.", answer: false },
      { type: 'match', prompt: "Match each type to what it holds.", pairs: [
        ["int", "Whole numbers"], ["string", "Text"], ["bool", "true or false"],
      ] },
      { type: 'code', prompt: "Declare an int named total equal to 5, then cout it.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['int total'] },
    ],
  },

  // UNIT 2 — Operators & Expressions
  x2l1: {
    id: 'x2l1', unit: 'x2', title: 'Math Operators', icon: '➕', xp: XP.LESSON,
    introLines: [
      "+ adds, - subtracts, * multiplies, / divides — same as most languages.",
      "% gives you the remainder after division: 10 % 3 is 1.",
      "Dividing two int values truncates any decimal part: 7 / 2 is 3, not 3.5.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does % do between two integers in C++?", options: [
        "Gives the remainder after division", "Divides them", "Multiplies them", "Compares them" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>7 / 2</code> evaluate to in C++, using two ints?", options: [ "3 (integer division truncates)", "3.5", "4", "a compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Dividing two int values in C++ truncates any decimal part.", answer: true },
      { type: 'truefalse', prompt: "10 % 3 evaluates to 1.", answer: true },
      { type: 'match', prompt: "Match each operator to what it does.", pairs: [
        ["+", "Addition"], ["%", "Remainder"], ["/", "Division"],
      ] },
      { type: 'code', prompt: "Declare int total equal to 4 * 3 and cout it.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "12", mustContain: ['*'] },
    ],
  },
  x2l2: {
    id: 'x2l2', unit: 'x2', title: 'Comparison Operators', icon: '⚖️', xp: XP.LESSON,
    introLines: [
      "== checks equality; != checks not-equal — same idea as most languages.",
      "For std::string, == compares actual text content, unlike old-style C-strings.",
      "By default, cout prints a bool as 1 (true) or 0 (false), not the words 'true'/'false'.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does cout print for a bool value by default?", options: [
        "1 for true, 0 for false", "The words true or false", "Nothing", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What does == do between two std::string values?", options: [
        "Compares their actual text content", "Compares memory addresses only", "Always returns false", "Converts them to numbers" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "cout << (5 == 5); prints 1, not the word true.", answer: true },
      { type: 'truefalse', prompt: "5 != 4 evaluates to true.", answer: true },
      { type: 'match', prompt: "Match each operator to its meaning.", pairs: [
        ["==", "Are these equal?"], ["!=", "Are these NOT equal?"],
      ] },
      { type: 'code', prompt: "Cout the result of (7 == 7).",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "1", mustContain: ['=='] },
    ],
  },
  x2l3: {
    id: 'x2l3', unit: 'x2', title: 'Logical Operators', icon: '🔗', xp: XP.LESSON,
    introLines: [
      "&&, ||, and ! combine or flip boolean checks.",
      "&& needs both sides true; || needs at least one.",
      "Remember: cout prints bool results as 1 or 0.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does && require?", options: [
        "Both sides must be true", "Only one side needs to be true", "It flips true to false", "It only works with numbers" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>cout << (true \\&\\& false);</code> print?", options: [ "0", "1", "false", "an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "true || false evaluates to true (printed as 1).", answer: true },
      { type: 'truefalse', prompt: "! flips a boolean value: !true is false.", answer: true },
      { type: 'match', prompt: "Match each operator to its meaning.", pairs: [
        ["&&", "Both must be true"], ["||", "At least one must be true"], ["!", "Flips true/false"],
      ] },
      { type: 'code', prompt: "Cout the result of (true && false).",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "0", mustContain: ['&&'] },
    ],
  },
  x2quiz: {
    id: 'x2quiz', unit: 'x2', title: 'Unit 2 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Operators & Expressions.", "Math, comparison, and logical operators.", "Let's see what you've got." ],
    questions: [
      { type: 'mcq', prompt: "What does * do between two numbers?", options: [ "Multiplies them", "Compares them", "Joins them", "Divides them" ], answer: 0 },
      { type: 'mcq', prompt: "What does cout print for a bool by default?", options: [ "1 or 0", "true or false", "Nothing", "An error" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does 7 / 2 evaluate to using two ints?", options: [ "3", "3.5", "4", "an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "== compares std::string content, not identity.", answer: true },
      { type: 'truefalse', hard: true, prompt: "&& requires both operands to be true.", answer: true },
      { type: 'truefalse', prompt: "Both && and || are logical operators.", answer: true },
      { type: 'match', prompt: "Match the operator to its category.", pairs: [
        ["+", "Math operator"], ["==", "Comparison operator"], ["&&", "Logical operator"],
      ] },
      { type: 'code', prompt: "Declare int result equal to 10 / 2 and cout it.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['/'] },
    ],
  },

  // UNIT 3 — Making Decisions
  x3l1: {
    id: 'x3l1', unit: 'x3', title: 'If Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "An if statement runs a block only when a condition is true.",
      "if (score > 50) { cout << \"pass\"; }",
      "The condition inside () is evaluated as a boolean.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>if (condition)</code> do?", options: [
        "Runs the block only when condition is true", "Runs the block every time", "Deletes a variable", "Repeats forever" ], answer: 0 },
      { type: 'mcq', prompt: "What do the curly braces {} mark in an if statement?", options: [
        "What's inside the block that runs conditionally", "A comment", "A function call", "An array" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "If the condition is false, the block inside {} is skipped.", answer: true },
      { type: 'truefalse', hard: true, prompt: "In C++, `if (1)` is treated as true — nonzero numbers count as true.", answer: true },
      { type: 'match', prompt: "Match each piece to what it means.", pairs: [
        ["if (x > 0) {...}", "Runs the block only if x is greater than 0"], ["{ }", "Marks the conditional block"],
      ] },
      { type: 'code', prompt: "int n = 5; Cout <code>positive</code> if n is greater than 0.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 5;\n    // your code here\n    return 0;\n}",
        expected: "positive", mustContain: ['if', '>'] },
    ],
  },
  x3l2: {
    id: 'x3l2', unit: 'x3', title: 'If / Else / Else If', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "else runs when the if didn't.",
      "else if lets you check another condition.",
      "Only one branch in the chain ever runs.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>else</code> do?", options: [
        "Runs when the if condition was false", "Runs always", "Repeats the block", "Only works with loops" ], answer: 0 },
      { type: 'mcq', prompt: "How do you write 'else if' in C++?", options: [ "else if", "elseif", "elif", "else.if" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Only one branch of an if/else if/else chain runs per pass.", answer: true },
      { type: 'truefalse', prompt: "else is optional — you can have just if.", answer: true },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "Checks the first condition"], ["else if", "Checks another condition"], ["else", "Runs if nothing matched"],
      ] },
      { type: 'code', prompt: "int n = 0; Cout <code>zero</code> if n is 0, <code>positive</code> if greater, else <code>negative</code>.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 0;\n    // your code here\n    return 0;\n}",
        expected: "zero", mustContain: ['if', 'else if', 'else'] },
    ],
  },
  x3l3: {
    id: 'x3l3', unit: 'x3', title: 'Switch Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "A switch statement compares one value against several possible cases.",
      "Each case needs a break, or execution 'falls through' into the next one.",
      "default catches anything that didn't match a case.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does break do inside a switch case?", options: [
        "Stops execution from falling through to the next case", "Ends the whole program", "Starts a loop", "Deletes the switch" ], answer: 0 },
      { type: 'mcq', prompt: "What does the default case in a switch do?", options: [
        "Runs when no other case matched", "Always runs first", "Deletes the switch", "Only works with numbers" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Forgetting break in a switch case causes execution to fall through to the next case.", answer: true },
      { type: 'truefalse', prompt: "A switch statement can often replace a long if/else if chain.", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["case", "One possible matching value"], ["break", "Stops fall-through"], ["default", "Runs if nothing else matched"],
      ] },
      { type: 'code', prompt: "int day = 1; Use switch to cout <code>weekday</code> for case 1, <code>weekend</code> otherwise (default).",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int day = 1;\n    // your code here\n    return 0;\n}",
        expected: "weekday", mustContain: ['switch', 'case', 'default'] },
    ],
  },
  x3quiz: {
    id: 'x3quiz', unit: 'x3', title: 'Unit 3 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Making Decisions.", "if/else if/else, and switch.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What happens when an if condition is false?", options: [ "The block is skipped", "The block runs anyway", "The program crashes", "It repeats forever" ], answer: 0 },
      { type: 'mcq', prompt: "Which keyword checks an additional condition after if?", options: [ "else if", "else", "then", "or" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What happens if you forget break in a switch case?", options: [ "Execution falls through to the next case", "The switch stops entirely", "A compile error occurs", "Nothing happens" ], answer: 0 },
      { type: 'truefalse', prompt: "else runs only if no earlier condition matched.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Nonzero numeric values are treated as true in an if condition.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A switch statement's default case is required.", answer: false },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "First condition checked"], ["else", "Runs when nothing matched"], ["switch", "Compares one value against cases"],
      ] },
      { type: 'code', prompt: "int n = -3; Cout <code>negative</code> if n is less than 0, else <code>non-negative</code>.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = -3;\n    // your code here\n    return 0;\n}",
        expected: "negative", mustContain: ['if', 'else'] },
    ],
  },

  // UNIT 4 — Loops
  x4l1: {
    id: 'x4l1', unit: 'x4', title: 'While Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "while repeats its block as long as a condition stays true.",
      "while (count < 3) { ... } — same idea as other languages, just with typed variables.",
      "Forget to update the condition, and you get an infinite loop.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a while loop do?", options: [
        "Repeats its block as long as the condition is true", "Runs its block exactly once", "Runs a fixed number of times only", "Never runs" ], answer: 0 },
      { type: 'mcq', prompt: "What commonly causes an infinite loop?", options: [
        "Never updating the condition so it stays true forever", "Using cout inside it", "Declaring an int inside it", "Using else" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A while loop can run zero times if its condition starts out false.", answer: true },
      { type: 'truefalse', prompt: "You must update the condition variable inside a while loop, or it may never stop.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["while (x < 5) {...}", "Repeats while x is less than 5"], ["Infinite loop", "A loop whose condition never becomes false"],
      ] },
      { type: 'code', prompt: "Cout 0, 1, 2 each on its own line using a while loop.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n = 0;\n    // your code here\n    return 0;\n}",
        expected: "0\n1\n2", mustContain: ['while'] },
    ],
  },
  x4l2: {
    id: 'x4l2', unit: 'x4', title: 'For Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "for (int i = 0; i < 3; i++) { ... } packs setup, condition, and update into one line.",
      "i++ is shorthand for i = i + 1.",
      "This is the most common loop style for counting in C++.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>for (int i = 0; i < 3; i++)</code> do?", options: [
        "Loops with i = 0, 1, then 2", "Loops exactly once", "Loops 4 times", "Creates a variable named for" ], answer: 0 },
      { type: 'mcq', prompt: "What does i++ mean?", options: [ "Increase i by 1", "Decrease i by 1", "Double i", "Compare i to 1" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "for (int i = 2; i < 5; i++) loops with i = 2, 3, 4 — not 5.", answer: true },
      { type: 'truefalse', prompt: "A for loop's three parts are: initialization, condition, and update.", answer: true },
      { type: 'match', prompt: "Match each part to its role.", pairs: [
        ["int i = 0", "Initialization"], ["i < 3", "Condition"], ["i++", "Update"],
      ] },
      { type: 'code', prompt: "Use a for loop to cout 1, 2, 3.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "1\n2\n3", mustContain: ['for'] },
    ],
  },
  x4l3: {
    id: 'x4l3', unit: 'x4', title: 'Loop Control', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "break exits a loop immediately. continue skips to the next pass.",
      "Both work the same way in while and for loops.",
      "Use them to handle special cases without deeply nesting more ifs.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does break do inside a loop?", options: [
        "Stops the loop immediately", "Skips to the next iteration", "Restarts the loop", "Pauses forever" ], answer: 0 },
      { type: 'mcq', prompt: "What does continue do?", options: [ "Skips the rest of the current iteration", "Ends the loop", "Deletes the loop variable", "Runs the block twice" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "break and continue both work inside for and while loops.", answer: true },
      { type: 'truefalse', prompt: "continue jumps straight to the next iteration's condition check.", answer: true },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exit the loop right now"], ["continue", "Skip to next iteration"],
      ] },
      { type: 'code', prompt: "Loop i from 0 to 4 with a for loop; cout i but skip 2 using continue.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    for (int i = 0; i < 5; i++) {\n        // your code here\n        cout << i << \"\\n\";\n    }\n    return 0;\n}",
        expected: "0\n1\n3\n4", mustContain: ['continue'] },
    ],
  },
  x4quiz: {
    id: 'x4quiz', unit: 'x4', title: 'Unit 4 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Loops.", "while, for, and loop control.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which loop keeps running as long as a condition is true?", options: [ "while", "for", "switch", "void" ], answer: 0 },
      { type: 'mcq', prompt: "What does for (int i = 0; i < 3; i++) loop through?", options: [ "0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "3, only" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does break do inside a loop?", options: [ "Exits the loop immediately", "Skips one iteration", "Restarts the loop", "Does nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "continue skips the rest of the current iteration only.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A while loop's condition is checked before each pass, including the first.", answer: true },
      { type: 'truefalse', hard: true, prompt: "for (int i = 1; i < 4; i++) includes i = 4.", answer: false },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exits the loop"], ["continue", "Skips to next iteration"], ["for", "Counts through a range"],
      ] },
      { type: 'code', prompt: "Use a for loop to cout 5, 4, 3, 2, 1 (decrementing).",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "5\n4\n3\n2\n1", mustContain: ['for'] },
    ],
  },

  // UNIT 5 — Arrays
  x5l1: {
    id: 'x5l1', unit: 'x5', title: 'Array Basics', icon: '📚', xp: XP.LESSON,
    introLines: [
      "An array is a fixed-size, ordered list of values of the same type.",
      "int nums[] = {1, 2, 3}; access items by position: nums[0] is 1.",
      "C-style arrays don't know their own length — sizeof(nums) / sizeof(nums[0]) computes it.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "How do you get the number of items in a C-style array in C++?", options: [
        "sizeof(arr) / sizeof(arr[0])", "arr.length", "arr.length()", "len(arr)" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>nums[0]</code> get you in <code>int nums[] = {10, 20, 30};</code>?", options: [ "10", "20", "30", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Array indexing starts at 0, not 1.", answer: true },
      { type: 'truefalse', prompt: "A C-style array's size is fixed once it's created.", answer: true },
      { type: 'match', prompt: "Match each expression to what it does.", pairs: [
        ["nums[1]", "The second item"], ["sizeof(nums)/sizeof(nums[0])", "The number of items"],
      ] },
      { type: 'code', prompt: "int nums[] = {1,2,3}; Cout the number of elements using sizeof.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int nums[] = {1, 2, 3};\n    // your code here\n    return 0;\n}",
        expected: "3", mustContain: ['sizeof'] },
    ],
  },
  x5l2: {
    id: 'x5l2', unit: 'x5', title: 'Multi-dimensional Arrays', icon: '📚', xp: XP.LESSON,
    introLines: [
      "A 2D array models a grid: int grid[2][2] = {{1, 2}, {3, 4}};",
      "grid[0][1] gets row 0, column 1.",
      "Useful for anything with rows and columns, like a board game.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>grid[0][1]</code> access in <code>int grid[2][2] = {{1,2},{3,4}};</code>?", options: [ "2 (row 0, column 1)", "1", "3", "4" ], answer: 0 },
      { type: 'mcq', prompt: "What does int grid[2][2] represent?", options: [ "A 2D array (2 rows, 2 columns)", "A single number", "A string", "A boolean" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Each row in a 2D array is itself a 1D array.", answer: true },
      { type: 'truefalse', prompt: "int grid[2][2] = {{1,2},{3,4}}; creates a 2-row, 2-column grid.", answer: true },
      { type: 'match', prompt: "Match each expression to what it gets.", pairs: [
        ["grid[0]", "The first row"], ["grid[0][1]", "Row 0, column 1"],
      ] },
      { type: 'code', prompt: "int grid[2][2] = {{1,2},{3,4}}; Cout grid[1][0].",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int grid[2][2] = {{1, 2}, {3, 4}};\n    // your code here\n    return 0;\n}",
        expected: "3", mustContain: ['grid[1][0]'] },
    ],
  },
  x5l3: {
    id: 'x5l3', unit: 'x5', title: 'C-strings vs std::string', icon: '📚', xp: XP.LESSON,
    introLines: [
      "std::string is the modern, safe way to handle text in C++.",
      "C-strings (plain char arrays) are the old C-style approach — std::string wraps that complexity away.",
      "std::string supports +, ==, and useful methods like .length().",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does .length() return on a std::string?", options: [
        "The number of characters it holds", "Its memory address", "Its first character", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What's a key advantage of std::string over a raw C-string?", options: [
        "It manages its own memory and resizing automatically", "It's always faster", "It can only hold numbers", "There's no difference" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "std::string supports + to concatenate two strings.", answer: true },
      { type: 'truefalse', prompt: "You need `#include <string>` to use std::string.", answer: true },
      { type: 'match', prompt: "Match each expression to its result.", pairs: [
        ["s.length()", "Number of characters"], ["\"a\" + s", "Concatenated string (with s a std::string)"],
      ] },
      { type: 'code', prompt: "string s = \"cat\"; Cout s.length().",
        starter: "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s = \"cat\";\n    // your code here\n    return 0;\n}",
        expected: "3", mustContain: ['.length('] },
    ],
  },
  x5quiz: {
    id: 'x5quiz', unit: 'x5', title: 'Unit 5 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Arrays.", "Basics, multi-dimensional arrays, and strings.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "How do you find a C-style array's length?", options: [ "sizeof(arr) / sizeof(arr[0])", "arr.length", "arr.size", "len(arr)" ], answer: 0 },
      { type: 'mcq', prompt: "What does std::string.length() return?", options: [ "The number of characters", "The first character", "A compile error", "The memory address" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does int grid[2][2] represent?", options: [ "A 2D array", "A single integer", "A string", "A pointer only" ], answer: 0 },
      { type: 'truefalse', prompt: "Array indexing starts at 0 in C++.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A C-style array knows its own length automatically at runtime.", answer: false },
      { type: 'truefalse', hard: true, prompt: "std::string is generally safer and easier to use than raw C-strings.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["C-string", "Old-style char array"], ["std::string", "Modern managed string type"], [".length()", "Number of characters"],
      ] },
      { type: 'code', prompt: "string s = \"hello\"; Cout s.length().",
        starter: "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s = \"hello\";\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['.length('] },
    ],
  },

  // UNIT 6 — Functions
  x6l1: {
    id: 'x6l1', unit: 'x6', title: 'Defining Functions', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A function is a named, reusable block of instructions.",
      "void greet() { ... } defines it. Calling greet(); later runs everything inside.",
      "Every C++ program needs at least one function: main().",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>void greet() {}</code> define?", options: [
        "A function named greet that returns nothing", "A variable", "A class", "An array" ], answer: 0 },
      { type: 'mcq', prompt: "How do you run a function named greet from inside main?", options: [ "greet();", "void greet", "run greet", "greet" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Defining a function does not run its code immediately.", answer: true },
      { type: 'truefalse', prompt: "void means a function doesn't return a value.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["void sayHi() {}", "Defines a function named sayHi"], ["sayHi();", "Calls (runs) the function"],
      ] },
      { type: 'code', prompt: "Define void greet() that cout's <code>hi</code>, then call it once from main.",
        starter: "#include <iostream>\nusing namespace std;\n\n// your code here\n\nint main() {\n    greet();\n    return 0;\n}",
        expected: "hi", mustContain: ['void greet'] },
    ],
  },
  x6l2: {
    id: 'x6l2', unit: 'x6', title: 'Parameters & Overloading', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A parameter is a typed placeholder a function expects: void greet(string name)",
      "Overloading means multiple functions can share a name, as long as their parameters differ.",
      "The compiler picks the right one based on the arguments you pass.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "In <code>void greet(string name) {}</code>, what is <code>name</code>?", options: [
        "A typed parameter — a placeholder for a string value", "A loop variable", "A keyword", "The return value" ], answer: 0 },
      { type: 'mcq', prompt: "What is function overloading?", options: [
        "Defining multiple functions with the same name but different parameters", "Calling a function twice", "Renaming a function", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Overloaded functions must differ in their parameter types or count, not just their return type.", answer: true },
      { type: 'truefalse', prompt: "The compiler picks which overloaded function to call based on the arguments you pass.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "Typed placeholder in the definition"], ["Overloading", "Same name, different parameters"],
      ] },
      { type: 'code', prompt: "Define int add(int a, int b) returning a + b, then cout add(2, 3) from main.",
        starter: "#include <iostream>\nusing namespace std;\n\n// your code here\n\nint main() {\n    cout << add(2, 3);\n    return 0;\n}",
        expected: "5", mustContain: ['int add', 'return'] },
    ],
  },
  x6l3: {
    id: 'x6l3', unit: 'x6', title: 'Return Values & Scope', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "return sends a value back out of a function, instead of just printing it.",
      "A void function returns nothing at all.",
      "A variable declared inside a function only exists inside it — that's scope.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does return do?", options: [
        "Sends a value back to wherever the function was called", "Prints a value to the console", "Stops the whole program", "Deletes the function" ], answer: 0 },
      { type: 'mcq', prompt: "What return type would you use for a function that returns nothing?", options: [ "void", "int", "null", "empty" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A variable declared inside a function isn't accessible outside it.", answer: true },
      { type: 'truefalse', prompt: "A function's return type must match what it actually returns.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["return x;", "Sends x back out of the function"], ["void", "A function that returns nothing"],
      ] },
      { type: 'code', prompt: "Define int square(int n) returning n * n. Cout square(4) from main.",
        starter: "#include <iostream>\nusing namespace std;\n\n// your code here\n\nint main() {\n    cout << square(4);\n    return 0;\n}",
        expected: "16", mustContain: ['int square', 'return'] },
    ],
  },
  x6quiz: {
    id: 'x6quiz', unit: 'x6', title: 'Unit 6 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Functions.", "Defining, parameters, overloading, and return values.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What return type means a function returns nothing?", options: [ "void", "int", "null", "none" ], answer: 0 },
      { type: 'mcq', prompt: "What does a parameter represent?", options: [ "A typed placeholder for a value the function expects", "The function's name", "A compile error", "A loop counter" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What must differ between two overloaded functions?", options: [ "Their parameter types or count", "Only their return type", "Their name", "Nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "Calling a function runs the code inside it.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Variables declared inside a function are local to it.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A function can take zero parameters.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "Placeholder in the definition"], ["Argument", "Actual value passed in"], ["return", "Sends a value back"],
      ] },
      { type: 'code', prompt: "Define int doubleIt(int n) returning n * 2. Cout doubleIt(6) from main.",
        starter: "#include <iostream>\nusing namespace std;\n\n// your code here\n\nint main() {\n    cout << doubleIt(6);\n    return 0;\n}",
        expected: "12", mustContain: ['int doubleIt', 'return'] },
    ],
  },

  // UNIT 7 — Pointers & References
  x7l1: {
    id: 'x7l1', unit: 'x7', title: 'Pointer Basics', icon: '🎯', xp: XP.LESSON,
    introLines: [
      "A pointer stores a memory address instead of a value.",
      "int* p = &x; — & gets the address of x. *p dereferences the pointer to get the value.",
      "Pointers are central to how C++ manages memory directly.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does & do in front of a variable?", options: [
        "Gets that variable's memory address", "Multiplies it", "Compares it", "Deletes it" ], answer: 0 },
      { type: 'mcq', prompt: "What does *p do when p is a pointer?", options: [
        "Dereferences p to get the value it points to", "Multiplies p", "Deletes p", "Compares p" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A pointer variable stores a memory address, not the value itself.", answer: true },
      { type: 'truefalse', prompt: "int* p = &x; makes p point to the address of x.", answer: true },
      { type: 'match', prompt: "Match each symbol to its meaning.", pairs: [
        ["&x", "The address of x"], ["*p", "The value p points to"],
      ] },
      { type: 'code', prompt: "int x = 5; int* p = &x; Cout *p.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    int* p = &x;\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['*p'] },
    ],
  },
  x7l2: {
    id: 'x7l2', unit: 'x7', title: 'References', icon: '🎯', xp: XP.LESSON,
    introLines: [
      "A reference is an alias for another variable: int& ref = x;",
      "Unlike a pointer, a reference can't be null and can't be reseated after creation.",
      "References are often used for function parameters to avoid copying.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a reference in C++?", options: [
        "An alias for another variable", "A memory address you must dereference", "A type of loop", "A comment" ], answer: 0 },
      { type: 'mcq', prompt: "How is a reference different from a pointer?", options: [
        "It can't be null and can't be reseated to refer to something else", "It's always faster", "It can only refer to numbers", "There's no difference" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Changing a reference's value changes the original variable it refers to.", answer: true },
      { type: 'truefalse', prompt: "References are commonly used as function parameters to avoid copying large values.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["int& ref = x;", "Creates a reference (alias) for x"], ["ref = 10;", "Changes x's value through the reference"],
      ] },
      { type: 'code', prompt: "int x = 5; int& ref = x; Set ref = 10; and cout x.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    int& ref = x;\n    // your code here\n    return 0;\n}",
        expected: "10", mustContain: ['int&'] },
    ],
  },
  x7l3: {
    id: 'x7l3', unit: 'x7', title: 'Pointers & Arrays', icon: '🎯', xp: XP.LESSON,
    introLines: [
      "An array's name decays into a pointer to its first element.",
      "arr[i] is really shorthand for *(arr + i).",
      "This is why C-style arrays and pointers are so closely linked in C++.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does an array's name 'decay into'?", options: [
        "A pointer to its first element", "A copy of the whole array", "A string", "Nothing — arrays aren't related to pointers" ], answer: 0 },
      { type: 'mcq', prompt: "What is arr[i] shorthand for?", options: [ "*(arr + i)", "&arr + i", "arr * i", "arr.get(i)" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Pointer arithmetic like arr + 1 moves to the next element, not the next byte.", answer: true },
      { type: 'truefalse', prompt: "arr[0] and *arr refer to the same value.", answer: true },
      { type: 'match', prompt: "Match each expression to its meaning.", pairs: [
        ["*(arr + 1)", "Same as arr[1]"], ["arr", "Decays to a pointer to arr[0]"],
      ] },
      { type: 'code', prompt: "int nums[] = {10, 20, 30}; Cout *(nums + 1).",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int nums[] = {10, 20, 30};\n    // your code here\n    return 0;\n}",
        expected: "20", mustContain: ['nums + 1'] },
    ],
  },
  x7quiz: {
    id: 'x7quiz', unit: 'x7', title: 'Unit 7 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Pointers & References.", "Pointers, references, and pointer/array links.", "This one wraps up CPA-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does a pointer store?", options: [ "A memory address", "A copy of a value", "A function name", "A comment" ], answer: 0 },
      { type: 'mcq', prompt: "What does & do in front of a variable?", options: [ "Gets its address", "Dereferences it", "Deletes it", "Compares it" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Can a reference be reseated to refer to a different variable after creation?", options: [ "No", "Yes, always", "Only for arrays", "Only for pointers" ], answer: 0 },
      { type: 'truefalse', prompt: "*p dereferences pointer p to access the value it points to.", answer: true },
      { type: 'truefalse', hard: true, prompt: "arr[i] and *(arr + i) are equivalent in C++.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A reference must be initialized when it's declared.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["Pointer", "Stores a memory address"], ["Reference", "An alias, can't be null"], ["*p", "Dereferences a pointer"],
      ] },
      { type: 'code', prompt: "int x = 7; int* p = &x; Cout *p.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 7;\n    int* p = &x;\n    // your code here\n    return 0;\n}",
        expected: "7", mustContain: ['*p'] },
    ],
  },

  // UNIT 8 — OOP Foundations
  x8l1: {
    id: 'x8l1', unit: 'x8', title: 'Classes & Objects', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "A class is a blueprint; an object is something built from it.",
      "class Dog { }; then Dog fido; creates an actual Dog object.",
      "Every object made from the same class shares its structure, but can hold different data.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a class?", options: [ "A blueprint for creating objects", "A single object", "A type of loop", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>Dog fido;</code> do, given class Dog?", options: [ "Creates a new Dog object named fido", "Defines the Dog class", "Deletes the Dog class", "Prints the word Dog" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Multiple objects can be created from the same class.", answer: true },
      { type: 'truefalse', prompt: "A class definition in C++ ends with a semicolon.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["class Dog {};", "Defines the blueprint"], ["Dog fido;", "Creates an object from the blueprint"],
      ] },
      { type: 'code', prompt: "Define an empty class Dog. In main, create Dog fido; and cout <code>ok</code> to confirm it compiles.",
        starter: "#include <iostream>\nusing namespace std;\n\n// your code here\n\nint main() {\n    Dog fido;\n    cout << \"ok\";\n    return 0;\n}",
        expected: "ok", mustContain: ['class Dog'] },
    ],
  },
  x8l2: {
    id: 'x8l2', unit: 'x8', title: 'Constructors & Destructors', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "A constructor runs automatically when you create an object, setting up its starting data.",
      "class Dog { public: string name; Dog(string n) { name = n; } };",
      "A destructor (~Dog()) runs automatically when an object is destroyed — great for cleanup.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "When does a constructor run?", options: [
        "Automatically, every time a new object is created", "Only when called by name", "Never automatically", "Once per program" ], answer: 0 },
      { type: 'mcq', prompt: "What does a destructor (~Dog()) do?", options: [
        "Runs automatically when the object is destroyed, for cleanup", "Creates a new object", "Runs before the constructor", "Nothing — C++ has no destructors" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A constructor's name must match its class's name exactly.", answer: true },
      { type: 'truefalse', prompt: "A destructor's name is the class name prefixed with ~.", answer: true },
      { type: 'match', prompt: "Match each snippet to its role.", pairs: [
        ["Dog(string n) {...}", "The constructor"], ["~Dog() {...}", "The destructor"],
      ] },
      { type: 'code', prompt: "Define class Dog with a constructor Dog(string n) storing name = n; (public string name;). In main, create Dog fido(\"Fido\"); and cout fido.name.",
        starter: "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Dog {\npublic:\n    // your code here\n};\n\nint main() {\n    Dog fido(\"Fido\");\n    cout << fido.name;\n    return 0;\n}",
        expected: "Fido", mustContain: ['Dog(string n)'] },
    ],
  },
  x8l3: {
    id: 'x8l3', unit: 'x8', title: 'Access Modifiers', icon: '🏗️', xp: XP.LESSON,
    introLines: [
      "private hides a member from outside the class entirely.",
      "public makes it accessible from anywhere.",
      "By default, class members are private — unlike struct, where they default to public.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's the default access level for class members in C++ if unspecified?", options: [
        "private", "public", "protected", "There is no default" ], answer: 0 },
      { type: 'mcq', prompt: "What's the default access level for struct members?", options: [ "public", "private", "protected", "There is no default" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "private members can't be accessed from outside their class.", answer: true },
      { type: 'truefalse', prompt: "A common pattern is private fields with public getter/setter methods.", answer: true },
      { type: 'match', prompt: "Match each modifier to its access level.", pairs: [
        ["private", "Only within its own class"], ["public", "Accessible from anywhere"],
      ] },
      { type: 'code', prompt: "Define class Account with private int balance = 100; and public int getBalance() returning it. Cout Account().getBalance().",
        starter: "#include <iostream>\nusing namespace std;\n\nclass Account {\nprivate:\n    // your code here\npublic:\n    int getBalance() {\n        return balance;\n    }\n};\n\nint main() {\n    cout << Account().getBalance();\n    return 0;\n}",
        expected: "100", mustContain: ['int balance'] },
    ],
  },
  x8quiz: {
    id: 'x8quiz', unit: 'x8', title: 'Unit 8 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — OOP Foundations.", "Classes, constructors/destructors, access modifiers.", "This unit kicks off CPP-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does a class define?", options: [ "A blueprint for creating objects", "A single fixed value", "A type of loop", "A file format" ], answer: 0 },
      { type: 'mcq', prompt: "What's the default access level for class members?", options: [ "private", "public", "protected", "None" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "When does a destructor run?", options: [ "When the object is destroyed", "When the object is created", "Never automatically", "Only if called by name" ], answer: 0 },
      { type: 'truefalse', prompt: "A constructor's name must exactly match its class's name.", answer: true },
      { type: 'truefalse', hard: true, prompt: "struct members default to public access.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Multiple distinct objects can be created from the same class.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Class", "Blueprint"], ["Constructor", "Runs on object creation"], ["Destructor", "Runs on object destruction"],
      ] },
      { type: 'code', prompt: "Define class Cat with a constructor Cat(string n) storing public string name = n. In main, Cat c(\"Milo\"); cout c.name.",
        starter: "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Cat {\npublic:\n    // your code here\n};\n\nint main() {\n    Cat c(\"Milo\");\n    cout << c.name;\n    return 0;\n}",
        expected: "Milo", mustContain: ['Cat(string n)'] },
    ],
  },

  // UNIT 9 — Inheritance & Polymorphism
  x9l1: {
    id: 'x9l1', unit: 'x9', title: 'Inheritance Basics', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "A class can inherit from another using a colon: class Dog : public Animal { ... };",
      "Dog gets everything Animal has, plus anything new you add.",
      "public inheritance is by far the most common form you'll use.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>class Dog : public Animal {};</code> mean?", options: [ "Dog inherits from Animal", "Dog replaces Animal", "Animal inherits from Dog", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What's the most commonly used form of inheritance in C++?", options: [ "public inheritance", "private inheritance", "protected inheritance", "There's only one form" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A subclass automatically has access to its parent class's public members.", answer: true },
      { type: 'truefalse', prompt: "Inheritance lets a class reuse code from a parent class instead of duplicating it.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        [": public Animal", "Inherits publicly from Animal"], ["Parent class", "The class being inherited from"],
      ] },
      { type: 'code', prompt: "Define class Animal with public string name; Define class Dog : public Animal {}; In main, Dog d; d.name = \"Fido\"; cout d.name.",
        starter: "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Animal {\npublic:\n    string name;\n};\n\n// your code here\n\nint main() {\n    Dog d;\n    d.name = \"Fido\";\n    cout << d.name;\n    return 0;\n}",
        expected: "Fido", mustContain: ['class Dog : public Animal'] },
    ],
  },
  x9l2: {
    id: 'x9l2', unit: 'x9', title: 'Virtual Functions & Overriding', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "Marking a base class method virtual enables runtime polymorphism.",
      "A subclass can then override it to provide its own behavior.",
      "Without virtual, calling through a base pointer always runs the base's version — even on a subclass object.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does marking a method virtual enable?", options: [
        "A subclass's override to run instead of the base version, even through a base pointer", "Faster execution always", "Automatic memory management", "Nothing different" ], answer: 0 },
      { type: 'mcq', prompt: "What does the override keyword do?", options: [
        "Lets the compiler verify you're actually overriding a virtual method", "Makes a method private", "Deletes the base method", "It's required for all methods" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Without virtual, calling a method through a base class pointer always runs the base's version.", answer: true },
      { type: 'truefalse', prompt: "override is optional but helps catch mistakes at compile time.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["virtual", "Enables runtime polymorphism"], ["override", "Marks an overriding method, checked by the compiler"],
      ] },
      { type: 'code', prompt: "Define class Animal with virtual void speak() printing \"...\". Define Dog : public Animal overriding speak() to print <code>Woof</code>. Call speak() through an Animal* pointing to a Dog.",
        starter: "#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n    virtual void speak() {\n        cout << \"...\";\n    }\n};\n\n// your code here\n\nint main() {\n    Animal* a = new Dog();\n    a->speak();\n    return 0;\n}",
        expected: "Woof", mustContain: ['override'] },
    ],
  },
  x9l3: {
    id: 'x9l3', unit: 'x9', title: 'Abstract Classes', icon: '🧬', xp: XP.LESSON,
    introLines: [
      "A pure virtual function (`virtual void f() = 0;`) has no body — it makes the class abstract.",
      "An abstract class can't be instantiated directly; it's meant to be extended.",
      "Subclasses must implement every pure virtual function to become concrete.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>virtual void area() = 0;</code> declare?", options: [
        "A pure virtual function, making the class abstract", "A regular method with an empty body", "A static method", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "Can you create an object directly from an abstract class?", options: [ "No", "Yes, always", "Only with new", "Only if it has fields" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A subclass must implement all pure virtual functions to be instantiable.", answer: true },
      { type: 'truefalse', prompt: "Abstract classes in C++ are created using pure virtual functions.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Pure virtual function", "= 0; no body, must be overridden"], ["Abstract class", "Can't be instantiated directly"],
      ] },
      { type: 'code', prompt: "Define abstract class Shape with pure virtual double area(). Define class Square : public Shape with area() returning 4.0. Cout Square().area().",
        starter: "#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n    // your code here\n};\n\n// define Square here\n\nint main() {\n    cout << Square().area();\n    return 0;\n}",
        expected: "4", mustContain: ['= 0'] },
    ],
  },
  x9quiz: {
    id: 'x9quiz', unit: 'x9', title: 'Unit 9 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Inheritance & Polymorphism.", "Inheritance, virtual functions, abstract classes.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does : public Animal do in a class declaration?", options: [ "Inherits publicly from Animal", "Deletes Animal", "Creates an interface", "Overloads a method" ], answer: 0 },
      { type: 'mcq', prompt: "What does virtual enable?", options: [ "Runtime polymorphism through base pointers", "Faster compilation", "Automatic memory cleanup", "Nothing" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What makes a class abstract in C++?", options: [ "Having at least one pure virtual function", "Having a destructor", "Being named Abstract", "Having no constructor" ], answer: 0 },
      { type: 'truefalse', prompt: "A subclass can override a virtual method it inherited from its parent.", answer: true },
      { type: 'truefalse', hard: true, prompt: "An abstract class can be instantiated directly with new.", answer: false },
      { type: 'truefalse', hard: true, prompt: "override helps the compiler catch mistakes when overriding a virtual method.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["virtual", "Enables polymorphism"], ["override", "Marks an overriding method"], ["= 0", "Makes a method pure virtual"],
      ] },
      { type: 'code', prompt: "Define class Animal with virtual void speak() printing \"...\". Define Cat : public Animal overriding speak() to print <code>Meow</code>. Call speak() through an Animal* pointing to a Cat.",
        starter: "#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n    virtual void speak() {\n        cout << \"...\";\n    }\n};\n\n// your code here\n\nint main() {\n    Animal* a = new Cat();\n    a->speak();\n    return 0;\n}",
        expected: "Meow", mustContain: ['override'] },
    ],
  },

  // UNIT 10 — Memory Management
  x10l1: {
    id: 'x10l1', unit: 'x10', title: 'Dynamic Memory (new/delete)', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "new allocates memory on the heap that lasts until you explicitly free it.",
      "int* p = new int(5); creates a heap int holding 5. delete p; frees it.",
      "Forgetting delete causes a memory leak — memory that's never given back.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>new int(5)</code> do?", options: [
        "Allocates a new int on the heap, initialized to 5", "Deletes an int", "Creates a stack variable only", "Compares two ints" ], answer: 0 },
      { type: 'mcq', prompt: "What does delete p; do?", options: [ "Frees the heap memory p points to", "Deletes the pointer variable itself", "Sets p to 0 automatically", "Nothing" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Forgetting to delete heap-allocated memory causes a memory leak.", answer: true },
      { type: 'truefalse', prompt: "Memory allocated with new persists until explicitly deleted.", answer: true },
      { type: 'match', prompt: "Match each keyword to its purpose.", pairs: [
        ["new", "Allocates heap memory"], ["delete", "Frees heap memory"],
      ] },
      { type: 'code', prompt: "int* p = new int(5); Cout *p, then delete p;.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int* p = new int(5);\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['delete p'] },
    ],
  },
  x10l2: {
    id: 'x10l2', unit: 'x10', title: 'Smart Pointers', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "unique_ptr automatically deletes its memory when it goes out of scope — no manual delete needed.",
      "make_unique<int>(5) creates one, initialized to 5.",
      "Smart pointers are the modern, safer alternative to raw new/delete.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does unique_ptr do automatically?", options: [
        "Deletes its memory when it goes out of scope", "Nothing — you must still call delete", "Shares ownership with copies", "Only works with arrays" ], answer: 0 },
      { type: 'mcq', prompt: "What does make_unique<int>(5) create?", options: [
        "A unique_ptr<int> managing a heap int initialized to 5", "A raw pointer needing manual delete", "A reference to 5", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "unique_ptr helps avoid memory leaks by managing cleanup automatically.", answer: true },
      { type: 'truefalse', prompt: "You need `#include <memory>` to use unique_ptr.", answer: true },
      { type: 'match', prompt: "Match each concept to its role.", pairs: [
        ["unique_ptr", "Auto-deletes when out of scope"], ["make_unique<T>(args)", "Creates one, initialized"],
      ] },
      { type: 'code', prompt: "unique_ptr&lt;int&gt; p = make_unique&lt;int&gt;(5); Cout *p.",
        starter: "#include <iostream>\n#include <memory>\nusing namespace std;\n\nint main() {\n    unique_ptr<int> p = make_unique<int>(5);\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['*p'] },
    ],
  },
  x10l3: {
    id: 'x10l3', unit: 'x10', title: 'Common Memory Pitfalls', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "A memory leak happens when heap memory is never freed.",
      "A dangling pointer points to memory that's already been freed — using it is undefined behavior.",
      "Smart pointers (unique_ptr, shared_ptr) exist specifically to avoid both of these.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a memory leak?", options: [
        "Heap memory that's allocated but never freed", "A crash on startup", "A syntax error", "Deleting memory twice" ], answer: 0 },
      { type: 'mcq', prompt: "What is a dangling pointer?", options: [
        "A pointer to memory that's already been freed", "A pointer that's never been assigned", "A pointer to a string", "A null pointer" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Using a dangling pointer is undefined behavior — it can crash or corrupt data unpredictably.", answer: true },
      { type: 'truefalse', prompt: "Smart pointers like unique_ptr help prevent both memory leaks and dangling pointers.", answer: true },
      { type: 'match', prompt: "Match each pitfall to its description.", pairs: [
        ["Memory leak", "Allocated memory that's never freed"], ["Dangling pointer", "Points to already-freed memory"],
      ] },
      { type: 'code', prompt: "This is conceptual — just cout <code>noted</code> to confirm you read the lesson.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "noted", mustContain: ['cout'] },
    ],
  },
  x10quiz: {
    id: 'x10quiz', unit: 'x10', title: 'Unit 10 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Memory Management.", "new/delete, smart pointers, common pitfalls.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does new allocate memory on?", options: [ "The heap", "The stack only", "Nowhere — it's not real memory", "The CPU cache" ], answer: 0 },
      { type: 'mcq', prompt: "What does unique_ptr do when it goes out of scope?", options: [ "Automatically frees its memory", "Nothing — you must delete manually", "Crashes the program", "Leaks the memory" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What's a dangling pointer?", options: [ "A pointer to already-freed memory", "A null pointer", "A pointer to a function", "A pointer that's too large" ], answer: 0 },
      { type: 'truefalse', prompt: "Forgetting delete on heap memory causes a memory leak.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Smart pointers are considered safer than raw new/delete in modern C++.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Using a dangling pointer is always safe.", answer: false },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["new", "Allocates heap memory"], ["delete", "Frees heap memory"], ["unique_ptr", "Auto-manages cleanup"],
      ] },
      { type: 'code', prompt: "int* p = new int(9); Cout *p, then delete p;.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int* p = new int(9);\n    // your code here\n    return 0;\n}",
        expected: "9", mustContain: ['delete p'] },
    ],
  },

  // UNIT 11 — Operator Overloading & Templates
  x11l1: {
    id: 'x11l1', unit: 'x11', title: 'Operator Overloading', icon: '🔧', xp: XP.LESSON,
    introLines: [
      "You can define what + means for your own class by overloading operator+.",
      "This lets objects of your class work naturally with familiar operators.",
      "Use it sparingly — only when the operator's meaning is genuinely intuitive.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does overloading operator+ on a class let you do?", options: [
        "Use the + operator directly between objects of that class", "Add new methods at runtime", "Delete an object", "Multiply two objects" ], answer: 0 },
      { type: 'mcq', prompt: "When is operator overloading a good idea?", options: [
        "When the operator's meaning is genuinely intuitive for the type", "Always, for every class", "Never — it's forbidden in C++", "Only for numbers" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Operator overloading lets built-in operators like + work with custom types.", answer: true },
      { type: 'truefalse', prompt: "operator+ is defined as a method (or function) named operator+.", answer: true },
      { type: 'match', prompt: "Match each snippet to its role.", pairs: [
        ["operator+", "Overloads the + operator"], ["Vec a + Vec b", "Uses the overloaded operator"],
      ] },
      { type: 'code', prompt: "Define class Vec with int x; and a constructor Vec(int x). Overload operator+ to return Vec(x + other.x). Cout (Vec(2) + Vec(3)).x.",
        starter: "#include <iostream>\nusing namespace std;\n\nclass Vec {\npublic:\n    int x;\n    Vec(int x) : x(x) {}\n    // your code here\n};\n\nint main() {\n    cout << (Vec(2) + Vec(3)).x;\n    return 0;\n}",
        expected: "5", mustContain: ['operator+'] },
    ],
  },
  x11l2: {
    id: 'x11l2', unit: 'x11', title: 'Function Templates', icon: '🔧', xp: XP.LESSON,
    introLines: [
      "A function template works with any type: template<typename T> T myMax(T a, T b)",
      "The compiler generates a specific version for whatever type you actually use.",
      "This avoids writing the same logic once per type.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>template&lt;typename T&gt;</code> let a function do?", options: [
        "Work generically with any type T", "Only work with integers", "Run faster", "Skip compilation" ], answer: 0 },
      { type: 'mcq', prompt: "When is the actual code for a function template generated?", options: [
        "At compile time, for each type it's actually used with", "At runtime, once", "Never — templates aren't compiled", "Only for int" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Function templates avoid writing near-identical code for each type.", answer: true },
      { type: 'truefalse', prompt: "T in a template is a placeholder for a type, filled in when the template is used.", answer: true },
      { type: 'match', prompt: "Match each concept to its meaning.", pairs: [
        ["template<typename T>", "Declares a generic type parameter"], ["myMax<int>(1, 2)", "Uses the template with int"],
      ] },
      { type: 'code', prompt: "Define template&lt;typename T&gt; T myMax(T a, T b) returning the larger of a and b. Cout myMax(3, 7).",
        starter: "#include <iostream>\nusing namespace std;\n\n// your code here\n\nint main() {\n    cout << myMax(3, 7);\n    return 0;\n}",
        expected: "7", mustContain: ['template'] },
    ],
  },
  x11l3: {
    id: 'x11l3', unit: 'x11', title: 'Class Templates', icon: '🔧', xp: XP.LESSON,
    introLines: [
      "A class can be generic too: template<typename T> class Box { T value; };",
      "Box<int> and Box<string> both come from the same template, specialized per type.",
      "The STL's vector, map, and friends are all built this way.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>template&lt;typename T&gt; class Box { T value; };</code> define?", options: [
        "A generic Box class that can hold any type T", "A Box that only holds integers", "A function", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What are vector and map built with?", options: [ "Class templates", "Only raw pointers", "Only macros", "Nothing — they're built into the language directly" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Box<int> and Box<string> can both be generated from the same class template.", answer: true },
      { type: 'truefalse', prompt: "Class templates let you write one generic class instead of one per type.", answer: true },
      { type: 'match', prompt: "Match each concept to its meaning.", pairs: [
        ["template<typename T> class Box", "A generic class"], ["Box<int>", "A specific specialization for int"],
      ] },
      { type: 'code', prompt: "Define template&lt;typename T&gt; class Box with T value; and a constructor Box(T v). Create Box&lt;int&gt; b(5); and cout b.value.",
        starter: "#include <iostream>\nusing namespace std;\n\n// your code here\n\nint main() {\n    Box<int> b(5);\n    cout << b.value;\n    return 0;\n}",
        expected: "5", mustContain: ['template'] },
    ],
  },
  x11quiz: {
    id: 'x11quiz', unit: 'x11', title: 'Unit 11 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Operator Overloading & Templates.", "operator+, function templates, class templates.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does overloading operator+ let you do?", options: [ "Use + between objects of your class", "Delete an object", "Create a template", "Override a virtual method" ], answer: 0 },
      { type: 'mcq', prompt: "What does template<typename T> declare?", options: [ "A generic type parameter T", "A specific int type", "A macro", "A namespace" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "When is a template's actual code generated?", options: [ "At compile time, per type used", "At runtime", "Never", "Only once, for all types" ], answer: 0 },
      { type: 'truefalse', prompt: "Class templates let vector and map work with any element type.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Operator overloading should be used only when the operator's meaning stays intuitive.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A function template must be rewritten separately for every type it's used with.", answer: false },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["operator+", "Overloads the + operator"], ["template<typename T>", "Generic type parameter"], ["Box<int>", "A specific template specialization"],
      ] },
      { type: 'code', prompt: "Define template&lt;typename T&gt; T myMin(T a, T b) returning the smaller value. Cout myMin(9, 4).",
        starter: "#include <iostream>\nusing namespace std;\n\n// your code here\n\nint main() {\n    cout << myMin(9, 4);\n    return 0;\n}",
        expected: "4", mustContain: ['template'] },
    ],
  },

  // UNIT 12 — STL Containers
  x12l1: {
    id: 'x12l1', unit: 'x12', title: 'Vectors', icon: '🗃️', xp: XP.LESSON,
    introLines: [
      "vector<int> nums = {1, 2, 3}; is a resizable, ordered collection — the workhorse STL container.",
      "nums.push_back(4); adds to the end; nums[0] reads by position.",
      "Unlike C-style arrays, vectors know their own size: nums.size()",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does nums.push_back(4) do to a vector?", options: [ "Adds 4 to the end", "Removes the first item", "Sorts the vector", "Deletes the vector" ], answer: 0 },
      { type: 'mcq', prompt: "What does nums.size() return?", options: [ "The number of elements in the vector", "The memory address", "The first element", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Unlike C-style arrays, a vector can grow and shrink dynamically.", answer: true },
      { type: 'truefalse', prompt: "You need `#include <vector>` to use vector.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["push_back(x)", "Adds x to the end"], ["size()", "Number of elements"],
      ] },
      { type: 'code', prompt: "vector&lt;int&gt; nums = {1, 2, 3}; Cout nums.size().",
        starter: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {1, 2, 3};\n    // your code here\n    return 0;\n}",
        expected: "3", mustContain: ['.size('] },
    ],
  },
  x12l2: {
    id: 'x12l2', unit: 'x12', title: 'Maps & Sets', icon: '🗃️', xp: XP.LESSON,
    introLines: [
      "A map<string, int> stores key-value pairs: scores[\"ana\"] = 90;",
      "A set<int> holds unique values — no duplicates allowed.",
      "Both are ordered by key/value automatically in the standard map/set.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does map<string, int> store?", options: [ "Key-value pairs, with String keys and int values", "Only numbers", "Only unique values with no keys", "A fixed-size array" ], answer: 0 },
      { type: 'mcq', prompt: "What does a set guarantee?", options: [ "No duplicate values", "Sorted insertion order preserved exactly", "Only numbers allowed", "Fixed size" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "scores[\"ana\"] = 90; both adds and updates the key \"ana\" in a map.", answer: true },
      { type: 'truefalse', prompt: "You need `#include <map>` and `#include <set>` to use them.", answer: true },
      { type: 'match', prompt: "Match each container to what it stores.", pairs: [
        ["map", "Key-value pairs"], ["set", "Unique values, no duplicates"],
      ] },
      { type: 'code', prompt: "map&lt;string, int&gt; scores; scores[\"ana\"] = 90; Cout scores[\"ana\"].",
        starter: "#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    map<string, int> scores;\n    // your code here\n    return 0;\n}",
        expected: "90", mustContain: ['scores["ana"]'] },
    ],
  },
  x12l3: {
    id: 'x12l3', unit: 'x12', title: 'Iterators', icon: '🗃️', xp: XP.LESSON,
    introLines: [
      "A for-each loop is the cleanest way to visit every item in a vector, set, or map.",
      "for (int n : nums) { ... } reads as 'for each n in nums'.",
      "Under the hood, this uses iterators — objects that know how to walk through a container.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>for (int n : nums)</code> do?", options: [
        "Visits each value in nums directly, one at a time", "Runs exactly once", "Only works with arrays", "Deletes nums" ], answer: 0 },
      { type: 'mcq', prompt: "What powers a for-each loop under the hood?", options: [ "Iterators", "Pointers only", "Templates only", "Nothing — it's pure syntax with no mechanism" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "For-each loops work on vectors, sets, and maps alike.", answer: true },
      { type: 'truefalse', prompt: "for-each reads as 'for each item in the container'.", answer: true },
      { type: 'match', prompt: "Match each loop to what it does.", pairs: [
        ["for (int n : nums)", "Visits each value directly"], ["for (int i = 0; i < n; i++)", "Visits by index"],
      ] },
      { type: 'code', prompt: "vector&lt;int&gt; nums = {1, 2, 3}; Use for-each to cout each on its own line.",
        starter: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {1, 2, 3};\n    // your code here\n    return 0;\n}",
        expected: "1\n2\n3", mustContain: ['for ('] },
    ],
  },
  x12quiz: {
    id: 'x12quiz', unit: 'x12', title: 'Unit 12 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — STL Containers.", "vector, map, set, and iteration.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does push_back do on a vector?", options: [ "Adds an item to the end", "Removes an item", "Sorts the vector", "Deletes the vector" ], answer: 0 },
      { type: 'mcq', prompt: "Which container stores key-value pairs?", options: [ "map", "vector", "set", "array" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Which container guarantees no duplicates?", options: [ "set", "vector", "map", "array" ], answer: 0 },
      { type: 'truefalse', prompt: "Vectors can grow and shrink dynamically, unlike C-style arrays.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A for-each loop works on vectors, sets, and maps.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Map keys must be unique, but values don't have to be.", answer: true },
      { type: 'match', prompt: "Match each container to its syntax hint.", pairs: [
        ["vector", "vector<int>"], ["map", "map<string,int>"], ["set", "set<int>"],
      ] },
      { type: 'code', prompt: "vector&lt;int&gt; nums = {4, 5}; Cout nums.size().",
        starter: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {4, 5};\n    // your code here\n    return 0;\n}",
        expected: "2", mustContain: ['.size('] },
    ],
  },

  // UNIT 13 — STL Algorithms & Lambdas
  x13l1: {
    id: 'x13l1', unit: 'x13', title: 'Common Algorithms', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "<algorithm> provides ready-made tools like sort() and find().",
      "sort(nums.begin(), nums.end()); sorts a vector in place.",
      "These work through iterators, so they apply across many different containers.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>sort(nums.begin(), nums.end())</code> do?", options: [
        "Sorts the vector in place, ascending by default", "Reverses the vector", "Copies the vector", "Deletes duplicates" ], answer: 0 },
      { type: 'mcq', prompt: "What do nums.begin() and nums.end() represent?", options: [
        "Iterators marking the start and one-past-the-end of the range", "The first and last values", "The vector's size", "Nothing meaningful" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "sort() modifies the container in place by default.", answer: true },
      { type: 'truefalse', prompt: "You need `#include <algorithm>` to use sort() and find().", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["sort(begin, end)", "Sorts the range"], ["find(begin, end, x)", "Finds x in the range"],
      ] },
      { type: 'code', prompt: "vector&lt;int&gt; nums = {3, 1, 2}; Sort with sort(nums.begin(), nums.end()); then cout each with a space using for-each.",
        starter: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {3, 1, 2};\n    // your code here\n    return 0;\n}",
        expected: "1 2 3", mustContain: ['sort('] },
    ],
  },
  x13l2: {
    id: 'x13l2', unit: 'x13', title: 'Lambda Expressions', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "A lambda is a compact, inline, unnamed function: [](int a, int b) { return a + b; }",
      "The [] is the capture list — it controls which outside variables the lambda can use.",
      "Lambdas are commonly passed to algorithms like sort() for custom comparisons.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>[](int a, int b) { return a + b; }</code> represent?", options: [
        "A lambda expression — a compact anonymous function", "A comment", "An array", "A macro" ], answer: 0 },
      { type: 'mcq', prompt: "What does the [] at the start of a lambda control?", options: [
        "Which outside variables the lambda captures", "The lambda's return type", "The lambda's name", "Nothing — it's required decoration" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Lambdas are often passed directly to algorithms like sort() for custom behavior.", answer: true },
      { type: 'truefalse', prompt: "auto is commonly used to store a lambda in a variable.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it is.", pairs: [
        ["[](int a, int b) { return a + b; }", "A lambda expression"], ["[]", "The capture list"],
      ] },
      { type: 'code', prompt: "Define auto add = [](int a, int b) { return a + b; }; Cout add(2, 3).",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['[]'] },
    ],
  },
  x13l3: {
    id: 'x13l3', unit: 'x13', title: 'Function Objects', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "A function object (functor) is a class that overloads operator() so its objects act like functions.",
      "Lambdas are actually syntactic sugar over exactly this idea.",
      "Functors can hold their own state between calls, unlike a plain function.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a function object (functor)?", options: [
        "A class whose objects can be called like a function via operator()", "A regular function pointer only", "A lambda that captures nothing", "A macro" ], answer: 0 },
      { type: 'mcq', prompt: "What relationship do lambdas have to functors?", options: [
        "Lambdas are essentially syntactic sugar for a compiler-generated functor", "They're completely unrelated", "Lambdas replaced functors entirely; functors don't compile anymore", "Functors are faster but incompatible" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A functor can hold internal state across multiple calls, unlike a plain function.", answer: true },
      { type: 'truefalse', prompt: "operator() is the method a functor overloads to act like a function call.", answer: true },
      { type: 'match', prompt: "Match each concept to its meaning.", pairs: [
        ["Functor", "An object that can be called like a function"], ["operator()", "The call operator being overloaded"],
      ] },
      { type: 'code', prompt: "Define class Adder with int operator()(int a, int b) returning a + b. Create Adder add; and cout add(2, 3).",
        starter: "#include <iostream>\nusing namespace std;\n\nclass Adder {\npublic:\n    // your code here\n};\n\nint main() {\n    Adder add;\n    cout << add(2, 3);\n    return 0;\n}",
        expected: "5", mustContain: ['operator()'] },
    ],
  },
  x13quiz: {
    id: 'x13quiz', unit: 'x13', title: 'Unit 13 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — STL Algorithms & Lambdas.", "sort/find, lambdas, function objects.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does sort(nums.begin(), nums.end()) do?", options: [ "Sorts nums in place", "Reverses nums", "Deletes duplicates", "Copies nums" ], answer: 0 },
      { type: 'mcq', prompt: "What is a lambda expression?", options: [ "A compact anonymous function", "A type of loop", "A compile error", "A class declaration" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does a functor overload to act like a function?", options: [ "operator()", "operator+", "operator[]", "operator=" ], answer: 0 },
      { type: 'truefalse', prompt: "Lambdas are commonly passed to algorithms for custom behavior.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A functor can maintain internal state between calls.", answer: true },
      { type: 'truefalse', hard: true, prompt: "sort() requires the <algorithm> header.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["sort", "Sorts a range in place"], ["Lambda", "Compact anonymous function"], ["Functor", "Callable object via operator()"],
      ] },
      { type: 'code', prompt: "Define auto mul = [](int a, int b) { return a * b; }; Cout mul(3, 4).",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "12", mustContain: ['[]'] },
    ],
  },

  // UNIT 14 — Exception Handling & Modern C++
  x14l1: {
    id: 'x14l1', unit: 'x14', title: 'try/catch/throw', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "Sometimes code fails at runtime — C++ lets you signal that with throw.",
      "try { risky(); } catch (exception& e) { handle(e); } lets your program recover instead of crashing.",
      "throw can raise any value, but throwing objects derived from std::exception is the convention.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a try/catch block do?", options: [
        "Lets you handle a thrown exception instead of crashing the program", "Prevents all errors from happening", "Deletes the exception", "Only works with cout" ], answer: 0 },
      { type: 'mcq', prompt: "What's the convention for what to throw in C++?", options: [
        "Objects derived from std::exception", "Only raw integers", "Only strings", "Nothing — throw isn't used in C++" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "The catch block's parameter receives the thrown value.", answer: true },
      { type: 'truefalse', prompt: "If no exception is thrown, the catch block is skipped entirely.", answer: true },
      { type: 'match', prompt: "Match each block to its role.", pairs: [
        ["try", "The code that might fail"], ["catch", "Runs if an exception was thrown"],
      ] },
      { type: 'code', prompt: "Wrap <code>throw runtime_error(\"bad\");</code> in try/catch(exception&amp; e) that cout's <code>caught</code>.",
        starter: "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nint main() {\n    try {\n        throw runtime_error(\"bad\");\n    // your code here\n    return 0;\n}",
        expected: "caught", mustContain: ['catch'] },
    ],
  },
  x14l2: {
    id: 'x14l2', unit: 'x14', title: 'Custom Exceptions', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "You can define your own exception type by inheriting from std::exception (or runtime_error).",
      "Override what() to provide a custom message.",
      "class MyException : public runtime_error { public: MyException(string m) : runtime_error(m) {} };",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does overriding what() on a custom exception let you do?", options: [
        "Provide a custom description of the error", "Delete the exception", "Prevent it from being thrown", "Nothing — what() can't be overridden" ], answer: 0 },
      { type: 'mcq', prompt: "What does a custom exception typically inherit from?", options: [
        "std::exception or a class derived from it, like runtime_error", "int", "A raw pointer", "Nothing — inheritance isn't used for exceptions" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A custom exception class commonly forwards its message to the parent's constructor.", answer: true },
      { type: 'truefalse', prompt: "throw stops the current function unless the exception is caught somewhere.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["throw MyException(\"x\")", "Triggers a custom exception"], [": runtime_error(m)", "Forwards the message to the parent constructor"],
      ] },
      { type: 'code', prompt: "Define class MyException : public runtime_error with a constructor MyException(string m) : runtime_error(m) {}. Throw it inside try/catch(MyException&amp; e) that cout's <code>caught custom</code>.",
        starter: "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nclass MyException : public runtime_error {\npublic:\n    // your code here\n};\n\nint main() {\n    try {\n        throw MyException(\"oops\");\n    } catch (MyException& e) {\n        cout << \"caught custom\";\n    }\n    return 0;\n}",
        expected: "caught custom", mustContain: ['runtime_error(m)'] },
    ],
  },
  x14l3: {
    id: 'x14l3', unit: 'x14', title: 'RAII & Modern Practices', icon: '🧯', xp: XP.LESSON,
    introLines: [
      "RAII (Resource Acquisition Is Initialization) ties a resource's lifetime to an object's scope.",
      "A destructor automatically releases the resource — no manual cleanup calls needed.",
      "Smart pointers, file handles, and locks in modern C++ all lean on this pattern.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does RAII tie a resource's lifetime to?", options: [
        "An object's scope — cleanup happens automatically via its destructor", "The program's entire runtime", "Nothing — resources must always be freed manually", "The operating system's shutdown" ], answer: 0 },
      { type: 'mcq', prompt: "Which modern C++ feature is a direct application of RAII?", options: [
        "Smart pointers like unique_ptr", "Raw pointers", "goto statements", "Global variables" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "RAII means a resource is released automatically when its owning object goes out of scope.", answer: true },
      { type: 'truefalse', prompt: "RAII reduces the risk of forgetting to clean up a resource.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["RAII", "Ties resource lifetime to object scope"], ["unique_ptr", "A common RAII-based smart pointer"],
      ] },
      { type: 'code', prompt: "This is conceptual — just cout <code>noted</code> to confirm you read the lesson.",
        starter: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "noted", mustContain: ['cout'] },
    ],
  },
  x14quiz: {
    id: 'x14quiz', unit: 'x14', title: 'Unit 14 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Exception Handling & Modern C++.", "try/catch, custom exceptions, RAII.", "This is the final quiz on the roadmap to CPP." ],
    questions: [
      { type: 'mcq', prompt: "What does try/catch let a program do?", options: [ "Recover from a thrown exception", "Prevent exceptions from occurring", "Run faster", "Skip loops" ], answer: 0 },
      { type: 'mcq', prompt: "What do custom exceptions typically inherit from?", options: [ "std::exception (or a subclass like runtime_error)", "int", "A raw pointer", "Nothing" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does RAII tie a resource's lifetime to?", options: [ "An object's scope", "The whole program's runtime", "The OS scheduler", "Nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "catch receives the exception object that was thrown.", answer: true },
      { type: 'truefalse', hard: true, prompt: "unique_ptr is a practical example of the RAII pattern.", answer: true },
      { type: 'truefalse', hard: true, prompt: "RAII requires you to manually call a cleanup function every time.", answer: false },
      { type: 'match', prompt: "Match each concept to its purpose.", pairs: [
        ["try/catch", "Handles thrown exceptions"], ["RAII", "Automatic resource cleanup"], ["unique_ptr", "RAII-based smart pointer"],
      ] },
      { type: 'code', prompt: "Wrap <code>throw runtime_error(\"x\");</code> in try/catch(exception&amp; e) that cout's <code>done</code>.",
        starter: "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nint main() {\n    try {\n        throw runtime_error(\"x\");\n    // your code here\n    return 0;\n}",
        expected: "done", mustContain: ['catch'] },
    ],
  },
};

const CPP_STUB_LESSONS = {};

const CPP_UNITS = [
  { id: 'x1', tier: 'cpa', title: 'First Contact', icon: '👾', lessons: ['x1l1','x1l2','x1l3','x1quiz'] },
  { id: 'x2', tier: 'cpa', title: 'Operators & Expressions', icon: '⚡', lessons: ['x2l1','x2l2','x2l3','x2quiz'] },
  { id: 'x3', tier: 'cpa', title: 'Making Decisions', icon: '🔀', lessons: ['x3l1','x3l2','x3l3','x3quiz'] },
  { id: 'x4', tier: 'cpa', title: 'Loops', icon: '🔁', lessons: ['x4l1','x4l2','x4l3','x4quiz'] },
  { id: 'x5', tier: 'cpa', title: 'Arrays', icon: '📚', lessons: ['x5l1','x5l2','x5l3','x5quiz'] },
  { id: 'x6', tier: 'cpa', title: 'Functions', icon: '🧩', lessons: ['x6l1','x6l2','x6l3','x6quiz'] },
  { id: 'x7', tier: 'cpa', title: 'Pointers & References', icon: '🎯', lessons: ['x7l1','x7l2','x7l3','x7quiz'] },
  { id: 'x8', tier: 'cpp', title: 'OOP Foundations', icon: '🏗️', lessons: ['x8l1','x8l2','x8l3','x8quiz'] },
  { id: 'x9', tier: 'cpp', title: 'Inheritance & Polymorphism', icon: '🧬', lessons: ['x9l1','x9l2','x9l3','x9quiz'] },
  { id: 'x10', tier: 'cpp', title: 'Memory Management', icon: '🧠', lessons: ['x10l1','x10l2','x10l3','x10quiz'] },
  { id: 'x11', tier: 'cpp', title: 'Operator Overloading & Templates', icon: '🔧', lessons: ['x11l1','x11l2','x11l3','x11quiz'] },
  { id: 'x12', tier: 'cpp', title: 'STL Containers', icon: '🗃️', lessons: ['x12l1','x12l2','x12l3','x12quiz'] },
  { id: 'x13', tier: 'cpp', title: 'STL Algorithms & Lambdas', icon: '🧵', lessons: ['x13l1','x13l2','x13l3','x13quiz'] },
  { id: 'x14', tier: 'cpp', title: 'Exception Handling & Modern C++', icon: '🧯', lessons: ['x14l1','x14l2','x14l3','x14quiz'] },
];

const CPP_PREREQS = {
  x1l1: [], x1l2: ['x1l1'], x1l3: ['x1l2'], x1quiz: ['x1l3'],
  x2l1: ['x1quiz'], x2l2: ['x2l1'], x2l3: ['x2l2'], x2quiz: ['x2l3'],
  x3l1: ['x2quiz'], x3l2: ['x3l1'], x3l3: ['x3l2'], x3quiz: ['x3l3'],
  x4l1: ['x3quiz'], x4l2: ['x4l1'], x4l3: ['x4l2'], x4quiz: ['x4l3'],
  x5l1: ['x4quiz'], x5l2: ['x5l1'], x5l3: ['x5l2'], x5quiz: ['x5l3'],
  x6l1: ['x5quiz'], x6l2: ['x6l1'], x6l3: ['x6l2'], x6quiz: ['x6l3'],
  x7l1: ['x6quiz'], x7l2: ['x7l1'], x7l3: ['x7l2'], x7quiz: ['x7l3'],
  x8l1: ['x7quiz'], x8l2: ['x8l1'], x8l3: ['x8l2'], x8quiz: ['x8l3'],
  x9l1: ['x8quiz'], x9l2: ['x9l1'], x9l3: ['x9l2'], x9quiz: ['x9l3'],
  x10l1: ['x9quiz'], x10l2: ['x10l1'], x10l3: ['x10l2'], x10quiz: ['x10l3'],
  x11l1: ['x10quiz'], x11l2: ['x11l1'], x11l3: ['x11l2'], x11quiz: ['x11l3'],
  x12l1: ['x11quiz'], x12l2: ['x12l1'], x12l3: ['x12l2'], x12quiz: ['x12l3'],
  x13l1: ['x12quiz'], x13l2: ['x13l1'], x13l3: ['x13l2'], x13quiz: ['x13l3'],
  x14l1: ['x13quiz'], x14l2: ['x14l1'], x14l3: ['x14l2'], x14quiz: ['x14l3'],
};

const CPP_TREE_LAYOUT = {
  x1l1: { col: 0, row: 0 }, x1l2: { col: 0, row: 1 }, x1l3: { col: 0, row: 2 }, x1quiz: { col: 0, row: 3 },
  x2l1: { col: 0, row: 4 }, x2l2: { col: 0, row: 5 }, x2l3: { col: 0, row: 6 }, x2quiz: { col: 0, row: 7 },
  x3l1: { col: 0, row: 8 }, x3l2: { col: 0, row: 9 }, x3l3: { col: 0, row: 10 }, x3quiz: { col: 0, row: 11 },
  x4l1: { col: 0, row: 12 }, x4l2: { col: 0, row: 13 }, x4l3: { col: 0, row: 14 }, x4quiz: { col: 0, row: 15 },
  x5l1: { col: 0, row: 16 }, x5l2: { col: 0, row: 17 }, x5l3: { col: 0, row: 18 }, x5quiz: { col: 0, row: 19 },
  x6l1: { col: 0, row: 20 }, x6l2: { col: 0, row: 21 }, x6l3: { col: 0, row: 22 }, x6quiz: { col: 0, row: 23 },
  x7l1: { col: 0, row: 24 }, x7l2: { col: 0, row: 25 }, x7l3: { col: 0, row: 26 }, x7quiz: { col: 0, row: 27 },
  cp_cpa: { col: 0, row: 28 },
  x8l1: { col: 0, row: 29 }, x8l2: { col: 0, row: 30 }, x8l3: { col: 0, row: 31 }, x8quiz: { col: 0, row: 32 },
  x9l1: { col: 0, row: 33 }, x9l2: { col: 0, row: 34 }, x9l3: { col: 0, row: 35 }, x9quiz: { col: 0, row: 36 },
  x10l1: { col: 0, row: 37 }, x10l2: { col: 0, row: 38 }, x10l3: { col: 0, row: 39 }, x10quiz: { col: 0, row: 40 },
  x11l1: { col: 0, row: 41 }, x11l2: { col: 0, row: 42 }, x11l3: { col: 0, row: 43 }, x11quiz: { col: 0, row: 44 },
  x12l1: { col: 0, row: 45 }, x12l2: { col: 0, row: 46 }, x12l3: { col: 0, row: 47 }, x12quiz: { col: 0, row: 48 },
  x13l1: { col: 0, row: 49 }, x13l2: { col: 0, row: 50 }, x13l3: { col: 0, row: 51 }, x13quiz: { col: 0, row: 52 },
  x14l1: { col: 0, row: 53 }, x14l2: { col: 0, row: 54 }, x14l3: { col: 0, row: 55 }, x14quiz: { col: 0, row: 56 },
  cp_cpp: { col: 0, row: 57 },
};

const CPP_TREE_EDGES = [
  ['x1l1','x1l2'], ['x1l2','x1l3'], ['x1l3','x1quiz'],
  ['x1quiz','x2l1'], ['x2l1','x2l2'], ['x2l2','x2l3'], ['x2l3','x2quiz'],
  ['x2quiz','x3l1'], ['x3l1','x3l2'], ['x3l2','x3l3'], ['x3l3','x3quiz'],
  ['x3quiz','x4l1'], ['x4l1','x4l2'], ['x4l2','x4l3'], ['x4l3','x4quiz'],
  ['x4quiz','x5l1'], ['x5l1','x5l2'], ['x5l2','x5l3'], ['x5l3','x5quiz'],
  ['x5quiz','x6l1'], ['x6l1','x6l2'], ['x6l2','x6l3'], ['x6l3','x6quiz'],
  ['x6quiz','x7l1'], ['x7l1','x7l2'], ['x7l2','x7l3'], ['x7l3','x7quiz'],
  ['x7quiz','cp_cpa'], ['cp_cpa','x8l1'],
  ['x8l1','x8l2'], ['x8l2','x8l3'], ['x8l3','x8quiz'],
  ['x8quiz','x9l1'], ['x9l1','x9l2'], ['x9l2','x9l3'], ['x9l3','x9quiz'],
  ['x9quiz','x10l1'], ['x10l1','x10l2'], ['x10l2','x10l3'], ['x10l3','x10quiz'],
  ['x10quiz','x11l1'], ['x11l1','x11l2'], ['x11l2','x11l3'], ['x11l3','x11quiz'],
  ['x11quiz','x12l1'], ['x12l1','x12l2'], ['x12l2','x12l3'], ['x12l3','x12quiz'],
  ['x12quiz','x13l1'], ['x13l1','x13l2'], ['x13l2','x13l3'], ['x13l3','x13quiz'],
  ['x13quiz','x14l1'], ['x14l1','x14l2'], ['x14l2','x14l3'], ['x14l3','x14quiz'],
  ['x14quiz','cp_cpp'],
];

const CPP_UNIT_LABEL_ANCHOR = {
  x1: 'x1l1', x2: 'x2l1', x3: 'x3l1', x4: 'x4l1', x5: 'x5l1', x6: 'x6l1', x7: 'x7l1',
  x8: 'x8l1', x9: 'x9l1', x10: 'x10l1', x11: 'x11l1', x12: 'x12l1', x13: 'x13l1', x14: 'x14l1',
};

registerCurriculum('cpp', {
  LESSONS: CPP_LESSONS, STUB_LESSONS: CPP_STUB_LESSONS, UNITS: CPP_UNITS, PREREQS: CPP_PREREQS,
  TREE_LAYOUT: CPP_TREE_LAYOUT, TREE_EDGES: CPP_TREE_EDGES, UNIT_LABEL_ANCHOR: CPP_UNIT_LABEL_ANCHOR,
});

CERT_CHECKPOINTS.cpp = [
  { id: 'cp_cpa', afterUnit: 'x7', name: 'CPA', fullName: 'C++ Certified Associate Programmer (C++ Institute)', icon: '🎓' },
  { id: 'cp_cpp', afterUnit: 'x14', name: 'CPP', fullName: 'C++ Certified Professional Programmer (C++ Institute)', icon: '🏆' },
];

// ===================================================================================
// ===== C curriculum (CLA -> CLP) =====
// Code exercises compile & run for real via Judge0 (see CODE_RUNTIME in lesson-engine.js).
// Every starter is a full compilable program (#include + main()) — students fill in the
// marked blank. No classes/std::string here — plain structs and char buffers throughout.
// ===================================================================================
const C_LESSONS = {
  // UNIT 1 — First Contact
  w1l1: {
    id: 'w1l1', unit: 'w1', title: 'What Is C?', icon: '💾', xp: XP.LESSON,
    introLines: [
      "C is a small, fast, compiled language that most modern languages are built on top of.",
      "Code is organized into functions — every program starts running from main().",
      "printf(\"...\") is how you'll see output — it's C's version of print().",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>printf(\"hi\")</code> do?", options: [
        "Prints hi to the console", "Deletes a variable", "Creates a new function", "Only works with numbers" ], answer: 0 },
      { type: 'mcq', prompt: "Which function is the starting point of every C program?", options: [ "main()", "start()", "run()", "init()" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Every C program needs a main() function.", answer: true },
      { type: 'truefalse', prompt: "You need `#include <stdio.h>` to use printf.", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["printf(\"x\")", "Prints x to the console"], ["int main() { ... }", "The starting point of a C program"],
      ] },
      { type: 'code', prompt: "Print <code>hello</code> using printf.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "hello", mustContain: ['printf'] },
    ],
  },
  w1l2: {
    id: 'w1l2', unit: 'w1', title: 'Variables & Data Types', icon: '📦', xp: XP.LESSON,
    introLines: [
      "C wants you to declare a variable's type up front — there's no guessing at runtime.",
      "int score = 0; creates a whole-number box. float, char, and double work the same way.",
      "Once declared, a variable's type can't change.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>int score = 0;</code> do?", options: [
        "Creates a variable named score that can only hold whole numbers", "Creates a variable that can hold any type", "Prints the number 0", "Deletes a variable" ], answer: 0 },
      { type: 'mcq', prompt: "Which type holds a single character in C?", options: [ "char", "int", "float", "string" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "C has no built-in string type — text is handled with char arrays.", answer: true },
      { type: 'truefalse', prompt: "float and double both hold decimal numbers.", answer: true },
      { type: 'match', prompt: "Match each type to what it holds.", pairs: [
        ["int", "Whole numbers"], ["float", "Decimal numbers"], ["char", "A single character"],
      ] },
      { type: 'code', prompt: "Declare an int named score equal to 10, then printf it with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "10", mustContain: ['int score'] },
    ],
  },
  w1l3: {
    id: 'w1l3', unit: 'w1', title: 'printf & Comments', icon: '📝', xp: XP.LESSON,
    introLines: [
      "printf uses format specifiers: %d for ints, %f for floats, %s for strings, %c for chars.",
      "// starts a single-line comment.",
      "/* ... */ marks a comment that can span multiple lines.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Which format specifier prints an int with printf?", options: [ "%d", "%s", "%f", "%c" ], answer: 0 },
      { type: 'mcq', prompt: "Which line is a comment in C?", options: [
        "// set the score to zero", "int score = 0;", "printf(\"%d\", score);", "score == 0;" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Comments are skipped entirely when C code compiles and runs.", answer: true },
      { type: 'truefalse', prompt: "/* ... */ comments can span multiple lines.", answer: true },
      { type: 'match', prompt: "Match each specifier to its type.", pairs: [
        ["%d", "int"], ["%f", "float/double"], ["%s", "string (char array)"],
      ] },
      { type: 'code', prompt: "Print the text <code>ready</code> using printf, with a // comment above it explaining what it does.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "ready", mustContain: ['//', 'printf'] },
    ],
  },
  w1quiz: {
    id: 'w1quiz', unit: 'w1', title: 'Unit 1 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Time for a compiled quiz.", "It pulls from everything in First Contact.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does printf(\"hi\"); do?", options: [ "Prints hi to the console", "Deletes hi", "Creates a variable named hi", "Nothing" ], answer: 0 },
      { type: 'mcq', prompt: "Which type holds whole numbers?", options: [ "int", "char", "float", "void" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Which format specifier is used for a float?", options: [ "%f", "%d", "%s", "%c" ], answer: 0 },
      { type: 'truefalse', prompt: "A variable can be thought of as a labeled, typed box holding a value.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Every C program needs a main() function.", answer: true },
      { type: 'truefalse', hard: true, prompt: "C has a built-in string type separate from char arrays.", answer: false },
      { type: 'match', prompt: "Match each type to what it holds.", pairs: [
        ["int", "Whole numbers"], ["char", "A single character"], ["float", "Decimal numbers"],
      ] },
      { type: 'code', prompt: "Declare an int named total equal to 5, then printf it with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['int total'] },
    ],
  },

  // UNIT 2 — Operators & Expressions
  w2l1: {
    id: 'w2l1', unit: 'w2', title: 'Math Operators', icon: '➕', xp: XP.LESSON,
    introLines: [
      "+ adds, - subtracts, * multiplies, / divides — same as most languages.",
      "% gives you the remainder after division: 10 % 3 is 1.",
      "Dividing two int values truncates any decimal part: 7 / 2 is 3, not 3.5.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does % do between two integers in C?", options: [
        "Gives the remainder after division", "Divides them", "Multiplies them", "Compares them" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>7 / 2</code> evaluate to in C, using two ints?", options: [ "3 (integer division truncates)", "3.5", "4", "a compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Dividing two int values in C truncates any decimal part.", answer: true },
      { type: 'truefalse', prompt: "10 % 3 evaluates to 1.", answer: true },
      { type: 'match', prompt: "Match each operator to what it does.", pairs: [
        ["+", "Addition"], ["%", "Remainder"], ["/", "Division"],
      ] },
      { type: 'code', prompt: "Declare int total equal to 4 * 3 and printf it with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "12", mustContain: ['*'] },
    ],
  },
  w2l2: {
    id: 'w2l2', unit: 'w2', title: 'Comparison Operators', icon: '⚖️', xp: XP.LESSON,
    introLines: [
      "== checks equality; != checks not-equal — same idea as most languages.",
      "C has no true bool type in classic C — comparisons produce an int: 1 for true, 0 for false.",
      "Anything nonzero counts as true in an if condition.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a comparison like 7 == 7 evaluate to in classic C?", options: [
        "The int 1 (true)", "The word \"true\"", "A compile error", "The int 0" ], answer: 0 },
      { type: 'mcq', prompt: "What counts as 'true' in a C if condition?", options: [ "Any nonzero value", "Only the value 1", "Only positive values", "Nothing — C has no truthiness" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "printf(\"%d\", 5 == 5); prints 1, not the word true.", answer: true },
      { type: 'truefalse', prompt: "5 != 4 evaluates to 1 (true).", answer: true },
      { type: 'match', prompt: "Match each operator to its meaning.", pairs: [
        ["==", "Are these equal?"], ["!=", "Are these NOT equal?"],
      ] },
      { type: 'code', prompt: "Printf the result of (7 == 7) with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "1", mustContain: ['=='] },
    ],
  },
  w2l3: {
    id: 'w2l3', unit: 'w2', title: 'Logical Operators', icon: '🔗', xp: XP.LESSON,
    introLines: [
      "&&, ||, and ! combine or flip logical checks.",
      "&& needs both sides nonzero (true); || needs at least one.",
      "Like comparisons, the result is an int: 1 or 0.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does && require?", options: [
        "Both sides must be true (nonzero)", "Only one side needs to be true", "It flips true to false", "It only works with numbers" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>printf(\"%d\", 1 \\&\\& 0);</code> print?", options: [ "0", "1", "false", "an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "1 || 0 evaluates to 1 (true).", answer: true },
      { type: 'truefalse', prompt: "! flips a logical value: !1 is 0.", answer: true },
      { type: 'match', prompt: "Match each operator to its meaning.", pairs: [
        ["&&", "Both must be true"], ["||", "At least one must be true"], ["!", "Flips true/false"],
      ] },
      { type: 'code', prompt: "Printf the result of (1 && 0) with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "0", mustContain: ['&&'] },
    ],
  },
  w2quiz: {
    id: 'w2quiz', unit: 'w2', title: 'Unit 2 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Operators & Expressions.", "Math, comparison, and logical operators.", "Let's see what you've got." ],
    questions: [
      { type: 'mcq', prompt: "What does * do between two numbers?", options: [ "Multiplies them", "Compares them", "Joins them", "Divides them" ], answer: 0 },
      { type: 'mcq', prompt: "What does a comparison like == produce in C?", options: [ "An int: 1 or 0", "A bool: true or false", "A string", "Nothing" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does 7 / 2 evaluate to using two ints?", options: [ "3", "3.5", "4", "an error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Any nonzero value is treated as true in a C if condition.", answer: true },
      { type: 'truefalse', hard: true, prompt: "&& requires both operands to be nonzero (true).", answer: true },
      { type: 'truefalse', prompt: "Both && and || are logical operators.", answer: true },
      { type: 'match', prompt: "Match the operator to its category.", pairs: [
        ["+", "Math operator"], ["==", "Comparison operator"], ["&&", "Logical operator"],
      ] },
      { type: 'code', prompt: "Declare int result equal to 10 / 2 and printf it with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['/'] },
    ],
  },

  // UNIT 3 — Making Decisions
  w3l1: {
    id: 'w3l1', unit: 'w3', title: 'If Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "An if statement runs a block only when its condition is nonzero (true).",
      "if (score > 50) { printf(\"pass\"); }",
      "The condition inside () is just an expression evaluated as true/false.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>if (condition)</code> do?", options: [
        "Runs the block only when condition is nonzero (true)", "Runs the block every time", "Deletes a variable", "Repeats forever" ], answer: 0 },
      { type: 'mcq', prompt: "What do the curly braces {} mark in an if statement?", options: [
        "What's inside the block that runs conditionally", "A comment", "A function call", "An array" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "If the condition is 0 (false), the block inside {} is skipped.", answer: true },
      { type: 'truefalse', hard: true, prompt: "In C, `if (1)` is treated as true — nonzero numbers count as true.", answer: true },
      { type: 'match', prompt: "Match each piece to what it means.", pairs: [
        ["if (x > 0) {...}", "Runs the block only if x is greater than 0"], ["{ }", "Marks the conditional block"],
      ] },
      { type: 'code', prompt: "int n = 5; Printf <code>positive</code> if n is greater than 0.",
        starter: "#include <stdio.h>\n\nint main() {\n    int n = 5;\n    // your code here\n    return 0;\n}",
        expected: "positive", mustContain: ['if', '>'] },
    ],
  },
  w3l2: {
    id: 'w3l2', unit: 'w3', title: 'If / Else / Else If', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "else runs when the if didn't.",
      "else if lets you check another condition.",
      "Only one branch in the chain ever runs.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>else</code> do?", options: [
        "Runs when the if condition was false", "Runs always", "Repeats the block", "Only works with loops" ], answer: 0 },
      { type: 'mcq', prompt: "How do you write 'else if' in C?", options: [ "else if", "elseif", "elif", "else.if" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Only one branch of an if/else if/else chain runs per pass.", answer: true },
      { type: 'truefalse', prompt: "else is optional — you can have just if.", answer: true },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "Checks the first condition"], ["else if", "Checks another condition"], ["else", "Runs if nothing matched"],
      ] },
      { type: 'code', prompt: "int n = 0; Printf <code>zero</code> if n is 0, <code>positive</code> if greater, else <code>negative</code>.",
        starter: "#include <stdio.h>\n\nint main() {\n    int n = 0;\n    // your code here\n    return 0;\n}",
        expected: "zero", mustContain: ['if', 'else if', 'else'] },
    ],
  },
  w3l3: {
    id: 'w3l3', unit: 'w3', title: 'Switch Statements', icon: '🔀', xp: XP.LESSON,
    introLines: [
      "A switch statement compares one value against several possible cases.",
      "Each case needs a break, or execution 'falls through' into the next one.",
      "default catches anything that didn't match a case.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does break do inside a switch case?", options: [
        "Stops execution from falling through to the next case", "Ends the whole program", "Starts a loop", "Deletes the switch" ], answer: 0 },
      { type: 'mcq', prompt: "What does the default case in a switch do?", options: [
        "Runs when no other case matched", "Always runs first", "Deletes the switch", "Only works with numbers" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Forgetting break in a switch case causes execution to fall through to the next case.", answer: true },
      { type: 'truefalse', prompt: "A switch statement can often replace a long if/else if chain.", answer: true },
      { type: 'match', prompt: "Match each piece to its role.", pairs: [
        ["case", "One possible matching value"], ["break", "Stops fall-through"], ["default", "Runs if nothing else matched"],
      ] },
      { type: 'code', prompt: "int day = 1; Use switch to printf <code>weekday</code> for case 1, <code>weekend</code> otherwise (default).",
        starter: "#include <stdio.h>\n\nint main() {\n    int day = 1;\n    // your code here\n    return 0;\n}",
        expected: "weekday", mustContain: ['switch', 'case', 'default'] },
    ],
  },
  w3quiz: {
    id: 'w3quiz', unit: 'w3', title: 'Unit 3 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Making Decisions.", "if/else if/else, and switch.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What happens when an if condition is 0 (false)?", options: [ "The block is skipped", "The block runs anyway", "The program crashes", "It repeats forever" ], answer: 0 },
      { type: 'mcq', prompt: "Which keyword checks an additional condition after if?", options: [ "else if", "else", "then", "or" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What happens if you forget break in a switch case?", options: [ "Execution falls through to the next case", "The switch stops entirely", "A compile error occurs", "Nothing happens" ], answer: 0 },
      { type: 'truefalse', prompt: "else runs only if no earlier condition matched.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Nonzero values are treated as true in an if condition.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A switch statement's default case is required.", answer: false },
      { type: 'match', prompt: "Match each keyword to its role.", pairs: [
        ["if", "First condition checked"], ["else", "Runs when nothing matched"], ["switch", "Compares one value against cases"],
      ] },
      { type: 'code', prompt: "int n = -3; Printf <code>negative</code> if n is less than 0, else <code>non-negative</code>.",
        starter: "#include <stdio.h>\n\nint main() {\n    int n = -3;\n    // your code here\n    return 0;\n}",
        expected: "negative", mustContain: ['if', 'else'] },
    ],
  },

  // UNIT 4 — Loops
  w4l1: {
    id: 'w4l1', unit: 'w4', title: 'While Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "while repeats its block as long as a condition stays nonzero (true).",
      "while (count < 3) { ... } — same idea as other languages, just with typed variables.",
      "Forget to update the condition, and you get an infinite loop.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a while loop do?", options: [
        "Repeats its block as long as the condition is true", "Runs its block exactly once", "Runs a fixed number of times only", "Never runs" ], answer: 0 },
      { type: 'mcq', prompt: "What commonly causes an infinite loop?", options: [
        "Never updating the condition so it stays true forever", "Using printf inside it", "Declaring an int inside it", "Using else" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A while loop can run zero times if its condition starts out false.", answer: true },
      { type: 'truefalse', prompt: "You must update the condition variable inside a while loop, or it may never stop.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["while (x < 5) {...}", "Repeats while x is less than 5"], ["Infinite loop", "A loop whose condition never becomes false"],
      ] },
      { type: 'code', prompt: "Printf 0, 1, 2 each on its own line using a while loop.",
        starter: "#include <stdio.h>\n\nint main() {\n    int n = 0;\n    // your code here\n    return 0;\n}",
        expected: "0\n1\n2", mustContain: ['while'] },
    ],
  },
  w4l2: {
    id: 'w4l2', unit: 'w4', title: 'For Loops', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "for (int i = 0; i < 3; i++) { ... } packs setup, condition, and update into one line.",
      "i++ is shorthand for i = i + 1.",
      "This is the most common loop style for counting in C.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>for (int i = 0; i < 3; i++)</code> do?", options: [
        "Loops with i = 0, 1, then 2", "Loops exactly once", "Loops 4 times", "Creates a variable named for" ], answer: 0 },
      { type: 'mcq', prompt: "What does i++ mean?", options: [ "Increase i by 1", "Decrease i by 1", "Double i", "Compare i to 1" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "for (int i = 2; i < 5; i++) loops with i = 2, 3, 4 — not 5.", answer: true },
      { type: 'truefalse', prompt: "A for loop's three parts are: initialization, condition, and update.", answer: true },
      { type: 'match', prompt: "Match each part to its role.", pairs: [
        ["int i = 0", "Initialization"], ["i < 3", "Condition"], ["i++", "Update"],
      ] },
      { type: 'code', prompt: "Use a for loop to printf 1, 2, 3.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "1\n2\n3", mustContain: ['for'] },
    ],
  },
  w4l3: {
    id: 'w4l3', unit: 'w4', title: 'Loop Control', icon: '🔁', xp: XP.LESSON,
    introLines: [
      "break exits a loop immediately. continue skips to the next pass.",
      "Both work the same way in while and for loops.",
      "Use them to handle special cases without deeply nesting more ifs.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does break do inside a loop?", options: [
        "Stops the loop immediately", "Skips to the next iteration", "Restarts the loop", "Pauses forever" ], answer: 0 },
      { type: 'mcq', prompt: "What does continue do?", options: [ "Skips the rest of the current iteration", "Ends the loop", "Deletes the loop variable", "Runs the block twice" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "break and continue both work inside for and while loops.", answer: true },
      { type: 'truefalse', prompt: "continue jumps straight to the next iteration's condition check.", answer: true },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exit the loop right now"], ["continue", "Skip to next iteration"],
      ] },
      { type: 'code', prompt: "Loop i from 0 to 4 with a for loop; printf i but skip 2 using continue.",
        starter: "#include <stdio.h>\n\nint main() {\n    for (int i = 0; i < 5; i++) {\n        // your code here\n        printf(\"%d\\n\", i);\n    }\n    return 0;\n}",
        expected: "0\n1\n3\n4", mustContain: ['continue'] },
    ],
  },
  w4quiz: {
    id: 'w4quiz', unit: 'w4', title: 'Unit 4 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Loops.", "while, for, and loop control.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "Which loop keeps running as long as a condition is true?", options: [ "while", "for", "switch", "void" ], answer: 0 },
      { type: 'mcq', prompt: "What does for (int i = 0; i < 3; i++) loop through?", options: [ "0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "3, only" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does break do inside a loop?", options: [ "Exits the loop immediately", "Skips one iteration", "Restarts the loop", "Does nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "continue skips the rest of the current iteration only.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A while loop's condition is checked before each pass, including the first.", answer: true },
      { type: 'truefalse', hard: true, prompt: "for (int i = 1; i < 4; i++) includes i = 4.", answer: false },
      { type: 'match', prompt: "Match each keyword to its behavior.", pairs: [
        ["break", "Exits the loop"], ["continue", "Skips to next iteration"], ["for", "Counts through a range"],
      ] },
      { type: 'code', prompt: "Use a for loop to printf 5, 4, 3, 2, 1 (decrementing).",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "5\n4\n3\n2\n1", mustContain: ['for'] },
    ],
  },

  // UNIT 5 — Arrays
  w5l1: {
    id: 'w5l1', unit: 'w5', title: 'Array Basics', icon: '📚', xp: XP.LESSON,
    introLines: [
      "An array is a fixed-size, ordered list of values of the same type.",
      "int nums[] = {1, 2, 3}; access items by position: nums[0] is 1.",
      "C arrays don't know their own length — sizeof(nums) / sizeof(nums[0]) computes it.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "How do you get the number of items in a C array?", options: [
        "sizeof(arr) / sizeof(arr[0])", "arr.length", "arr.length()", "len(arr)" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>nums[0]</code> get you in <code>int nums[] = {10, 20, 30};</code>?", options: [ "10", "20", "30", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Array indexing starts at 0, not 1.", answer: true },
      { type: 'truefalse', prompt: "A C array's size is fixed once it's created.", answer: true },
      { type: 'match', prompt: "Match each expression to what it does.", pairs: [
        ["nums[1]", "The second item"], ["sizeof(nums)/sizeof(nums[0])", "The number of items"],
      ] },
      { type: 'code', prompt: "int nums[] = {1,2,3}; Printf the number of elements using sizeof, with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 2, 3};\n    // your code here\n    return 0;\n}",
        expected: "3", mustContain: ['sizeof'] },
    ],
  },
  w5l2: {
    id: 'w5l2', unit: 'w5', title: 'Multi-dimensional Arrays', icon: '📚', xp: XP.LESSON,
    introLines: [
      "A 2D array models a grid: int grid[2][2] = {{1, 2}, {3, 4}};",
      "grid[0][1] gets row 0, column 1.",
      "Useful for anything with rows and columns, like a board game.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>grid[0][1]</code> access in <code>int grid[2][2] = {{1,2},{3,4}};</code>?", options: [ "2 (row 0, column 1)", "1", "3", "4" ], answer: 0 },
      { type: 'mcq', prompt: "What does int grid[2][2] represent?", options: [ "A 2D array (2 rows, 2 columns)", "A single number", "A string", "A pointer only" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Each row in a 2D array is itself a 1D array.", answer: true },
      { type: 'truefalse', prompt: "int grid[2][2] = {{1,2},{3,4}}; creates a 2-row, 2-column grid.", answer: true },
      { type: 'match', prompt: "Match each expression to what it gets.", pairs: [
        ["grid[0]", "The first row"], ["grid[0][1]", "Row 0, column 1"],
      ] },
      { type: 'code', prompt: "int grid[2][2] = {{1,2},{3,4}}; Printf grid[1][0] with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    int grid[2][2] = {{1, 2}, {3, 4}};\n    // your code here\n    return 0;\n}",
        expected: "3", mustContain: ['grid[1][0]'] },
    ],
  },
  w5l3: {
    id: 'w5l3', unit: 'w5', title: 'Strings as Char Arrays', icon: '📚', xp: XP.LESSON,
    introLines: [
      "C has no built-in string type — text is a char array ending in a null terminator ('\\0').",
      "char s[] = \"cat\"; actually stores 'c', 'a', 't', '\\0'.",
      "printf's %s specifier prints a char array up to (but not including) its null terminator.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What marks the end of a C string?", options: [
        "A null terminator character, '\\0'", "A newline", "Nothing — the array's length is enough", "A closing quote stored in memory" ], answer: 0 },
      { type: 'mcq', prompt: "What does char s[] = \"cat\"; actually store?", options: [
        "'c', 'a', 't', '\\0'", "Just 'c', 'a', 't'", "A pointer to nothing", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "%s in printf prints characters up to (but not including) the null terminator.", answer: true },
      { type: 'truefalse', prompt: "\"cat\" as a C string literal takes up 4 bytes, including the null terminator.", answer: true },
      { type: 'match', prompt: "Match each concept to its meaning.", pairs: [
        ["'\\0'", "Marks the end of a C string"], ["%s", "printf specifier for a char array"],
      ] },
      { type: 'code', prompt: "char s[] = \"cat\"; Printf it with %s.",
        starter: "#include <stdio.h>\n\nint main() {\n    char s[] = \"cat\";\n    // your code here\n    return 0;\n}",
        expected: "cat", mustContain: ['%s'] },
    ],
  },
  w5quiz: {
    id: 'w5quiz', unit: 'w5', title: 'Unit 5 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Arrays.", "Basics, multi-dimensional arrays, and C strings.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "How do you find a C array's length?", options: [ "sizeof(arr) / sizeof(arr[0])", "arr.length", "arr.size", "len(arr)" ], answer: 0 },
      { type: 'mcq', prompt: "What marks the end of a C string?", options: [ "'\\0' (null terminator)", "A newline", "The array's length field", "Nothing" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does int grid[2][2] represent?", options: [ "A 2D array", "A single integer", "A string", "A pointer only" ], answer: 0 },
      { type: 'truefalse', prompt: "Array indexing starts at 0 in C.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A C array knows its own length automatically at runtime.", answer: false },
      { type: 'truefalse', hard: true, prompt: "%s prints a char array up to its null terminator.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["Array", "Fixed-size ordered collection"], ["'\\0'", "Ends a C string"], ["%s", "printf specifier for strings"],
      ] },
      { type: 'code', prompt: "char s[] = \"hello\"; Printf it with %s.",
        starter: "#include <stdio.h>\n\nint main() {\n    char s[] = \"hello\";\n    // your code here\n    return 0;\n}",
        expected: "hello", mustContain: ['%s'] },
    ],
  },

  // UNIT 6 — Functions
  w6l1: {
    id: 'w6l1', unit: 'w6', title: 'Defining Functions', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A function is a named, reusable block of instructions.",
      "void greet() { ... } defines it. Calling greet(); later runs everything inside.",
      "Every C program needs at least one function: main().",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>void greet() {}</code> define?", options: [
        "A function named greet that returns nothing", "A variable", "A struct", "An array" ], answer: 0 },
      { type: 'mcq', prompt: "How do you run a function named greet from inside main?", options: [ "greet();", "void greet", "run greet", "greet" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Defining a function does not run its code immediately.", answer: true },
      { type: 'truefalse', prompt: "void means a function doesn't return a value.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["void sayHi() {}", "Defines a function named sayHi"], ["sayHi();", "Calls (runs) the function"],
      ] },
      { type: 'code', prompt: "Define void greet() that printf's <code>hi</code>, then call it once from main.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    greet();\n    return 0;\n}",
        expected: "hi", mustContain: ['void greet'] },
    ],
  },
  w6l2: {
    id: 'w6l2', unit: 'w6', title: 'Parameters & Arguments', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "A parameter is a typed placeholder a function expects: void greet(char name)",
      "The value you actually pass in when calling is the argument.",
      "C requires you to declare each parameter's type explicitly.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "In <code>void greet(int age) {}</code>, what is <code>age</code>?", options: [
        "A typed parameter — a placeholder for an int value", "A loop variable", "A keyword", "The return value" ], answer: 0 },
      { type: 'mcq', prompt: "In <code>greet(5)</code>, what is <code>5</code>?", options: [ "The argument — the actual value passed in", "The parameter", "A comment", "A data type" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A function can take more than one parameter.", answer: true },
      { type: 'truefalse', prompt: "Each parameter's type must be declared explicitly in C.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "Typed placeholder in the definition"], ["Argument", "The actual value passed in"],
      ] },
      { type: 'code', prompt: "Define int add(int a, int b) returning a + b, then printf add(2, 3) from main with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    printf(\"%d\", add(2, 3));\n    return 0;\n}",
        expected: "5", mustContain: ['int add', 'return'] },
    ],
  },
  w6l3: {
    id: 'w6l3', unit: 'w6', title: 'Return Values & Scope', icon: '🧩', xp: XP.LESSON,
    introLines: [
      "return sends a value back out of a function, instead of just printing it.",
      "A void function returns nothing at all.",
      "A variable declared inside a function only exists inside it — that's scope.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does return do?", options: [
        "Sends a value back to wherever the function was called", "Prints a value to the console", "Stops the whole program", "Deletes the function" ], answer: 0 },
      { type: 'mcq', prompt: "What return type would you use for a function that returns nothing?", options: [ "void", "int", "null", "empty" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A variable declared inside a function isn't accessible outside it.", answer: true },
      { type: 'truefalse', prompt: "A function's return type must match what it actually returns.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["return x;", "Sends x back out of the function"], ["void", "A function that returns nothing"],
      ] },
      { type: 'code', prompt: "Define int square(int n) returning n * n. Printf square(4) from main with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    printf(\"%d\", square(4));\n    return 0;\n}",
        expected: "16", mustContain: ['int square', 'return'] },
    ],
  },
  w6quiz: {
    id: 'w6quiz', unit: 'w6', title: 'Unit 6 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Functions.", "Defining, parameters, and return values.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What return type means a function returns nothing?", options: [ "void", "int", "null", "none" ], answer: 0 },
      { type: 'mcq', prompt: "What does a parameter represent?", options: [ "A typed placeholder for a value the function expects", "The function's name", "A compile error", "A loop counter" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Where is a variable declared inside a function accessible?", options: [ "Only inside that function", "Everywhere in the file", "Only in main", "Nowhere" ], answer: 0 },
      { type: 'truefalse', prompt: "Calling a function runs the code inside it.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Variables declared inside a function are local to it.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A function can take zero parameters.", answer: true },
      { type: 'match', prompt: "Match each term to its meaning.", pairs: [
        ["Parameter", "Placeholder in the definition"], ["Argument", "Actual value passed in"], ["return", "Sends a value back"],
      ] },
      { type: 'code', prompt: "Define int doubleIt(int n) returning n * 2. Printf doubleIt(6) from main with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    printf(\"%d\", doubleIt(6));\n    return 0;\n}",
        expected: "12", mustContain: ['int doubleIt', 'return'] },
    ],
  },

  // UNIT 7 — Pointers
  w7l1: {
    id: 'w7l1', unit: 'w7', title: 'Pointer Basics', icon: '🎯', xp: XP.LESSON,
    introLines: [
      "A pointer stores a memory address instead of a value.",
      "int* p = &x; — & gets the address of x. *p dereferences the pointer to get the value.",
      "Pointers are central to how C works — arrays, strings, and dynamic memory all rely on them.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does & do in front of a variable?", options: [
        "Gets that variable's memory address", "Multiplies it", "Compares it", "Deletes it" ], answer: 0 },
      { type: 'mcq', prompt: "What does *p do when p is a pointer?", options: [
        "Dereferences p to get the value it points to", "Multiplies p", "Deletes p", "Compares p" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A pointer variable stores a memory address, not the value itself.", answer: true },
      { type: 'truefalse', prompt: "int* p = &x; makes p point to the address of x.", answer: true },
      { type: 'match', prompt: "Match each symbol to its meaning.", pairs: [
        ["&x", "The address of x"], ["*p", "The value p points to"],
      ] },
      { type: 'code', prompt: "int x = 5; int* p = &x; Printf *p with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    int x = 5;\n    int* p = &x;\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['*p'] },
    ],
  },
  w7l2: {
    id: 'w7l2', unit: 'w7', title: 'Pointers & Arrays', icon: '🎯', xp: XP.LESSON,
    introLines: [
      "An array's name decays into a pointer to its first element.",
      "arr[i] is really shorthand for *(arr + i).",
      "This is why C arrays and pointers are so closely linked.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does an array's name 'decay into'?", options: [
        "A pointer to its first element", "A copy of the whole array", "A struct", "Nothing — arrays aren't related to pointers" ], answer: 0 },
      { type: 'mcq', prompt: "What is arr[i] shorthand for?", options: [ "*(arr + i)", "&arr + i", "arr * i", "arr.get(i)" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Pointer arithmetic like arr + 1 moves to the next element, not the next byte.", answer: true },
      { type: 'truefalse', prompt: "arr[0] and *arr refer to the same value.", answer: true },
      { type: 'match', prompt: "Match each expression to its meaning.", pairs: [
        ["*(arr + 1)", "Same as arr[1]"], ["arr", "Decays to a pointer to arr[0]"],
      ] },
      { type: 'code', prompt: "int nums[] = {10, 20, 30}; Printf *(nums + 1) with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    int nums[] = {10, 20, 30};\n    // your code here\n    return 0;\n}",
        expected: "20", mustContain: ['nums + 1'] },
    ],
  },
  w7l3: {
    id: 'w7l3', unit: 'w7', title: 'Pointers & Functions', icon: '🎯', xp: XP.LESSON,
    introLines: [
      "C passes arguments by value — a function normally can't change the caller's variable.",
      "Passing a pointer lets a function reach back and modify the original value.",
      "void increment(int* p) { *p = *p + 1; } is a common pattern for this.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Why pass a pointer into a function instead of a plain value?", options: [
        "So the function can modify the caller's original variable", "It's required for all functions", "It makes the function run faster", "It's the only way to pass an int" ], answer: 0 },
      { type: 'mcq', prompt: "What does C's default pass-by-value mean?", options: [
        "The function receives a copy, so changes inside don't affect the caller's variable", "The function always modifies the original", "Arguments aren't copied at all", "Nothing — C has no function arguments" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "void increment(int* p) { *p = *p + 1; } modifies the caller's original variable through the pointer.", answer: true },
      { type: 'truefalse', prompt: "Without a pointer, a function can't change a plain int argument's value in the caller.", answer: true },
      { type: 'match', prompt: "Match each pattern to its behavior.", pairs: [
        ["void f(int x)", "Receives a copy — caller unaffected"], ["void f(int* x)", "Can modify the caller's original value"],
      ] },
      { type: 'code', prompt: "Define void increment(int* p) that adds 1 to *p. In main, int x = 5; call increment(&x); then printf x with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    int x = 5;\n    increment(&x);\n    printf(\"%d\", x);\n    return 0;\n}",
        expected: "6", mustContain: ['int* p'] },
    ],
  },
  w7quiz: {
    id: 'w7quiz', unit: 'w7', title: 'Unit 7 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Pointers.", "Pointer basics, pointers & arrays, pointers & functions.", "This one wraps up CLA-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does a pointer store?", options: [ "A memory address", "A copy of a value", "A function name", "A comment" ], answer: 0 },
      { type: 'mcq', prompt: "What does & do in front of a variable?", options: [ "Gets its address", "Dereferences it", "Deletes it", "Compares it" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "Why pass a pointer into a function?", options: [ "So it can modify the caller's original variable", "It's required for every function", "It's faster for all cases", "It prevents modification" ], answer: 0 },
      { type: 'truefalse', prompt: "*p dereferences pointer p to access the value it points to.", answer: true },
      { type: 'truefalse', hard: true, prompt: "arr[i] and *(arr + i) are equivalent in C.", answer: true },
      { type: 'truefalse', hard: true, prompt: "C passes arguments by value by default.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["Pointer", "Stores a memory address"], ["*p", "Dereferences a pointer"], ["Pass by value", "Function receives a copy"],
      ] },
      { type: 'code', prompt: "int x = 7; int* p = &x; Printf *p with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    int x = 7;\n    int* p = &x;\n    // your code here\n    return 0;\n}",
        expected: "7", mustContain: ['*p'] },
    ],
  },

  // UNIT 8 — Structs & Unions
  w8l1: {
    id: 'w8l1', unit: 'w8', title: 'Defining Structs', icon: '🧱', xp: XP.LESSON,
    introLines: [
      "A struct groups related fields together under one type.",
      "struct Point { int x; int y; }; then struct Point p = {1, 2}; creates one.",
      "Access fields with dot notation: p.x",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a struct let you do?", options: [
        "Group related fields together under one custom type", "Define a function", "Create a pointer", "Import a library" ], answer: 0 },
      { type: 'mcq', prompt: "How do you access a struct's field?", options: [ "Dot notation, like p.x", "Square brackets, like p[0]", "Function call, like p.x()", "You can't access individual fields" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A struct groups multiple fields, possibly of different types, into one type.", answer: true },
      { type: 'truefalse', prompt: "struct Point p = {1, 2}; initializes p's fields in order.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["struct Point { int x; int y; };", "Defines the struct type"], ["p.x", "Accesses field x"],
      ] },
      { type: 'code', prompt: "Define struct Point { int x; int y; }; Create struct Point p = {1, 2}; and printf p.x with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    struct Point p = {1, 2};\n    printf(\"%d\", p.x);\n    return 0;\n}",
        expected: "1", mustContain: ['struct Point'] },
    ],
  },
  w8l2: {
    id: 'w8l2', unit: 'w8', title: 'Nested Structs & Arrays of Structs', icon: '🧱', xp: XP.LESSON,
    introLines: [
      "A struct can contain another struct as a field.",
      "You can also make an array of structs: struct Point pts[3];",
      "Access a nested field by chaining dots: outer.inner.field",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Can a struct field itself be another struct?", options: [ "Yes", "No, never", "Only for int fields", "Only in arrays" ], answer: 0 },
      { type: 'mcq', prompt: "What does struct Point pts[3]; create?", options: [ "An array of 3 Point structs", "A single Point", "A pointer to one Point", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "pts[0].x accesses the x field of the first struct in an array of structs.", answer: true },
      { type: 'truefalse', prompt: "Nested struct fields are accessed by chaining dots.", answer: true },
      { type: 'match', prompt: "Match each expression to what it accesses.", pairs: [
        ["pts[0].x", "Field x of the first struct in the array"], ["outer.inner.field", "A nested struct's field"],
      ] },
      { type: 'code', prompt: "Define struct Point { int x; }; Create struct Point pts[2] = {{1}, {2}}; Printf pts[1].x with %d.",
        starter: "#include <stdio.h>\n\nstruct Point {\n    int x;\n};\n\nint main() {\n    struct Point pts[2] = {{1}, {2}};\n    // your code here\n    return 0;\n}",
        expected: "2", mustContain: ['pts[1].x'] },
    ],
  },
  w8l3: {
    id: 'w8l3', unit: 'w8', title: 'Unions', icon: '🧱', xp: XP.LESSON,
    introLines: [
      "A union looks like a struct, but all its fields share the same memory.",
      "union Data { int i; float f; }; — writing to one field affects how the others read.",
      "Unions are used to save memory when only one field is needed at a time.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's different about a union compared to a struct?", options: [
        "All its fields share the same memory location", "It can't have more than one field", "It's always bigger in memory", "It works exactly like a struct with no difference" ], answer: 0 },
      { type: 'mcq', prompt: "Why use a union?", options: [
        "To save memory when only one of several fields is needed at a time", "To store all fields simultaneously with full independence", "It's required for arrays", "It's faster than an int" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Writing to one field of a union can change what you read from another field.", answer: true },
      { type: 'truefalse', prompt: "A union's size is at least as large as its biggest field.", answer: true },
      { type: 'match', prompt: "Match each type to its memory behavior.", pairs: [
        ["struct", "Each field gets its own memory"], ["union", "All fields share the same memory"],
      ] },
      { type: 'code', prompt: "Define union Data { int i; float f; }; Create union Data d; set d.i = 5; and printf d.i with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    union Data d;\n    d.i = 5;\n    printf(\"%d\", d.i);\n    return 0;\n}",
        expected: "5", mustContain: ['union Data'] },
    ],
  },
  w8quiz: {
    id: 'w8quiz', unit: 'w8', title: 'Unit 8 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Structs & Unions.", "Structs, nested structs, arrays of structs, unions.", "This unit kicks off CLP-level material." ],
    questions: [
      { type: 'mcq', prompt: "What does a struct let you do?", options: [ "Group related fields under one type", "Define a loop", "Create a pointer only", "Nothing new" ], answer: 0 },
      { type: 'mcq', prompt: "How do you access a struct field?", options: [ "Dot notation", "Square brackets", "Function call", "You can't" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What's special about a union?", options: [ "All fields share the same memory", "It can't be nested", "It's always empty", "It's identical to a struct" ], answer: 0 },
      { type: 'truefalse', prompt: "struct Point pts[3]; creates an array of 3 structs.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A union's size is determined by its largest field.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A struct field can itself be another struct.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["struct", "Groups fields, each with own memory"], ["union", "Groups fields sharing memory"], ["pts[0].x", "Field of first struct in an array"],
      ] },
      { type: 'code', prompt: "Define struct Point { int x; int y; }; Create struct Point p = {3, 4}; Printf p.y with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    struct Point p = {3, 4};\n    printf(\"%d\", p.y);\n    return 0;\n}",
        expected: "4", mustContain: ['struct Point'] },
    ],
  },

  // UNIT 9 — Dynamic Memory
  w9l1: {
    id: 'w9l1', unit: 'w9', title: 'malloc/free', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "malloc allocates memory on the heap that lasts until you explicitly free it.",
      "int* p = malloc(sizeof(int)); grabs enough space for one int.",
      "free(p); releases it. Forgetting to free causes a memory leak.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>malloc(sizeof(int))</code> do?", options: [
        "Allocates enough heap memory to hold one int", "Frees memory", "Creates a stack variable only", "Compares two ints" ], answer: 0 },
      { type: 'mcq', prompt: "What does free(p); do?", options: [ "Releases the heap memory p points to", "Deletes the pointer variable itself", "Sets p to 0 automatically", "Nothing" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Forgetting to free heap-allocated memory causes a memory leak.", answer: true },
      { type: 'truefalse', prompt: "You need `#include <stdlib.h>` to use malloc and free.", answer: true },
      { type: 'match', prompt: "Match each function to its purpose.", pairs: [
        ["malloc", "Allocates heap memory"], ["free", "Releases heap memory"],
      ] },
      { type: 'code', prompt: "int* p = malloc(sizeof(int)); Set *p = 5; printf it with %d, then free(p);.",
        starter: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int* p = malloc(sizeof(int));\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['free(p)'] },
    ],
  },
  w9l2: {
    id: 'w9l2', unit: 'w9', title: 'Common Memory Pitfalls', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "A memory leak happens when heap memory is never freed.",
      "A dangling pointer points to memory that's already been freed — using it is undefined behavior.",
      "A double free (calling free() twice on the same pointer) is also undefined behavior.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What is a memory leak?", options: [
        "Heap memory that's allocated but never freed", "A crash on startup", "A syntax error", "Freeing memory too early" ], answer: 0 },
      { type: 'mcq', prompt: "What is a dangling pointer?", options: [
        "A pointer to memory that's already been freed", "A pointer that's never been assigned", "A pointer to a struct", "A null pointer" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Calling free() twice on the same pointer (a double free) is undefined behavior.", answer: true },
      { type: 'truefalse', prompt: "Using a dangling pointer can crash or corrupt data unpredictably.", answer: true },
      { type: 'match', prompt: "Match each pitfall to its description.", pairs: [
        ["Memory leak", "Allocated memory that's never freed"], ["Dangling pointer", "Points to already-freed memory"],
      ] },
      { type: 'code', prompt: "This is conceptual — just printf <code>noted</code> to confirm you read the lesson.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "noted", mustContain: ['printf'] },
    ],
  },
  w9l3: {
    id: 'w9l3', unit: 'w9', title: 'realloc & Resizing', icon: '🧠', xp: XP.LESSON,
    introLines: [
      "realloc resizes a previous malloc allocation, keeping its existing contents.",
      "int* p2 = realloc(p, newSize); — p2 might be a new address, so always use the return value.",
      "This is how you grow a dynamic array as more space is needed.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does realloc do?", options: [
        "Resizes a previous heap allocation, preserving its contents", "Frees memory permanently", "Allocates a brand new, empty block only", "Deletes a variable" ], answer: 0 },
      { type: 'mcq', prompt: "Why should you always use realloc's return value instead of assuming the pointer stays the same?", options: [
        "realloc may move the memory to a new address", "It's just a style preference", "realloc never changes the address", "realloc doesn't return anything useful" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "realloc preserves the original data when resizing.", answer: true },
      { type: 'truefalse', prompt: "realloc is commonly used to grow a dynamic array as more elements are added.", answer: true },
      { type: 'match', prompt: "Match each function to its role.", pairs: [
        ["malloc", "Allocates new heap memory"], ["realloc", "Resizes an existing allocation"],
      ] },
      { type: 'code', prompt: "int* p = malloc(sizeof(int)); *p = 1; p = realloc(p, 2 * sizeof(int)); p[1] = 2; Printf p[1] with %d, then free(p);.",
        starter: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int* p = malloc(sizeof(int));\n    p[0] = 1;\n    // your code here\n    return 0;\n}",
        expected: "2", mustContain: ['realloc'] },
    ],
  },
  w9quiz: {
    id: 'w9quiz', unit: 'w9', title: 'Unit 9 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Dynamic Memory.", "malloc/free, pitfalls, realloc.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does malloc allocate memory on?", options: [ "The heap", "The stack only", "Nowhere — it's not real memory", "The CPU cache" ], answer: 0 },
      { type: 'mcq', prompt: "What does free() do?", options: [ "Releases previously allocated heap memory", "Allocates new memory", "Crashes the program", "Nothing" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does realloc preserve when resizing?", options: [ "The original data", "Nothing — it's always empty after", "Only the first byte", "The old pointer's address, guaranteed" ], answer: 0 },
      { type: 'truefalse', prompt: "Forgetting free() on heap memory causes a memory leak.", answer: true },
      { type: 'truefalse', hard: true, prompt: "A double free (calling free twice on the same pointer) is safe in C.", answer: false },
      { type: 'truefalse', hard: true, prompt: "Using a dangling pointer is undefined behavior.", answer: true },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["malloc", "Allocates heap memory"], ["free", "Releases heap memory"], ["realloc", "Resizes an allocation"],
      ] },
      { type: 'code', prompt: "int* p = malloc(sizeof(int)); *p = 9; Printf *p with %d, then free(p);.",
        starter: "#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int* p = malloc(sizeof(int));\n    // your code here\n    return 0;\n}",
        expected: "9", mustContain: ['free(p)'] },
    ],
  },

  // UNIT 10 — File I/O
  w10l1: {
    id: 'w10l1', unit: 'w10', title: 'Opening & Writing Files', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "fopen(\"file.txt\", \"w\") opens a file for writing, returning a FILE* handle.",
      "fprintf(f, \"...\") writes formatted text to that file, just like printf writes to the console.",
      "Always fclose(f); when you're done, to make sure everything's actually saved.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>fopen(\"file.txt\", \"w\")</code> return?", options: [
        "A FILE* handle for writing to the file", "The file's text contents directly", "Nothing — fopen has no return value", "An error, always" ], answer: 0 },
      { type: 'mcq', prompt: "What does fprintf(f, \"hi\") do?", options: [ "Writes \"hi\" to the file f", "Writes \"hi\" to the console", "Deletes the file", "Reads from the file" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You should call fclose() when done with a file to ensure everything is saved.", answer: true },
      { type: 'truefalse', prompt: "\"w\" mode in fopen opens a file for writing.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["fopen", "Opens a file, returns a handle"], ["fprintf", "Writes formatted text to a file"], ["fclose", "Closes the file"],
      ] },
      { type: 'code', prompt: "Open test.txt for writing, fprintf <code>hi</code> to it, then fclose it and printf <code>done</code>.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    printf(\"done\");\n    return 0;\n}",
        expected: "done", mustContain: ['fopen', 'fclose'] },
    ],
  },
  w10l2: {
    id: 'w10l2', unit: 'w10', title: 'Reading Files', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "fopen(\"file.txt\", \"r\") opens a file for reading.",
      "fscanf(f, \"%s\", buf) reads a whitespace-delimited token into buf.",
      "Always check that fopen didn't return NULL before using the file.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>fopen(\"file.txt\", \"r\")</code> open the file for?", options: [
        "Reading", "Writing only", "Deleting", "Appending only" ], answer: 0 },
      { type: 'mcq', prompt: "What should you check before using a file handle from fopen?", options: [
        "That it isn't NULL (meaning the open failed)", "Nothing — fopen always succeeds", "That the file is empty", "That fclose was already called" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "fscanf(f, \"%s\", buf) reads a whitespace-delimited token from the file into buf.", answer: true },
      { type: 'truefalse', prompt: "fopen returns NULL if the file couldn't be opened.", answer: true },
      { type: 'match', prompt: "Match each mode to its purpose.", pairs: [
        ["\"r\"", "Read mode"], ["\"w\"", "Write mode"],
      ] },
      { type: 'code', prompt: "Write <code>hi</code> to test.txt, then reopen it for reading, fscanf it into a char buf[10], and printf buf.",
        starter: "#include <stdio.h>\n\nint main() {\n    FILE* f = fopen(\"test.txt\", \"w\");\n    fprintf(f, \"hi\");\n    fclose(f);\n    // your code here\n    return 0;\n}",
        expected: "hi", mustContain: ['fscanf'] },
    ],
  },
  w10l3: {
    id: 'w10l3', unit: 'w10', title: 'Binary File I/O', icon: '🗂️', xp: XP.LESSON,
    introLines: [
      "fwrite/fread work with raw bytes instead of formatted text — useful for structs and binary data.",
      "fwrite(&x, sizeof(x), 1, f); writes one copy of x's raw bytes to f.",
      "\"wb\" and \"rb\" modes open a file specifically for binary access.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What's the difference between fprintf/fscanf and fwrite/fread?", options: [
        "fwrite/fread work with raw bytes, not formatted text", "There's no difference at all", "fwrite/fread only work with integers", "fprintf/fscanf are faster always" ], answer: 0 },
      { type: 'mcq', prompt: "What does the \"b\" in \"wb\" mode mean?", options: [ "Binary mode", "Buffered mode", "Backup mode", "Big-endian mode" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "fwrite(&x, sizeof(x), 1, f) writes one raw copy of x to the file.", answer: true },
      { type: 'truefalse', prompt: "Binary I/O is often used for structs and non-text data.", answer: true },
      { type: 'match', prompt: "Match each call to its purpose.", pairs: [
        ["fwrite", "Writes raw bytes to a file"], ["fread", "Reads raw bytes from a file"],
      ] },
      { type: 'code', prompt: "int x = 5; Write it in binary mode (\"wb\") to data.bin with fwrite, then reopen (\"rb\") and fread it back into y; printf y with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    int x = 5;\n    FILE* f = fopen(\"data.bin\", \"wb\");\n    fwrite(&x, sizeof(x), 1, f);\n    fclose(f);\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['fread'] },
    ],
  },
  w10quiz: {
    id: 'w10quiz', unit: 'w10', title: 'Unit 10 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — File I/O.", "Opening, writing, reading, and binary I/O.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does fopen(\"f.txt\", \"w\") open the file for?", options: [ "Writing", "Reading only", "Deleting", "Nothing" ], answer: 0 },
      { type: 'mcq', prompt: "What does fclose() do?", options: [ "Closes the file, ensuring data is saved", "Opens a new file", "Deletes the file", "Reads the file" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does fwrite work with, unlike fprintf?", options: [ "Raw bytes instead of formatted text", "Only text", "Only integers", "Nothing different" ], answer: 0 },
      { type: 'truefalse', prompt: "You should check if fopen returned NULL before using the file.", answer: true },
      { type: 'truefalse', hard: true, prompt: "\"rb\" opens a file for binary reading.", answer: true },
      { type: 'truefalse', hard: true, prompt: "fscanf can read a whitespace-delimited token into a buffer.", answer: true },
      { type: 'match', prompt: "Match each function to its purpose.", pairs: [
        ["fopen", "Opens a file"], ["fprintf", "Writes formatted text"], ["fread", "Reads raw bytes"],
      ] },
      { type: 'code', prompt: "Write <code>go</code> to test2.txt, reopen for reading, fscanf into a char buf[10], and printf it.",
        starter: "#include <stdio.h>\n\nint main() {\n    FILE* f = fopen(\"test2.txt\", \"w\");\n    fprintf(f, \"go\");\n    fclose(f);\n    // your code here\n    return 0;\n}",
        expected: "go", mustContain: ['fscanf'] },
    ],
  },

  // UNIT 11 — The Preprocessor
  w11l1: {
    id: 'w11l1', unit: 'w11', title: '#define & Macros', icon: '📜', xp: XP.LESSON,
    introLines: [
      "The preprocessor runs before compilation, handling lines starting with #.",
      "#define PI 3 creates a simple text-substitution constant.",
      "#define SQUARE(x) ((x) * (x)) creates a macro — parentheses around x protect against surprises.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "When does the preprocessor run?", options: [
        "Before compilation, handling # lines like #define and #include", "After the program runs", "Only when errors occur", "Never — it's a myth" ], answer: 0 },
      { type: 'mcq', prompt: "What does #define PI 3 do?", options: [
        "Textually replaces PI with 3 wherever it appears", "Creates a typed variable named PI", "Declares a function named PI", "Nothing — it's just a comment" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Macro parameters should be wrapped in parentheses, like ((x) * (x)), to avoid operator-precedence surprises.", answer: true },
      { type: 'truefalse', prompt: "#define substitutions happen before the compiler ever sees the code.", answer: true },
      { type: 'match', prompt: "Match each snippet to what it does.", pairs: [
        ["#define PI 3", "A simple constant macro"], ["#define SQUARE(x) ((x)*(x))", "A function-like macro"],
      ] },
      { type: 'code', prompt: "Define #define SQUARE(x) ((x) * (x)). Printf SQUARE(5) with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    printf(\"%d\", SQUARE(5));\n    return 0;\n}",
        expected: "25", mustContain: ['#define SQUARE'] },
    ],
  },
  w11l2: {
    id: 'w11l2', unit: 'w11', title: '#include & Header Files', icon: '📜', xp: XP.LESSON,
    introLines: [
      "#include <stdio.h> pulls in the standard library's I/O declarations.",
      "Angle brackets <...> search system headers; quotes \"...\" search your own project files first.",
      "A header file typically declares functions that are defined elsewhere and linked in.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does #include <stdio.h> do?", options: [
        "Pulls in declarations for standard I/O functions like printf", "Runs the stdio.h program", "Deletes stdio.h", "Only works for graphics" ], answer: 0 },
      { type: 'mcq', prompt: "What's the difference between #include <...> and #include \"...\"?", options: [
        "Angle brackets search system headers; quotes check your own project files first", "There's no difference", "Quotes only work for .c files", "Angle brackets are deprecated" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A header file typically declares functions that are defined and linked in elsewhere.", answer: true },
      { type: 'truefalse', prompt: "#include is a preprocessor directive, handled before compilation.", answer: true },
      { type: 'match', prompt: "Match each include style to what it searches first.", pairs: [
        ["#include <stdio.h>", "System headers"], ["#include \"myheader.h\"", "Your own project files"],
      ] },
      { type: 'code', prompt: "This is conceptual — just printf <code>noted</code> to confirm you read the lesson.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "noted", mustContain: ['printf'] },
    ],
  },
  w11l3: {
    id: 'w11l3', unit: 'w11', title: 'Conditional Compilation', icon: '📜', xp: XP.LESSON,
    introLines: [
      "#ifdef, #ifndef, and #endif let you include or exclude code based on what's defined.",
      "This is commonly used for platform-specific code, or debug-only logging.",
      "#ifndef HEADER_H / #define HEADER_H is the classic 'include guard' pattern.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does #ifdef DEBUG do?", options: [
        "Includes the following code only if DEBUG is defined", "Deletes the DEBUG macro", "Always includes the following code", "Never includes the following code" ], answer: 0 },
      { type: 'mcq', prompt: "What is an 'include guard' used for?", options: [
        "Preventing a header file from being included more than once", "Encrypting a header file", "Speeding up compilation always", "Formatting code automatically" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "#ifndef HEADER_H / #define HEADER_H / #endif is the classic include guard pattern.", answer: true },
      { type: 'truefalse', prompt: "Conditional compilation is commonly used for platform-specific code.", answer: true },
      { type: 'match', prompt: "Match each directive to its role.", pairs: [
        ["#ifdef", "Includes code if a macro is defined"], ["#endif", "Ends a conditional compilation block"],
      ] },
      { type: 'code', prompt: "Define #define FEATURE. Use #ifdef FEATURE to printf <code>on</code>, else printf <code>off</code>.",
        starter: "#include <stdio.h>\n#define FEATURE\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "on", mustContain: ['#ifdef FEATURE'] },
    ],
  },
  w11quiz: {
    id: 'w11quiz', unit: 'w11', title: 'Unit 11 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — The Preprocessor.", "#define, #include, conditional compilation.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "When does the preprocessor run?", options: [ "Before compilation", "After compilation", "At runtime", "Never" ], answer: 0 },
      { type: 'mcq', prompt: "What does #include <stdio.h> pull in?", options: [ "Standard I/O declarations", "A new program", "Nothing", "Only math functions" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What's an include guard used for?", options: [ "Preventing double-inclusion of a header", "Encrypting code", "Making code run faster always", "Formatting" ], answer: 0 },
      { type: 'truefalse', prompt: "#define can create simple constants or function-like macros.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Macro parameters should be parenthesized to avoid precedence bugs.", answer: true },
      { type: 'truefalse', hard: true, prompt: "#ifdef checks whether a macro is defined.", answer: true },
      { type: 'match', prompt: "Match each directive to its purpose.", pairs: [
        ["#define", "Creates a macro"], ["#include", "Pulls in another file's declarations"], ["#ifdef", "Conditional compilation"],
      ] },
      { type: 'code', prompt: "Define #define DOUBLE(x) ((x) * 2). Printf DOUBLE(6) with %d.",
        starter: "#include <stdio.h>\n\n// your code here\n\nint main() {\n    printf(\"%d\", DOUBLE(6));\n    return 0;\n}",
        expected: "12", mustContain: ['#define DOUBLE'] },
    ],
  },

  // UNIT 12 — Advanced Pointers
  w12l1: {
    id: 'w12l1', unit: 'w12', title: 'Function Pointers', icon: '🧿', xp: XP.LESSON,
    introLines: [
      "A function pointer stores the address of a function, so you can call it indirectly.",
      "int (*fp)(int, int) = add; declares fp as a pointer to a function taking two ints and returning an int.",
      "This is how C achieves callback-style behavior, like sorting with a custom comparator.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does a function pointer store?", options: [
        "The address of a function, so it can be called indirectly", "A copy of a function's code", "A struct", "Nothing — functions can't be pointed to" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>int (*fp)(int, int) = add;</code> do?", options: [
        "Makes fp point to the function add", "Calls add immediately", "Defines a new function named fp", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Calling fp(2, 3) through a function pointer runs the pointed-to function.", answer: true },
      { type: 'truefalse', prompt: "Function pointers are how C implements callback-style behavior.", answer: true },
      { type: 'match', prompt: "Match each snippet to its meaning.", pairs: [
        ["int (*fp)(int,int)", "A pointer to a function taking two ints, returning int"], ["fp(2,3)", "Calls the pointed-to function"],
      ] },
      { type: 'code', prompt: "Define int add(int a, int b) returning a + b. In main, set int (*fp)(int,int) = add; and printf fp(2,3) with %d.",
        starter: "#include <stdio.h>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['(*fp)'] },
    ],
  },
  w12l2: {
    id: 'w12l2', unit: 'w12', title: 'Pointers to Pointers', icon: '🧿', xp: XP.LESSON,
    introLines: [
      "A pointer can itself point to another pointer: int** pp = &p;",
      "*pp dereferences once to get p; **pp dereferences twice to get the original value.",
      "Common in dynamic 2D arrays and functions that need to modify a caller's pointer.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does int** pp declare?", options: [
        "A pointer to a pointer to an int", "A pointer to an array", "Two separate int pointers", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What does **pp give you if pp is an int**?", options: [
        "The original int value, after two dereferences", "The address of p", "A compile error", "Nothing — you can only dereference once" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "A function can use a pointer-to-pointer parameter to modify the caller's pointer itself.", answer: true },
      { type: 'truefalse', prompt: "int** pp = &p; makes pp point to the pointer p.", answer: true },
      { type: 'match', prompt: "Match each expression to what it accesses.", pairs: [
        ["*pp", "The pointer p itself"], ["**pp", "The original value p points to"],
      ] },
      { type: 'code', prompt: "int x = 5; int* p = &x; int** pp = &p; Printf **pp with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    int x = 5;\n    int* p = &x;\n    int** pp = &p;\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['**pp'] },
    ],
  },
  w12l3: {
    id: 'w12l3', unit: 'w12', title: 'const & Pointers', icon: '🧿', xp: XP.LESSON,
    introLines: [
      "const int* p means the value p points to can't be changed through p.",
      "int* const p means p itself can't be reassigned to point elsewhere.",
      "Using const documents intent and lets the compiler catch accidental mutations.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does <code>const int* p</code> mean?", options: [
        "The value p points to can't be changed through p", "p itself can never be reassigned", "p is always NULL", "A compile error" ], answer: 0 },
      { type: 'mcq', prompt: "What does <code>int* const p</code> mean?", options: [
        "p itself can't be reassigned to point elsewhere", "The pointed-to value can't be changed", "p must be NULL", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Using const helps the compiler catch accidental mutations.", answer: true },
      { type: 'truefalse', prompt: "const communicates intent about what should and shouldn't change.", answer: true },
      { type: 'match', prompt: "Match each declaration to its meaning.", pairs: [
        ["const int* p", "Value can't change through p"], ["int* const p", "p can't be reassigned"],
      ] },
      { type: 'code', prompt: "int x = 5; const int* p = &x; Printf *p with %d.",
        starter: "#include <stdio.h>\n\nint main() {\n    int x = 5;\n    const int* p = &x;\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['*p'] },
    ],
  },
  w12quiz: {
    id: 'w12quiz', unit: 'w12', title: 'Unit 12 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Advanced Pointers.", "Function pointers, pointers to pointers, const.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does a function pointer store?", options: [ "The address of a function", "A copy of a function's code", "A struct", "Nothing" ], answer: 0 },
      { type: 'mcq', prompt: "What does int** pp declare?", options: [ "A pointer to a pointer to an int", "Two ints", "A pointer to an array", "A compile error" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does const int* p mean?", options: [ "The pointed-to value can't change through p", "p can never be reassigned", "p is NULL", "A compile error" ], answer: 0 },
      { type: 'truefalse', prompt: "Function pointers let you call a function indirectly.", answer: true },
      { type: 'truefalse', hard: true, prompt: "**pp dereferences a pointer-to-pointer twice to reach the original value.", answer: true },
      { type: 'truefalse', hard: true, prompt: "const on a pointer declaration has no effect on compiler checking.", answer: false },
      { type: 'match', prompt: "Match each concept to its meaning.", pairs: [
        ["Function pointer", "Points to a function"], ["Pointer to pointer", "Points to another pointer"], ["const", "Documents/enforces immutability"],
      ] },
      { type: 'code', prompt: "Define int mul(int a, int b) returning a * b. In main, int (*fp)(int,int) = mul; Printf fp(3,4) with %d.",
        starter: "#include <stdio.h>\n\nint mul(int a, int b) {\n    return a * b;\n}\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "12", mustContain: ['(*fp)'] },
    ],
  },

  // UNIT 13 — String Handling
  w13l1: {
    id: 'w13l1', unit: 'w13', title: 'string.h Functions', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "string.h provides ready-made tools for working with char arrays.",
      "strlen(s) gets the length; strcpy(dest, src) copies; strcmp(a, b) compares content.",
      "strcmp returns 0 when the two strings are equal.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does strlen(s) return?", options: [
        "The number of characters before the null terminator", "The total bytes allocated", "Always 0", "A pointer to s" ], answer: 0 },
      { type: 'mcq', prompt: "What does strcmp(a, b) return when a and b have equal content?", options: [ "0", "1", "-1", "true" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You need `#include <string.h>` to use strlen, strcpy, and strcmp.", answer: true },
      { type: 'truefalse', prompt: "strcpy(dest, src) copies src's content into dest.", answer: true },
      { type: 'match', prompt: "Match each function to its purpose.", pairs: [
        ["strlen", "Gets a string's length"], ["strcpy", "Copies one string into another"], ["strcmp", "Compares two strings' content"],
      ] },
      { type: 'code', prompt: "char s[] = \"hello\"; Printf strlen(s) with %d.",
        starter: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"hello\";\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['strlen'] },
    ],
  },
  w13l2: {
    id: 'w13l2', unit: 'w13', title: 'Building Strings Manually', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "strcat(dest, src) appends src onto the end of dest — dest must have enough room.",
      "sprintf(buf, \"...\", ...) builds a formatted string into buf, just like printf but into memory.",
      "Manual buffer management means you're responsible for making sure buffers are big enough.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does strcat(dest, src) do?", options: [
        "Appends src onto the end of dest", "Compares dest and src", "Copies src over dest, replacing it", "Deletes src" ], answer: 0 },
      { type: 'mcq', prompt: "What does sprintf(buf, \"Score: %d\", 5) do?", options: [
        "Builds the formatted string \"Score: 5\" into buf", "Prints \"Score: 5\" to the console", "Reads a value into buf", "A compile error" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You're responsible for ensuring a buffer is large enough before strcat or sprintf write into it.", answer: true },
      { type: 'truefalse', prompt: "sprintf works like printf, but writes into a buffer instead of the console.", answer: true },
      { type: 'match', prompt: "Match each function to its purpose.", pairs: [
        ["strcat", "Appends one string to another"], ["sprintf", "Builds a formatted string in memory"],
      ] },
      { type: 'code', prompt: "char buf[20]; Use sprintf to build <code>Score: 5</code> from int score = 5; into buf, then printf buf.",
        starter: "#include <stdio.h>\n\nint main() {\n    int score = 5;\n    char buf[20];\n    // your code here\n    printf(\"%s\", buf);\n    return 0;\n}",
        expected: "Score: 5", mustContain: ['sprintf'] },
    ],
  },
  w13l3: {
    id: 'w13l3', unit: 'w13', title: 'Command-line Arguments', icon: '🧵', xp: XP.LESSON,
    introLines: [
      "int main(int argc, char* argv[]) receives arguments passed when the program was run.",
      "argc is the count of arguments; argv[0] is the program's own name.",
      "argv[1], argv[2], ... are the actual arguments passed by the user.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "What does argc represent?", options: [
        "The number of command-line arguments, including the program name", "The program's exit code", "The first argument's length", "Nothing useful" ], answer: 0 },
      { type: 'mcq', prompt: "What is argv[0] typically?", options: [ "The program's own name/path", "The first real argument", "Always NULL", "The last argument" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "argv[1] is the first argument the user actually passed, after the program name.", answer: true },
      { type: 'truefalse', prompt: "int main(int argc, char* argv[]) is a standard way to accept command-line arguments in C.", answer: true },
      { type: 'match', prompt: "Match each part to its meaning.", pairs: [
        ["argc", "Count of arguments"], ["argv[0]", "The program's own name"],
      ] },
      { type: 'code', prompt: "This sandbox runs with no extra arguments, so argc is always 1. Just printf argc with %d to confirm.",
        starter: "#include <stdio.h>\n\nint main(int argc, char* argv[]) {\n    // your code here\n    return 0;\n}",
        expected: "1", mustContain: ['argc'] },
    ],
  },
  w13quiz: {
    id: 'w13quiz', unit: 'w13', title: 'Unit 13 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — String Handling.", "string.h, manual building, command-line arguments.", "Let's see what stuck." ],
    questions: [
      { type: 'mcq', prompt: "What does strlen(s) return?", options: [ "The number of characters before the null terminator", "The memory address", "Always 0", "A boolean" ], answer: 0 },
      { type: 'mcq', prompt: "What does strcmp return when two strings are equal?", options: [ "0", "1", "-1", "true" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What does sprintf write into?", options: [ "A buffer in memory", "The console", "A file", "Nothing" ], answer: 0 },
      { type: 'truefalse', prompt: "strcat appends one string onto the end of another.", answer: true },
      { type: 'truefalse', hard: true, prompt: "argv[0] is typically the program's own name.", answer: true },
      { type: 'truefalse', hard: true, prompt: "You must ensure buffers are large enough before writing into them with strcat/sprintf.", answer: true },
      { type: 'match', prompt: "Match each function to its purpose.", pairs: [
        ["strlen", "String length"], ["strcpy", "Copies a string"], ["sprintf", "Builds a formatted string"],
      ] },
      { type: 'code', prompt: "char s[] = \"world\"; Printf strlen(s) with %d.",
        starter: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"world\";\n    // your code here\n    return 0;\n}",
        expected: "5", mustContain: ['strlen'] },
    ],
  },

  // UNIT 14 — Standard Library & Best Practices
  w14l1: {
    id: 'w14l1', unit: 'w14', title: 'The C Standard Library', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "stdlib.h, math.h, time.h, and friends provide ready-made tools beyond stdio.h.",
      "sqrt() needs math.h; rand() needs stdlib.h; both are used constantly in real C code.",
      "Knowing which header a function lives in is half the battle in C.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Which header provides sqrt()?", options: [ "math.h", "stdio.h", "string.h", "time.h" ], answer: 0 },
      { type: 'mcq', prompt: "Which header provides rand()?", options: [ "stdlib.h", "math.h", "stdio.h", "string.h" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Different standard library functions live in different headers, which you must include.", answer: true },
      { type: 'truefalse', prompt: "math.h is part of C's standard library.", answer: true },
      { type: 'match', prompt: "Match each header to what it provides.", pairs: [
        ["math.h", "Math functions like sqrt"], ["stdlib.h", "Utilities like malloc, rand"],
      ] },
      { type: 'code', prompt: "Import math.h and printf sqrt(16.0) with %.0f (0 decimal places).",
        starter: "#include <stdio.h>\n#include <math.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "4", mustContain: ['sqrt'] },
    ],
  },
  w14l2: {
    id: 'w14l2', unit: 'w14', title: 'Error Handling with errno', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "C has no exceptions — many standard functions signal failure by setting the global errno.",
      "Check a function's return value first (like fopen returning NULL), then inspect errno for why.",
      "perror(\"context\") prints a human-readable message for the current errno value.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "How does C typically signal a standard library failure, lacking exceptions?", options: [
        "Through a return value (like NULL) plus the global errno variable", "By throwing an exception", "By crashing immediately, always", "It can't signal failure at all" ], answer: 0 },
      { type: 'mcq', prompt: "What does perror(\"context\") do?", options: [
        "Prints a human-readable message describing the current errno", "Sets errno to 0", "Deletes the error", "Only works with files" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "You should check a function's return value before relying on errno being meaningful.", answer: true },
      { type: 'truefalse', prompt: "errno is a global variable used across the C standard library to report error codes.", answer: true },
      { type: 'match', prompt: "Match each concept to its role.", pairs: [
        ["errno", "Global error code variable"], ["perror", "Prints a message for the current errno"],
      ] },
      { type: 'code', prompt: "This is conceptual — just printf <code>noted</code> to confirm you read the lesson.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "noted", mustContain: ['printf'] },
    ],
  },
  w14l3: {
    id: 'w14l3', unit: 'w14', title: 'Writing Portable C', icon: '🚀', xp: XP.LESSON,
    introLines: [
      "Not every compiler or platform behaves identically — writing portable C avoids relying on undefined behavior.",
      "Stick to the standard library and well-defined behavior rather than compiler-specific tricks.",
      "Testing on multiple compilers (or at least with warnings turned way up) catches many portability bugs early.",
    ],
    questions: [
      { type: 'mcq', required: true, prompt: "Why avoid relying on undefined behavior in C?", options: [
        "Different compilers/platforms may handle it differently or unpredictably", "It always causes an immediate crash everywhere", "The compiler will always reject it", "It has no real consequences" ], answer: 0 },
      { type: 'mcq', prompt: "What's a good practice for catching portability bugs early?", options: [
        "Compiling with warnings turned way up", "Ignoring all warnings", "Only testing on one machine, once", "Avoiding the standard library" ], answer: 0 },
      { type: 'truefalse', hard: true, prompt: "Relying on compiler-specific behavior can break code when compiled elsewhere.", answer: true },
      { type: 'truefalse', prompt: "Sticking to well-defined, standard behavior improves portability.", answer: true },
      { type: 'match', prompt: "Match each practice to its benefit.", pairs: [
        ["High warning levels", "Catches portability bugs early"], ["Avoiding undefined behavior", "More predictable across platforms"],
      ] },
      { type: 'code', prompt: "This is conceptual — just printf <code>noted</code> to confirm you read the lesson.",
        starter: "#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "noted", mustContain: ['printf'] },
    ],
  },
  w14quiz: {
    id: 'w14quiz', unit: 'w14', title: 'Unit 14 Quiz', icon: '🏆', xp: XP.QUIZ, isQuiz: true, sampleSize: 7,
    introLines: [ "Compiled quiz — Standard Library & Best Practices.", "Headers, errno, portability.", "This is the final quiz on the roadmap to CLP." ],
    questions: [
      { type: 'mcq', prompt: "Which header provides sqrt()?", options: [ "math.h", "stdio.h", "string.h", "stdlib.h" ], answer: 0 },
      { type: 'mcq', prompt: "How does C typically signal standard library failure?", options: [ "Return value plus errno", "Exceptions", "Automatic crash", "It can't" ], answer: 0 },
      { type: 'mcq', hard: true, prompt: "What helps catch portability bugs early?", options: [ "High compiler warning levels", "Ignoring warnings", "Undefined behavior", "Nothing helps" ], answer: 0 },
      { type: 'truefalse', prompt: "errno is a global variable used to report standard library error codes.", answer: true },
      { type: 'truefalse', hard: true, prompt: "perror() prints a human-readable message for the current errno.", answer: true },
      { type: 'truefalse', hard: true, prompt: "Relying on undefined behavior is safe across all compilers.", answer: false },
      { type: 'match', prompt: "Match each concept to its description.", pairs: [
        ["errno", "Global error code"], ["perror", "Prints error message"], ["Portability", "Works consistently across platforms"],
      ] },
      { type: 'code', prompt: "Import math.h and printf sqrt(9.0) with %.0f (0 decimal places).",
        starter: "#include <stdio.h>\n#include <math.h>\n\nint main() {\n    // your code here\n    return 0;\n}",
        expected: "3", mustContain: ['sqrt'] },
    ],
  },
};

const C_STUB_LESSONS = {};

const C_UNITS = [
  { id: 'w1', tier: 'cla', title: 'First Contact', icon: '👾', lessons: ['w1l1','w1l2','w1l3','w1quiz'] },
  { id: 'w2', tier: 'cla', title: 'Operators & Expressions', icon: '⚡', lessons: ['w2l1','w2l2','w2l3','w2quiz'] },
  { id: 'w3', tier: 'cla', title: 'Making Decisions', icon: '🔀', lessons: ['w3l1','w3l2','w3l3','w3quiz'] },
  { id: 'w4', tier: 'cla', title: 'Loops', icon: '🔁', lessons: ['w4l1','w4l2','w4l3','w4quiz'] },
  { id: 'w5', tier: 'cla', title: 'Arrays', icon: '📚', lessons: ['w5l1','w5l2','w5l3','w5quiz'] },
  { id: 'w6', tier: 'cla', title: 'Functions', icon: '🧩', lessons: ['w6l1','w6l2','w6l3','w6quiz'] },
  { id: 'w7', tier: 'cla', title: 'Pointers', icon: '🎯', lessons: ['w7l1','w7l2','w7l3','w7quiz'] },
  { id: 'w8', tier: 'clp', title: 'Structs & Unions', icon: '🧱', lessons: ['w8l1','w8l2','w8l3','w8quiz'] },
  { id: 'w9', tier: 'clp', title: 'Dynamic Memory', icon: '🧠', lessons: ['w9l1','w9l2','w9l3','w9quiz'] },
  { id: 'w10', tier: 'clp', title: 'File I/O', icon: '🗂️', lessons: ['w10l1','w10l2','w10l3','w10quiz'] },
  { id: 'w11', tier: 'clp', title: 'The Preprocessor', icon: '📜', lessons: ['w11l1','w11l2','w11l3','w11quiz'] },
  { id: 'w12', tier: 'clp', title: 'Advanced Pointers', icon: '🧿', lessons: ['w12l1','w12l2','w12l3','w12quiz'] },
  { id: 'w13', tier: 'clp', title: 'String Handling', icon: '🧵', lessons: ['w13l1','w13l2','w13l3','w13quiz'] },
  { id: 'w14', tier: 'clp', title: 'Standard Library & Best Practices', icon: '🚀', lessons: ['w14l1','w14l2','w14l3','w14quiz'] },
];

const C_PREREQS = {
  w1l1: [], w1l2: ['w1l1'], w1l3: ['w1l2'], w1quiz: ['w1l3'],
  w2l1: ['w1quiz'], w2l2: ['w2l1'], w2l3: ['w2l2'], w2quiz: ['w2l3'],
  w3l1: ['w2quiz'], w3l2: ['w3l1'], w3l3: ['w3l2'], w3quiz: ['w3l3'],
  w4l1: ['w3quiz'], w4l2: ['w4l1'], w4l3: ['w4l2'], w4quiz: ['w4l3'],
  w5l1: ['w4quiz'], w5l2: ['w5l1'], w5l3: ['w5l2'], w5quiz: ['w5l3'],
  w6l1: ['w5quiz'], w6l2: ['w6l1'], w6l3: ['w6l2'], w6quiz: ['w6l3'],
  w7l1: ['w6quiz'], w7l2: ['w7l1'], w7l3: ['w7l2'], w7quiz: ['w7l3'],
  w8l1: ['w7quiz'], w8l2: ['w8l1'], w8l3: ['w8l2'], w8quiz: ['w8l3'],
  w9l1: ['w8quiz'], w9l2: ['w9l1'], w9l3: ['w9l2'], w9quiz: ['w9l3'],
  w10l1: ['w9quiz'], w10l2: ['w10l1'], w10l3: ['w10l2'], w10quiz: ['w10l3'],
  w11l1: ['w10quiz'], w11l2: ['w11l1'], w11l3: ['w11l2'], w11quiz: ['w11l3'],
  w12l1: ['w11quiz'], w12l2: ['w12l1'], w12l3: ['w12l2'], w12quiz: ['w12l3'],
  w13l1: ['w12quiz'], w13l2: ['w13l1'], w13l3: ['w13l2'], w13quiz: ['w13l3'],
  w14l1: ['w13quiz'], w14l2: ['w14l1'], w14l3: ['w14l2'], w14quiz: ['w14l3'],
};

const C_TREE_LAYOUT = {
  w1l1: { col: 0, row: 0 }, w1l2: { col: 0, row: 1 }, w1l3: { col: 0, row: 2 }, w1quiz: { col: 0, row: 3 },
  w2l1: { col: 0, row: 4 }, w2l2: { col: 0, row: 5 }, w2l3: { col: 0, row: 6 }, w2quiz: { col: 0, row: 7 },
  w3l1: { col: 0, row: 8 }, w3l2: { col: 0, row: 9 }, w3l3: { col: 0, row: 10 }, w3quiz: { col: 0, row: 11 },
  w4l1: { col: 0, row: 12 }, w4l2: { col: 0, row: 13 }, w4l3: { col: 0, row: 14 }, w4quiz: { col: 0, row: 15 },
  w5l1: { col: 0, row: 16 }, w5l2: { col: 0, row: 17 }, w5l3: { col: 0, row: 18 }, w5quiz: { col: 0, row: 19 },
  w6l1: { col: 0, row: 20 }, w6l2: { col: 0, row: 21 }, w6l3: { col: 0, row: 22 }, w6quiz: { col: 0, row: 23 },
  w7l1: { col: 0, row: 24 }, w7l2: { col: 0, row: 25 }, w7l3: { col: 0, row: 26 }, w7quiz: { col: 0, row: 27 },
  cp_cla: { col: 0, row: 28 },
  w8l1: { col: 0, row: 29 }, w8l2: { col: 0, row: 30 }, w8l3: { col: 0, row: 31 }, w8quiz: { col: 0, row: 32 },
  w9l1: { col: 0, row: 33 }, w9l2: { col: 0, row: 34 }, w9l3: { col: 0, row: 35 }, w9quiz: { col: 0, row: 36 },
  w10l1: { col: 0, row: 37 }, w10l2: { col: 0, row: 38 }, w10l3: { col: 0, row: 39 }, w10quiz: { col: 0, row: 40 },
  w11l1: { col: 0, row: 41 }, w11l2: { col: 0, row: 42 }, w11l3: { col: 0, row: 43 }, w11quiz: { col: 0, row: 44 },
  w12l1: { col: 0, row: 45 }, w12l2: { col: 0, row: 46 }, w12l3: { col: 0, row: 47 }, w12quiz: { col: 0, row: 48 },
  w13l1: { col: 0, row: 49 }, w13l2: { col: 0, row: 50 }, w13l3: { col: 0, row: 51 }, w13quiz: { col: 0, row: 52 },
  w14l1: { col: 0, row: 53 }, w14l2: { col: 0, row: 54 }, w14l3: { col: 0, row: 55 }, w14quiz: { col: 0, row: 56 },
  cp_clp: { col: 0, row: 57 },
};

const C_TREE_EDGES = [
  ['w1l1','w1l2'], ['w1l2','w1l3'], ['w1l3','w1quiz'],
  ['w1quiz','w2l1'], ['w2l1','w2l2'], ['w2l2','w2l3'], ['w2l3','w2quiz'],
  ['w2quiz','w3l1'], ['w3l1','w3l2'], ['w3l2','w3l3'], ['w3l3','w3quiz'],
  ['w3quiz','w4l1'], ['w4l1','w4l2'], ['w4l2','w4l3'], ['w4l3','w4quiz'],
  ['w4quiz','w5l1'], ['w5l1','w5l2'], ['w5l2','w5l3'], ['w5l3','w5quiz'],
  ['w5quiz','w6l1'], ['w6l1','w6l2'], ['w6l2','w6l3'], ['w6l3','w6quiz'],
  ['w6quiz','w7l1'], ['w7l1','w7l2'], ['w7l2','w7l3'], ['w7l3','w7quiz'],
  ['w7quiz','cp_cla'], ['cp_cla','w8l1'],
  ['w8l1','w8l2'], ['w8l2','w8l3'], ['w8l3','w8quiz'],
  ['w8quiz','w9l1'], ['w9l1','w9l2'], ['w9l2','w9l3'], ['w9l3','w9quiz'],
  ['w9quiz','w10l1'], ['w10l1','w10l2'], ['w10l2','w10l3'], ['w10l3','w10quiz'],
  ['w10quiz','w11l1'], ['w11l1','w11l2'], ['w11l2','w11l3'], ['w11l3','w11quiz'],
  ['w11quiz','w12l1'], ['w12l1','w12l2'], ['w12l2','w12l3'], ['w12l3','w12quiz'],
  ['w12quiz','w13l1'], ['w13l1','w13l2'], ['w13l2','w13l3'], ['w13l3','w13quiz'],
  ['w13quiz','w14l1'], ['w14l1','w14l2'], ['w14l2','w14l3'], ['w14l3','w14quiz'],
  ['w14quiz','cp_clp'],
];

const C_UNIT_LABEL_ANCHOR = {
  w1: 'w1l1', w2: 'w2l1', w3: 'w3l1', w4: 'w4l1', w5: 'w5l1', w6: 'w6l1', w7: 'w7l1',
  w8: 'w8l1', w9: 'w9l1', w10: 'w10l1', w11: 'w11l1', w12: 'w12l1', w13: 'w13l1', w14: 'w14l1',
};

registerCurriculum('c', {
  LESSONS: C_LESSONS, STUB_LESSONS: C_STUB_LESSONS, UNITS: C_UNITS, PREREQS: C_PREREQS,
  TREE_LAYOUT: C_TREE_LAYOUT, TREE_EDGES: C_TREE_EDGES, UNIT_LABEL_ANCHOR: C_UNIT_LABEL_ANCHOR,
});

CERT_CHECKPOINTS.c = [
  { id: 'cp_cla', afterUnit: 'w7', name: 'CLA', fullName: 'C Certified Associate Programmer (C Institute)', icon: '🎓' },
  { id: 'cp_clp', afterUnit: 'w14', name: 'CLP', fullName: 'C Certified Professional Programmer (C Institute)', icon: '🏆' },
];
