function splitTextAndNumbers(str) {
  // Регулярное выражение для разделения текста и чисел
  return str
    .match(/(\d+|\D+)/g)
    .map((part) => (isNaN(part) ? part : parseInt(part, 10)));
}

function compareMixedStrings(a, b) {
  const partsA = splitTextAndNumbers(a);
  const partsB = splitTextAndNumbers(b);

  for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
    const partA = partsA[i];
    const partB = partsB[i];

    if (typeof partA === "number" && typeof partB === "number") {
      if (partA !== partB) {
        return partA - partB;
      }
    } else if (typeof partA === "string" && typeof partB === "string") {
      if (partA !== partB) {
        return partA.localeCompare(partB);
      }
    } else {
      return typeof partA === "number" ? -1 : 1;
    }
  }

  return partsA.length - partsB.length;
}

function sortStringsByTextAndNumbers(arr) {
  return arr.sort(compareMixedStrings);
}

const inputArray = [
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
  "Test #10t",
  "Test #11t",
  "Test #1t",
  "Test group #25t",
  "Test group #2t",
  "#10t Test group",
  "#2t Test group",
  "#1t Test group",
  "Test #20t group",
  "Test #24t  group",
  "Test #10t group",
  "Test #1 group",
  "#20t Test group",
  "Тест группа 24",
  "Тест группа",
];
const sortedArray = sortStringsByTextAndNumbers(inputArray);

console.log(sortedArray.join(`\n`));
