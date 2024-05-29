const Mocha = require("mocha");
const fs = require("fs");

const mocha = new Mocha({});
if (fs.existsSync("test_results.log")) {
  fs.unlinkSync("test_results.log");
}
const logStream = fs.createWriteStream("test_results.log", { flags: "a" });

mocha.addFile("./scripts/library.js");
// mocha.addFile("./scripts/libraryFilter.js");
// mocha.addFile("./scripts/playlist.js");
// mocha.addFile("./scripts/filiei.js");
// mocha.addFile("./scripts/sortCheck.js");
// mocha.addFile("./scripts/report.js");
// mocha.addFile("./scripts/owners.js");
// mocha.addFile("./scripts/fili_group.js");
// mocha.addFile("./scripts/rules.js");

const runner = mocha.run(function (failures) {
  logStream.write(`———————————————\n`);
  logStream.write(`Результат:\n`);
  logStream.write(`1.Всего тестов: ${runner.total}\n`);
  logStream.write(`2.Прошли: ${runner.total - failures}\n`);
  logStream.write(`3.Провалили: ${failures}\n`);

  logStream.end();

  logStream.on("finish", () => {
    console.log("Test results written to test_results.log");
  });
  process.exitCode = failures ? 1 : 0;
});

runner.addListener("suite", function (test) {
  if (test.title !== "") {
    logStream.write(`~~~~~~~~~~~~~~~\n`);
    logStream.write(`Начало теста: "${test.title}"\n`);
  }
});

runner.addListener("test end", function (test) {
  logStream.write(`———————————————\n`);
  logStream.write(`${test.title}: ${test.state}\n`);
  if (test.state == "failed") {
    logStream.write(`\n`);
    logStream.write(`!!!!!!!!!!!!!!!!!!\n`);
    let errMessage = test.err.message;
    let index = errMessage.indexOf(": expected");
    let message = errMessage.slice(0, index);
    logStream.write(
      `Сообщение: ${message}\nОжидаемо: ${test.err.expected} \nПолучили: ${test.err.actual}\n`
    );
  }
});
