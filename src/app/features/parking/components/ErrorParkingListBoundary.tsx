import ErrorIcon from '@/assets/icons/ErrorIcon'
import { FC } from 'react'

const ErrorParkingListBoundary: FC<Props> = ({ errorCode, error }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-green-50 flex items-center justify-center rounded-full p-8">
        <ErrorIcon width={120} height={120} className="text-[#10b981]" />
      </div>
      <div className="text-center mt-4">
        <p className="text-lg font-medium">
          Error {errorCode}: {error}
        </p>
      </div>
    </div>
  )
}

interface Props {
  errorCode: number | string
  error: string
}

export default ErrorParkingListBoundary
