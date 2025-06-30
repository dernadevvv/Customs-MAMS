import React, { useState } from 'react';
import { Eye, EyeOff, Upload, X, Calendar, User, Mail, Phone, Building, Briefcase } from 'lucide-react';

interface AuthFormData {
  userId: string;
  username: string;
  password: string;
  titlename: string
  fullname: string;
  lastname: string;
  birthdate: string;
  department: string;
  division: string;
  positionType: string;
  position: string;
  email: string;
  tel: string;
  picture: File | null;
}

interface AuthPageProps {
  onClose: () => void;
  onSignIn: (userData: AuthFormData) => void;
}

interface FormErrors {
    [key: string]: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ onClose, onSignIn }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<AuthFormData>({
    userId: '',
    username: '',
    password: '',
    titlename: '',
    fullname: '',
    lastname: '',
    birthdate: '',
    department: '',
    division: '',
    positionType: '',
    position: '',
    email: '',
    tel: '',
    picture: null
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const departments = [
    'ศทส',
    'กบท',
    'กกม',
    'กตน',
    'กพบ',
    'กตอ',
    'กบช',
    'กมพ',
    'กยผ',
    'กสอ',
    'กสป',
    'สกท',
    'สผภ',
    'สสภ',
    'สสล',
    'สดม',
    'สทก',
    'สทบ',
    'ศภ1',
    'ศภ2',
    'ศภ3',
    'ศภ4',
    'ศภ5',
    'สลข',
    'กนอ',
    'กพก',
    'สมพ',
    'สนค'
  ];

  const positionTypes = [
    'ข้าราชการ',
    'พนักงานราชการ',
    'ลูกจ้างชั่วคราว',
    'ลูกจ้างประจำ'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof AuthFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setFormData(prev => ({ ...prev, picture: file }));
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        if (errors.picture) {
          setErrors(prev => ({ ...prev, picture: '' }));
        }
      } else {
        setErrors(prev => ({ ...prev, picture: 'Please select a PNG or JPG file' }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, picture: null }));
    setPreviewImage(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};

    if (!formData.userId.trim()) newErrors.userId = 'User ID is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.birthdate) newErrors.birthdate = 'Birth date is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.division.trim()) newErrors.division = 'Division is required';
    if (!formData.positionType) newErrors.positionType = 'Position type is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.tel.trim()) newErrors.tel = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSignIn(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=32" 
                alt="Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sign In to Prisma</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User size={16} className="inline mr-2" />
                  User ID *
                </label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.userId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your user ID"
                />
                {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User size={16} className="inline mr-2" />
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your username"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.fullname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.lastname ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar size={16} className="inline mr-2" />
                  Birth Date *
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.birthdate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail size={16} className="inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Building size={16} className="inline mr-2" />
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              {/* Division */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Division *
                </label>
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.division ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your division"
                />
                {errors.division && <p className="text-red-500 text-xs mt-1">{errors.division}</p>}
              </div>

              {/* Position Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Briefcase size={16} className="inline mr-2" />
                  Position Type *
                </label>
                <select
                  name="positionType"
                  value={formData.positionType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.positionType ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select position type</option>
                  {positionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.positionType && <p className="text-red-500 text-xs mt-1">{errors.positionType}</p>}
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your position"
                />
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone size={16} className="inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white transition-colors ${
                    errors.tel ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.tel && <p className="text-red-500 text-xs mt-1">{errors.tel}</p>}
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Picture (PNG or JPG)
                </label>
                <div className="space-y-3">
                  {previewImage ? (
                    <div className="relative inline-block">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-24 h-24 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400"
                  />
                  {errors.picture && <p className="text-red-500 text-xs">{errors.picture}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default AuthPage;