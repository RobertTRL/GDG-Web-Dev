/* =====================================================================
   CALCULATOR — starter code

   PART 1 (logic)       → finished. Pure JavaScript, no DOM in here.
   PART 2 (DOM + events) → your exercise.
   ===================================================================== */


/* =====================================================================
   PART 1: LOGIC (already done)
   ===================================================================== */

const OPERATORS = ["+", "−", "×", "÷"];

// Lets you pass keyboard characters straight into press()
const ALIASES = { "-": "−", "*": "×", "/": "÷" };

let expression = "";        // everything the user has typed so far
let justEvaluated = false;  // true right after "=" was pressed

const isDigit = (ch) => ch >= "0" && ch <= "9";
const isOperator = (ch) => OPERATORS.includes(ch);
const countOf = (text, ch) => text.split(ch).length - 1;


/* ---- Typing rules: decides what happens when a key is pressed ---- */

function applyInput(expr, ch) {
  const last = expr.slice(-1);

  // Digits: (2+3)4 becomes (2+3)×4
  if (isDigit(ch)) {
    return last === ")" ? expr + "×" + ch : expr + ch;
  }

  // Dot: only one per number, and ".5" becomes "0.5"
  if (ch === ".") {
    const current = expr.match(/[\d.]*$/)[0];
    if (current.includes(".")) return expr;
    if (current === "") return expr + (last === ")" ? "×0." : "0.");
    return expr + ".";
  }

  // Operators: no doubles (the new one replaces the old one),
  // and a leading minus is allowed as a sign: −5 or (−5
  if (isOperator(ch)) {
    if (expr === "") return ch === "−" ? ch : expr;
    if (last === "(") return ch === "−" ? expr + ch : expr;
    if (isOperator(last)) {
      const before = expr.slice(0, -1);
      const isSign = before === "" || before.slice(-1) === "(";
      return isSign ? expr : before + ch;
    }
    return expr + ch;
  }

  // Opening bracket: 2( becomes 2×(
  if (ch === "(") {
    if (last === ".") return expr;
    return isDigit(last) || last === ")" ? expr + "×(" : expr + "(";
  }

  // Closing bracket: only if there is one open and we just finished a value
  if (ch === ")") {
    const open = countOf(expr, "(") - countOf(expr, ")");
    return open > 0 && (isDigit(last) || last === ")") ? expr + ")" : expr;
  }

  return expr;
}


/* ---- Maths: a small parser, so we never need eval() ---- */

function evaluate(expr) {
  // Tidy up: drop dangling operators / dots / "(", then close open brackets
  let source = expr;
  while (/[+−×÷.(]$/.test(source)) source = source.slice(0, -1);
  source += ")".repeat(countOf(source, "(") - countOf(source, ")"));

  const tokens = source.match(/\d+\.?\d*|[+−×÷()]/g) || [];
  if (tokens.join("") !== source) throw new Error("Unexpected character");

  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  // expression = term (("+" | "−") term)*
  function parseExpression() {
    let value = parseTerm();
    while (peek() === "+" || peek() === "−") {
      const op = next();
      const right = parseTerm();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  }

  // term = factor (("×" | "÷") factor)*
  function parseTerm() {
    let value = parseFactor();
    while (peek() === "×" || peek() === "÷") {
      const op = next();
      const right = parseFactor();
      if (op === "÷" && right === 0) throw new Error("Division by zero");
      value = op === "×" ? value * right : value / right;
    }
    return value;
  }

  // factor = number | "(" expression ")" | "−" factor
  function parseFactor() {
    const token = next();
    if (token === "−") return -parseFactor();
    if (token === "(") {
      const value = parseExpression();
      if (next() !== ")") throw new Error("Missing )");
      return value;
    }
    const number = parseFloat(token);
    if (Number.isNaN(number)) throw new Error("Bad input");
    return number;
  }

  const result = parseExpression();
  if (pos < tokens.length) throw new Error("Unexpected input");
  return formatNumber(result);
}

function formatNumber(n) {
  if (!Number.isFinite(n)) throw new Error("Not a finite number");
  const text = String(parseFloat(n.toPrecision(12))); // hides 0.1 + 0.2 noise
  return text.startsWith("-") ? "−" + text.slice(1) : text;
}


/* ---- Actions: call these from your event handlers ---- */

// A value key was pressed: 0-9 . ( ) + − × ÷   (also accepts - * /)
function press(value) {
  value = ALIASES[value] ?? value;

  if (expression === "Error") expression = "";

  if (justEvaluated) {
    if (isDigit(value) || value === "." || value === "(") expression = "";
    justEvaluated = false;
  }

  expression = applyInput(expression, value);
}

// AC
function clearAll() {
  expression = "";
  justEvaluated = false;
}

// Delete one character
function backspace() {
  expression = expression === "Error" ? "" : expression.slice(0, -1);
  justEvaluated = false;
}

// =
function equals() {
  if (expression === "" || expression === "Error") return;
  try {
    expression = evaluate(expression);
    justEvaluated = true;
  } catch {
    expression = "Error";
    justEvaluated = false;
  }
}


/* =====================================================================
   PART 2: DOM + EVENTS (your turn)

   The logic above keeps track of `expression` for you.
   Your job: show it on screen and wire the buttons to the actions.
   ===================================================================== */

// TODO 1 — Select the elements you need
//   • the <span id="expression"> that shows the text
//   • the <div id="keypad"> that holds all the buttons


// TODO 2 — Write render()
//   Put the current `expression` into the display.
function render() {
  // ...
}


// TODO 3 — Handle clicks on the keypad
//   Use ONE listener on the keypad (event delegation), not one per button.
//   Inside the handler:
//     1. Find the button that was clicked (hint: event.target.closest("button")).
//        If the click wasn't on a button, do nothing.
//     2. Read its data attributes (hint: element.dataset).
//          data-action → "clear" | "delete" | "equals"
//                        → call clearAll() / backspace() / equals()
//          data-value  → call press(value)
//     3. Call render() so the display updates.


// TODO 4 — Call render() once when the page loads,
//   so the display starts in sync with `expression`.


// BONUS A — Keyboard support
//   Listen for "keydown" on document.
//     • 0-9 . ( ) + - * /  → press(event.key)
//     • Enter or =          → equals()   (Enter can trigger a focused button, so preventDefault!)
//     • Backspace           → backspace()
//     • Escape              → clearAll()
//   Then render().


// BONUS B — Show the key press
//   When a key is pressed on the keyboard, add the class "is-pressed" to the matching
//   button for ~120ms, then remove it (hint: querySelector with an attribute selector,
//   setTimeout). Remember the buttons use × ÷ −, and ALIASES maps the keyboard's * / -.