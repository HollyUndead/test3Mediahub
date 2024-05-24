{
    title: 'Библиотека',
    ctx: <ref *2> Context {
      _runnable: Test {
        type: 'test',
        title: 'Проверка кнопки сброса фильтров вне окна фильтров',
        fn: [AsyncFunction (anonymous)],
        body: 'async function () {\n' +
          '    console.log(this.test.parent);\n' +
          '    //   await helper.clickByXpath("/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[12]", driver);\n' +
          '  }',
        async: 0,
        sync: true,
        _timeout: 900000,
        _slow: 200,
        _retries: -1,
        timedOut: false,
        _currentRetry: 0,
        pending: false,
        file: '/home/user/proj/test3Mediahub/scripts/library.js',
        parent: [Circular *1],
        ctx: [Circular *2],
        _events: [Object: null prototype],
        _eventsCount: 1,
        callback: [Function: done]
      },
      test: Test {
        type: 'test',
        title: 'Проверка кнопки сброса фильтров вне окна фильтров',
        fn: [AsyncFunction (anonymous)],
        body: 'async function () {\n' +
          '    console.log(this.test.parent);\n' +
          '    //   await helper.clickByXpath("/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[12]", driver);\n' +
          '  }',
        async: 0,
        sync: true,
        _timeout: 900000,
        _slow: 200,
        _retries: -1,
        timedOut: false,
        _currentRetry: 0,
        pending: false,
        file: '/home/user/proj/test3Mediahub/scripts/library.js',
        parent: [Circular *1],
        ctx: [Circular *2],
        _events: [Object: null prototype],
        _eventsCount: 1,
        callback: [Function: done]
      }
    },
    suites: [],
    tests: [
      Test {
        type: 'test',
        title: 'Открыть MediaHub',
        fn: [AsyncFunction (anonymous)],
        body: 'async function () {\n' +
          '    driver.get(baseUrl);\n' +
          '    await driver.manage().setTimeouts({ implicit: 500 });\n' +
          '    // await driver.manage().window().setSize({ x: 1920, y: 0 });\n' +
          '    await driver.manage().window().maximize();\n' +
          '    await driver.wait(\n' +
          '      webdriver.until.elementLocated(\n' +
          '        webdriver.By.xpath("/html/body/app-root/app-login/section/div[1]")\n' +
          '      ),\n' +
          '      5000\n' +
          '    );\n' +
          '    await helper.sendKeysByXpath(\n' +
          '      "/html/body/app-root/app-login/section/div[1]/div/div/div[1]/div/input",\n' +
          '      driver,\n' +
          '      "admin"\n' +
          '    );\n' +
          '\n' +
          '    await helper.sendKeysByXpath(\n' +
          '      "/html/body/app-root/app-login/section/div[1]/div/div/div[2]/div/input",\n' +
          '      driver,\n' +
          '      "flvbyrf2020"\n' +
          '    );\n' +
          '    await helper.clickByXpath(\n' +
          '      "/html/body/app-root/app-login/section/div[1]/div/div/div[4]/button",\n' +
          '      driver\n' +
          '    );\n' +
          '\n' +
          '    await driver.wait(\n' +
          '      webdriver.until.elementLocated(\n' +
          '        webdriver.By.xpath("/html/body/app-root/app-app-view/div/div[2]/div[1]")\n' +
          '      ),\n' +
          '      5000\n' +
          '    );\n' +
          '    let title = await driver.getTitle();\n' +
          '\n' +
          '    await driver.sleep(900);\n' +
          '    assert.equal(title, "Mediafront", "Не открыло страницу");\n' +
          '  }',
        async: 0,
        sync: true,
        _timeout: 900000,
        _slow: 200,
        _retries: -1,
        timedOut: false,
        _currentRetry: 0,
        pending: false,
        file: '/home/user/proj/test3Mediahub/scripts/library.js',
        parent: [Circular *1],
        ctx: [Context],
        _events: [Object: null prototype],
        _eventsCount: 1,
        callback: [Function: done],
        timer: Timeout {
          _idleTimeout: -1,
          _idlePrev: null,
          _idleNext: null,
          _idleStart: 1125,
          _onTimeout: null,
          _timerArgs: undefined,
          _repeat: null,
          _destroyed: true,
          [Symbol(refed)]: true,
          [Symbol(kHasPrimitive)]: false,
          [Symbol(asyncId)]: 65,
          [Symbol(triggerId)]: 64
        },
        duration: 2583,
        state: 'passed',
        speed: 'slow'
      },
      Test {
        type: 'test',
        title: 'Проверка кнопки сброса фильтров вне окна фильтров',
        fn: [AsyncFunction (anonymous)],
        body: 'async function () {\n' +
          '    console.log(this.test.parent);\n' +
          '    //   await helper.clickByXpath("/html/body/app-root/app-app-view/div/div[2]/div[2]/div/app-library/div/div/p-button[12]", driver);\n' +
          '  }',
        async: 0,
        sync: true,
        _timeout: 900000,
        _slow: 200,
        _retries: -1,
        timedOut: false,
        _currentRetry: 0,
        pending: false,
        file: '/home/user/proj/test3Mediahub/scripts/library.js',
        parent: [Circular *1],
        ctx: [Context],
        _events: [Object: null prototype],
        _eventsCount: 1,
        callback: [Function: done]
      }
    ],
    root: false,
    pending: false,
    _retries: -1,
    _beforeEach: [],
    _beforeAll: [
      Hook {
        title: '"before all" hook in "Библиотека"',
        fn: [AsyncFunction (anonymous)],
        body: 'async function () {\n' +
          '    let options = new Options();\n' +
          '    // options.addArguments("--headless=new");\n' +
          '    driver = await new webdriver.Builder()\n' +
          '      .forBrowser("chrome")\n' +
          '      .setChromeOptions(options)\n' +
          '      .build();\n' +
          '  }',
        async: 0,
        sync: true,
        _timeout: 900000,
        _slow: 200,
        _retries: -1,
        timedOut: false,
        _currentRetry: 0,
        pending: false,
        type: 'hook',
        parent: [Circular *1],
        ctx: [Context],
        file: '/home/user/proj/test3Mediahub/scripts/library.js',
        originalTitle: '"before all" hook',
        allowUncaught: undefined,
        _events: [Object: null prototype],
        _eventsCount: 1,
        callback: [Function: done],
        timer: Timeout {
          _idleTimeout: -1,
          _idlePrev: null,
          _idleNext: null,
          _idleStart: 452,
          _onTimeout: null,
          _timerArgs: undefined,
          _repeat: null,
          _destroyed: true,
          [Symbol(refed)]: true,
          [Symbol(kHasPrimitive)]: false,
          [Symbol(asyncId)]: 25,
          [Symbol(triggerId)]: 21
        },
        duration: 740,
        _error: null
      }
    ],
    _afterEach: [
      Hook {
        title: '"after each" hook in "Библиотека"',
        fn: [AsyncFunction (anonymous)],
        body: 'async function () {\n' +
          '    if (this.currentTest.state === "failed") {\n' +
          '      const screenshot = await driver.takeScreenshot();\n' +
          '      console.error(this.currentTest.err);\n' +
          '\n' +
          '      const fileName = `./screen/${Date.now()} failure-screenshot-${\n' +
          '        this.currentTest.title\n' +
          '      }.png`;\n' +
          '      fs.writeFileSync(fileName, screenshot, "base64");\n' +
          '      console.log(`Screenshot saved as: ${fileName}`);\n' +
          '    }\n' +
          '  }',
        async: 0,
        sync: true,
        _timeout: 900000,
        _slow: 200,
        _retries: -1,
        timedOut: false,
        _currentRetry: 0,
        pending: false,
        type: 'hook',
        parent: [Circular *1],
        ctx: [Context],
        file: '/home/user/proj/test3Mediahub/scripts/library.js',
        originalTitle: '"after each" hook',
        allowUncaught: undefined,
        _events: [Object: null prototype],
        _eventsCount: 1,
        callback: [Function: done],
        timer: Timeout {
          _idleTimeout: -1,
          _idlePrev: null,
          _idleNext: null,
          _idleStart: 3709,
          _onTimeout: null,
          _timerArgs: undefined,
          _repeat: null,
          _destroyed: true,
          [Symbol(refed)]: true,
          [Symbol(kHasPrimitive)]: false,
          [Symbol(asyncId)]: 241,
          [Symbol(triggerId)]: 239
        },
        duration: 0,
        _error: null
      }
    ],
    _afterAll: [
      Hook {
        title: '"after all" hook',
        fn: [AsyncFunction (anonymous)],
        body: 'async function () {\n    logStream.end();\n    driver.quit();\n  }',
        async: 0,
        sync: true,
        _timeout: 900000,
        _slow: 200,
        _retries: -1,
        timedOut: false,
        _currentRetry: 0,
        pending: false,
        type: 'hook',
        parent: [Circular *1],
        ctx: [Context],
        file: '/home/user/proj/test3Mediahub/scripts/library.js'
      }
    ],
    _timeout: 900000,
    _slow: 200,
    _bail: false,
    _onlyTests: [],
    _onlySuites: [],
    delayed: false,
    parent: Suite {
      title: '',
      ctx: Context {},
      suites: [ [Circular *1] ],
      tests: [],
      root: true,
      pending: false,
      _retries: -1,
      _beforeEach: [],
      _beforeAll: [],
      _afterEach: [],
      _afterAll: [],
      _timeout: 2000,
      _slow: 75,
      _bail: false,
      _onlyTests: [],
      _onlySuites: [],
      delayed: false,
      _events: [Object: null prototype] { 'pre-require': [Array] },
      _eventsCount: 1
    },
    file: '/home/user/proj/test3Mediahub/scripts/library.js'
  }