// import * as XLSX from 'xlsx/dist/xlsx.full.min.js'
import * as XLSX from 'xlsx'

interface RowData {
  name: string
  trans: string[]
  usphone?: string
  ukphone?: string
  notation?: string
}

export function convertExcelToJson(file: File): Promise<RowData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const bufferArray = event.target?.result as ArrayBuffer
        const workbook = XLSX.read(bufferArray, { type: 'arraybuffer' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<RowData>(worksheet, { header: 1 })

        // Verify the header row
        const header = rows[0]
        const nameIndex = header.indexOf('name')
        const transIndex = header.indexOf('trans')
        const usphoneIndex = header.indexOf('usphone')
        const ukphoneIndex = header.indexOf('ukphone')
        const notationIndex = header.indexOf('notation')
        if (nameIndex === -1 || transIndex === -1) {
          reject(new Error('无效的词典标题'))
          return
        }

        const jsonData = rows.slice(1).map((row) => ({
          name: row[nameIndex],
          trans: [row[transIndex] || ''],
          ...(usphoneIndex !== -1 && { usphone: row[usphoneIndex] }),
          ...(ukphoneIndex !== -1 && { ukphone: row[ukphoneIndex] }),
          ...(notationIndex !== -1 && { notation: row[notationIndex] }),
        }))
        await heavyCalculation(1500)

        resolve(removeUndefinedOrNullValues(jsonData))
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}
function removeUndefinedOrNullValues<T extends Record<string, unknown>[]>(data: T): T {
  return data.filter((obj) => {
    for (const value of Object.values(obj)) {
      if (value === undefined || value === null) {
        return false
      }
    }
    return true
  })
}
function heavyCalculation(duration = 3000): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = Math.random()
      resolve(result)
    }, duration)
  })
}

// // Example usage
// async function handleFileDrop(files: FileList) {
//   const file = files[0];
//   const jsonData = await convertExcelToJson(file);
//   console.log(JSON.stringify(jsonData, null, 2));
// }
