export const problems = [
  // ================= ARRAYS =================
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays"],
    acceptance: 88,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.\n\nInput Format:\n- First line contains array size N.\n- Second line contains N space-separated integers.\n- Third line contains the target value.\n\nOutput Format:\n- Space-separated indices of the two elements (smaller index first).",
    constraints: ["2 <= N <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Exactly one solution exists.", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use a Hash Map to store values and their indices. For each element, check if (target - element) exists in the map.",
    tests: [
      // 3 Samples
      { input: "4\n2 7 11 15\n9", output: "0 1" },
      { input: "3\n3 2 4\n6", output: "1 2" },
      { input: "2\n3 3\n6", output: "0 1" },
      // 12 Hidden
      { input: "4\n1 5 3 2\n8", output: "1 2" },
      { input: "5\n-1 -2 -3 -4 -5\n-8", output: "2 4" },
      { input: "2\n0 0\n0", output: "0 1" },
      { input: "6\n10 20 30 40 50 60\n110", output: "4 5" },
      { input: "3\n1 2 3\n5", output: "1 2" },
      { input: "4\n1 1 1 1\n2", output: "0 1" },
      { input: "5\n100 200 300 400 500\n900", output: "3 4" },
      { input: "5\n5 2 3 9 10\n5", output: "1 2" },
      { input: "6\n-10 12 5 8 1 2\n3", output: "4 5" },
      { input: "4\n0 4 3 0\n0", output: "0 3" },
      { input: "5\n9 3 2 1 0\n3", output: "2 3" },
      { input: "6\n1000 -1000 50 20 10 90\n0", output: "0 1" }
    ]
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    tags: ["Arrays"],
    acceptance: 71,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "You are given an integer array height of length N. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.\n\nInput Format:\n- First line contains array size N.\n- Second line contains N space-separated integers.\n\nOutput Format:\n- A single integer representing the maximum water trapped.",
    constraints: ["2 <= N <= 10^5", "0 <= height[i] <= 10^4", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use two pointers, one at each end of the array. Compute the area, then move the pointer pointing to the shorter line inward.",
    tests: [
      // 3 Samples
      { input: "9\n1 8 6 2 5 4 8 3 7", output: "49" },
      { input: "2\n1 1", output: "1" },
      { input: "5\n4 3 2 1 4", output: "16" },
      // 12 Hidden
      { input: "3\n1 2 1", output: "2" },
      { input: "4\n1 1 1 1", output: "3" },
      { input: "6\n1 2 3 4 5 6", output: "9" },
      { input: "5\n1 2 1 2 1", output: "4" },
      { input: "2\n10 10", output: "10" },
      { input: "4\n2 3 4 5", output: "6" },
      { input: "8\n5 5 5 5 5 5 5 5", output: "35" },
      { input: "6\n3 1 2 4 5 2", output: "12" },
      { input: "5\n10 1 1 1 10", output: "40" },
      { input: "6\n1 8 6 2 5 4", output: "15" },
      { input: "4\n9 8 7 6", output: "18" },
      { input: "5\n2 3 4 5 6", output: "8" }
    ]
  },
  {
    id: "first-missing-positive",
    title: "First Missing Positive",
    difficulty: "Hard",
    tags: ["Arrays"],
    acceptance: 42,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given an unsorted integer array nums, return the smallest missing positive integer.\n\nInput Format:\n- First line contains array size N.\n- Second line contains N space-separated integers.\n\nOutput Format:\n- The smallest positive integer not in the array.",
    constraints: ["1 <= N <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Place each number in its correct index (i.e., value x at index x-1). Then scan the array to find the first index where the value is incorrect.",
    tests: [
      // 3 Samples
      { input: "3\n1 2 0", output: "3" },
      { input: "4\n3 4 -1 1", output: "2" },
      { input: "5\n7 8 9 11 12", output: "1" },
      // 12 Hidden
      { input: "1\n1", output: "2" },
      { input: "1\n2", output: "1" },
      { input: "2\n1 2", output: "3" },
      { input: "6\n1 1 1 1 1 1", output: "2" },
      { input: "6\n0 -1 -2 -3 -4 -5", output: "1" },
      { input: "7\n1 2 3 4 5 6 7", output: "8" },
      { input: "5\n1 2 3 5 6", output: "4" },
      { input: "8\n8 7 6 5 4 3 2 1", output: "9" },
      { input: "5\n2 3 0 -1 1", output: "4" },
      { input: "4\n100 200 300 400", output: "1" },
      { input: "6\n3 4 -1 1 5 6", output: "2" },
      { input: "8\n1 2 4 5 6 7 8 9", output: "3" }
    ]
  },

  // ================= STRINGS =================
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    tags: ["Strings"],
    acceptance: 78,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nInput Format:\n- A single string S containing only parentheses.\n\nOutput Format:\n- 'true' if the string is valid, 'false' otherwise.",
    constraints: ["1 <= S.length <= 10^4", "S consists of parentheses only.", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use a stack. Push opening brackets onto the stack, and when you see a closing bracket, verify it matches the top of the stack.",
    tests: [
      // 3 Samples
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
      // 12 Hidden
      { input: "([)]", output: "false" },
      { input: "{[]}", output: "true" },
      { input: "(", output: "false" },
      { input: ")", output: "false" },
      { input: "((()))", output: "true" },
      { input: "({[()]})", output: "true" },
      { input: "(((()))", output: "false" },
      { input: "()()()()()", output: "true" },
      { input: "[}{]", output: "false" },
      { input: "[]{}[][][]", output: "true" },
      { input: "({)}[]", output: "false" },
      { input: "(((((())))))", output: "true" }
    ]
  },
  {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    tags: ["Strings"],
    acceptance: 58,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given a string S, return the longest palindromic substring in S. If there are multiple, return the one that appears first.\n\nInput Format:\n- A single string S.\n\nOutput Format:\n- The longest palindromic substring.",
    constraints: ["1 <= S.length <= 1000", "S consists of digits and English letters.", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Expand around centers: iterate through the string and consider each character (and between characters) as a palindrome center.",
    tests: [
      // 3 Samples
      { input: "babad", output: "bab" },
      { input: "cbbd", output: "bb" },
      { input: "a", output: "a" },
      // 12 Hidden
      { input: "ac", output: "a" },
      { input: "racecar", output: "racecar" },
      { input: "noon", output: "noon" },
      { input: "abcdefg", output: "a" },
      { input: "aaaaa", output: "aaaaa" },
      { input: "baaaab", output: "baaaab" },
      { input: "abacdfgdcaba", output: "aba" },
      { input: "mississippi", output: "ississi" },
      { input: "forgeeksskeegfor", output: "geeksskeeg" },
      { input: "abcda", output: "a" },
      { input: "aba", output: "aba" },
      { input: "cbbccb", output: "bb" }
    ]
  },
  {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    tags: ["Strings"],
    acceptance: 45,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.\nAllowed operations are: Insert a character, Delete a character, Replace a character.\n\nInput Format:\n- First line contains word1 (may be empty).\n- Second line contains word2 (may be empty).\n\nOutput Format:\n- A single integer representing the minimum edit distance.",
    constraints: ["0 <= word1.length, word2.length <= 500", "Words contain lowercase English letters.", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use Dynamic Programming. Let dp[i][j] be the edit distance between prefixes word1[0...i-1] and word2[0...j-1].",
    tests: [
      // 3 Samples
      { input: "horse\nros", output: "3" },
      { input: "intention\nexecution", output: "5" },
      { input: "a\nb", output: "1" },
      // 12 Hidden
      { input: "abc\nabc", output: "0" },
      { input: "kitten\nsitting", output: "3" },
      { input: "zoologico\nzoologist", output: "4" },
      { input: "plasma\naltitude", output: "6" },
      { input: "abc\n", output: "3" },
      { input: "\nabc", output: "3" },
      { input: "algorithm\nalternate", output: "5" },
      { input: "geek\ngesek", output: "1" },
      { input: "sunday\nsaturday", output: "3" },
      { input: "abcd\nefg", output: "4" },
      { input: "hello\nworld", output: "4" },
      { input: "ab\nac", output: "1" }
    ]
  },

  // ================= DP =================
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    tags: ["DP"],
    acceptance: 82,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "You are climbing a staircase. It takes N steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nInput Format:\n- A single integer N.\n- (Or input contains an integer N).\n\nOutput Format:\n- A single integer representing the number of ways.",
    constraints: ["1 <= N <= 45", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "This is equivalent to the Fibonacci sequence. The number of ways to reach step N is the sum of ways to reach step N-1 and step N-2.",
    tests: [
      // 3 Samples
      { input: "2", output: "2" },
      { input: "3", output: "3" },
      { input: "1", output: "1" },
      // 12 Hidden
      { input: "4", output: "5" },
      { input: "5", output: "8" },
      { input: "10", output: "89" },
      { input: "20", output: "10946" },
      { input: "30", output: "1346269" },
      { input: "40", output: "165580141" },
      { input: "45", output: "1836311903" },
      { input: "6", output: "13" },
      { input: "7", output: "21" },
      { input: "8", output: "34" },
      { input: "9", output: "55" },
      { input: "15", output: "987" }
    ]
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    tags: ["DP"],
    acceptance: 54,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nInput Format:\n- First line contains coins array size N.\n- Second line contains N space-separated integers.\n- Third line contains the amount.\n\nOutput Format:\n- Minimum number of coins needed, or -1.",
    constraints: ["1 <= N <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use Dynamic Programming. Let dp[i] be the minimum coins needed to make up amount i. Iterate through all coins to update the minimum.",
    tests: [
      // 3 Samples
      { input: "3\n1 2 5\n11", output: "3" },
      { input: "1\n2\n3", output: "-1" },
      { input: "1\n1\n0", output: "0" },
      // 12 Hidden
      { input: "1\n1\n1", output: "1" },
      { input: "1\n1\n2", output: "2" },
      { input: "2\n1 2147483647\n2", output: "2" },
      { input: "3\n186 419 83\n6249", output: "20" },
      { input: "4\n1 5 10 25\n99", output: "9" },
      { input: "2\n2 5\n3", output: "-1" },
      { input: "3\n1 3 4\n6", output: "2" },
      { input: "3\n2 5 10\n15", output: "2" },
      { input: "3\n3 7 40\n17", output: "4" },
      { input: "4\n9 10 11 12\n5", output: "-1" },
      { input: "2\n1 5\n100", output: "20" },
      { input: "3\n1 2 5\n100", output: "20" }
    ]
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    tags: ["DP"],
    acceptance: 48,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given N non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.\n\nInput Format:\n- First line contains array size N.\n- Second line contains N space-separated integers.\n\nOutput Format:\n- Total trapped water volume.",
    constraints: ["1 <= N <= 2 * 10^4", "0 <= height[i] <= 10^5", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Maintain two arrays: leftMax[i] (max height to the left of i) and rightMax[i] (max height to the right of i). The water trapped at i is min(leftMax[i], rightMax[i]) - height[i].",
    tests: [
      // 3 Samples
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6" },
      { input: "6\n4 2 0 3 2 5", output: "9" },
      { input: "1\n0", output: "0" },
      // 12 Hidden
      { input: "2\n1 2", output: "0" },
      { input: "3\n2 1 2", output: "1" },
      { input: "3\n3 0 3", output: "3" },
      { input: "5\n1 1 1 1 1", output: "0" },
      { input: "5\n5 4 3 2 1", output: "0" },
      { input: "5\n1 2 3 4 5", output: "0" },
      { input: "10\n9 0 8 0 7 0 6 0 5 10", output: "35" },
      { input: "4\n3 0 0 3", output: "6" },
      { input: "7\n0 1 2 0 3 0 1", output: "3" },
      { input: "8\n2 0 2 0 2 0 2 0", output: "6" },
      { input: "5\n3 1 2 0 4", output: "5" },
      { input: "6\n5 0 0 0 0 5", output: "20" }
    ]
  },

  // ================= TREES =================
  {
    id: "merge-two-binary-trees",
    title: "Merge Two Binary Trees",
    difficulty: "Easy",
    tags: ["Trees"],
    acceptance: 84,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Imagine that when you put one of them to cover the other, some nodes of the two trees are overlapped while the others are not. You need to merge them into a new binary tree.\nFor tree representation, we use space-separated BFS level order traversal, with -1 representing null nodes.\n\nInput Format:\n- First line contains array representation of Tree 1.\n- Second line contains array representation of Tree 2.\n\nOutput Format:\n- Space-separated level order representation of the merged tree (trailing -1s can be omitted).",
    constraints: ["The number of nodes in both trees is in the range [0, 2000].", "-10^4 <= Node.val <= 10^4", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use recursion. If both nodes are not null, sum their values and recursively merge their left and right children.",
    tests: [
      // 3 Samples
      { input: "1 3 2 5\n2 1 3 -1 4 -1 7", output: "3 4 5 5 4 -1 7" },
      { input: "1\n1 2", output: "2 2" },
      { input: "2 1 3\n1 2 3", output: "3 3 6" },
      // 12 Hidden
      { input: "-1\n-1", output: "" },
      { input: "5\n-1", output: "5" },
      { input: "-1\n5", output: "5" },
      { input: "1 2\n3 -1 4", output: "4 2 4" },
      { input: "1 2 3\n1 2 3", output: "2 4 6" },
      { input: "10 5 15\n10 5 15", output: "20 10 30" },
      { input: "1 -1 3\n1 -1 3", output: "2 -1 6" },
      { input: "1 2 3 4\n5 6 7 8", output: "6 8 10 12" },
      { input: "5 4 -1 3\n2 -1 1 -1 4", output: "7 4 1 3 4" },
      { input: "1 1 1\n2 2 2", output: "3 3 3" },
      { input: "1 -1 -1\n-1", output: "1" },
      { input: "4 2 6\n1 3 5", output: "5 5 11" }
    ]
  },
  {
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    tags: ["Trees"],
    acceptance: 65,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\nFor tree representation, we use BFS level order traversal, with -1 representing null nodes.\n\nInput Format:\n- First line contains array size N.\n- Second line contains N space-separated integers representing the level order traversal.\n\nOutput Format:\n- 'true' if the tree is a valid BST, 'false' otherwise.",
    constraints: ["1 <= N <= 10^4", "-2^31 <= Node.val <= 2^31 - 1", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use recursion. Pass a valid range [min, max] down to each child node, ensuring left child < node < right child.",
    tests: [
      // 3 Samples
      { input: "3\n2 1 3", output: "true" },
      { input: "7\n5 1 4 -1 -1 3 6", output: "false" },
      { input: "1\n10", output: "true" },
      // 12 Hidden
      { input: "3\n10 5 15", output: "true" },
      { input: "3\n10 15 5", output: "false" },
      { input: "7\n10 5 15 1 6 12 20", output: "true" },
      { input: "7\n10 5 15 1 11 12 20", output: "false" },
      { input: "3\n1 1 1", output: "false" },
      { input: "2\n2 2", output: "false" },
      { input: "3\n2 -1 3", output: "true" },
      { input: "3\n2 3 -1", output: "false" },
      { input: "7\n3 2 5 1 -1 4 6", output: "true" },
      { input: "5\n20 10 30 -1 -1 25 35", output: "true" },
      { input: "5\n20 10 30 -1 -1 15 35", output: "false" },
      { input: "7\n5 4 6 3 -1 -1 7", output: "true" }
    ]
  },
  {
    id: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    tags: ["Trees"],
    acceptance: 40,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given the root of a binary tree, return the maximum path sum of any non-empty path.\nA path is a sequence of nodes where each pair of adjacent nodes has an edge. The path does not need to pass through the root.\nFor tree representation, we use BFS level order traversal, with -1 representing null nodes.\n\nInput Format:\n- First line contains array size N.\n- Second line contains N space-separated integers.\n\nOutput Format:\n- The maximum path sum.",
    constraints: ["1 <= N <= 3 * 10^4", "-1000 <= Node.val <= 1000", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "For each node, compute the maximum single-path sum of its left and right children. Update the global max path sum with left + right + node.val.",
    tests: [
      // 3 Samples
      { input: "3\n1 2 3", output: "6" },
      { input: "5\n-10 9 20 -1 -1 15 7", output: "42" },
      { input: "1\n5", output: "5" },
      // 12 Hidden
      { input: "1\n-5", output: "-5" },
      { input: "3\n-2 1 3", output: "3" },
      { input: "3\n-2 -1 -3", output: "-1" },
      { input: "3\n1 -2 3", output: "4" },
      { input: "7\n1 2 3 4 5 6 7", output: "18" },
      { input: "5\n10 2 -3 -1 -1", output: "12" },
      { input: "7\n9 6 -2 -1 -1 5 8", output: "23" },
      { input: "3\n10 -5 -10", output: "10" },
      { input: "3\n-10 5 -5", output: "5" },
      { input: "5\n2 -1 -2 -1 -1", output: "2" },
      { input: "7\n10 1 20 -1 -1 15 -5", output: "45" },
      { input: "5\n1 2 -3 4 5", output: "11" }
    ]
  },

  // ================= GRAPHS =================
  {
    id: "flood-fill",
    title: "Flood Fill",
    difficulty: "Easy",
    tags: ["Graphs"],
    acceptance: 83,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "An image is represented by an R x C integer grid image where image[i][j] represents the pixel value of the image.\nYou are also given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc].\n\nInput Format:\n- First line contains two integers R and C.\n- Next R lines contain C space-separated integers.\n- Next line contains three integers sr sc color.\n\nOutput Format:\n- R lines, each containing C space-separated integers of the modified image.",
    constraints: ["1 <= R, C <= 50", "0 <= image[i][j], color < 2^16", "0 <= sr < R", "0 <= sc < C", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use DFS or BFS. Save the original color of the starting pixel, then recursively color all 4-directionally adjacent pixels having the same starting color.",
    tests: [
      // 3 Samples
      { input: "3 3\n1 1 1\n1 1 0\n1 0 1\n1 1 2", output: "2 2 2\n2 2 0\n2 0 1" },
      { input: "3 3\n0 0 0\n0 0 0\n0 0 0\n0 0 2", output: "2 2 2\n2 2 2\n2 2 2" },
      { input: "2 2\n1 0\n0 1\n0 0 2", output: "2 0\n0 1" },
      // 12 Hidden
      { input: "1 1\n1\n0 0 2", output: "2" },
      { input: "1 2\n1 2\n0 0 3", output: "3 2" },
      { input: "2 1\n1\n2\n0 0 4", output: "4\n2" },
      { input: "3 3\n1 2 3\n4 5 6\n7 8 9\n1 1 5", output: "1 2 3\n4 5 6\n7 8 9" },
      { input: "3 3\n1 1 1\n1 2 1\n1 1 1\n1 1 3", output: "3 3 3\n3 2 3\n3 3 3" },
      { input: "2 3\n1 1 0\n1 0 1\n0 0 2", output: "2 2 0\n2 0 1" },
      { input: "3 2\n0 1\n0 1\n1 0\n0 0 5", output: "5 1\n5 1\n1 0" },
      { input: "4 4\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1\n1 1 2", output: "1 1 1 1\n1 2 2 1\n1 2 2 1\n1 1 1 1" },
      { input: "3 3\n3 3 3\n3 3 3\n3 3 3\n1 1 0", output: "0 0 0\n0 0 0\n0 0 0" },
      { input: "2 2\n2 2\n2 2\n0 0 2", output: "2 2\n2 2" },
      { input: "3 3\n1 0 1\n0 1 0\n1 0 1\n1 1 5", output: "1 0 1\n0 5 0\n1 0 1" },
      { input: "1 3\n1 1 1\n0 0 2", output: "2 2 2" }
    ]
  },
  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    tags: ["Graphs"],
    acceptance: 63,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given an R x C 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nInput Format:\n- First line contains grid dimensions R and C.\n- Next R lines contain C space-separated values (0 or 1).\n\nOutput Format:\n- A single integer representing the count of islands.",
    constraints: ["1 <= R, C <= 300", "Grid cells are '0' or '1'.", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Iterate through each cell. When you encounter a '1', increment the island count and run a DFS/BFS to set all connected land cells ('1') to '0'.",
    tests: [
      // 3 Samples
      { input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", output: "1" },
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3" },
      { input: "1 1\n0", output: "0" },
      // 12 Hidden
      { input: "1 1\n1", output: "1" },
      { input: "2 2\n1 0\n0 1", output: "2" },
      { input: "3 3\n1 1 1\n1 1 1\n1 1 1", output: "1" },
      { input: "3 3\n0 0 0\n0 0 0\n0 0 0", output: "0" },
      { input: "3 3\n1 0 1\n0 1 0\n1 0 1", output: "5" },
      { input: "2 3\n1 1 0\n0 0 1", output: "2" },
      { input: "5 5\n1 0 0 0 1\n0 1 0 1 0\n0 0 1 0 0\n0 1 0 1 0\n1 0 0 0 1", output: "5" },
      { input: "4 4\n1 1 0 0\n1 1 0 0\n0 0 1 1\n0 0 1 1", output: "2" },
      { input: "3 4\n1 0 1 0\n0 1 0 1\n1 0 1 0", output: "6" },
      { input: "2 2\n0 0\n1 1", output: "1" },
      { input: "4 4\n1 1 1 1\n1 0 0 0\n1 0 1 1\n1 1 1 1", output: "1" },
      { input: "3 3\n1 0 0\n0 1 0\n0 0 1", output: "3" }
    ]
  },
  {
    id: "word-ladder",
    title: "Word Ladder",
    difficulty: "Hard",
    tags: ["Graphs"],
    acceptance: 37,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:\n- Every adjacent pair of words differs by single character.\n- Each si is in wordList.\nGiven beginWord, endWord, and wordList, return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.\n\nInput Format:\n- First line contains beginWord.\n- Second line contains endWord.\n- Third line contains dictionary size N.\n- Next N lines contain one word each.\n\nOutput Format:\n- Single integer representing the shortest path length.",
    constraints: ["1 <= beginWord.length <= 10", "1 <= N <= 5000", "All words consist of lowercase English letters.", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use BFS. Add beginWord to the queue with step 1. At each step, replace each character in the current word with 'a'-'z' and check if it is in the dictionary.",
    tests: [
      // 3 Samples
      { input: "hit\ncog\n6\nhot\ndot\ndog\nlot\nlog\ncog", output: "5" },
      { input: "hit\ncog\n5\nhot\ndot\ndog\nlot\nlog", output: "0" },
      { input: "a\nc\n3\na\nb\nc", output: "2" },
      // 12 Hidden
      { input: "a\nb\n1\nb", output: "2" },
      { input: "a\nb\n1\nc", output: "0" },
      { input: "hot\ndog\n3\nhot\ndog\ncog", output: "0" },
      { input: "lead\ngold\n4\nload\ngoad\ngold\nlead", output: "4" },
      { input: "lost\ncost\n2\nlost\ncost", output: "2" },
      { input: "cat\ndog\n4\ncot\ncog\ndog\ncat", output: "4" },
      { input: "talk\ntail\n3\ntalk\ntall\ntail", output: "3" },
      { input: "best\nliar\n5\nbeast\nblast\nboast\ncoast\nliar", output: "0" },
      { input: "git\nget\n1\nget", output: "2" },
      { input: "cold\nwarm\n4\ncord\ncard\nward\nwarm", output: "5" },
      { input: "abc\ndef\n3\nabc\nabe\ndef", output: "0" },
      { input: "red\ntax\n5\nted\ntex\ntax\ntad\nred", output: "4" }
    ]
  },

  // ================= MATH =================
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    tags: ["Math"],
    acceptance: 85,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given an integer X, return true if X is a palindrome, and false otherwise.\nAn integer is a palindrome when it reads the same backward as forward. For example, 121 is a palindrome while 123 is not.\n\nInput Format:\n- A single integer X.\n\nOutput Format:\n- 'true' if X is a palindrome, 'false' otherwise.",
    constraints: ["-2^31 <= X <= 2^31 - 1", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Negative numbers are never palindromic because of the negative sign. You can reverse the second half of the number and compare it with the first half to save space.",
    tests: [
      // 3 Samples
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
      { input: "10", output: "false" },
      // 12 Hidden
      { input: "0", output: "true" },
      { input: "12321", output: "true" },
      { input: "11", output: "true" },
      { input: "1001", output: "true" },
      { input: "9999", output: "true" },
      { input: "123456", output: "false" },
      { input: "1000021", output: "false" },
      { input: "5", output: "true" },
      { input: "-5", output: "false" },
      { input: "1000000001", output: "true" },
      { input: "22022022", output: "false" },
      { input: "1221", output: "true" }
    ]
  },
  {
    id: "reverse-integer",
    title: "Reverse Integer",
    difficulty: "Medium",
    tags: ["Math"],
    acceptance: 62,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "Given a signed 32-bit integer X, return X with its digits reversed. If reversing X causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.\n\nInput Format:\n- A single integer X.\n\nOutput Format:\n- The reversed integer, or 0 if it overflows.",
    constraints: ["-2^31 <= X <= 2^31 - 1", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use modulo 10 to extract the last digit and build the reversed number. Check for overflow before multiplying by 10.",
    tests: [
      // 3 Samples
      { input: "123", output: "321" },
      { input: "-123", output: "-321" },
      { input: "120", output: "21" },
      // 12 Hidden
      { input: "0", output: "0" },
      { input: "1534236469", output: "0" },
      { input: "-2147483648", output: "0" },
      { input: "1", output: "1" },
      { input: "100", output: "1" },
      { input: "-10", output: "-1" },
      { input: "1000000003", output: "0" },
      { input: "2147483647", output: "0" },
      { input: "-2147483647", output: "0" },
      { input: "900000", output: "9" },
      { input: "-900000", output: "-9" },
      { input: "1111111112", output: "2111111111" }
    ]
  },
  {
    id: "n-queens",
    title: "N-Queens",
    difficulty: "Hard",
    tags: ["Math"],
    acceptance: 65,
    solutionAvailable: true,
    published: true,
    timeLimit: "1.0s",
    spaceLimit: "256MB",
    statement: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.\nGiven an integer N, return the total number of distinct solutions.\n\nInput Format:\n- A single integer N.\n\nOutput Format:\n- A single integer representing the total number of distinct solutions.",
    constraints: ["1 <= N <= 9", "Time Limit: 1.0s", "Space Limit: 256MB"],
    hint: "Use backtracking. Track the columns, diagonals, and anti-diagonals that currently have a queen to quickly check if a new queen placement is safe.",
    tests: [
      // 3 Samples
      { input: "4", output: "2" },
      { input: "1", output: "1" },
      { input: "2", output: "0" },
      // 12 Hidden
      { input: "3", output: "0" },
      { input: "5", output: "10" },
      { input: "6", output: "4" },
      { input: "7", output: "40" },
      { input: "8", output: "92" },
      { input: "9", output: "352" },
      { input: "4", output: "2" },
      { input: "1", output: "1" },
      { input: "2", output: "0" },
      { input: "5", output: "10" },
      { input: "6", output: "4" },
      { input: "7", output: "40" }
    ]
  }
];
