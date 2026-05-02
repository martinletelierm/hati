'use client'

import { useEffect, useState } from 'react'

type Order = {
  id: string
  numero_pedido: string
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

const COLUMNS: { key: keyof Order; label: string; format?: (v: any) => string }[] = [
  { key: 'created_at',    label: 'Fecha',        format: (v) => new Date(v).toLocaleString('es-CL') },
  { key: 'numero_pedido', label: 'N° Comprobante' },
  { key: 'status',        label: 'Estado' },
  { key: 'nombre',        label: 'Nombre' },
  { key: 'email',         label: 'Email' },
  { key: 'telefono',      label: 'Teléfono' },
  { key: 'rut',           label: 'RUT' },
  { key: 'direccion',     label: 'Dirección' },
  { key: 'departamento',  label: 'Depto/Casa', format: (v) => v ?? '—' },
  { key: 'comuna',        label: 'Comuna' },
  { key: 'ciudad',        label: 'Ciudad' },
  { key: 'region',        label: 'Región' },
  { key: 'cantidad',      label: 'Cantidad' },
  { key: 'precio_total',  label: 'Precio',        format: (v) => `$${Number(v).toLocaleString('es-CL')}` },
]

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  paid:      'bg-green-100 text-green-800',
  shipped:   'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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
    const headers = COLUMNS.map((c) => c.label).join(',')
    const rows = filtered.map((o) =>
      COLUMNS.map((c) => {
        const v = c.format ? c.format(o[c.key]) : o[c.key] ?? ''
        return `"${String(v).replace(/"/g, '""')}"`
      }).join(',')
    )
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
                    {COLUMNS.map((c) => (
                      <th key={c.key} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                        {c.label}
                      </th>
                    ))}
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      {COLUMNS.map((c) => (
                        <td key={c.key} className="px-4 py-3 whitespace-nowrap text-gray-700">
                          {c.key === 'status' ? (
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                              {order.status}
                            </span>
                          ) : c.format ? c.format(order[c.key]) : String(order[c.key] ?? '-')}
                        </td>
                      ))}
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
