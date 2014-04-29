var cache = require("./cache"),
    d     = require("./delimiters");

var JSON_INT_MAX = Math.pow(2, 53);
var JSON_INT_MIN = -JSON_INT_MAX;

function escape(string) {
  if(string.length > 0) {
    var c = string[0];
    if(c === d.RESERVED && string[1] === ESC) {
      return string.substring(1);
    } else if(c === d.ESC || c === d.SUB || c === d.RESERVED) {
      return d.ESC+string;
    } else {
      return string;
    }
  }
  return null;
}

function JSONMarshaller() {
  this.buffer = [];
}

JSONMarshaller.prototype = {
  write: function(c) {
    this.state = null;
    this.buffer.push(c);
  },

  emitNil: function(asMapKey, cache) {
    if(asMapKey) {
      this.emitString(d.ESC, "_", null, asMapKey, cache);
    } else {
      this.write("null");
    }
  },

  emitString: function(asMapKey, prefix, tag, s, asMapKey, cache) {
    var s = cache.write(prefix+tag+s, asMapKey);
    if(asMapKey) {
      this.write("\""+s+"\":");
    } else {
      this.write(s);
    }
  },

  emitBoolean: function(b, asMapKey, cache) {
    var s = b.toString();
    if(asMapKey) {
      this.emitString(d.ESC, "?", s[0], asMapKey, cache);
    } else {
      this.write(s);
    }
  },

  emitInteger: function(i, asMapKey, cache) {
    if(asMapKey || (typeof i == "string") || (i > JSON_INT_MAX) || (i < JSON_INT_MAX)) {
      this.emitString(d.ESC, "i", i, asMapKey, cache);
    } else {
      this.write(s);
    }
  },

  emitDouble: function(d, asMapKey, cache) {
    if(asMapKey) {
      this.emitString(d.ESC, "d", d, asMapKey, cache);
    } else {
      this.write(s);
    }
  },

  emitBinary: function(b, asMapKey, cache) {
    this.emitBinary(d.ESC, "b", new Buffer(b).toString("base64"), asMapKey, cache);
  },

  arraySize: function(arr) {
  },

  emitArrayStart: function(size) {
    this.write("[");
  },

  emitArrayEnd: function() {
    this.write("]");
  },

  mapSize: function(ignore) {
  },

  emitMapStart: function(size) {
    this.write("{");
  },

  emitMapEnd: function() {
    this.write("}");
  },

  emitQuoted: function(obj, cache) {
    this.emitMapStart(1);
    this.emitString(d.ESC, "'", null, true, cache);
    marshal(this, obj, false, cache);
    this.emitMapEnd();
  },

  flushWriter: function(ignore) {
    return this.buffer.join("");
  },

  prefersString: function() {
    return true;
  }
};

function emitInts(em, src, cache) {
  for(var i = 0; i < src.length; i++) {
    em.emitInt(em, src[i], false, cache);
  }
}

function emitShorts(em, src, cache) {
  for(var i = 0; i < src.length; i++) {
    em.emitShort(em, src[i], false, cache);
  }
}

function emitLongs(em, src, cache) {
  for(var i = 0; i < src.length; i++) {
    em.emitLong(em, src[i], false, cache);
  }
}

function emitFloats(em, src, cache) {
  for(var i = 0; i < src.length; i++) {
    em.emitFloat(em, src[i], false, cache);
  }
}

function emitDouble(em, src, cache) {
  for(var i = 0; i < src.length; i++) {
    em.emitDouble(em, src[i], false, cache);
  }
}

function emitChars(em, src, cache) {
  for(var i = 0; i < src.length; i++) {
    marshal(em, src[i], false, cache);
  }
}

function emitBooleans(em, src, cache) {
  for(var i = 0; i < src.length; i++) {
    em.emitBoolean(em, src[i], false, cache);
  }
}

function emitObjects(em, src, cache) {
  for(var i = 0; i < src.length; i++) {
    marshal(em, src[i], false, cache);
  }
}

function emitArray(em, iterable, skip, cache) {
  em.emitArrayStart(em.arraySize(iterable));
  if(iterable instanceof Int8Array) {
    emitChars(em, iterable, cache);
  } else if(iterable instanceof Int16Array) {
    emitShorts(em, iterable, cache);
  } else if(iterable instanceof Int32Array) {
    emitInts(em, iterable, cache);
  } else if(iterable instanceof Float32Array) {
    emitFloats(em, iterable, cache);
  } else if(iterable instanceof Float64Array) {
    emitDoubles(em, iterable, cache);
  } else {
    emitObjects(em, iterable, cache);
  }
  em.emitArrayEnd();
}

function emitMap(em, iterable, skip, cache) {
}

function AsTag(tag, rep, str) {
  this.tag = tag;
  this.rep = rep;
  this.str = str;
}

function Quote(obj) {
  this.obj = obj;
}

function TaggedValue(tag, rep) {
  this.tag = tag;
  this.rep = rep;
}

function hasStringableKeys(m) {
}

function emitTaggedMap(em, tag, rep, skip, cache) {
}

function emitEncoded(em, h, tag, obj, asMapKey, cache) {
}

function marshal() {
}

function maybeQuoted(obj) {
}

function marshalTop() {
}

function getItfHandler(ty) {
}

function getBaseHandler(ty) {
}

function handler(obj) {
}

function write(writer, obj) {
  marshalTop(m, writer, obj, writeCache());
}

module.exports = {
  write: write,
  JSONMarshaller: JSONMarshaller
};
