import { useCountUp } from '../model/count-up'

interface CountUpTotalProps {
  total: number
}

export function CountUpTotal({ total }: CountUpTotalProps) {
  const display = useCountUp(total)
  return <span>{display.toLocaleString()}</span>
}
