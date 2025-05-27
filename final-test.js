// 最終テスト: 改善されたコードブロック処理の確認

const testCases = [
  // ケース1: 最初に空行があるコードブロック
  {
    name: "コードブロック最初の空行除去",
    input: "```\n\nfeat: DockerとDev ContainerでNext.js/MySQL開発環境をセットアップ\n```",
    expected: "```\nfeat: DockerとDev ContainerでNext.js/MySQL開発環境をセットアップ\n```"
  },
  
  // ケース2: 言語指定ありで空行があるパターン
  {
    name: "言語指定ありコードブロック",
    input: "```bash\n\ngit branch -m 0522_Team_Development/team_E/feature/hikaru-shiga/shiga-docker-dev\n```",
    expected: "```bash\ngit branch -m 0522_Team_Development/team_E/feature/hikaru-shiga/shiga-docker-dev\n```"
  },
  
  // ケース3: 複数行のコードブロック
  {
    name: "複数行コードブロック",
    input: "```\n\nfeat: DockerとDev ContainerでNext.js/MySQL開発環境をセットアップ\n\nNext.jsアプリケーションとMySQLデータベースをDockerコンテナ化し、\nVS Code Dev Containersでの開発をサポートする設定ファイルを追加しました。\n```",
    expected: "```\nfeat: DockerとDev ContainerでNext.js/MySQL開発環境をセットアップ\n\nNext.jsアプリケーションとMySQLデータベースをDockerコンテナ化し、\nVS Code Dev Containersでの開発をサポートする設定ファイルを追加しました。\n```"
  }
];

// 改善された実装をシミュレート
function improvedCleanupMarkdownContent(content) {
  let result = content;
  
  // Step 1: コードブロック内の無駄な改行を確実に除去
  // より包括的なパターンマッチングで、あらゆる空白・改行パターンに対応
  
  // 1-1: 言語指定なしのコードブロック（最も問題の多いパターン）
  // ```の直後に改行・空白が続き、その後にコンテンツ、最後に```で終わるパターン
  result = result.replace(/```\s*\n[\s\n]*([^`]+?)[\s\n]*```/gs, (_, code) => {
    const cleanCode = code.trim();
    return cleanCode ? '```\n' + cleanCode + '\n```' : '';
  });
  
  // 1-2: 言語指定ありのコードブロック
  // ```言語名の直後に改行・空白が続くパターン
  result = result.replace(/```(\w+)\s*\n[\s\n]*([^`]+?)[\s\n]*```/gs, (_, lang, code) => {
    const cleanCode = code.trim();
    return cleanCode ? '```' + lang + '\n' + cleanCode + '\n```' : '';
  });
  
  // 1-3: 空の言語指定（```の直後にスペースがある場合）
  // ```␣の直後に改行・空白が続くパターン
  result = result.replace(/```\s+\n[\s\n]*([^`]+?)[\s\n]*```/gs, (_, code) => {
    const cleanCode = code.trim();
    return cleanCode ? '```\n' + cleanCode + '\n```' : '';
  });
  
  // Step 2: 残存する問題パターンへの対応
  
  // 2-1: 連続する空白行パターンへの追加処理
  result = result.replace(/```(\w*)\n\s*\n+([^`]+?)\n\s*```/gs, (_, lang, code) => {
    const cleanCode = code.trim();
    return cleanCode ? '```' + lang + '\n' + cleanCode + '\n```' : '';
  });
  
  // 2-2: コードブロック内の連続する空白行を単一の改行に変換
  result = result.replace(/```(\w*)\n([^`]*?)\n```/gs, (_, lang, code) => {
    // コード内の連続する空白行を正規化（ただし意図的な改行は保持）
    const normalizedCode = code
      .replace(/\n\s*\n\s*\n/g, '\n\n')  // 3つ以上の連続改行を2つに
      .replace(/^\s+|\s+$/g, '');  // 前後の空白を除去
    
    return normalizedCode ? '```' + lang + '\n' + normalizedCode + '\n```' : '';
  });
  
  return result;
}

// テスト実行
console.log('🧪 Final Test: Improved Code Block Cleanup\n');

let allPassed = true;

testCases.forEach((testCase, index) => {
  console.log(`=== Test ${index + 1}: ${testCase.name} ===`);
  
  console.log('Input:');
  console.log(JSON.stringify(testCase.input));
  console.log('Input (readable):');
  console.log(testCase.input);
  
  const result = improvedCleanupMarkdownContent(testCase.input);
  
  console.log('\nResult:');
  console.log(JSON.stringify(result));
  console.log('Result (readable):');
  console.log(result);
  
  console.log('\nExpected:');
  console.log(JSON.stringify(testCase.expected));
  console.log('Expected (readable):');
  console.log(testCase.expected);
  
  const passed = result.trim() === testCase.expected.trim();
  console.log(`\n✅ Test ${passed ? 'PASSED' : 'FAILED'}`);
  
  if (!passed) {
    allPassed = false;
    console.log('\n🔍 Difference detected:');
    console.log('Result chars:', [...result].map(c => c === '\n' ? '\\n' : c === ' ' ? '·' : c).join(''));
    console.log('Expected chars:', [...testCase.expected].map(c => c === '\n' ? '\\n' : c === ' ' ? '·' : c).join(''));
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
});

console.log(`🏁 Final Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`); 
