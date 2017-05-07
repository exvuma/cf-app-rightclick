(function () {
  'use strict'
  // If Browser won't be compatible
  if (!window.addEventListener)
        return
  var options = { window: window }
  var Right_Click = {"options": {}}
  var SelectEvent ={}
  var currSelection
  var formats={} //dict of formats that are enabled
  function updateOpts(){
      Right_Click.options = options
       for (var key in options){// temporarily set formats var TODO change to when button is enabeld
            if( Right_Click.options[key]){
            formats[key] = true
          }
          else {
            formats[key] = false
          }
        }
  }
  if (typeof window.INSTALL_OPTIONS === 'object') {
       for (var key in INSTALL_OPTIONS) {
         options[key] = INSTALL_OPTIONS[key]
         Right_Click.options[key] = options[key]
       }
     }
    else{ // Just for when we are development mode from browser to simulate
      var options = {
                "backgroundColor": "#FFFFFF",
                "modifiers": {
                  "bold": true,
                  "highlight": true,
                  "format_italic": true,
                  "code": true
                }
              }
    for (var key in options)
        Right_Click.options[key] = options[key]
    }


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

 function setFormats(){
 // for (var type in Right_Click.options){
   var buttons = document.getElementsByClassName("btn btn-info")
   for (var b in buttons){
     console.log(buttons[b])
     if (buttons[b].state == focus){
       console.log(buttons[b].id)
     }
 }

 }
   //create and set and array that holds the formats we wish to set
 function toggleFormat(format){
   for (var type in Right_Click.options){
     if(!formats[key]){
        formats[key] = true
      }
     }
   }

function modifySelection(modifyPos, e){
  if (!currSelection){
    if (!SelectEvent) return
    currSelection = SelectEvent.getSelection()
  }
  // Check if the item has already been bolded then make it whole selection unbold
// 3 means this is a Node of type TEXT
  if (currSelection.anchorNode.nodeType == 3 && currSelection.anchorNode.parentElement.tagName== "STRONG"){
    //remove the tag by just using the innerHTML
    currSelection.anchorNode.parentElement.outerHTML = currSelection.anchorNode.parentElement.innerHTML
    return;
  }// if ATTRIBUTE Node Type
  if (currSelection.anchorNode.nodeType == 2 && currSelection.anchorNode.parentElement.tagName== "STRONG"){
    //remove the tag by just using the innerHTML
    currSelection.anchorNode.parentElement.outerHTML = currSelection.anchorNode.parentElement.innerHTML
    return;
  }//if Element type
  if (currSelection.anchorNode.nodeType == 1 && currSelection.anchorNode.parentElement.tagName== "STRONG"){}
  //TODO: currSelection.anchorNode.getElementsByTagName("strong")
  if (currSelection.getRangeAt(0).toString() == "")
    return
  currSelection.baseNode.parentElement.innerHTML = currSelection.baseNode.parentElement.innerHTML.replace(currSelection.getRangeAt(0).toString(), `<strong>${currSelection.getRangeAt(0).toString()}</strong>`)


  // //If wanted to create a DIV to replace html..
  // var start = currSelection.anchorOffset
  // var end = currSelection.focusOffset
  // var orig = currSelection.baseNode.parentElement.innerHTML
  // var alterText = currSelection.baseNode.parentElement.innerHTML.slice(start,end)
  // var newEl = document.createElement('div')
  // newEl.className = "bold-class"
  // newEl.innerHTML = alterText
  // // currSelection.baseNode.parentElement.appendChild(newEl)
  // if(!  currSelection.baseNode.parentElement)return
  // currSelection.baseNode.parentElement.innerHTML = currSelection.baseNode.parentElement.innerHTML.replace(currSelection.getRangeAt(0).toString(), newEl.outerHTML)
  // currSelection.baseNode.parentElement.innerHTML = currSelection.baseNode.parentElement.innerHTML.replace(currSelection.getRangeAt(0).toString(), `<strong>${currSelection.getRangeAt(0).toString()}</strong>`)
  //  currSelection.baseNode.parentElement.setAttribute("class", "bold-class")
}
 function menuClicked(){
   currSelection = window.getSelection()
 }

  var currMenu ;
  var isSelect = false;

  //////////////////////////////////////////
  ///////////    Event Listeners     //////
  //////////////////////////////////////////
  document.addEventListener('click', clickFunc)
  document.addEventListener('dbclick', dbClick)
  //////////////////////////////////////////
  ///////////   Helper Functions   //////
  //////////////////////////////////////////
  function closeMenu(){
    currMenu.close();
    currMenu = undefined
  }
  function dbClick(){
    currMenu.close();
    currMenu = undefined
  }
  function clickFunc(e) {
    setFormats()
    if(window.getSelection().type == "Range"){ //if there's no menu displayed and we selected a range
      isSelect = true
      SelectEvent = e
    }
    else if (window.getSelection().type == "Caret") { // currMenu existed
      isSelect = false
    }

    // Menu is already displayed
    if ( currMenu){
      var menuItems = document.getElementsByClassName("btn btn-info");
      //get the item on the menu
      //if user clicked on the menu, get that item
      var pos = currMenu.getPosition(e)
      var modifyPos = document.elementFromPoint(pos.x , pos.y);
      modifySelection(modifyPos, e)

    }
  }
  // This code ensures that the app doesn't run before the page is loaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateOpts)
  } else {
    updateOpts()
  }
  document.addEventListener('contextmenu', function(e) { //function e sam a e =>
  // Prevents right click from default from opening
    e.preventDefault();
    //close menu if no text is selected
    if (currMenu){
      closeMenu()
      return;
    }
    var menu = new Menu();
    currMenu = menu;
    // Display menu
    var pos =   menu.getPosition(e);
    currSelection = window.getSelection()
    menu.displayAt(pos.x,pos.y)
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
  this.el.style.backgroundColor = Right_Click.options.backgroundColor
  console.log("bacl" + Right_Click.options.backgroundColor)

  //Push all enabled options into arr
  var arr = []
  var keys = Right_Click.options.modifiers
  for(key in keys)
  {
    if(Right_Click.options.modifiers[key]){
      arr.push(key)
    }
  }

  var menuHTMLString = `<div class="btn-group">`
  var buttonFrag = document.createDocumentFragment();//creates imaginary Node
  var buttonBar = document.createElement('div')/// ?? I don't have to worry about cleaning up from memory right?
  buttonBar.className = 'btn-group'
  buttonBar.style.backgroundColor = Right_Click.options.backgroundColor
  // buttonFrag.appendChild(buttonBar)

  for(var item in arr){
    // buttonBar.chi
    var button = document.createElement('button')
    button.className = "btn btn-info"
    button.type = "button"
    var icon = document.createElement('i')
    icon.className = "material-icons"
    icon.id = arr[item]
    icon.innerHTML = iconDict[arr[item]]
    button.appendChild(icon)
    button.addEventListener('click', menuClicked)
    buttonBar.appendChild(button)


    // menuHTMLString += `<button  onclick="` + boldSelection() + `" type="button" class="btn btn-info" ><i class="material-icons" id = "`+ arr[item] +`">` + iconDict[arr[item]] + `</button>`
    menuHTMLString += `<button  type="button" class="btn btn-info" ><i class="material-icons" id = "`+ arr[item] +`">` + iconDict[arr[item]] + `</button>`

  }

  this.el.appendChild(buttonBar)
  menuHTMLString += `</div>`
  // this.el.innerHTML = menuHTMLString

} //if we didn't include the prototype we would have to include this function in the constructor e.g.  function Menu()
Menu.prototype.displayAt = function(x, y) {
  // set style postiton
  this.el.style.left = x + 'px'
  this.el.style.top = y + 'px'

  //use appendChild to get DOM to actually show
  document.body.appendChild(this.el)
  var arr = document.getElementsByClassName("btn btn-info")
  //var arr = document.getElementsByClassName("btn btn-info").addEventListener('click', setFormats)

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
