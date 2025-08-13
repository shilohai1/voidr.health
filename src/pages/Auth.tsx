import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
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

  // Social login buttons removed per request.

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{
        backgroundColor: "#5f77cf",
        backgroundImage:
          "linear-gradient(271deg, rgba(95, 119, 207, 1) 0%, rgba(19, 19, 66, 1) 100%)",
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#180180]/30 to-[#200505]/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#221742]/40 to-[#181132]/40 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#100220]/30 to-[#200505]/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex items-center justify-center relative z-10">
        <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl"
             style={{
               background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
               backdropFilter: 'blur(20px)',
               border: '1px solid rgba(255,255,255,0.1)'
             }}>
          
          {/* Form Section */}
          <div
            className="w-full p-6 sm:p-8 md:p-10 relative overflow-hidden"
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

                {/* Social login options removed */}

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

          {/* Right image section removed per request */}
        </div>
      </div>
    </div>
  );
};

export default Auth;
