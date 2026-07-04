import React from 'react';
import Hero from '@/Hero/page';
import Footer from '@/Footer/page';
import ProductsPage from "@/app/products/page";
import About from '@/About/page';
import Customer from '@/Customer/page';
import NavbarLogin from '@/Navbar-login/page';
import Navbar from '@/Navbar/page';

const Page = () => {
  return (
    <div>
<Navbar/>

<section id="hero">
 <Hero/>
</section>


<section id="products">
  <ProductsPage />
</section>

<section id="about">
  <About />
</section>

<section id="reviews">
  <Customer />
</section>

<Footer />
      
    </div>
  )
}

export default Page