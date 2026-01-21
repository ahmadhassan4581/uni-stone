import { Lock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import logo from '../assets/logo.png'
import { useCart } from '../context/CartContext'

function money(n) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(n)
}

export default function DeliveryDetails() {
  const { detailedItems, subtotal } = useCart()
  const navigate = useNavigate()

  const delivery = 60
  const vat = subtotal * 0.2
  const total = subtotal + delivery

  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [address1, setAddress1] = useState('')
  const [town, setTown] = useState('')
  const [county, setCounty] = useState('')
  const [postcode, setPostcode] = useState('')
  const [telephone, setTelephone] = useState('')
  const [billingSame, setBillingSame] = useState(true)

  const [billingFullName, setBillingFullName] = useState('')
  const [billingCompany, setBillingCompany] = useState('')
  const [billingAddress1, setBillingAddress1] = useState('')
  const [billingTown, setBillingTown] = useState('')
  const [billingCounty, setBillingCounty] = useState('')
  const [billingPostcode, setBillingPostcode] = useState('')
  const [billingTelephone, setBillingTelephone] = useState('')

  const [touched, setTouched] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem('checkout_delivery_details')
    if (!saved) return
    try {
      const data = JSON.parse(saved)
      setFullName(data.fullName ?? '')
      setCompany(data.company ?? '')
      setAddress1(data.address1 ?? '')
      setTown(data.town ?? '')
      setCounty(data.county ?? '')
      setPostcode(data.postcode ?? '')
      setTelephone(data.telephone ?? '')
      setBillingSame(typeof data.billingSame === 'boolean' ? data.billingSame : true)

      if (data?.billing && typeof data.billing === 'object') {
        setBillingFullName(data.billing.fullName ?? '')
        setBillingCompany(data.billing.company ?? '')
        setBillingAddress1(data.billing.address1 ?? '')
        setBillingTown(data.billing.town ?? '')
        setBillingCounty(data.billing.county ?? '')
        setBillingPostcode(data.billing.postcode ?? '')
        setBillingTelephone(data.billing.telephone ?? '')
      }
    } catch {
      // ignore
    }
  }, [])

  const errors = useMemo(() => {
    const e = {}
    if (!fullName.trim()) e.fullName = 'Full name is required.'
    if (!address1.trim()) e.address1 = 'Address line 1 is required.'
    if (!town.trim()) e.town = 'Town/City is required.'
    if (!county.trim()) e.county = 'County is required.'
    if (!postcode.trim()) e.postcode = 'Postcode is required.'
    if (!telephone.trim()) e.telephone = 'Telephone is required.'

    if (!billingSame) {
      if (!billingFullName.trim()) e.billingFullName = 'Full name is required.'
      if (!billingAddress1.trim()) e.billingAddress1 = 'Address line 1 is required.'
      if (!billingTown.trim()) e.billingTown = 'Town/City is required.'
      if (!billingCounty.trim()) e.billingCounty = 'County is required.'
      if (!billingPostcode.trim()) e.billingPostcode = 'Postcode is required.'
      if (!billingTelephone.trim()) e.billingTelephone = 'Telephone is required.'
    }

    return e
  }, [
    fullName,
    address1,
    town,
    county,
    postcode,
    telephone,
    billingSame,
    billingFullName,
    billingAddress1,
    billingTown,
    billingCounty,
    billingPostcode,
    billingTelephone,
  ])

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  function markTouched(key) {
    setTouched((t) => ({ ...t, [key]: true }))
  }

  function onContinue() {
    setTouched({
      fullName: true,
      address1: true,
      town: true,
      county: true,
      postcode: true,
      telephone: true,
      billingFullName: true,
      billingAddress1: true,
      billingTown: true,
      billingCounty: true,
      billingPostcode: true,
      billingTelephone: true,
    })

    if (!isValid) return

    localStorage.setItem(
      'checkout_delivery_details',
      JSON.stringify({
        fullName: fullName.trim(),
        company: company.trim(),
        address1: address1.trim(),
        town: town.trim(),
        county: county.trim(),
        postcode: postcode.trim(),
        telephone: telephone.trim(),
        billingSame,
        billing: billingSame
          ? null
          : {
              fullName: billingFullName.trim(),
              company: billingCompany.trim(),
              address1: billingAddress1.trim(),
              town: billingTown.trim(),
              county: billingCounty.trim(),
              postcode: billingPostcode.trim(),
              telephone: billingTelephone.trim(),
            },
      }),
    )

    navigate('/checkout/summary')
  }

  return (
    <section className="bg-white">
      <Container className="py-8">
        <div className="mb-6 text-center">
          <Link to="/" aria-label="Go to home" className="inline-flex items-center justify-center">
            <img src={logo} alt="UniStone" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-between text-[11px]">
          {['Your Address', 'Delivery Details', 'Order Summary', 'Payment Details', 'Order Complete'].map(
            (step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
                    i === 1 ? 'bg-blue-700 text-white' : 'border border-gray-300 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`ml-2 ${i === 1 ? 'text-blue-700' : 'text-gray-500'}`}>{step}</span>
                {i !== 4 && <div className="mx-4 h-px flex-1 bg-gray-200" />}
              </div>
            ),
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-7">
            <div className="rounded border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Delivery Address</h2>
                <p className="text-[11px] text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </p>
              </div>

              <div className="p-5 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    <span className="text-red-500">*</span> Full Name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => markTouched('fullName')}
                    placeholder="Example: John Smith"
                    className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                      touched.fullName && errors.fullName ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {touched.fullName && errors.fullName ? (
                    <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Company (Optional)</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Example: Uni Stone"
                    className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    <span className="text-red-500">*</span> Address Line 1
                  </label>
                  <input
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    onBlur={() => markTouched('address1')}
                    placeholder="Example: 12 Example St"
                    className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                      touched.address1 && errors.address1 ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {touched.address1 && errors.address1 ? (
                    <p className="mt-1 text-xs text-red-600">{errors.address1}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    <span className="text-red-500">*</span> Town / City
                  </label>
                  <input
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    onBlur={() => markTouched('town')}
                    placeholder="Example: Winchester"
                    className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                      touched.town && errors.town ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {touched.town && errors.town ? (
                    <p className="mt-1 text-xs text-red-600">{errors.town}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    <span className="text-red-500">*</span> County
                  </label>
                  <input
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    onBlur={() => markTouched('county')}
                    placeholder="Example: Greater Manchester"
                    className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                      touched.county && errors.county ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {touched.county && errors.county ? (
                    <p className="mt-1 text-xs text-red-600">{errors.county}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    <span className="text-red-500">*</span> Postcode
                  </label>
                  <input
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onBlur={() => markTouched('postcode')}
                    placeholder="Example: M1 1AA"
                    className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                      touched.postcode && errors.postcode ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {touched.postcode && errors.postcode ? (
                    <p className="mt-1 text-xs text-red-600">{errors.postcode}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">
                    <span className="text-red-500">*</span> Telephone
                  </label>
                  <input
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    onBlur={() => markTouched('telephone')}
                    placeholder="Example: 0123 4567"
                    className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                      touched.telephone && errors.telephone ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {touched.telephone && errors.telephone ? (
                    <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>
                  ) : null}
                </div>

                <label className="flex items-start gap-3 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={billingSame}
                    onChange={(e) => setBillingSame(e.target.checked)}
                  />
                  Billing Address Same as Delivery Address
                </label>

                {!billingSame ? (
                  <div className="mt-6 rounded border border-gray-200">
                    <div className="flex items-center justify-between border-b border-gray-200 p-4">
                      <h3 className="text-sm font-semibold">Billing Address</h3>
                      <p className="text-[11px] text-gray-500">
                        <span className="text-red-500">*</span> Required fields
                      </p>
                    </div>

                    <div className="p-4 space-y-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700">
                          <span className="text-red-500">*</span> Full Name
                        </label>
                        <input
                          value={billingFullName}
                          onChange={(e) => setBillingFullName(e.target.value)}
                          onBlur={() => markTouched('billingFullName')}
                          placeholder="Example: John Smith"
                          className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                            touched.billingFullName && errors.billingFullName
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                        />
                        {touched.billingFullName && errors.billingFullName ? (
                          <p className="mt-1 text-xs text-red-600">{errors.billingFullName}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700">Company (Optional)</label>
                        <input
                          value={billingCompany}
                          onChange={(e) => setBillingCompany(e.target.value)}
                          placeholder="Example: Uni Stone"
                          className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700">
                          <span className="text-red-500">*</span> Address Line 1
                        </label>
                        <input
                          value={billingAddress1}
                          onChange={(e) => setBillingAddress1(e.target.value)}
                          onBlur={() => markTouched('billingAddress1')}
                          placeholder="Example: 12 Example St"
                          className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                            touched.billingAddress1 && errors.billingAddress1
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                        />
                        {touched.billingAddress1 && errors.billingAddress1 ? (
                          <p className="mt-1 text-xs text-red-600">{errors.billingAddress1}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700">
                          <span className="text-red-500">*</span> Town / City
                        </label>
                        <input
                          value={billingTown}
                          onChange={(e) => setBillingTown(e.target.value)}
                          onBlur={() => markTouched('billingTown')}
                          placeholder="Example: Winchester"
                          className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                            touched.billingTown && errors.billingTown ? 'border-red-400' : 'border-gray-300'
                          }`}
                        />
                        {touched.billingTown && errors.billingTown ? (
                          <p className="mt-1 text-xs text-red-600">{errors.billingTown}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700">
                          <span className="text-red-500">*</span> County
                        </label>
                        <input
                          value={billingCounty}
                          onChange={(e) => setBillingCounty(e.target.value)}
                          onBlur={() => markTouched('billingCounty')}
                          placeholder="Example: Greater Manchester"
                          className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                            touched.billingCounty && errors.billingCounty
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                        />
                        {touched.billingCounty && errors.billingCounty ? (
                          <p className="mt-1 text-xs text-red-600">{errors.billingCounty}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700">
                          <span className="text-red-500">*</span> Postcode
                        </label>
                        <input
                          value={billingPostcode}
                          onChange={(e) => setBillingPostcode(e.target.value)}
                          onBlur={() => markTouched('billingPostcode')}
                          placeholder="Example: M1 1AA"
                          className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                            touched.billingPostcode && errors.billingPostcode
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                        />
                        {touched.billingPostcode && errors.billingPostcode ? (
                          <p className="mt-1 text-xs text-red-600">{errors.billingPostcode}</p>
                        ) : null}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700">
                          <span className="text-red-500">*</span> Telephone
                        </label>
                        <input
                          value={billingTelephone}
                          onChange={(e) => setBillingTelephone(e.target.value)}
                          onBlur={() => markTouched('billingTelephone')}
                          placeholder="Example: 0123 4567"
                          className={`mt-2 w-full rounded border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none ${
                            touched.billingTelephone && errors.billingTelephone
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                        />
                        {touched.billingTelephone && errors.billingTelephone ? (
                          <p className="mt-1 text-xs text-red-600">{errors.billingTelephone}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Link to="/checkout" className="text-xs text-blue-600 hover:underline">
                ← Back
              </Link>

              <Button type="button" variant="blue" className="text-sm" onClick={onContinue}>
                <Lock className="mr-2 h-4 w-4" />
                Order Summary →
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="rounded border border-gray-200">
              <div className="border-b border-gray-200 p-5">
                <h2 className="text-sm font-semibold">Order Summary</h2>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {detailedItems.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-14 w-14 border object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.product.name}</p>
                      <p className="text-gray-500">
                        £{item.product.price} × {item.qty}
                      </p>
                    </div>
                    <div className="font-semibold">{money(item.lineTotal)}</div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {money(delivery)} <span className="text-gray-400">(Ex Tax)</span>
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">Includes VAT of {money(vat)}</p>
                </div>

                <Button
                  type="button"
                  variant="blue"
                  className="mt-4 w-full text-sm"
                  onClick={onContinue}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Order Summary →
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10">
            <Lock className="h-6 w-6 text-black/70" />
          </div>
          <div>
            <p className="text-base font-semibold text-[#111111]">Secure Checkout</p>
            <p className="text-sm text-black/50">128-bit Secure Encryption</p>
          </div>

          <div className="mt-2 flex items-center justify-center text-xs text-black/70">
            <Link to="/info/terms" className="px-3 hover:underline">
              Terms &amp; Conditions
            </Link>
            <span className="h-4 w-px bg-black/20" />
            <Link to="/info/privacy" className="px-3 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
