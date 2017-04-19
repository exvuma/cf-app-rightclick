(function () {
  'use strict'

  // var options = INSTALL_OPTIONS

  function updateElement() { /* ... */ }
  function gotoLink(link){
    // Goes to link in Menu

  }
  var options = { window: window }
  if (typeof window.INSTALL_OPTIONS === 'object') {
       for (var key in INSTALL_OPTIONS) {
         options[key] = INSTALL_OPTIONS[key]
       }
     }
  window.INSTALL_SCOPE = {
    setOptions: function (nextOptions) {
      options = nextOptions

      updateElement()
    }
  }

  var currMenu ;
  document.addEventListener('contextmenu', function(e) { //function e sam a e =>
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
}())


function Menu(options) {
  //hold DOM element.
  //createElement to actually make the div
  this.el = document.createElement('div')
  // set absolute pos
  this.el.style.position = 'absolute'
  //set HTML of what's going to show up

  this.el.innerHTML = 'helllo menu'

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
