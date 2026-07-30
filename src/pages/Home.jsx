import Hero from '../components/home/Hero'
import TrustedBy from '../components/home/TrustedBy'
import WhyMinibee from '../components/home/WhyMinibee'
import WhatsAppOverview from '../components/home/WhatsAppOverview'
import WebDevOverview from '../components/home/WebDevOverview'
import ServicesBento from '../components/home/ServicesBento'
import Stats from '../components/home/Stats'
import ProcessTimeline from '../components/home/ProcessTimeline'
import FAQPreview from '../components/home/FAQPreview'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <WhyMinibee />
      <WhatsAppOverview />
      <Stats />
      <ServicesBento />
      <WebDevOverview />
      <ProcessTimeline />
      <FAQPreview />
    </>
  )
}
