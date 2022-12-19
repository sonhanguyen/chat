import { generate } from 'zapatos/generate';
import { db } from '../knexfile'
import { exec } from 'child_process'
import { join } from 'path'

const outDir = __dirname

generate({
  db,
  outDir,
  schemas: {
    public: {
      include: [ 'User', 'Message' ],
      exclude: []
    }
  }
}).then(() => {
  const dir = join(outDir, 'zapatos')
  exec(`mv ${join(dir, 'schema.d.ts')} ${outDir} && rm -rf ${dir}`)
})