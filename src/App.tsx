import { useEffect, useReducer } from 'react'
import { ImportCard } from './components/ImportCard'
import { DesignComplexity } from './components/DesignComplexity'
import { StyleSelector } from './components/StyleSelector'
import { PageCountAndEffort } from './components/PageCountAndEffort'
import { AddonsChecklist } from './components/AddonsChecklist'
import { CustomSoftwareSection } from './components/CustomSoftwareSection'
import { RateSettings } from './components/RateSettings'
import { PriceSummary } from './components/PriceSummary'
import { MobilePriceBar } from './components/MobilePriceBar'
import { calculatorReducer, loadPersistedState, persistState } from './calc/state'
import { calculatePrice } from './calc/pricing'

function App() {
  const [state, dispatch] = useReducer(calculatorReducer, undefined, loadPersistedState)

  useEffect(() => {
    persistState(state)
  }, [state])

  const breakdown = calculatePrice(state)

  return (
    <div className="min-h-svh bg-[#0b0c10] text-slate-100">
      <header className="border-b border-slate-800/80 px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-bold tracking-tight">HWA Website-Kalkulator</h1>
          <p className="text-sm text-slate-500">Interne Projektkalkulation für Web-Angebote</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 pb-24 lg:pb-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-5">
          <ImportCard onApply={(result) => dispatch({ type: 'APPLY_IMPORT', result })} />

          <PageCountAndEffort
            pageCount={state.pageCount}
            onPageCount={(value) => dispatch({ type: 'SET_PAGE_COUNT', value })}
          />

          <AddonsChecklist
            quantities={state.addonQuantities}
            onToggle={(id) => dispatch({ type: 'TOGGLE_ADDON', id })}
            onQuantityChange={(id, value) => dispatch({ type: 'SET_ADDON_QUANTITY', id, value })}
          />

          <CustomSoftwareSection
            hours={state.customSoftwareHours}
            onHours={(value) => dispatch({ type: 'SET_CUSTOM_SOFTWARE_HOURS', value })}
            rate={state.customSoftwareRate}
            onRate={(value) => dispatch({ type: 'SET_CUSTOM_SOFTWARE_RATE', value })}
          />

          <DesignComplexity
            complexity={state.complexity}
            onComplexity={(value) => dispatch({ type: 'SET_COMPLEXITY', value })}
            applySurcharge={state.applyComplexitySurcharge}
            onApplySurcharge={(value) => dispatch({ type: 'SET_APPLY_COMPLEXITY_SURCHARGE', value })}
            surchargePercent={state.complexitySurchargePercent}
            onSurchargePercent={(value) => dispatch({ type: 'SET_COMPLEXITY_SURCHARGE_PERCENT', value })}
          />

          <StyleSelector value={state.style} onChange={(value) => dispatch({ type: 'SET_STYLE', value })} />

          <RateSettings
            discountPercent={state.discountPercent}
            onDiscountPercent={(value) => dispatch({ type: 'SET_DISCOUNT', value })}
          />
        </div>

        <PriceSummary state={state} breakdown={breakdown} onReset={() => dispatch({ type: 'RESET' })} />
      </main>

      <MobilePriceBar total={breakdown.total} />
    </div>
  )
}

export default App
