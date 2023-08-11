import { GalleryContext } from '.'
import codeFlag from '@/assets/flags/code.png'
import customFlag from '@/assets/flags/custom.png'
import deFlag from '@/assets/flags/de.png'
import enFlag from '@/assets/flags/en.png'
import jpFlag from '@/assets/flags/ja.png'
import mistakeFlag from '@/assets/flags/mistake.png'
import type { LanguageCategoryType } from '@/typings'
import { RadioGroup } from '@headlessui/react'
import { useCallback, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

export type LanguageTabOption = {
  id: LanguageCategoryType
  name: string
  flag: string
}

const options: LanguageTabOption[] = [
  { id: 'en', name: '英语', flag: enFlag },
  { id: 'ja', name: '日语', flag: jpFlag },
  { id: 'de', name: '德语', flag: deFlag },
  { id: 'code', name: 'Code', flag: codeFlag },
  { id: 'mistake', name: '错题集', flag: mistakeFlag },
  { id: 'custom', name: '自定义', flag: customFlag },
]
if (!window.utools) options.pop()
export function LanguageTabSwitcher() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { state, setState } = useContext(GalleryContext)!
  const location = useLocation()

  const onChangeTab = useCallback(
    (tab: string) => {
      setState((draft) => {
        draft.currentLanguageTab = tab as LanguageCategoryType
      })
    },
    [setState],
  )
  useEffect(() => {
    setTimeout(() => {
      const redirect = new URLSearchParams(location.search).get('redirect')
      if (redirect === 'subscribe') {
        setState((state) => {
          state.currentLanguageTab = 'mistake'
        })
        // const vipState = localStorage.getItem('x-vipState')
        // if (vipState === 'b') {
        //   toast.success('您已开通Plus订阅(一个月), 感谢支持 ❗')
        // } else if (vipState === 'c') {
        //   toast.success('您已开通Pro订阅(永久), 感谢支持 ❗')
        // }
      }
    }, 500)
  }, [location, setState])

  return (
    <RadioGroup value={state.currentLanguageTab} onChange={onChangeTab}>
      <div className="flex items-center space-x-4">
        {options.map((option) => (
          <RadioGroup.Option key={option.id} value={option.id} className="cursor-pointer">
            {({ checked }) => (
              <div className={`flex items-center border-b-2 px-2 pb-1 ${checked ? 'border-indigo-500' : 'border-transparent'}`}>
                <img src={option.flag} className="mr-1.5 h-7 w-7" />
                <p className={`text-lg font-medium text-gray-700 dark:text-gray-200`}>{option.name}</p>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
