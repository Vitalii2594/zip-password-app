import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { ClipboardList, CheckCircle, QrCode, FileText, Lock } from 'lucide-react';

const Home: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Modern Attendance Tracking for Training Events
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100">
              Simplify attendance management with paperless, digital sign-in for all your training sessions and events.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {state.isAuthenticated ? (
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50"
                    onClick={() => navigate('/register')}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-blue-700"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Effortless Attendance Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers a comprehensive solution for training companies, educational institutions, and event organizers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <QrCode className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">QR Code Sign-in</h3>
              <p className="text-gray-600">
                Generate QR codes for quick and contactless attendance registration. Participants scan the code with their smartphones.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-teal-100 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <CheckCircle className="h-7 w-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor attendance in real-time. See who has registered and when, allowing for better participant management.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-orange-100 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Export & Reports</h3>
              <p className="text-gray-600">
                Download attendance records in various formats. Generate reports for compliance and documentation purposes.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-green-100 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Instant Setup</h3>
              <p className="text-gray-600">
                Create a training event in seconds. No complicated setup required. Share the link or QR code immediately.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-purple-100 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Paperless Solution</h3>
              <p className="text-gray-600">
                Go green with digital attendance. Eliminate paper waste and manual data entry with our eco-friendly solution.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-red-100 p-3 w-14 h-14 flex items-center justify-center mb-6">
                <Lock className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">GDPR Compliant</h3>
              <p className="text-gray-600">
                All data collection is GDPR compliant. Secure storage and controlled access to participant information.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative px-6 py-10 md:p-12 lg:p-16">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10"></div>
              <div className="relative z-10 text-center md:text-left md:flex md:items-center md:justify-between">
                <div className="mb-8 md:mb-0 md:mr-8">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to simplify your attendance tracking?
                  </h2>
                  <p className="text-blue-100 text-lg max-w-2xl">
                    Join thousands of training providers who have streamlined their attendance management process.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  {state.isAuthenticated ? (
                    <Button
                      variant="primary"
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-blue-50"
                      onClick={() => navigate('/create-training')}
                    >
                      Create Training
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        size="lg"
                        className="bg-white text-blue-700 hover:bg-blue-50"
                        onClick={() => navigate('/register')}
                      >
                        Get Started Today
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-white text-white hover:bg-blue-700"
                        onClick={() => navigate('/login')}
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <ClipboardList className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">AttendEase</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Help
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center md:text-left text-gray-400">
            <p>© 2025 AttendEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;