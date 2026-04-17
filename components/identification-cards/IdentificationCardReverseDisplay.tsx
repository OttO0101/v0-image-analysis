import Image from "next/image"

interface IdentificationCardReverseDisplayProps {
  isFirst?: boolean
  isLast?: boolean
}

export function IdentificationCardReverseDisplay({
  isFirst = false,
  isLast = false,
}: IdentificationCardReverseDisplayProps) {
  return (
    <div
      className={`w-[82mm] h-[50mm] bg-white border-2 border-dashed border-l-0 ${isFirst ? "border-t-2" : "border-t-0"} ${isLast ? "border-b-2" : "border-b-0"} border-black rounded-none p-2.5 text-xs font-sans relative overflow-hidden print:border-black print:border-l-0 print:border-dashed ${isFirst ? "print:border-t-2" : "print:border-t-0"} ${isLast ? "print:border-b-2" : "print:border-b-0"}`}
    >
      {/* Marca de agua - proporcionalmente reducida */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-52 h-52 relative">
          <Image src="/images/favicon.jpg" alt="Watermark" fill className="object-contain" />
        </div>
      </div>

      <div className="h-full flex flex-col justify-start space-y-2.5 relative z-10">
        <div className="text-[8px] text-black leading-tight">
          <p className="mb-1.5">
            La persona identificada en este documento se encuentra actualmente acogida en el Programa de Acogida
            Humanitaria de la ONG Movimiento por la Paz -MPDL- financiado por el Ministerio de Inclusión Seguridad
            Social y Migraciones.
          </p>

          <p className="mb-1.5">
            Se solicita que, en la medida de lo posible, se facilite el acceso a los recursos necesarios para el
            correcto desarrollo de sus actividades diarias.
          </p>
        </div>

        <div className="border-t border-gray-300 pt-1.5">
          <div className="text-[8px] text-black leading-tight">
            <p className="mb-0.5">Firma de responsable de Centro</p>
            <p className="mb-0.5">Emilia Alonso Galindo</p>
            <p>Delegación de Granada</p>
          </div>
        </div>
      </div>
    </div>
  )
}
