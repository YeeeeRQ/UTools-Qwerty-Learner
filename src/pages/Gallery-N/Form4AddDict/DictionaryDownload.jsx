import { useState } from 'react'

const DictionaryDownload = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => setIsExpanded(!isExpanded)

  const handleDownload = (filename) => {
    const URL_PREFIX = REACT_APP_DEPLOY_ENV === 'pages' ? '/qwerty-learner' : ''
    const url = `/template-dicts/${filename}`
    fetch('.' + URL_PREFIX + url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(url)
      })
      .catch((error) => console.error(error))
  }

  const dictionaries = [
    { name: '英文词典(无音标)', filename: 'english_no_pronunciation.xls' },
    { name: '英文词典(有音标)', filename: 'english_with_pronunciation.xls' },
    { name: '日文词典(无注解)', filename: 'japanese_no_annotation.xls' },
    { name: '日文词典(有注解)', filename: 'japanese_with_annotation.xls' },
    { name: '德英词典', filename: 'german_english.xls' },
  ]

  return (
    <div>
      <div
        className="flex cursor-pointer justify-end text-blue-300 transition-all duration-500 ease-in-out hover:text-blue-500"
        onClick={handleToggle}
      >
        词典模板下载
      </div>
      <div className={`${isExpanded ? 'h-auto py-4' : 'h-0 overflow-hidden'} transition-all duration-500 ease-in-out`}>
        <div className="item-center mt-2 flex w-full justify-center rounded-lg border-2 border-dashed border-gray-300 p-4">
          {dictionaries.map(({ name, filename }) => (
            <div
              key={filename}
              className="mx-2 h-8 cursor-pointer text-red-300 hover:text-red-500"
              onClick={() => handleDownload(filename)}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DictionaryDownload
