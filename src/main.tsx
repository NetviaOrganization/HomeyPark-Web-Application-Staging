import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import 'primeicons/primeicons.css'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './app/router/index.tsx'
import { APIProvider } from '@vis.gl/react-google-maps'
import { GoogleReCaptchaProvider } from '@google-recaptcha/react'
import { env } from './env/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider type="v2-checkbox" siteKey={env.google.siteKey}>
      <APIProvider apiKey={env.google.apiKey}>
        <PrimeReactProvider
          value={{
            ripple: true,
            pt: {
              inputtext: {
                root: { className: 'text-sm p-inputtext-sm' },
              },
              button: {
                root: { className: 'text-sm' },
              },
            },
          }}
        >
          <RouterProvider router={router} />
        </PrimeReactProvider>
      </APIProvider>
    </GoogleReCaptchaProvider>
  </StrictMode>
)
