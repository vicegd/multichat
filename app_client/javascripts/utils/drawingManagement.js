function DrawingManagement(ws) {
  var canvas = new fabric.Canvas('canvas');
  canvas.setHeight(350);
  canvas.setWidth(350);
  canvas.freeDrawingBrush.color = 'green';
  canvas.freeDrawingBrush.lineWidth = 10;

  this.addCircle = function() {
    var obj = {
      radius: 20,
      fill: 'green',
      left: 100,
      top: 100
    };
    sendData('Circle', obj, 'add');
  };

  this.addRectangle = function() {
    var obj = {
      top : 100,
      left : 100,
      width : 60,
      height : 70,
      fill : 'red'
    };
    sendData('Rectangle', obj, 'add');
  };

  this.addTriangle = function() {
    var obj = {
      width: 20,
      height: 30,
      fill: 'blue',
      left: 50,
      top: 50
    };
    sendData('Triangle', obj, 'add');
  };

  this.getPencil = function() {
    canvas.isDrawingMode = true;
  };

  this.getSelection = function() {
    canvas.isDrawingMode = false;
  };

  this.clearAll = function(type, info) {
    sendData('', '', 'clearAll');
  };

  this.addObject = function(type, info) {
    var shape;
    if(type == 'Triangle') {
      shape = new fabric.Triangle(info);
    }
    else if(type == 'Rectangle') {
      shape = new fabric.Rect(info);
    }
    else if(type == 'Circle') {
      shape = new fabric.Circle(info);
    }
    canvas.add(shape);
  };

  this.clearObjects = function(type, info) {
    canvas.clear();
  };

  function sendData(type, info, operation) {
    ws.send(JSON.stringify({
      'section': 'drawings',
      'data': {
        'operation': operation,
        'type': type,
        'info': info,
      }}));
  }
}
