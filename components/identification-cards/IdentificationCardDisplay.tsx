import Image from "next/image"

interface IdentificationCardDisplayProps {
  personName: string
  nie: string
  validityDateStart?: string
  validityDateEnd?: string
  photoUrl?: string | null
  title: string
  logoTextLine1: string
  logoTextLine2: string
  addressLine1: string
  addressLine2: string
  programInfo: string
  contactPhoneText: string
  isFirst?: boolean
  isLast?: boolean
}

export function IdentificationCardDisplay({
  personName,
  nie,
  validityDateStart,
  validityDateEnd,
  photoUrl,
  title,
  logoTextLine1,
  logoTextLine2,
  addressLine1,
  addressLine2,
  programInfo,
  contactPhoneText,
  isFirst = false,
  isLast = false,
}: IdentificationCardDisplayProps) {
  return (
    <div
      className={`w-[82mm] h-[50mm] bg-white border-2 border-dashed border-r-0 ${isFirst ? "border-t-2" : "border-t-0"} ${isLast ? "border-b-2" : "border-b-0"} border-black rounded-none p-1.5 text-xs font-sans relative overflow-hidden print:border-black print:border-r-0 print:border-dashed ${isFirst ? "print:border-t-2" : "print:border-t-0"} ${isLast ? "print:border-b-2" : "print:border-b-0"}`}
    >
      {/* Marca de agua - proporcionalmente reducida */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-52 h-52 relative">
          <Image src="/images/favicon.jpg" alt="Watermark" fill className="object-contain" />
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-center items-center mb-1.5 relative z-10">
        <div className="font-bold text-[10px] text-blue-600 border-b border-black pb-0.5 whitespace-nowrap tracking-widest">
          {title}
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-1.5 relative z-10">
        {/* Photo section with contact info - proporcionalmente reducida */}
        <div className="flex flex-col">
          <div className="w-20 h-24 border border-black bg-gray-100 flex-shrink-0 overflow-hidden">
            {photoUrl ? (
              <Image
                src={photoUrl || "/placeholder.svg"}
                alt="Foto de identificación"
                width={80}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[7px]">FOTO</div>
            )}
          </div>
          <div className="text-[8px] text-black mt-0.5">
            <div>Tlf de contacto</div>
            <div className="text-[9px] font-bold text-black">635 17 89 55</div>
            <div className="text-[9px] font-bold text-black">635 17 92 03</div>
          </div>
        </div>

        {/* Information section */}
        <div className="flex-1 space-y-0.5">
          <div>
            <div className="font-bold text-[10px] text-black">{personName}</div>
          </div>
          <div>
            <div className="font-bold text-[9px] text-black">NIE: {nie}</div>
          </div>
          <div className="text-[8px] text-black leading-tight">
            <div>{addressLine1}</div>
            <div>{addressLine2}</div>
          </div>
          <div className="text-[7px] text-black leading-tight mt-1">
            <div>Programa</div>
            <div>Acogida</div>
            <div>Humanitaria</div>
            <div>RD 441/2007</div>
          </div>
        </div>

        {/* Logo section with validity dates - proporcionalmente reducido */}
        <div className="w-20 flex flex-col items-center">
          <div className="w-[75px] h-[75px] relative mb-2">
            <Image src="/images/mpdl-logo.png" alt="MPDL Logo" fill className="object-contain" />
          </div>
          {validityDateStart && validityDateEnd && (
            <div className="text-[7px] text-black leading-tight text-center mt-2">
              <div>Válido:</div>
              <div>Desde: {validityDateStart}</div>
              <div>Hasta: {validityDateEnd}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
