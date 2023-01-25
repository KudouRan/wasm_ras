import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

let wasm;

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) {
  return heap[idx];
}

let WASM_VECTOR_LEN = 0;

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
  if (
    cachegetUint8Memory0 === null ||
    cachegetUint8Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachegetUint8Memory0;
}

let cachedTextEncoder = new TextEncoder();

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3));
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (
    cachegetInt32Memory0 === null ||
    cachegetInt32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}

let heap_next = heap.length;

function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}
/**
 * @param {any} js_object
 * @returns {string}
 */
function encrypt(js_object) {
  try {
    wasm.encrypt(8, addHeapObject(js_object));
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_free(r0, r1);
  }
}

/**
 * @param {any} js_object
 * @returns {string}
 */
function decrypt(js_object) {
  try {
    wasm.decrypt(8, addHeapObject(js_object));
    var r0 = getInt32Memory0()[8 / 4 + 0];
    var r1 = getInt32Memory0()[8 / 4 + 1];
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_free(r0, r1);
  }
}

function handleError(e) {
  wasm.__wbindgen_exn_store(addHeapObject(e));
}

function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function init() {
  const module =
    '//s1.hdslb.com/bfs/static/jinkela/long/wasm/wasm_rsa_encrypt_bg.wasm';

  let result;
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_json_serialize = function (arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_log_da30ae7b677263c7 = function (arg0, arg1) {
    console.log(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbg_new_59cb74e423758ede = function () {
    var ret = new Error();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_stack_558ba5917b466edd = function (arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_error_4bb6c2a97407129a = function (arg0, arg1) {
    try {
      console.error(getStringFromWasm0(arg0, arg1));
    } finally {
      wasm.__wbindgen_free(arg0, arg1);
    }
  };
  imports.wbg.__wbg_randomFillSync_d5bd2d655fdf256a = function (
    arg0,
    arg1,
    arg2
  ) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
  };
  imports.wbg.__wbg_getRandomValues_f5e14ab7ac8e995d = function (
    arg0,
    arg1,
    arg2
  ) {
    getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2));
  };
  imports.wbg.__wbg_self_1b7a39e3a92c949c = function () {
    try {
      var ret = self.self;
      return addHeapObject(ret);
    } catch (e) {
      handleError(e);
    }
  };
  imports.wbg.__wbg_crypto_968f1772287e2df0 = function (arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_is_undefined = function (arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
  };
  imports.wbg.__wbg_getRandomValues_a3d34b4fee3c2869 = function (arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_require_604837428532a733 = function (arg0, arg1) {
    var ret = require(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };

  if (
    (typeof URL === 'function' && module instanceof URL) ||
    typeof module === 'string' ||
    (typeof Request === 'function' && module instanceof Request)
  ) {
    // chrome
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      const fetchRes = fetch(module);
      result = WebAssembly.instantiateStreaming(fetchRes, imports).catch(
        (e) => {
          return fetchRes
            .then((r) => {
              if (r.headers.get('Content-Type') != 'application/wasm') {
                return r.arrayBuffer();
              } else {
                throw e;
              }
            })
            .then((bytes) => {
              return WebAssembly.instantiate(bytes, imports);
            });
        }
      );
    } else {
      // safari
      result = fetch(module)
        .then((res) => res.arrayBuffer())
        .then((bytes) => WebAssembly.instantiate(bytes, imports));
    }
  } else {
    result = WebAssembly.instantiate(module, imports).then((result) => {
      if (result instanceof WebAssembly.Instance) {
        return { instance: result, module };
      } else {
        return result;
      }
    });
  }
  return result.then((res) => {
    const { instance, module } = res;
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
  });
}

function convertToHex(str) {
  return str.split('').reduce((i, t) => i + t.charCodeAt(0).toString(16), '');
}

function getHash(timestamp) {
  const correspondPath = encrypt({
    data: convertToHex(`refresh_${timestamp}`),
    digest: 'SHA256',
  });
  return correspondPath;
}

export default async (request: VercelRequest, response: VercelResponse) => {
  await init();
  const timestamp = request.query.timestamp || request.query.t;
  if (timestamp) {
    return response.status(200).json({
      hash: '',
      code: 400,
    });
  }
  return response.status(200).json({
    timestamp,
    hash: getHash(timestamp),
    code: 0,
  });
};
