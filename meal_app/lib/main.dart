import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MealShareApp());
}

class MealShareApp extends StatelessWidget {
  const MealShareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Meal Share',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFFDF7F2),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF059669),
          primary: const Color(0xFF059669),
        ),
        useMaterial3: true,
      ),
      home: const MealShareWebViewScreen(),
    );
  }
}

class MealShareWebViewScreen extends StatefulWidget {
  const MealShareWebViewScreen({super.key});

  @override
  State<MealShareWebViewScreen> createState() => _MealShareWebViewScreenState();
}

class _MealShareWebViewScreenState extends State<MealShareWebViewScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;
  bool _hasError = false;
  final String _initialUrl = 'https://mealshare-frontend.vercel.app/';

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  void _initWebView() {
    final WebViewController controller = WebViewController();

    // Enable Android third-party cookies & file upload permission handling
    if (controller.platform is AndroidWebViewController) {
      final androidController = controller.platform as AndroidWebViewController;
      androidController.setMediaPlaybackRequiresUserGesture(false);
      androidController.setOnPlatformPermissionRequest(
        (request) {
          request.grant();
        },
      );
    }

    // Enable cookie persistence on Android
    final WebViewCookieManager cookieManager = WebViewCookieManager();
    if (cookieManager.platform is AndroidWebViewCookieManager) {
      (cookieManager.platform as AndroidWebViewCookieManager).setAcceptThirdPartyCookies(
        controller.platform as AndroidWebViewController,
        true,
      );
    }

    controller
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFFFDF7F2))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
              _hasError = false;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
          onWebResourceError: (WebResourceError error) {
            // Only flag main frame errors as full-page connection errors
            if (error.isForMainFrame ?? true) {
              setState(() {
                _isLoading = false;
                _hasError = true;
              });
            }
          },
          onNavigationRequest: (NavigationRequest request) async {
            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(_initialUrl));

    _controller = controller;
  }

  Future<void> _reloadPage() async {
    setState(() {
      _isLoading = true;
      _hasError = false;
    });
    await _controller.reload();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) async {
        if (didPop) return;
        if (await _controller.canGoBack()) {
          await _controller.goBack();
        } else {
          if (context.mounted) {
            Navigator.of(context).maybePop();
          }
        }
      },
      child: Scaffold(
        body: SafeArea(
          child: Stack(
            children: [
              // WebView
              if (!_hasError) WebViewWidget(controller: _controller),

              // Loading Indicator
              if (_isLoading && !_hasError)
                Container(
                  color: const Color(0xFFFDF7F2),
                  child: const Center(
                    child: CircularProgressIndicator(
                      color: Color(0xFF059669),
                    ),
                  ),
                ),

              // Network Retry Screen
              if (_hasError)
                Container(
                  color: const Color(0xFFFDF7F2),
                  padding: const EdgeInsets.all(24.0),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.wifi_off_rounded,
                          size: 72,
                          color: Color(0xFF059669),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Could not load Meal Share',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Please check your internet connection and try again.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF64748B),
                          ),
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton.icon(
                          onPressed: _reloadPage,
                          icon: const Icon(Icons.refresh_rounded),
                          label: const Text('Retry'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF059669),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
