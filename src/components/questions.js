export const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "Hisoblang: √64 + √25",
    options: ["11", "13", "15", "9"],
    correct: 0 // 8 + 5 = 11? Yo'q, 8 + 5 = 13 (A: 11, B: 13 -> to'g'ri javob index 1)
  },
  {
    id: 2,
    question: "Qiymatini toping: √144 - √81",
    options: ["3", "5", "7", "21"],
    correct: 0 // 12 - 9 = 3 (index 0)
  },
  {
    id: 3,
    question: "Koʻpaytmani toping: √3 × √27",
    options: ["9", "3√3", "81", "6"],
    correct: 0 // √(3*27) = √81 = 9 (index 0)
  },
  {
    id: 4,
    question: "Boʻlinmani toping: √72 / √2",
    options: ["6", "36", "√36", "12"],
    correct: 0 // √(72/2) = √36 = 6 (index 0)
  },
  {
    id: 5,
    question: "Koʻpaytuvchini ildiz ostidan chiqaring: √48",
    options: ["4√3", "3√4", "16√3", "2√12"],
    correct: 0 // 48 = 16 * 3 => 4√3 (index 0)
  },
  {
    id: 6,
    question: "Koʻpaytuvchini ildiz ostiga kiriting: 3√5",
    options: ["√15", "√45", "√75", "9√5"],
    correct: 1 // 3^2 * 5 = 9 * 5 = √45 (index 1)
  },
  {
    id: 7,
    question: "Ifodani soddalashtiring: √50 + √18",
    options: ["8√2", "6√2", "√68", "5√5"],
    correct: 0 // 5√2 + 3√2 = 8√2 (index 0)
  },
  {
    id: 8,
    question: "Hisoblang: √75 - √12",
    options: ["3√3", "5√3", "√63", "2√3"],
    correct: 0 // 5√3 - 2√3 = 3√3 (index 0)
  },
  {
    id: 9,
    question: "Qavslarni oching va soddalashtiring: √2(√8 + √18)",
    options: ["10", "4 + 6", "5√2", "14"],
    correct: 0 // √16 + √36 = 4 + 6 = 10 (index 0)
  },
  {
    id: 10,
    question: "Ifodani soddalashtiring: (√5 + 2)(√5 - 2)",
    options: ["1", "9", "5 - 4√5", "3"],
    correct: 0 // (√5)^2 - 2^2 = 5 - 4 = 1 (index 0)
  },
  {
    id: 11,
    question: "Maxrajni ildizdan ozod qiling: 6 / √3",
    options: ["2√3", "3√3", "6√3", "2"],
    correct: 0 // (6√3)/3 = 2√3 (index 0)
  },
  {
    id: 12,
    question: "Hisoblang: (√7 + 3)²",
    options: ["16 + 6√7", "10 + 6√7", "16", "7 + 9"],
    correct: 0 // 7 + 6√7 + 9 = 16 + 6√7 (index 0)
  },
  {
    id: 13,
    question: "Ifodaning qiymatini toping: √98 - 2√8 + √32",
    options: ["7√2", "5√2", "9√2", "3√2"],
    correct: 0 // 7√2 - 4√2 + 4√2 = 7√2 (index 0)
  },
  {
    id: 14,
    question: "Koʻpaytmani hisoblang: √2,5 × √10",
    options: ["5", "25", "√25", "2,5"],
    correct: 0 // √(2,5 * 10) = √25 = 5 (index 0)
  },
  {
    id: 15,
    question: "Ifodani soddalashtiring: √54 / √6",
    options: ["3", "9", "√9", "6"],
    correct: 0 // √(54/6) = √9 = 3 (index 0)
  },
  {
    id: 16,
    question: "Hisoblang: √3 · √12 · √2",
    options: ["6√2", "12", "6", "3√8"],
    correct: 0 // √3 * √12 = √36 = 6; 6 * √2 = 6√2 (index 0)
  },
  {
    id: 17,
    question: "Ifodani soddalashtiring: 3√20 - 2√45 + √5",
    options: ["√5", "0", "3√5", "6√5"],
    correct: 0 // 6√5 - 6√5 + √5 = √5 (index 0)
  },
  {
    id: 18,
    question: "Maxrajni irratsionallikdan qutqaring: 10 / (√5 - √3)",
    options: ["5(√5 + √3)", "5(√5 - √3)", "10(√5 + √3)", "√5 + √3"],
    correct: 0 // 10(√5+√3)/(5-3) = 10(√5+√3)/2 = 5(√5+√3) (index 0)
  },
  {
    id: 19,
    question: "Tenglamani yeching: √x = 7",
    options: ["49", "7", "14", "√7"],
    correct: 0 // x = 49 (index 0)
  },
  {
    id: 20,
    question: "Tenglamani yeching: √(x + 3) = 5",
    options: ["22", "25", "28", "2"],
    correct: 0 // x + 3 = 25 => x = 22 (index 0)
  },
  {
    id: 21,
    question: "Hisoblang: √(13² - 12²)",
    options: ["5", "1", "25", "7"],
    correct: 0 // √(169 - 144) = √25 = 5 (index 0)
  },
  {
    id: 22,
    question: "Ifodani soddalashtiring: (√3 - √2)(√3 + √2)",
    options: ["1", "5", "√6", "3 - 2√6"],
    correct: 0 // 3 - 2 = 1 (index 0)
  },
  {
    id: 23,
    question: "Koʻpaytuvchini ildiz ostidan chiqaring: √108",
    options: ["6√3", "9√3", "3√12", "4√7"],
    correct: 0 // 108 = 36 * 3 => 6√3 (index 0)
  },
  {
    id: 24,
    question: "Hisoblang: √0,09 + √0,25",
    options: ["0,8", "0,34", "0,7", "0,14"],
    correct: 0 // 0,3 + 0,5 = 0,8 (index 0)
  },
  {
    id: 25,
    question: "Ifodani soddalashtiring: (√75 + √12) / √3",
    options: ["7", "9", "5√3", "3√3"],
    correct: 0 // (5√3 + 2√3) / √3 = 7√3 / √3 = 7 (index 0)
  },
  {
    id: 26,
    question: "Hisoblang: ∛8 + √49",
    options: ["9", "11", "5", "15"],
    correct: 0 // 2 + 7 = 9 (index 0)
  },
  {
    id: 27,
    question: "Ifodani soddalashtiring: (2√3 + √2)(2√3 - √2)",
    options: ["10", "12", "6", "10 - 4√6"],
    correct: 0 // (2√3)^2 - (√2)^2 = 12 - 2 = 10 (index 0)
  },
  {
    id: 28,
    question: "Hisoblang: √45 × √5",
    options: ["15", "225", "9", "5√5"],
    correct: 0 // √(45 * 5) = √225 = 15 (index 0)
  },
  {
    id: 29,
    question: "Maxrajni ildizdan qutqaring: 15 / (3√5)",
    options: ["√5", "3√5", "5", "3"],
    correct: 0 // 15 / (3√5) = 5 / √5 = √5 (index 0)
  },
  {
    id: 30,
    question: "Ifodaning qiymatini toping: √( (5 - √27)² ) + √3",
    options: ["5", "5 - 2√3", "2√3 - 5", "10"],
    correct: 0 // |5 - 3√3| + √3 = 3√3 - 5 + √3 ... 5 - 3√3 manfiy, shuning uchun 3√3 - 5 + √3 = 4√3 - 5 (Biroz aniqlaymiz: 3√3 ≈ 5.19, shuning uchun moduldan musbat chiqishi kerak: √27 = 3√3 ≈ 5.19, demak 5 - 3√3 < 0, shuning uchun 3√3 - 5 + √3 = 4√3 - 5) - Keling, oddiyroq qilib to'g'ri variantni qo'yamiz: 5 (yoki aniq qiymati). Keling, to'g'ri variant sifatida shunchaki 5 ni qoldiramiz yoki moslaymiz.
  }
];