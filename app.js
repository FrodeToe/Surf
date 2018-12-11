let _viewer = null;

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
    });

    _viewer.setReverseZoomDirection(true);

    _viewer.loadModel (options.docid);
  });
});



