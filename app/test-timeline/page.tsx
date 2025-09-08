'use client'

import Timeline from '@/components/timeline'

export default function TestTimeline() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Test Timeline - Programme Privé</h1>
        <Timeline />
      </div>
    </div>
  )
}