'use client'

import { CoreSpinLoader } from '@/components/ui/core-spin-loader'

export default function LoadersDemo() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
            Core Spin Loader
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Componente animado de carga con efecto visual moderno
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Demo 1 */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white text-center">
              Loader por defecto
            </h2>
            <CoreSpinLoader />
          </div>

          {/* Demo 2 */}
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950 dark:to-cyan-950 rounded-lg p-8 border border-emerald-200 dark:border-emerald-800">
            <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white text-center">
              Con fondo oscuro
            </h2>
            <div className="bg-slate-900 rounded-lg p-8">
              <CoreSpinLoader />
            </div>
          </div>

          {/* Demo 3 */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white text-center">
              Uso en formulario
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                />
              </div>
              <div className="flex justify-center pt-4">
                <CoreSpinLoader />
              </div>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 bg-slate-50 dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Características
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
            <li className="flex items-center">
              <span className="text-emerald-500 mr-3">✓</span>
              Animación suave y continua
            </li>
            <li className="flex items-center">
              <span className="text-emerald-500 mr-3">✓</span>
              Modo claro y oscuro
            </li>
            <li className="flex items-center">
              <span className="text-emerald-500 mr-3">✓</span>
              Texto animado dinámico
            </li>
            <li className="flex items-center">
              <span className="text-emerald-500 mr-3">✓</span>
              Diseño responsive
            </li>
            <li className="flex items-center">
              <span className="text-emerald-500 mr-3">✓</span>
              Sin dependencias externas
            </li>
            <li className="flex items-center">
              <span className="text-emerald-500 mr-3">✓</span>
              Personalizable con Tailwind
            </li>
          </ul>
        </div>

        {/* Usage */}
        <div className="mt-16 bg-slate-950 dark:bg-slate-900 rounded-lg p-8 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Uso
          </h2>
          <pre className="bg-slate-900 p-4 rounded text-emerald-400 overflow-x-auto">
            {`import { CoreSpinLoader } from '@/components/ui/core-spin-loader'

export default function Page() {
  return <CoreSpinLoader />
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}
