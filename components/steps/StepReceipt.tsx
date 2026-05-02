'use client'

import { useState, useRef } from 'react'
import type { WizardData } from '../PreSaleWizard'

export default function StepReceipt({
  data, update, onNext, onBack,
}: {
  data: WizardData
  update: (p: Partial<WizardData>) => void
  onNext: () => void
  onBack: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setError('Solo se aceptan imágenes (JPG, PNG) o PDF')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no puede superar 10 MB')
      return
    }

    setError('')
    setUploading(true)

    // Preview local
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview('pdf')
    }

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const payload = await res.json().catch(() => ({} as { error?: string; url?: string }))
      if (!res.ok || !payload.url) throw new Error(payload.error ?? 'Upload failed')
      const { url } = payload
      update({ comprobanteFile: file, comprobanteUrl: url })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Error al subir la imagen: ${message}`)
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleNext = () => {
    if (!data.comprobanteUrl) { setError('Sube el comprobante para continuar'); return }
    onNext()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Paso 4</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-forest" style={{ fontFamily: 'Georgia, serif' }}>
          Sube tu comprobante
        </h2>
        <p className="text-gray-400 mt-1 text-sm">Foto o captura del comprobante de transferencia</p>
      </div>

      {/* Upload area */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl transition-colors overflow-hidden ${
            data.comprobanteUrl
              ? 'border-forest bg-forest/5'
              : 'border-gray-200 hover:border-forest hover:bg-gray-50'
          }`}
        >
          {uploading ? (
            <div className="py-10 sm:py-12 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Subiendo…</p>
            </div>
          ) : preview === 'pdf' ? (
            <div className="py-10 sm:py-12 flex flex-col items-center gap-2">
              <span className="text-4xl">📄</span>
              <p className="text-sm font-medium text-forest">PDF subido</p>
              <p className="text-xs text-gray-400">Toca para cambiar</p>
            </div>
          ) : preview ? (
            <div className="relative">
              <img src={preview} alt="Comprobante" className="w-full max-h-56 sm:max-h-64 object-contain p-2" />
              <div className="absolute bottom-2 right-2 bg-white/90 text-xs text-gray-500 px-2 py-1 rounded-lg">
                Toca para cambiar
              </div>
            </div>
          ) : (
            <div className="py-10 sm:py-12 flex flex-col items-center gap-3">
              <span className="text-4xl">📸</span>
              <div className="text-center">
                <p className="text-sm font-semibold text-forest">Subir comprobante</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG o PDF · Máx. 10 MB</p>
              </div>
            </div>
          )}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-w-14 px-5 py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm hover:bg-gray-50 transition-colors"
          aria-label="Volver"
        >←</button>
        <button
          type="button"
          onClick={handleNext}
          disabled={uploading}
          className="flex-1 min-h-14 bg-forest text-white font-semibold py-4 rounded-2xl text-base hover:bg-forest-mid transition-colors disabled:opacity-50"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
