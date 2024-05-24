const webdriver = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { describe, before, after, it } = require("mocha");
const assert = require("chai").assert;
const Helper = require("../helpers/helper");
const fs = require("fs");
const { DESTRUCTION } = require("dns");

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
        webdriver.By.xpath("/html/body/app-root/app-login/section/div[1]")
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
      5000
    );
    let title = await driver.getTitle();

    await driver.sleep(900);
    assert.equal(title, "Mediafront", "Не открыло страницу");
  });

  it("Филтры", async function () {
    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Video")) {
        lilist[q].click();
        break;
      }
    }

    let res = [
      { name: "КАТЕГОРІЇ", state: true },
      { name: "Автор", state: true },
      { name: "Дата завантаження", state: true },
      { name: "Теги", state: true },
    ];

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[8]",
      driver
    );
    await driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.xpath(
          "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]"
        )
      ),
      5000
    );

    let checkboxs = await helper.elementsByTagName("p-checkbox", driver);

    for (let q in checkboxs) {
      let text = await checkboxs[q].getText();
      if (text.includes("Video")) {
        await checkboxs[q].click();
      }
    }

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();

      if (text.includes("Video") === true) {
        res[0].state = false;
        break;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );

    checkboxs = await helper.elementsByTagName("p-checkbox", driver);

    for (let q in checkboxs) {
      let text = await checkboxs[q].getText();
      if (text.includes("Video")) {
        await checkboxs[q].click();
      }
    }
    ////////////////////

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[2]/div/input",
      driver,
      "admin"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("admin") === false) {
        res[1].state = false;
        break;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );
    ////////////////////

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[3]/div/p-calendar",
      driver
    );

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[3]/div/p-calendar/span/div/div/div/div[2]/table/tbody",
      driver
    );

    outter: for (let q in trList) {
      let tdList = await helper.elementsByTagName("td", trList[q]);
      for (let t in tdList) {
        let classList = await tdList[t].getAttribute("class");
        if (classList.includes("p-datepicker-today")) {
          await tdList[t].click();
          await driver.sleep(200);
          await tdList[t].click();
          await driver.sleep(800);
          break outter;
        }
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );
    await driver.sleep(900);
    let date = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[3]/div/p-calendar/span/input",
      driver
    );

    let text1 = await date.getAttribute("value");

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes(text1.slice(0, 10)) === false) {
        res[2].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );

    ////////////////////

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[4]/app-chips/div/mat-chip-list/div/input",
      driver,
      "Демо"
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Демо") === false) {
        res[3].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );

    ////////////////////

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]/button",
      driver
    );

    await driver.sleep(900);

    let result = res.every((el) => el.state === true);

    let ar,
      erStr = "Фильтры провалившие проверку:";

    if (result === false) {
      ar = res.filter((el) => el.state === false);
    }

    if (ar !== undefined) {
      ar.forEach((el, index) => {
        erStr += ` ${el.name}`;
        if (index !== ar.length - 1) {
          erStr += ",";
        }
      });
    }

    assert.isTrue(result, erStr);
  });

  it("Проверка кнопки сброса фильтров вне окна фильтров", async function () {
    let msgArr = [
      "Провалил проверку фильтра",
      "Провалил проверку кнопки сброса фильтров",
      "Провалило проверку сброса фильтра в окне фильтров",
      "Провалило обе проверки сброса и функциональный и визуальный",
    ];
    let resetFunc = false;
    let resetVis = true;
    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Audio")) {
        lilist[q].click();
        break;
      }
    }

    await driver.sleep(900);

    let res = [
      { name: "КАТЕГОРІЇ", state: true, msg: "" },
      { name: "Автор", state: true, msg: "" },
      { name: "Дата завантаження", state: true, msg: "" },
      { name: "Теги", state: true, msg: "" },
    ];

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[8]",

      driver
    );
    await driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.xpath(
          "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]"
        )
      ),
      5000
    );
    ///////////////////////
    let checkboxs = await helper.elementsByTagName("p-checkbox", driver);

    for (let q in checkboxs) {
      let text = await checkboxs[q].getText();
      if (text.includes("Video")) {
        await checkboxs[q].click();
      }
    }

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Video") === true) {
        res[0].msg = msgArr[0];
        res[0].state = false;
        break;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]/button",
      driver
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[9]",
      driver
    );
    await driver.sleep(900);

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Video") === true) {
        resetFunc = true;
        break;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[8]",
      driver
    );

    await driver.sleep(900);

    checkboxs = await helper.elementsByTagName("p-checkbox", driver);

    for (let q in checkboxs) {
      let text = await checkboxs[q].getText();
      if (text.includes("Video")) {
        let classList = await checkboxs[q].getAttribute("class");
        if (classList.includes("p-checkbox-checked") === false) {
          resetVis = false;
          await checkboxs[q].click();
          break;
        }
      }
    }

    checkResult(res[0], resetVis, resetFunc, msgArr);

    //////////////////

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let startAmount = trList.length;

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[2]/div/input",
      driver,
      "admin"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let textArr = [];

    for (let q in trList) {
      let text = await trList[q].getText();
      textArr.push(text);
      if (text.includes("admin") === false) {
        res[1].msg = msgArr[0];
        res[1].state = false;
        break;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]/button",
      driver
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[9]",
      driver
    );
    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    resetFunc = false;
    resetVis = true;
    let textArr1 = [];

    for (let q in trList) {
      let text = await trList[q].getText();
      textArr1.push(text);
    }

    if (textArr.length === textArr1.length) {
      if (textArr.length === startAmount) {
        resetFunc = true;
      } else {
        textArr1.forEach((el) => {
          if (textArr.includes(el) === false) {
            resetFunc = true;
          }
        });
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[8]",
      driver
    );

    await driver.sleep(900);

    let filterTextEl = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[2]/div/input",
      driver
    );

    let filterText = await filterTextEl.getText();

    if (filterText !== "") {
      resetVis = false;
      await filterTextEl.clear();
    }

    checkResult(res[1], resetVis, resetFunc, msgArr);

    //////////////////

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[3]/div/p-calendar",
      driver
    );

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[3]/div/p-calendar/span/div/div/div/div[2]/table/tbody",
      driver
    );

    outter: for (let q in trList) {
      let tdList = await helper.elementsByTagName("td", trList[q]);
      for (let t in tdList) {
        let classList = await tdList[t].getAttribute("class");
        if (classList.includes("p-datepicker-today")) {
          await tdList[t].click();
          await driver.sleep(200);
          await tdList[t].click();
          await driver.sleep(800);
          break outter;
        }
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );
    await driver.sleep(900);
    let date = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[3]/div/p-calendar/span/input",
      driver
    );

    let dateText = await date.getAttribute("value");

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes(dateText.slice(0, 10)) === false) {
        res[2].msg = msgArr[0];
        res[2].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]/button",
      driver
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[9]",
      driver
    );
    await driver.sleep(900);

    resetFunc = false;
    resetVis = true;

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes(dateText.slice(0, 10)) === false) {
        resetFunc = true;
      }
    }
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[8]",
      driver
    );

    await driver.sleep(900);

    date = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[3]/div/p-calendar/span/input",
      driver
    );

    dateText = await date.getAttribute("value");

    if (dateText !== "") {
      resetVis = false;
    }

    checkResult(res[2], resetVis, resetFunc, msgArr);

    ////////////////////

    let tagInput = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[4]/app-chips/div/mat-chip-list/div/input",
      driver
    );

    await tagInput.sendKeys("Демо");

    await tagInput.sendKeys(webdriver.Key.ENTER);

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Демо") === false) {
        res[3].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]/button",
      driver
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[9]",
      driver
    );
    await driver.sleep(900);

    resetFunc = false;
    resetVis = true;

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Демо") === false) {
        resetFunc = true;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[8]",
      driver
    );

    await driver.sleep(900);

    let div = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[2]/div/p-scrollpanel/app-media-filter-sidebar/div[4]/app-chips/div/mat-chip-list/div",
      driver
    );

    let btnList = await helper.elementsByTagName("button", div);

    if (btnList.length !== 0) {
      for (let q in btnList) {
        await btnList[q].click();
      }
      resetVis = false;
    }

    checkResult(res[3], resetVis, resetFunc, msgArr);

    ////////////////////

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]/button",
      driver
    );

    await driver.sleep(900);

    let result = res.every((el) => el.state === true);

    let ar,
      erStr = "Фильтры провалившие проверку сброса: \n";

    if (result === false) {
      ar = res.filter((el) => el.state === false);
    }

    if (ar !== undefined) {
      ar.forEach((el, index) => {
        erStr += ` ${el.name}: ${el.msg} \n`;
      });
    }

    assert.isTrue(result, erStr);
  });
});

function checkResult(res, resV, resF, msgArr) {
  if (res.state !== false) {
    if (resV === false && resF === false) {
      res.state = false;
      res.msg = msgArr[3];
    } else if (resF === false) {
      res.state = false;
      res.msg = msgArr[1];
    } else if (resV === false) {
      res.state = false;
      res.msg = msgArr[2];
    }
  }
}
