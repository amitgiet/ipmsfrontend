
import React, { useState } from 'react';
import { AdminLoginForm } from './AdminLoginForm';
import { TeamLoginForm } from './TeamLoginForm';
import { Building2, Users, Shield, Zap } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Enhanced Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ProjectHub
              </h1>
              <p className="text-lg text-gray-500 font-medium">Next-gen project management</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Transform Your Team's
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Productivity</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Empower your team with intelligent project management, seamless collaboration, 
              and role-based workflows that scale with your ambitions.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Role-Based Access</div>
                <div className="text-sm text-gray-600">Tailored permissions for every team member</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Secure & Reliable</div>
                <div className="text-sm text-gray-600">Enterprise-grade security you can trust</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Lightning Fast</div>
                <div className="text-sm text-gray-600">Optimized for speed and performance</div>
              </div>
            </div>
          </div>

          {/* Stats section with glassmorphism */}
          <div className="grid grid-cols-2 gap-6 mt-10">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">500+</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Projects Delivered</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-sm">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-sm font-medium text-gray-600 mt-1">Uptime Guarantee</div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms with enhanced styling */}
        <div className="w-full space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
            {isSignUp ? <AdminLoginForm /> : <TeamLoginForm />}
          </div>
          
          
          {/* Mobile branding */}
          <div className="lg:hidden text-center pt-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ProjectHub
              </h1>
            </div>
            <p className="text-gray-600">Transform your team's productivity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
