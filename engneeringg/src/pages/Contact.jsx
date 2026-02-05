import { useState } from 'react'
import Container from '../components/Container'
import { apiFetch } from '../lib/api'

export default function Contact() {
  const contactEmail = 'inquiry@unistone.co.uk'
  const contactPhone = '+447564892282'
  const addressText = 'Unistone Yard, Dartford, Kent'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [humanChecked, setHumanChecked] = useState(false)
  const [humanError, setHumanError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (submitStatus === 'submitting') return

    if (!humanChecked) {
      setHumanError('Please confirm you are human.')
      setSubmitStatus('idle')
      return
    }

    setSubmitStatus('submitting')
    setSubmitError('')
    setHumanError('')
    try {
      await apiFetch('/api/contacts', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      })
      setSubmitStatus('success')
      setName('')
      setEmail('')
      setMessage('')
      setHumanChecked(false)
    } catch (err) {
      setSubmitStatus('error')
      setSubmitError(err?.message || 'Failed to send message')
    }
  }

  return (
    <section className="bg-white">
      <Container className="py-16">
        <h1 className="text-2xl font-semibold text-gray-800">Contact Us</h1>
        <hr className="my-4" />

        <div className="space-y-2 text-sm text-gray-700">
          <p>If you have any questions please get in touch</p>
          <p>
            Email:{' '}
            <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:text-blue-700">
              {contactEmail}
            </a>
          </p>
          <p>
            Phone: {contactPhone} (8.30am – 4.30pm Monday to Friday) <span className="font-semibold">Closed</span> weekends & Bank Holidays.
          </p>
         
          <p>
            Address: {addressText}
          </p>
        </div>

        <hr className="my-6" />

        <p className="mb-4 text-sm text-gray-700">Alternatively, use this contact form and we will get back to you as soon as possible.</p>
        <p className="mb-2 text-xs text-red-600">*Required Field</p>

        <form className="max-w-2xl space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium">Name: <span className="text-red-600">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email Address: <span className="text-red-600">*</span></label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Message: <span className="text-red-600">*</span></label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="w-fit">
            <div className="flex items-center gap-3 border border-gray-300 p-3">
              <input
                type="checkbox"
                checked={humanChecked}
                onChange={(e) => {
                  setHumanChecked(e.target.checked)
                  if (e.target.checked) setHumanError('')
                }}
              />
              <span className="text-sm">I'm not a robot</span>
            </div>
            {humanError ? <p className="mt-2 text-xs font-semibold text-red-600">{humanError}</p> : null}
          </div>

          <button
            type="submit"
            disabled={submitStatus === 'submitting' || !humanChecked}
            className={
              'bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-800 ' +
              (submitStatus === 'submitting' || !humanChecked ? 'cursor-not-allowed opacity-60' : '')
            }
          >
            {submitStatus === 'submitting' ? 'SENDING...' : 'SEND'}
          </button>

          {submitStatus === 'success' ? (
            <p className="text-sm font-semibold text-emerald-700">Message sent successfully.</p>
          ) : null}

          {submitStatus === 'error' ? (
            <p className="text-sm font-semibold text-red-700">{submitError}</p>
          ) : null}
        </form>
      </Container>
    </section>
  )
}
