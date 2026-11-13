import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sprout, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { RegisterSchema, RegisterFormValues } from '../../schemas/index.js';
import { FormInput } from '../../components/forms/FormInput.js';

export const RegisterPage: React.FC = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      country: 'India',
      preferred_language: 'en',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      setServerError(null);

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            phone: values.phone,
            country: values.country,
            state: values.state,
            district: values.district,
            preferred_language: values.preferred_language,
          },
        },
      });

      if (error) {
        setServerError(error.message);
        return;
      }

      if (data.session) {
        navigate('/dashboard');
      } else {
        alert('Registration successful! Please check your email inbox to verify your account.');
        navigate('/login');
      }
    } catch (err: any) {
      setServerError(err.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-12">
      <div className="w-full max-w-lg p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 text-agri-primary rounded-2xl mb-2">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Farmer Registration</h2>
          <p className="text-xs text-slate-500">
            Join the precision agriculture platform for autonomous agronomy support
          </p>
        </div>

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Full Name"
            type="text"
            placeholder="Kisan Sharma"
            required
            error={errors.full_name?.message}
            {...register('full_name')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="kisan@example.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <FormInput
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <FormInput
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            required
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="State / Province"
              type="text"
              placeholder="Maharashtra"
              required
              error={errors.state?.message}
              {...register('state')}
            />

            <FormInput
              label="District"
              type="text"
              placeholder="Nashik"
              required
              error={errors.district?.message}
              {...register('district')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full px-4 py-3 text-xs font-bold text-white bg-agri-primary hover:bg-agri-primary-hover disabled:bg-slate-300 rounded-xl shadow-sm transition"
          >
            {loading ? 'Creating Profile...' : 'Complete Farmer Registration'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-agri-primary hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
