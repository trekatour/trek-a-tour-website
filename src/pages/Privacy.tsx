import { motion } from "framer-motion";
import { Shield, Eye, Lock, Users } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-hero text-white py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-white/80" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
            Your privacy and data security are our top priorities. 
            Learn how we protect and use your information.
          </p>
        </div>
      </motion.section>

      {/* Content */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-background"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg max-w-none">
          <div className="text-center mb-12">
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="space-y-8">
            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account, 
                book a trip, or contact us for support. This may include your name, email address, 
                phone number, payment information, and travel preferences.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">How We Use Your Information</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process your bookings and payments</li>
                <li>To communicate with you about your trips</li>
                <li>To send you updates and marketing communications</li>
                <li>To improve our services and customer experience</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Information Sharing</h2>
              </div>
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information with trusted partners who assist us in operating 
                our website and conducting our business, as long as they agree to keep this 
                information confidential.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Data Security</h2>
              </div>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. We use 
                industry-standard encryption and secure servers to protect your data.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <span className="text-primary font-medium">privacy@trekatour.com</span> or{" "}
              <span className="text-primary font-medium">+91 98765 43210</span>.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Privacy;