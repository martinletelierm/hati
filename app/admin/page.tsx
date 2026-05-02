'use client'

import { useEffect, useState } from 'react'

type Order = {
  id: string
  tipo_pago: string
  numero_pedido: string
  numero_boleta: string | null
  comprobante_url: string | null
  nombre: string
  email: string
  telefono: string
  rut: string
  direccion: string
  departamento: string | null
  comuna: string
  ciudad: string
  region: string
  cantidad: number
  precio_total: number
  status: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  paid:      'bg-green-100 text-green-800',
  shipped:   'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
}

const TIPO_LABELS: Record<string, string> = {
  transferencia: '🏦 Transferencia',
  maquina:       '💳 Máquina',
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [preview, setPreview] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const filtered = orders.filter((o) => {
    const matchSearch = search === '' || Object.values(o).some((v) =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    )
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
  }

  const exportCSV = () => {
    const headers = [
      'Fecha', 'Tipo Pago', 'N° Comprobante', 'N° Boleta', 'Estado',
      'Nombre', 'Email', 'Teléfono', 'RUT',
      'Dirección', 'Depto', 'Comuna', 'Ciudad', 'Región',
      'Cantidad', 'Precio Total', 'URL Comprobante',
    ].join(',')

    const rows = filtered.map((o) => [
      new Date(o.created_at).toLocaleString('es-CL'),
      o.tipo_pago,
      o.numero_pedido,
      o.numero_boleta ?? '',
      o.status,
      o.nombre, o.email, o.telefono, o.rut,
      o.direccion, o.departamento ?? '', o.comuna, o.ciudad, o.region,
      o.cantidad,
      o.precio_total,
      o.comprobante_url ?? '',
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))

    const csv = [headers, ...rows].join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hati-pedidos-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const total = filtered.reduce((s, o) => s + o.precio_total, 0)
  const pending = filtered.filter((o) => o.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white text-sm font-medium hover:text-gray-300"
            >
              ✕ Cerrar
            </button>
            {preview.endsWith('.pdf') || preview.includes('/pdf') ? (
              <iframe src={preview} className="w-full h-[80vh] rounded-xl" />
            ) : (
              <img src={preview} alt="Comprobante" className="w-full rounded-xl max-h-[80vh] object-contain bg-white" />
            )}
            <a
              href={preview}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center text-white/70 text-xs hover:text-white underline"
            >
              Abrir en nueva pestaña →
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-forest text-white px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            hati · Admin
          </h1>
          <p className="text-white/60 text-sm mt-0.5">Panel de pedidos</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchOrders}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            ↻ Actualizar
          </button>
          <button
            onClick={exportCSV}
            className="bg-orange hover:bg-orange/80 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
          >
            ↓ Exportar CSV
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-[1600px] mx-auto space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI label="Total pedidos" value={String(filtered.length)} color="text-forest" />
          <KPI label="Pendientes de pago" value={String(pending)} color="text-yellow-600" />
          <KPI label="Unidades vendidas" value={String(filtered.reduce((s, o) => s + o.cantidad, 0))} color="text-blue-600" />
          <KPI label="Recaudado" value={`$${total.toLocaleString('es-CL')}`} color="text-green-600" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, comprobante…"
            className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 bg-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="paid">Pagado</option>
            <option value="shipped">Enviado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-400">Cargando pedidos…</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400">Sin pedidos aún</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Fecha', 'Tipo pago', 'N° Comprobante', 'Estado', 'Comprobante', 'Nombre', 'Email', 'Teléfono', 'RUT', 'Dirección', 'Depto', 'Comuna', 'Región', 'Cant.', 'Total', 'Acción'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">{new Date(order.created_at).toLocaleString('es-CL')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs">{TIPO_LABELS[order.tipo_pago] ?? order.tipo_pago}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-gray-700">
                        {order.numero_pedido}
                        {order.numero_boleta && <div className="text-gray-400">Boleta: {order.numero_boleta}</div>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {order.comprobante_url ? (
                          <button
                            onClick={() => setPreview(order.comprobante_url!)}
                            className="text-xs text-forest underline hover:text-forest/70 font-medium"
                          >
                            Ver imagen
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{order.nombre}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">{order.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">{order.telefono}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-gray-700">{order.rut}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[180px] truncate">{order.direccion}{order.departamento ? `, ${order.departamento}` : ''}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{order.departamento ?? '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">{order.comuna}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{order.region}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-forest">{order.cantidad}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-gray-700">${Number(order.precio_total).toLocaleString('es-CL')}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-forest/30 bg-white"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="paid">Pagado</option>
                          <option value="shipped">Enviado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 text-center">
          {filtered.length} pedido{filtered.length !== 1 ? 's' : ''} · Última actualización: {new Date().toLocaleTimeString('es-CL')}
        </p>
      </div>
    </div>
  )
}

function KPI({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`} style={{ fontFamily: 'Georgia, serif' }}>{value}</div>
    </div>
  )
}
