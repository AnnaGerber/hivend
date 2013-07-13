// Draw hexagon UI
var w = 800,
    h = 480,
    px = 120,
    py = 130;
    
var diameter = 150;
 
var offset = diameter / Math.sqrt(3) * 3 / 4;
var data = [];
var productId = 0;
d3.range(0 + py, w - px, Math.sqrt(3) * diameter / 2).map(function(v1) {
    d3.range(0 + px, h - py, diameter * 3 / 4).map(function(v2, i) {
        data.push({
            centroid: [i % 2 ? v1 + offset : v1, v2],
            productId: productId++
        });
    });
});
 
var svg = d3.select("#content")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .attr("pointer-events", "all");
 
update();
 
function update() {
    svg.selectAll("path")
        .data(data.map(function(d) {return hex(d, diameter); }))
        .attr("d", function(d) {return "M" + d.path.join("L") + "Z"; })
        .enter()
        .append("svg:path")
        .attr("d", function(d) { return "M" + d.path.join("L") + "Z"; })
        .on("click", click)
        .on("tap", click)
        //.on("mouseover", mouseover)
        //.on("mouseout", mouseout);
    
}
 
function click(d, i) {
    console.log("clicked cell", d, i,this);
    d3.selectAll("path").style("fill","#E8AB4A");

    d3.select(this)
        .style("fill", "#FADF5E");
}
 
function mouseover(d, i) {
    // honey yellow
    d3.select(this)
        .style("fill", "#FADF5E");
}

function mouseout(d, i) {
    // honey brown
    d3.select(this)
        .style("fill", "#E8AB4A");
}
 
function hex(celldata, diameter, tilted) {
    var center = celldata.centroid;

    if (center == null || center.length != 2) throw new Error("center must be an array [x, y]");
    if (diameter == null) diameter = 0;
    if (tilted == null) tilted = false;
    var a = diameter / 2, 
        b = (Math.sqrt(3) * a) / 2,
        x = center[0],
        y = center[1];
    var returnData = {productId: celldata.productId};
    returnData.path = tilted ? 
        [[x - a / 2, y - b], [x - a, y], [x - a / 2, y + b], [x + a / 2, y + b], [x + a, y], [x + a / 2, y - b]] : 
        [[x - b, y - a / 2], [x - b, y + a / 2], [x, y + a], [x + b, y + a / 2], [x + b, y - a / 2], [x, y - a]];
    return returnData;
};

// Listen out for newMessage events coming from the server
ss.event.on('newMessage', function(message) {

  // Example of using the Hogan Template in client/templates/chat/message.jade to generate HTML for each message
  var html = ss.tmpl['chat-message'].render({
    message: message,
    time: function() { return timestamp(); }
  });

  // Append it to the #chatlog div and show effect
  return $(html).hide().appendTo('#chatlog').slideDown();
});

// Show the chat form and bind to the submit action
$('#demo').on('submit', function() {

  // Grab the message from the text box
  var text = $('#myMessage').val();

  // Call the 'send' funtion (below) to ensure it's valid before sending to the server
  return exports.send(text, function(success) {
    if (success) {
      return $('#myMessage').val('');
    } else {
      return alert('Oops! Unable to send message');
    }
  });
});

// Demonstrates sharing code between modules by exporting function
exports.send = function(text, cb) {
  if (valid(text)) {
    return ss.rpc('demo.sendMessage', text, cb);
  } else {
    return cb(false);
  }
};


// Private functions

var timestamp = function() {
  var d = new Date();
  return d.getHours() + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
};

var pad2 = function(number) {
  return (number < 10 ? '0' : '') + number;
};

var valid = function(text) {
  return text && text.length > 0;
};