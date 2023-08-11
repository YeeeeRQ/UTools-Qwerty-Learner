import { RadioGroup } from '@headlessui/react'
import { useCallback } from 'react'

type Props = {
  tagList: string[]
  currentTag: string
  onChangeCurrentTag: (tag: string) => void
}

export default function DictTagSwitcher({ tagList, currentTag, onChangeCurrentTag }: Props) {
  const onChangeTag = useCallback(
    (tag: string) => {
      onChangeCurrentTag(tag)
    },
    [onChangeCurrentTag],
  )

  return (
    <RadioGroup className="" value={currentTag} onChange={onChangeTag}>
      <div className="flex flex-wrap">
        {tagList.map((option) => (
          <RadioGroup.Option
            key={option}
            value={option}
            className={({ checked }) =>
              `m-1 flex cursor-pointer items-center whitespace-nowrap rounded-[2rem] px-4 py-2 ${
                checked ? 'bg-indigo-400 text-white' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-200'
              } ${!checked && 'hover:bg-indigo-100 dark:hover:bg-gray-600'}`
            }
          >
            <p className={`font-normal `}>{option}</p>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
