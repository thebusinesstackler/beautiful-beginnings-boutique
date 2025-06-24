
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Heart } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal font-playfair mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-charcoal/70 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you! Whether you have questions about our products, 
            need help with an order, or want to share your beautiful memories with us, 
            we're here to help make your experience magical.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-charcoal font-playfair mb-6">
                Let's Connect
              </h2>
              <p className="text-charcoal/70 leading-relaxed mb-8">
                At Beautiful Beginnings, every conversation is the start of something special. 
                We're passionate about helping you preserve your most treasured moments, 
                and we're always here to guide you through the process.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-pearl rounded-lg shadow-sm border border-sage/20">
                <div className="w-12 h-12 bg-gradient-to-br from-sage to-forest rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Email Us</h3>
                  <p className="text-charcoal/70">hello@beautifulbeginnings.com</p>
                  <p className="text-sm text-stone">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-pearl rounded-lg shadow-sm border border-sage/20">
                <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-chocolate rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Call Us</h3>
                  <p className="text-charcoal/70">(555) 123-MEMO</p>
                  <p className="text-sm text-stone">Monday - Friday, 9 AM - 6 PM EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-pearl rounded-lg shadow-sm border border-sage/20">
                <div className="w-12 h-12 bg-gradient-to-br from-forest to-sage rounded-full flex items-center justify-center mt-1">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Visit Our Studio</h3>
                  <p className="text-charcoal/70">
                    123 Memory Lane<br />
                    Keepsake City, KC 12345<br />
                    United States
                  </p>
                  <p className="text-sm text-stone">By appointment only</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-pearl rounded-lg shadow-sm border border-sage/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blush to-terracotta rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Business Hours</h3>
                  <p className="text-charcoal/70">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday: 10:00 AM - 4:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-pearl rounded-lg shadow-lg p-8 border border-sage/10">
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-charcoal mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-stone/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-colors bg-white"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-charcoal mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-stone/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-colors bg-white"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-stone/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-colors bg-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-stone/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-colors bg-white"
                >
                  <option value="">Choose a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="custom-order">Custom Order Request</option>
                  <option value="order-status">Order Status</option>
                  <option value="shipping">Shipping & Returns</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-stone/30 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-colors resize-none bg-white"
                  placeholder="Tell us how we can help you create something beautiful..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-sage text-white px-8 py-3 rounded-lg font-semibold hover:bg-forest transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
              >
                <Heart className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-pearl rounded-lg shadow-lg p-8 max-w-4xl mx-auto border border-sage/10">
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              We're Here for Your Journey
            </h2>
            <p className="text-charcoal/70 leading-relaxed mb-6">
              Creating beautiful keepsakes is more than just our business—it's our passion. 
              Whether you're celebrating a milestone, honoring a memory, or simply want to 
              preserve a special moment, we're here to help bring your vision to life.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-sage to-forest rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">💝</span>
                </div>
                <h3 className="font-semibold text-charcoal mb-2">Personalized Service</h3>
                <p className="text-sm text-charcoal/70">Every inquiry receives our personal attention and care</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-chocolate rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-charcoal mb-2">Quick Response</h3>
                <p className="text-sm text-charcoal/70">We respond to all messages within 24 hours</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blush to-terracotta rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold text-charcoal mb-2">Expert Guidance</h3>
                <p className="text-sm text-charcoal/70">Our team helps you choose the perfect keepsake</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
