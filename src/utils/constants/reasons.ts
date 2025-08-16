export const amenityRejectionReasons = [
    "Inappropriate content or description",
    "Duplicate amenity already exists",
    "Not suitable for this property",
    "Insufficient information provided",
    "Violates community guidelines"
  ]


  export const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';

      default:
        return 'bg-gray-100 text-gray-800';
    }
  };