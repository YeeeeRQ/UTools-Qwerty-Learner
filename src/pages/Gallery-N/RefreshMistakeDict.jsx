import { GalleryContext } from './'
import Tooltip from '@/components/Tooltip'
import { exportErrorDictToJson, getRecordingDict } from '@/utils/typing-mistake-db'
import { useContext, useEffect, memo } from 'react'
import { toast } from 'react-toastify'
import IconRefresh from '~icons/tabler/refresh'

function RefreshMistakeDict({ onRefresh }) {
  const { state } = useContext(GalleryContext)

  useEffect(() => {
    const handleBtnClick = async () => {
      const recordingDicts = await getRecordingDict()

      for (const dict of recordingDicts) {
        const { errorDictId, jsonData } = await exportErrorDictToJson(dict.id)
        if (!window.utools) return

        // 生成错题词典
        if (jsonData.length >= 0) {
          const MistakeDictMeta = {
            id: errorDictId,
            name: dict.name.trim() + ' 错题',
            language: dict.language,
          }
          saveMistakeDict(MistakeDictMeta, jsonData)
        }
      }
      window.initLocalDictionries()
      // toast.success('更新成功')
      onRefresh()
    }
    handleBtnClick()
  }, [])

  const handleBtnClick = async () => {
    const recordingDicts = await getRecordingDict()

    for (const dict of recordingDicts) {
      const { errorDictId, jsonData } = await exportErrorDictToJson(dict.id)
      if (!window.utools) return

      // 生成错题词典
      if (jsonData.length >= 0) {
        const MistakeDictMeta = {
          id: errorDictId,
          name: dict.name.trim() + ' 错题',
          language: dict.language,
        }
        saveMistakeDict(MistakeDictMeta, jsonData)
      }
    }
    window.initLocalDictionries()
    // toast.success('更新成功')
    onRefresh()
  }

  return (
    <>
      {/* {['month', 'permanent'].includes(state.vipState) && (
        <Tooltip content="更新错题集" placement="top" className="!absolute right-[6.5rem] top-24">
          <button
            type="button"
            className="fixed right-20 top-24 z-10 rounded-lg  bg-indigo-50 px-2 py-2 text-lg hover:bg-indigo-200 focus:outline-none dark:bg-indigo-900 dark:hover:bg-indigo-800"
            // onClick={handleBtnClick}
          >
            <IconRefresh className="h-6 w-6 text-lg text-indigo-500 dark:text-white" />
          </button>
        </Tooltip>
      )} */}
      <div></div>
    </>
  )
}
// todo: 拿不到旧词典的id
const saveMistakeDict = (dictMeta, jsonData) => {
  const createDictMeta = (meta) => {
    const { id, name, language } = meta
    return {
      id,
      name: name,
      url: `/dicts/${id}.json`,
      language,
      description: '',
      length: jsonData.length,
    }
  }
  window.newLocalMistakeDictFromJson(jsonData, createDictMeta(dictMeta))
}
export default memo(RefreshMistakeDict)
