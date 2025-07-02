import AuthTemplate from '../template/AuthTemplate'
import Title from '@/shared/components/Title'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Link, useNavigate } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { REQUIRED_INPUT_ERROR } from '@/messages/form'
import { GoogleReCaptchaCheckbox } from '@google-recaptcha/react'
import { memo, useCallback, useState } from 'react'
import { login } from '../useCases/login'

const defaultValues = {
  email: '',
  password: '',
  captcha: false,
}

const GoogleCaptcha = memo(GoogleReCaptchaCheckbox, (prevProps, nextProps) => {
  return prevProps.size === nextProps.size && prevProps.onChange === nextProps.onChange
})

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { control, handleSubmit, setValue } = useForm({ defaultValues, mode: 'onTouched' })
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: typeof defaultValues) => {
    if (!data.captcha) return

    setLoading(true)
    try {
      await login(data.email, data.password)
      // login(data.username, data.password)
      navigate('/')
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeCaptcha = useCallback(
    (token: string | null) => {
      setValue('captcha', !!token)
    },
    [setValue]
  )

  return (
    <AuthTemplate>
      <Title level="h1">Inicia sesión</Title>
      <p className="mt-2">Ingresa a tu cuenta y empieza a reservas estacionamientos.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Controller
              name="email"
              rules={{
                required: { value: true, message: REQUIRED_INPUT_ERROR },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'El email no es válido',
                },
              }}
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputText type="email" id="email" {...field} invalid={!!fieldState.error} />
                  {!!fieldState.error && (
                    <small id="email" className="text-red-500">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="email" className="text-sm font-medium">
              Contraseña
            </label>
            <div className="flex w-full">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: { value: true, message: REQUIRED_INPUT_ERROR },
                }}
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2 w-full">
                    <Password
                      id="password"
                      feedback={false}
                      toggleMask
                      className="w-full"
                      inputClassName="w-full"
                      pt={{
                        root: { className: '*:w-full' },
                      }}
                      {...field}
                    />
                    {!!fieldState.error && (
                      <small id="password" className="text-red-500">
                        {fieldState.error.message}
                      </small>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="mt-2">
            <GoogleCaptcha size="normal" onChange={handleChangeCaptcha} />
          </div>
        </div>
        <div className="mt-8">
          <Button label="Iniciar sesión" loading={loading} type="submit" className="w-full" />
          {error && (
            <span className="mt-1 text-red-500 text-center text-sm w-full block">{error}</span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link to="/signup" className="text-[var(--primary-color)] underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </AuthTemplate>
  )
}

export default LoginPage
