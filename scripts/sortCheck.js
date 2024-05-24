const webdriver = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { describe, before, after, it } = require("mocha");
const assert = require("chai").assert;
const Helper = require("../helpers/helper");
const fs = require("fs");

describe("Библиотека", function () {
  let driver;
  By = webdriver.By;
  until = webdriver.until;
  const baseUrl = "http://192.168.16.14:6521/login";
  const helper = new Helper();
  this.timeout(900000);
  const logStream = fs.createWriteStream("test_results.log", { flags: "a" });
  this.slow(200);

  before(async function () {
    let options = new Options();
    // options.addArguments("--headless=new");
    driver = await new webdriver.Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  });
  afterEach(async function () {
    if (this.currentTest.state === "failed") {
      const screenshot = await driver.takeScreenshot();
      console.error(this.currentTest.err);

      const fileName = `./screen/${Date.now()} failure-screenshot-${
        this.currentTest.title
      }.png`;
      fs.writeFileSync(fileName, screenshot, "base64");
      console.log(`Screenshot saved as: ${fileName}`);
    }
  });
  after(async function () {
    logStream.end();
    driver.quit();
  });

  it("Открыть MediaHub", async function () {
    driver.get(baseUrl);
    await driver.manage().setTimeouts({ implicit: 500 });
    // await driver.manage().window().setSize({ x: 1920, y: 0 });
    await driver.manage().window().maximize();
    await driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.xpath("/html/body/app-root/app-login/section/div[1]/div")
      ),
      5000
    );
    await helper.sendKeysByXpath(
      "/html/body/app-root/app-login/section/div[1]/div/div/div[1]/div/input",
      driver,
      "admin"
    );

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-login/section/div[1]/div/div/div[2]/div/input",
      driver,
      "flvbyrf2020"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-login/section/div[1]/div/div/div[4]/button",
      driver
    );

    await driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.xpath("/html/body/app-root/app-app-view/div/div[2]/div[1]")
      ),
      10000
    );
    let title = await driver.getTitle();

    await driver.sleep(900);
    assert.equal(title, "Mediafront", "Не открыло страницу");
  });

  // it("Библиотека", async function () {
  //   let ul = await helper.elementByXpath(
  //     "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
  //     driver
  //   );

  //   let lilist = await helper.elementsByTagName("li", ul);

  //   for (let q in lilist) {
  //     let text = await lilist[q].getText();
  //     if (text.includes("Audio")) {
  //       lilist[q].click();
  //       break;
  //     }
  //   }

  //   let theadXpath =
  //       "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/thead",
  //     tbodyXpath =
  //       "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody";

  //   let finalRes = await checkSort(theadXpath, tbodyXpath, driver, helper);

  //   let res = finalRes.every((el) => el === true);

  //   assert.isTrue(res);
  // });

  it("Филии", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[1]/div/div[2]/app-menu/div/p-panelmenu/div/div[2]/div",
      driver
    );

    let theadXpath =
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[1]/div/table/thead",
      tbodyXpath =
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody";

    let finalRes = await checkSort(theadXpath, tbodyXpath, driver, helper);

    console.log(finalRes);
  });

  //   it("Плейлисты", async function () {});

  //   it("Правила", async function () {});

  //   it("Настройки приложения", async function () {});

  //   it("Настройки MediaHub", async function () {});

  //   it("Владелец", async function () {});

  //   it("Группы филии", async function () {});
});

function splitTextAndNumbers(str) {
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

function sortUp(arr) {
  return arr.sort(compareMixedStrings);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function splitTextAndNumbers(str) {
  return str
    .match(/(\d+|\D+)/g)
    .map((part) => (isNaN(part) ? part : parseInt(part, 10)));
}

function compareMixedStringsDescending(a, b) {
  const partsA = splitTextAndNumbers(a);
  const partsB = splitTextAndNumbers(b);

  for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
    const partA = partsA[i];
    const partB = partsB[i];

    if (typeof partA === "number" && typeof partB === "number") {
      if (partA !== partB) {
        return partB - partA;
      }
    } else if (typeof partA === "string" && typeof partB === "string") {
      if (partA !== partB) {
        return partB.localeCompare(partA);
      }
    } else {
      return typeof partA === "number" ? 1 : -1;
    }
  }

  return partsB.length - partsA.length;
}

function sortDown(arr) {
  return arr.sort(compareMixedStringsDescending);
}

async function checkSort(theadXpath, tbodyXpath, driver, helper) {
  let thead = await helper.elementByXpath(theadXpath, driver);

  let thList = await helper.elementsByTagName("th", thead);

  let trlistStart = await helper.getTrFromTbodyByXpath(tbodyXpath, driver);
  let finalRes = [];

  for (let q in thList) {
    for (let i = 1; i <= 2; i++) {
      let thText = await thList[q].getText();
      if (thText === "") {
        continue;
      }
      let iEl;
      try {
        iEl = await helper.elementByTagName("i", thList[q]);
      } catch (err) {}
      if (iEl === undefined) {
        continue;
      }

      await thList[q].click();

      await driver.sleep(900);

      let trlist = await helper.getTrFromTbodyByXpath(tbodyXpath, driver);

      let textForSort = [];

      for (let w in trlist) {
        let tdList = await helper.elementsByTagName("td", trlist[w]);
        let text = await tdList[q].getText();
        textForSort.push(text);
      }

      let sorted = i === 1 ? sortUp(textForSort) : sortDown(textForSort);

      let res = [];
      sorted.forEach((el, index) => {
        res.push(el === textForSort[index]);
      });

      let result = res.every((el) => el === true);
      let msg = "";

      if (result === false) {
        msg = "Сортировка работает не верно";
      }

      if (sorted.length !== trlistStart.length) {
        result = false;
        msg = "Сортировка поля не работате";
      }

      finalRes.push({
        name: `${thText} ${i === 1 ? "up" : "down"}`,
        result,
        msg,
      });

      await driver.navigation().refresh();
    }
  }

  return finalRes;
}
