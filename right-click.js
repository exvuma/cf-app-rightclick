(function () {
  'use strict'
  // If Browser won't be compatible
  if (!window.addEventListener) { return }
  var newUrl = "https://victoriabernard.com"
  // once extensions is clicked will open up this link in the current tab
  // chrome.tabs.query({'active': true}, function(tabs) {
  //   chrome.tabs.update(tabs[0].id, {url: newUrl});
  // });
// var tri = window.Trianglify({
//   width: 1000,
//   height: 1000,
//   // cell_size: reg.size,
//   // x_colors: reg.colors,
//   // variance: reg.variance / 100
// })




// svg2.style.background = "url('data:image/svg+xml;utf8," + svg.outerHTML + "') no-repeat"
// svg2.style.backgroundSize = 'cover'


  function menuClicked (e) {
    currSelection = window.getSelection()
   // this is the button
   // Toggle the menu button that was clicked
    if (this.getAttribute('active') === 'true') { this.setAttribute('active', 'false') } else { this.setAttribute('active', 'true') }
     // if something was selection was this button was toggled, toggle that selection's balue for this type
    var type = this.firstChild.id
    document.body.setAttribute('contenteditable', true)
    document.execCommand(type, false, '') // toggle the type of whatever is selected
    document.body.setAttribute('contenteditable', false)
  }

  var currMenu = undefined

  function closeMenu () {
    currMenu.close()
    currMenu = undefined
  }


// from install.json varibles/type varible from execCommand(type) TO the dictionary for the buttons specified in bootstrap
// key avalible https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
// values avalible https://www.w3schools.com/icons/icons_reference.asp

// import "https://fonts.googleapis.com/icon?family=Material+Icons";
  function Menu () {
    var iconDict = {
      'bold': 'format_bold',
      'backColor': 'highlight',
      'italic': 'format_italic',
      'fontName': 'code',
      'strikeThrough': 'format_strikethrough',
      'underline': 'format_underlined',
      'justifyCenter': 'format_align_center',
      'justifyFull': 'format_align_justify',
      'justifyLeft': 'format_align_left',
      'justifyRight': 'format_align_right'

    }
    var iconDict = {
      'bold': '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> \
          <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>\
          <path d="M0 0h24v24H0z" fill="none"/>  </svg>',
      'backColor': 'highlight',
      'italic': '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> \
          <path d="M0 0h24v24H0z" fill="none"/> \
          <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/> \
          </svg>',
      'fontName': 'code',
      'strikeThrough': 'format_strikethrough',
      'underline': 'format_underlined',
      'justifyCenter': 'format_align_center',
      'justifyFull': 'format_align_justify',
      'justifyLeft': 'format_align_left',
      'justifyRight': 'format_align_right'

    }
  // hold DOM element.
  // createElement to actually make the div
    this.el = document.createElement('div')
  // set absolute pos
    this.el.style.position = 'absolute'
    this.el.className = 'cf-menu'
    this.el.style.backgroundColor = Right_Click.options.backgroundColor
    // When initially created set lastpos to middle
    this.lastposx = window.innerWidth / 2
    this.lastposy = window.innerHeight / 2
  // Push all enabled options into arr
    var arr = [] //arr holds buttons to be displayed
    var keys = Right_Click.options.modifiers
    for (key in keys) {
      if (Right_Click.options.modifiers[key]) {
        if (key === 'justify') {
          arr.push('justifyLeft', 'justifyFull', 'justifyRight', 'justifyCenter')
        } else if (key.substring(0, 7) === 'justify') {
          continue
        } else { arr.push(key) }
      }
    }

    var buttonBar = document.createElement('div')/// ?? I don't have to worry about cleaning up from memory right?
    buttonBar.className = 'btn-group'
    buttonBar.style.backgroundColor = Right_Click.options.backgroundColor

    for (var item in arr) {
      var button = document.createElement('button')
      button.className = 'btn btn-info'
      button.type = 'button'
      button.setAttribute('active', 'false')
      var icon = document.createElement('i')
      icon.className = 'material-icons'
      icon.id = arr[item]
      icon.innerHTML = iconDict[arr[item]]
      button.appendChild(icon)
      button.addEventListener('click', menuClicked)
      buttonBar.appendChild(button)
    }

    this.el.appendChild(buttonBar)
  } // if we didn't include the prototype we would have to include this function in the constructor e.g.  function Menu()
  Menu.prototype.displayAt = function (x, y) {
  // set style postiton
    if (!x || !y) {
      x = this.lastposx
      y = this.lastposy
    }
    this.lastposx = x
    this.lastposy = y
    this.el.style.left = x + 'px'
    this.el.style.top = y + 'px'

  // use appendChild to get DOM to actually show
    document.body.appendChild(this.el)
  }
  Menu.prototype.close = function () {
  // remove menu from document
    if (this.el) { document.body.removeChild(this.el) }
  }
  Menu.prototype.getLastPosition = function (e) {
    return {
      x: this.lastposx,
      y: this.lastposy
    }
  }
  Menu.prototype.getPosition = function (e) {
    var posx = this.lastposx
    var posy = this.lastposy

    if (!e) e = window.event

    if (e.pageX || e.pageY) {
      posx = e.pageX
      posy = e.pageY
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft +
                      document.documentElement.scrollLeft
      posy = e.clientY + document.body.scrollTop +
                      document.documentElement.scrollTop
    }
    return {
      x: posx,
      y: posy
    }
  }
  function openMenu (e) {
    var pos
    if (currMenu && e === 'INSTALL' ) {
    // then display menu at last position
      pos = currMenu.getLastPosition()
      closeMenu()
    }
    else if ( currMenu && e !== 'INSTALL' ) {
      // close the menu and return
      closeMenu()
      return
    }
    var menu = new Menu()
    currMenu = menu

    if (!pos) { pos = menu.getPosition(e) }
    currSelection = window.getSelection()
    menu.displayAt(pos.x, pos.y)
  }
  var options = { window : window }
  var currSelection
  var Right_Click = { 'options': {} } // stores all buttons and not just those in install.json
  var enabled_formats = {} // dict of formats that are enabled
  function updateFormats () { // sets enabled_formats[key]
    Right_Click.options = options
    for (var key in options.modifiers) {
      if (Right_Click.options.modifiers[key]) {
        enabled_formats[key] = true
      } else {
        enabled_formats[key] = false
      }
    }
  }
  // ##if in preview
  if (typeof window.INSTALL_OPTIONS === 'object') {
    for (var key in INSTALL_OPTIONS) {
      options[key] = INSTALL_OPTIONS[key]
      Right_Click.options[key] = options[key]
    }
    //  (document.readyState !== 'loading') {
      // openMenu('INSTALL')

  } else { // Just for when we are development mode from browser to simulate
    var options = {
      // 'backgroundColor': '#FFFFFF',
      'modifiers': {
        'bold': true,
        'backColor': false,
        'italic': true,
        'fontName': false,
        'strikeThrough': true,
        'underline': true,
        'justify': true

      }
    }
    for (var key in options) { Right_Click.options[key] = options[key] }
  }

  // call set by install.json "execute": "INSTALL_SCOPE.setOptions(INSTALL_OPTIONS)"
  // apps team provides INSTALL_OPTIONS and the excution of this function granted line aboeve is in install.json
  window.INSTALL_SCOPE = {
    setOptions: function (opts) {
      for (var key in opts) {
        Right_Click.options[key] = opts[key]
        updateFormats()
        openMenu('INSTALL')
      }
      // openMenu('INSTALL')// passing in "INSTALL" tells the function to handle as an INSTALL
    }
  }
  // This code ensures that the app doesn't run before the page is loaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFormats)
    document.addEventListener('DOMContentLoaded', openMenu.bind(null, 'INSTALL'))
  } else {
    updateFormats()
    openMenu('INSTALL')
  }
  document.addEventListener('contextmenu', function (e) { // function e sam a e =>
  // Prevents right click from default from opening
    if (!e.ctrlKey){return}
    e.preventDefault()
    openMenu(e);
    return;
  });


})()
