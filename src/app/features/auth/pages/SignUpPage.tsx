import { useForm, Controller } from 'react-hook-form'
import Title from '@/shared/components/Title'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Link, useNavigate } from 'react-router'
import AuthTemplate from '../template/AuthTemplate'
import { REQUIRED_INPUT_ERROR } from '@/messages/form'
import { GoogleReCaptchaCheckbox } from '@google-recaptcha/react'
import { memo, useCallback, useState } from 'react'
import { Nullable } from 'primereact/ts-helpers'
import { Checkbox } from 'primereact/checkbox'
import { signUp } from '../useCases/signUp'
import { UserAlreadyExistsError } from '../errors/emailAlreadyExistsError'

const defaultValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  repeatPassword: '',
  termsAndConditions: false,
  captcha: false,
}

const GoogleCaptcha = memo(GoogleReCaptchaCheckbox, (prevProps, nextProps) => {
  return prevProps.size === nextProps.size && prevProps.onChange === nextProps.onChange
})

const SignUpPage = () => {
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<Nullable<string>>(null)

  const navigate = useNavigate()
  const { control, handleSubmit, setValue } = useForm({
    defaultValues,
    shouldFocusError: true,
    criteriaMode: 'all',
    mode: 'onTouched',
  })

  const onSubmit = async ({
    email,
    firstName,
    lastName,
    password,
    captcha,
  }: typeof defaultValues) => {
    if (!captcha) return

    setSubmitError(null)

    setLoading(true)
    try {
      await signUp(email, firstName, lastName, password, new Date('2024-01-01'))
      navigate('/')
    } catch (err) {
      if (err instanceof UserAlreadyExistsError) {
        setSubmitError('El email ya está registrado. Por favor, intenta con otro.')
      }
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
      <Title level="h1">Crear una cuenta nueva</Title>
      <p className="mt-2">
        Tu vehículo seguro, tu espacio garantizado: Encuentra el lugar perfecto para estacionar.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
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
                  <InputText id="email" {...field} invalid={!!fieldState.error} />
                  {!!fieldState.error && (
                    <small id="email" className="text-red-500">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="firstName" className="text-sm font-medium">
                Nombres
              </label>
              <Controller
                name="firstName"
                rules={{
                  required: { value: true, message: REQUIRED_INPUT_ERROR },
                  maxLength: {
                    value: 200,
                    message: 'El nombre no debe exceder los 200 caracteres',
                  },
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id="firstName"
                      className="w-full"
                      {...field}
                      invalid={!!fieldState.error}
                    />
                    {!!fieldState.error && (
                      <small id="firstName" className="text-red-500">
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="email" className="text-sm font-medium">
                Apellidos
              </label>
              <Controller
                name="lastName"
                rules={{
                  required: { value: true, message: REQUIRED_INPUT_ERROR },
                  maxLength: {
                    value: 200,
                    message: 'El apellido no debe exceder los 200 caracteres',
                  },
                }}
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id="lastName"
                      className="w-full"
                      {...field}
                      invalid={!!fieldState.error}
                    />
                    {!!fieldState.error && (
                      <small id="lastName" className="text-red-500">
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex gap-4 w-full">
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
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres',
                    },
                    maxLength: {
                      value: 30,
                      message: 'La contraseña no debe exceder los 30 caracteres',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message:
                        'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1 w-full">
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

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="email" className="text-sm font-medium">
                Repetir contraseña
              </label>
              <div className="flex justify-center w-full">
                <Controller
                  name="repeatPassword"
                  rules={{
                    required: { value: true, message: REQUIRED_INPUT_ERROR },
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres',
                    },
                    maxLength: {
                      value: 30,
                      message: 'La contraseña no debe exceder los 30 caracteres',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message:
                        'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número',
                    },
                  }}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <Password
                        id="repeatPassword"
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
                        <small id="repeatPassword" className="text-red-500">
                          {fieldState.error.message}
                        </small>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col ">
              <Controller
                name="termsAndConditions"
                control={control}
                rules={{
                  required: { value: true, message: 'Debes aceptar los términos y condiciones' },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <div>
                      <Checkbox
                        inputId="termsAndConditions"
                        {...field}
                        onChange={(e) => field.onChange(e.checked)}
                        checked={field.value}
                        invalid={!!fieldState.error}
                      />
                      <label htmlFor="termsAndConditions" className="ml-2">
                        He leído y acepto los{' '}
                        <a
                          href="https://homey-park-experiments.web.app/terms-conditions"
                          target="_blank"
                          className="text-[#10b981] hover:underline cursor-pointer"
                        >
                          términos y condiciones
                        </a>
                      </label>
                    </div>
                    {!!fieldState.error && (
                      <small id="termsAndConditions" className="text-red-500">
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="mt-2">
            <GoogleCaptcha size="normal" onChange={handleChangeCaptcha} />
          </div>
        </div>

        <div className="mt-8">
          <Button loading={loading} label="Crear cuenta" type="submit" className="w-full" />
          {submitError && (
            <small id="email" className="text-red-500">
              {submitError}
            </small>
          )}
        </div>
        <div className="mt-4">
          <p className="text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-[var(--primary-color)] underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </form>
    </AuthTemplate>
  )
}

export default SignUpPage
