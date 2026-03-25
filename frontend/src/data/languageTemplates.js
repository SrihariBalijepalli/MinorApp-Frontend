// ─── Multi-Language Starter Code Templates ───
// Generates equivalent starter code for each problem in 5 languages

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monacoLang: 'javascript', ext: '.js', canRun: true },
  { id: 'python', label: 'Python', monacoLang: 'python', ext: '.py', canRun: false },
  { id: 'java', label: 'Java', monacoLang: 'java', ext: '.java', canRun: false },
  { id: 'cpp', label: 'C++', monacoLang: 'cpp', ext: '.cpp', canRun: false },
  { id: 'c', label: 'C', monacoLang: 'c', ext: '.c', canRun: false },
  { id: 'typescript', label: 'TypeScript', monacoLang: 'typescript', ext: '.ts', canRun: false },
];

// Convert a JS function signature to equivalent in other languages
function generateTemplate(fnName, params, returnType, lang) {
  const paramStr = params || 'input';

  switch (lang) {
    case 'python':
      return `def ${fnName}(${paramStr}):\n    # your code here\n    pass`;

    case 'java':
      return `class Solution {\n    public static ${returnType || 'Object'} ${fnName}(${javaParams(paramStr, returnType)}) {\n        // your code here\n        return ${javaDefault(returnType)};\n    }\n}`;

    case 'cpp':
      return `#include <bits/stdc++.h>\nusing namespace std;\n\n${cppReturnType(returnType)} ${fnName}(${cppParams(paramStr, returnType)}) {\n    // your code here\n    return ${cppDefault(returnType)};\n}`;

    case 'c':
      return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\n${cReturnType(returnType)} ${fnName}(${cParams(paramStr, returnType)}) {\n    // your code here\n    return ${cDefault(returnType)};\n}`;

    case 'typescript':
      return `function ${fnName}(${tsParams(paramStr, returnType)}): ${tsReturnType(returnType)} {\n  // your code here\n}`;

    default:
      return `function ${fnName}(${paramStr}) {\n  // your code here\n}`;
  }
}

// ── Java helpers ──
function javaParams(params, returnType) {
  const parts = params.split(',').map(p => p.trim());
  return parts.map(p => {
    if (p.includes('arr') || p.includes('nums') || p.includes('heights') || p.includes('coins') || p.includes('prices') || p.includes('digits') || p.includes('intervals') || p.includes('grid') || p.includes('matrix') || p.includes('mat') || p.includes('strs') || p.includes('prerequisites') || p.includes('wordDict') || p.includes('height'))
      return `int[] ${p}`;
    if (p === 's' || p === 't' || p === 'str')
      return `String ${p}`;
    return `int ${p}`;
  }).join(', ');
}
function javaDefault(rt) { return rt === 'boolean' ? 'false' : rt === 'String' ? '""' : rt === 'int[]' ? 'new int[]{}' : '0'; }

// ── C++ helpers ──
function cppReturnType(rt) { return rt === 'boolean' ? 'bool' : rt === 'String' ? 'string' : rt === 'int[]' ? 'vector<int>' : rt === 'double' ? 'double' : 'int'; }
function cppParams(params, rt) {
  const parts = params.split(',').map(p => p.trim());
  return parts.map(p => {
    if (p.includes('arr') || p.includes('nums') || p.includes('heights') || p.includes('coins') || p.includes('prices') || p.includes('digits'))
      return `vector<int>& ${p}`;
    if (p === 's' || p === 't' || p === 'str')
      return `string ${p}`;
    return `int ${p}`;
  }).join(', ');
}
function cppDefault(rt) { return rt === 'boolean' ? 'false' : rt === 'String' ? '""' : rt === 'double' ? '0.0' : '0'; }

// ── C helpers ──
function cReturnType(rt) { return rt === 'boolean' ? 'int' : rt === 'String' ? 'char*' : rt === 'double' ? 'double' : 'int'; }
function cParams(params, rt) {
  const parts = params.split(',').map(p => p.trim());
  return parts.map(p => {
    if (p.includes('arr') || p.includes('nums'))
      return `int* ${p}, int size`;
    if (p === 's' || p === 't' || p === 'str')
      return `char* ${p}`;
    return `int ${p}`;
  }).join(', ');
}
function cDefault(rt) { return rt === 'boolean' ? '0' : rt === 'String' ? 'NULL' : rt === 'double' ? '0.0' : '0'; }

// ── TypeScript helpers ──
function tsParams(params, rt) {
  const parts = params.split(',').map(p => p.trim());
  return parts.map(p => {
    if (p.includes('arr') || p.includes('nums') || p.includes('heights') || p.includes('coins') || p.includes('prices'))
      return `${p}: number[]`;
    if (p === 's' || p === 't' || p === 'str')
      return `${p}: string`;
    return `${p}: number`;
  }).join(', ');
}
function tsReturnType(rt) { return rt === 'boolean' ? 'boolean' : rt === 'String' ? 'string' : rt === 'int[]' ? 'number[]' : 'number'; }

// Parse the JS starter code to extract function name and parameters
function parseStarterCode(jsCode) {
  const match = jsCode.match(/function\s+(\w+)\(([^)]*)\)/);
  if (!match) return { fnName: 'solve', params: '' };
  return { fnName: match[1], params: match[2] };
}

// Detect rough return type from function name / problem context
function guessReturnType(fnName) {
  const boolFns = ['isPalindrome', 'isPalindromeSimple', 'isAnagram', 'isPowerOfTwo', 'isSorted', 'isValid', 'isSubsequence', 'containsDuplicate', 'contains', 'canFinish', 'wordBreak'];
  const strFns = ['reverseString', 'capitalizeFirst', 'toTitleCase', 'removeSpaces', 'compress', 'longestCommonPrefix', 'reverseWords', 'caesarCipher', 'longestPalindrome', 'minWindow', 'repeatStr', 'truncate', 'firstNonRepeat'];
  const arrFns = ['removeDuplicates', 'reverseArray', 'findEvens', 'flattenArray', 'mergeArrays', 'twoSum', 'moveZeroes', 'rotate', 'intersection', 'plusOne', 'pascalRow', 'productExceptSelf', 'chunk', 'spiralOrder', 'fizzBuzz', 'groupAnagrams', 'mergeIntervals', 'threeSum', 'permute', 'generateParenthesis'];
  const doubleFns = ['findMedianSortedArrays', 'average'];
  const objFns = ['charFrequency'];

  if (boolFns.includes(fnName)) return 'boolean';
  if (strFns.includes(fnName)) return 'String';
  if (arrFns.includes(fnName)) return 'int[]';
  if (doubleFns.includes(fnName)) return 'double';
  if (objFns.includes(fnName)) return 'Object';
  return 'int';
}

// Main export: get starter code for any problem in any language
export function getStarterCode(problem, langId) {
  if (langId === 'javascript') return problem.starterCode;

  const { fnName, params } = parseStarterCode(problem.starterCode);
  const returnType = guessReturnType(fnName);
  return generateTemplate(fnName, params, returnType, langId);
}

export { LANGUAGES };
export default LANGUAGES;
