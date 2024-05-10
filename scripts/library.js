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

    await driver.sleep(900);
    assert.equal(title, "Mediafront", "Не открыло страницу");
  });

  it("Создать папку", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[2]",
      driver
    );

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-folder-create-modal/div/div[1]/input",
      driver,
      "Autotest folder"
    );

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-folder-create-modal/div/div[2]/input",
      driver,
      "auto test"
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-folder-create-modal/div/p-footer/div/div/p-button/button",
      driver
    );

    await driver.sleep(900);

    let ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let text = await ul.getText();

    let result = text.includes("Autotest folder");

    assert.isTrue(result);
  });

  it("Редактировать папку", async function () {
    let ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Autotest folder")) {
        lilist[q].click();
        break;
      }
    }

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[3]",
      driver
    );

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-folder-edit-modal/div/div[1]/input",
      driver,
      " new"
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-folder-edit-modal/div/p-footer/div/div/p-button/button",
      driver
    );

    await driver.sleep(900);

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    lilist = await helper.elementsByTagName("li", ul);
    let result = false;
    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Autotest folder new")) {
        result = true;
        break;
      }
    }
    assert.isTrue(result);
  });

  it("Скопировать файл в папку", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul/p-treenode[2]/li",
      driver
    );

    await driver.sleep(900);
    let file = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody/tr[1]",
      driver
    );
    await file.click();
    let tdlist = await helper.elementsByTagName("td", file);
    let fileName = await tdlist[1].getText();
    fileName = fileName.slice(0, -4);
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[8]",
      driver
    );

    await driver.sleep(900);
    let ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Autotest folder new")) {
        lilist[q].click();
        break;
      }
    }

    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[9]",
      driver
    );

    await driver.sleep(900);

    let trlist = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let result = false;

    for (let q in trlist) {
      let text = await trlist[q].getText();
      if (text.includes(fileName)) {
        result = true;
        break;
      }
    }

    assert.isTrue(result);
  });

  it("Удалить файл из папки", async function () {
    let ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Autotest folder new")) {
        lilist[q].click();
        break;
      }
    }
    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody/tr/td[6]/div/button[2]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/p-confirmdialog/div/div/div[3]/button[2]",
      driver
    );

    await driver.sleep(900);

    let trlist = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    assert.isEmpty(trlist);
  });

  it("Удалить папку", async function () {
    let ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Autotest folder new")) {
        lilist[q].click();
        break;
      }
    }
    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[4]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-confirmdialog/div/div/div[3]/button[2]",
      driver
    );

    await driver.sleep(900);

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    lilist = await helper.elementsByTagName("li", ul);

    let result = true;

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Autotest folder")) {
        result = false;
        break;
      }
    }

    assert.isTrue(result);
  });

  it("Филтры", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[12]",
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

    let result = true;

    for (let q in lilist) {
      let text = await lilist[q].getText();

      if (text.includes("Video")) {
        result = false;
        break;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-sidebar/div/div[1]/button",
      driver
    );

    assert.isTrue(result);
  });

  it("Смена вида отображения", async function () {
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

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[14]",
      driver
    );

    await driver.sleep(900);

    let div = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div",
      driver
    );

    let css = await div.getAttribute("style");

    if (css.includes("none")) {
      assert.isTrue(false, "Смена вида отображения в плитки не сработало");
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[15]",
      driver
    );

    await driver.sleep(900);

    div = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div",
      driver
    );

    css = await div.getAttribute("style");

    if (css.includes("block")) {
      assert.isTrue(false, "Смена вида отображения в список не сработало");
    }

    assert.isTrue(true);
  });
});
