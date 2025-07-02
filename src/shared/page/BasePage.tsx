import { FC, PropsWithChildren } from 'react'

const BasePage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="p-10 w-full h-full flex overflow-auto">
      <div className="w-full h-full flex flex-col">{children}</div>
    </main>
  )
}

export default BasePage
