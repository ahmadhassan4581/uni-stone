import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../components/Container'

const TITLES = {
  delivery: 'Shipping and Delivery',
  samples: 'Samples',
  faqs: 'Frequently Asked Questions',
  returns: 'Our Refunds / Returns Policy',
  terms: 'Terms',
  privacy: 'Privacy Policy',
  sitemap: 'Sitemap',
  'pebble-guide': 'Pebble Guide',
}

export default function InfoPage() {
  const { slug } = useParams()

  const title = useMemo(() => {
    if (!slug) return 'Information'
    return TITLES[slug] || 'Information'
  }, [slug])

  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-24">
        <h1 className="mt-6 font-display text-4xl tracking-[0.03em] text-obsidian sm:text-5xl">{title}</h1>

        {slug === 'privacy' ? (
          <div className="mt-10 space-y-8 text-sm leading-7 text-obsidian/70">
            <div className="space-y-4">
              <p>
                Unistone Paving Limited is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
                store, and protect your personal data when you visit our website or interact with us, in accordance with the UK
                General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">1. Who we are</h2>
              <p>
                Company name: Unistone Paving Limited
                <br />
                Registered address: London (W1W 5PF) Office, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF
                <br />
                Email: inquiry@unistone.co.uk
                <br />
                Telephone: +447564892282
              </p>
              <p>
                For the purposes of data protection law, Unistone Paving Limited is the “data controller” of your personal data.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">2. What personal data we collect</h2>
              <p>We may collect and process the following categories of personal data:</p>
              <ul className="list-disc pl-5">
                <li>Identity data: name and title</li>
                <li>Contact data: billing address, delivery address, email address, telephone numbers</li>
                <li>Financial data: payment details (processed securely via third party payment providers)</li>
                <li>Transaction data: details about payments and products purchased from us</li>
                <li>Technical data: IP address, browser type and version, time zone setting, operating system</li>
                <li>Usage data: information about how you use our website</li>
                <li>Marketing and communications data: your preferences in receiving marketing from us</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">3. How we collect your data</h2>
              <p>We collect personal data through:</p>
              <ul className="list-disc pl-5">
                <li>Forms completed on our website</li>
                <li>Orders placed online or via email/phone</li>
                <li>Subscriptions to newsletters or enquiries</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">4. How we use your personal data</h2>
              <p>
                We use your personal data only where the law allows us to. Most commonly, we will use your data for the
                following purposes:
              </p>
              <ul className="list-disc pl-5">
                <li>To process and fulfil orders, including payments and deliveries</li>
                <li>To manage our relationship with you, including responding to enquiries</li>
                <li>For internal administration and record keeping</li>
                <li>To improve our website, products, and services</li>
                <li>To send marketing communications where you have opted in</li>
                <li>To comply with legal or regulatory obligations</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">5. Lawful basis for processing</h2>
              <p>We process your personal data under one or more of the following lawful bases:</p>
              <ul className="list-disc pl-5">
                <li>Performance of a contract (e.g. processing your order)</li>
                <li>Legal obligation (e.g. accounting or tax requirements)</li>
                <li>Legitimate interests (e.g. improving our services)</li>
                <li>Consent (e.g. marketing communications)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">6. Marketing</h2>
              <p>We will only send marketing communications if you have opted in or where permitted by law. You can opt out at any time by:</p>
              <ul className="list-disc pl-5">
                <li>Clicking the unsubscribe link in emails, or</li>
                <li>Contacting us using the details above</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">7. Cookies</h2>
              <p>Our website uses cookies to distinguish you from other users and to improve your experience.</p>
              <p>Cookies help us:</p>
              <ul className="list-disc pl-5">
                <li>Understand how visitors use our website</li>
                <li>Improve site functionality and performance</li>
              </ul>
              <p>
                You can choose to accept or decline cookies via your browser settings. Disabling cookies may affect website
                functionality.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">8. Data sharing</h2>
              <p>We do not sell or rent your personal data. We may share your data with:</p>
              <ul className="list-disc pl-5">
                <li>Payment service providers</li>
                <li>Delivery and logistics partners</li>
                <li>IT and website service providers</li>
                <li>Professional advisers (accountants, legal advisers)</li>
              </ul>
              <p>All third parties are required to respect the security of your data and treat it in accordance with the law.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">9. Data security</h2>
              <p>
                We have implemented appropriate technical and organisational measures to protect your personal data from
                unauthorised access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">10. Data retention</h2>
              <p>
                We retain personal data only for as long as necessary to fulfil the purposes we collected it for, including
                legal, accounting, or reporting requirements.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">11. Your legal rights</h2>
              <p>Under UK data protection law, you have the right to:</p>
              <ul className="list-disc pl-5">
                <li>Request access to your personal data</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Request transfer of your personal data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>To exercise any of these rights, please contact us using the details above.</p>
              <p>
                Our website may include links to third party websites. We do not control these websites and are not
                responsible for their privacy policies.
              </p>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we
                encourage you to review it periodically.
              </p>
              <p>
                If you are unhappy with how we handle your personal data, you have the right to lodge a complaint with the
                Information Commissioner’s Office (ICO):
                <br />
                <a className="text-blue-600 transition-colors hover:text-blue-700" href="https://www.ico.org.uk" target="_blank" rel="noreferrer">
                  www.ico.org.uk
                </a>
              </p>
            </div>
          </div>
        ) : slug === 'faqs' ? (
          <div className="mt-10 space-y-8 text-sm leading-7 text-obsidian/70">
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Frequently Asked Questions (FAQs)</h2>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">General</h3>
              <p className="font-semibold text-obsidian">Who are Unistone Paving Limited?</p>
              <p>
                Unistone Paving Limited is a UK-based supplier of high-quality natural stone and porcelain products. We specialise
                in cobbles, paving slabs, kerbs, edgings, walling stone, indoor and outdoor flooring, garden paving solutions,
                steps, benches, and bespoke stone artefacts, sourced and imported directly from trusted quarries in India.
              </p>
              <p className="font-semibold text-obsidian">What materials do you supply?</p>
              <p>
                We supply products made from sandstone, limestone, granite, and porcelain, available in a wide range of colours,
                finishes, sizes, and thicknesses.
              </p>
              <p className="font-semibold text-obsidian">Do you sell to the public or trade only?</p>
              <p>
                We supply both homeowners and trade customers, including landscapers, builders, contractors, architects, and
                developers.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Products &amp; Quality</h3>
              <p className="font-semibold text-obsidian">Is natural stone durable for outdoor use in the UK climate?</p>
              <p>
                Yes. When properly selected and installed, natural stone such as sandstone, limestone, and granite is highly
                durable and well suited to the UK climate. Our stones are chosen for strength, weather resistance, and long-term
                performance.
              </p>
              <p className="font-semibold text-obsidian">What is the difference between sandstone, limestone, granite, and porcelain?</p>
              <ul className="list-disc pl-5">
                <li>Sandstone: Natural, textured appearance with good slip resistance. Ideal for patios and pathways.</li>
                <li>Limestone: Smooth, elegant finish with consistent colouring. Popular for patios and interior flooring.</li>
                <li>Granite: Extremely hard-wearing and low maintenance. Ideal for high-traffic areas and kerbs.</li>
                <li>Porcelain: Manufactured slabs with very low porosity, high stain resistance, and uniform appearance.</li>
              </ul>
              <p className="font-semibold text-obsidian">Will the colour of natural stone vary?</p>
              <p>
                Yes. Natural stone is a quarried product, and colour variations, veining, and tonal differences are normal and
                part of its natural beauty.
              </p>
              <p className="font-semibold text-obsidian">Are your products calibrated or hand-cut?</p>
              <p>We offer both calibrated and hand-cut options depending on the product range. Details are provided on each product listing.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Sourcing &amp; Ethics</h3>
              <p className="font-semibold text-obsidian">Where is your stone sourced from?</p>
              <p>
                Our natural stone products are sourced from carefully selected quarries in India, known for their quality stone
                and long-standing craftsmanship.
              </p>
              <p className="font-semibold text-obsidian">Is your stone ethically sourced?</p>
              <p>
                Yes. We work with responsible suppliers and exporters who follow ethical practices, fair labour standards, and
                legal quarrying processes.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Sizes, Customisation &amp; Bespoke Orders</h3>
              <p className="font-semibold text-obsidian">Do you offer bespoke sizes or thicknesses?</p>
              <p>
                Yes. We can customise sizes, thicknesses, finishes, and edge details to suit specific project requirements,
                subject to minimum order quantities.
              </p>
              <p className="font-semibold text-obsidian">Can you supply matching steps, kerbs, or walling for my paving?</p>
              <p>Absolutely. We can supply coordinated products to ensure a consistent look across your project.</p>
              <p className="font-semibold text-obsidian">Do you supply stone benches and artefacts?</p>
              <p>Yes. We supply stone benches, planters, steps, and decorative artefacts carved from natural stone.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Ordering &amp; Samples</h3>
              <p className="font-semibold text-obsidian">Can I order samples?</p>
              <p>Yes. Samples are available for most products so you can check colour, texture, and finish before placing a full order.</p>
              <p className="font-semibold text-obsidian">How do I place an order?</p>
              <p>
                Orders can be placed by contacting us directly via phone or email. Our team will guide you through product
                selection, quantities, and delivery.
              </p>
              <p className="font-semibold text-obsidian">Is there a minimum order quantity?</p>
              <p>Minimum order quantities may apply for bespoke or imported products. Please contact us for details.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Pricing &amp; Payment</h3>
              <p className="font-semibold text-obsidian">Are your prices competitive?</p>
              <p>Yes. By importing directly from quarries, we offer high-quality stone at competitive prices.</p>
              <p className="font-semibold text-obsidian">Do prices include VAT?</p>
              <p>Unless stated otherwise, prices are exclusive of VAT. VAT will be clearly shown on quotations and invoices.</p>
              <p className="font-semibold text-obsidian">What payment methods do you accept?</p>
              <p>We accept bank transfer and other agreed payment methods. Trade accounts may be available subject to approval.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Delivery &amp; Lead Times</h3>
              <p className="font-semibold text-obsidian">Do you deliver across the UK?</p>
              <p>Yes. We deliver nationwide across the UK.</p>
              <p className="font-semibold text-obsidian">How long does delivery take?</p>
              <p>
                Stock items typically have shorter lead times. Imported or bespoke orders may take several weeks. Exact delivery
                times will be confirmed at the time of order.
              </p>
              <p className="font-semibold text-obsidian">How is stone delivered?</p>
              <p>Stone is usually delivered on pallets via a tail-lift or HIAB vehicle, depending on access requirements.</p>
              <p className="font-semibold text-obsidian">Do I need to be present for delivery?</p>
              <p>Yes. Someone should be present to inspect the goods upon delivery.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Installation &amp; Aftercare</h3>
              <p className="font-semibold text-obsidian">Do you offer installation services?</p>
              <p>We do not install directly, but we can recommend suitable installation methods and advise on best practices.</p>
              <p className="font-semibold text-obsidian">How should natural stone be installed?</p>
              <p>
                We recommend installation by experienced professionals using appropriate bedding, jointing, and drainage
                methods.
              </p>
              <p className="font-semibold text-obsidian">Does natural stone require sealing?</p>
              <p>
                Sealing is recommended for many natural stones to enhance stain resistance and longevity, especially for indoor
                use and high-traffic areas.
              </p>
              <p className="font-semibold text-obsidian">How do I maintain my stone paving?</p>
              <p>
                Regular sweeping and occasional washing with mild cleaners is usually sufficient. Avoid harsh chemicals unless
                recommended.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Returns &amp; Issues</h3>
              <p className="font-semibold text-obsidian">Can I return unused materials?</p>
              <p>Returns may be accepted subject to conditions. Please contact us before returning any goods.</p>
              <p className="font-semibold text-obsidian">What if my stone arrives damaged?</p>
              <p>Please report any damage immediately upon delivery. We will work with you to resolve the issue promptly.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Technical &amp; Safety</h3>
              <p className="font-semibold text-obsidian">Are your products slip resistant?</p>
              <p>
                Many of our outdoor stones offer natural slip resistance. Porcelain products are available with certified
                anti-slip ratings.
              </p>
              <p className="font-semibold text-obsidian">Are your stones frost resistant?</p>
              <p>Yes. Our stones are suitable for UK weather conditions when installed correctly.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Contact</h3>
              <p className="font-semibold text-obsidian">Still have questions?</p>
              <p>
                If you need further information or project advice, please contact Unistone Paving Limited and our team will be
                happy to help.
              </p>
            </div>
          </div>
        ) : slug === 'returns' ? (
          <div className="mt-10 space-y-8 text-sm leading-7 text-obsidian/70">
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Returns &amp; Refund Policy</h2>
              <p>
                This Returns &amp; Refund Policy applies to all purchases made from Unistone Paving Limited. By placing an order with
                us, you agree to the terms outlined below.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">1. General Information</h3>
              <p>
                Unistone Paving Limited supplies natural stone and porcelain products, many of which are heavy, bespoke, or
                imported to order. Due to the nature of these products, returns and refunds are subject to specific conditions.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">2. Inspection on Delivery</h3>
              <p>All goods must be inspected immediately upon delivery.</p>
              <ul className="list-disc pl-5">
                <li>Any visible damage, shortages, or incorrect items must be reported at the time of delivery or within 48 hours of receipt.</li>
                <li>Claims reported after this period may not be accepted.</li>
                <li>Delivery notes should be signed as “damaged” or “unchecked” where applicable.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">3. Damaged or Faulty Goods</h3>
              <p>If goods arrive damaged or faulty:</p>
              <ul className="list-disc pl-5">
                <li>Notify us within 48 hours of delivery with clear photographs and order details.</li>
                <li>We will assess the issue and, where appropriate, offer a replacement, repair, or refund.</li>
                <li>Natural variation in colour, texture, veining, and tone is not considered a fault.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">4. Returns of Standard Stock Items</h3>
              <p>We may accept returns of standard, non-bespoke stock items subject to the following conditions:</p>
              <ul className="list-disc pl-5">
                <li>Returns must be requested within 14 days of delivery.</li>
                <li>Goods must be unused, unlaid, and in their original packaging.</li>
                <li>Returned items must be in a resaleable condition.</li>
                <li>A restocking and handling fee may apply.</li>
                <li>Return transport costs are the responsibility of the customer.</li>
              </ul>
              <p>Refunds will be processed once the goods have been received and inspected.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">5. Bespoke, Made-to-Order &amp; Imported Products</h3>
              <p>The following items are non-returnable and non-refundable unless faulty or damaged:</p>
              <ul className="list-disc pl-5">
                <li>Bespoke or custom-sized products</li>
                <li>Special-order or made-to-order items</li>
                <li>Imported goods sourced specifically for a customer</li>
              </ul>
              <p>This does not affect your statutory rights.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">6. Cancellations</h3>
              <ul className="list-disc pl-5">
                <li>Orders may be cancelled before dispatch or production begins.</li>
                <li>Once an order has been dispatched, imported, or production has started, cancellation may not be possible or may incur charges.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">7. Refunds</h3>
              <ul className="list-disc pl-5">
                <li>Approved refunds will be issued to the original payment method.</li>
                <li>Refunds are processed within 7–14 working days after approval.</li>
                <li>Delivery charges are non-refundable unless the return is due to our error.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">8. Natural Stone Disclaimer</h3>
              <p>
                Natural stone is a quarried product. Variations in colour, shade, texture, markings, and surface finish are
                inherent characteristics and do not constitute defects.
              </p>
              <p>
                Customers are advised to order sufficient quantities, including an allowance for cuts and wastage, as replacement
                batches may vary.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">9. Consumer Rights</h3>
              <p>Nothing in this policy affects your statutory rights under the Consumer Rights Act 2015.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">10. How to Request a Return or Refund</h3>
              <p>To request a return or refund, please contact us with:</p>
              <ul className="list-disc pl-5">
                <li>Your order number</li>
                <li>Reason for return</li>
                <li>Supporting photographs (if applicable)</li>
              </ul>

              <p>
                Contact details:
                <br />
                Unistone Paving Limited
                <br />
                Email: inquiry@unistone.co.uk
                <br />
                Phone: +447564892282
              </p>
            </div>
          </div>
        ) : slug === 'delivery' ? (
          <div className="mt-10 space-y-8 text-sm leading-7 text-obsidian/70">
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Delivery Terms &amp; Conditions</h2>
              <p>
                This Delivery Information policy outlines how deliveries are handled by Unistone Paving Limited. By placing an order
                with us, you agree to the terms set out below.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">1. Delivery Overview</h3>
              <p>
                Unistone Paving Limited supplies natural stone and porcelain products, many of which are heavy, bespoke,
                manufactured, or imported to order. Delivery arrangements, lead times, and charges may vary depending on the
                product type, finish, quantity, and delivery location.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">2. Lead Times &amp; Manufacturing</h3>
              <ul className="list-disc pl-5">
                <li>Standard stock items may be available for quicker dispatch, subject to availability.</li>
                <li>Bespoke, made-to-order, or imported products may take 10–12 weeks or longer to manufacture and deliver.</li>
                <li>
                  Lead times depend on factors including stone type, finish, size, thickness, production schedules, shipping
                  timelines, and customs clearance.
                </li>
                <li>All lead times provided are estimated and not guaranteed.</li>
              </ul>
              <p>We will keep customers informed of expected lead times at the time of order confirmation.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">3. Delivery Charges</h3>
              <ul className="list-disc pl-5">
                <li>Delivery charges vary based on postcode, access requirements, order size, weight, and delivery method.</li>
                <li>Charges will be confirmed prior to order confirmation.</li>
                <li>Additional charges may apply for remote areas, restricted access, re-delivery, or failed delivery attempts.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">4. Delivery Method</h3>
              <ul className="list-disc pl-5">
                <li>Deliveries are typically made via palletised delivery, tail-lift vehicle, or HIAB crane, depending on access and order size.</li>
                <li>Customers must inform us in advance of any access restrictions, weight limits, narrow roads, or special delivery requirements.</li>
                <li>Failed deliveries due to inadequate access or absence of an authorised person may incur additional charges.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">5. Delivery Times &amp; Dates</h3>
              <ul className="list-disc pl-5">
                <li>Delivery dates are arranged in advance where possible.</li>
                <li>Time-specific deliveries cannot be guaranteed.</li>
                <li>Delays caused by weather, transport issues, port delays, customs clearance, or events beyond our control may occur.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">6. Receiving Your Delivery</h3>
              <ul className="list-disc pl-5">
                <li>An authorised person must be present to receive the delivery.</li>
                <li>All goods must be checked thoroughly at the time of delivery.</li>
                <li>Delivery receipts must be signed only after inspection.</li>
              </ul>
              <p>
                If inspection is not possible at the time of delivery, the delivery receipt must be clearly signed as “UNCHECKED”.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">7. Damaged, Faulty, or Incorrect Goods</h3>
              <ul className="list-disc pl-5">
                <li>Any damage, faults, shortages, or incorrect items must be clearly noted on the delivery receipt at the time of delivery.</li>
                <li>Photographic evidence must be taken during delivery and retained.</li>
                <li>All issues must be reported to us within 48 hours of delivery.</li>
              </ul>
              <p>Failure to follow this procedure may result in claims being rejected.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">8. Natural Stone Variations</h3>
              <p>
                Natural stone is a quarried product. Variations in colour, texture, veining, markings, and surface finish are
                natural characteristics and do not constitute defects.
              </p>
              <p>
                Customers are advised to order sufficient material, including an allowance for cuts and wastage, as replacement
                batches may vary.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">9. Storage &amp; Handling After Delivery</h3>
              <ul className="list-disc pl-5">
                <li>Once delivered and signed for, responsibility for the goods passes to the customer.</li>
                <li>Goods must be stored on a flat, stable surface and protected from damage and weather exposure.</li>
                <li>Unistone Paving Limited cannot be held responsible for damage caused after delivery.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">10. Re-delivery &amp; Failed Deliveries</h3>
              <ul className="list-disc pl-5">
                <li>If delivery cannot be completed due to absence, restricted access, or incorrect delivery details, re-delivery charges may apply.</li>
                <li>Storage charges may apply if goods cannot be delivered as scheduled.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">11. Liability</h3>
              <ul className="list-disc pl-5">
                <li>We are not liable for delays or failure to deliver caused by events beyond our reasonable control, including shipping delays, strikes, extreme weather, or customs-related issues.</li>
                <li>Any advice provided regarding access or delivery methods is given in good faith but remains the customer’s responsibility.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">12. Delivery Delays Caused by the Customer</h3>
              <p>
                Delivery vehicles are scheduled for standard unloading time at one agreed delivery location.
                Additional charges may apply if delivery is delayed due to customer-related reasons, including but not limited to:
              </p>
              <ul className="list-disc pl-5">
                <li>The unloading area or final placement location being undecided at the time of delivery</li>
                <li>Requests to unload materials across multiple locations on site or at different addresses</li>
                <li>Restricted or inadequate access not disclosed in advance</li>
                <li>Waiting time caused by lack of labour, equipment, or site readiness</li>
                <li>Requests to move, reposition, or re-handle pallets after unloading has commenced</li>
                <li>Absence of an authorised person to direct or approve unloading</li>
              </ul>
              <p>
                Any additional time, labour, vehicle waiting time, or handling required beyond standard delivery allowance will be
                chargeable to the customer.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl tracking-[0.02em] text-obsidian">Contact Us</h3>
              <p>If you have questions about delivery, access requirements, or lead times, please contact us before placing your order.</p>
              <p>
                Unistone Paving Limited
                <br />
                Email: inquiry@unistone.co.uk
                <br />
                Phone: +447564892282
              </p>
              <p className="text-obsidian/60">Last updated: 01/03/2026</p>
            </div>
          </div>
        ) : slug === 'pebble-guide' ? (
          <div className="mt-10 space-y-6 text-sm leading-7 text-obsidian/70">
            <p>
              Marblemosaics Ltd pebble and mosaic tiles can be used in an extensive variety of installations. They are appropriate for both indoor and outdoor applications. Commercial applications include flooring, feature walls, bar surfaces, and walkways in projects ranging from restaurants to medical facilities, public parks, and corporate offices. Residential installations include pools and pool decks, patios, landscaping, fountains, water features, kitchen backsplashes, flooring, shower floors, baths, wet rooms, hallways, fireplaces and BBQ areas.
            </p>
          </div>
        ) : (
          <p className="mt-6 max-w-2xl text-sm leading-7 text-obsidian/70">
            This is a placeholder page for frontend styling parity. Connect it to your backend/CMS later.
          </p>
        )}
      </Container>
    </section>
  )
}
