import { GalleryContext, InnerContext } from './index'
import Tooltip from '@/components/Tooltip'
import { currentDictIdAtom } from '@/store'
import type { DictionaryResource } from '@/typings/index'
import { db as typingMistakeDB } from '@/utils/typing-mistake-db'
import { createDict, removeDict } from '@/utils/typing-mistake-db'
import { Dialog, Transition } from '@headlessui/react'
import { useAtomValue } from 'jotai'
import mixpanel from 'mixpanel-browser'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import TaskCheckIcon from '~icons/bx/task'
import TaskXIcon from '~icons/bx/task-x'

interface ErrorRecordingToggleProps {
  dictInfo: DictionaryResource
}

export default function ErrorRecordingToggle({ dictInfo }: ErrorRecordingToggleProps) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { state, setState } = useContext(GalleryContext)!
  const handleRefresh = useContext(InnerContext)

  const { id: dictId } = dictInfo

  const mistakeRecording = useMemo(() => {
    return state.mistakeRecordingDictIds.includes(dictId)
  }, [state.mistakeRecordingDictIds, dictId])

  const [isOpen, setIsOpen] = useState(false)
  const [isToggled, setIsToggled] = useState(mistakeRecording)

  const currentDictID = useAtomValue(currentDictIdAtom)
  const isSelected = currentDictID === dictId

  useEffect(() => {
    setIsToggled(mistakeRecording)
  }, [mistakeRecording])

  useEffect(() => {
    const hasInitialize = localStorage.getItem('initialize')

    if (hasInitialize) return

    const initDict = async () => {
      await createDict(dictInfo)
      typingMistakeDB.dicts.toArray().then((arr) => {
        setState((state) => {
          state.mistakeRecordingDictIds = arr.map((obj) => obj.id)
        })
      })
    }
    if ('cet4' === dictInfo.id) {
      localStorage.setItem('initialize', 'true')
      initDict()
    }
  }, [dictInfo, setState])

  function handleDialogClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  function handleToggle(event) {
    event.stopPropagation() // 阻止事件冒泡
    if (!['b', 'c'].includes(state.vipState)) {
      toast.info('“词典错题记录器” 为订阅用户专属功能，开通订阅后可使用')
      return
    }

    setIsOpen(true)
  }

  async function handleConfirm() {
    if (!isToggled) {
      const limitCount = (() => {
        if (state.vipState === 'b') return 4
        if (state.vipState === 'c') return 20
        return 0
      })()

      if (state.mistakeRecordingDictIds.length >= limitCount) {
        toast.info(`😣我撑不住了，词典太多了！(错题记录功能限制${limitCount}本词典)`)
        return
      }
      await createDict(dictInfo)
      mixpanel.track('Mistake Recording Open', { dict: dictInfo.name })
    } else {
      await removeDict(dictId)
      mixpanel.track('Mistake Recording Close', { dict: dictInfo.name })
      handleRefresh()
    }

    typingMistakeDB.dicts.toArray().then((arr) => {
      setState((state) => {
        state.mistakeRecordingDictIds = arr.map((obj) => obj.id)
      })
    })
    setIsToggled(!isToggled)
    setIsOpen(false)
  }

  function handleCancel() {
    setIsOpen(false)
  }

  return (
    <>
      <div
        className={`mr-2 flex  h-6 w-6 items-center space-x-2 ${
          isToggled ? 'transition duration-500 ease-in' : 'transition duration-300 ease-out'
        }`}
        onClick={handleToggle}
      >
        {isToggled ? (
          <Tooltip content="关闭错题记录">
            <TaskCheckIcon
              className={`inline-block h-6 w-6 ${isSelected ? 'text-white' : 'text-red-300'} rounded-md shadow-sm dark:text-white`}
            />
          </Tooltip>
        ) : (
          <Tooltip content="开启错题记录">
            <TaskXIcon className="h-6 w-6 text-gray-300 hover:text-gray-500" />
          </Tooltip>
        )}
      </div>
      <Transition appear show={isOpen}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={handleCancel} onClick={handleDialogClick}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg leading-6 text-gray-900">
                  {isToggled ? '确认关闭错题记录' : '确认开启错题记录'}
                </Dialog.Title>

                <div>
                  <p className="m-4">{isToggled && ' 关闭错题记录的同时也会移除开启期间记录的单词 '}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-white  hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:text-gray-200"
                    onClick={handleConfirm}
                  >
                    确定
                  </button>
                  <button
                    type="button"
                    className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={handleCancel}
                  >
                    取消
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
