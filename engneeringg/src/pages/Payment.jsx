import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { cn } from '../lib/cn'
import logo from '../assets/logo.png'

export default function Payment() {
  const navigate = useNavigate()
  const baseDate = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDateIso, setSelectedDateIso] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    while (d.getDay() === 0 || d.getDay() === 6) {
      d.setDate(d.getDate() + 1)
    }
    return d.toISOString().slice(0, 10)
  })
  const [selectedTime, setSelectedTime] = useState('')

  const visibleDates = useMemo(() => {
    const start = new Date(baseDate)
    start.setDate(start.getDate() + weekOffset * 7)

    const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      date.setHours(0, 0, 0, 0)

      const iso = date.toISOString().slice(0, 10)
      const disabled = date.getDay() === 0 || date.getDay() === 6

      return {
        iso,
        disabled,
        weekdayShort: weekdayFormatter.format(date),
        dayNumber: String(date.getDate()),
        date,
      }
    })
  }, [baseDate, weekOffset])

  useEffect(() => {
    const stillVisible = visibleDates.some((d) => d.iso === selectedDateIso)
    if (stillVisible) return
    const next = visibleDates.find((d) => !d.disabled)
    if (!next) return
    setSelectedDateIso(next.iso)
    setSelectedTime('')
  }, [selectedDateIso, visibleDates])

  const selectedDateLabel = useMemo(() => {
    const d = new Date(`${selectedDateIso}T00:00:00`)
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(d)
  }, [selectedDateIso])

  const selectedTimeRange = useMemo(() => {
    if (!selectedTime) return ''

    const match = selectedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/)
    if (!match) return selectedTime
    const [, hhRaw, mmRaw, apRaw] = match

    let hh = Number(hhRaw)
    const mm = Number(mmRaw)
    const ap = apRaw.toUpperCase()

    if (ap === 'PM' && hh !== 12) hh += 12
    if (ap === 'AM' && hh === 12) hh = 0

    const start = new Date(2000, 0, 1, hh, mm, 0, 0)
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + 60)

    const fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
    return `${fmt.format(start)} - ${fmt.format(end)}`
  }, [selectedTime])

  const morningSlots = useMemo(() => ['09:00 AM', '10:00 AM', '11:00 AM'], [])
  const afternoonSlots = useMemo(() => ['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'], [])

  const selectedPackage = useMemo(() => ({ id: 'concept', name: 'Concept Review', amount: 150 }), [])

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)

  const detailsValid = useMemo(() => {
    if (!selectedTime) return false
    if (!customerName.trim()) return false
    if (!customerPhone.trim()) return false
    if (customerEmail.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())
      if (!ok) return false
    }
    return true
  }, [customerEmail, customerName, customerPhone, selectedTime])

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Consultation"
            title="Book a Free Stone Consultation"
            subtitle="Get expert guidance on marble, granite & natural stone selection – absolutely free."
            tone="light"
          />
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <div className="rounded-xl border border-black/10 bg-neutral-50 p-6">
                <p className="text-xs tracking-[0.35em] uppercase text-gold/80">Select day & time</p>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-obsidian">{selectedDateLabel}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white text-obsidian/70 transition-all duration-500 ease-luxury hover:border-black/20 hover:bg-neutral-100"
                      aria-label="Previous week"
                      onClick={() => {
                        setWeekOffset((w) => Math.max(0, w - 1))
                        setSelectedTime('')
                      }}
                      disabled={weekOffset === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white text-obsidian/70 transition-all duration-500 ease-luxury hover:border-black/20 hover:bg-neutral-100"
                      aria-label="Next week"
                      onClick={() => {
                        setWeekOffset((w) => w + 1)
                        setSelectedTime('')
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 -mx-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex min-w-max gap-3">
                    {visibleDates.map((d) => {
                      const isActive = selectedDateIso === d.iso
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          disabled={d.disabled}
                          onClick={() => {
                            setSelectedDateIso(d.iso)
                            setSelectedTime('')
                          }}
                          className={cn(
                            'flex w-[72px] flex-col items-center justify-center gap-1 rounded-lg border px-3 py-3 text-sm transition-all duration-500 ease-luxury',
                            d.disabled
                              ? 'cursor-not-allowed border-black/10 bg-white text-obsidian/35'
                              : isActive
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-black/10 bg-white text-obsidian/80 hover:border-black/20 hover:bg-neutral-100',
                          )}
                          aria-pressed={isActive}
                        >
                          <span className="text-xs font-semibold">{d.weekdayShort}</span>
                          <span className="text-base font-semibold tabular-nums">{d.dayNumber}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <p className="mt-6 text-xs text-obsidian/55">Morning</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {morningSlots.map((slot) => {
                    const active = selectedTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          'flex h-11 min-w-[110px] items-center justify-center rounded-md border bg-white text-sm transition-all duration-500 ease-luxury',
                          active
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-black/10 text-obsidian/70 hover:border-black/20 hover:bg-neutral-100',
                        )}
                        aria-pressed={active}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>

                <p className="mt-6 text-xs text-obsidian/55">Afternoon</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {afternoonSlots.map((slot) => {
                    const active = selectedTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          'flex h-11 min-w-[110px] items-center justify-center rounded-md border bg-white text-sm transition-all duration-500 ease-luxury',
                          active
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-black/10 text-obsidian/70 hover:border-black/20 hover:bg-neutral-100',
                        )}
                        aria-pressed={active}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                {selectedTime ? (
                  <div className="w-full rounded-xl border border-black/10 bg-white p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-sm font-semibold text-obsidian">{selectedDateLabel}</p>
                        <p className="mt-2 text-sm text-obsidian/70">{selectedTimeRange}</p>
                      </div>
                      <button
                        type="button"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        onClick={() => setSelectedTime('')}
                      >
                        Change
                      </button>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-semibold text-obsidian">Enter Details</p>

                      <div className="mt-4 grid gap-3">
                        <label className="grid gap-2">
                          <span className="text-xs text-obsidian/60">Name</span>
                          <input
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="h-11 w-full rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian outline-none transition-all focus:border-blue-600"
                            type="text"
                            placeholder=""
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-xs text-obsidian/60">Phone Number *</span>
                          <input
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="h-11 w-full rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian outline-none transition-all focus:border-blue-600"
                            type="tel"
                            placeholder=""
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-xs text-obsidian/60">Email</span>
                          <input
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="h-11 w-full rounded-md border border-black/10 bg-white px-4 text-sm text-obsidian outline-none transition-all focus:border-blue-600"
                            type="email"
                            placeholder=""
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex items-center justify-end">
                        <button
                          type="button"
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                          onClick={() => setShowNotes((s) => !s)}
                        >
                          Add Notes
                        </button>
                      </div>

                      {showNotes ? (
                        <textarea
                          value={customerNotes}
                          onChange={(e) => setCustomerNotes(e.target.value)}
                          className="mt-3 min-h-[96px] w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm text-obsidian outline-none transition-all focus:border-blue-600"
                        />
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    variant="blue"
                    type="button"
                    disabled={!detailsValid}
                    onClick={() => {
                      navigate('/checkout', {
                        state: {
                          kind: 'consultation',
                          packageId: selectedPackage.id,
                          packageName: selectedPackage.name,
                          amount: selectedPackage.amount,
                          currency: 'USD',
                          schedule: {
                            date: selectedDateLabel,
                            dateIso: selectedDateIso,
                            time: selectedTime,
                          },
                          customer: {
                            name: customerName.trim(),
                            phone: customerPhone.trim(),
                            email: customerEmail.trim(),
                            notes: customerNotes.trim(),
                          },
                        },
                      })
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-5">
            <div className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="h-10 w-10 rounded-md border border-black/10 bg-white object-contain" />
                <p className="font-display text-xl tracking-[0.02em] text-obsidian">Why Choose Our Consultation?</p>
              </div>

              <ul className="mt-6 space-y-3 text-sm leading-7 text-obsidian/70">
                <li>Over 15 years of expertise in natural stone & surfaces</li>
                <li>Expert guidance based on material, application, and durability</li>
                <li>Transparent advice with no obligation or hidden costs</li>
                <li>Trusted by architects, designers, and construction professionals</li>
              </ul>

              <p className="mt-8 text-sm leading-7 text-obsidian/70">
                <span className="font-semibold text-obsidian">*</span>Enjoy a complimentary stone consultation for a limited period. Reserve your slot now and make the right stone choice with confidence.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
