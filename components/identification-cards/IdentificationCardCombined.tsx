import { IdentificationCardDisplay } from "./IdentificationCardDisplay"
import { IdentificationCardReverseDisplay } from "./IdentificationCardReverseDisplay"

interface IdentificationCardCombinedProps {
  personName: string
  nie: string
  validityDateStart?: string
  validityDateEnd?: string
  photoUrl?: string | null
  isFirst?: boolean
  isLast?: boolean
}

export function IdentificationCardCombined({
  personName,
  nie,
  validityDateStart,
  validityDateEnd,
  photoUrl,
  isFirst = false,
  isLast = false,
}: IdentificationCardCombinedProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Tarjeta horizontal (anverso + reverso) */}
      <div className="flex items-center card-unit">
        {/* Anverso a la izquierda */}
        <IdentificationCardDisplay
          personName={personName}
          nie={nie}
          validityDateStart={validityDateStart}
          validityDateEnd={validityDateEnd}
          photoUrl={photoUrl}
          title="TARJETA DE IDENTIFICACIÓN"
          logoTextLine1="MPDL"
          logoTextLine2="Movimiento por la Paz"
          addressLine1="C/ José Tamayo 6"
          addressLine2="18008 GRANADA"
          programInfo={"Programa\nAcogida\nHumanitaria\nRD 441/2007"}
          contactPhoneText="Tlf de contacto"
          isFirst={isFirst}
          isLast={isLast}
        />

        {/* Línea discontinua para doblar - vertical */}
        <div className="h-[50mm] border-l-2 border-dashed border-gray-400 relative">
          <div className="absolute left-[-13px] top-1/2 transform -translate-y-1/2 -rotate-90 text-[7px] text-gray-500 bg-white px-1 whitespace-nowrap">
            ✂ Doblar aquí
          </div>
        </div>

        {/* Reverso a la derecha */}
        <IdentificationCardReverseDisplay isFirst={isFirst} isLast={isLast} />
      </div>

      {/* Línea discontinua horizontal para separar tarjetas (solo si no es la última) */}
      {!isLast && (
        <div className="w-full border-t-2 border-dashed border-gray-400 relative">
          <div className="absolute left-1/2 top-[-7px] transform -translate-x-1/2 text-[7px] text-gray-500 bg-white px-1">
            ✂ Cortar aquí
          </div>
        </div>
      )}
    </div>
  )
}
