import React from 'react'
import { SpecPanel } from './SharedComponents'

export default function SpecsSection({ phone }) {
  const specs = phone.specs || {}

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <SpecPanel
        title="Display"
        items={[
          { label: 'Size', value: specs.display?.size },
          { label: 'Resolution', value: specs.display?.resolution },
          { label: 'Refresh Rate', value: specs.display?.refreshRate ? `${specs.display.refreshRate} Hz` : null },
          { label: 'Brightness', value: specs.display?.brightness ? `${specs.display.brightness} nits` : null },
        ]}
      />
      <SpecPanel
        title="Performance"
        items={[
          { label: 'Processor', value: specs.performance?.processor },
          { label: 'GPU', value: specs.performance?.gpu },
          { label: 'AnTuTu Score', value: specs.performance?.antutuScore ? Number(specs.performance.antutuScore).toLocaleString('en-IN') : null },
          { label: 'RAM Options', value: Array.isArray(specs.performance?.ramOptions) && specs.performance.ramOptions.length > 0 ? `${specs.performance.ramOptions.join(', ')} GB` : null },
        ]}
      />
      <SpecPanel
        title="Camera"
        items={[
          { label: 'Rear Main', value: specs.camera?.rear?.main?.megapixels ? `${specs.camera.rear.main.megapixels} MP` : null },
          { label: 'Ultra-wide', value: specs.camera?.rear?.ultraWide?.megapixels ? `${specs.camera.rear.ultraWide.megapixels} MP` : null },
          { label: 'Telephoto', value: specs.camera?.rear?.telephoto?.megapixels ? `${specs.camera.rear.telephoto.megapixels} MP` : null },
          { label: 'Front', value: specs.camera?.front?.megapixels ? `${specs.camera.front.megapixels} MP` : null },
        ]}
      />
      <SpecPanel
        title="Battery & Extras"
        items={[
          { label: 'Capacity', value: specs.battery?.capacity ? `${specs.battery.capacity} mAh` : null },
          { label: 'Charging', value: specs.battery?.chargingSpeed ? `${specs.battery.chargingSpeed} W` : null },
          { label: 'Wireless Charging', value: specs.battery?.wirelessCharging ? 'Yes' : 'No' },
          { label: 'OS', value: specs.os || null },
        ]}
      />
    </section>
  )
}
