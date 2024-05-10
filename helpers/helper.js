const webdriver = require("selenium-webdriver");
By = webdriver.By;

class MyHelper {
  async elementByXpath(str, driver) {
    return await driver.findElement(By.xpath(str));
  }

  async elementByClassName(str, driver) {
    return await driver.findElement(By.className(str));
  }

  async elementByCSS(str, driver) {
    return await driver.findElement(By.css(str));
  }
  async elementByTagName(str, driver) {
    return await driver.findElement(By.tagName(str));
  }

  async elementsByXpath(str, driver) {
    return await driver.findElements(By.xpath(str));
  }

  async elementsByClassName(str, driver) {
    return await driver.findElements(By.className(str));
  }

  async elementsByCSS(str, driver) {
    return await driver.findElements(By.css(str));
  }
  async elementsByTagName(str, driver) {
    return await driver.findElements(By.tagName(str));
  }

  async textByXpath(str, driver) {
    const el = await this.elementByXpath(str, driver);
    return await el.getText();
  }

  async textByClassName(str, driver) {
    const el = await this.elementByClassName(str, driver);
    return await el.getText();
  }

  async textByCSS(str, driver) {
    const el = await this.elementByCSS(str, driver);
    return await el.getText();
  }

  async textByTagName(str, driver) {
    const el = await this.elementByTagName(str, driver);
    return await el.getText();
  }

  async getAttributeByXpath(str, driver, attribute) {
    const el = await this.elementByXpath(str, driver);
    return await el.getAttribute(attribute);
  }

  async getAttributeByClassName(str, driver, attribute) {
    const el = await this.elementByClassName(str, driver);
    return await el.getAttribute(attribute);
  }

  async getAttributeByCSS(str, driver, attribute) {
    const el = await this.elementByCSS(str, driver);
    return await el.getAttribute(attribute);
  }

  async getAttributeByTagName(str, driver, attribute) {
    const el = await this.elementByTagName(str, driver);
    return await el.getAttribute(attribute);
  }

  async clickByXpath(str, driver) {
    const el = await this.elementByXpath(str, driver);
    await el.click();
  }

  async clcikByClassName(str, driver) {
    const el = await this.elementByClassName(str, driver);
    await el.click();
  }

  async clickByCSS(str, driver) {
    const el = await this.elementByCSS(str, driver);
    await el.click();
  }

  async clickByTagName(str, driver) {
    const el = await this.elementByTagName(str, driver);
    await el.click();
  }

  async sendKeysByXpath(str, driver, keys) {
    const el = await this.elementByXpath(str, driver);
    await el.sendKeys(keys);
  }

  async sendKeysByClassName(str, driver, keys) {
    const el = await this.elementByClassName(str, driver);
    await el.sendKeys(keys);
  }

  async sendKeysByCSS(str, driver, keys) {
    const el = await this.elementByCSS(str, driver);
    await el.sendKeys(keys);
  }

  async sendKeysByTagName(str, driver, keys) {
    const el = await this.elementByTagName(str, driver);
    await el.sendKeys(keys);
  }

  async getTrFromTbodyByXpath(tbody, driver) {
    const el = await this.elementByXpath(tbody, driver);
    return await this.elementsByTagName("tr", el);
  }

  async getTrFromTbodyByCss(tbody, driver) {
    const el = await this.elementByCSS(tbody, driver);
    return await this.elementsByTagName("tr", el);
  }

  async getTrFromTbodyByClassName(tbody, driver) {
    const el = await this.elementByClassName(tbody, driver);
    return await this.elementsByTagName("tr", el);
  }

  async getTrFromTbodyByTagName(tbody, driver) {
    const el = await this.elementByTagName(tbody, driver);
    return await this.elementsByTagName("tr", el);
  }

  async clickOnElementByTextInList(text, list, position) {
    try {
      for (let q in list) {
        let tdList = await this.elementsByTagName("td", list[q]);
        let name;
        if (position !== undefined) {
          name = await tdList[position].getText();
        } else {
          name = await this.getTextFromList(tdList);
        }
        if (name.includes(text)) {
          await tdList[0].click();
          break;
        }
      }
    } catch (err) {}
  }

  async getTextFromList(list) {
    let result = "";
    for (let q in list) {
      let text = await list[q].getText();
      result += text;
    }
    return result;
  }

  async scrollTo(el, driver) {
    let iframe = await this.elementByXpath(el, driver);

    driver.executeScript("arguments[0].scrollIntoView(true);", iframe);
  }
}

module.exports = MyHelper;
