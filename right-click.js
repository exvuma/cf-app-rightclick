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
       for (var key in options.modifiers){// temporarily set formats var TODO change to when button is enabeld
            if( Right_Click.options.modifiers[key]){
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
                  "cf-bold": true,
                  "cf-highlight": true,
                  "cf-italic": true,
                  "cf-code": true
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
        updateOpts()
      }
    }
  }

 function setFormats(){
 // for (var type in Right_Click.options){
   var buttons = document.getElementsByClassName("btn btn-info")
   var numButt = buttons["length"]
   for (var b =0; b < numButt; b++){
    //  console.log(buttons[b])
     if(!buttons[b])
      continue
     if (buttons[b].getAttribute("active") == "true"){
       formats[buttons[b].firstChild.id] = true
       console.log("this button is in focus" + buttons[b].firstChild.id)
     }
     else
        formats[buttons[b].firstChild.id] = false
      }
   return formats
 }
 function getFormatString(){
   var final = ""
   for (var key in formats){
    //  console.log(buttons[b])
     if (formats[key]){
       if(final)
          final += " " + key
        else
        final = key
     }

   }
  return final
 }

/// Toggles formatClass on and off of the <span> tags involving the selection passed in as sel
function modifySelection(sel, formatClass){
  if (!currSelection){
    if (!SelectEvent) return
    currSelection = SelectEvent.getSelection()
  }
  var anchor = currSelection.anchorNode
  var parEl = anchor.parentElement
  // if <span >INNER TEXT</span> then convert to simple TEXT Node
  if(parEl == currSelection.focusNode.parentElement && parEl.tagName == "SPAN" && parEl.classList == ""){
        removeEl(parEl)
  }

  // Check if the item has already been bolded then make it whole selection unbold
// 3 means this is a Node of type TEXT
  if (currSelection.getRangeAt(0).toString() == "")
    return
// 3 means this is a Node of type TEXT
  if (anchor.nodeType == 3 && parEl.classList.contains(formatClass)){
    parEl.classList.remove(formatClass)
    if(parEl.classList == ""&& parEl.tagName == "SPAN"){
        //remove <span> so we don't generate a ton of those tags
        // parEl.innerHTML = parEl.innerText
        removeEl(parEl)
      }
    return;
  }// if ATTRIBUTE Node Type, remove the entire TAG list for the parentElement ? think this means this is the beginning of an element
  if (anchor.nodeType == 2 && parEl.classList.contains(formatClass)){
    parEl.classList.remove(formatClass)
    currSelection.baseNode.parentElement.innerHTML = currSelection.baseNode.parentElement.innerText
  }//if Element type
  if (anchor.nodeType == 1 && parEl.classList.contains(formatClass)){
    var sis =  anchor
    while(sis && currSelection.containsNode(sis)){
      if(sis.nodeType == 1)
        console.log("~~! Using sis")
        modifySelection(sis,  formatClass)//TODO change params
      sis.classList.remove(formatClass)
      sis =  sis.nextSibling
    }
  }
  //TODO: anchor.getElementsByTagName("strong")
  if (currSelection.getRangeAt(0).toString() == "")
    return

  // If wasn't bolded yet then bold it!
  // if TEXT node then extract the conents into a docFragment object then create a new node to insert at the front of that range
  if (anchor.nodeType == 3 ){

    var range = currSelection.getRangeAt(0)
    var contents = range.extractContents()
    var newNode ;
    if(parEl.tagName != "SPAN" ){
       newNode = document.createElement("SPAN")
       newNode.classList.add(formatClass)
       newNode.appendChild(contents)
       range.insertNode(newNode)
     }
    else if (currSelection.toString() == "" || currSelection.toString() == "\n" ) {
        console.log("whie space"+currSelection.toString())
       return
    }
    else{
      console.log("no whie space"+currSelection.toString())
    }
  }
}

//  currSelection.anchorNode.parentElement.classList.add("cf-selection","bold-class")

  // //If wanted to create a DIV to replace html..
  // var start = currSelection.anchorOffset
  // var end = currSelection.focusOffset
  // var orig = currSelection.baseNode.parentElement.innerHTML
  // var alterText = currSelection.baseNode.parentElement.innerHTML.slice(start,end)
  // var newEl = document.createElement('div')
  // newEl.className = "cf-bold-class"
  // newEl.innerHTML = alterText
  // // currSelection.baseNode.parentElement.appendChild(newEl)
  // if(!  currSelection.baseNode.parentElement)return
  // currSelection.baseNode.parentElement.innerHTML = currSelection.baseNode.parentElement.innerHTML.replace(currSelection.getRangeAt(0).toString(), newEl.outerHTML)
  // currSelection.baseNode.parentElement.innerHTML = currSelection.baseNode.parentElement.innerHTML.replace(currSelection.getRangeAt(0).toString(), `<strong>${currSelection.getRangeAt(0).toString()}</strong>`)
  //  currSelection.baseNode.parentElement.setAttribute("class", "cf-bold-class")

 function menuClicked(){
   currSelection = window.getSelection()
   //this is the button
   if (this.getAttribute("active") == "true")
      this.setAttribute("active", "false")
   else
      this.setAttribute("active", "true")
   formats[this.firstChild.id] = !formats[this.firstChild.id]
   setFormats()
   console.log("menu click")
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
    console.log("double click")
  }
  function clickFunc(e){
  //  setFormats()
    if(window.getSelection().type == "Range"){ //if there's no menu displayed and we selected a range
      isSelect = true
      SelectEvent = e
    }
    else if (window.getSelection().type == "Caret") { // currMenu existed
      isSelect = false
    }

    // Menu is already displayed
    if (currMenu){
      var menuItems = document.getElementsByClassName("btn btn-info");
      //get the item on the menu
      //if user clicked on the menu, get that item
      var pos = currMenu.getPosition(e)
      var modifyPos = document.elementFromPoint(pos.x , pos.y);
      var sel = currSelection
      var formatString =  getFormatString().split(" ")
      console.log(formatString)
      for(var it in formatString){
          //  turnOnFormat(sel, formats)
           modifySelection(sel, formatString[it])
      }

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
  "cf-bold": "format_bold",
  "cf-highlight": "highlight",
  "cf-italic": "format_italic",
  "cf-code": "code"
}
function Menu() {
  //hold DOM element.
  //createElement to actually make the div
  this.el = document.createElement('div')
  // set absolute pos
  this.el.style.position = 'absolute'
  this.el.className = "cf-menu";
  this.el.style.backgroundColor = Right_Click.options.backgroundColor

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
    button.setAttribute("active", "false")
    var icon = document.createElement('i')
    icon.className = "material-icons"
    icon.id = arr[item]
    icon.innerHTML = iconDict[arr[item]]
    button.appendChild(icon)
    button.addEventListener('click', menuClicked)
    buttonBar.appendChild(button)

  }

  this.el.appendChild(buttonBar)


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
///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Below is not yet used //////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//create and set and array that holds the formats we wish to set
function toggleFormat(format){
for (var type in Right_Click.options){
     formats[key] = !formats[key]
  }
}
function removeSpan(doc, pos){
 /// for example turn <span> some html </span> into simply some

 var newNode = document.createTextNode(doc.childNodes[pos].innerText)
 var precedingNode = doc.childNodes[pos++]
 doc.removeChild(contents.childNodes[pos])
 doc.insertBefore(newNode,contents.childNodes[pos])
}
function checkforSpan(node, format){
var newParentNode = document.createElement("SPAN")

var child;
if(node.nodeType == 3)
 return node
else if (node.hasChildNodes()){
 //check that child don't have span or children with span recursively
 var numKids = node.childNodes.length
 for(var i = 0 ; i < numKids; i++){
   child =  node.childNodes[i]
   newParentNode.appendChild(checkforSpan(child))
  }}
 // Remove this format from list

 // Remove Tag and return either one/two TEXT's node and a element or a text node
if(node.tagName == "SPAN" && (node.classList =="" || node.classList ==format)){
 if (!node.hasChildNodes()){
   var newTextNode = document.createTextNode(node.textContent)
   return newTextNode
 }
}
// remove format if it is already there in class List
else if(node.classList.contains(format)){
 node.classList.remove(format)
}

}
function turnOnFormat(sel, format){
var range = sel.getRangeAt(0)
var contents = range.extractContents()
var tempDoc = document.createDocumentFragment()
//if selection Text Node add span

// if hasChildren, check that children don't already have an other empty span classList
var numKids = contents.childNodes.length
for(var i = 0 ; i < numKids; i++){
 var goodNode = checkforSpan(contents.childNodes[i], format)
 tempDoc.appendChild(goodNode)

}
}
function turnOffFormat(sel, format){
var range = sel.getRangeAt(0)
var contents = range.extractContents()
var tempDoc = document.createDocumentFragment()
//if selection Text Node add span
if(node.tagName == "SPAN" && node.classList =="")
 return newTextNode
// if hasChildren, check that children don't already have an other empty span classList
var numKids = contents.childNodes.length
for(var i = 0 ; i < numKids; i++){
 var goodNode = checkforSpan(contents.childNodes[i], format)
 tempDoc.appendChild(goodNode)
}
// if()
}
})()
