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
          <div className="mt-10 space-y-10 text-sm leading-7 text-obsidian/70">
            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Buying</h2>
              <p>
                Before buying your favorite natural stone tile, look at as many pieces as possible to get comfortable with the natural variation (colour, grain, texture) of the product. Measure the area to be tiled as accurately as possible allowing an extra 5-10% for cutting and possible breakages. Prices for stone tiles and pavers are usually quoted on a square metre basis; often the price quoted includes the area taken up by a nominal 10mm grout joint. If smaller grout lines are preferred an adjustment to the covered area will need to be made. If in doubt, seek advice from your friendly tiler.
              </p>
              <p>
                Calibrated (similar thickness) stone costs a little more but requires less preparatory work and uses less adhesive; it is therefore quicker, easier and cheaper to lay.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Grading</h2>
              <p>
                Natural split material will be variable in thickness so it requires grading – sorting into similar thicknesses before fixing commences. The thickest tiles dictate the floor level and should be installed first; the thinner tiles will require building up with more “mud” or adhesive to achieve the right level. Its quite normal for hand split stone to have some flakes or loose layers – these are easily removed with a paint scraper prior to laying. Broken pieces, if any, should be kept and put aside to be used for cutting to minimize wastage.
              </p>
              <p>
                Remove surface dust on the tiles prior to laying by sweeping with a dry broom head or if outside, giving the stones a light hosing.
              </p>
              <p>
                Over-trowelled concrete can cause problems because when the weak, watery slurry sets it lacks strength resulting in partial loss of the bond. At the other end of the spectrum adhesive bonds are much harder to establish on concrete with a hard, shiny finish as it is more difficult to get a purchase.
              </p>
              <p>
                Bond breaking or bond inhibiting contaminants often penetrate the substrate’s pores and block the adhesive’s efforts at establishing a bond. One of the best ways of removing these contaminants is by mechanical abrasion.
              </p>
              <p>
                Stone tiles are very rigid and are not able to tolerate excessive movement especially in the larger formats. Failures will occur unless the substrate is sound with no flex or bounce. Substrates in new buildings must meet specified deflection ratings that measure floor movement as well as any load that is placed on the floor – including bench tops, dishwashers, furniture or even lively party guests!
              </p>
              <p>
                Renovating old buildings is often much more of a challenge because less is known about the substrate structure and previous treatments, so seeking professional advice is really important.
              </p>
              <p>
                Here are a few tips for different substrates each of which require specialized adhesive products.
              </p>
              <ul className="list-disc pl-5">
                <li>
                  Concrete - smooth concrete surfaces may require additional preparation such as a light acid wash or latex primer to achieve better contact with the adhesive. Old concrete surfaces should be sanded or roughened using an impact hammer or machine blasting.
                </li>
                <li>
                  Cement and sand screeds if used should have at least 3 weeks drying time before tiling. Concrete substrates have had 6 weeks drying time after curing before screeding, rendering or tiling. Cement and sand rendered substrates should have 2 weeks drying time before tiling commences.
                </li>
                <li>
                  Cork , vinyl or ceramic tiles - fixing on floors already laid with ceramic, vinyl or cork tiles should work well providing the tiles are stuck fast to the substrate with no “drummy” sounds. If in doubt remove the existing surface before fixing.
                </li>
                <li>Fibro sheeting - fixing onto fibro sheeting requires a latex primer to be painted onto the surface.</li>
                <li>
                  Painted & varnished surfaces - remove all loose paint; sand the surface with a very coarse sandpaper to assure a good adhesive bond can be established.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Surface Uniformity & Fall</h2>
              <p>
                If tiling walls, make sure the wall is not out of plumb by more than 3mm over a 2 metre straightedge distance because you cannot increase or decrease the thickness of the adhesive when using thin-bed adhesives.
              </p>
              <p>
                For tiling floors check the base make the required accuracy of finish can be achieved by laying a 2 metre straightedge on the surface to ensure there is no more than 3mm variation for adhesives.
              </p>
              <p>If floors and walls are out of plumb by more than 3mm, thickset adhesives should be used.</p>
              <p>
                For floors where a fall is required – check that the substrate has the correct fall before tiling; if it doesn’t establish a datum level for the finished floor and control its level with a series of spot checks.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Fixing</h2>
              <p>
                The installation or laying of stone tiles is called fixing. This is usually commenced by setting out the tiling from the centre of the room or area in parallel lines to the perimeter axes. Avoid cutting tiles if possible but if it is unavoidable locate the cut tiles where they will be least noticeable. Ensure movement joints are correctly positioned.
              </p>
              <p>Adhesive installation is usually only recommended for stone 6 -12mm thick.</p>
              <p>
                Use properly formulated adhesives that have been designed to perform with stone for maximum strength and durability – seek professional advice on the most appropriate adhesive for your job before starting.
              </p>
              <p>
                Apply the adhesive to the thickness recommended by the manufacturer on the label – not more, nor less. Thin bed adhesives should not normally be more than 3mm thick whereas thick bed adhesives are spread 6mm thick or sometimes up to 12mm thick in isolated areas to achieve an even tiled surface.
              </p>
              <p>Do not wet background surfaces or tiles when fixing with any adhesive product.</p>
              <p>When fixing tiles on vertical surfaces ensure that there is 100% coverage of mortar to the background surface.</p>
              <p>
                The “open time” for adhesives to achieve maximum effectiveness should be stated on the label or packet; it is usually 20-30 minutes, not more. If the surface of the adhesive dries or forms a skin before tiles have been fixed, it should be replaced. If the adhesive has inadequate plasticity it will be incapable of achieving a proper seal predisposing the project to moisture penetration and possible failure.
              </p>
              <p>
                Don’t get “gung-ho” and lay too many tiles at once. Its best to lay 2-3 rows of tiles at a time – this will allow sufficient time to correct any mistakes and ensure joints are clean and ready for grouting.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Spreading Adhesives & Mortar - Notch Trowelling & Buttering</h2>
              <p>
                There are two methods of spreading adhesives – notch trowelling and buttering the choice of which depends on the need to prevent moisture penetration into voids behind the tiles.
              </p>
              <p>
                Notch trowelling is used for tiling on internal walls - surfaces where moisture penetration is not an issue. The technique involves spreading a thin bed adhesive on the background (to the recommended thickness) then ribbing the surface in one direction with a notch trowel. Tiles should then be pressed into position using a twisting, sliding motion then gently but firmly tapped.
              </p>
              <p>Thick bed adhesives should not be notch trowelled unless required to do so by the instructions on the label.</p>
              <p>
                For external surfaces or internal surfaces where it is vital to prevent moisture collecting in voids behind the tiles (e.g. external surfaces, bathrooms) notch trowelling may be used in conjunction with buttering. This involves spreading the adhesive on the background and ribbing the surface (as described above) in addition to spreading the adhesive uniformly over the back of the tile.
              </p>
              <p>
                The buttering method may also be used on tiles that have uneven or raised under-surfaces and for vertical surfaces where 100% coverage is vital.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Types of Cement and Sand Mortars</h2>
              <p>
                A basic thick bed mix is cement & sand in a 1:3 mix for floors and a cement, sand & lime mix of 1:5:0.5 or 1:7:1 for walls. There are two recognized ways of fixing stone using this mix (1) fixing the stone on a mortar bed that is still plastic or (2) fixing onto an already cured bed.
              </p>
              <p>
                This type of mortar is suitable for most surfaces; the thick bed (9-12mm) on walls and nominally 30mm on floors facilitates accurate slopes in the finished work and provides versatility for stone with variable thickness. The mortar can be reinforced with mesh or backed with fibre membranes.
              </p>
              <p>
                Dry-set mortar is a mixture of cement & sand with additives that enhance water retention and is used as a bond coat for setting stone tile. It is typically a single layer 2-3mm thick into which the stone tiles are tamped. Dry set mortar is a factory prepared product to which water is added; it can be cleaned in water. Once laid, it has excellent water and impact resistance and is not affected by prolonged contact with water even though it does not form a water barrier. It is therefore popular for external work.
              </p>
              <p>
                Latex cement mortar is a mixture of cement, sand & latex additives that is used as a bond coat for setting stone tiles. This type of mortar is often used around swimming pools and in shower recesses.
              </p>
              <p>
                Epoxy mortars employ epoxy resin and epoxy hardeners. They are used for sub-floor applications e.g. concrete, wood & ceramic tile.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Grouting</h2>
              <p>
                The width of joints varies with the stone; 3-6mm joints are usually used for smooth, honed or polished stone whereas 6-10mm joints are used with stone that has a textured finish.
              </p>
              <p>Adhesion installation methods usually require a minimum 6mm joint.</p>
              <p>Use spacers to achieve neat corners & uniformity of grout joints.</p>
              <p>
                Grout is the mortar used to fill joints. Grouting should only commence when the area is thoroughly dry – wait at least 24 hours after tile fixing. Choose a grout colour that will compliment the natural colour of the stone; conduct a small test first to ensure the correct match.
              </p>
              <p>Grout can be applied with a pointed trowel, rubber grouting trowel or squeegee.</p>
              <p>
                Make sure the grout completely fills the spaces between the tiles to the full depth of the stone tile leaving no hollow cavities that might allow moisture infiltration.
              </p>
              <p>
                Wipe off any excess grout as you go, using a rubber squeegee. Drag a clean damp sponge diagonally over the tiles to prevent the removal of the wet grout out of the joints; wash the sponge regularly in clean water and wring out excess.
              </p>
              <p>Leave the newly laid and grouted surface to dry and cure for at least 7 days before sealing or walking on the floor.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Sealing</h2>
              <p>
                Sealing stone is usually advisable but not always necessary; it is certainly a good insurance policy for most applications. The science behind sealant formulations has moved with impressive speed in recent years with some of the better sealants able to perform well for up to 15 years, depending on the amount and nature of traffic. As usual, you only get what you pay for and cheap products often have short working lives.
              </p>
              <p>
                There are two basic choices of sealant – surface or topical sealants (that leave a wet look appearance) and penetrating sealants or impregnators that result in no visible change to the look of the stone.
              </p>
              <p>
                Penetrating sealants form an invisible protective barrier below the surface of the stone and act as repellents blocking the entry of contaminants into the pores and cavities of the stone. At the same time they allow internal moisture to escape. Penetrating sealants are used when the natural surface and colour of the stone needs to be preserved.
              </p>
              <p>
                Surface or topical sealants protect the stone surface from staining and provide a coating that helps to preserve the stone finish in heavy wear and high traffic conditions. They will enhance stone colours and provide an attractive, gloss finish that is easy to sweep, clean or wipe. They may also be used on external walls to reduce the risk of damage from graffiti.
              </p>
              <p>
                Before applying sealant, ensure the surface is clean and dry. Apply the sealant with a soft bristle broom or paint brush. Most manufacturers recommend that two coats of sealant should be applied to new surfaces. Floors should be allowed to dry for up to 24 hours before walking on them.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Cleaning</h2>
              <p>
                Interior stone flooring should be swept regularly with a dry untreated dust mop or soft broom to remove dust and grit. External stone surfaces should be swept and washed with water.
              </p>
              <p>
                Stone floors can be easily cleaned with clean water or neutral (pH 7) cleaning agents; soapless cleaners are preferred as they minimise streaks and film. Mild phosphate free, biodegradable liquid dishwashing detergents, powders and stone soaps are acceptable providing rinsing is thorough.
              </p>
              <p>Don’t clean a sealed floor with methylated spirits or ammonia as these products may turn the sealer a milky colour.</p>
              <p>
                Dirt and grit are abrasive and may scuff the sealer; mats with non-slip undersurfaces, placed at entrance ways (both inside and out) will help reduce dirt and grit being transported onto the stone floor.
              </p>
              <p>Waxing is not recommended as it tends to dull the natural colours of the stone and may discolour the grouting.</p>
              <p>Refinishing surfaces that are tired or traffic weary can be achieved by honing or re-polishing.</p>
              <p>
                Accumulated dirt on external surfaces can often be simply removed using high pressure water with a fan spray head held far enough away to prevent physical damage to the structure of the stone.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Scratch Removal</h2>
              <p>
                Scratches in natural stone surfaces are not as big a problem as with other types of flooring (such as cork, wood or terracotta) where the scratches are often permanent. Superficial scratches on unsealed surfaces can be removed with steel wool, or fine sandpaper. On honed surfaces, use an extremely fine sandpaper or “wet and dry” and work gently along the grain until the scratches are removed; re-seal as required.
              </p>
              <p>
                On sealed surfaces, make sure the area is clean and dry, sand lightly then apply a new coat of sealer to the affected area. Scratches on unsealed surfaces will often disappear with time. In some instances, a light sanding with sandpaper or steel wool will make the scratch less obvious.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Stain Removal</h2>
              <p>
                Surface stains can often be easily to remove using commercially available cleaning products or household chemicals. The secret to removing a more intractable stain is to identify the cause, then apply an appropriate treatment.
              </p>
              <p>
                Sometimes a poultice may be needed; this is a chemical or mixture of chemicals combined with an absorbent material in the form of a thick paste which is spread over the stain with a spatula and left for 24-48 hours. The chemical will draw out the stain into the absorbent material.
              </p>
              <p>
                Organic stains include tea, coffee, wine, food, fruit, urine, bark, leaves, bird droppings etc. These are often pinkish-brown in colour and may disappear once the source of the stain is removed. Clean the stone with 12% hydrogen peroxide and a few drops of ammonia if it persists. A poultice using 12% hydrogen peroxide or acetone may also be effective.
              </p>
              <p>
                Biological stains include algae, lichens, moss, fungi etc. can be removed with ammonia based cleaning products, bleach or hydrogen peroxide or a poultice made up of one of the above. Do not mix ammonia and bleach though – it forms a toxic gas.
              </p>
              <p>
                Oil-based stains such as grease, margarine, cooking oil & cosmetics leave a dark stain that needs to be chemically removed. Clean gently with a soft liquid detergent, ammonia or acetone. A poultice made up of baking soda and water or commercial degreaser may also be effective.
              </p>
              <p>
                Paint stains can often be scraped off with a razor blade or removed with a lacquer thinning agent. Heavy paint stains made need to be treated with a commercial paint stripper. Do not use acid or heat/naked flame on stone.
              </p>
              <p>Water spots and rings can be removed with very fine steel wool or sandpaper.</p>
              <p>
                Ink stains caused from biros and marker pens can be removed on light coloured stone with bleach or hydrogen peroxide - or with lacquer thinner , or acetone , on dark coloured stone.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Disclaimer</h2>
              <p>
                Marblemosaics Ltd believes that the information contained in this document is accurate but has not checked or verified this information. This document is intended to provide general advice only and has been prepared without taking into account the objectives, problems or needs of the reader. Marblemosaics Ltd has presented this information as a guide only and accepts no liability for any loss or damage caused by any error in, or omission from, this document.
              </p>
            </div>
          </div>
        ) : slug === 'returns' ? (
          <div className="mt-10 space-y-6 text-sm leading-7 text-obsidian/70">
            <p>
              When you return a Product to us because you have cancelled the Contract between us within the seven-day cooling-off period. We will process the refund due to you as soon as possible less any deposit paid and, in any case, within 30 days of the day you have given notice of your cancellation. In this case, we will refund the price of the Product in full, less the cost of sending the items to you. You will also be responsible for the cost of returning the item to us within 30 days of the date you have written to cancel your contract. If you cancel your order it is your responsibility to return the goods to marblemosaics ltd. You will not however be reimbursed for the cost of returning the goods. In exceptional circumstances marblemosaics ltd may arrange the collection of the goods with our haulage partners but all costs associated will be deducted from any potential refund. In addition & in exceptional circumstances goods may be accepted for credit but where consent is given a restocking fee of 20% will be charged plus any additional shipping costs incurred.
            </p>

            <p>
              When you return a Product to us relying on your other statutory rights or rights under your Contract with us (for instance, because you claim that the Product is defective), we will examine the returned Product and will notify you if you are entitled to a refund or replacement (if possible due to stock availability) via e-mail within a reasonable period of time. We will usually process any refund due to you as soon as possible and, in any case, within 30 days of the day we confirmed to you via e-mail that you were entitled to a refund in relation to the Product. Products returned by you because of a defect will be refunded in full, including a refund of the delivery charges for sending the item to you and the cost incurred by you in returning the item to us. Adhesive, grout and sealers are non refundable. Marblemosaics Ltd reserve the right not to refund if the goods are deemed as not being in a resaleable condition.
            </p>

            <p>
              When purchasing tiles labelled as a Job Lot, this is an item that is put on a particular section of the website to sell at a much reduced price to that of the usual selling price. These goods have a full description explaining why they form part of a Job Lot, they may not be in perfect condition or end of batch and cannot be deemed as perfect condition goods. These products are non refundable and non returnable.
            </p>

            <p>
              All goods must be checked by the customer on receipt of goods - this is imperative. No responsibility for damaged product, shortages or incorrect products can be accepted after 48 hours / two working days (Mon - Fri) of receipt of goods. The company must be notified by e-mail or fax within 48 hours of delivery of any claims by the buyer of any shortage or damage to goods in transit. For any damages of products, photographs must be sent within 48 hours of delivery to show the full extent of any damages and information about the extent – claims may be refused out of this time line. Risk in respect of the goods passes to the buyer from the moment of delivery.
            </p>

            <p>
              The Company reserves right not to replace damaged tiles if the total amount is less than 7.5% of the total order.
            </p>

            <p>
              We shall be under no obligation to give you a refund in relation to any Product once the seven day cooling off period has expired (unless the Product is defective and/or your statutory rights apply).
            </p>

            <p>
              We will usually refund any money received from you using the same method originally used by you to pay for your purchase.
            </p>

            <p>
              Refunds on collections will only be permitted at our discretion in exceptional circumstances and, if accepted, only within seven days of receipt. If the return is agreed, a credit note will be issued as reimbursement.
            </p>

            <p>
              Refunds on overages of delivered goods only (we do not accept back overages of collected products) are accepted back within 14 days of receipt by the customer, this 14 day period begins the day after the goods are received and we will not accept returns outside of this time period under any circumstances.
            </p>
          </div>
        ) : slug === 'delivery' ? (
          <div className="mt-10 space-y-10 text-sm leading-7 text-obsidian/70">
            <div className="space-y-4">
              <p>We provide delivery throughout the United Kingdom.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Next Working Day</h2>
              <p>
                Next Working Day deliveries are available on all stock items to England and Wales, if orders are placed / confirmed before 12:00 pm Mon - Fri.
              </p>
              <p>
                Please note that deliveries ordered / confirmed on a "NEXT WORKING DAY" service, after 12pm Mon - Fri, will not be dispatched until the following working day.
              </p>
              <p>
                Please also note that there are no orders dispatched at the weekend as we are closed, therefore an order placed on a Saturday or Sunday, on a "Next Working day" service, will be dispatched on the following Monday (excluding Bank Holidays / Easter Monday) and delivered the following day.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Freight (Pallet) Delivery</h2>
              <p>
                Freight (pallet) delivery costs start from £50.00 inclusive of VAT per crate (Local postcodes ONLY) with approximately 13-40 square metres (m2) per crate, dependant on specific material.
              </p>
              <p>
                Please find our delivery costs below, according to your Postcode area, for our Standard 4-5 working day (from day of dispatch) "booked-in" delivery service (Mon-Fri ONLY), whereby our haulage partner will contact the customer to arrange a convenient day for delivery of the consignment. Please be sure to provide correct telephone numbers / contact details at point of order to avoid delays.
              </p>
              <p className="font-semibold text-obsidian">
                PLEASE NOTE THAT A FAILURE TO PROVIDE US WITH CORRECT ADDRESS DETAILS, AND CONTACT PHONE NUMBER/S, WILL RESULT IN A DELAY OF YOUR ORDER BEING DISPATCHED.
              </p>
              <p>
                Please note that "Working Day" deliveries are ordinarily between 9am - 5pm (Mon-Fri ONLY), however can run outside of these times due to the nature of the processes involved. Specific requests for "AM" or "PM" deliveries will incur further costs.
              </p>
              <p>
                ALL CONSIGNMENTS REQUIRE A SIGNATURE. Goods will not be left without being signed for. If this results in a failed delivery, a re-delivery charge will be applicable, or alternatively a collection would need to be arranged with the carrier by the customer to pick-up from the local depot.
              </p>
              <p>
                Due to the heavy weight of stone, the majority of orders placed are shipped as freight, on pallets / in crates.
              </p>
              <p>
                Please be aware that all our freight deliveries are classed as kerbside ONLY, meaning they will be delivered to the nearest level, hard standing area to your property.
              </p>
              <p>
                Our freight deliveries are made using a large, bin lorry sized vehicle (18 tonne truck), and the pallets / crates are manually off-loaded using a pallet truck / tail-lift off-load.
              </p>
              <p>
                Our pallets are very heavy (up to 1,000kg on occasions), therefore we can only deliver onto hard, level surfaces such as concrete, tarmac or block paving. It is imperative that we are informed of any potential restrictions prior to delivery.
              </p>
              <p>
                Marble Mosaics Ltd will not be responsible for additional costs incurred as a result of a customer not informing us about an access issue prior to an attempted delivery. Initial shipping / return shipping costs will also not be met by Marble Mosaics Ltd in this instance, or for costs incurred for a re-delivery after a failed attempt.
              </p>
              <p>
                Please note that any freight delivery will require access with no low hanging trees / canopies etc. Deliveries are at the discretion of the driver.
              </p>
              <p>
                Please note that the delivery driver cannot help with moving the products inside the property as they are not insured to do so, and the haulier will not return to collect empty wooden crates or pallets. These will need to be disposed of by the customer.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Courier / Special Items</h2>
              <p>
                For some small mosaic orders only (excluding Splitface mosaic material), we can ship using a courier service at only £8.99 per m2 inclusive of VAT. Please call 01273 891144 for more details.
              </p>
              <p>
                For the majority of counter top Stone Sink orders, the delivery costs will be £10.99 per sink based on a "Next Working Day" service (from our day of dispatch). Free Standing sinks will incur a freight delivery charge.
              </p>
              <p>
                For our glass mosaic tiles, we offer a flat rate delivery cost of £10.99 no matter how many glass mosaic tiles are purchased, to the majority of Mainland UK postcodes.
              </p>
              <p>Please note there are no collections after 4 pm.</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Collection</h2>
              <p>
                Collection is also welcomed, Unit 30, The Old Brickworks, Station Road, Plumpton Green, East Sussex, BN7 3DF.
              </p>
              <p>Monday to Friday 0830 to 1600</p>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Delivery Zones (per pallet)</h2>
              <ul className="list-disc pl-5">
                <li>
                  Local: £50.00 inclusive of VAT per pallet (Next Working Day + £15) — BN1-15 & 41-45, RH1-19, KT11, 13-16, 18, & 20-24.
                </li>
                <li>
                  Zone 1: £60.00 inclusive of VAT per pallet (Next Working Day + £15) — AL, B, BA, BB, BD, BL, BN16-18 & 20-27, BR, BS, CB, CF, CH, CM, CO, CR, CV, CW, DA, DH, DE, DL, DN, DY, EN, FY, GL, GU, HA, HD, HG, HP, HR, HU, HX, IG, IP, L, LA1-10, LE, LL11-34, LN3-6 & 7-13, LS, LU, M, ME, MK, NE1-18 / 20-47 & 49, NG, NN, NP, NR, OL, OX, PE, PO1-22, PR, RH20, RG, RM, S, SG, SK, SL, SM, SN, SO, SP, SR, SS, ST, TF, TS, TN, TW, UB, WA, WD, WF, WN, WR, WS, WV & YO.
                </li>
                <li>Zone 2: £60 inclusive of VAT per pallet (Next Working Day + £15) — BH, KT1-10, 12, 17 & 19.</li>
                <li>
                  Zone 3: £75 inclusive of VAT per pallet (Next Working Day + £15) — CA, CT, DT, DG, EH, EX, FK, G, KA, KY, LA11-23, LD, LL, ML, NE19, 48 & 61-71, PA(1-20), PL, SA, TA, TD, SY, TR1-20, TQ.
                </li>
                <li>Zone 4: £65.00 inc of VAT per pallet (Next Working Day + £20.00) — ALL LONDON POSTCODES.</li>
                <li>Zone 5: £120 inclusive of VAT per pallet (Next Working Day + £35 if available) — AB10-16, 21-25, 30, 39, DD, PH1-16.</li>
                <li>
                  Price on application — AB31-38, 41-45, 51-56, KA27-28, KW, PH17-26, 30-41, 42-44, 49-50, IV, PA21-41, Scottish Highlands + Islands, PO30-41 (Isle of Wight), IM1-9 (Isle of Man), HS, GY, JE, TR21-25, ZE.
                </li>
                <li>Zone 6: £155.00 inclusive of VAT per pallet — Northern Ireland.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl tracking-[0.02em] text-obsidian">Premium Surcharges (per consignment)</h2>
              <p>
                PLEASE NOTE THAT THESE COSTS ARE IN ADDITION TO STANDARD CHARGES, HOWEVER NOT ALL DEPOTS OFFER THESE SERVICES:
              </p>
              <ul className="list-disc pl-5">
                <li>TIME SPECIFIC DELIVERY: £30</li>
                <li>AM/PM DELIVERY: £17</li>
                <li>SATURDAY AM: £50</li>
                <li>SATURDAY PM: £60</li>
                <li>SATURDAY TIMED: £70</li>
              </ul>
              <p>Click here for more information on how to contact us.</p>
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
