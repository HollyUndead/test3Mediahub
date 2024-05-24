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

  it("Просмотреть плейлисты", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[6]",
      driver
    );

    await driver.wait(
      webdriver.until.elementLocated(webdriver.By.tagName("p-toastitem")),
      7000
    );

    await helper.clickByXpath(
      "/html/body/p-dynamicdialog/div/div/div[1]/div/button",
      driver
    );

    assert.isTrue(true);
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

  it("Скопировать филию", async function () {
    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[3]",
      driver
    );
    await driver.sleep(900);

    let notification;
    try {
      notification = await helper.elementByXpath(
        "/html/body/app-root/p-toast/div/p-toastitem/div/div",
        driver
      );
    } catch (err) {}

    if (notification === undefined) {
      assert.isTrue(true);
    }

    assert.isTrue(false);
  });

  // it("Назначить правило и проверка", async function () {
  //   await helper.clickByXpath(
  //     "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[7]",
  //     driver
  //   );
  //   await driver.sleep(900);
  //   let trList = await helper.getTrFromTbodyByXpath(
  //     "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-add-rule-modal/div/p-splitter/div/div[1]/div/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
  //     driver
  //   );

  //   let tdlist;

  //   for (let q in trList) {
  //     q = Number(q);
  //     let text = await trList[q].getText();
  //     tdlist = await helper.elementsByTagName("td", trList[q]);
  //     if (text.includes("Alex auto test new")) {
  //       let myFili1 = await helper.elementByXpath(
  //         `/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-add-rule-modal/div/p-splitter/div/div[1]/div/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[1]/div[2]/table/tbody/tr[${
  //           q + 1
  //         }]`,
  //         driver
  //       );
  //       await helper.clcikByClassName("p-checkbox-box", myFili1);
  //       break;
  //     }
  //   }

  //   console.log(await tdlist[1].getText());

  //   await driver.sleep(900);
  //   await helper.clickByXpath(
  //     "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-add-rule-modal/div/p-splitter/div/div[3]/div/div/div/div/app-chips/div/mat-chip-list/div/input",
  //     driver
  //   );
  //   await driver.sleep(900);
  //   await helper.clickByXpath(
  //     "/html/body/div/div/div/div/mat-option[1]",
  //     driver
  //   );
  //   await driver.sleep(900);
  //   await helper.clickByXpath(
  //     "/html/body/p-dynamicdialog/div/div/div[2]/app-media-box-add-rule-modal/p-footer/div/button",
  //     driver
  //   );
  //   await driver.sleep(900);

  //   await helper.clickByXpath(
  //     "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/div/p-button[8]",
  //     driver
  //   );

  //   await driver.sleep(12000000);

  //   let trList2 = await helper.getTrFromTbodyByXpath(
  //     "/html/body/p-dynamicdialog/div/div/div[2]/app-branch-rules-modal/app-playing-rule-view/div/app-table/div/p-table/div/div/table/tbody",
  //     driver
  //   );

  //   let result = false;

  //   if (trList2.length === 0) {
  //     assert.isTrue(false);
  //   }

  //   for (let q in trList2) {
  //     let text = await trList2[q].getText();
  //     if (text.includes(await tdlist[1].getText())) {
  //       result = true;
  //       break;
  //     }
  //   }
  //   assert.isTrue(result);
  // });

  it("Удалить филию", async function () {
    await helper.clcikByClassName(
      "table_icon _delete ng-star-inserted",
      myFili
    );

    await driver.sleep(900);

    await helper.clickByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/p-confirmdialog/div/div/div[3]/button[2]",
      driver
    );

    await driver.sleep(900);

    let trList = await helper.getTrFromTbodyByXpath(
      "/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-branches-view/div/app-tree-table/div/p-treetable/div/div/div[2]/div[2]/table/tbody",
      driver
    );

    for (let q in trList) {
      let text = await trList[q].getText();
      if (text.includes("")) {
        assert.isTrue(false);
      }
    }

    assert.isTrue(true);
  });
});
