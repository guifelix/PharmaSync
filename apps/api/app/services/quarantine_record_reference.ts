import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import type { QuarantineRecord } from '@pharmasync/integration'

const quarantineRecordsPath = resolve(process.cwd(), 'storage', 'quarantine-records.ndjson')

export async function appendQuarantineRecords(records: readonly QuarantineRecord[]) {
  if (records.length === 0) {
    return
  }

  await mkdir(dirname(quarantineRecordsPath), { recursive: true })
  const lines = records.map((record) => JSON.stringify(record)).join('\n') + '\n'
  await writeFile(quarantineRecordsPath, lines, { flag: 'a' })
}

export async function loadQuarantineRecords(): Promise<QuarantineRecord[]> {
  try {
    const contents = await readFile(quarantineRecordsPath, 'utf8')
    return contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as QuarantineRecord)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }

    throw error
  }
}

export async function clearQuarantineRecords() {
  try {
    await unlink(quarantineRecordsPath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return
    }

    throw error
  }
}
