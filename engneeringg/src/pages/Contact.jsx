import Container from '../components/Container'

export default function Contact() {
  return (
    <section className="bg-white">
      <Container className="py-16">
        <h1 className="text-2xl font-semibold text-gray-800">Contact Us</h1>
        <hr className="my-4" />

        <div className="space-y-2 text-sm text-gray-700">
          <p>If you have any questions please get in touch</p>
          <p>Email: <a href="mailto:sales@marble-mosaics.com" className="text-blue-600">sales@marble-mosaics.com</a></p>
          <p>Phone: 01273 891144 (8.30am – 4.30pm Monday to Friday) <span className="font-semibold">Closed</span> weekends & Bank Holidays.</p>
          <p>
            Our showroom & yard is open for viewings & collections Monday to Friday from 08.30 to 16.30 but no collections after 16.00 please,
            as we will be loading the trucks for the next day’s nationwide deliveries.
          </p>
          <p>
            Address: Marblemosaics Ltd, Unit 30, The Old Brickworks, Plumpton Green, East Sussex, BN7 3DF, GB.
          </p>
        </div>

        <hr className="my-6" />

        <p className="mb-4 text-sm text-gray-700">Alternatively, use this contact form and we will get back to you as soon as possible.</p>
        <p className="mb-2 text-xs text-red-600">*Required Field</p>

        <form className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium">Name: <span className="text-red-600">*</span></label>
            <input
              type="text"
              required
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email Address: <span className="text-red-600">*</span></label>
            <input
              type="email"
              required
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Message:</label>
            <textarea
              rows={5}
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* reCAPTCHA placeholder */}
          <div className="flex items-center gap-3 border border-gray-300 p-3 w-fit">
            <input type="checkbox" />
            <span className="text-sm">I'm not a robot</span>
          </div>

          <button
            type="submit"
            className="bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            SEND
          </button>
        </form>
      </Container>
    </section>
  )
}
