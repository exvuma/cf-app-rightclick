function ext_clicked(){
  url = chrome.extension.getURL("right-click.css");
  chrome.tabs.executeScript(null, {file: "right-click.js"});
  console.log("ext_clicked")
}

chrome.browserAction.onClicked.addListener(ext_clicked);
ext_clicked();
