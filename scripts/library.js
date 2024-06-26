const webdriver = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { describe, before, after, it } = require("mocha");
const assert = require("chai").assert;
const Helper = require("../helpers/helper");
const fs = require("fs");
const { runInContext } = require("vm");

describe("Библиотека", function () {
  let driver, fileName;
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

  it("Создать папку", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/div/p-button[2]",
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

    let ul;

    try {
      ul = await helper.elementByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
        driver
      );
    } catch (err) {}

    if (ul === undefined) {
      await helper.clickByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/div/button",
        driver
      );
    }

    try {
      ul = await helper.elementByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
        driver
      );
    } catch (err) {}

    let text = await ul.getText();

    let result = text.includes("Autotest folder");

    assert.isTrue(result);
  });

  it("Редактировать папку", async function () {
    await driver.sleep(900);
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
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/div/p-button[3]",
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

  it("Скопировать и отредактировать файл в папку", async function () {
    let ul = await helper.elementByXpath(
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
    let file = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody/tr[1]",
      driver
    );
    await file.click();
    let tdlist = await helper.elementsByTagName("td", file);
    fileName = await tdlist[1].getText();
    fileName = fileName.slice(0, -4);
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[4]",
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
      if (text.includes("Autotest folder new")) {
        lilist[q].click();
        break;
      }
    }

    await driver.sleep(900);

    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[5]",
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
        let tdlist = await helper.elementsByTagName("td", trlist[q]);
        await tdlist[0].click();
        await driver.sleep(900);
        await helper.clickByXpath(
          "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[2]",
          driver
        );
        await driver.sleep(900);
        let input = await helper.elementByXpath(
          "/html/body/p-dynamicdialog/div/div/div[2]/app-mdeia-content-edit-modal/div/div[1]/span/input",
          driver
        );

        let inputText = await input.getAttribute("value");

        let lastDot = inputText.lastIndexOf(".");

        let fileType = inputText.slice(lastDot);

        await input.clear();

        fileName = `Auto test file${fileType}`;

        await input.sendKeys(fileName);

        await helper.clickByXpath(
          "/html/body/p-dynamicdialog/div/div/div[2]/app-mdeia-content-edit-modal/p-footer/div/div/p-button/button",
          driver
        );

        break;
      }
    }

    await driver.sleep(1200);

    trlist = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let secondRes = false;

    for (let q in trlist) {
      let text = await trlist[q].getText();
      if (text.includes(fileName)) {
        secondRes = true;
      }
    }
    let msg = "";

    if (result === false) {
      msg = "Файл не скпировался";
      assert.isTrue(false, msg);
    }
    if (secondRes === false) {
      msg = "Файл не переименновался";
      assert.isTrue(false, msg);
    }

    assert.isTrue(true);
  });

  it("Редактирование кнопкой в елементе", async function () {
    let trlist = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    for (let q in trlist) {
      let text = await trlist[q].getText();
      // if (text === fileName) {
      let edit = await helper.elementByClassName(
        "table_icon _edit ng-star-inserted",
        trlist[q]
      );
      await edit.click();
      break;
      // }
    }

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-mdeia-content-edit-modal/div/div[3]/app-chips/div/mat-chip-list/div/input",
      driver,
      "AutoTest"
    );

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-mdeia-content-edit-modal/div/div[3]/app-chips/div/mat-chip-list/div/input",
      driver,
      webdriver.Key.ENTER
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-mdeia-content-edit-modal/div/div[1]/span/input",
      driver
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-mdeia-content-edit-modal/p-footer/div/div/p-button/button",
      driver
    );

    await driver.sleep(900);

    trlist = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let result = false;

    for (let q in trlist) {
      let text = await trlist[q].getText();
      let tdlist = await helper.elementsByTagName("td", trlist[q]);
      if ((await tdlist[4].getText()) === "AutoTest") {
        result = true;
      }
      break;
    }

    assert.isTrue(
      result,
      "Изменение кнопкой из строки  елемента не выполнилась"
    );
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

  it("Создание папки в папке", async function () {
    await driver.sleep(900);
    let ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    let myFolder;

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Autotest folder new")) {
        lilist[q].click();
        myFolder = lilist[q];
        break;
      }
    }

    await driver.actions({ bridge: true }).contextClick(myFolder).perform();

    await helper.clickByXpath(
      "/html/body/div/p-contextmenusub/ul/li[1]",
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

    try {
      ul = await helper.elementByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
        driver
      );
    } catch (err) {}

    if (ul === undefined) {
      await helper.clickByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/div/button",
        driver
      );
    }

    let ul1;

    try {
      ul1 = await helper.elementByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul",
        driver
      );
    } catch (err) {
      assert.isTrue(false);
    }

    if (ul1 !== undefined) {
      let liList = await helper.elementsByTagName("li", ul1);

      for (let q in liList) {
        let text = await liList[q].getText();
        if (text === "Autotest folder new") {
          let btn = await helper.elementByTagName("button", liList[q]);
          await btn.click();
        }
      }
    }

    await driver.sleep(900);

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul",
      driver
    );

    let listLi = await helper.elementsByTagName("li", ul);

    for (let q in listLi) {
      let text = await listLi[q].getText();
      if (text === "Autotest folder") {
        result = true;
      }
    }

    assert.isTrue(result);
  });

  it("Удалить папку с папкой внутри", async function () {
    let ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text === "Autotest folder new") {
        lilist[q].click();
        break;
      }
    }
    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/div/p-button[4]",
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

  it("Создание папки с файлами и ее удаление", async function () {
    let ul, lilist;

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/div",
      driver
    );

    let result = [];
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/div/p-button[2]",
      driver
    );

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-folder-create-modal/div/div[1]/input",
      driver,
      "Autotest folder new"
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

    try {
      ul = await helper.elementByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
        driver
      );
    } catch (err) {}

    if (ul === undefined) {
      await helper.clickByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/div/button",
        driver
      );
    }

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let text = await ul.getText();

    result.push(text.includes("Autotest folder new"));

    ////////////////создание папки закончено

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul",
      driver
    );

    lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Audio")) {
        lilist[q].click();
        break;
      }
    }

    await driver.sleep(900);

    let file = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody/tr[1]",
      driver
    );
    await file.click();
    let tdlist = await helper.elementsByTagName("td", file);
    fileName = await tdlist[1].getText();
    fileName = fileName.slice(0, -4);
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[4]",
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
      if (text.includes("Autotest folder new")) {
        lilist[q].click();
        break;
      }
    }

    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[5]",
      driver
    );

    await driver.sleep(900);

    let trlist = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let resLength = result.length;
    result.push(false);

    for (let q in trlist) {
      let text = await trlist[q].getText();
      if (text.includes(fileName)) {
        result[resLength] = true;
        break;
      }
    }

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text === "Autotest folder new") {
        lilist[q].click();
        break;
      }
    }
    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/div/p-button[4]",
      driver
    );
    await driver.sleep(900);

    let deleteMsgBox = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-confirmdialog/div/div/div[2]",
      driver
    );

    let deleteText = await deleteMsgBox.getText();

    if (
      deleteText ===
      "Видалення цієї папки призведе до втрати всіх файлів і вкладених папок. Ви дійсно бажаєте видалити цю папку?"
    ) {
      result.push(true);
    } else {
      result.push(false);
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/p-confirmdialog/div/div/div[3]/button[2]",
      driver
    );

    ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    lilist = await helper.elementsByTagName("li", ul);

    resLength = result.length;
    result.push(false);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("Autotest folder")) {
        result[resLength] = true;
        break;
      }
    }

    let finalResult = result.every((el) => el === true);

    assert.isTrue(finalResult);
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
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[10]",
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
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/div[1]/p-button[11]",
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

  it("Проверка смены темы", async function () {
    let body = await helper.elementByTagName("body", driver);

    let theme = await body.getAttribute("class");

    let btn = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[1]/div[2]/div[2]/button/i",
      driver
    );

    let className = await btn.getAttribute("class");

    if (className.includes("pi-moon") && theme === "light-theme") {
      await driver.executeScript("arguments[0].click();", btn);
    }
    await driver.executeScript("arguments[0].click();", btn);

    await driver.sleep(900);

    body = await helper.elementByTagName("body", driver);

    let theme1 = await body.getAttribute("class");

    if (theme === theme1) {
      assert.isTrue(false, "Смены темы не произошло");
    } else {
      assert.isTrue(true);
    }
  });

  it("Проверка смены колво елементов на странцие", async function () {
    let ul = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[1]/div/div/p-tree/div/div/ul/p-treenode/li/ul",
      driver
    );

    let lilist = await helper.elementsByTagName("li", ul);

    for (let q in lilist) {
      let text = await lilist[q].getText();
      if (text.includes("AutoTestAmountOnPage")) {
        lilist[q].click();
        break;
      }
    }

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let numberCurentMax = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/p-paginator/div/div/p-dropdown",
      driver
    );

    if (Number(await numberCurentMax.getText()) > 10) {
      await numberCurentMax.click();

      await driver.sleep(400);

      await helper.clickByXpath(
        "/html/body/div[2]/div/div/div/ul/p-dropdownitem[1]",
        driver
      );
    }

    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    numberCurentMax = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/p-paginator/div/div/p-dropdown",
      driver
    );

    if (trList.length !== Number(await numberCurentMax.getText())) {
      assert.isTrue(false, "Слишком мало елементов в папке");
    }

    await numberCurentMax.click();

    await driver.sleep(900);

    ul = await driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.xpath("/html/body/div[3]/div/div/div/ul")
      ),
      5000
    );

    let li = await helper.elementsByTagName("li", ul);
    for (let q in li) {
      let text = await li[q].getText();
      if (Number(text) === 100) {
        await li[q].click();
      }
    }
    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    numberCurentMax = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/p-splitter/div/div[3]/div/div/app-media-conntent-view/app-table/div/p-table/div/p-paginator/div/div/p-dropdown",
      driver
    );

    if (
      trList.length !== Number(await numberCurentMax.getText()) &&
      trList.length < 25
    ) {
      assert.isTrue(false, "На странице мало елементов");
    }

    if (
      trList.length > 25 &&
      trList.length !== Number(await numberCurentMax.getText())
    ) {
      assert.isTrue(
        false,
        "Не сработало изменение колва на странице либо мало елементов в папке"
      );
    }

    assert.isTrue(true);
  });
});
