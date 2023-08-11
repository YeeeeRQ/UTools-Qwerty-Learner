import ErrorRecordingToggle from './ErrorRecordingToggle'
import Form4EditDict from './Form4EditDict'
import { useDictStats } from './hooks/useDictStats'
import { GalleryContext } from './index'
import bookCover from '@/assets/book-cover.png'
import Tooltip from '@/components/Tooltip'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { currentDictIdAtom } from '@/store'
import type { Dictionary } from '@/typings'
import { calcChapterCount } from '@/utils'
import * as Progress from '@radix-ui/react-progress'
import { useAtomValue } from 'jotai'
import { useContext, useMemo, useRef } from 'react'

interface Props {
  dictionary: Dictionary
  onClick?: () => void
}

export default function DictionaryComponent({ dictionary, onClick }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { state } = useContext(GalleryContext)!
  const currentDictID = useAtomValue(currentDictIdAtom)

  const divRef = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(divRef, {})
  const isVisible = !!entry?.isIntersecting
  const dictStats = useDictStats(dictionary.id, isVisible)
  const chapterCount = useMemo(() => calcChapterCount(dictionary.length), [dictionary.length])
  const isSelected = currentDictID === dictionary.id
  const progress = useMemo(
    () => (dictStats ? Math.ceil((dictStats.exercisedChapterCount / chapterCount) * 100) : 0),
    [dictStats, chapterCount],
  )
  return (
    <div
      ref={divRef}
      className={`h-38 group  flex w-80 cursor-pointer items-center justify-center overflow-hidden rounded-lg p-5 text-left shadow-lg focus:outline-none ${
        isSelected ? 'bg-indigo-400' : 'bg-zinc-50 hover:bg-white dark:bg-gray-600 dark:hover:bg-gray-500'
      }`}
      role="button"
      onClick={onClick}
    >
      <div className="relative ml-1 mt-2 flex h-full w-full flex-col items-start justify-start">
        <h1
          className={`mb-1.5 text-xl font-normal  ${
            isSelected ? 'text-white' : 'text-gray-800 group-hover:text-indigo-400 dark:text-gray-200'
          }`}
        >
          {dictionary.name}
        </h1>
        <Tooltip className="w-full" content={dictionary.description}>
          <p className={`mb-1 w-full truncate ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-200'}`}>
            {dictionary.description}
            {'\u00A0'}{' '}
          </p>
        </Tooltip>

        <p className={`mb-0.5 font-bold  ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-200'}`}>{dictionary.length} 词</p>
        <div className=" flex w-full items-center justify-end pt-2">
          {'c' === state.vipState && progress > 0 && (
            <Progress.Root
              value={progress}
              max={100}
              className={`mr-4 h-2 w-full rounded-full border  bg-white ${isSelected ? 'border-indigo-600' : 'border-indigo-400'}`}
            >
              <Progress.Indicator
                className={`h-full rounded-full pl-0 ${isSelected ? 'bg-indigo-600' : 'bg-indigo-400'}`}
                style={{ width: `calc(${progress}% )` }}
              />
            </Progress.Root>
          )}
          {['custom'].includes(dictionary.languageCategory) && <Form4EditDict dictId={dictionary.id} />}
          {!['mistake'].includes(dictionary.languageCategory) && <ErrorRecordingToggle dictInfo={dictionary} />}
          <img src={bookCover} className={`absolute right-3 top-3 w-16 ${isSelected ? 'opacity-50' : 'opacity-20'}`} />
        </div>
        {/* <p className={`${dictionary.languageCategory === 'custom' ? '' : 'hidden'} text-xs text-gray-300 `}>{dictionary.id}</p> */}
      </div>
    </div>
  )
}
