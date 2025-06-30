import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  User,
  Calendar,
  Building,
  Briefcase
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';


interface SignUpFormData {
  userId: string;
  username: string;
  password: string;
  confirmPassword: string;
  titlename : string;
  fullname: string;
  lastname: string;
  birthdate: string;
  department: string;
  division: string;
  positionType: string;
  position: string;
  email: string;
  tel: string;
}

interface SignInFormData {
  username: string;
  password: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  //ส่งอีเมล contact
  const handleContactSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const firstName = (form.querySelector('input[placeholder="Enter your first name"]') as HTMLInputElement)?.value;
  const lastName = (form.querySelector('input[placeholder="Enter your last name"]') as HTMLInputElement)?.value;
  const email = (form.querySelector('input[placeholder="Enter your email"]') as HTMLInputElement)?.value;
  const message = (form.querySelector('textarea') as HTMLTextAreaElement)?.value;

  try {
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, message })
    });

    const data = await res.json();
    if (res.ok) {
      alert('ส่งข้อความเรียบร้อยแล้ว');
      form.reset();
    } else {
      alert(data.error || 'ส่งข้อความไม่สำเร็จ');
    }
  } catch (err) {
    console.error(err);
    alert('เกิดข้อผิดพลาดที่ฝั่งเซิร์ฟเวอร์');
  }
};

  //ส่งฟอร์มขอรีเซ็ตรหัสผ่าน
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setForgotError('');
  setForgotSuccess('');

  if (!forgotEmail.trim()) {
    setForgotError('กรุณากรอกอีเมล');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail })
    });

    const data = await res.json();
    if (res.ok) {
      setForgotSuccess('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
      setForgotEmail('');
    } else {
      setForgotError(data.error || 'ไม่สามารถส่งอีเมลได้');
    }
  } catch (err) {
    console.error(err);
    setForgotError('เกิดข้อผิดพลาดที่ฝั่งเซิร์ฟเวอร์');
  }
};


  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    userId: '',
    username: '',
    password: '',
    confirmPassword: '',
    titlename: '',
    fullname: '',
    lastname: '',
    birthdate: '',
    department: '',
    division: '',
    positionType: '',
    position: '',
    email: '',
    tel: ''
  });

  const [signInData, setSignInData] = useState<SignInFormData>({
    username: '',
    password: ''
  });

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [signUpErrors, setSignUpErrors] = useState<Partial<SignUpFormData>>({});
  const [signInErrors, setSignInErrors] = useState<Partial<SignInFormData>>({});

  const titlenames = [
    'นาย',
    'นาง',
    'นางสาว'
  ]

  const divisions = [
    'สผม',
    'สพอ',
    'สพข',
    'สพค',
    'สนค',
    'ผชช',
    'ผอ'
  ];

  const departments = [
    'ศทส'
  ];

  const positionTypes = [
    'ข้าราชการ',
    'พนักงานราชการ',
    'ลูกจ้างประจำ',
    'ลูกจ้างชั่วคราว'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-on-scroll');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const handleSignUpInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: value }));
    if (signUpErrors[name as keyof SignUpFormData]) {
      setSignUpErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignInInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData(prev => ({ ...prev, [name]: value }));
    if (signInErrors[name as keyof SignInFormData]) {
      setSignInErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateSignUp = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    // 1. UserID = ตัวเลข 6 หลัก
    if (!signUpData.userId.trim()) newErrors.userId = 'จำเป็น *';

    if (!/^\d{6}$/.test(signUpData.userId)) {
      newErrors.userId = 'User ID ต้องเป็นตัวเลข 6 หลัก';
    }
    // 2. Username = ต้องมีตัวอักษรและตัวเลข
    if (!signUpData.username.trim()) newErrors.username = 'จำเป็น *';

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(signUpData.username)) {
      newErrors.username = 'Username ต้องเป็นตัวอักษรภาษาอังกฤษและตัวเลข';
    }

    // 3. Password = ≥12 ตัว, ต้องมีอักษร, ตัวเลข, และอักขระพิเศษ
    if (!signUpData.password.trim()) newErrors.password = 'จำเป็น *';

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/.test(signUpData.password)) {
      newErrors.password = 'Password ต้องมีอักษร ตัวเลข และอักขระพิเศษ รวม ≥12 ตัว';
    }

    // 4. Password และ confirm pass ต้องตรงกัน
    if (!signUpData.confirmPassword.trim()) newErrors.confirmPassword = 'จำเป็น *';

    if (signUpData.password !== signUpData.confirmPassword) {
      newErrors.confirmPassword = 'Password ไม่ตรงกัน';
    }

    //5. titlename
    if (!signUpData.titlename.trim()) newErrors.titlename = 'จำเป็น *';

    // 6. Fullname = ต้องเป็นภาษาไทย
    if (!signUpData.fullname.trim()) newErrors.fullname = 'จำเป็น *';

    if (!/^[ก-๙\s]+$/.test(signUpData.fullname.trim())) {
      newErrors.fullname = 'ชื่อจริงต้องเป็นภาษาไทย';
    }

    // 6. Lastname = ต้องเป็นภาษาไทย
     if (!signUpData.lastname.trim()) newErrors.lastname = 'จำเป็น *';

    if (!/^[ก-๙\s]+$/.test(signUpData.lastname.trim())) {
      newErrors.lastname = 'นามสกุลต้องเป็นภาษาไทย';
    }

    if (!signUpData.birthdate) newErrors.birthdate = 'จำเป็น *';
    if (!signUpData.department) newErrors.department = 'จำเป็น *';
    if (!signUpData.division.trim()) newErrors.division = 'จำเป็น *';
    if (!signUpData.positionType) newErrors.positionType = 'จำเป็น *';
    if (!signUpData.position.trim()) newErrors.position = 'จำเป็น *';
    if (!signUpData.tel.trim()) newErrors.tel = 'Phone number is required';
    // 7. Email = format customs ถูกต้อง
    if (!signUpData.email.trim()) newErrors.email = 'จำเป็น *';
    
      if (!/^[\w.+-]+@customs\.go\.th$/.test(signUpData.email)) {
      newErrors.email = 'Email ต้องเป็นของกรมเท่านั้น';
    }

    setSignUpErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignIn = (): boolean => {
    const newErrors: Partial<SignInFormData> = {};

    if (!signInData.username.trim()) newErrors.username = 'Username is required';
    if (!signInData.password.trim()) newErrors.password = 'Password is required';

    setSignInErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateSignUp()) {
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData)
      });
      const data = await res.json();
       console.log('Response from server:', data);

      if (res.ok) {
        alert('Sign up successful');
        setShowSignUp(false);
      } else {
        alert(data.error || 'Sign up failed');
      }
    } catch (error) {
        console.error('Error occurred:', error);
      alert('Server error');
    }
  }
};

  const handleSignInSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:5000/api/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signInData)
    });

    const data = await res.json();
    if (res.ok) {
    const user = data.user;
    const loginTime = Date.now(); // เก็บเวลาล็อกอิน

    alert('Login successful');
    setCurrentUser(data.user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('sessionStart', loginTime.toString());
    localStorage.setItem('lastActivity', loginTime.toString());

    navigate('/home'); // redirect ไป home


    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <img 
                      src="https://eee-tracking.customs.go.th/ETS/img/logo_cus.png" 
                      alt="Logo"  
                      className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MAMS</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Maintenance Agreement Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSignIn(true)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-on-scroll">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Manage Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Maintenance Agreements</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque dolor vel, quam qui veniam nisi, ratione eaque et reiciendis consectetur esse magnam perferendis voluptas quo! Laudantium eaque dolores sapiente dolorem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowSignUp(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="fade-in-on-scroll">
              <div className="relative">
                <img
                  src="https://iiiimages.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Thai Customs Building"
                  className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium">Maintanance Agreements</p>
                  <p className="text-xs opacity-90">Thai Customs Department</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built specifically for Thai customs requirements with advanced features for comprehensive maintenance management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 fade-in-on-scroll">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Compliance Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ensure all maintenance agreements meet Thai customs regulations and standards.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 fade-in-on-scroll">
              <div className="h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Team Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Streamline communication between departments and external service providers.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 fade-in-on-scroll">
              <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Real-time Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track maintenance schedules, performance metrics, and contract renewals.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Video Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              System Tutorial
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              To help you understand how this system works, we have provided some examples.
            </p>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl fade-in-on-scroll">
            <video
              ref={videoRef}
              className="w-full h-[400px] md:h-[500px] object-cover"
              poster="https://iiimages.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
              muted={isVideoMuted}
              loop
            >
              <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleVideoToggle}
                  className="h-16 w-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                >
                  {isVideoPlaying ? (
                    <Pause className="h-8 w-8 text-gray-900" />
                  ) : (
                    <Play className="h-8 w-8 text-gray-900 ml-1" />
                  )}
                </button>
                <button
                  onClick={handleVideoMute}
                  className="h-12 w-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                >
                  {isVideoMuted ? (
                    <VolumeX className="h-5 w-5 text-gray-900" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-gray-900" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Having trouble using? Contact our team today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="fade-in-on-scroll">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">02-667-7000 ext. 20-5910</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">settawat_na@customs.go.th</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Address</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                       Information System Planning and Evaluate Unit<br/> 
                       Planning and Standards Section<br/>
                      5th Floor, The 120th Years Building
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="fade-in-on-scroll">
              <form onSubmit={handleContactSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about your trouble"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {/* <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div> */}
              <div>
                <h3 className="text-xl font-bold">MAMS</h3>
                <p className="text-sm text-gray-400">Maintenance Agreement Management System</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              © 2025 Thai Customs Department. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Ministry of Finance, Kingdom of Thailand
            </p>
          </div>
        </div>
      </footer>

      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Account</h2>
              <button
                onClick={() => setShowSignUp(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSignUpSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <User size={16} className="inline mr-2" />
                      User ID *
                    </label>
                    <input
                      type="text"
                      name="userId"
                      value={signUpData.userId}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.userId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your user ID"
                    />
                    {signUpErrors.userId && <p className="text-red-500 text-xs mt-1">{signUpErrors.userId}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={signUpData.username}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your username"
                    />
                    {signUpErrors.username && <p className="text-red-500 text-xs mt-1">{signUpErrors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={signUpData.password}
                        onChange={handleSignUpInputChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                          signUpErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signUpErrors.password && <p className="text-red-500 text-xs mt-1">{signUpErrors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={signUpData.confirmPassword}
                        onChange={handleSignUpInputChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                          signUpErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signUpErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{signUpErrors.confirmPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Briefcase size={16} className="inline mr-2" />
                      Title Name *
                    </label>
                    <select
                      name="titlename"
                      value={signUpData.titlename}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.titlename ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select Title Name</option>
                      {titlenames.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {signUpErrors.titlename && <p className="text-red-500 text-xs mt-1">{signUpErrors.titlename}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={signUpData.fullname}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.fullname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {signUpErrors.fullname && <p className="text-red-500 text-xs mt-1">{signUpErrors.fullname}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={signUpData.lastname}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.lastname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your last name"
                    />
                    {signUpErrors.lastname && <p className="text-red-500 text-xs mt-1">{signUpErrors.lastname}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Calendar size={16} className="inline mr-2" />
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      name="birthdate"
                      value={signUpData.birthdate}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.birthdate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    />
                    {signUpErrors.birthdate && <p className="text-red-500 text-xs mt-1">{signUpErrors.birthdate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Building size={16} className="inline mr-2" />
                      Department *
                    </label>
                    <select
                      name="department"
                      value={signUpData.department}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {signUpErrors.department && <p className="text-red-500 text-xs mt-1">{signUpErrors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Building size={16} className="inline mr-2" />
                      Division *
                    </label>
                    <select
                      name="division"
                      value={signUpData.division}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.division ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select division</option>
                      {divisions.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {signUpErrors.division && <p className="text-red-500 text-xs mt-1">{signUpErrors.division}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Briefcase size={16} className="inline mr-2" />
                      Position Type *
                    </label>
                    <select
                      name="positionType"
                      value={signUpData.positionType}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.positionType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select position type</option>
                      {positionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {signUpErrors.positionType && <p className="text-red-500 text-xs mt-1">{signUpErrors.positionType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={signUpData.position}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your position"
                    />
                    {signUpErrors.position && <p className="text-red-500 text-xs mt-1">{signUpErrors.position}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={signUpData.email}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your email"
                    />
                    {signUpErrors.email && <p className="text-red-500 text-xs mt-1">{signUpErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="tel"
                      value={signUpData.tel}
                      onChange={handleSignUpInputChange}
                      className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                        signUpErrors.tel ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {signUpErrors.tel && <p className="text-red-500 text-xs mt-1">{signUpErrors.tel}</p>}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowSignUp(false)}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sign In</h2>
              <button
                onClick={() => setShowSignIn(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSignInSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={signInData.username}
                  onChange={handleSignInInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    signInErrors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your username"
                />
                {signInErrors.username && <p className="text-red-500 text-xs mt-1">{signInErrors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    signInErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
                {signInErrors.password && <p className="text-red-500 text-xs mt-1">{signInErrors.password}</p>}
              </div>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                ลืมรหัสผ่าน?
              </button>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSignIn(false)}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ลืมรหัสผ่าน</h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  อีเมลที่ลงทะเบียนไว้
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="you@customs.go.th"
                />
              </div>

              {forgotError && <p className="text-red-500 text-sm">{forgotError}</p>}
              {forgotSuccess && <p className="text-green-500 text-sm">{forgotSuccess}</p>}

              <div className="flex justify-end space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  ส่งลิงก์รีเซ็ตรหัสผ่าน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;