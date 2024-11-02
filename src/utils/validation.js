export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!regex.test(email)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Must contain a number";
  if (!/[!@#$%^&*]/.test(password)) return "Must contain a special character (!@#$%^&*)";
  return "";
};

export const validatePhone = (phone) => {
  const regex = /^\+?[\d\s-()]{10,}$/;
  if (!phone) return "Phone number is required";
  if (!regex.test(phone)) return "Please enter a valid phone number";
  return "";
};

export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Please enter a valid name";
  return "";
};

export const validateZipCode = (zipCode) => {
  const regex = /^\d{5}(-\d{4})?$/;
  if (!zipCode) return "ZIP code is required";
  if (!regex.test(zipCode)) return "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
  return "";
};

export const validateAddress = (address) => {
  if (!address) return "Address is required";
  if (address.length < 5) return "Please enter a complete address";
  return "";
};

export const validateCity = (city) => {
  if (!city) return "City is required";
  if (city.length < 2) return "Please enter a valid city name";
  if (!/^[a-zA-Z\s'-]+$/.test(city)) return "Please enter a valid city name";
  return "";
};

export const validateState = (state) => {
  if (!state) return "State is required";
  if (state.length < 2) return "Please enter a valid state";
  return "";
};

export const validateCountry = (country) => {
  if (!country) return "Country is required";
  if (country.length < 2) return "Please enter a valid country name";
  return "";
};

export const validateForm = (formData, fields) => {
  const errors = {};
  fields.forEach(field => {
    switch (field) {
      case 'email':
        errors.email = validateEmail(formData.email);
        break;
      case 'password':
        errors.password = validatePassword(formData.password);
        break;
      case 'name':
        errors.name = validateName(formData.name);
        break;
      case 'phone':
        errors.phone = validatePhone(formData.phone);
        break;
      case 'address':
        errors.address = validateAddress(formData.address?.street);
        errors.city = validateCity(formData.address?.city);
        errors.state = validateState(formData.address?.state);
        errors.zipCode = validateZipCode(formData.address?.zipCode);
        errors.country = validateCountry(formData.address?.country);
        break;
      default:
        break;
    }
  });
  return errors;
}; 