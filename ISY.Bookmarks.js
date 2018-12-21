///////////////////////////////////////////////////////////////////////////////
// ISY.Viewing.Extension.Bookmarks
///////////////////////////////////////////////////////////////////////////////

ISYViewingExtensionBookmarks = function (viewer, options) {

  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _panelBaseId = newGUID();

  var _viewer = viewer;

  var _panel = null;

  var _this = this;

  /////////////////////////////////////////////////////////
  // load callback
  //
  //////////////////////////////////////////////////////////
  _this.load = function () {

    _panel = new ISYViewingExtensionBookmarks.Panel(
      _viewer.container,
      _panelBaseId);

     // creates controls if specified in
    // options: {createControls: true}
    //if(options && options.createControls) {

      var ctrlGroup = getControlGroup();

      createControls(ctrlGroup);
    /*}
    else {

      _panel.setVisible(true);
    }*/

    //readBookmarks();

    console.log('ISY.Viewing.Extension.Bookmarks loaded');

    return true;
  };

  /////////////////////////////////////////////////////////
  // unload callback
  //
  /////////////////////////////////////////////////////////
  _this.unload = function () {

    _panel.setVisible(false);

    // remove controls if created
    if(options && options.createControls) {

      try {

        var toolbar = viewer.getToolbar(true);

        toolbar.removeControl(
          'ISY.Bookmarks.ControlGroup');
      }
      catch (ex) {

        $('#divISYBookmarksMngToolbar').remove();
      }
    }

    console.log('ISY.Viewing.Extension.Bookmarks unloaded');

    return true;
  };

  /////////////////////////////////////////////////////////
  // return control group or create if doesn't exist
  //
  /////////////////////////////////////////////////////////
  function getControlGroup() {

    var toolbar = null;

    try {
      toolbar = viewer.getToolbar(true);

      if(!toolbar) {
        toolbar = createDivToolbar();
      }
    }
    catch (ex) {
      toolbar = createDivToolbar();
    }

    var control = toolbar.getControl(
      'ISY.Toolbar');

    if(!control) {

      control = new Autodesk.Viewing.UI.ControlGroup(
        'ISY.Toolbar');

      toolbar.addControl(control);
    }

    return control;
  }

  /////////////////////////////////////////////////////////
  // create a div toolbar when Viewer3D used
  //
  /////////////////////////////////////////////////////////
  function createDivToolbar() {

    var toolbarDivHtml =
      '<div id="divISYBookmarksMngToolbar"> </div>';

    $(viewer.container).append(toolbarDivHtml);

    $('#divISYBookmarksMngToolbar').css({
      'bottom': '0%',
      'left': '50%',
      'z-index': '100',
      'position': 'absolute'
    });

    var toolbar = new Autodesk.Viewing.UI.ToolBar(true);

    $('#divISYBookmarksMngToolbar')[0].appendChild(
      toolbar.container);

    return toolbar;
  }

  /////////////////////////////////////////////////////////
  // creates controls for the extension
  //
  /////////////////////////////////////////////////////////
  function createControls(parentGroup) {

    var btn = createButton(
      'ISY.Viewing.Extension.Bookmarks.Button',
      'glyphicon glyphicon-bookmark',
      'Show ISY Bookmarks',
      onShowPanelClicked);

    parentGroup.addControl(btn);
  }

  /////////////////////////////////////////////////////////
  // show panel handler
  //
  /////////////////////////////////////////////////////////
  function onShowPanelClicked() {
     populateList();

    _panel.setVisible(true);
  }

  function readBookmarks() 
  {
    var BookmarksJson = {
      "tagNoArray": [{
          "n": "01_05147",
          "i": "13985"
        },
        {
          "n": "01_05148",
          "i": "13990"
        }
      ],

      "lineNoArray": [{
          "n": "570-0213-AT01-1-WS-0",
          "i": "24892,24893,24894,24895,24897,24899,24901,24903,24904,24905,24906,24908,24909,24911,24913,24914,24915,24916,24917"
        },
        {
          "n": "500_0001-AD12",
          "i": "24892,24893,24894,24895,24897,24899,24901,24903,24904,24905,24906,24908,24909,24911,24913,24914,24915,24916,24917"
        }
      ]
    }; 

    for(var i=0;i<BookmarksJson.tagNoArray.length;i++)
    {
      var name =  BookmarksJson.tagNoArray[i].n;
      var id =  BookmarksJson.tagNoArray[i].i;
      tagNos[i]=name;
      tagNoIds[i]=id;
    }
    
    for(var i=0;i<BookmarksJson.lineNoArray.length;i++)
    {
      var name =  BookmarksJson.lineNoArray[i].n;
      var id =  BookmarksJson.lineNoArray[i].i;
      
      lineNumbers[i]=name;
      lineNumberIds[i]=id;
    }
  }

  /////////////////////////////////////////////////////////
  // create button util
  //
  /////////////////////////////////////////////////////////
  function createButton(id, className, tooltip, handler) {

    var button = new Autodesk.Viewing.UI.Button(id);

    //button.icon.style.backgroundImage = imgUrl;
    button.icon.className = className;

    button.icon.style.fontSize = "24px";

    button.setToolTip(tooltip);

    button.onClick = handler;

    return button;
  }

  /////////////////////////////////////////////////////////
  // new GUID util
  //
  /////////////////////////////////////////////////////////
  function newGUID() {

    var d = new Date().getTime();

    var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });

    return guid;
  };

  /////////////////////////////////////////////////////////
  // Panel implementation
  //
  /////////////////////////////////////////////////////////
  ISYViewingExtensionBookmarks.Panel = function(
    parentContainer,
    baseId)
  {
    this.content = document.createElement('div');

    this.content.id = baseId + 'PanelContentId';
    this.content.className = 'isyBookmarks-manager-panel-content';

    Autodesk.Viewing.UI.DockingPanel.call(
      this,
      parentContainer,
      baseId,
      "ISY Bookmarks",
      {shadow:true});

    this.container.style.left = "20px";
    this.container.style.top = "20px";

    this.container.style.width = "300px";
    this.container.style.height = "280px";

    this.container.style.resize = "auto";

    this.container.style.backgroundColor = "#3F4244";
  
    var html = [
      '<div class="isyBookmarks-manager-panel-container">',
        '<div id="list" class="isyBookmarks-manager-panel-list-container">',
          '<table id="forge-parts-table" style="width:100%">',
            '<tbody>',
              '<tr style="background-color: rgb(255, 255, 255);">',
              '</tr>',
            '</tbody>',
          '</table>',
        '</div>',
      '</div>',
      '<br>',
      
    ].join('\n');

    $('#' + baseId + 'PanelContentId').html(html);
  };

  ISYViewingExtensionBookmarks.Panel.prototype = Object.create(
    Autodesk.Viewing.UI.DockingPanel.prototype);

  ISYViewingExtensionBookmarks.Panel.prototype.constructor =
    ISYViewingExtensionBookmarks.Panel;

  ISYViewingExtensionBookmarks.Panel.prototype.initialize = function()
  {
    // Override DockingPanel initialize() to:
    // - create a standard title bar
    // - click anywhere on the panel to move

    this.title = this.createTitleBar(
      this.titleLabel ||
      this.container.id);

    this.closer = this.createCloseButton();

    this.container.appendChild(this.title);
    this.title.appendChild(this.closer);
    this.container.appendChild(this.content);

    this.initializeMoveHandlers(this.title);
    this.initializeCloseHandler(this.closer);
  };

  var css = [
  
    'div.isyBookmarks-manager-panel-content {',
      'height: calc(100% - 40px);',
    '}',
  
    'div.isyBookmarks-manager-panel-container {',
      'height: calc(100% - 40px);',
      'margin: 10px;',
      'color: lightgray',
    '}',
  
    'div.isyBookmarks-manager-panel-controls-container {',
      'margin-bottom: 10px;',
    '}',
  
    'div.isyBookmarks-manager-panel-list-container {',
      'height: calc(100% - 10px);',
      //'height: 100%;',
      'overflow: auto;',
      'margin-bottom: 10px;',
      'margin-top: 5px;',
      'position:relative;',

    '}',
  
    'div.isyBookmarks-manager-panel-item {',
      'margin-left: 0;',
      'margin-right: 0;',
      'color: #FFFFFF;',
      'background-color: #3F4244;',
      'margin-bottom: 5px;',
      'border-radius: 4px;',
    '}',
  
    'div.isyBookmarks-manager-panel-item:hover {',
      'background-color: #5BC0DE;',
    '}',
  
    'label.isyBookmarks-manager-panel-label {',
      'color: #FFFFFF;',
    '}',
 
    'input.isyBookmarks-manager-panel-input {',
      'height: 30px;',
      'width: 75px;',
      'border-radius: 5px;',
    '}'

  ].join('\n');

  ///////////////////////////////////////////////////////
  // Checks if css is loaded
  //
  ///////////////////////////////////////////////////////
  function isCssLoaded(name) {

    for(var i=0; i < document.styleSheets.length; ++i){

      var styleSheet = document.styleSheets[i];

      if(styleSheet.href && styleSheet.href.indexOf(name) > -1)
        return true;
    };

    return false;
  }

  // loads bootstrap css if needed
  if(!isCssLoaded("bootstrap.css") && !isCssLoaded("bootstrap.min.css")) {

    $('<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.css"/>').appendTo('head');
  }

  $('<style type="text/css">' + css + '</style>').appendTo('head');
};

function populateList()
{
$("#loading").remove();
    $("#forge-parts-table tbody tr").remove();
    var table = document.getElementById("forge-parts-table");

    //AddRowCamera(table,'./States/stateHall.json',"Kamera Hall")
    //AddRowCamera(table,'./States/stateKuleventil.json',"Kamera Kuleventil (U2)")
    //AddEmpty(table)
    //AddRow(table,[30711,16831,52023],"Slepering (U1)")
    //AddRow(table,[113868],"Kuleventil (U2)")
    
    /*
    AddRow(table,[4828],"Pongtong 45");
    AddRow(table,[4827],"Pongtong 44");
    AddRow(table,[4826],"Pongtong 43");
    AddRow(table,[4825],"Pongtong 42");
    AddRow(table,[4824],"Pongtong 41");
    AddRow(table,[4823],"Pongtong 40");
    AddRow(table,[4822],"Pongtong 39");
    AddRow(table,[4821],"Pongtong 38");
    AddRow(table,[4820],"Pongtong 37");
    AddRow(table,[4819],"Pongtong 36");
    AddRow(table,[4818],"Pongtong 35");
    AddRow(table,[4817],"Pongtong 34");
    AddRow(table,[4816],"Pongtong 33");
    AddRow(table,[4815],"Pongtong 32");
    AddRow(table,[4814],"Pongtong 31");
    AddRow(table,[4813],"Pongtong 30");
    AddRow(table,[4812],"Pongtong 29");
    AddRow(table,[4811],"Pongtong 28");
    AddRow(table,[4810],"Pongtong 27");
    AddRow(table,[4809],"Pongtong 26");
    */

    //AddRow(table,[2218],"Terskel alernativ 2");
    AddRow(table,null,"Hjem (Fjern Snitt/vis alt)");
    AddRow(table,null,"Lengdesnitt mot vest");
    AddRow(table,null,"Lengdesnitt mot øst");
    AddRow(table,null,"Alternativ 2b");
    AddRow(table,null,"Alternativ 2a");
    AddRow(table,null,"Kostnadsdiagram (isolert)");
    AddRow(table,null,"Kostnadsdiagram");
    //AddRow(table,[24610],"Surfer");
    //AddRow(table,[62838],"Surfebølge");
    
}

function moveCameraToState(url)
  {
      $.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
          _viewer.restoreState(data); 
          //resolve('success')
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log(thrownError);
        },
        statusCode: {
          404: function () {
            alert('There was a problem with the server.  Try again soon!');
          }
        }
      });
  }

function AddEmpty(table)
{
  let row = table.insertRow(0);
  let cell = row.insertCell(0);
  cell.id = "1";
  cell.innerHTML = "<br>";
  row.id = "empty";
}


function AddRowCamera(table,url, name)
{
  let row = table.insertRow(0);
  let cell = row.insertCell(0);
  cell.id = "1";
  cell.innerHTML = "<div class='isyBookmarks-manager-panel-item'>" + name + "<div>";
  row.id = name;

  let createClickHandler =
      function (row) {
          return function () {
            moveCameraToState(url);

            if (!this.hilite) {
              //unhighlightRowInTable('forge-parts-table');
              //this.origColor = this.style.backgroundColor;
              //this.style.backgroundColor = 'darkgray';
              //this.hilite = true;
              }
          };
      };

  row.onclick = createClickHandler(row);
}


function AddRow(table,id, name)
{
  let row = table.insertRow(0);
  let cell = row.insertCell(0);
  cell.id = "1";
  cell.innerHTML = "<div class='isyBookmarks-manager-panel-item'>" + name + "</div>";
  row.id = name;

  let createClickHandler =
      function (row) {
          return function () {
            if(name == "Kostnadsdiagram")
            {
              moveCameraToState("./sv_kostnadsdiagram.json");
              return;
            }
            if(name == "Kostnadsdiagram (isolert)")
            {
              moveCameraToState("./sv_kostisolert.json");
              return;
            }
            if(name == "Alternativ 2a")
            {
              moveCameraToState("./sv_alternativ2a.json");
              return;
            }
            if(name == "Alternativ 2b")
            {
              moveCameraToState("./sv_alternativ2b.json");
              return;
            }
            if(name == "Lengdesnitt mot vest")
            {
              moveCameraToState("./sv_snittvest.json");
              return;
            }
            if(name == "Lengdesnitt mot øst")
            {
              moveCameraToState("./sv_snittost.json");
              return;
            }
            /*if(name == "Snitt")
            {
              moveCameraToState("./snitt.json");
              return;
            }*/
            if(name == "Hjem (Fjern Snitt/vis alt)")
            {
              _viewer.setCutPlanes();
              moveCameraToState("./sv_hjem.json");
              return;
            }
            _viewer.fitToView(id)
            _viewer.isolate(id)
            //_viewer.select(id);

            if (!this.hilite) {
              //unhighlightRowInTable('forge-parts-table');
              //this.origColor = this.style.backgroundColor;
              //this.style.backgroundColor = 'darkgray';
              //this.hilite = true;
              }
          };
      };

  row.onclick = createClickHandler(row);
}

function moveCameraToState(url)
{
    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data) {
        _viewer.restoreState(data);   
        //resolve('success')
      },
      error: function (xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
      },
      statusCode: {
        404: function () {
          alert('There was a problem with the server.  Try again soon!');
        }
      }
    });
}

function onErrorCallback(data) {}

function unhighlightRowInTable(tableName) {
    var table = document.getElementById(tableName);
    for (var i = 0; i < table.rows.length; i++) {
        var row = table.rows[i];
        row.style.backgroundColor = "transparent";
        row.hilite = false;
    }
}

ISYViewingExtensionBookmarks.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

ISYViewingExtensionBookmarks.prototype.constructor =
  ISYViewingExtensionBookmarks;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'ISY.Viewing.Extension.Bookmarks',
  ISYViewingExtensionBookmarks);

