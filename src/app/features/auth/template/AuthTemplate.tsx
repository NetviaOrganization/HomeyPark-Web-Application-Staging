import { FC, PropsWithChildren } from 'react'
import authBanner from '@/assets/auth-banner.jpg'

const AuthTemplate: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section className="w-full h-screen flex justify-center items-center bg-white">
      <div className="grid grid-cols-2 gap-16 container mx-auto px-8 items-center">
        <div>
          <img src={authBanner} className="w-full" width={480} height={480} />
        </div>
        <div className="px-4">{children}</div>
      </div>
    </section>
  )
}

export default AuthTemplate
