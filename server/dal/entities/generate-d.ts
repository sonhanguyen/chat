import { generate } from 'zapatos/generate';
import { connect } from '../knexfile'
import { exec } from 'child_process'
import { join } from 'path'

const outDir = __dirname

generate({
  outDir,
  db: connect.connection,
  schemas: {
    public: {
      include: [ 'User', 'Message' ],
      exclude: []
    }
  }
}).then(() => {
  const dir = join(outDir, 'zapatos')
  return exec(`mv ${join(dir, 'schema.d.ts')} ${outDir} && rm -rf ${dir}`)
})