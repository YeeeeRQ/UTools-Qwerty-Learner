import Dexie from 'dexie'

interface IWord {
  name: string
  trans: string[]
  usphone?: string
  ukphone?: string
  notation?: string
}
interface DictInfo {
  id: string // 词典id
  name: string //词典名称
  language: string //词典类型
}
interface ErrorDictInfo {
  id: string // 词典id
  name: string // 错题本名称

  dictId: string // 对应的现有词典id
  createTime: number // 创建时间，可以使用Date.now()来获取当前时间的时间戳
  updateTime: number // 更新时间，可以使用Date.now()来获取当前时间的时间戳
}
interface ErrorWord {
  id?: number // 自增id，Dexie会自动为我们生成
  dictId: string // 现有词典id
  word: IWord // 错误的单词对象
  count: number // 错误次数
}

// 定义Dexie数据库
class TypingMistakeDB extends Dexie {
  // 定义词典信息表
  dicts!: Dexie.Table<DictInfo, string>
  // 定义错题本信息表
  errorDicts!: Dexie.Table<ErrorDictInfo, string>
  // 定义错题本单词表
  errorWords!: Dexie.Table<ErrorWord, number>

  constructor() {
    super('TypingMistakeDB')
    this.version(1).stores({
      dicts: 'id,name,language',
      errorDicts: 'id, name,dictId, createTime,updateTime',
      errorWords: '++id, dictId, word, count',
    })
  }
}

// 创建Dexie实例
export const db = new TypingMistakeDB()

export async function createDict(dictInfo: DictInfo): Promise<void> {
  const { id: dictId, name } = dictInfo

  const errorDictId = `${dictId}_error`

  try {
    await db.transaction('rw', db.dicts, db.errorDicts, async () => {
      // 在事务中添加词典
      await db.dicts.add(dictInfo)

      // 在事务中查询刚刚添加的词典
      const dicts = await db.dicts.where('id').equals(dictId).toArray()
      if (dicts.length === 0) {
        throw new Error(`Can not find dict with id ${dictId}`)
      }

      // 在事务中查询错误单词本是否已存在
      const errorDicts = await db.errorDicts.where('id').equals(errorDictId).toArray()
      if (errorDicts.length > 0) {
        throw new Error(`Error dict with id ${errorDictId} already exists`)
      }

      // 在事务中添加错误单词本
      const now = Date.now()
      const errorDictInfo: ErrorDictInfo = {
        id: errorDictId,
        name: `${name} 错题`,
        dictId: dictId,
        createTime: now,
        updateTime: now,
      }
      await db.errorDicts.add(errorDictInfo)
    })
  } catch (error) {
    console.error(`创建词典时发生错误：${error}`)
    throw error
  }
}

export async function removeDict(dictId: string): Promise<void> {
  const errorDictId = `${dictId}_error`

  try {
    await db.transaction('rw', db.errorWords, db.errorDicts, db.dicts, async () => {
      // 在事务中移除错误单词本的错误单词
      await db.errorWords.where('dictId').equals(dictId).delete()

      // 在事务中移除对应的错误单词本
      await db.errorDicts.where('id').equals(errorDictId).delete()

      // 在事务中移除词典
      await db.dicts.where('id').equals(dictId).delete()

      if (window.delLocalDict) {
        const result = await window.delLocalDict(errorDictId)
        if (!result) {
          throw new Error("Can't removeDict")
        }
        window.initLocalDictionries()
      }
    })
  } catch (error) {
    console.error(`移除词典时发生错误：${error}`)
    throw error
  }
}

// 通过现有词典id和错误单词 新增错题本单词
export async function addErrorWord(dictId: string, word: IWord) {
  const errorWords = await db.errorWords
    .where('dictId')
    .equals(dictId)
    .and((item) => {
      return item.word.name === word.name
    })
    .toArray()

  if (errorWords.length > 0) {
    // 如果已经存在该错误单词，则将错误次数加1
    const errorWord = errorWords[0]
    await db.errorWords.update(errorWord.id!, { count: errorWord.count + 1 })
  } else {
    // 否则，添加新的错误单词
    const errorWord: ErrorWord = {
      dictId: dictId,
      word: word,
      count: 1,
    }
    await db.errorWords.add(errorWord)
  }
}
export async function addErrorWordList(dictId: string, wordlist: IWord[]) {
  const dicts = await db.dicts.toArray()
  const dictIds = dicts.map((dict) => dict.id)
  if (dictIds.includes(dictId)) {
    for (const word of wordlist) {
      await addErrorWord(dictId, word)
    }
  }
}

// 通过现有词典id和错误单词 移除错题本单词
export async function removeErrorWord(dictId: string, word: IWord) {
  await db.errorWords
    .where('dictId')
    .equals(dictId)
    .and((item) => item.word.name === word.name)
    .delete()
}

//获取正在记录中的词典id
export async function getRecordingDict() {
  return await db.dicts.toArray()
}

// 获取当前错题本数量
export async function getErrorDictCount() {
  return await db.errorDicts.count()
}

// 通过现有词典id导出对应错题本词典
export async function exportErrorDictToJson(dictId: string) {
  const errorDictId = `${dictId}_error`

  const errorDicts = await db.errorDicts.where('id').equals(errorDictId).toArray()
  if (errorDicts.length === 0) {
    throw new Error(`Error dict with id ${errorDictId} does not exist`)
  }

  const words = await db.errorWords.where('dictId').equals(dictId).toArray()

  const jsonData = words.map((item) => {
    item.word?.index && delete item.word.index

    return item.word
  })
  return { errorDictId, jsonData }
}
export async function exportTypingMistakeDB2UTools() {
  const [pako] = await Promise.all([import('pako'), import('dexie-export-import')])

  const blob = await db.export()

  const json = await blob.text()
  const compressed = pako.gzip(json)
  const compressedBlob = new Blob([compressed])
  const uint8Array = await blobToUint8Array(compressedBlob)

  await window.postDB('x-typing-mistake', uint8Array)
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

export async function importTypingMistakeDB2UTools() {
  const [pako] = await Promise.all([import('pako'), import('dexie-export-import')])

  const uint8Array = await window.getDB('x-typing-mistake')
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

window.exportTypingMistakeDB2UTools = exportTypingMistakeDB2UTools
window.importTypingMistakeDB2UTools = importTypingMistakeDB2UTools
