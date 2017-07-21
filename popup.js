
  var greeting = "hello,";
  var button = document.getElementById("mybutton");
  button.person_name = "Bob";
  var check = document.getElementById("checkbos");
  // get the settings from storage
  var options = { window: window }
  chrome.storage.sync.get(null, function(storage) { // gets all of the keys in storage
    for (var key in storage) {
      options[key] = storage[key]
      console.log(options[key])
    }
  })
  // listen for a change to set in storage
  check.addEventListener("click", function() {
      newValue = check.checked
      chrome.storage.sync.set({'value': theValue}, function() {
          // Notify that we saved.
          message('Settings saved');
        });
  }, false);
  console.log("dfsdf")
