import { Bell, Building2, Shield, User } from 'lucide-react'
import { useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'

const toggles = [
  { key: 'newMatch', label: 'Notifikasi match baru', description: 'Dapatkan notifikasi saat ada pasangan panas baru yang cocok.' },
  { key: 'sensorAlert', label: 'Peringatan sensor', description: 'Kirim peringatan saat sensor offline atau membaca nilai di luar rentang.' },
  { key: 'weeklyReport', label: 'Laporan mingguan', description: 'Ringkasan kelayakan pemulihan panas dikirim setiap minggu.' },
]

export function SettingsPage() {
  const { showToast } = useToast()
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    newMatch: true,
    sensorAlert: true,
    weeklyReport: false,
  })

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Pengaturan</h1>
        <p className="mt-1 text-sm text-text-secondary">Kelola profil, organisasi, dan preferensi notifikasi Anda.</p>
      </div>

      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2.5">
          <User className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-base font-bold text-text">Profil Pengguna</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Lengkap" defaultValue="Andi Wijaya" />
          <Field label="Email" defaultValue="andi.wijaya@semennusantara.co.id" />
          <Field label="Jabatan" defaultValue="Operator Kawasan" />
          <Field label="Nomor Telepon" defaultValue="+62 812-3456-7890" />
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <div className="flex items-center gap-2.5">
          <Building2 className="h-4.5 w-4.5 text-turquoise-dark" />
          <h2 className="text-base font-bold text-text">Organisasi</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Perusahaan" defaultValue="PT Semen Nusantara" />
          <Field label="Kawasan Industri" defaultValue="Kawasan Industri Morowali" />
        </div>
      </Card>

      <Card className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-2.5">
          <Bell className="h-4.5 w-4.5 text-green-dark" />
          <h2 className="text-base font-bold text-text">Notifikasi</h2>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {toggles.map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-semibold text-text">{toggle.label}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{toggle.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enabled[toggle.key]}
                onClick={() => setEnabled((prev) => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  enabled[toggle.key] ? 'bg-turquoise' : 'bg-black/15'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform ${
                    enabled[toggle.key] ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4.5 w-4.5 text-text-secondary" />
          <div>
            <p className="text-sm font-semibold text-text">Simpan perubahan</p>
            <p className="text-xs text-text-secondary">Perubahan akan diterapkan ke seluruh sesi aktif Anda.</p>
          </div>
        </div>
        <Button onClick={() => showToast('Pengaturan berhasil disimpan.')}>Simpan</Button>
      </Card>
    </PageContainer>
  )
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold tracking-wide text-text-secondary uppercase">{label}</span>
      <input
        type="text"
        defaultValue={defaultValue}
        className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm text-text focus:border-turquoise focus:outline-none"
      />
    </label>
  )
}
