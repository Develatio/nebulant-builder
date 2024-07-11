import pako from "pako";

const writeUshort = (buff, p, n) => {
  buff[p] = (n >> 8) & 255;
  buff[p + 1] = n & 255;
};

const writeUint = (buff, p, n) => {
  buff[p] = (n >> 24) & 255;
  buff[p + 1] = (n >> 16) & 255;
  buff[p + 2] = (n >> 8) & 255;
  buff[p + 3] = n & 255;
};

const writeASCII = (data, p, s) => {
  for (let i = 0; i < s.length; i++) data[p + i] = s.charCodeAt(i);
};

const crcLib = {
  table: new Uint32Array(256),
  update(c, buf, off, len) {
    for (let i = 0; i < len; i++)
      c = crcLib.table[(c ^ buf[off + i]) & 0xff] ^ (c >>> 8);
    return c;
  },
  crc(b, o, l) {
    return crcLib.update(0xffffffff, b, o, l) ^ 0xffffffff;
  },
};

for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if(c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c >>>= 1;
  }
  crcLib.table[n] = c;
}

const M4 = {
  multVec(m, v) {
    return [
      m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3],
      m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3],
      m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3],
      m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3],
    ];
  },
  dot(x, y) {
    return x[0] * y[0] + x[1] * y[1] + x[2] * y[2] + x[3] * y[3];
  },
  sml(a, y) {
    return [a * y[0], a * y[1], a * y[2], a * y[3]];
  },
};

export class UPNG {
  static _copyTile(sb, sw, sh, tb, tw, th, xoff, yoff, mode) {
    const w = Math.min(sw, tw);
    const h = Math.min(sh, th);
    let si = 0;
    let ti = 0;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        if(xoff >= 0 && yoff >= 0) {
          si = (y * sw + x) << 2;
          ti = ((yoff + y) * tw + xoff + x) << 2;
        } else {
          si = ((-yoff + y) * sw - xoff + x) << 2;
          ti = (y * tw + x) << 2;
        }

        if(mode == 0) {
          tb[ti] = sb[si];
          tb[ti + 1] = sb[si + 1];
          tb[ti + 2] = sb[si + 2];
          tb[ti + 3] = sb[si + 3];
        } else if(mode == 1) {
          const fa = sb[si + 3] * (1 / 255);
          const fr = sb[si] * fa;
          const fg = sb[si + 1] * fa;
          const fb = sb[si + 2] * fa;
          const ba = tb[ti + 3] * (1 / 255);
          const br = tb[ti] * ba;
          const bg = tb[ti + 1] * ba;
          const bb = tb[ti + 2] * ba;

          const ifa = 1 - fa;
          const oa = fa + ba * ifa;
          const ioa = oa == 0 ? 0 : 1 / oa;
          tb[ti + 3] = 255 * oa;
          tb[ti + 0] = (fr + br * ifa) * ioa;
          tb[ti + 1] = (fg + bg * ifa) * ioa;
          tb[ti + 2] = (fb + bb * ifa) * ioa;
        } else if(mode == 2) {
          // copy only differences, otherwise zero
          const fa = sb[si + 3];
          const fr = sb[si];
          const fg = sb[si + 1];
          const fb = sb[si + 2];
          const ba = tb[ti + 3];
          const br = tb[ti];
          const bg = tb[ti + 1];
          const bb = tb[ti + 2];
          if(fa == ba && fr == br && fg == bg && fb == bb) {
            tb[ti] = 0;
            tb[ti + 1] = 0;
            tb[ti + 2] = 0;
            tb[ti + 3] = 0;
          } else {
            tb[ti] = fr;
            tb[ti + 1] = fg;
            tb[ti + 2] = fb;
            tb[ti + 3] = fa;
          }
        } else if(mode == 3) {
          // check if can be blended
          const fa = sb[si + 3];
          const fr = sb[si];
          const fg = sb[si + 1];
          const fb = sb[si + 2];
          const ba = tb[ti + 3];
          const br = tb[ti];
          const bg = tb[ti + 1];
          const bb = tb[ti + 2];
          if(fa == ba && fr == br && fg == bg && fb == bb) continue;
          // if(fa!=255 && ba!=0) return false;
          if(fa < 220 && ba > 20) return false;
        }
      }
    return true;
  }

  static paeth(a, b, c) {
    const p = a + b - c;
    const pa = p - a;
    const pb = p - b;
    const pc = p - c;
    if(pa * pa <= pb * pb && pa * pa <= pc * pc) return a;
    if(pb * pb <= pc * pc) return b;
    return c;
  }

  static addErr(er, tg, ti, f) {
    tg[ti] += (er[0] * f) >> 4;
    tg[ti + 1] += (er[1] * f) >> 4;
    tg[ti + 2] += (er[2] * f) >> 4;
    tg[ti + 3] += (er[3] * f) >> 4;
  }

  static N(x) {
    return Math.max(0, Math.min(255, x));
  }

  static D(a, b) {
    const dr = a[0] - b[0];
    const dg = a[1] - b[1];
    const db = a[2] - b[2];
    const da = a[3] - b[3];
    return dr * dr + dg * dg + db * db + da * da;
  }

  // MTD: 0: None, 1: floyd-steinberg, 2: Bayer
  static dither(sb, w, h, plte, tb, oind, MTD) {
    if(MTD == null) MTD = 1;

    const pc = plte.length;
    const nplt = [];
    const rads = [];
    for (let i = 0; i < pc; i++) {
      const c = plte[i];
      nplt.push([
        (c >>> 0) & 255,
        (c >>> 8) & 255,
        (c >>> 16) & 255,
        (c >>> 24) & 255,
      ]);
    }
    for (let i = 0; i < pc; i++) {
      let ne = 0xffffffff;
      for (let j = 0; j < pc; j++) {
        const ce = UPNG.D(nplt[i], nplt[j]);
        if(j != i && ce < ne) {
          ne = ce;
        }
      }
      const hd = Math.sqrt(ne) / 2;
      rads[i] = ~~(hd * hd);
    }

    const tb32 = new Uint32Array(tb.buffer);
    const err = new Int16Array(w * h * 4);

    /*
    var S=2, M = [
      0,2,
        3,1];  // */
    //*
    const S = 4;
    const M = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]; //* /
    for (let i = 0; i < M.length; i++)
      M[i] = 255 * (-0.5 + (M[i] + 0.5) / (S * S));

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;

        let cc;
        if(MTD != 2)
          cc = [
            UPNG.N(sb[i] + err[i]),
            UPNG.N(sb[i + 1] + err[i + 1]),
            UPNG.N(sb[i + 2] + err[i + 2]),
            UPNG.N(sb[i + 3] + err[i + 3]),
          ];
        else {
          const ce = M[(y & (S - 1)) * S + (x & (S - 1))];
          cc = [
            UPNG.N(sb[i] + ce),
            UPNG.N(sb[i + 1] + ce),
            UPNG.N(sb[i + 2] + ce),
            UPNG.N(sb[i + 3] + ce),
          ];
        }

        let ni = 0;
        let nd = 0xffffff;
        for (let j = 0; j < pc; j++) {
          const cd = UPNG.D(cc, nplt[j]);
          if(cd < nd) {
            nd = cd;
            ni = j;
          }
        }

        const nc = nplt[ni];
        const er = [cc[0] - nc[0], cc[1] - nc[1], cc[2] - nc[2], cc[3] - nc[3]];

        if(MTD == 1) {
          // addErr(er, err, i+4, 16);
          if(x != w - 1) UPNG.addErr(er, err, i + 4, 7);
          if(y != h - 1) {
            if(x != 0) UPNG.addErr(er, err, i + 4 * w - 4, 3);
            UPNG.addErr(er, err, i + 4 * w, 5);
            if(x != w - 1) UPNG.addErr(er, err, i + 4 * w + 4, 1);
          } //* /
        }
        oind[i >> 2] = ni;
        tb32[i >> 2] = plte[ni];
      }
    }
  }

  static encode(bufs, w, h, ps, dels, tabs, forbidPlte) {
    if(ps == null) ps = 0;
    if(forbidPlte == null) forbidPlte = false;

    const nimg = UPNG.compress(bufs, w, h, ps, [
      false,
      false,
      false,
      0,
      forbidPlte,
      false,
    ]);
    UPNG.compressPNG(nimg, -1);

    return UPNG._main(nimg, w, h, dels, tabs);
  }

  static _main(nimg, w, h, dels, tabs) {
    if(tabs == null) tabs = {};
    const { crc } = crcLib;
    let offset = 8;
    const anim = nimg.frames.length > 1;
    let pltAlpha = false;

    let cicc;

    let leng = 8 + (16 + 5 + 4) /* + (9+4) */ + (anim ? 20 : 0);
    if(tabs.sRGB != null) leng += 8 + 1 + 4;
    if(tabs.pHYs != null) leng += 8 + 9 + 4;
    if(tabs.iCCP != null) {
      cicc = pako.deflate(tabs.iCCP, {
        /*
         * //compression level 0-9
         * #define Z_NO_COMPRESSION         0
         * #define Z_BEST_SPEED             1
         * #define Z_BEST_COMPRESSION       9
         */
        level: 9,
        /*
         * The windowBits parameter is the base two logarithm of the window
         * size (the size of the history buffer). It should be in the range
         * 8..15 for this version of the library. Larger values of this
         * parameter result in better compression at the expense of memory
         * usage. The default value is 15 if deflateInit is used instead.
         * windowBits can also be –8..–15 for raw deflate. In this case,
         * -windowBits determines the window size. deflate() will then
         * generate raw deflate data with no zlib header or trailer, and
         * will not compute an adler32 check value.
         */
        windowBits: 15,
        /*
         * - chunk size used for deflating data chunks, this should be power
         * of 2 and must not be less than 256 and more than 64*1024
         */
        chunkSize: 32 * 1024,
        /*
         * var Z_FILTERED            = 1;
         * var Z_HUFFMAN_ONLY        = 2;
         * var Z_RLE                 = 3;
         * var Z_FIXED               = 4;
         * var Z_DEFAULT_STRATEGY    = 0;
         * The strategy parameter is used to tune the compression algorithm.
         * Use the value Z_DEFAULT_STRATEGY for normal data, Z_FILTERED for
         * data produced by a filter (or predictor), Z_HUFFMAN_ONLY to force
         * Huffman encoding only (no string match), or Z_RLE to limit match
         * distances to one (run-length encoding). Filtered data consists
         * mostly of small values with a somewhat random distribution. In
         * this case, the compression algorithm is tuned to compress them
         * better. The effect of Z_FILTERED is to force more Huffman coding
         * and less string matching; it is somewhat intermediate between
         * Z_DEFAULT_STRATEGY and Z_HUFFMAN_ONLY. Z_RLE is designed to be
         * almost as fast as Z_HUFFMAN_ONLY, but give better compression for
         * PNG image data. The strategy parameter only affects the
         * compression ratio but not the correctness of the compressed
         * output even if it is not set appropriately. Z_FIXED prevents the
         * use of dynamic Huffman codes, allowing for a simpler decoder for
         * special applications.
         */
        strategy: 1,
        memLevel: 9,
      });
      leng += 8 + 11 + 2 + cicc.length + 4;
    }
    if(nimg.ctype == 3) {
      const dl = nimg.plte.length;
      for (let i = 0; i < dl; i++)
        if(nimg.plte[i] >>> 24 != 255) pltAlpha = true;
      leng += 8 + dl * 3 + 4 + (pltAlpha ? 8 + dl * 1 + 4 : 0);
    }
    for (let j = 0; j < nimg.frames.length; j++) {
      const fr = nimg.frames[j];
      if(anim) leng += 38;
      leng += fr.cimg.length + 12;
      if(j != 0) leng += 4;
    }
    leng += 12;

    const data = new Uint8Array(leng);
    const wr = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    for (let i = 0; i < 8; i++) data[i] = wr[i];

    writeUint(data, offset, 13);
    offset += 4;
    writeASCII(data, offset, "IHDR");
    offset += 4;
    writeUint(data, offset, w);
    offset += 4;
    writeUint(data, offset, h);
    offset += 4;
    data[offset] = nimg.depth;
    offset++; // depth
    data[offset] = nimg.ctype;
    offset++; // ctype
    data[offset] = 0;
    offset++; // compress
    data[offset] = 0;
    offset++; // filter
    data[offset] = 0;
    offset++; // interlace
    writeUint(data, offset, crc(data, offset - 17, 17));
    offset += 4; // crc

    // 13 bytes to say, that it is sRGB
    if(tabs.sRGB != null) {
      writeUint(data, offset, 1);
      offset += 4;
      writeASCII(data, offset, "sRGB");
      offset += 4;
      data[offset] = tabs.sRGB;
      offset++;
      writeUint(data, offset, crc(data, offset - 5, 5));
      offset += 4; // crc
    }
    if(tabs.iCCP != null) {
      const sl = 11 + 2 + cicc.length;
      writeUint(data, offset, sl);
      offset += 4;
      writeASCII(data, offset, "iCCP");
      offset += 4;
      writeASCII(data, offset, "ICC profile");
      offset += 11;
      offset += 2;
      data.set(cicc, offset);
      offset += cicc.length;
      writeUint(data, offset, crc(data, offset - (sl + 4), sl + 4));
      offset += 4; // crc
    }
    if(tabs.pHYs != null) {
      writeUint(data, offset, 9);
      offset += 4;
      writeASCII(data, offset, "pHYs");
      offset += 4;
      writeUint(data, offset, tabs.pHYs[0]);
      offset += 4;
      writeUint(data, offset, tabs.pHYs[1]);
      offset += 4;
      data[offset] = tabs.pHYs[2];
      offset++;
      writeUint(data, offset, crc(data, offset - 13, 13));
      offset += 4; // crc
    }

    if(anim) {
      writeUint(data, offset, 8);
      offset += 4;
      writeASCII(data, offset, "acTL");
      offset += 4;
      writeUint(data, offset, nimg.frames.length);
      offset += 4;
      writeUint(data, offset, tabs.loop != null ? tabs.loop : 0);
      offset += 4;
      writeUint(data, offset, crc(data, offset - 12, 12));
      offset += 4; // crc
    }

    if(nimg.ctype == 3) {
      const dl = nimg.plte.length;
      writeUint(data, offset, dl * 3);
      offset += 4;
      writeASCII(data, offset, "PLTE");
      offset += 4;
      for (let i = 0; i < dl; i++) {
        const ti = i * 3;
        const c = nimg.plte[i];
        const r = c & 255;
        const g = (c >>> 8) & 255;
        const b = (c >>> 16) & 255;
        data[offset + ti + 0] = r;
        data[offset + ti + 1] = g;
        data[offset + ti + 2] = b;
      }
      offset += dl * 3;
      writeUint(data, offset, crc(data, offset - dl * 3 - 4, dl * 3 + 4));
      offset += 4; // crc

      if(pltAlpha) {
        writeUint(data, offset, dl);
        offset += 4;
        writeASCII(data, offset, "tRNS");
        offset += 4;
        for (let i = 0; i < dl; i++)
          data[offset + i] = (nimg.plte[i] >>> 24) & 255;
        offset += dl;
        writeUint(data, offset, crc(data, offset - dl - 4, dl + 4));
        offset += 4; // crc
      }
    }

    let fi = 0;
    for (let j = 0; j < nimg.frames.length; j++) {
      const fr = nimg.frames[j];
      if(anim) {
        writeUint(data, offset, 26);
        offset += 4;
        writeASCII(data, offset, "fcTL");
        offset += 4;
        writeUint(data, offset, fi++);
        offset += 4;
        writeUint(data, offset, fr.rect.width);
        offset += 4;
        writeUint(data, offset, fr.rect.height);
        offset += 4;
        writeUint(data, offset, fr.rect.x);
        offset += 4;
        writeUint(data, offset, fr.rect.y);
        offset += 4;
        writeUshort(data, offset, dels[j]);
        offset += 2;
        writeUshort(data, offset, 1000);
        offset += 2;
        data[offset] = fr.dispose;
        offset++; // dispose
        data[offset] = fr.blend;
        offset++; // blend
        writeUint(data, offset, crc(data, offset - 30, 30));
        offset += 4; // crc
      }

      const imgd = fr.cimg;
      const dl = imgd.length;
      writeUint(data, offset, dl + (j == 0 ? 0 : 4));
      offset += 4;
      const ioff = offset;
      writeASCII(data, offset, j == 0 ? "IDAT" : "fdAT");
      offset += 4;
      if(j != 0) {
        writeUint(data, offset, fi++);
        offset += 4;
      }
      data.set(imgd, offset);
      offset += dl;
      writeUint(data, offset, crc(data, ioff, offset - ioff));
      offset += 4; // crc
    }

    writeUint(data, offset, 0);
    offset += 4;
    writeASCII(data, offset, "IEND");
    offset += 4;
    writeUint(data, offset, crc(data, offset - 4, 4));
    offset += 4; // crc

    return data.buffer;
  }

  static compressPNG(out, filter, levelZero) {
    for (let i = 0; i < out.frames.length; i++) {
      const frm = out.frames[i];
      const nh = frm.rect.height;
      const fdata = new Uint8Array(nh * frm.bpl + nh);
      frm.cimg = UPNG._filterZero(
        frm.img,
        nh,
        frm.bpp,
        frm.bpl,
        fdata,
        filter,
        levelZero
      );
    }
  }

  static compress(
    bufs,
    w,
    h,
    ps,
    prms // prms:  onlyBlend, minBits, forbidPlte
  ) {
    // var time = Date.now();
    const onlyBlend = prms[0];
    const evenCrd = prms[1];
    const forbidPrev = prms[2];
    const minBits = prms[3];
    const forbidPlte = prms[4];
    const dith = prms[5];

    let ctype = 6;
    let depth = 8;
    let alphaAnd = 255;

    for (let j = 0; j < bufs.length; j++) {
      // when not quantized, other frames can contain colors, that are not in an initial frame
      const img = new Uint8Array(bufs[j]);
      const ilen = img.length;
      for (let i = 0; i < ilen; i += 4) alphaAnd &= img[i + 3];
    }
    const gotAlpha = alphaAnd != 255;

    // console.log("alpha check", Date.now()-time);  time = Date.now();

    // var brute = gotAlpha && forGIF;		// brute : frames can only be copied, not "blended"
    const frms = UPNG.framize(bufs, w, h, onlyBlend, evenCrd, forbidPrev);
    // console.log("framize", Date.now()-time);  time = Date.now();

    const cmap = {};
    const plte = [];
    const inds = [];

    if(ps != 0) {
      const nbufs = [];
      for (let i = 0; i < frms.length; i++) nbufs.push(frms[i].img.buffer);

      const abuf = UPNG.concatRGBA(nbufs);
      const qres = UPNG.quantize(abuf, ps);

      for (let i = 0; i < qres.plte.length; i++)
        plte.push(qres.plte[i].est.rgba);

      let cof = 0;
      for (let i = 0; i < frms.length; i++) {
        const frm = frms[i];
        const bln = frm.img.length;
        const ind = new Uint8Array(qres.inds.buffer, cof >> 2, bln >> 2);
        inds.push(ind);
        const bb = new Uint8Array(qres.abuf, cof, bln);

        // console.log(frm.img, frm.width, frm.height);
        // var time = Date.now();
        if(dith)
          UPNG.dither(frm.img, frm.rect.width, frm.rect.height, plte, bb, ind);
        // console.log(Date.now()-time);
        frm.img.set(bb);
        cof += bln;
      }

      // console.log("quantize", Date.now()-time);  time = Date.now();
    } else {
      // what if ps==0, but there are <=256 colors?  we still need to detect, if the palette could be used
      for (let j = 0; j < frms.length; j++) {
        // when not quantized, other frames can contain colors, that are not in an initial frame
        const frm = frms[j];
        const img32 = new Uint32Array(frm.img.buffer);
        const nw = frm.rect.width;
        const ilen = img32.length;
        const ind = new Uint8Array(ilen);
        inds.push(ind);
        for (let i = 0; i < ilen; i++) {
          const c = img32[i];
          if(i != 0 && c == img32[i - 1]) ind[i] = ind[i - 1];
          else if(i > nw && c == img32[i - nw]) ind[i] = ind[i - nw];
          else {
            let cmc = cmap[c];
            if(cmc == null) {
              cmap[c] = cmc = plte.length;
              plte.push(c);
              if(plte.length >= 300) break;
            }
            ind[i] = cmc;
          }
        }
      }
      // console.log("make palette", Date.now()-time);  time = Date.now();
    }

    const cc = plte.length; // console.log("colors:",cc);
    if(cc <= 256 && forbidPlte == false) {
      if(cc <= 2) depth = 1;
      else if(cc <= 4) depth = 2;
      else if(cc <= 16) depth = 4;
      else depth = 8;
      depth = Math.max(depth, minBits);
    }

    for (let j = 0; j < frms.length; j++) {
      const frm = frms[j];
      const nw = frm.rect.width;
      const nh = frm.rect.height;
      let cimg = frm.img;
      let bpl = 4 * nw;
      let bpp = 4;
      if(cc <= 256 && forbidPlte == false) {
        bpl = Math.ceil((depth * nw) / 8);
        const nimg = new Uint8Array(bpl * nh);
        const inj = inds[j];
        for (let y = 0; y < nh; y++) {
          const i = y * bpl;
          const ii = y * nw;
          if(depth == 8)
            for (let x = 0; x < nw; x++) nimg[i + x] = inj[ii + x];
          else if(depth == 4)
            for (let x = 0; x < nw; x++)
              nimg[i + (x >> 1)] |= inj[ii + x] << (4 - (x & 1) * 4);
          else if(depth == 2)
            for (let x = 0; x < nw; x++)
              nimg[i + (x >> 2)] |= inj[ii + x] << (6 - (x & 3) * 2);
          else if(depth == 1)
            for (let x = 0; x < nw; x++)
              nimg[i + (x >> 3)] |= inj[ii + x] << (7 - (x & 7) * 1);
        }
        cimg = nimg;
        ctype = 3;
        bpp = 1;
      } else if(gotAlpha == false && frms.length == 1) {
        // some next "reduced" frames may contain alpha for blending
        const nimg = new Uint8Array(nw * nh * 3);
        const area = nw * nh;
        for (let i = 0; i < area; i++) {
          const ti = i * 3;
          const qi = i * 4;
          nimg[ti] = cimg[qi];
          nimg[ti + 1] = cimg[qi + 1];
          nimg[ti + 2] = cimg[qi + 2];
        }
        cimg = nimg;
        ctype = 2;
        bpp = 3;
        bpl = 3 * nw;
      }
      frm.img = cimg;
      frm.bpl = bpl;
      frm.bpp = bpp;
    }
    // console.log("colors => palette indices", Date.now()-time);  time = Date.now();

    return { ctype, depth, plte, frames: frms };
  }

  static framize(bufs, w, h, alwaysBlend, evenCrd, forbidPrev) {
    /*  DISPOSE
      - 0 : no change
      - 1 : clear to transparent
      - 2 : retstore to content before rendering (previous frame disposed)
      BLEND
      - 0 : replace
      - 1 : blend
    */
    const frms = [];
    for (let j = 0; j < bufs.length; j++) {
      const cimg = new Uint8Array(bufs[j]);
      const cimg32 = new Uint32Array(cimg.buffer);
      let nimg;

      let nx = 0;
      let ny = 0;
      let nw = w;
      let nh = h;
      let blend = alwaysBlend ? 1 : 0;
      if(j != 0) {
        const tlim =
          forbidPrev || alwaysBlend || j == 1 || frms[j - 2].dispose != 0
            ? 1
            : 2;
        let tstp = 0;
        let tarea = 1e9;
        for (let it = 0; it < tlim; it++) {
          const p32 = new Uint32Array(bufs[j - 1 - it]);
          let mix = w;
          let miy = h;
          let max = -1;
          let may = -1;
          for (let y = 0; y < h; y++)
            for (let x = 0; x < w; x++) {
              const i = y * w + x;
              if(cimg32[i] != p32[i]) {
                if(x < mix) mix = x;
                if(x > max) max = x;
                if(y < miy) miy = y;
                if(y > may) may = y;
              }
            }
          if(max == -1) mix = miy = max = may = 0;
          if(evenCrd) {
            if((mix & 1) == 1) mix--;
            if((miy & 1) == 1) miy--;
          }
          const sarea = (max - mix + 1) * (may - miy + 1);
          if(sarea < tarea) {
            tarea = sarea;
            tstp = it;
            nx = mix;
            ny = miy;
            nw = max - mix + 1;
            nh = may - miy + 1;
          }
        }

        // alwaysBlend: pokud zjistím, že blendit nelze, nastavím předchozímu snímku dispose=1. Zajistím, aby obsahoval můj obdélník.
        const pimg = new Uint8Array(bufs[j - 1 - tstp]);
        if(tstp == 1) frms[j - 1].dispose = 2;

        nimg = new Uint8Array(nw * nh * 4);
        UPNG._copyTile(pimg, w, h, nimg, nw, nh, -nx, -ny, 0);

        blend = UPNG._copyTile(cimg, w, h, nimg, nw, nh, -nx, -ny, 3) ? 1 : 0;
        if(blend == 1)
          UPNG._prepareDiff(cimg, w, h, nimg, {
            x: nx,
            y: ny,
            width: nw,
            height: nh,
          });
        else UPNG._copyTile(cimg, w, h, nimg, nw, nh, -nx, -ny, 0);
      } else nimg = cimg.slice(0); // img may be rewritten further ... don't rewrite input

      frms.push({
        rect: { x: nx, y: ny, width: nw, height: nh },
        img: nimg,
        blend,
        dispose: 0,
      });
    }

    if(alwaysBlend) {
      for (let j = 0; j < frms.length; j++) {
        const frm = frms[j];
        if(frm.blend == 1) continue;
        const r0 = frm.rect;
        const r1 = frms[j - 1].rect;
        const miX = Math.min(r0.x, r1.x);
        const miY = Math.min(r0.y, r1.y);
        const maX = Math.max(r0.x + r0.width, r1.x + r1.width);
        const maY = Math.max(r0.y + r0.height, r1.y + r1.height);
        const r = { x: miX, y: miY, width: maX - miX, height: maY - miY };

        frms[j - 1].dispose = 1;
        if(j - 1 != 0) UPNG._updateFrame(bufs, w, h, frms, j - 1, r, evenCrd);
        UPNG._updateFrame(bufs, w, h, frms, j, r, evenCrd);
      }
    }
    return frms;
  }

  static _updateFrame(bufs, w, h, frms, i, r, evenCrd) {
    const U8 = Uint8Array;
    const U32 = Uint32Array;
    const pimg = new U8(bufs[i - 1]);
    const pimg32 = new U32(bufs[i - 1]);
    const nimg = i + 1 < bufs.length ? new U8(bufs[i + 1]) : null;
    const cimg = new U8(bufs[i]);
    const cimg32 = new U32(cimg.buffer);

    let mix = w;
    let miy = h;
    let max = -1;
    let may = -1;
    for (let y = 0; y < r.height; y++)
      for (let x = 0; x < r.width; x++) {
        const cx = r.x + x;
        const cy = r.y + y;
        const j = cy * w + cx;
        const cc = cimg32[j];
        // no need to draw transparency, or to dispose it. Or, if writing the same color and the next one does not need transparency.
        if(
          cc == 0 ||
          (frms[i - 1].dispose == 0 &&
            pimg32[j] == cc &&
            (nimg == null || nimg[j * 4 + 3] != 0)) /**/
        ) {
          // noop
        } else {
          if(cx < mix) mix = cx;
          if(cx > max) max = cx;
          if(cy < miy) miy = cy;
          if(cy > may) may = cy;
        }
      }
    if(max == -1) mix = miy = max = may = 0;
    if(evenCrd) {
      if((mix & 1) == 1) mix--;
      if((miy & 1) == 1) miy--;
    }
    r = { x: mix, y: miy, width: max - mix + 1, height: may - miy + 1 };

    const fr = frms[i];
    fr.rect = r;
    fr.blend = 1;
    fr.img = new Uint8Array(r.width * r.height * 4);
    if(frms[i - 1].dispose == 0) {
      UPNG._copyTile(pimg, w, h, fr.img, r.width, r.height, -r.x, -r.y, 0);
      UPNG._prepareDiff(cimg, w, h, fr.img, r);
    } else UPNG._copyTile(cimg, w, h, fr.img, r.width, r.height, -r.x, -r.y, 0);
  }

  static _prepareDiff(cimg, w, h, nimg, rec) {
    UPNG._copyTile(cimg, w, h, nimg, rec.width, rec.height, -rec.x, -rec.y, 2);
  }

  static _filterZero(img, h, bpp, bpl, data, filter, levelZero) {
    const fls = [];
    let ftry = [0, 1, 2, 3, 4];
    if(filter != -1) ftry = [filter];
    else if(h * bpl > 500000 || bpp == 1) ftry = [0];
    let opts = {};
    if(levelZero) opts = { level: 0 };

    for (let i = 0; i < ftry.length; i++) {
      for (let y = 0; y < h; y++)
        UPNG._filterLine(data, img, y, bpl, bpp, ftry[i]);
      fls.push(pako.deflate(data, opts));
    }

    let ti;
    let tsize = 1e9;
    for (let i = 0; i < fls.length; i++)
      if(fls[i].length < tsize) {
        ti = i;
        tsize = fls[i].length;
      }
    return fls[ti];
  }

  static _filterLine(data, img, y, bpl, bpp, type) {
    const i = y * bpl;
    let di = i + y;
    data[di] = type;
    di++;

    if(type == 0) {
      if(bpl < 500) for (let x = 0; x < bpl; x++) data[di + x] = img[i + x];
      else data.set(new Uint8Array(img.buffer, i, bpl), di);
    } else if(type == 1) {
      for (let x = 0; x < bpp; x++) data[di + x] = img[i + x];
      for (let x = bpp; x < bpl; x++)
        data[di + x] = (img[i + x] - img[i + x - bpp] + 256) & 255;
    } else if(y == 0) {
      for (let x = 0; x < bpp; x++) data[di + x] = img[i + x];

      if(type == 2) for (let x = bpp; x < bpl; x++) data[di + x] = img[i + x];
      if(type == 3)
        for (let x = bpp; x < bpl; x++)
          data[di + x] = (img[i + x] - (img[i + x - bpp] >> 1) + 256) & 255;
      if(type == 4)
        for (let x = bpp; x < bpl; x++)
          data[di + x] =
            (img[i + x] - UPNG.paeth(img[i + x - bpp], 0, 0) + 256) & 255;
    } else {
      if(type == 2) {
        for (let x = 0; x < bpl; x++)
          data[di + x] = (img[i + x] + 256 - img[i + x - bpl]) & 255;
      }
      if(type == 3) {
        for (let x = 0; x < bpp; x++)
          data[di + x] = (img[i + x] + 256 - (img[i + x - bpl] >> 1)) & 255;
        for (let x = bpp; x < bpl; x++)
          data[di + x] =
            (img[i + x] + 256 - ((img[i + x - bpl] + img[i + x - bpp]) >> 1)) &
            255;
      }
      if(type == 4) {
        for (let x = 0; x < bpp; x++)
          data[di + x] =
            (img[i + x] + 256 - UPNG.paeth(0, img[i + x - bpl], 0)) & 255;
        for (let x = bpp; x < bpl; x++)
          data[di + x] =
            (img[i + x] +
              256 -
              UPNG.paeth(
                img[i + x - bpp],
                img[i + x - bpl],
                img[i + x - bpp - bpl]
              )) &
            255;
      }
    }
  }

  static quantize(abuf, ps) {
    const sb = new Uint8Array(abuf);
    const tb = sb.slice(0);
    const tb32 = new Uint32Array(tb.buffer);

    const KD = UPNG.getKDtree(tb, ps);
    const root = KD[0];
    const leafs = KD[1];

    const len = sb.length;

    const inds = new Uint8Array(len >> 2);
    let nd;
    if(sb.length < 20e6)
      // precise, but slow :(
      for (let i = 0; i < len; i += 4) {
        const r = sb[i] * (1 / 255);
        const g = sb[i + 1] * (1 / 255);
        const b = sb[i + 2] * (1 / 255);
        const a = sb[i + 3] * (1 / 255);

        nd = UPNG.getNearest(root, r, g, b, a);
        inds[i >> 2] = nd.ind;
        tb32[i >> 2] = nd.est.rgba;
      }
    else
      for (let i = 0; i < len; i += 4) {
        const r = sb[i] * (1 / 255);
        const g = sb[i + 1] * (1 / 255);
        const b = sb[i + 2] * (1 / 255);
        const a = sb[i + 3] * (1 / 255);

        nd = root;
        while (nd.left)
          nd = UPNG.planeDst(nd.est, r, g, b, a) <= 0 ? nd.left : nd.right;
        inds[i >> 2] = nd.ind;
        tb32[i >> 2] = nd.est.rgba;
      }
    return { abuf: tb.buffer, inds, plte: leafs };
  }

  static getKDtree(nimg, ps, err) {
    if(err == null) err = 0.0001;
    const nimg32 = new Uint32Array(nimg.buffer);

    const root = {
      i0: 0,
      i1: nimg.length,
      bst: null,
      est: null,
      tdst: 0,
      left: null,
      right: null,
    }; // basic statistic, extra statistic
    root.bst = UPNG.stats(nimg, root.i0, root.i1);
    root.est = UPNG.estats(root.bst);
    const leafs = [root];

    while (leafs.length < ps) {
      let maxL = 0;
      let mi = 0;
      for (let i = 0; i < leafs.length; i++)
        if(leafs[i].est.L > maxL) {
          maxL = leafs[i].est.L;
          mi = i;
        }
      if(maxL < err) break;
      const node = leafs[mi];

      const s0 = UPNG.splitPixels(
        nimg,
        nimg32,
        node.i0,
        node.i1,
        node.est.e,
        node.est.eMq255
      );
      const s0wrong = node.i0 >= s0 || node.i1 <= s0;
      // console.log(maxL, leafs.length, mi);
      if(s0wrong) {
        node.est.L = 0;
        continue;
      }

      const ln = {
        i0: node.i0,
        i1: s0,
        bst: null,
        est: null,
        tdst: 0,
        left: null,
        right: null,
      };
      ln.bst = UPNG.stats(nimg, ln.i0, ln.i1);
      ln.est = UPNG.estats(ln.bst);
      const rn = {
        i0: s0,
        i1: node.i1,
        bst: null,
        est: null,
        tdst: 0,
        left: null,
        right: null,
      };
      rn.bst = { R: [], m: [], N: node.bst.N - ln.bst.N };
      for (let i = 0; i < 16; i++) rn.bst.R[i] = node.bst.R[i] - ln.bst.R[i];
      for (let i = 0; i < 4; i++) rn.bst.m[i] = node.bst.m[i] - ln.bst.m[i];
      rn.est = UPNG.estats(rn.bst);

      node.left = ln;
      node.right = rn;
      leafs[mi] = ln;
      leafs.push(rn);
    }
    leafs.sort((a, b) => b.bst.N - a.bst.N);
    for (let i = 0; i < leafs.length; i++) leafs[i].ind = i;
    return [root, leafs];
  }

  static getNearest(nd, r, g, b, a) {
    if(nd.left == null) {
      nd.tdst = UPNG.dist(nd.est.q, r, g, b, a);
      return nd;
    }
    const pd = UPNG.planeDst(nd.est, r, g, b, a);

    let node0 = nd.left;
    let node1 = nd.right;
    if(pd > 0) {
      node0 = nd.right;
      node1 = nd.left;
    }

    const ln = UPNG.getNearest(node0, r, g, b, a);
    if(ln.tdst <= pd * pd) return ln;
    const rn = UPNG.getNearest(node1, r, g, b, a);
    return rn.tdst < ln.tdst ? rn : ln;
  }

  static planeDst(est, r, g, b, a) {
    const { e } = est;
    return e[0] * r + e[1] * g + e[2] * b + e[3] * a - est.eMq;
  }

  static dist(q, r, g, b, a) {
    const d0 = r - q[0];
    const d1 = g - q[1];
    const d2 = b - q[2];
    const d3 = a - q[3];
    return d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3;
  }

  static splitPixels(nimg, nimg32, i0, i1, e, eMq) {
    i1 -= 4;
    while (i0 < i1) {
      while (UPNG.vecDot(nimg, i0, e) <= eMq) i0 += 4;
      while (UPNG.vecDot(nimg, i1, e) > eMq) i1 -= 4;
      if(i0 >= i1) break;

      const t = nimg32[i0 >> 2];
      nimg32[i0 >> 2] = nimg32[i1 >> 2];
      nimg32[i1 >> 2] = t;

      i0 += 4;
      i1 -= 4;
    }
    while (UPNG.vecDot(nimg, i0, e) > eMq) i0 -= 4;
    return i0 + 4;
  }

  static vecDot(nimg, i, e) {
    return (
      nimg[i] * e[0] +
      nimg[i + 1] * e[1] +
      nimg[i + 2] * e[2] +
      nimg[i + 3] * e[3]
    );
  }

  static stats(nimg, i0, i1) {
    const R = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const m = [0, 0, 0, 0];
    const N = (i1 - i0) >> 2;
    for (let i = i0; i < i1; i += 4) {
      const r = nimg[i] * (1 / 255);
      const g = nimg[i + 1] * (1 / 255);
      const b = nimg[i + 2] * (1 / 255);
      const a = nimg[i + 3] * (1 / 255);
      // var r = nimg[i], g = nimg[i+1], b = nimg[i+2], a = nimg[i+3];
      m[0] += r;
      m[1] += g;
      m[2] += b;
      m[3] += a;

      R[0] += r * r;
      R[1] += r * g;
      R[2] += r * b;
      R[3] += r * a;
      R[5] += g * g;
      R[6] += g * b;
      R[7] += g * a;
      R[10] += b * b;
      R[11] += b * a;
      R[15] += a * a;
    }
    R[4] = R[1];
    R[8] = R[2];
    R[9] = R[6];
    R[12] = R[3];
    R[13] = R[7];
    R[14] = R[11];

    return { R, m, N };
  }

  static estats(stats) {
    const { R } = stats;
    const { m } = stats;
    const { N } = stats;

    // when all samples are equal, but N is large (millions), the Rj can be non-zero ( 0.0003.... - precission error)
    const m0 = m[0];
    const m1 = m[1];
    const m2 = m[2];
    const m3 = m[3];
    const iN = N == 0 ? 0 : 1 / N;
    const Rj = [
      R[0] - m0 * m0 * iN,
      R[1] - m0 * m1 * iN,
      R[2] - m0 * m2 * iN,
      R[3] - m0 * m3 * iN,
      R[4] - m1 * m0 * iN,
      R[5] - m1 * m1 * iN,
      R[6] - m1 * m2 * iN,
      R[7] - m1 * m3 * iN,
      R[8] - m2 * m0 * iN,
      R[9] - m2 * m1 * iN,
      R[10] - m2 * m2 * iN,
      R[11] - m2 * m3 * iN,
      R[12] - m3 * m0 * iN,
      R[13] - m3 * m1 * iN,
      R[14] - m3 * m2 * iN,
      R[15] - m3 * m3 * iN,
    ];

    const A = Rj;
    const M = M4;
    let b = [Math.random(), Math.random(), Math.random(), Math.random()];
    let mi = 0;
    let tmi = 0;

    if(N != 0)
      for (let i = 0; i < 16; i++) {
        b = M.multVec(A, b);
        tmi = Math.sqrt(M.dot(b, b));
        b = M.sml(1 / tmi, b);
        if(i != 0 && Math.abs(tmi - mi) < 1e-9) break;
        mi = tmi;
      }
    // b = [0,0,1,0];  mi=N;
    const q = [m0 * iN, m1 * iN, m2 * iN, m3 * iN];
    const eMq255 = M.dot(M.sml(255, q), b);

    return {
      Cov: Rj,
      q,
      e: b,
      L: mi,
      eMq255,
      eMq: M.dot(b, q),
      rgba:
        ((Math.round(255 * q[3]) << 24) |
          (Math.round(255 * q[2]) << 16) |
          (Math.round(255 * q[1]) << 8) |
          (Math.round(255 * q[0]) << 0)) >>>
        0,
    };
  }

  static concatRGBA(bufs) {
    let tlen = 0;
    for (let i = 0; i < bufs.length; i++) tlen += bufs[i].byteLength;
    const nimg = new Uint8Array(tlen);
    let noff = 0;
    for (let i = 0; i < bufs.length; i++) {
      const img = new Uint8Array(bufs[i]);
      const il = img.length;
      for (let j = 0; j < il; j += 4) {
        let r = img[j];
        let g = img[j + 1];
        let b = img[j + 2];
        const a = img[j + 3];
        if(a === 0) r = g = b = 0;
        nimg[noff + j] = r;
        nimg[noff + j + 1] = g;
        nimg[noff + j + 2] = b;
        nimg[noff + j + 3] = a;
      }
      noff += il;
    }
    return nimg.buffer;
  }
}
