(function () {
  'use strict'

  // var options = INSTALL_OPTIONS
// Executes continuously?
  var options = { window: window }
  var Right_Click = {"options": {}}
  var SelectEvent ={}
  if (typeof window.INSTALL_OPTIONS === 'object') {
       for (var key in INSTALL_OPTIONS) {
         options[key] = INSTALL_OPTIONS[key]
         Right_Click.options[key] = options[key]
       }
     }
  else{ // Just for when we are development mode from browser to simulate
      var options = {
                "modifiers": {
                  "bold": true,
                  "highlight": false,
                  "format_italic": false,
                  "code": true
                }
              }
    //  for( var i=0 ; i < 10; i++)
    for (var key in options)
        // options[i] = "victoria!"
        Right_Click.options[key] = options[key]
    }
  function toolbar() {
    // this.el = div
    //TODO https://www.w3schools.com/icons/tryit.asp?filename=tryicons_google-format_bold
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
  //      console.log("Key: " + key + "option " + options)
        Right_Click.options[key] = opts[key]
      }
    }
  }

 function modifySelection(modifyEl, e){
   var modifyType = modifyEl.innerHTML
   switch(modifyType){
       case("title"):
         console.log("title was selected from the menu")
         break;
      case("bold"):
        console.log("bold was selected from the menu")
        boldSelection()
        break;
      case("text"):
        console.log("text was selected from the menu")
        break;
      }
 }
  function boldSelection(){
    var currSelection = window.getSelection()
    currSelection.baseNode.parentElement.innerHTML = currSelection.baseNode.parentElement.innerHTML.replace(currSelection.getRangeAt(0).toString(), `<strong>${currSelection.getRangeAt(0).toString()}</strong>`)

  }


  var currMenu ;
  var isSelect = false;

  //////////////////////////////////////////
  ///////////    Event Listeners     //////
  //////////////////////////////////////////
  document.addEventListener('click', clickFunc)
  // document.getElementById("cf-menu").onclick = function(){}
  // any click make menu disappear
  function clickFunc(e) {
    if(window.getSelection().type == "Range" && !currMenu){ //if there's no menu displayed and we selected a range
      isSelect = true
      SelectEvent = e
    }
    else if (currMenu) { // currMenu existed
      isSelect = false
    }

    // create new Menu class..
    if (currMenu){ //get the item on the menu
      //if user clicked on the menu, get that item
      var pos = currMenu.getPosition(e)
      var modifyEl = document.elementFromPoint(pos.x , pos.y);
      modifySelection(modifyEl, e)
      //close menu
      currMenu.close();
      currMenu = undefined
    }
  //  boldSelection();
  }
  document.addEventListener('contextmenu', function(e) { //function e sam a e =>
  // Prevents right vlick from default from opening
    if(window.getSelection().type == "Range"){
      isSelect = true
      console.log("WARN! a selection was made with a right click?")
    }
    if (isSelect)
      e.preventDefault();
    //close menu if no text is selected
    if (currMenu){
      currMenu.close();
      currMenu = undefined;
      return;
    }
    var menu = new Menu();
    currMenu = menu;
    // Display menu
    var pos =   menu.getPosition(e);
    var currSelection = window.getSelection()
    if(currSelection.type != "Caret"){
      var currSelection = window.getSelection()
      var typeSel = currSelection.type
      console.log("type text is : " + typeSel)
      var selText = currSelection.baseNode.parentElement.innerHTML
      console.log("selected text is : " + selText)
      menu.displayAt(pos.x,pos.y)
    }
    else{
      currMenu = undefined;
    }
  })

var iconDict = {
  "bold": "format_bold",
  "highlight": "highlight",
  "format_italic": "format_italic",
  "code": "code"
}
function Menu() {
  //hold DOM element.
  //createElement to actually make the div
  this.el = document.createElement('div')
  // set absolute pos
  this.el.style.position = 'absolute'
  this.el.className = "cf-menu";
  //Push all enabled options into arr
  var arr = []
  var keys = Right_Click.options.modifiers
  for(key in keys)
  {
    if(Right_Click.options.modifiers[key]){
      arr.push(key)
    }
  //  console.log(Right_Click.options[key])
  }
  //For each item in the arr display approriate item in menu
  var menuHTMLString = "<ul>"
  for(var item in arr){
    menuHTMLString += `<a href="#"><i class="material-icons">` + iconDict[arr[item]] + `</i>`
  }
  menuHTMLString += `</ul>`
  this.el.innerHTML = menuHTMLString



} //if we didn't include the prototype we would have to include this function in the constructor e.g.  function Menu()
Menu.prototype.displayAt = function(x, y) {
  // set style postiton
  this.el.style.left = x + 'px'
  this.el.style.top = y + 'px'

  //use appendChild to get DOM to actually show
  document.body.appendChild(this.el)

}
Menu.prototype.close = function() {
  //removeChild
  if(this.el)
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
