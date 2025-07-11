import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Eye, EyeOff, Mail, Lock, User, Apple } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface InputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const AppInput = ({ label, placeholder, icon, type = "text", value, onChange, required, ...rest }: InputProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="w-full min-w-[200px] relative">
      {label && (
        <label className='block mb-2 text-sm text-white/80 font-medium'>
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          type={inputType}
          className="peer relative z-10 border-2 border-white/20 h-12 w-full rounded-lg bg-white/10 backdrop-blur-sm px-4 pl-12 font-light outline-none transition-all duration-300 ease-in-out focus:bg-white/15 focus:border-white/40 placeholder:text-white/60 text-white"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...rest}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-lg overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 0px, rgba(255,255,255,0.8) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-lg overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 2px, rgba(255,255,255,0.8) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-white/60">
            {icon}
          </div>
        )}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white/60 hover:text-white/80 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!formData.name.trim()) {
          toast({
            title: "Name Required",
            description: "Please enter your full name",
            variant: "destructive"
          });
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.name);
        
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome to VOIDR!",
            description: "Your account has been created successfully",
          });
          navigate('/dashboard');
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome Back!",
            description: "You have successfully signed in",
          });
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const socialButtons = [
    {
      name: 'Google',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>,
      gradient: 'from-red-500/20 to-blue-500/20'
    },
    {
      name: 'Apple',
      icon: <Apple className="w-5 h-5" />,
      gradient: 'from-gray-600/20 to-gray-800/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#171d40] relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#180180]/30 to-[#200505]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#221742]/40 to-[#181132]/40 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#100220]/30 to-[#200505]/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center relative z-10">
        <div className="w-full lg:w-[80%] xl:w-[70%] flex rounded-2xl overflow-hidden shadow-2xl"
             style={{
               background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
               backdropFilter: 'blur(20px)',
               border: '1px solid rgba(255,255,255,0.1)'
             }}>
          
          {/* Left Form Section */}
          <div
            className="w-full lg:w-1/2 p-8 lg:p-16 relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Mouse follow effect */}
            <div
              className={`absolute pointer-events-none w-[500px] h-[500px] bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-full blur-3xl transition-opacity duration-300 ${
                isHovering ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translate(${mousePosition.x - 250}px, ${mousePosition.y - 250}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
            
            <div className="relative z-10 h-full flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="text-center mb-8">
                  <picture>
                    <source srcSet="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.webp" type="image/webp" />
                    <img 
                      src="/lovable-uploads/7e5bb1d3-2b2f-4bae-bb4a-ec509545e99d.png" 
                      alt="VOIDR" 
                     className="h-16 sm:h-20 md:h-24 w-auto mx-auto mb-8"
                    />
                  </picture>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {isSignUp ? 'Join VOIDR' : 'Welcome Back'}
                  </h1>
                  <p className="text-white/70">
                    {isSignUp 
                      ? 'Create your account to get started' 
                      : 'Sign in to your account'
                    }
                  </p>
                </div>

                {/* Social Login */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {socialButtons.map((social, index) => (
                      <button
                        key={index}
                        type="button"
                        className="flex-1 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center gap-3 text-white hover:bg-white/20 transition-all duration-300 group"
                      >
                        <div className={`w-5 h-5 bg-gradient-to-r ${social.gradient} rounded p-0.5`}>
                          <div className="w-full h-full bg-white rounded flex items-center justify-center text-gray-700">
                            {social.icon}
                          </div>
                        </div>
                        <span className="text-sm font-medium">{social.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gradient-to-br from-[#181132] via-[#221742] to-[#100220] text-white/60">
                        or continue with email
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {isSignUp && (
                    <AppInput
                      label="Full Name"
                      placeholder="Enter your full name"
                      icon={<User size={20} />}
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      required
                    />
                  )}
                  
                  <AppInput
                    label="Email Address"
                    placeholder="Enter your email"
                    type="email"
                    icon={<Mail size={20} />}
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                  />
                  
                  <AppInput
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    icon={<Lock size={20} />}
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                  />
                </div>

                {/* Forgot Password */}
                {!isSignUp && (
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-white/70 hover:text-white transition-colors">
                      Forgot your password?
                    </Link>
                  </div>
                )}

                {/* Submit Button */}
                <LiquidButton type="submit" className="w-full" disabled={isLoading}>
                  {isLoading 
                    ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                    : (isSignUp ? 'Create Account' : 'Sign In')
                  }
                </LiquidButton>

                {/* Toggle Form */}
                <div className="text-center pt-4">
                  <span className="text-white/70">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="ml-2 text-white font-medium hover:underline transition-all duration-200"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="hidden lg:block w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#181132]/50 to-[#100220]/50 z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
              alt="Medical professionals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Join thousands of medical professionals
                </h2>
                <p className="text-lg text-white/80">
                  AI-powered tools designed specifically for busy Medical students, Residents, and Doctors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
