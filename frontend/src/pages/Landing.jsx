import Navbar from '../components/common/Navbar'
import Hero from '../components/landing/Hero'
import Services from '../components/landing/Services'
import Contact from '../components/landing/Contact'
import Footer from '../components/common/Footer'

const Landing = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <Hero />
      <Services />
      <Contact />
      {/* <Footer /> */}
    </div>
  )
}

export default Landing