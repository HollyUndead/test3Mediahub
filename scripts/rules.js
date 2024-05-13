const webdriver = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { describe, before, after, it } = require("mocha");
const assert = require("chai").assert;
const Helper = require("../helpers/helper");
const fs = require("fs");

describe("Библиотека", function () {
  let driver, myFili;
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
    let title = await driver.getTitle();
    console.log(title);
    await driver.sleep(900);
    assert.equal(title, "Mediafront", "Не открыло страницу");
  });

  it("Открыть правила", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[1]/div/div[2]/app-menu/div/p-panelmenu/div/div[4]/div/a",
      driver
    );

    await driver.sleep(900);

    let url = await driver.getCurrentUrl();

    assert.equal("http://192.168.16.14:6521/app/playing-rule", url);
  });

  it("Создать правила", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playing-rule-view/div/app-table/div/div/p-button[2]",
      driver
    );

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-playing-rule-create-modal/div/div/div[2]/div[1]/span/input",
      driver,
      "Auto test rule"
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-playing-rule-create-modal/div/div/div[3]/div[1]/span/p-calendar/span/input",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/div/div/div/div[2]/table/tbody/tr[2]/td[1]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/div/div/div/div[2]/table/tbody/tr[4]/td[1]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-playing-rule-create-modal/div/div/div[3]/div[2]/div/span[1]/p-calendar/span/input",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath("/html/body/div/div/div[1]/button[2]", driver);
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-playing-rule-create-modal/div/div/div[3]/div[2]/div/span[2]/p-calendar/span/input",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath("/html/body/div/div/div[1]/button[1]", driver);
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-playing-rule-create-modal/div/div/div[4]/div[1]/span/app-selection-days-of-week/div/p-togglebutton[2]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-playing-rule-create-modal/p-footer/div/div/p-button/button",
      driver
    );
    await driver.sleep(900);
    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playing-rule-view/div/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let res = false;

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Auto test rule")) {
        res = true;
        myFili = trList[q];
        break;
      }
    }

    assert.isTrue(res);
  });

  it("Изменить правила", async function () {
    await helper.clcikByClassName("table_icon _edit ng-star-inserted", myFili);

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-playing-rule-edit-modal/div[2]/p-splitter/div/div[1]/div/div/div/div/app-playing-rule-card/div/div[1]/div[1]/span/input",
      driver,
      " new"
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-playing-rule-edit-modal/p-footer/div/button[2]",
      driver
    );

    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playing-rule-view/div/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let res = false;

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Auto test rule new")) {
        res = true;
        myFili = trList[q];
        break;
      }
    }

    assert.isTrue(res);
  });

  it("Удалиние правила", async function () {
    await helper.clcikByClassName(
      "table_icon _delete ng-star-inserted",
      myFili
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playing-rule-view/p-confirmdialog/div/div/div[3]/button[2]",
      driver
    );

    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playing-rule-view/div/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let res = true;

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Auto test rule new")) {
        res = false;
        break;
      }
    }

    assert.isTrue(res);
  });
});
