(function () {
  'use strict'

  // var options = INSTALL_OPTIONS
// Executes continuously?
  var options = { window: window }
  var Right_Click = {"options": {}}
  if (typeof window.INSTALL_OPTIONS === 'object') {
       for (var key in INSTALL_OPTIONS) {
         options[key] = INSTALL_OPTIONS[key]
         Right_Click.options[key] = options[key]
       }
     }
  else{ // Just for when we are development mode from browser to simulate
      var options = {
                    "title": "App title",
                    "text": "This app will allow you to right click and..",
                    "enabled": true,
                    "links": {
                      "Link1": {
                        "enabled": true,
                        "linkaddr": "https://google.com",
                        "displaytxt": "Dev "
                      }
                    },
                    "size": "small"
                  }
    //  for( var i=0 ; i < 10; i++)
    for (var key in options)
        // options[i] = "victoria!"
        Right_Click.options[key] = options[key]
    }
  function gotoLink(link){
    // Goes to link in Menu

  }
  function updateElement () {}
  // call set by install.json "execute": "INSTALL_SCOPE.setOptions(INSTALL_OPTIONS)"
  // apps team provides INSTALL_OPTIONS and the excution of this function granted line aboeve is in install.json
  window.INSTALL_SCOPE = {
    setOptions: function(opts) {
      for (var key in opts) {
        console.log("Key: " + key + "option " + options)
        Right_Click.options[key] = opts[key]
      }
    }
  }

  function homie(){
    if (document.activeElement) {
        if(typeof textarea.selectionStart == 'number' && typeof textarea.selectionEnd == 'number') {
            // All browsers except IE
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;

            var selectedText = textarea.value.slice(start, end);
            var before = textarea.value.slice(0, start);
            var after = textarea.value.slice(end);
            console.log("Why hello" +selectedText +  "selected")
            var text = before + '- ' + selectedText + after;
            textarea.value = text;
       }
   }
  }
  //

  // window.INSTALL_SCOPE = {
  //   setOptions: function (nextOptions) {
  //     options = nextOptions
  //
  //     updateElement()
  //   }
  // }

  var currMenu ;
  document.addEventListener('select', function() {
    console.log('Selection changed!');
  }, false);
  function updateMenu(e){ //function e sam a e =>
  // Prevents right vlick from default from opening
    e.preventDefault();

    if (currMenu){
      //close menu
      currMenu.close();
    }
    var menu = new Menu();
    currMenu = menu;
    // Display menu
    var pos =   menu.getPosition(e);
    menu.displayAt(pos.x,pos.y)

  // Custom code here
  }
  // any click make menu disappear
  document.addEventListener('click', function(e) {
    // create new Menu class..
    if (currMenu){
      //close menu
      currMenu.close();
      currMenu = undefined
    }
  })
  document.addEventListener('contextmenu', function(e) { //function e sam a e =>
  // Prevents right vlick from default from opening
    e.preventDefault();

    if (currMenu){
      //close menu
      currMenu.close();
    }
    updateElement()
    var menu = new Menu();
    currMenu = menu;
    // Display menu
    var pos =   menu.getPosition(e);
    menu.displayAt(pos.x,pos.y)

  // Custom code here
  })
  // any click make menu disappear
  document.addEventListener('click', function(e) {
    // create new Menu class..
    if (currMenu){
      //close menu
      currMenu.close();
      currMenu = undefined
    }
  })



function Menu(options) {
  //hold DOM element.
  //createElement to actually make the div
  this.el = document.createElement('div')
  // set absolute pos
  this.el.style.position = 'absolute'
  this.el.className = "cf-menu";
  var link1 =  Right_Click.options.links.Link1.linkaddr
  var title1 = Right_Click.options.links.Link1.displaytxt //options.links.Link1.linkaddr
  //set HTML of what's going to show up
  this.el.innerHTML = `<ul>
    <li><a href="` + link1 + `"> `+title1+`</a></li>
    <li><a href="`+link1+`">Google</a></li>
    <li><a href="#">Link 3</a></li>
  </ul>`

}
Menu.prototype.displayAt = function(x, y) {
  // set style postiton
  this.el.style.left = x + 'px'
  this.el.style.top = y + 'px'

  //use appendChild to get DOM to actually show
  document.body.appendChild(this.el)

}
Menu.prototype.close = function() {
  //removeChild
   document.body.removeChild(this.el)

}
Menu.prototype.getPosition = function(e){
 var posx = 0;
 var posy = 0;

 if (!e) var e = window.event;

 if (e.pageX || e.pageY) {
   posx = e.pageX;
   posy = e.pageY;
 } else if (e.clientX || e.clientY) {
   posx = e.clientX + document.body.scrollLeft +
                      document.documentElement.scrollLeft;
   posy = e.clientY + document.body.scrollTop +
                      document.documentElement.scrollTop;
 }

 return {
   x: posx,
   y: posy
 }
}
})()
