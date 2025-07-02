export interface BaseFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface VendorFormData extends BaseFormData {
  companyName: string;
  companyAddress: string;
  idProof: string | null;
}

export interface ClientFormData extends BaseFormData {}

export interface FormField {
  name: string;
  type: string;
  placeholder: string;
  icon: React.ComponentType<{ size?: number }>;
  isPassword?: boolean;
  isFile?: boolean;
  accept?: string;
  gridSpan?: 'full' | 'half';
  required?: boolean;
}

export interface SignupConfig {
  title: string;
  subtitle: string;
  userType: 'vendor' | 'client';
  fields: FormField[];
  image: {
    src: string;
    alt: string;
    overlayTitle: string;
    overlaySubtitle: string;
  };
  service: {
    sendOtp: (email: string) => Promise<any>;
    verifyOtp: (email: string, otp: string) => Promise<any>;
    signup: (data: any) => Promise<any>;
    handleGoogleLogin: () => void;
  };
    validation: {
    validateForm: (data: any, setErrors: any, setTouched: any, validateField: any) => boolean;
    validateField: (field: string, value: any, formData?: any) => string | undefined;
    };
  loginRoute: string;
}