// Stub for local face match service
async function localFaceMatch(img1, img2) {
  return { score: 0.95, passed: true, reason: 'stub' };
}

module.exports = { localFaceMatch };
