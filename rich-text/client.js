const sharedb = require('sharedb/lib/client');
const richText = require('rich-text');
const Quill = require('quill');
sharedb.types.register(richText.type);

// Open WebSocket connection to ShareDB server
const socket = new WebSocket('ws://' + window.location.host);
const connection = new sharedb.Connection(socket);

// For testing reconnection
window.disconnect = function() {
  connection.close();
};
window.connect = function() {
  const socket = new WebSocket('ws://' + window.location.host);
  connection.bindToSocket(socket);
};

// Create local Doc instance mapped to 'examples' collection document with id 'richtext'
const doc = connection.get('examples', 'richtext');
doc.subscribe(function(err) {
  if (err) throw err;
  const quill = new Quill('#editor', { theme: 'snow' });
  quill.setContents(doc.data);
  quill.on('text-change', function(delta, oldDelta, source) {
    if (source !== 'user') return;
    doc.submitOp(delta, { source: quill });
  });
  doc.on('op', function(op, source) {
    if (source === quill) return;
    quill.updateContents(op);
  });
});
