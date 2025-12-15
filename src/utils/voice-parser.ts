/**
 * Parse voice input to extract transaction information
 * Examples:
 * - "chi 50000 cho ăn sáng" -> { amount: 50000, note: "ăn sáng" }
 * - "thu nhập 2 triệu lương tháng" -> { amount: 2000000, note: "lương tháng" }
 * - "mua cafe 35k" -> { amount: 35000, note: "mua cafe" }
 */

export interface VoiceTransactionData {
  amount: number | null;
  note: string;
  isIncome: boolean;
}

// Vietnamese number words
const NUMBER_WORDS: Record<string, number> = {
  "không": 0, "linh": 0,
  "một": 1, "mốt": 1, "môt": 1,
  "hai": 2,
  "ba": 3,
  "bốn": 4, "tư": 4,
  "năm": 5, "lăm": 5, "nhăm": 5,
  "sáu": 6,
  "bảy": 7, "bẩy": 7,
  "tám": 8,
  "chín": 9,
  "mười": 10,
  "trăm": 100,
  "ngàn": 1000, "nghìn": 1000,
  "triệu": 1000000,
  "tỷ": 1000000000,
};

// Multiplier words
const MULTIPLIERS: Record<string, number> = {
  "k": 1000,
  "ngàn": 1000,
  "nghìn": 1000,
  "triệu": 1000000,
  "tr": 1000000,
  "tỷ": 1000000000,
};

// Income keywords
const INCOME_KEYWORDS = [
  "thu",
  "thu nhập",
  "nhận",
  "lương",
  "thưởng",
  "được",
  "kiếm",
  "bán",
];

// Expense keywords
const EXPENSE_KEYWORDS = [
  "chi",
  "chi tiêu",
  "trả",
  "mua",
  "tiêu",
  "tốn",
  "phí",
];

/**
 * Convert Vietnamese number words to digits
 */
function convertVietnameseNumberWords(text: string): string {
  let result = text.toLowerCase();
  
  // Replace number words with digits
  Object.entries(NUMBER_WORDS).forEach(([word, value]) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    result = result.replace(regex, value.toString());
  });
  
  return result;
}

// Shared regex pattern for amount extraction
const AMOUNT_PATTERN = /(\d+(?:[.,]\d+)?)\s*(k|ngàn|nghìn|triệu|tr|tỷ)?/gi;

/**
 * Extract amount from text
 */
function extractAmount(text: string): number | null {
  // Convert Vietnamese number words to digits first
  const convertedText = convertVietnameseNumberWords(text);
  
  let maxAmount = 0;
  let foundAmount = false;
  
  const matches = convertedText.matchAll(AMOUNT_PATTERN);
  for (const match of matches) {
    const numStr = match[1].replace(",", ".");
    const num = parseFloat(numStr);
    const multiplierStr = match[2]?.toLowerCase() || "";
    const multiplier = MULTIPLIERS[multiplierStr] || 1;
    
    const amount = num * multiplier;
    if (amount > maxAmount) {
      maxAmount = amount;
      foundAmount = true;
    }
  }
  
  return foundAmount ? Math.round(maxAmount) : null;
}

/**
 * Determine if the transaction is income or expense
 */
function determineTransactionType(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check for income keywords
  const hasIncomeKeyword = INCOME_KEYWORDS.some(keyword => 
    lowerText.includes(keyword)
  );
  
  // Check for expense keywords
  const hasExpenseKeyword = EXPENSE_KEYWORDS.some(keyword => 
    lowerText.includes(keyword)
  );
  
  // If both or neither, default to expense
  if (hasIncomeKeyword && !hasExpenseKeyword) {
    return true; // Income
  }
  
  return false; // Expense (default)
}

// Pre-compile regex patterns for better performance
const ALL_KEYWORDS = [...INCOME_KEYWORDS, ...EXPENSE_KEYWORDS];
const KEYWORD_PATTERNS = ALL_KEYWORDS.map(keyword => ({
  keyword,
  pattern: new RegExp(`^${keyword}\\s+`, "i")
}));
const CONNECTOR_PATTERN = /\b(cho|về|của|là|với|để|bằng)\b/gi;

/**
 * Extract note from text by removing amount and transaction type keywords
 */
function extractNote(text: string, amount: number | null): string {
  let note = text;
  
  // Remove amount patterns using shared pattern
  if (amount !== null) {
    note = note.replace(AMOUNT_PATTERN, "");
  }
  
  // Remove income/expense keywords at the beginning
  for (const { pattern } of KEYWORD_PATTERNS) {
    note = note.replace(pattern, "");
  }
  
  // Remove common connectors
  note = note.replace(CONNECTOR_PATTERN, "");
  
  // Clean up extra spaces
  note = note.replace(/\s+/g, " ").trim();
  
  return note;
}

/**
 * Parse voice input text and extract transaction data
 */
export function parseVoiceInput(text: string): VoiceTransactionData {
  const amount = extractAmount(text);
  const isIncome = determineTransactionType(text);
  const note = extractNote(text, amount);
  
  return {
    amount,
    note,
    isIncome,
  };
}

/**
 * Format example voice commands for user guidance
 */
export function getVoiceInputExamples(): string[] {
  return [
    "Chi 50000 đồng ăn sáng",
    "Chi 35k mua cafe",
    "Mua xăng 200 ngàn",
    "Thu nhập 5 triệu lương tháng",
    "Nhận 500k thưởng",
    "Tiêu 2 triệu mua đồ",
  ];
}
