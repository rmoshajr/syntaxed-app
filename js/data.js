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

const XP = { LESSON: 10, QUIZ: 20 };

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
};

// ---- Stub / roadmap lessons (not yet built — shown locked in the skill tree) ----
const STUB_LESSONS = {
  u3l1: { id: 'u3l1', unit: 'u3', title: 'If Statements', icon: '🔀' },
  u3l2: { id: 'u3l2', unit: 'u3', title: 'If / Else / Elif', icon: '🔀' },
  u3l3: { id: 'u3l3', unit: 'u3', title: 'Nested Conditionals', icon: '🔀' },
  u4l1: { id: 'u4l1', unit: 'u4', title: 'While Loops', icon: '🔁' },
  u4l2: { id: 'u4l2', unit: 'u4', title: 'For Loops', icon: '🔁' },
  u4l3: { id: 'u4l3', unit: 'u4', title: 'Loop Control', icon: '🔁' },
  u5l1: { id: 'u5l1', unit: 'u5', title: 'Defining Functions', icon: '🧩' },
  u5l2: { id: 'u5l2', unit: 'u5', title: 'Parameters & Arguments', icon: '🧩' },
  u5l3: { id: 'u5l3', unit: 'u5', title: 'Return Values', icon: '🧩' },
  u6l1: { id: 'u6l1', unit: 'u6', title: 'Lists', icon: '📚' },
  u6l2: { id: 'u6l2', unit: 'u6', title: 'Dictionaries', icon: '📚' },
  u6l3: { id: 'u6l3', unit: 'u6', title: 'Tuples & Sets', icon: '📚' },
  u7l1: { id: 'u7l1', unit: 'u7', title: 'String Methods', icon: '🧵' },
  u7l2: { id: 'u7l2', unit: 'u7', title: 'String Formatting', icon: '🧵' },
  u8l1: { id: 'u8l1', unit: 'u8', title: 'Handling Errors', icon: '🧯' },
  u8l2: { id: 'u8l2', unit: 'u8', title: 'Reading & Writing Files', icon: '🧯' },
};

const UNITS = [
  { id: 'u1', tier: 'entry', title: 'First Contact', icon: '👾', lessons: ['u1l1','u1l2','u1l3','u1l4','u1quiz'] },
  { id: 'u2', tier: 'entry', title: 'Operators & Expressions', icon: '⚡', lessons: ['u2l1','u2l2','u2l3','u2l4','u2quiz'] },
  { id: 'u3', tier: 'entry', title: 'Making Decisions', icon: '🔀', comingSoon: true, lessons: ['u3l1','u3l2','u3l3'] },
  { id: 'u4', tier: 'entry', title: 'Loops', icon: '🔁', comingSoon: true, lessons: ['u4l1','u4l2','u4l3'] },
  { id: 'u5', tier: 'associate', title: 'Functions', icon: '🧩', comingSoon: true, lessons: ['u5l1','u5l2','u5l3'] },
  { id: 'u6', tier: 'associate', title: 'Data Structures', icon: '📚', comingSoon: true, lessons: ['u6l1','u6l2','u6l3'] },
  { id: 'u7', tier: 'associate', title: 'Working with Strings', icon: '🧵', comingSoon: true, lessons: ['u7l1','u7l2'] },
  { id: 'u8', tier: 'associate', title: 'Files & Errors', icon: '🧯', comingSoon: true, lessons: ['u8l1','u8l2'] },
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
};

// ---- Skill-tree graph layout (visual only — locking logic stays driven by PREREQS) ----
// col: horizontal grid position (0 = center); row: depth level (top to bottom).
const TREE_LAYOUT = {
  u1l1: { col: 0, row: 0 }, u1l2: { col: 0, row: 1 },
  u1l3: { col: -1, row: 2 }, u1l4: { col: 1, row: 2 },
  u1quiz: { col: 0, row: 3 },
  u2l1: { col: 0, row: 4 }, u2l2: { col: 0, row: 5 },
  u2l3: { col: -1, row: 6 }, u2l4: { col: 1, row: 6 },
  u2quiz: { col: 0, row: 7 },
  u3l1: { col: 0, row: 8 }, u3l2: { col: 0, row: 9 }, u3l3: { col: 0, row: 10 },
  u4l1: { col: 0, row: 11 }, u4l2: { col: 0, row: 12 }, u4l3: { col: 0, row: 13 },
  u5l1: { col: 0, row: 14 }, u5l2: { col: 0, row: 15 }, u5l3: { col: 0, row: 16 },
  u6l1: { col: -2, row: 17 }, u6l2: { col: -2, row: 18 }, u6l3: { col: -2, row: 19 },
  u7l1: { col: 0, row: 17 }, u7l2: { col: 0, row: 18 },
  u8l1: { col: 2, row: 17 }, u8l2: { col: 2, row: 18 },
};

// Visual parent->child connections (superset of PREREQS — includes the roadmap chain too).
const TREE_EDGES = [
  ['u1l1','u1l2'], ['u1l2','u1l3'], ['u1l2','u1l4'], ['u1l3','u1quiz'], ['u1l4','u1quiz'],
  ['u1quiz','u2l1'], ['u2l1','u2l2'], ['u2l2','u2l3'], ['u2l2','u2l4'], ['u2l3','u2quiz'], ['u2l4','u2quiz'],
  ['u2quiz','u3l1'], ['u3l1','u3l2'], ['u3l2','u3l3'], ['u3l3','u4l1'], ['u4l1','u4l2'], ['u4l2','u4l3'],
  ['u4l3','u5l1'], ['u5l1','u5l2'], ['u5l2','u5l3'], ['u5l3','u6l1'], ['u5l3','u7l1'], ['u5l3','u8l1'],
  ['u6l1','u6l2'], ['u6l2','u6l3'], ['u7l1','u7l2'], ['u8l1','u8l2'],
];

// Which lesson node anchors each unit's floating label in the tree.
const UNIT_LABEL_ANCHOR = { u1: 'u1l1', u2: 'u2l1', u3: 'u3l1', u4: 'u4l1', u5: 'u5l1', u6: 'u6l1', u7: 'u7l1', u8: 'u8l1' };

function getLesson(id) { return LESSONS[id] || STUB_LESSONS[id] || null; }
function isPlayable(id) { return !!LESSONS[id]; }

// Collect all prerequisite lesson ids (recursively) for a given lesson.
function collectPrereqs(lessonId, seen) {
  seen = seen || new Set();
  const direct = PREREQS[lessonId] || [];
  direct.forEach(id => { if (!seen.has(id)) { seen.add(id); collectPrereqs(id, seen); } });
  return Array.from(seen);
}

// Gather every "hard" (test-out-eligible) question from a set of lesson ids.
function collectHardQuestions(lessonIds) {
  const out = [];
  lessonIds.forEach(id => {
    const lesson = LESSONS[id];
    if (!lesson) return;
    lesson.questions.filter(q => q.hard && q.type !== 'code').forEach(q => out.push({ ...q, sourceLesson: id }));
  });
  return out;
}

// Placement test pulls only multiple-choice and code (compiling) questions — no true/false.
function collectPlacementQuestions(lessonIds) {
  const out = [];
  lessonIds.forEach(id => {
    const lesson = LESSONS[id];
    if (!lesson) return;
    lesson.questions.filter(q => q.type === 'mcq' || q.type === 'code').forEach(q => out.push({ ...q, sourceLesson: id }));
  });
  return out;
}
