// *******************************************
// ISY Base (Docking) Panel
// *******************************************
function ISYBasePanel(viewer, container, id, title, content, type, options) {
  this.viewer = viewer;
  //this.button = options.button;
  var parent = this;

  Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

  // the style of the docking panel
  // use this built-in style to support Themes on Viewer 4+
  this.container.classList.add('docking-panel-container-solid-color-a');
  this.container.style.top = "20px";
  this.container.style.left = "330px";
  this.container.style.width = "auto";
  this.container.style.height = "auto";
  this.container.style.resize = "auto";

  // this is where we should place the content of our panel
  //<iframe width="933" height="700" src="https://app.powerbi.com/view?r=eyJrIjoiZTAxNDZiYjktZDdiNS00NzkwLThjMDctN2ViNTFmOTM2Y2Y5IiwidCI6ImNlMjVjYTkzLTAwNGYtNDRmNC1hNmI1LWViMjJiNDU4MTVhYSIsImMiOjh9" frameborder="0" allowFullScreen="true"></iframe>
  var div;
  if(type == 1)
  {
    div = document.createElement('div');
    div.setAttribute("id", "isyPropDiv");
    div.width = 400;
    div.height = 300;
  }
  if(type == 0)
    div = document.createElement('img');

  div.style.margin = '20px';
  div.innerHTML = content;
  this.container.appendChild(div);
  // and may also append child elements...

  this.addVisibilityListener(function( show ) {
    /*if( show ) {
      parent.button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
    } else {
      parent.button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
    }*/
  });
}

function updateBasePanel(panel,title,content)
{
  var divTop = _panel.container.style.top;
  var divLeft = _panel.container.style.left;
  _panel.setVisible(false);
  _panel=null;
  _panel = new ISYBasePanel(_viewer, _viewer.container, 
    'No object selected', title, content, 1, null);
  _panel.container.style.top = divTop;
  _panel.container.style.left = divLeft;
  /*panel.setTitle(title);
  var div = document.getElementById('isyPropDiv');
  div.innerHTML = content;
  panel.container.appendChild(div);
  panel.resizeToContent();*/
}

ISYBasePanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
ISYBasePanel.prototype.constructor = ISYBasePanel;