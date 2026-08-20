class AppConfig {
  static const String prodApiUrl = 'https://mealshare-frontend.vercel.app/api';
  static const String devApiUrl = 'http://10.0.2.2:5000/api';
  static const String localApiUrl = 'http://localhost:5000/api';

  // Active base URL defaults to live Vercel API for physical mobile devices
  static String activeBaseUrl = prodApiUrl;
}
