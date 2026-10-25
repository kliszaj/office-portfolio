// Lossless meshopt encoding: preserve geometry, materials, hierarchy and UVs.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const manifest = {};
for (const name of ['mx-master-3s', 'aeron', 'gmmk-pro', 'terra', 'ergotron-lx', 'key-light']) {
  const source = await readFile(`public/models/${name}.glb`);
  const doc = await io.readBinary(source);
  doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
  // No quantize transform is applied: float attributes retain their original precision.
  const bytes = await io.writeBinary(doc);
  const filename = `${name}.${createHash('sha256').update(bytes).digest('hex').slice(0,12)}.glb`;
  await writeFile(`public/models/optimized/${filename}`, bytes);
  manifest[name] = `/models/optimized/${filename}`;
  console.log(`${name}: ${source.length} → ${bytes.length}`);
}
await writeFile('lib/workspace/model-assets.json', JSON.stringify(manifest, null, 2) + '\n');
