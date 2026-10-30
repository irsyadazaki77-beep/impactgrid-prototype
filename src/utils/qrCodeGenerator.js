/**
 * Lightweight, zero-dependency QR Code Generator in pure JavaScript.
 * Generates an SVG string or matrix for URLs and text (Byte mode, ECC L).
 */

// Galois Field GF(256) math
const EXP_TABLE = new Uint8Array(512);
const LOG_TABLE = new Uint8Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP_TABLE[i] = x;
    EXP_TABLE[i + 255] = x;
    LOG_TABLE[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
})();

function gmult(a, b) {
  if (a === 0 || b === 0) return 0;
  return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
}

function getRsGeneratorPoly(ecLength) {
  let poly = [1];
  for (let i = 0; i < ecLength; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gmult(poly[j], EXP_TABLE[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly;
}

function calculateRsEcc(data, ecLength) {
  const genPoly = getRsGeneratorPoly(ecLength);
  const remainder = new Array(ecLength).fill(0);

  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    if (factor !== 0) {
      for (let j = 0; j < ecLength; j++) {
        remainder[j] ^= gmult(genPoly[j], factor);
      }
    }
  }
  return remainder;
}

// QR Version table for Byte Mode, ECC L
// Version 1: 21x21 (19 bytes data, 7 bytes ec)
// Version 2: 25x25 (34 bytes data, 10 bytes ec)
// Version 3: 29x29 (55 bytes data, 15 bytes ec)
// Version 4: 33x33 (80 bytes data, 20 bytes ec)
// Version 5: 37x37 (108 bytes data, 26 bytes ec)
const QR_VERSIONS = [
  { version: 1, size: 21, totalData: 19, ecLen: 7, alignPos: [] },
  { version: 2, size: 25, totalData: 34, ecLen: 10, alignPos: [6, 18] },
  { version: 3, size: 29, totalData: 55, ecLen: 15, alignPos: [6, 22] },
  { version: 4, size: 33, totalData: 80, ecLen: 20, alignPos: [6, 26] },
  { version: 5, size: 37, totalData: 108, ecLen: 26, alignPos: [6, 30] }
];

export function generateQrMatrix(text) {
  const utf8 = new TextEncoder().encode(text);
  const dataLen = utf8.length;

  // Pick smallest fitting version
  let targetVer = QR_VERSIONS.find(v => v.totalData >= dataLen + 3);
  if (!targetVer) {
    targetVer = QR_VERSIONS[QR_VERSIONS.length - 1]; // fallback to max
  }

  const { size, totalData, ecLen, alignPos } = targetVer;

  // 1. Bitstream encoding: Byte mode (0100) + Character Count (8 bits for Ver 1-9) + data
  const bitStream = [];
  function pushBits(val, len) {
    for (let i = len - 1; i >= 0; i--) {
      bitStream.push((val >> i) & 1);
    }
  }

  pushBits(0b0100, 4); // Byte mode indicator
  pushBits(dataLen, 8); // Character count indicator
  for (let i = 0; i < dataLen; i++) {
    pushBits(utf8[i], 8);
  }

  // Terminator (up to 4 zeroes)
  const maxBits = totalData * 8;
  const termLen = Math.min(4, maxBits - bitStream.length);
  pushBits(0, termLen);

  // Pad to multiple of 8
  while (bitStream.length % 8 !== 0) {
    bitStream.push(0);
  }

  // Pad bytes 0xEC, 0x11
  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (bitStream.length < maxBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bitstream to bytes
  const dataBytes = [];
  for (let i = 0; i < bitStream.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitStream[i + j];
    }
    dataBytes.push(b);
  }

  // Calculate Reed-Solomon ECC
  const ecBytes = calculateRsEcc(dataBytes, ecLen);
  const finalCodewords = dataBytes.concat(ecBytes);

  // 2. Initialize Matrix (size x size)
  // null = unset, 0 = white, 1 = black, -1 = reserved
  const matrix = Array.from({ length: size }, () => Array(size).fill(null));
  const isFunction = Array.from({ length: size }, () => Array(size).fill(false));

  function setFunctionModule(r, c, val) {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val;
      isFunction[r][c] = true;
    }
  }

  // Position detection patterns (7x7 at 3 corners)
  function placeFinder(top, left) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const pr = top + r;
        const pc = left + c;
        if (pr < 0 || pr >= size || pc < 0 || pc >= size) continue;
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            setFunctionModule(pr, pc, 1);
          } else {
            setFunctionModule(pr, pc, 0);
          }
        } else {
          setFunctionModule(pr, pc, 0); // Separator
        }
      }
    }
  }

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Alignment patterns
  if (alignPos.length > 0) {
    alignPos.forEach(r => {
      alignPos.forEach(c => {
        if (isFunction[r][c]) return;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2;
            const isCenter = dr === 0 && dc === 0;
            setFunctionModule(r + dr, c + dc, (isBorder || isCenter) ? 1 : 0);
          }
        }
      });
    });
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) setFunctionModule(6, i, i % 2 === 0 ? 1 : 0);
    if (!isFunction[i][6]) setFunctionModule(i, 6, i % 2 === 0 ? 1 : 0);
  }

  // Dark module
  setFunctionModule(size - 8, 8, 1);

  // Reserve format information area
  for (let i = 0; i < 9; i++) {
    if (!isFunction[8][i]) setFunctionModule(8, i, 0);
    if (!isFunction[i][8]) setFunctionModule(i, 8, 0);
  }
  for (let i = 0; i < 8; i++) {
    if (!isFunction[8][size - 1 - i]) setFunctionModule(8, size - 1 - i, 0);
    if (!isFunction[size - 1 - i][8]) setFunctionModule(size - 1 - i, 8, 0);
  }

  // 3. Place Data Bits in Matrix (interleaved upward/downward zig-zag)
  let bitIndex = 0;
  const totalCodewordBits = finalCodewords.length * 8;
  let upward = true;

  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Skip vertical timing pattern
    const rows = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);

    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (!isFunction[r][c]) {
          let bit = 0;
          if (bitIndex < totalCodewordBits) {
            const byteIdx = Math.floor(bitIndex / 8);
            const bShift = 7 - (bitIndex % 8);
            bit = (finalCodewords[byteIdx] >> bShift) & 1;
            bitIndex++;
          }
          // Mask 0: (row + col) % 2 === 0
          const mask = (r + c) % 2 === 0 ? 1 : 0;
          matrix[r][c] = bit ^ mask;
        }
      }
    }
    upward = !upward;
  }

  // 4. Format Info for ECC L, Mask 0: 0x77C4 (0b111011111000100)
  const formatInfo = 0x77C4;
  for (let i = 0; i < 15; i++) {
    const bit = (formatInfo >> i) & 1;
    // Around top-left
    if (i <= 5) matrix[8][i] = bit;
    else if (i === 6) matrix[8][7] = bit;
    else if (i === 7) matrix[8][8] = bit;
    else if (i === 8) matrix[7][8] = bit;
    else matrix[14 - i][8] = bit;

    // Around top-right and bottom-left
    if (i < 8) {
      matrix[size - 1 - i][8] = bit;
    } else {
      matrix[8][size - 15 + i] = bit;
    }
  }

  return matrix;
}

export function renderQrSvgString(text, sizePx = 220) {
  const matrix = generateQrMatrix(text);
  const modCount = matrix.length;
  const cellSize = 10;
  const padding = 20;
  const totalDim = modCount * cellSize + padding * 2;

  let rects = '';
  for (let r = 0; r < modCount; r++) {
    for (let c = 0; c < modCount; c++) {
      if (matrix[r][c] === 1) {
        rects += `<rect x="${padding + c * cellSize}" y="${padding + r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalDim} ${totalDim}" width="${sizePx}" height="${sizePx}" shape-rendering="crispEdges">
    <rect width="${totalDim}" height="${totalDim}" fill="#ffffff" rx="16" />
    ${rects}
  </svg>`;
}
