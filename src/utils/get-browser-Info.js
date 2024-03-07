const getBrowserInfo = (isCheckBrowser) => {
  if (!isCheckBrowser) return { isValidBrowser: true, isWindowsWechat: false };

  let isValidBrowser = false;
  let isWindowsWechat = false;
  if (window.chrome) {
    const appVersion = window.navigator.appVersion;
    const appVersionList = appVersion.split(' ');
    const index = appVersionList.findIndex((version) => {
      return version.indexOf('Chrome') >= 0;
    });
    let chromeVersion = appVersionList[index];
    chromeVersion = chromeVersion.slice(chromeVersion.indexOf('/') + 1);
    chromeVersion = parseInt(chromeVersion);
    isValidBrowser = chromeVersion >= 76;
    // Windows Wechat inner core is chrome 53, not support ECMA6, so use readonly mode
    if (chromeVersion === 53 && navigator.appVersion && navigator.appVersion.includes('WindowsWechat')) {
      isValidBrowser = false;
      isWindowsWechat = true;
    }
  }

  return { isValidBrowser, isWindowsWechat };
};

export default getBrowserInfo;
