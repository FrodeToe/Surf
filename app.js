let _viewer = null;
let _panel = null;

$(document).ready (function () {
  var docs = [];

  docs.push({'path':'./Surf.nwd/0/0.svf','name':'Test'});
  
  if(docs.length ==0)
      return;

  let options ={ 'docid': docs [0].path, env: 'Local' };

  _viewer =new Autodesk.Viewing.Private.GuiViewer3D ($('#forgeViewer') [0], {}) ;// With toolbar
  Autodesk.Viewing.Initializer (options, function () {
    _viewer.initialize ();

    _viewer.addEventListener (Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function(event){
      // geometry loded code
      _viewer.loadExtension('ISY.Viewing.Extension.Bookmarks');
      _viewer.loadExtension('ISY.BaseButton.Extension');
    });

    _viewer.addEventListener (Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event){
      var title = "";
      var image = "";
      var type = 0;
      var elId = event.dbIdArray[0];
      if(elId == 2224)//4808)
      {
        title = "Terskel alternativ 2";
        image = "Pris på betong:<br><br>Volume = 110,251 m³<br>Billigste alternativ: 54.275 kr<br>Dyreste alternativ: 111.231 kr<br>";
        type = 1;
        //<iframe width="933" height="700" src="https://app.powerbi.com/view?r=eyJrIjoiZTAxNDZiYjktZDdiNS00NzkwLThjMDctN2ViNTFmOTM2Y2Y5IiwidCI6ImNlMjVjYTkzLTAwNGYtNDRmNC1hNmI1LWViMjJiNDU4MTVhYSIsImMiOjh9" frameborder="0" allowFullScreen="true"></iframe>
      }
      else
      {
        if (_panel != null) 
        _panel.setVisible(false);
        return;
      }  

            // if null, create it
      if (_panel == null) {
        _panel = new ISYBasePanel(_viewer, _viewer.container, 
            'isyExtensionPanel', title, image, type, null);
      }
      // show/hide docking panel
      
      _panel.setVisible(true);

    });

    _viewer.setReverseZoomDirection(true);

    _viewer.loadModel (options.docid);
  });
});



