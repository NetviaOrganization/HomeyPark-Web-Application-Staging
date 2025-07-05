import { useState } from 'react'

const VerificationStatus = ({
  isVerified,
  onVerify,
  onRequestCode,
  isLoading,
}: VerificationStatusProps) => {
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleRequestCode = async () => {
    try {
      await onRequestCode()
      setShowCodeInput(true)
      setError('')
    } catch {
      setError('Error al enviar el código')
    }
  }

  const handleVerifyCode = async () => {
    try {
      await onVerify(code)
      setError('')
    } catch {
      setError('Código inválido')
    }
  }

  if (isVerified) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-[#10b981] p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold">Estado de la cuenta</p>
          <p className="text-[#10b981]">Correo verificado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-yellow-500 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold">Estado de la cuenta</p>
          <p className="text-yellow-500">Correo no verificado</p>
        </div>
      </div>

      {!showCodeInput ? (
        <button
          onClick={handleRequestCode}
          className="bg-[#10b981] text-white px-4 py-2 rounded-md hover:bg-[#0d9668]"
        >
          Verificar correo
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ingresa el código"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <button
            onClick={handleVerifyCode}
            disabled={isLoading}
            className="bg-[#10b981] text-white px-4 py-2 rounded-md hover:bg-[#0d9668] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Verificando...</span>
              </>
            ) : (
              'Verificar código'
            )}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </div>
  )
}

interface VerificationStatusProps {
  isVerified: boolean
  onVerify: (code: string) => Promise<void>
  onRequestCode: () => Promise<void>
  isLoading?: boolean
}

export default VerificationStatus
