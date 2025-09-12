import { motion } from "framer-motion";
import { FileText, Scale, AlertTriangle, Users } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-adventure text-white py-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Scale className="h-16 w-16 mx-auto mb-6 text-white/80" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
            Please read these terms carefully before using our services. 
            By booking with us, you agree to these terms and conditions.
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="space-y-8">
            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Booking Terms</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>All bookings are subject to availability and confirmation</li>
                <li>A deposit is required to secure your booking</li>
                <li>Full payment must be made 30 days before departure</li>
                <li>Prices are subject to change until booking is confirmed</li>
                <li>Group discounts apply for 6 or more participants</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Cancellation Policy</h2>
              </div>
              <div className="text-muted-foreground space-y-2">
                <p><strong>30+ days before departure:</strong> Full refund minus processing fee</p>
                <p><strong>15-29 days before departure:</strong> 50% refund</p>
                <p><strong>7-14 days before departure:</strong> 25% refund</p>
                <p><strong>Less than 7 days:</strong> No refund</p>
                <p className="mt-4 text-sm italic">
                  Cancellations due to medical emergencies or natural disasters will be considered on a case-by-case basis.
                </p>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Participant Responsibilities</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Participants must be in good physical health and fitness</li>
                <li>Medical conditions must be disclosed before booking</li>
                <li>Follow all safety instructions and guidelines</li>
                <li>Respect local cultures and environments</li>
                <li>Carry valid identification and travel documents</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Scale className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Liability and Insurance</h2>
              </div>
              <p className="text-muted-foreground">
                Trek A Tour acts as an agent for transportation companies, hotels, and other service providers. 
                While we take all reasonable care in selecting reliable partners, we cannot be held responsible 
                for their acts or omissions. We strongly recommend purchasing comprehensive travel insurance 
                before your trip.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold">Force Majeure</h2>
              </div>
              <p className="text-muted-foreground">
                We shall not be liable for any failure to perform our obligations due to circumstances 
                beyond our reasonable control, including but not limited to natural disasters, government 
                actions, strikes, or other events of force majeure.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Questions?</h3>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <span className="text-primary font-medium">legal@trekatour.com</span> or{" "}
              <span className="text-primary font-medium">+91 98765 43210</span>.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Terms;