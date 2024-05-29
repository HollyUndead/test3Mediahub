const webdriver = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { describe, before, after, it } = require("mocha");
const assert = require("chai").assert;
const Helper = require("../helpers/helper");
const fs = require("fs");

describe("Филии", function () {
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

  it("Открыть Филии", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[1]/div/div[2]/app-menu/div/p-panelmenu/div/div[2]/div/a",
      driver
    );

    await driver.sleep(900);

    let url = await driver.getCurrentUrl();

    assert.equal("http://192.168.16.14:6521/app/branches", url);
  });

  it("Создать филий", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[2]",
      driver
    );

    await driver.sleep(900);

    let calender = await helper.elementsByTagName("p-calendar", driver);

    for (let q in calender) {
      await calender[q].click();
      q = Number(q);

      await driver.sleep(400);
      if (q % 2 === 0) {
        await helper.clickByXpath(
          `/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[2]/div/div[2]/div[${
            q + 2
          }]/div/span[1]/p-calendar/span/div/div/div[1]/button[2]`,
          driver
        );
      } else {
        await helper.clickByXpath(
          `/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[2]/div/div[2]/div[${
            q + 1
          }]/div/span[2]/p-calendar/span/div/div/div[1]/button[1]`,
          driver
        );
      }

      await driver.sleep(500);
    }

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[2]/span/p-dropdown",
      driver
    );
    await driver.sleep(500);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[2]/span/p-dropdown/div/p-overlay/div/div/div/div/ul/p-dropdownitem[1]",
      driver
    );
    await driver.sleep(500);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[3]/span/input",
      driver,
      "Test mediabox"
    );
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[4]/span/input",
      driver,
      "789456132"
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[8]/span/p-autocomplete",
      driver
    );
    await driver.sleep(500);
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[8]/span/p-autocomplete/span/div/ul/li[1]",
      driver
    );
    await driver.sleep(500);

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[1]/span/input",
      driver
    );

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[1]/span/input",
      driver,
      "123456"
    );
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[5]/span/input",
      driver,
      "Alex auto test"
    );
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[6]/span/input",
      driver,
      "Smallwill"
    );
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[7]/span/input",
      driver,
      "221B Baker Street"
    );
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[9]/app-chips/div/mat-chip-list/div/input",
      driver,
      "autotest"
    );
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/div/div[1]/div/div[10]/span/textarea",
      driver,
      "Some text just for testing"
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-create-modal/p-footer/div/div/p-button/button",
      driver
    );

    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    let result = false;

    for (let q in trList) {
      q = Number(q);
      let text = await trList[q].getText();
      if (text.includes("Alex auto test")) {
        result = true;
        myFili = await helper.elementByXpath(
          `/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[1]/div[2]/table/tbody/tr[${
            q + 1
          }]`,
          driver
        );
        await helper.clcikByClassName("p-checkbox-box", myFili);

        break;
      }
    }

    assert.isTrue(result);
  });

  it("Изменить филий", async function () {
    await helper.clcikByClassName("table_icon _edit ng-star-inserted", myFili);
    await driver.sleep(900);
    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-edit-modal/div/div[1]/div/div[5]/span/input",
      driver,
      " new"
    );
    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-edit-modal/p-footer/div/div/p-button/button",
      driver
    );
    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    let result = false;

    for (let q in trList) {
      q = Number(q);
      let text = await trList[q].getText();
      if (text.includes("Alex auto test new")) {
        result = true;
        myFili = await helper.elementByXpath(
          `/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[1]/div[2]/table/tbody/tr[${
            q + 1
          }]`,
          driver
        );
        await helper.clcikByClassName("p-checkbox-box", myFili);
        break;
      }
    }

    assert.isTrue(result);
  });

  it("Добавить правила на филию", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[7]",
      driver
    );

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-add-rule-modal/div/div/app-chips/div/mat-chip-list/div/input",
      driver,
      "Тестове"
    );

    await driver.sleep(400);

    await helper.clickByXpath("/html/body/div/div/div/div/mat-option", driver);

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-add-rule-modal/p-footer/div/button",
      driver
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[6]",
      driver
    );

    await driver.sleep(900);

    let taskList = await helper.elementsByClassName("sg-task-content", driver);

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[1]/div/button",
      driver
    );

    assert.isNotEmpty(taskList, "Правило не применилось");
  });

  it("Проврка фильтров", async function () {
    let res = [
      { name: "Ідентифікатор", state: true },
      { name: "Назва", state: true },
      { name: "Місто", state: true },
      { name: "Адерса", state: true },
      { name: "Групи", state: true },
      { name: "Дата створення", state: true },
    ];

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[8]",
      driver
    );

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[1]/div/input",
      driver,
      "123456"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("123456") === false) {
        res[0].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );
    await driver.sleep(900);
    ////////////////////////////

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[2]/div/input",
      driver,
      "Alex auto test"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );

    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Alex auto test") === false) {
        res[1].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );
    await driver.sleep(900);
    ////////////////////////

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[4]/div/input",
      driver,
      "Smallwill"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );
    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Smallwill") === false) {
        res[2].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );
    await driver.sleep(900);
    ////////////////////////

    await helper.sendKeysByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[5]/div/input",
      driver,
      "221B Baker Street"
    );

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );
    await driver.sleep(1200);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("221B Baker Street") === false) {
        res[3].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );
    await driver.sleep(900);
    ////////////////////////

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[3]/span/p-autocomplete/span/input",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[3]/span/p-autocomplete/span/div/ul/li[1]",
      driver
    );
    await driver.sleep(900);
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );
    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Східний регіон") === false) {
        res[4].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );
    await driver.sleep(900);
    /////////////////////////

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[6]/div/p-calendar",
      driver
    );

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[6]/div/p-calendar/span/div/div/div/div[2]/table/tbody",
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
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[2]",
      driver
    );
    await driver.sleep(900);
    let date = await helper.elementByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[2]/div/p-scrollpanel/app-branch-filter-form/div[6]/div/p-calendar/span/input",
      driver
    );

    let text1 = await date.getAttribute("value");

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes(text1.slice(0, 10)) === false) {
        res[5].state = false;
      }
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[3]/div/div/button[1]",
      driver
    );

    /////////////////////

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-sidebar/div/div[1]/button",
      driver
    );

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

  // it("Скопировать филию", async function () {
  //   await helper.clickByXpath(
  //     "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[3]",
  //     driver
  //   );
  //   await driver.sleep(900);

  //   let notification;
  //   try {
  //     notification = await helper.elementByXpath(
  //       "/html/body/app-root/p-toast/div/p-toastitem/div/div",
  //       driver
  //     );
  //   } catch (err) {}

  //   if (notification === undefined) {
  //     assert.isTrue(true);
  //   }

  //   assert.isTrue(false);
  // });

  it("Проверка настрйки медибокс", async function () {
    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let tdList = await helper.elementsByTagName("td", trList[q]);
      if ((await tdList[2].getText()).includes("Alex auto test new")) {
        let trlist = await helper.getTrFromTbodyByXpath(
          "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[1]/div[2]/table/tbody",
          driver
        );
        let settingssBtn = await helper.elementByClassName(
          "p-ripple",
          trlist[q]
        );
        await settingssBtn.click();
      }
    }

    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let tdList = await helper.elementsByTagName("td", trList[q]);
      if ((await tdList[2].getText()) === "Test mediabox") {
        let trlist = await helper.getTrFromTbodyByXpath(
          "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[1]/div[2]/table/tbody",
          driver
        );
        let settingssBtn = await helper.elementByClassName(
          "_settings",
          trlist[q]
        );
        await settingssBtn.click();
      }
    }

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-setting-value-modal/app-media-box-setting-value-view/div/app-table/div/p-table/div/div/table/tbody/tr[6]/td[4]/div/button[1]",
      driver
    );

    await driver.sleep(900);

    let input = await helper.elementByXpath(
      "/html/body/p-dynamicdialog[2]/div/div/div[2]/app-media-box-setting-value-edit-modal/div/div[3]/span/input",
      driver
    );

    await input.clear();

    await input.sendKeys("12:30");

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog[2]/div/div/div[2]/app-media-box-setting-value-edit-modal/p-footer/div/div/p-button/button",
      driver
    );

    await driver.sleep(900);

    trList = await await helper.getTrFromTbodyByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-setting-value-modal/app-media-box-setting-value-view/div/app-table/div/p-table/div/div/table/tbody",
      driver
    );

    let res = true;

    for (let q in trList) {
      let tdList = await helper.elementsByTagName("td", trList[q]);
      let text = await tdList[0].getText();
      if (text.includes("")) {
        res = (await tdList[2].getText()) === "12:30";
      }
    }

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[1]/div/button",
      driver
    );

    assert.isTrue(res, "Настройки медиабокса не поменялись");
  });

  it("Применение правила на все филии", async function () {
    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );
    for (let q in trList) {
      let trlist = await helper.getTrFromTbodyByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[1]/div[2]/table/tbody",
        driver
      );
      if ((await trList[q].getText()).includes("Branch 10001")) {
        continue;
      }
      let checkbox = await helper.elementByTagName(
        "p-treetablecheckbox",
        trlist[q]
      );
      await checkbox.click();
    }

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[7]",
      driver
    );

    await driver.sleep(900);

    await helper.sendKeysByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-add-rule-modal/div/div/app-chips/div/mat-chip-list/div/input",
      driver,
      "Тестове"
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/div/div/div/div/mat-option[1]",
      driver
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-add-rule-modal/p-footer/div/button",
      driver
    );

    await driver.sleep(900);

    await driver.navigate().refresh();

    await driver.wait(
      webdriver.until.elementLocated(
        webdriver.By.xpath(
          "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table"
        )
      )
    );
    // trList = await helper.getTrFromTbodyByXpath(
    //   "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
    //   driver
    // );
    // console.log(trList.length);
    // for (let q in trList) {
    //   let trlist = await helper.getTrFromTbodyByXpath(
    //     "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[1]/div[2]/table/tbody",
    //     driver
    //   );
    //   if (
    //     (await trList[q].getText()).includes("Branch 10001") ||
    //     (await trList[q].getText()).includes("Test mediabox")
    //   ) {
    //     continue;
    //   } else {
    //     try {
    //       let checkbox = await helper.elementByTagName(
    //         "p-treetablecheckbox",
    //         trlist[q]
    //       );
    //       await checkbox.click();
    //     } catch (err) {
    //       console.log(err, "some error");
    //     }
    //     console.log(await trlist[q].getAttribute("innerHTML"));
    //   }
    // }

    await driver.sleep(900);

    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );
    trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );
    let res = [];
    let msg = "";
    for (let q in trList) {
      let tdList = await helper.elementsByTagName("td", trList[q]);
      let text = await tdList[2].getText();
      if (text.includes("Branch 10001") || text.includes("Test mediabox")) {
        continue;
      }
      await trList[q].click();
      await helper.clickByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[6]",
        driver
      );

      await driver.sleep(900);

      let taskList = await helper.elementsByClassName("sg-task", driver);

      await helper.clickByXpath(
        "/html/body/p-dynamicdialog/div/div/div[1]/div/button",
        driver
      );

      let res1 = taskList.length !== 0;

      if (res1 === false) {
        msg += `\nНе принял првило ${text}`;
      }
      res.push(res1);
    }

    let finalRes = res.every((el) => el === true);

    assert.isTrue(finalRes, msg);
  });

  it("Удалить филию", async function () {
    let trlist = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    let trlist1 = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[1]/div[2]/table/tbody",
      driver
    );

    for (let q in trlist) {
      let text = await trlist[q].getText();
      if (text.includes("Alex auto test new")) {
        let deleteBtn = await helper.elementsByTagName("button", trlist1[q]);
        for (let t in deleteBtn) {
          let className = await deleteBtn[t].getAttribute("class");
          if (className.includes("_delete")) {
            await deleteBtn[t].click();
          }
        }
      }
    }

    let nameDeleEle = await helper.textByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-confirmdialog/div/div/div[2]/span",
      driver
    );

    await driver.sleep(900);
    if (nameDeleEle.includes("Alex auto test new")) {
      await helper.clickByXpath(
        "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-confirmdialog/div/div/div[3]/button[2]",
        driver
      );
    } else {
      assert.isTrue(false, "Удаление не того елемента");
    }
    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("Alex auto test new")) {
        assert.isTrue(false);
      }
    }

    assert.isTrue(true);
  });
});
