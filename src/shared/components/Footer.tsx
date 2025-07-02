import { useState } from 'react'

export default function Footer() {
  const [visible, setVisible] = useState(false)

  return (
    <footer className="bg-[var(--primary-color)] text-white px-8 py-3 text-sm">
      <div className="text-center">
        <button
          className="text-white hover:text-white cursor-pointer"
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Ocultar información ▼' : 'Mostrar información ▲'}
        </button>
      </div>

      {visible && (
        <div className="flex w-full justify-between items-center">
          <div className="mt-4 text-center  text-white">
            © 2025 HomeyPark. Todos los derechos reservados.
          </div>
          <div className="mt-4 text-white flex gap-8 items-center">
            <div className="flex gap-4">
              <div className="underline cursor-pointer">Facebook</div>
              <div className="underline cursor-pointer">Twitter</div>
              <div className="underline cursor-pointer">Instagram</div>
            </div>
            <div className="bg-white rounded-sm">
              <img
                className="cursor-pointer"
                width={86}
                src="https://thecigarclub.com.pe/wp-content/uploads/2024/01/book-claim-icon.png"
                alt="Libro de reclamaciones"
              />
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
