import React, { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, CheckCircle2, XCircle, Clock, RotateCcw, Copy, ChevronDown } from 'lucide-react';
import LANGUAGES, { getStarterCode } from '../data/languageTemplates';

export default function CodeEditor({ problem, onBack, onSolved, isSolved }) {
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]); // JavaScript default
  const [code, setCode] = useState(problem.starterCode);
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeDescTab, setActiveDescTab] = useState('description');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const editorRef = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const switchLanguage = (lang) => {
    setSelectedLang(lang);
    setCode(getStarterCode(problem, lang.id));
    setResults(null);
    setLangDropdownOpen(false);
  };

  const resetCode = () => {
    setCode(getStarterCode(problem, selectedLang.id));
    setResults(null);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  // ─── Secure In-Browser JS Execution Engine ───
  const runCode = useCallback(() => {
    if (!selectedLang.canRun) {
      setActiveDescTab('results');
      setResults({
        testResults: [],
        allPassed: false,
        languageNotSupported: true
      });
      return;
    }

    setIsRunning(true);
    setResults(null);

    setTimeout(() => {
      const testResults = [];
      let allPassed = true;

      for (const testCase of problem.testCases) {
        try {
          const fnName = problem.starterCode.match(/function\s+(\w+)/)?.[1];
          if (!fnName) {
            testResults.push({ passed: false, error: 'Could not detect function name', input: testCase.input, expected: testCase.expected, actual: 'N/A' });
            allPassed = false;
            continue;
          }

          const args = Array.isArray(testCase.input) ? testCase.input : [testCase.input];

          const sandbox = new Function(`
            ${code}
            return ${fnName}(${args.map(a => JSON.stringify(a)).join(', ')});
          `);

          const startTime = performance.now();
          const actual = sandbox();
          const endTime = performance.now();
          const executionTime = (endTime - startTime).toFixed(2);

          const passed = JSON.stringify(actual) === JSON.stringify(testCase.expected);
          if (!passed) allPassed = false;

          testResults.push({
            passed,
            input: JSON.stringify(Array.isArray(testCase.input) ? testCase.input : testCase.input),
            expected: JSON.stringify(testCase.expected),
            actual: JSON.stringify(actual),
            executionTime
          });
        } catch (err) {
          allPassed = false;
          testResults.push({
            passed: false,
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(testCase.expected),
            actual: 'N/A',
            error: err.message
          });
        }
      }

      setResults({ testResults, allPassed });
      setActiveDescTab('results');
      if (allPassed) {
        onSolved(problem.id);
      }
      setIsRunning(false);
    }, 500);
  }, [code, problem, onSolved, selectedLang]);

  const passedCount = results ? results.testResults.filter(r => r.passed).length : 0;
  const totalCount = problem.testCases.length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontFamily: 'inherit', fontSize: '0.85rem', transition: 'color 0.2s'
          }}
            onMouseOver={(e) => e.currentTarget.style.color = 'white'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{problem.title}</h3>
          {isSolved && (
            <span style={{
              fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)',
              padding: '2px 10px', borderRadius: '12px', fontWeight: 600
            }}>✓ Solved</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={resetCode} title="Reset Code" style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
            color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem 0.75rem',
            borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontFamily: 'inherit', fontSize: '0.8rem', transition: 'all 0.2s'
          }}>
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={copyCode} title="Copy Code" style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
            color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem 0.75rem',
            borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontFamily: 'inherit', fontSize: '0.8rem', transition: 'all 0.2s'
          }}>
            <Copy size={14} /> Copy
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            style={{
              background: isRunning
                ? 'rgba(139, 92, 246, 0.3)'
                : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              border: 'none', color: 'white', cursor: isRunning ? 'not-allowed' : 'pointer',
              padding: '0.4rem 1.25rem', borderRadius: '6px',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600,
              transition: 'all 0.2s',
              boxShadow: isRunning ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}
          >
            {isRunning ? <><Clock size={14} className="animate-spin" /> Running...</> : <><Play size={14} /> Run Code</>}
          </button>
        </div>
      </div>

      {/* Split View */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT: Problem Description */}
        <div style={{
          width: '42%', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--glass-border)',
          background: 'rgba(15, 23, 42, 0.3)',
          overflow: 'hidden'
        }}>
          {/* Description Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}>
            {['description', 'results'].map(tab => (
              <button key={tab} onClick={() => setActiveDescTab(tab)}
                style={{
                  flex: 1, padding: '0.6rem', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 500,
                  textTransform: 'capitalize',
                  background: activeDescTab === tab ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: activeDescTab === tab ? '#d8b4fe' : 'var(--text-secondary)',
                  borderBottom: activeDescTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'results' && results ? `Results (${passedCount}/${totalCount})` : tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
            {activeDescTab === 'description' && (
              <div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>{problem.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {problem.description}
                </p>

                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Examples</h4>
                {problem.examples.map((ex, i) => (
                  <div key={i} style={{
                    background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem',
                    marginBottom: '0.75rem', borderLeft: '3px solid var(--primary-color)',
                    fontFamily: 'monospace', fontSize: '0.85rem'
                  }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Input: </span>
                      <span style={{ color: 'var(--text-primary)' }}>{ex.input}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Output: </span>
                      <span style={{ color: 'var(--success)' }}>{ex.output}</span>
                    </div>
                  </div>
                ))}

                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', marginTop: '1.5rem', fontSize: '0.95rem' }}>Constraints</h4>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 2, fontSize: '0.85rem' }}>
                  {problem.constraints.map((c, i) => (
                    <li key={i} style={{ fontFamily: 'monospace' }}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeDescTab === 'results' && (
              <div>
                {!results ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                    <Play size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>Click "Run Code" to see test results here.</p>
                  </div>
                ) : results.languageNotSupported ? (
                  <div style={{
                    padding: '2rem', borderRadius: '12px', textAlign: 'center',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚙️</div>
                    <h3 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>
                      {selectedLang.label} — Manual Review Mode
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      In-browser auto-grading is available for <strong style={{ color: '#d8b4fe' }}>JavaScript</strong> only.<br/>
                      For <strong style={{ color: '#fbbf24' }}>{selectedLang.label}</strong>, review your solution against the expected outputs in the Description tab, then mark it as solved below.
                    </p>
                    <button
                      onClick={() => { onSolved(problem.id); setResults({ testResults: [], allPassed: true, manualSolve: true }); }}
                      style={{
                        marginTop: '1.25rem',
                        padding: '0.6rem 2rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      ✓ Mark as Solved
                    </button>
                  </div>
                ) : results.manualSolve ? (
                  <div style={{
                    padding: '2rem', borderRadius: '12px', textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ color: 'var(--success)' }}>Marked as Solved!</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Great job practicing in {selectedLang.label}!</p>
                  </div>
                ) : (
                  <div>
                    {/* Overall verdict */}
                    <div style={{
                      padding: '1.25rem', borderRadius: '12px', marginBottom: '1.25rem',
                      background: results.allPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      border: `1px solid ${results.allPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}>
                      {results.allPassed
                        ? <CheckCircle2 size={28} color="var(--success)" />
                        : <XCircle size={28} color="var(--danger)" />
                      }
                      <div>
                        <h3 style={{
                          margin: 0, fontSize: '1.1rem',
                          color: results.allPassed ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {results.allPassed ? 'Accepted!' : 'Wrong Answer'}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {passedCount}/{totalCount} test cases passed
                        </p>
                      </div>
                    </div>

                    {/* Individual test cases */}
                    {results.testResults.map((r, i) => (
                      <div key={i} style={{
                        background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '1rem',
                        marginBottom: '0.75rem',
                        borderLeft: `3px solid ${r.passed ? 'var(--success)' : 'var(--danger)'}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: r.passed ? 'var(--success)' : 'var(--danger)' }}>
                            Test Case {i + 1} — {r.passed ? 'Passed ✓' : 'Failed ✗'}
                          </span>
                          {r.executionTime && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.executionTime}ms</span>
                          )}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.8 }}>
                          <div><span style={{ color: 'var(--text-secondary)' }}>Input:    </span><span style={{ color: 'var(--text-primary)' }}>{r.input}</span></div>
                          <div><span style={{ color: 'var(--text-secondary)' }}>Expected: </span><span style={{ color: 'var(--success)' }}>{r.expected}</span></div>
                          <div><span style={{ color: 'var(--text-secondary)' }}>Got:      </span><span style={{ color: r.passed ? 'var(--success)' : 'var(--danger)' }}>{r.actual}</span></div>
                          {r.error && <div style={{ color: 'var(--danger)', marginTop: '0.25rem' }}>Error: {r.error}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Code Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>
          {/* Editor Header with Language Selector */}
          <div style={{
            padding: '0.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.8rem', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span>solution{selectedLang.ext}</span>

            {/* Language Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                style={{
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: '#d8b4fe',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >
                {selectedLang.label}
                <ChevronDown size={12} style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>

              {langDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: 'rgba(15, 23, 42, 0.98)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '0.25rem',
                  zIndex: 100,
                  minWidth: '150px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(16px)'
                }}>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => switchLanguage(lang)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: 'none',
                        background: selectedLang.id === lang.id ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        color: selectedLang.id === lang.id ? '#d8b4fe' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        transition: 'all 0.15s'
                      }}
                      onMouseOver={(e) => { if (selectedLang.id !== lang.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                      onMouseOut={(e) => { if (selectedLang.id !== lang.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span>{lang.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {lang.canRun && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '1px 6px', borderRadius: '3px' }}>
                            auto-grade
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Editor
            height="100%"
            language={selectedLang.monacoLang}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            onMount={handleEditorMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
              fontLigatures: true,
              suggestOnTriggerCharacters: true,
              tabSize: 2,
              wordWrap: 'on',
              bracketPairColorization: { enabled: true },
              automaticLayout: true
            }}
          />
        </div>
      </div>
    </div>
  );
}
