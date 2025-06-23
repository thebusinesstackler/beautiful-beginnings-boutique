
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I upload my photo for personalization?",
      answer: "Simply click on any product, then use our easy upload tool to select your photo from your device. We accept JPG, PNG, and HEIC formats. For best results, use high-resolution images."
    },
    {
      question: "How long does it take to receive my personalized item?",
      answer: "Most orders are handcrafted and shipped within 3-5 business days. Standard shipping takes an additional 5-7 business days. Rush orders are available for an additional fee."
    },
    {
      question: "What if I'm not satisfied with my order?",
      answer: "We offer a 100% satisfaction guarantee! If you're not completely happy with your personalized item, contact us within 30 days for a full refund or replacement."
    },
    {
      question: "Can I see a preview before my item is made?",
      answer: "Yes! After uploading your photo, you'll see a digital preview of how your item will look. You can make adjustments to text, positioning, and colors before we begin crafting."
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Absolutely! We offer elegant gift wrapping and can include a personalized note with your order. Gift wrapping is currently complimentary for a limited time."
    },
    {
      question: "What materials do you use for your products?",
      answer: "We use only premium materials including genuine leather, high-quality metals, natural slate, and durable wood. All materials are chosen for their longevity and beauty."
    },
    {
      question: "Can I order in bulk for special events?",
      answer: "Yes! We offer bulk discounts for orders of 10 or more items. Perfect for weddings, corporate gifts, or family reunions. Contact us for special pricing."
    },
    {
      question: "How do I care for my personalized items?",
      answer: "Each item comes with specific care instructions. Generally, avoid direct sunlight and moisture. For jewelry, store in a dry place. For ornaments, handle gently and store safely when not displayed."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about creating your perfect personalized keepsake
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-primary/10 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4 animate-fade-in">
                  <p className="text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@beautifulbeginnings.com"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Email Us
            </a>
            <a
              href="tel:555-123-4567"
              className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
            >
              Call (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
