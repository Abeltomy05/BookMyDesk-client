import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

interface Props {
  title: string;
  body: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export const NotificationToast = ({ title, body, type = 'info', onClose }: Props) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-white';
      case 'error':
        return 'border-l-red-500 bg-white';
      case 'warning':
        return 'border-l-amber-500 bg-white';
      default:
        return 'border-l-blue-500 bg-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className={`
      ${getTypeStyles()}
      px-4 py-3 rounded-lg shadow-sm border border-gray-200 border-l-4
      max-w-sm min-w-80 relative
      transition-all duration-200 hover:shadow-md
    `}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-black text-sm">
            {title}
          </p>
          <p className="text-sm text-gray-800 mt-1">
            {body}
          </p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
 };

