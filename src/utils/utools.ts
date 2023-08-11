export const setConcealFeature = () => {
  let features = utools.getFeatures()
  const vipState = localStorage.getItem('x-vipState')
  if (vipState === 'b' || vipState === 'c') {
    utools.setFeature({
      code: 'conceal',
      explain: '🐟背单词打字摸鱼模式，摸鱼一时爽,一直摸鱼一直爽~~',
      cmds: ['moyu', 'moyv', 'typing-摸鱼模式'],
    })
  } else {
    utools.removeFeature('conceal')
  }
  features = utools.getFeatures()
}

export const processPayment = (ret) => {
  if (ret.length === 0) return

  const permanent = ret.filter((v) => v.attach === 'c')
  if (permanent.length > 0) {
    localStorage.setItem('x-vipState', 'c')
    return
  }

  const month = ret.filter((v) => v.attach === 'b')
  if (month.length > 0) {
    const orders = month.sort((a, b) => new Date(b.paid_at) - new Date(a.paid_at))
    const latestOrder = orders[0]
    const paidDate = new Date(latestOrder.paid_at)
    paidDate.setMonth(paidDate.getMonth() + 1)
    const currentDate = new Date()
    const isExpired = paidDate < currentDate
    localStorage.setItem('x-vipState', isExpired ? '' : 'b')
    return
  }
}
