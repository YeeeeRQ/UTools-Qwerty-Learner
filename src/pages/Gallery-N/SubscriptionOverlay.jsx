import { setConcealFeature } from '@/utils/utools'
import mixpanel from 'mixpanel-browser'
import IconCheck from '~icons/gg/check-o'

export default function SubscriptionOverlay({ setGalleryState }) {
  const featureOneMonth = ['摸鱼模式', '章节乱序', '错题集 \u00A0 \u00A0 \u00A0 （限制4本）', '自定义词典（限制4本）']
  const featureForver = ['练习进度', '摸鱼模式', '章节乱序', '错题集 \u00A0 \u00A0 \u00A0 （完全版）', '自定义词典（完全版）']
  function handleClick(param) {
    const monthGoodsId = import.meta.env.VITE_MONTH_GOODS_ID
    const permanentGoodsId = import.meta.env.VITE_PERMANENT_GOODS_ID
    utools.openPayment({ goodsId: param === 'b' ? monthGoodsId : permanentGoodsId, attach: param }, (res) => {
      // 存储状态
      localStorage.setItem('x-vipState', param)
      setGalleryState((state) => {
        state.vipState = localStorage.getItem('x-vipState') || ''
      })
      setConcealFeature()
      mixpanel.track('Payment', { state: param })
      fetch(`${import.meta.env.VITE_XIZHI_CHANEL_URL}?title=又增加了一笔${param}睡后收入啦`)
    })
  }

  return (
    <>
      <div
        className="absolute bottom-0 left-0 z-20 w-full rounded-md bg-[#faf9ff] p-4 opacity-50 backdrop-blur-[5px] backdrop-filter dark:bg-[#111827]"
        style={{ height: 'calc(100% - 130px)' }}
      ></div>
      <div className="absolute left-0 right-0 top-[14rem] z-30 m-auto flex max-w-lg items-center justify-center p-4">
        <div className="mx-16 flex  w-1/2 items-center justify-center">
          <div className="w-64 rounded-2xl bg-[#5eaf93] p-4 opacity-90 shadow-lg backdrop-blur-[15px] backdrop-filter dark:bg-gray-700 ">
            <div className="flex items-center justify-between text-white">
              <p className="mb-4 text-4xl font-medium">Plus</p>
              <p className="flex flex-col text-4xl font-bold">
                9.9
                <span className="pt-1 text-right text-sm font-thin">一个月</span>
              </p>
            </div>
            <p className="text-md mt-4 text-white">计划包含 :</p>
            <ul className="mb-6 mt-6 w-full text-sm text-white">
              <li className="mb-3 flex items-center opacity-0">
                <IconCheck className="mr-2" />
                占位
              </li>
              {featureOneMonth.map((item) => (
                <li className="mb-3 flex items-center whitespace-normal" key={item}>
                  <IconCheck className="mr-2" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="text-md w-full rounded-lg bg-white px-3 py-3 font-bold text-green-600 shadow hover:bg-gray-100 dark:text-green-900 "
              onClick={() => handleClick('b')}
            >
              开通
            </button>
          </div>
        </div>
        <div className="mx-16  flex  w-1/2 items-center justify-center">
          <div className="w-64 rounded-2xl bg-[#00446e] p-4 shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between text-white">
              <p className="mb-4 text-4xl font-medium">Pro</p>
              <p className="relative flex flex-col text-4xl font-bold">
                <span
                  className="absolute bottom-[1.3rem] left-[-3.2rem] border-r border-dashed py-1 text-[1rem] font-thin "
                  style={{ writingMode: 'vertical-rl', textOrientation: 'upright', whiteSpace: 'nowrap' }}
                >
                  限时
                </span>
                29.9
                <span className="pt-1 text-right text-sm font-thin">永久</span>
              </p>
            </div>
            <p className="text-md mt-4 text-white">计划包含 :</p>
            <ul className="mb-6 mt-6 w-full text-sm text-white">
              {featureForver.map((item) => (
                <li className="mb-3 flex items-center " key={item}>
                  <IconCheck className="mr-2" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="text-md w-full rounded-lg bg-white px-3 py-3 font-bold text-gray-600 shadow hover:bg-gray-100"
              onClick={() => handleClick('c')}
            >
              开通
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
