import { getRecordingDict } from '@/utils/typing-mistake-db'
import { useState, useEffect } from 'react'

export default function () {
  const [tags, setTags] = useState([])
  useEffect(() => {
    async function getRecordingDictName() {
      const dicts = await getRecordingDict()
      setTags(dicts)
    }
    getRecordingDictName()
  }, [])
  return (
    <>
      <div className="mb-2 flex w-full text-sm">
        <span className="inline-block  max-w-[90%] rounded-lg bg-red-400 p-2  text-white dark:bg-gray-400">
          <span className="mx-2 inline-block py-4 text-white ">
            {tags.length ? '错题记录中：' : '错题记录未启用 ！(功能入口位于词典右下角)'}
          </span>
          {tags.map((item) => (
            <span key={item.id} className="m-2 inline-block  rounded-lg bg-white p-2 text-red-400">
              {item.name}
            </span>
          ))}
        </span>
      </div>
    </>
  )
}
