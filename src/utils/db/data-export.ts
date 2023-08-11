import { db } from '.'
import { getCurrentDate, recordDataAction } from '..'

export type ExportProgress = {
  totalRows?: number
  completedRows: number
  done: boolean
}

export type ImportProgress = {
  totalRows?: number
  completedRows: number
  done: boolean
}

export async function exportDatabase(callback: (exportProgress: ExportProgress) => boolean) {
  const [pako, { saveAs }] = await Promise.all([import('pako'), import('file-saver'), import('dexie-export-import')])

  const blob = await db.export({
    progressCallback: ({ totalRows, completedRows, done }) => {
      return callback({ totalRows, completedRows, done })
    },
  })
  const [wordCount, chapterCount] = await Promise.all([db.wordRecords.count(), db.chapterRecords.count()])

  const json = await blob.text()
  const compressed = pako.gzip(json)
  const compressedBlob = new Blob([compressed])
  const currentDate = getCurrentDate()
  saveAs(compressedBlob, `User-Data-${currentDate}.gz`)
  recordDataAction({ type: 'export', size: compressedBlob.size, wordCount, chapterCount })
}

export async function importDatabase(onStart: () => void, callback: (importProgress: ImportProgress) => boolean) {
  const [pako] = await Promise.all([import('pako'), import('dexie-export-import')])

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/gzip'
  input.addEventListener('change', async () => {
    const file = input.files?.[0]
    if (!file) return

    onStart()

    const compressed = await file.arrayBuffer()
    const json = pako.ungzip(compressed, { to: 'string' })
    const blob = new Blob([json])

    await db.import(blob, {
      acceptVersionDiff: true,
      acceptMissingTables: true,
      acceptNameDiff: false,
      acceptChangedPrimaryKey: false,
      overwriteValues: true,
      clearTablesBeforeImport: true,
      progressCallback: ({ totalRows, completedRows, done }) => {
        return callback({ totalRows, completedRows, done })
      },
    })

    const [wordCount, chapterCount] = await Promise.all([db.wordRecords.count(), db.chapterRecords.count()])
    recordDataAction({ type: 'import', size: file.size, wordCount, chapterCount })
  })

  input.click()
}

export async function exportDatabase2UTools() {
  const [pako] = await Promise.all([import('pako'), import('dexie-export-import')])

  const blob = await db.export()

  const json = await blob.text()
  const compressed = pako.gzip(json)
  const compressedBlob = new Blob([compressed])
  const uint8Array = await blobToUint8Array(compressedBlob)

  await window.postUToolsUserData(uint8Array)
  return true
}
async function blobToUint8Array(blob) {
  const fileReader = new FileReader()
  const promise = new Promise((resolve, reject) => {
    fileReader.onload = () => {
      resolve(new Uint8Array(fileReader.result))
    }
    fileReader.onerror = () => {
      reject(new Error('Failed to read blob as Uint8Array'))
    }
  })
  fileReader.readAsArrayBuffer(blob)
  return await promise
}

export async function importDatabase2UTools() {
  const [pako] = await Promise.all([import('pako'), import('dexie-export-import')])

  const uint8Array = await window.getUToolsUserData()
  const json = pako.ungzip(uint8Array, { to: 'string' })
  const blob = new Blob([json])

  await db.import(blob, {
    acceptVersionDiff: true,
    acceptMissingTables: true,
    acceptNameDiff: false,
    acceptChangedPrimaryKey: false,
    overwriteValues: true,
    clearTablesBeforeImport: true,
  })
  return true
}

window.exportDatabase2UTools = exportDatabase2UTools
window.importDatabase2UTools = importDatabase2UTools
