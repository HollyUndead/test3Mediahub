const webdriver = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { describe, before, after, it } = require("mocha");
const assert = require("chai").assert;
const Helper = require("../helpers/helper");
const fs = require("fs");

describe("Плейлист", function () {
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

  it("Открыть плейлисты", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[1]/div/div[2]/app-menu/div/p-panelmenu/div/div[3]/div/a",
      driver
    );

    await driver.sleep(900);

    let url = await driver.getCurrentUrl();

    assert.equal("http://192.168.16.14:6521/app/playlists", url);
  });

  it("Создать плейлист", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/div/p-button[2]",
      driver
    );

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-play-list-create-modal/div/div[1]/span/input",
      driver,
      "Auto test playlist"
    );
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-play-list-create-modal/div/div[2]/span/textarea",
      driver,
      "Some text for testin purpose"
    );
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-play-list-create-modal/div/div[3]/app-chips/div/mat-chip-list/div/input",
      driver,
      "test"
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-play-list-create-modal/p-footer/div/div/p-button/button",
      driver
    );

    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[1]/div/div/app-play-list-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let result = false;

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Auto test playlist")) {
        result = true;
        break;
      }
    }

    assert.isTrue(result);
  });

  it("Изменить плейлист(название)", async function () {
    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[1]/div/div/app-play-list-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Auto test playlist")) {
        await trList[q].click();
        await helper.clickByTagName("button", trList[q]);
        break;
      }
    }

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-play-list-edit-modal/div/div[1]/span/input",
      driver,
      " new"
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-play-list-edit-modal/p-footer/div/div/p-button/button",
      driver
    );

    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[1]/div/div/app-play-list-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let result = false;

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Auto test playlist new")) {
        result = true;
        await trList[q].click();
        break;
      }
    }

    assert.isTrue(result);
  });

  it("Фильтры", async function () {
    let res = [
      { name: "Назва", state: true },
      { name: "Опис", state: true },
    ];
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/div/p-button[8]",
      driver
    );

    let reference = false;

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[1]/div/div/app-play-list-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Auto test playlist new") === true) {
        reference = true;
        break;
      }
    }

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-playlist-filter/div[1]/div/input",
      driver,
      "Auto test playlist new"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    if (reference === true) {
      trList = await helper.getTrFromTbodyByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[1]/div/div/app-play-list-view/app-table/div/p-table/div/div/table/tbody",
        driver
      );

      if (trList.length === 0) {
        res[0].state = false;
      }

      for (let q in trList) {
        let text = await trList[q].getText();
        if (text.includes("Auto test playlist new") === false) {
          res[0].state = false;
        }
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );

    ///////////////////////

    await driver.sleep(900);

    reference = false;

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[1]/div/div/app-play-list-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Some text for testin purpose") === true) {
        reference = true;
        break;
      }
    }

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-playlist-filter/div[2]/div/input",
      driver,
      "Some text for testin purpose"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    if (reference === true) {
      trList = await helper.getTrFromTbodyByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[1]/div/div/app-play-list-view/app-table/div/p-table/div/div/table/tbody",
        driver
      );

      if (trList.length === 0) {
        res[1].state = false;
      }
      for (let q in trList) {
        let text = await trList[q].getText();
        if (text.includes("Some text for testin purpose") === false) {
          res[1].state = false;
        }
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );

    ///////////////////////

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/p-sidebar/div/div[1]/button",
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

  it("Добавление и удаление видео в плейлист", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/div/p-button[4]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-added-records-modal/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul/p-treenode[4]/li",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-added-records-modal/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody/tr[1]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-added-records-modal/p-footer/div/button",
      driver
    );
    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[3]/div/div/app-playlist-records-view/app-table/div/p-table/div/div/table/tbody/tr/td[6]/div/button[2]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[3]/div/div/app-playlist-records-view/p-confirmdialog/div/div/div[3]/button[2]",
      driver
    );
    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[3]/div/div/app-playlist-records-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    assert.isEmpty(trList);
  });

  it("Удаление плейлиста", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/div/p-button[5]",
      driver
    );

    await driver.sleep(500);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-playlist-with-records-view/div/p-splitter/div/div[1]/div/div/app-play-list-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Auto test playlist new")) {
        assert.isTrue(false);
      }
    }

    assert.isTrue(true);
  });
});
