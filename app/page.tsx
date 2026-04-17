"use client"
import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { PageHeader } from "@/components/core/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardIcon as IdCardIcon, Printer, Camera, FileImage, PlusCircle, Trash2, Download } from "lucide-react"
import { IdentificationCardCombined } from "@/components/identification-cards/IdentificationCardCombined"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import type { DateRange } from "react-day-picker"
import { format, addYears, isValid } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface CardData {
  id: string
  personName: string
  nie: string
  validityDateStart?: string
  validityDateEnd?: string
  photoUrl?: string | null
}

export default function IdentificationCardsPage() {
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)

  const [currentPersonName, setCurrentPersonName] = useState("MAMADOU DIALLO")
  const [currentNie, setCurrentNie] = useState("Z1234567Q")
  const [currentValidityDateRange, setCurrentValidityDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addYears(new Date(), 1),
  })
  const [currentPhotoPreview, setCurrentPhotoPreview] = useState<string | null>(null)
  const [currentSelectedPhotoFile, setCurrentSelectedPhotoFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [cardList, setCardList] = useState<CardData[]>([])

  const photoFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (currentPhotoPreview) {
        URL.revokeObjectURL(currentPhotoPreview)
      }
    }
  }, [currentPhotoPreview])

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Archivo no válido",
          description: "Por favor, selecciona un archivo de imagen.",
          variant: "destructive",
        })
        setCurrentSelectedPhotoFile(null)
        if (currentPhotoPreview) URL.revokeObjectURL(currentPhotoPreview)
        setCurrentPhotoPreview(null)
        return
      }
      setCurrentSelectedPhotoFile(file)
      if (currentPhotoPreview) {
        URL.revokeObjectURL(currentPhotoPreview)
      }
      setCurrentPhotoPreview(URL.createObjectURL(file))
    }
    if (event.target) {
      event.target.value = ""
    }
  }

  const triggerFileDialog = (captureMode?: "user" | "environment") => {
    if (photoFileInputRef.current) {
      if (captureMode) {
        photoFileInputRef.current.setAttribute("capture", captureMode)
      } else {
        photoFileInputRef.current.removeAttribute("capture")
      }
      photoFileInputRef.current.click()
    }
  }

  const handleAddCardToList = async () => {
    if (!currentPersonName.trim()) {
      toast({ title: "Error", description: "El nombre es obligatorio.", variant: "destructive" })
      return
    }
    if (!currentNie.trim()) {
      toast({ title: "Error", description: "El NIE es obligatorio.", variant: "destructive" })
      return
    }

    let photoDataUrl: string | null = null
    if (currentSelectedPhotoFile) {
      photoDataUrl = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(currentSelectedPhotoFile)
      })
    }

    const formattedValidityDateStart =
      currentValidityDateRange?.from && isValid(currentValidityDateRange.from)
        ? format(currentValidityDateRange.from, "dd/MM/yyyy", { locale: es })
        : undefined

    const formattedValidityDateEnd =
      currentValidityDateRange?.to && isValid(currentValidityDateRange.to)
        ? format(currentValidityDateRange.to, "dd/MM/yyyy", { locale: es })
        : undefined

    const newCard: CardData = {
      id: crypto.randomUUID(),
      personName: currentPersonName,
      nie: currentNie,
      validityDateStart: formattedValidityDateStart,
      validityDateEnd: formattedValidityDateEnd,
      photoUrl: photoDataUrl,
    }

    setCardList((prevList) => [...prevList, newCard])
    toast({
      title: "Tarjeta Añadida",
      description: `${currentPersonName} ha sido añadido/a a la lista de impresión.`,
    })

    setCurrentPersonName("")
    setCurrentNie("")
    setCurrentValidityDateRange({ from: new Date(), to: addYears(new Date(), 1) })
    if (currentPhotoPreview) URL.revokeObjectURL(currentPhotoPreview)
    setCurrentPhotoPreview(null)
    setCurrentSelectedPhotoFile(null)
    if (photoFileInputRef.current) photoFileInputRef.current.value = ""
  }

  const handleRemoveCardFromList = (idToRemove: string) => {
    setCardList((prevList) => prevList.filter((card) => card.id !== idToRemove))
    toast({
      title: "Tarjeta Eliminada",
      description: "La tarjeta ha sido eliminada de la lista.",
      variant: "destructive",
    })
  }

  const handlePrint = async () => {
    if (cardList.length === 0) {
      toast({
        title: "Lista Vacía",
        description: "Añade al menos una tarjeta a la lista antes de imprimir.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Esperar un momento para que las imágenes se carguen completamente
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Configurar la impresión con estilos idénticos a la previsualización
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        throw new Error("No se pudo abrir la ventana de impresión")
      }

      const printContent = printRef.current?.innerHTML || ""

      // Obtener todos los estilos CSS actuales
      const styleSheets = Array.from(document.styleSheets)
      let allStyles = ""

      try {
        styleSheets.forEach((styleSheet) => {
          try {
            const rules = Array.from(styleSheet.cssRules || styleSheet.rules || [])
            rules.forEach((rule) => {
              allStyles += rule.cssText + "\n"
            })
          } catch (e) {
            // Ignorar errores de CORS en hojas de estilo externas
          }
        })
      } catch (e) {
        console.warn("No se pudieron obtener todos los estilos:", e)
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Tarjetas de Identificación</title>
            <meta charset="utf-8">
            <style>
              ${allStyles}
              
              /* Estilos adicionales para garantizar fidelidad */
              * { 
                margin: 0; 
                padding: 0; 
                box-sizing: border-box; 
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              body { 
                font-family: Arial, sans-serif !important;
                background: white !important;
                color: black !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              
              @page {
                margin: 15mm !important;
                size: A4 !important;
              }
              
              .no-print { 
                display: none !important; 
              }
              
              .cards-strip {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                width: 100% !important;
                background: white !important;
              }
              
              .card-unit {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              
              .border-dashed {
                border-style: dashed !important;
                border-color: #9ca3af !important;
              }
              
              img {
                max-width: 100% !important;
                height: auto !important;
              }
            </style>
          </head>
          <body>
            <div style="padding: 0; margin: 0; background: white;">
              ${printContent}
            </div>
          </body>
        </html>
      `)

      printWindow.document.close()

      // Esperar a que se cargue completamente
      printWindow.onload = () => {
        // Dar tiempo adicional para que las imágenes se carguen
        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
          printWindow.close()
        }, 500)
      }

      toast({
        title: "Impresión Iniciada",
        description: `Se imprimirán ${cardList.length} tarjetas exactamente como se ven en la previsualización.`,
      })
    } catch (error) {
      console.error("Error al imprimir:", error)
      toast({
        title: "Error de Impresión",
        description: "No se pudo iniciar la impresión. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    if (cardList.length === 0) {
      toast({
        title: "Lista Vacía",
        description: "Añade al menos una tarjeta a la lista antes de descargar.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Importar html2canvas dinámicamente
      const html2canvas = (await import("html2canvas")).default

      if (!printRef.current) {
        throw new Error("No se encontró el contenido para descargar")
      }

      // Configurar opciones para máxima fidelidad
      const canvas = await html2canvas(printRef.current, {
        scale: 3, // Mayor resolución para mejor calidad
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: printRef.current.scrollWidth,
        height: printRef.current.scrollHeight,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
      })

      // Convertir canvas a blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("No se pudo generar la imagen")
          }

          // Crear URL del blob
          const url = URL.createObjectURL(blob)

          // Crear enlace de descarga
          const link = document.createElement("a")
          link.download = `tarjetas-identificacion-${new Date().toISOString().split("T")[0]}.png`
          link.href = url

          // Simular click para descargar
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Limpiar URL del blob después de un momento
          setTimeout(() => URL.revokeObjectURL(url), 1000)

          toast({
            title: "Descarga Completada",
            description: `Se descargaron ${cardList.length} tarjetas con máxima fidelidad.`,
          })
        },
        "image/png",
        1.0,
      )
    } catch (error) {
      console.error("Error al descargar:", error)
      toast({
        title: "Error de Descarga",
        description: "No se pudo descargar las tarjetas. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Tarjetas de Identificación"
        description="Configura los datos, añade tarjetas a la lista y luego previsualiza/imprime."
        actions={
          <div className="flex gap-2 no-print">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              disabled={isProcessing || cardList.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              {isProcessing ? "Procesando..." : `Descargar (${cardList.length})`}
            </Button>
            <Button onClick={handlePrint} variant="default" size="sm" disabled={isProcessing || cardList.length === 0}>
              <Printer className="mr-2 h-4 w-4" />
              {isProcessing ? "Procesando..." : `Imprimir (${cardList.length})`}
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        <Card className="lg:col-span-1 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center text-sky-600">
              <IdCardIcon className="mr-2 h-6 w-6 text-red-600" />
              Configurar Nueva Tarjeta
            </CardTitle>
            <CardDescription>Introduce los datos para la próxima tarjeta a añadir a la lista.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sky-600" htmlFor="personName">Nombre y Apellidos</Label>
              <Input
                id="personName"
                value={currentPersonName}
                onChange={(e) => setCurrentPersonName(e.target.value.toUpperCase())}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <Label className="text-sky-500" htmlFor="nie">NIE</Label>
              <Input
                id="nie"
                value={currentNie}
                onChange={(e) => setCurrentNie(e.target.value.toUpperCase())}
                placeholder="Número de NIE"
              />
            </div>
            <div>
              <Label className="text-sky-700" htmlFor="validityDate">Fecha de Validez</Label>
              <DatePickerWithRange
                id="validityDate"
                date={currentValidityDateRange}
                onDateChange={setCurrentValidityDateRange}
              />
            </div>
            <div>
              <Label className="text-cyan-600">Foto de Identificación (para la nueva tarjeta)</Label>
              <Input
                type="file"
                accept="image/*"
                ref={photoFileInputRef}
                onChange={handlePhotoSelect}
                className="hidden"
                id="photo-input"
              />
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <Button type="button" variant="outline" onClick={() => triggerFileDialog()} className="w-full">
                  <FileImage className="mr-2 h-4 w-4" /> Seleccionar de Galería
                </Button>
                <Button type="button" variant="outline" onClick={() => triggerFileDialog("user")} className="w-full">
                  <Camera className="mr-2 h-4 w-4" /> Usar Cámara
                </Button>
              </div>
              {currentPhotoPreview && (
                <div className="mt-3 relative w-32 h-40 mx-auto border rounded overflow-hidden">
                  <Image
                    src={currentPhotoPreview || "/placeholder.svg"}
                    alt="Vista previa de la foto actual"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <Button onClick={handleAddCardToList} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir Tarjeta a la Lista
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="shadow-none">
            <CardHeader className="no-print">
              <CardTitle className="text-sky-600">Previsualización de Tarjetas ({cardList.length})</CardTitle>
              <CardDescription>Vista exacta de cómo se imprimirán las tarjetas</CardDescription>
            </CardHeader>
            <CardContent className="section-to-print-id-card">
              <div ref={printRef}>
                {cardList.length > 0 ? (
                  <div className="cards-strip flex flex-col items-center bg-white">
                    {cardList.map((card, index) => (
                      <div key={card.id} className="relative group">
                        <IdentificationCardCombined
                          personName={card.personName}
                          nie={card.nie}
                          validityDateStart={card.validityDateStart}
                          validityDateEnd={card.validityDateEnd}
                          photoUrl={card.photoUrl}
                          isFirst={index === 0}
                          isLast={index === cardList.length - 1}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity no-print p-1 h-auto z-10"
                          onClick={() => handleRemoveCardFromList(card.id)}
                          aria-label="Quitar tarjeta"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-10 no-print">
                    Añade tarjetas desde el formulario para verlas aquí.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {cardList.length > 0 && (
        <div className="mt-6 no-print text-center space-y-2">
          <p className="text-muted-foreground">
            🎯 <strong>Impresión fiel</strong> - Lo que ves es exactamente lo que se imprime
          </p>
          <p className="text-sm text-muted-foreground">
            💡 <strong>Instrucciones:</strong> Después de imprimir, corta por las líneas discontinuas horizontales para
            separar las tarjetas y dobla cada una por su línea vertical central.
          </p>
        </div>
      )}
    </AppShell>
  )
}
