import React, { useState, useCallback, useEffect } from "react";
import { evaluate } from "@huvrdata/evaluate";

const DEFAULT_EXPRESSION = `IF(
  SUM($values.a, $values.b) > $values.c,
  COALESCE($values.success_message, "success"),
  COALESCE($values.failure_message, "failure")
)`;

const DEFAULT_CONTEXT = JSON.stringify(
  {
    $values: {
      a: 2,
      b: 4,
      c: 5,
      failure_message: "A + B < C",
      success_message: "A + B > C",
    },
  },
  null,
  2
);

const EXAMPLES = [
  {
    name: "COALESCE",
    description:
      "Returns the first defined (non-undefined) argument. Useful for providing fallback values.",
    expression: `COALESCE($values.missing, $values.fallback, "default")`,
    context: JSON.stringify(
      { $values: { fallback: "found it!" } },
      null,
      2
    ),
  },
  {
    name: "BADGE",
    description:
      "Returns the length of an array formatted with optional prefix and postfix. Returns empty string for non-arrays or empty arrays.",
    expression: `BADGE($values.items, "(", " items)")`,
    context: JSON.stringify(
      { $values: { items: ["apple", "banana", "cherry"] } },
      null,
      2
    ),
  },
  {
    name: "HLOOKUP",
    description:
      "Finds an object in an array by matching a key, then returns a different property. Signature: HLOOKUP(data, value, matchKey, returnKey, notFound).",
    expression: `HLOOKUP($values.options, 2, "value", "label", "Not Found")`,
    context: JSON.stringify(
      {
        $values: {
          options: [
            { value: 1, label: "Low" },
            { value: 2, label: "Medium" },
            { value: 3, label: "High" },
          ],
        },
      },
      null,
      2
    ),
  },
];

function App() {
  const [expression, setExpression] = useState(DEFAULT_EXPRESSION);
  const [context, setContext] = useState(DEFAULT_CONTEXT);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyExpression = useCallback(() => {
    navigator.clipboard.writeText(expression).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [expression]);

  const runEvaluate = useCallback(() => {
    setError(null);
    setResult(null);
    try {
      const parsed = JSON.parse(context);
      const res = evaluate(expression, parsed);
      setResult(typeof res === "string" ? res : JSON.stringify(res, null, 2));
    } catch (err) {
      setError(err.message || String(err));
    }
  }, [expression, context]);

  useEffect(() => {
    runEvaluate();
  }, []);

  const handleTryIt = useCallback(
    (example) => {
      setExpression(example.expression);
      setContext(example.context);
      // Evaluate after state updates via a microtask
      setTimeout(() => {
        try {
          const parsed = JSON.parse(example.context);
          const res = evaluate(example.expression, parsed);
          setResult(
            typeof res === "string" ? res : JSON.stringify(res, null, 2)
          );
          setError(null);
        } catch (err) {
          setResult(null);
          setError(err.message || String(err));
        }
      }, 0);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runEvaluate();
      }
    },
    [runEvaluate]
  );

  return (
    <div className="container">
      <header className="header">
        <h1>@huvrdata/evaluate</h1>
        <p className="subtitle">
          Interactive playground for the{" "}
          <a
            href="https://github.com/huvrdata/evaluate"
            target="_blank"
            rel="noopener noreferrer"
          >
            @huvrdata/evaluate
          </a>{" "}
          library. Evaluate expressions using{" "}
          <a
            href="https://formulajs.info/functions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            formulajs
          </a>
          ,{" "}
          <a
            href="https://mathjs.org/docs/reference/functions.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            mathjs
          </a>
          , and custom functions with JSON context.
        </p>
      </header>

      <section className="card">
        <h2>Playground</h2>
        <div className="editor-grid" onKeyDown={handleKeyDown}>
          <div className="editor-pane">
            <div className="label-row">
              <label htmlFor="expression">Expression</label>
              <button className="btn-copy" onClick={copyExpression}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              id="expression"
              className="code-editor"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              spellCheck={false}
              rows={6}
            />
          </div>
          <div className="editor-pane">
            <label htmlFor="context">Context (JSON)</label>
            <textarea
              id="context"
              className="code-editor"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              spellCheck={false}
              rows={6}
            />
          </div>
        </div>
        <div className="actions">
          <button className="btn-evaluate" onClick={runEvaluate}>
            Evaluate
          </button>
          <span className="hint">Ctrl+Enter / Cmd+Enter</span>
        </div>

        {result !== null && (
          <div className="result result-success">
            <strong>Result:</strong>
            <pre>{result}</pre>
          </div>
        )}
        {error && (
          <div className="result result-error">
            <strong>Error:</strong>
            <pre>{error}</pre>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Custom Functions</h2>
        <p className="section-desc">
          These functions are provided by @huvrdata/evaluate in addition to the
          full{" "}
          <a
            href="https://formulajs.info/functions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            formulajs
          </a>{" "}
          and{" "}
          <a
            href="https://mathjs.org/docs/reference/functions.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            mathjs
          </a>{" "}
          catalogs.
        </p>
        <div className="examples">
          {EXAMPLES.map((example) => (
            <div key={example.name} className="example-card">
              <div className="example-header">
                <code className="fn-name">{example.name}()</code>
                <button
                  className="btn-try"
                  onClick={() => handleTryIt(example)}
                >
                  Try it
                </button>
              </div>
              <p className="example-desc">{example.description}</p>
              <pre className="example-expr">{example.expression}</pre>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <a
          href="https://github.com/huvrdata/evaluate"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        {" | "}
        <a
          href="https://www.npmjs.com/package/@huvrdata/evaluate"
          target="_blank"
          rel="noopener noreferrer"
        >
          npm
        </a>
      </footer>
    </div>
  );
}

export default App;
