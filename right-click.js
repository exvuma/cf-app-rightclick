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
                    "bold": true,
                    "text": "Select the links you'd like to be able to appear in the menu",
                    "enabled": true,
                    "links": {
                      "Link1": {
                        "enabled": false,
                        "linkaddr": "",
                        "displaytxt": ""
                      },
                      "Link2": {
                        "enabled": false,
                        "linkaddr": "",
                        "displaytxt": ""
                      },
                      "Link3": {
                        "enabled": false,
                        "linkaddr": "",
                        "displaytxt": ""
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

  function boldSelection(){
    var currSelection = window.getSelection()
    currSelection.baseNode.parentElement.innerHTML = currSelection.baseNode.parentElement.innerHTML.replace(currSelection.getRangeAt(0).toString(), `<strong>${currSelection.getRangeAt(0).toString()}</strong>`)

  }


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
      //if user clicked on the menu, get that item
      var pos = currMenu.getPosition(e)
      //close menu
      currMenu.close();
      currMenu = undefined
    }
    boldSelection();
  })
  document.addEventListener('contextmenu', function(e) { //function e sam a e =>
  // Prevents right vlick from default from opening
    e.preventDefault();
    //close menu if no text is selected
    if (currMenu){ //TODO check text selected

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


function Menu(options) {
  //hold DOM element.
  //createElement to actually make the div
  this.el = document.createElement('div')
  // set absolute pos
  this.el.style.position = 'absolute'
  this.el.className = "cf-menu";
  //Push all enabled options into arr
  var arr = []
  for(key in Right_Click.options)
  {
    if(Right_Click.options[key]){
      arr.push(key)
    }
    console.log(Right_Click.options[key])
  }
  //For each item in the arr display approriate item in menu
  var menuHTMLString = "<ul>"
  for(var item in arr){
    menuHTMLString += `<li>` + arr[item] + `</li>`
  }
  menuHTMLString += `</ul>`
  this.el.innerHTML = menuHTMLString
  // var link1 =  Right_Click.options.links.Link1.linkaddr
  // var link2 =  Right_Click.options.links.Link2.linkaddr
  // var link3 =  Right_Click.options.links.Link3.linkaddr
  // var title1 =  Right_Click.options.links.Link1.displaytxt
  // var title2  =  Right_Click.options.links.Link2.displaytxt
  // var title3 =  Right_Click.options.links.Link3.displaytxt //options.links.Link1.linkaddr
  // //set HTML of the display Menut to
  // this.el.innerHTML = `<ul>
  //   <li><a href="` + link1 + `"> `+title1+`</a></li>
  //   <li><a href="`+link2+`">`+ title2 + `</a></li>
  //   <li><a href="`+link3+`">`+title3 + `</a></li>
  // </ul>`


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
