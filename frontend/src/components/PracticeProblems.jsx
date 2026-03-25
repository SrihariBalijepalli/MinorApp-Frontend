import React, { useState, useMemo } from 'react';
import { Code2, ChevronRight, Star, Zap, Trophy, Filter } from 'lucide-react';
import CodeEditor from './CodeEditor';

// ─── Problem Bank: role → difficulty → problems ────────────────
const PROBLEM_BANK = {
  // ──────── GENERIC (fallback) ────────
  _default: {
    Basic: [
      {
        id: 'gen-b1',
        title: 'Reverse a String',
        description: 'Write a function `reverseString(s)` that takes a string and returns it reversed.',
        examples: [
          { input: '"hello"', output: '"olleh"' },
          { input: '"world"', output: '"dlrow"' }
        ],
        constraints: ['1 ≤ s.length ≤ 10⁵', 'String contains only printable ASCII'],
        starterCode: 'function reverseString(s) {\n  // your code here\n}',
        testCases: [
          { input: 'hello', expected: 'olleh' },
          { input: 'world', expected: 'dlrow' },
          { input: 'a', expected: 'a' },
          { input: '', expected: '' }
        ]
      },
      {
        id: 'gen-b2',
        title: 'Find Maximum in Array',
        description: 'Write a function `findMax(arr)` that returns the largest number in an array of integers.',
        examples: [
          { input: '[1, 5, 3, 9, 2]', output: '9' },
          { input: '[-1, -5, -3]', output: '-1' }
        ],
        constraints: ['1 ≤ arr.length ≤ 10⁴', '-10⁶ ≤ arr[i] ≤ 10⁶'],
        starterCode: 'function findMax(arr) {\n  // your code here\n}',
        testCases: [
          { input: [1, 5, 3, 9, 2], expected: 9 },
          { input: [-1, -5, -3], expected: -1 },
          { input: [42], expected: 42 },
          { input: [0, 0, 0], expected: 0 }
        ]
      },
      {
        id: 'gen-b3',
        title: 'Count Vowels',
        description: 'Write a function `countVowels(s)` that returns the number of vowels (a, e, i, o, u) in a string. Case-insensitive.',
        examples: [
          { input: '"Hello World"', output: '3' },
          { input: '"xyz"', output: '0' }
        ],
        constraints: ['0 ≤ s.length ≤ 10⁵'],
        starterCode: 'function countVowels(s) {\n  // your code here\n}',
        testCases: [
          { input: 'Hello World', expected: 3 },
          { input: 'xyz', expected: 0 },
          { input: 'aeiou', expected: 5 },
          { input: 'AEIOU', expected: 5 },
          { input: '', expected: 0 }
        ]
      }
    ],
    Intermediate: [
      {
        id: 'gen-i1',
        title: 'Two Sum',
        description: 'Write a function `twoSum(nums, target)` that returns an array of two indices such that the numbers at those indices add up to the target. You may assume each input has exactly one solution.',
        examples: [
          { input: '[2, 7, 11, 15], target = 9', output: '[0, 1]' },
          { input: '[3, 2, 4], target = 6', output: '[1, 2]' }
        ],
        constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
        starterCode: 'function twoSum(nums, target) {\n  // your code here\n}',
        testCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] }
        ]
      },
      {
        id: 'gen-i2',
        title: 'Valid Palindrome',
        description: 'Write a function `isPalindrome(s)` that returns `true` if the given string is a palindrome considering only alphanumeric characters and ignoring cases, otherwise `false`.',
        examples: [
          { input: '"A man, a plan, a canal: Panama"', output: 'true' },
          { input: '"race a car"', output: 'false' }
        ],
        constraints: ['1 ≤ s.length ≤ 2 × 10⁵', 'String consists of printable ASCII'],
        starterCode: 'function isPalindrome(s) {\n  // your code here\n}',
        testCases: [
          { input: 'A man, a plan, a canal: Panama', expected: true },
          { input: 'race a car', expected: false },
          { input: ' ', expected: true },
          { input: 'aa', expected: true }
        ]
      },
      {
        id: 'gen-i3',
        title: 'FizzBuzz',
        description: 'Write a function `fizzBuzz(n)` that returns an array of strings from 1 to n. For multiples of 3 use "Fizz", multiples of 5 use "Buzz", multiples of both use "FizzBuzz", otherwise the number as a string.',
        examples: [
          { input: '5', output: '["1","2","Fizz","4","Buzz"]' }
        ],
        constraints: ['1 ≤ n ≤ 10⁴'],
        starterCode: 'function fizzBuzz(n) {\n  // your code here\n}',
        testCases: [
          { input: 3, expected: ["1", "2", "Fizz"] },
          { input: 5, expected: ["1", "2", "Fizz", "4", "Buzz"] },
          { input: 15, expected: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"] }
        ]
      }
    ],
    Advanced: [
      {
        id: 'gen-a1',
        title: 'Longest Substring Without Repeating Characters',
        description: 'Write a function `lengthOfLongestSubstring(s)` that returns the length of the longest substring without repeating characters.',
        examples: [
          { input: '"abcabcbb"', output: '3 (substring "abc")' },
          { input: '"bbbbb"', output: '1' }
        ],
        constraints: ['0 ≤ s.length ≤ 5 × 10⁴', 'String consists of English letters, digits, symbols, and spaces'],
        starterCode: 'function lengthOfLongestSubstring(s) {\n  // your code here\n}',
        testCases: [
          { input: 'abcabcbb', expected: 3 },
          { input: 'bbbbb', expected: 1 },
          { input: 'pwwkew', expected: 3 },
          { input: '', expected: 0 },
          { input: ' ', expected: 1 }
        ]
      },
      {
        id: 'gen-a2',
        title: 'Group Anagrams',
        description: 'Write a function `groupAnagrams(strs)` that groups an array of strings into arrays of anagrams. Return the groups in any order.',
        examples: [
          { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }
        ],
        constraints: ['1 ≤ strs.length ≤ 10⁴', '0 ≤ strs[i].length ≤ 100', 'Lowercase English letters only'],
        starterCode: 'function groupAnagrams(strs) {\n  // your code here\n}',
        testCases: [
          { input: ["eat","tea","tan","ate","nat","bat"], expected: [["eat","tea","ate"],["tan","nat"],["bat"]] },
          { input: [""], expected: [[""]] },
          { input: ["a"], expected: [["a"]] }
        ]
      }
    ]
  }
};

// Map common role names to _default for now
const getRoleProblems = (role) => {
  return PROBLEM_BANK[role] || PROBLEM_BANK._default;
};

const difficultyConfig = {
  Basic: { color: '#10b981', icon: Star, label: 'Easy' },
  Intermediate: { color: '#f59e0b', icon: Zap, label: 'Medium' },
  Advanced: { color: '#ef4444', icon: Trophy, label: 'Hard' }
};

export default function PracticeProblems({ userRole }) {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [filter, setFilter] = useState('All');
  const [solvedProblems, setSolvedProblems] = useState(() => {
    try {
      const saved = localStorage.getItem('solvedProblems');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const problems = useMemo(() => getRoleProblems(userRole), [userRole]);

  const allProblems = useMemo(() => {
    const result = [];
    for (const [difficulty, list] of Object.entries(problems)) {
      list.forEach(p => result.push({ ...p, difficulty }));
    }
    return result;
  }, [problems]);

  const filtered = filter === 'All'
    ? allProblems
    : allProblems.filter(p => p.difficulty === filter);

  const handleSolved = (problemId) => {
    const updated = [...new Set([...solvedProblems, problemId])];
    setSolvedProblems(updated);
    localStorage.setItem('solvedProblems', JSON.stringify(updated));
  };

  if (selectedProblem) {
    return (
      <CodeEditor
        problem={selectedProblem}
        onBack={() => setSelectedProblem(null)}
        onSolved={handleSolved}
        isSolved={solvedProblems.includes(selectedProblem.id)}
      />
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Practice Problems
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Sharpen your skills with role-specific coding challenges — from basic to advanced.
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{allProblems.length}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Solved</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>{solvedProblems.length}</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy</h4>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {allProblems.length > 0 ? Math.round((solvedProblems.length / allProblems.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Basic', 'Intermediate', 'Advanced'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              border: filter === f ? '1px solid var(--primary-color)' : '1px solid var(--glass-border)',
              background: filter === f ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: filter === f ? '#d8b4fe' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {f !== 'All' && <Filter size={14} />}
            {f === 'All' ? `All (${allProblems.length})` : `${difficultyConfig[f]?.label || f} (${allProblems.filter(p => p.difficulty === f).length})`}
          </button>
        ))}
      </div>

      {/* Problem List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((problem) => {
          const config = difficultyConfig[problem.difficulty];
          const solved = solvedProblems.includes(problem.id);
          return (
            <div
              key={problem.id}
              onClick={() => setSelectedProblem(problem)}
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: solved ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--glass-border)',
                background: solved ? 'rgba(16, 185, 129, 0.05)' : 'var(--glass-bg)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = solved ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'; }}
            >
              {/* Difficulty Badge */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: `${config.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Code2 size={18} color={config.color} />
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: 0, fontSize: '1rem', color: 'var(--text-primary)',
                  textDecoration: solved ? 'line-through' : 'none',
                  opacity: solved ? 0.7 : 1
                }}>
                  {problem.title}
                </h4>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600,
                    color: config.color,
                    background: `${config.color}15`,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {config.label}
                  </span>
                  {solved && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500 }}>
                      ✓ Solved
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
