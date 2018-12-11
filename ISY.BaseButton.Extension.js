// *******************************************
// ISY Base Button Extension
// *******************************************
function ISYBaseButtonExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

ISYBaseButtonExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ISYBaseButtonExtension.prototype.constructor = ISYBaseButtonExtension;

ISYBaseButtonExtension.prototype.load = function () {
  if (this.viewer.toolbar) {
    // Toolbar is already available, create the UI
    this.createUI();
  } else {
    // Toolbar hasn't been created yet, wait until we get notification of its creation
    this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
    this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  }

  console.log('Load ISY Base Button Extension');

  return true;
};

ISYBaseButtonExtension.prototype.onToolbarCreated = function () {
  this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  this.onToolbarCreatedBinded = null;
  this.createUI();
};

ISYBaseButtonExtension.prototype.createUI = function () {
  var _this = this;

  // prepare to execute the button action
  var isyBaseButton = new Autodesk.Viewing.UI.Button('ISY.Button.Base');
  isyBaseButton.onClick = function (e) {
    alert('ISY Base Button');
  };
  // isyBaseButton CSS class should be defined on your .css file
  // you may include icons, below is a sample class:
  isyBaseButton.addClass('isyBaseButton');
  isyBaseButton.setToolTip('ISY Base Button');
  isyBaseButton.icon.className = 'glyphicon glyphicon-thumbs-up';
  isyBaseButton.icon.style.fontSize = '24px';

  // SubToolbar
  this.subToolbar = (this.viewer.toolbar.getControl("ISY.Toolbar") ?
    this.viewer.toolbar.getControl("ISY.Toolbar") :
    new Autodesk.Viewing.UI.ControlGroup('ISY.Toolbar'));
  this.subToolbar.addControl(isyBaseButton);

  this.viewer.toolbar.addControl(this.subToolbar);
};

ISYBaseButtonExtension.prototype.unload = function () {
  this.viewer.toolbar.removeControl(this.subToolbar);

  console.log('Unload ISY Base Button Extension');

  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('ISY.BaseButton.Extension', ISYBaseButtonExtension);