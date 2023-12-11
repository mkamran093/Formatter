class Parser {
  constructor(input) {
    this.tokens = this.tokenize(input);
    this.currentToken = 0;
  }

  // Tokenize the input code
  tokenize(input) {
    return input.match(/\w+|[^\w\s]/g);
  }

  // Helper function to match the current token
  match(expected) {
    if (this.tokens[this.currentToken] === expected) {
      this.currentToken++;
    } else {
      try {
        throw new Error(`Unexpected token: ${this.tokens[this.currentToken]}`);
      } catch (error) {}
    }
  }

  // Start parsing
  parse() {
    this.program();
    if (this.currentToken < this.tokens.length) {
      try {
        throw new Error("Unexpected tokens at the end of the input");
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  // CFG production rules
  program() {
    while (this.tokens[this.currentToken]) {
      this.statement();
    }
  }

  statement() {
    if (this.tokens[this.currentToken] === "if") {
      this.ifStatement();
    } else if (this.tokens[this.currentToken] === "while") {
      this.whileStatement();
    } else if (this.tokens[this.currentToken] === "for") {
      this.forStatement();
    } else if (this.tokens[this.currentToken] === "{") {
      this.blockStatement();
    } else {
      this.expressionStatement();
    }
  }

  ifStatement() {
    this.match("if");
    this.match("(");
    this.condition();
    this.match(")");
    this.statement();
    if (this.tokens[this.currentToken] === "else") {
      this.match("else");
      this.statement();
    }
  }

  whileStatement() {
    this.match("while");
    this.match("(");
    this.condition();
    this.match(")");
    this.statement();
  }

  forStatement() {
    this.match("for");
    this.match("(");
    this.expressionStatement();
    this.condition();
    this.match(";");
    this.expressionStatement();
    this.match(")");
    this.statement();
  }

  expressionStatement() {
    this.expression();
    this.match(";");
  }

  blockStatement() {
    this.match("{");
    this.program();
    this.match("}");
  }

  expression() {
    if (this.tokens[this.currentToken].match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
      this.variable();
      if (this.tokens[this.currentToken] === "=") {
        this.match("=");
        this.value();
      }
    } else {
      this.value();
    }
  }

  condition() {
    this.value();
    if (this.tokens[this.currentToken] === "==") {
      this.match("==");
      this.value();
    } else if (this.tokens[this.currentToken] === "!=") {
      this.match("!=");
      this.value();
    } else {
      try {
        throw new Error("Invalid condition");
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  variable() {
    this.match(/[a-zA-Z_][a-zA-Z0-9_]*/);
  }

  value() {
    if (this.tokens[this.currentToken].match(/[0-9]+/)) {
      this.match(/[0-9]+/);
    } else if (this.tokens[this.currentToken].match(/".*"/)) {
      this.match(/".*"/);
    } else {
      this.identifier();
    }
  }

  identifier() {
    this.match(/[a-zA-Z_][a-zA-Z0-9_]*/);
  }
}

// Example usage
const inputCode = `
    for (i = 0; i < 10; i++)
    {
      if (i == 5)      {
        console.log("i is 5");      }else
      {
        console.log("i is not 5");
      }
    }
  `;

const parser = new Parser(inputCode);
parser.parse();
console.log("Parsing successful!");
