let _viewer = null;
let _panel = null;

$(document).ready (function () {
  var docs = [];

  docs.push({'path':'./Surf.nwd/0/0.svf','name':'Surf'});
  //docs.push({'path':'./Resource/3D View/BIM360-3D ALLE FAG 524835/BIM360-3D ALLE FAG.svf','name':'Test'});
  
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

      var measureExtension = _viewer.getExtension('Autodesk.Measure');
      measureExtension.setUnits('mm');
    });

    function viewerGetProperties(props) {
      if(props.dbId == undefined)
      {
        if (_panel != null) 
          _panel.setVisible(false);
        
        return;
      }
      title = props.name;
      var content = "";
      for(i=0;i<props.properties.length;i++)
      {
        var prop = props.properties[i];
        if(prop.displayCategory == "iConstruct")
        {
          if(prop.displayName == "GUID")
            continue;
          content += "<b>" + prop.displayName + ":</b> " + prop.displayValue + "<br>";
        }
      }

      if(content == "")
        content = "Objektet her ingen relevante data";
      
      type = 1;
      if (_panel != null) 
      {
        updateBasePanel(_panel,title,content);
      }  
        //_panel.setVisible(false);
      //_panel=null;

      if (_panel == null) {
        _panel = new ISYBasePanel(_viewer, _viewer.container, 
            'No object selected', title, content, type, null);
      }
      // show/hide docking panel
      
      _panel.setVisible(true);
    }

    _viewer.addEventListener (Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event){
      var elId = event.dbIdArray[0];
      
      _viewer.getProperties(elId,viewerGetProperties);
    });

    _viewer.setReverseZoomDirection(true);
   
    _viewer.loadModel (options.docid);
  });
});



