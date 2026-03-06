import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_mlkit_face_detection/google_mlkit_face_detection.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:webview_flutter/webview_flutter.dart';

final ValueNotifier<bool> kycVerifiedNotifier = ValueNotifier<bool>(false);
final ValueNotifier<bool> kycBasicVerifiedNotifier = ValueNotifier<bool>(false);
final ValueNotifier<bool> kycAdvancedVerifiedNotifier = ValueNotifier<bool>(
  false,
);
final ValueNotifier<ThemeMode> appThemeModeNotifier = ValueNotifier<ThemeMode>(
  ThemeMode.dark,
);
final ValueNotifier<String?> profileImagePathNotifier = ValueNotifier<String?>(
  null,
);
final ValueNotifier<String> nicknameNotifier = ValueNotifier<String>(
  'sum***@****',
);
final ValueNotifier<String> avatarSymbolNotifier = ValueNotifier<String>('S');
final String currentUserUid = _generateUserUid();
final ValueNotifier<List<SupportAlert>> supportAlertsNotifier =
    ValueNotifier<List<SupportAlert>>([]);
final ValueNotifier<bool> showHomeFavoritesWidget = ValueNotifier<bool>(true);
final ValueNotifier<bool> showHomeTopMoversWidget = ValueNotifier<bool>(true);
final ValueNotifier<bool> isUserLoggedInNotifier = ValueNotifier<bool>(false);
final ValueNotifier<String> authIdentityNotifier = ValueNotifier<String>('');
final ValueNotifier<double> fundingUsdtBalanceNotifier = ValueNotifier<double>(
  0,
);
final ValueNotifier<double> spotUsdtBalanceNotifier = ValueNotifier<double>(0);
int _supportAlertCounter = 1;

class SupportAlert {
  const SupportAlert({
    required this.id,
    required this.userUid,
    required this.message,
    required this.timestamp,
    this.resolved = false,
  });

  final int id;
  final String userUid;
  final String message;
  final DateTime timestamp;
  final bool resolved;

  SupportAlert copyWith({bool? resolved}) {
    return SupportAlert(
      id: id,
      userUid: userUid,
      message: message,
      timestamp: timestamp,
      resolved: resolved ?? this.resolved,
    );
  }
}

SupportAlert addSupportAgentAlert(String message) {
  final alert = SupportAlert(
    id: _supportAlertCounter++,
    userUid: currentUserUid,
    message: message,
    timestamp: DateTime.now(),
  );
  supportAlertsNotifier.value = [alert, ...supportAlertsNotifier.value];
  return alert;
}

String _generateUserUid() {
  final random = Random();
  final a = random.nextInt(90000000) + 10000000;
  final b = random.nextInt(900) + 100;
  return '$a$b';
}

void main() {
  runApp(const BitegitApp());
}

class BitegitApp extends StatelessWidget {
  const BitegitApp({super.key});

  @override
  Widget build(BuildContext context) {
    final darkTheme = ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: const Color(0xFF05070B),
      fontFamily: 'SF Pro Display',
      colorScheme: const ColorScheme.dark(
        primary: Color(0xFF9DFB3B),
        secondary: Color(0xFF111B31),
        surface: Color(0xFF0A1221),
      ),
      textTheme: const TextTheme(
        bodyMedium: TextStyle(fontSize: 12.2),
        bodySmall: TextStyle(fontSize: 10.8),
        titleMedium: TextStyle(fontSize: 13.6),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF0E1523),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF1E2C46)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF1E2C46)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF9DFB3B)),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 12,
        ),
        labelStyle: const TextStyle(fontSize: 11.8, color: Colors.white70),
      ),
    );

    final lightTheme = ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF3F6FC),
      fontFamily: 'SF Pro Display',
      colorScheme: const ColorScheme.light(
        primary: Color(0xFF2B9C1F),
        secondary: Color(0xFFDCE7FA),
        surface: Colors.white,
      ),
      textTheme: const TextTheme(
        bodyMedium: TextStyle(fontSize: 12.2),
        bodySmall: TextStyle(fontSize: 10.8),
        titleMedium: TextStyle(fontSize: 13.6),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFB8C4DE)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFB8C4DE)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF2B9C1F)),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 12,
        ),
        labelStyle: const TextStyle(fontSize: 11.8, color: Colors.black54),
      ),
    );

    return ValueListenableBuilder<ThemeMode>(
      valueListenable: appThemeModeNotifier,
      builder: (context, mode, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Bitegit',
          theme: lightTheme,
          darkTheme: darkTheme,
          themeMode: mode,
          home: const ExchangeShell(),
        );
      },
    );
  }
}

class MarketPair {
  const MarketPair({
    required this.symbol,
    required this.price,
    required this.change,
    required this.logoUrl,
    required this.volume,
  });

  final String symbol;
  final String price;
  final String change;
  final String logoUrl;
  final String volume;
}

class P2PAdItem {
  const P2PAdItem({
    required this.seller,
    required this.pair,
    required this.price,
    required this.limits,
    required this.completed30d,
    required this.completionRate30d,
    required this.avgReleaseTime,
    required this.avgPaymentTime,
    required this.available,
    required this.logoUrl,
    this.paymentMethods = const ['UPI'],
    this.topPick = false,
    this.verified = true,
    this.badge = 'Merchant',
    this.reputationScore = 4.8,
    this.timerMinutes = 15,
    this.autoPriceEnabled = true,
    this.side = 'sell',
  });

  final String seller;
  final String pair;
  final String price;
  final String limits;
  final String completed30d;
  final String completionRate30d;
  final String avgReleaseTime;
  final String avgPaymentTime;
  final String available;
  final String logoUrl;
  final List<String> paymentMethods;
  final bool topPick;
  final bool verified;
  final String badge;
  final double reputationScore;
  final int timerMinutes;
  final bool autoPriceEnabled;
  final String side;

  double get priceValue => _parseNumericValue(price);
  double get availableUsdt => _parseNumericValue(available);

  List<double> get limitRange {
    final values = RegExp(
      r'([0-9]+(?:\.[0-9]+)?(?:K|M)?)',
      caseSensitive: false,
    ).allMatches(limits).toList();
    if (values.length < 2) return [0, 0];
    return [
      _parseNumericValue(values[0].group(1) ?? '0'),
      _parseNumericValue(values[1].group(1) ?? '0'),
    ];
  }

  P2PAdItem copyWith({
    String? seller,
    String? pair,
    String? price,
    String? limits,
    String? completed30d,
    String? completionRate30d,
    String? avgReleaseTime,
    String? avgPaymentTime,
    String? available,
    String? logoUrl,
    List<String>? paymentMethods,
    bool? topPick,
    bool? verified,
    String? badge,
    double? reputationScore,
    int? timerMinutes,
    bool? autoPriceEnabled,
    String? side,
  }) {
    return P2PAdItem(
      seller: seller ?? this.seller,
      pair: pair ?? this.pair,
      price: price ?? this.price,
      limits: limits ?? this.limits,
      completed30d: completed30d ?? this.completed30d,
      completionRate30d: completionRate30d ?? this.completionRate30d,
      avgReleaseTime: avgReleaseTime ?? this.avgReleaseTime,
      avgPaymentTime: avgPaymentTime ?? this.avgPaymentTime,
      available: available ?? this.available,
      logoUrl: logoUrl ?? this.logoUrl,
      paymentMethods: paymentMethods ?? this.paymentMethods,
      topPick: topPick ?? this.topPick,
      verified: verified ?? this.verified,
      badge: badge ?? this.badge,
      reputationScore: reputationScore ?? this.reputationScore,
      timerMinutes: timerMinutes ?? this.timerMinutes,
      autoPriceEnabled: autoPriceEnabled ?? this.autoPriceEnabled,
      side: side ?? this.side,
    );
  }
}

enum P2POrderState {
  created,
  awaitingPayment,
  paymentSent,
  sellerConfirming,
  completed,
  cancelled,
  appealOpened,
  underReview,
  frozen,
}

String p2pOrderStateLabel(P2POrderState state) {
  switch (state) {
    case P2POrderState.created:
      return 'CREATED';
    case P2POrderState.awaitingPayment:
      return 'AWAITING_PAYMENT';
    case P2POrderState.paymentSent:
      return 'PAYMENT_SENT';
    case P2POrderState.sellerConfirming:
      return 'SELLER_CONFIRMING';
    case P2POrderState.completed:
      return 'COMPLETED';
    case P2POrderState.cancelled:
      return 'CANCELLED';
    case P2POrderState.appealOpened:
      return 'APPEAL_OPENED';
    case P2POrderState.underReview:
      return 'UNDER_REVIEW';
    case P2POrderState.frozen:
      return 'FROZEN';
  }
}

Color p2pStateColor(P2POrderState state) {
  switch (state) {
    case P2POrderState.completed:
      return const Color(0xFF53D983);
    case P2POrderState.paymentSent:
      return const Color(0xFF53D983);
    case P2POrderState.sellerConfirming:
      return const Color(0xFF9DFB3B);
    case P2POrderState.cancelled:
      return const Color(0xFFEF4E5E);
    case P2POrderState.appealOpened:
      return const Color(0xFFFFAE42);
    case P2POrderState.underReview:
      return const Color(0xFFFFAE42);
    case P2POrderState.frozen:
      return const Color(0xFFB894F4);
    case P2POrderState.created:
      return const Color(0xFF57A2FF);
    case P2POrderState.awaitingPayment:
      return const Color(0xFF57A2FF);
  }
}

class P2POrderItem {
  const P2POrderItem({
    required this.id,
    required this.pair,
    required this.side,
    required this.amount,
    required this.status,
    required this.createdAt,
    required this.logoUrl,
    required this.counterparty,
    required this.paymentMethod,
    this.orderState = P2POrderState.created,
    this.fiatAmount = 0,
    this.usdtAmount = 0,
    this.pricePerUsdt = 0,
    this.feeUsdt = 0,
    this.createdAtMs = 0,
    this.expiresAtMs = 0,
    this.escrowLocked = false,
    this.escrowReleased = false,
    this.cancelReason,
    this.disputeReason,
    this.appealStatus,
    this.appealProofPath,
    this.appealOpenedAtMs = 0,
    this.buyerWallet = 'buyer',
    this.sellerWallet = 'seller',
    this.escrowWallet = 'system_escrow',
    this.isFrozen = false,
    this.fraudFlag = false,
    this.unreadMessages = 0,
    this.paymentProofPath,
  });

  final String id;
  final String pair;
  final String side;
  final String amount;
  final String status;
  final String createdAt;
  final String logoUrl;
  final String counterparty;
  final String paymentMethod;
  final P2POrderState orderState;
  final double fiatAmount;
  final double usdtAmount;
  final double pricePerUsdt;
  final double feeUsdt;
  final int createdAtMs;
  final int expiresAtMs;
  final bool escrowLocked;
  final bool escrowReleased;
  final String? cancelReason;
  final String? disputeReason;
  final String? appealStatus;
  final String? appealProofPath;
  final int appealOpenedAtMs;
  final String buyerWallet;
  final String sellerWallet;
  final String escrowWallet;
  final bool isFrozen;
  final bool fraudFlag;
  final int unreadMessages;
  final String? paymentProofPath;

  P2POrderItem copyWith({
    String? id,
    String? pair,
    String? side,
    String? amount,
    String? status,
    String? createdAt,
    String? logoUrl,
    String? counterparty,
    String? paymentMethod,
    P2POrderState? orderState,
    double? fiatAmount,
    double? usdtAmount,
    double? pricePerUsdt,
    double? feeUsdt,
    int? createdAtMs,
    int? expiresAtMs,
    bool? escrowLocked,
    bool? escrowReleased,
    String? cancelReason,
    String? disputeReason,
    String? appealStatus,
    String? appealProofPath,
    int? appealOpenedAtMs,
    String? buyerWallet,
    String? sellerWallet,
    String? escrowWallet,
    bool? isFrozen,
    bool? fraudFlag,
    int? unreadMessages,
    String? paymentProofPath,
  }) {
    return P2POrderItem(
      id: id ?? this.id,
      pair: pair ?? this.pair,
      side: side ?? this.side,
      amount: amount ?? this.amount,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      logoUrl: logoUrl ?? this.logoUrl,
      counterparty: counterparty ?? this.counterparty,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      orderState: orderState ?? this.orderState,
      fiatAmount: fiatAmount ?? this.fiatAmount,
      usdtAmount: usdtAmount ?? this.usdtAmount,
      pricePerUsdt: pricePerUsdt ?? this.pricePerUsdt,
      feeUsdt: feeUsdt ?? this.feeUsdt,
      createdAtMs: createdAtMs ?? this.createdAtMs,
      expiresAtMs: expiresAtMs ?? this.expiresAtMs,
      escrowLocked: escrowLocked ?? this.escrowLocked,
      escrowReleased: escrowReleased ?? this.escrowReleased,
      cancelReason: cancelReason ?? this.cancelReason,
      disputeReason: disputeReason ?? this.disputeReason,
      appealStatus: appealStatus ?? this.appealStatus,
      appealProofPath: appealProofPath ?? this.appealProofPath,
      appealOpenedAtMs: appealOpenedAtMs ?? this.appealOpenedAtMs,
      buyerWallet: buyerWallet ?? this.buyerWallet,
      sellerWallet: sellerWallet ?? this.sellerWallet,
      escrowWallet: escrowWallet ?? this.escrowWallet,
      isFrozen: isFrozen ?? this.isFrozen,
      fraudFlag: fraudFlag ?? this.fraudFlag,
      unreadMessages: unreadMessages ?? this.unreadMessages,
      paymentProofPath: paymentProofPath ?? this.paymentProofPath,
    );
  }
}

double _parseNumericValue(String input) {
  final normalized = input.toUpperCase().replaceAll(',', '').trim();
  final match = RegExp(
    r'([0-9]+(?:\.[0-9]+)?)([KMBT]?)',
  ).firstMatch(normalized);
  if (match == null) return 0;
  final base = double.tryParse(match.group(1) ?? '') ?? 0;
  final suffix = match.group(2) ?? '';
  if (suffix == 'K') return base * 1000;
  if (suffix == 'M') return base * 1000000;
  if (suffix == 'B') return base * 1000000000;
  if (suffix == 'T') return base * 1000000000000;
  return base;
}

String _formatWithCommas(num value, {int decimals = 2}) {
  final fixed = value.toStringAsFixed(decimals);
  final parts = fixed.split('.');
  final intPart = parts.first.replaceAllMapped(
    RegExp(r'\B(?=(\d{3})+(?!\d))'),
    (m) => ',',
  );
  if (decimals <= 0) return intPart;
  return '$intPart.${parts.last}';
}

String _formatCompactVolume(double value) {
  if (value >= 1000000000) {
    return '${(value / 1000000000).toStringAsFixed(2)}B USDT';
  }
  if (value >= 1000000) {
    return '${(value / 1000000).toStringAsFixed(2)}M USDT';
  }
  if (value >= 1000) {
    return '${(value / 1000).toStringAsFixed(2)}K USDT';
  }
  return '${value.toStringAsFixed(0)} USDT';
}

double _parsePercentValue(String change) {
  final cleaned = change.replaceAll('%', '').replaceAll('+', '').trim();
  return double.tryParse(cleaned) ?? 0;
}

String _maskIdentity(String value) {
  final trimmed = value.trim();
  if (trimmed.isEmpty) return '';
  if (trimmed.contains('@')) {
    final parts = trimmed.split('@');
    final name = parts.first;
    final domain = parts.last;
    final safeName = name.length <= 2
        ? '${name[0]}*'
        : '${name.substring(0, 2)}***';
    final safeDomain = domain.length <= 3
        ? domain
        : '${domain.substring(0, 2)}***';
    return '$safeName@$safeDomain';
  }
  final digits = trimmed.replaceAll(RegExp(r'\D'), '');
  if (digits.length < 4) return '***';
  return '${digits.substring(0, 2)}****${digits.substring(digits.length - 2)}';
}

class AuthOtpService {
  static final List<Uri> _requestUris = <Uri>[
    Uri.parse('https://bitegit.com/api/signup/send-code'),
    Uri.parse('https://bitegit.com/auth/signup/send-otp'),
    Uri.parse('https://bitegit.com/api/auth/otp/request'),
  ];
  static final List<Uri> _verifyUris = <Uri>[
    Uri.parse('https://bitegit.com/api/signup/verify-code'),
    Uri.parse('https://bitegit.com/api/auth/otp/verify'),
  ];
  static final Map<String, String> _otpStore = <String, String>{};
  static final Random _random = Random();

  static String generateOtp() {
    final value = _random.nextInt(900000) + 100000;
    return value.toString();
  }

  static Future<OtpRequestResult> requestOtp(String identity) async {
    for (final uri in _requestUris) {
      final response = await _postJson(
        uri: uri,
        payload: <String, dynamic>{
          'contact': identity,
          'identity': identity,
          'email': identity,
          'channel': identity.contains('@') ? 'email' : 'sms',
        },
      );
      if (!response.ok || response.bodyMap == null) continue;
      final decoded = response.bodyMap!;
      final message = (decoded['message'] ?? 'OTP sent successfully')
          .toString();
      return OtpRequestResult(
        success: true,
        backendSent: true,
        message: message,
        demoOtp: decoded['devCode']?.toString(),
      );
    }

    final otp = generateOtp();
    _otpStore[identity.toLowerCase()] = otp;
    await Future<void>.delayed(const Duration(milliseconds: 450));
    return OtpRequestResult(
      success: true,
      backendSent: false,
      message:
          'Email/SMS gateway is not configured on backend. Using demo OTP for now.',
      demoOtp: otp,
    );
  }

  static Future<bool> verifyOtp({
    required String identity,
    required String otp,
  }) async {
    final trimmed = otp.trim();
    final displayName = _displayNameFromIdentity(identity);
    for (final uri in _verifyUris) {
      final response = await _postJson(
        uri: uri,
        payload: <String, dynamic>{
          'contact': identity,
          'identity': identity,
          'otp': trimmed,
          'code': trimmed,
          'name': displayName,
        },
      );
      if (!response.ok || response.bodyMap == null) continue;
      final decoded = response.bodyMap!;
      final ok =
          decoded['success'] == true ||
          decoded['verified'] == true ||
          decoded['status']?.toString().toLowerCase() == 'verified' ||
          decoded['status']?.toString().toLowerCase() == 'success' ||
          response.statusCode == 201;
      if (ok) return true;
    }

    final key = identity.toLowerCase();
    return _otpStore[key] != null && _otpStore[key] == trimmed;
  }

  static Future<_HttpJsonResponse> _postJson({
    required Uri uri,
    required Map<String, dynamic> payload,
  }) async {
    final client = HttpClient()
      ..connectionTimeout = const Duration(seconds: 10);
    try {
      final req = await client.postUrl(uri);
      req.headers.contentType = ContentType.json;
      req.add(utf8.encode(jsonEncode(payload)));
      final resp = await req.close();
      final body = await resp.transform(utf8.decoder).join();
      Map<String, dynamic>? bodyMap;
      try {
        final decoded = jsonDecode(body);
        if (decoded is Map<String, dynamic>) {
          bodyMap = decoded;
        }
      } catch (_) {
        bodyMap = null;
      }
      final bool ok =
          resp.statusCode >= 200 &&
          resp.statusCode < 300 &&
          (bodyMap == null ||
              bodyMap['success'] == true ||
              bodyMap['status']?.toString().toLowerCase() == 'success' ||
              bodyMap['message'] != null);
      return _HttpJsonResponse(
        ok: ok,
        statusCode: resp.statusCode,
        bodyMap: bodyMap,
      );
    } catch (_) {
      return const _HttpJsonResponse(ok: false, statusCode: 0, bodyMap: null);
    } finally {
      client.close(force: true);
    }
  }
}

class _HttpJsonResponse {
  const _HttpJsonResponse({
    required this.ok,
    required this.statusCode,
    required this.bodyMap,
  });

  final bool ok;
  final int statusCode;
  final Map<String, dynamic>? bodyMap;
}

String _displayNameFromIdentity(String identity) {
  final raw = identity.trim();
  if (raw.isEmpty) return 'Bitegit User';
  if (raw.contains('@')) {
    final local = raw.split('@').first;
    if (local.trim().isNotEmpty) return local.trim();
  }
  final digits = raw.replaceAll(RegExp(r'\D'), '');
  if (digits.length >= 4) {
    return 'User ${digits.substring(digits.length - 4)}';
  }
  return 'Bitegit User';
}

class OtpRequestResult {
  const OtpRequestResult({
    required this.success,
    required this.backendSent,
    required this.message,
    this.demoOtp,
  });

  final bool success;
  final bool backendSent;
  final String message;
  final String? demoOtp;
}

class LiveMarketService {
  static final Uri _marketsUri = Uri.parse(
    'https://api.coingecko.com/api/v3/coins/markets'
    '?vs_currency=usd'
    '&order=market_cap_desc'
    '&per_page=120'
    '&page=1'
    '&sparkline=false'
    '&price_change_percentage=24h',
  );

  Future<List<MarketPair>> fetchPairs() async {
    final client = HttpClient()..connectionTimeout = const Duration(seconds: 8);
    try {
      final request = await client.getUrl(_marketsUri);
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      final response = await request.close();
      if (response.statusCode != 200) {
        throw Exception('Market API status ${response.statusCode}');
      }
      final body = await response.transform(utf8.decoder).join();
      final decoded = jsonDecode(body);
      if (decoded is! List) throw Exception('Invalid market response');
      final pairs = <MarketPair>[];
      for (final item in decoded) {
        if (item is! Map<String, dynamic>) continue;
        final symbol = (item['symbol'] ?? '').toString().toUpperCase();
        if (symbol.isEmpty) continue;
        final double priceNum =
            (item['current_price'] as num?)?.toDouble() ?? 0;
        final double changeNum =
            (item['price_change_percentage_24h'] as num?)?.toDouble() ?? 0;
        final double volumeNum =
            (item['total_volume'] as num?)?.toDouble() ?? 0;
        final decimals = priceNum >= 1000
            ? 2
            : priceNum >= 1
            ? 4
            : 6;
        final changeSign = changeNum >= 0 ? '+' : '';
        pairs.add(
          MarketPair(
            symbol: '$symbol/USDT',
            price: _formatWithCommas(priceNum, decimals: decimals),
            change: '$changeSign${changeNum.toStringAsFixed(2)}%',
            logoUrl: (item['image'] ?? '').toString(),
            volume: _formatCompactVolume(volumeNum),
          ),
        );
      }
      return pairs.where((pair) => pair.symbol != '/USDT').toList();
    } finally {
      client.close(force: true);
    }
  }
}

class UserAvatar extends StatelessWidget {
  const UserAvatar({super.key, this.radius = 20});

  final double radius;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<String?>(
      valueListenable: profileImagePathNotifier,
      builder: (context, imagePath, child) {
        if (imagePath != null && imagePath.isNotEmpty) {
          return CircleAvatar(
            radius: radius,
            backgroundColor: const Color(0xFF1B273D),
            backgroundImage: FileImage(File(imagePath)),
          );
        }

        return ValueListenableBuilder<String>(
          valueListenable: avatarSymbolNotifier,
          builder: (context, symbol, child) {
            return CircleAvatar(
              radius: radius,
              backgroundColor: const Color(0xFF25324A),
              child: Text(
                symbol,
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: radius * 0.9,
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class CoinLogo extends StatelessWidget {
  const CoinLogo({
    super.key,
    required this.url,
    required this.fallback,
    this.size = 24,
  });

  final String url;
  final String fallback;
  final double size;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(size / 2),
      child: Image.network(
        url,
        width: size,
        height: size,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            width: size,
            height: size,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: const Color(0xFF1B273D),
              borderRadius: BorderRadius.circular(size / 2),
            ),
            child: Text(
              fallback.isNotEmpty ? fallback[0] : '?',
              style: TextStyle(
                fontSize: size * 0.45,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          );
        },
      ),
    );
  }
}

const List<MarketPair> kMarketPairs = [
  MarketPair(
    symbol: 'BTC/USDT',
    price: '62,559.38',
    change: '-0.70%',
    logoUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    volume: '43.24M USDT',
  ),
  MarketPair(
    symbol: 'ETH/USDT',
    price: '3,230.76',
    change: '+0.96%',
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    volume: '84.70M USDT',
  ),
  MarketPair(
    symbol: 'SOL/USDT',
    price: '143.60',
    change: '-0.96%',
    logoUrl: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    volume: '3.24M USDT',
  ),
  MarketPair(
    symbol: 'XRP/USDT',
    price: '0.6236',
    change: '+0.58%',
    logoUrl:
        'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    volume: '5.18M USDT',
  ),
  MarketPair(
    symbol: 'BNB/USDT',
    price: '591.75',
    change: '+0.30%',
    logoUrl:
        'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    volume: '2.87M USDT',
  ),
  MarketPair(
    symbol: 'DOGE/USDT',
    price: '0.0930',
    change: '-0.97%',
    logoUrl: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    volume: '8.49M USDT',
  ),
];
final ValueNotifier<MarketPair> selectedTradePairNotifier =
    ValueNotifier<MarketPair>(kMarketPairs.first);

const List<P2PAdItem> kP2PSampleAds = [
  P2PAdItem(
    seller: 'TecnoSeller',
    pair: 'USDT/INR',
    price: '98.39 INR',
    limits: '1,900.00 - 2,043.85 INR',
    completed30d: '705',
    completionRate30d: '100%',
    avgReleaseTime: '15m',
    avgPaymentTime: '07m 42s',
    available: '20.773 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['Digital eRupee'],
    topPick: true,
    side: 'sell',
    badge: 'Top Merchant',
    timerMinutes: 15,
    reputationScore: 4.9,
  ),
  P2PAdItem(
    seller: 'MR. JINU',
    pair: 'USDT/INR',
    price: '96.30 INR',
    limits: '10,000.00 - 19,429.35 INR',
    completed30d: '46',
    completionRate30d: '100%',
    avgReleaseTime: '30m',
    avgPaymentTime: '13m 11s',
    available: '201.7586 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['Cash Deposit', 'UPI'],
    side: 'sell',
    badge: 'Verified Pro',
    timerMinutes: 30,
    reputationScore: 4.7,
  ),
  P2PAdItem(
    seller: 'SAMIMMOLLA',
    pair: 'USDT/INR',
    price: '96.50 INR',
    limits: '20,000.00 - 200.00K INR',
    completed30d: '186',
    completionRate30d: '100%',
    avgReleaseTime: '30m',
    avgPaymentTime: '16m 08s',
    available: '2,085.686 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['Cash Deposit', 'UPI', 'Digital eRupee'],
    side: 'sell',
    badge: 'Diamond Merchant',
    timerMinutes: 30,
    reputationScore: 4.8,
  ),
  P2PAdItem(
    seller: 'salmmy3_12',
    pair: 'USDT/INR',
    price: '95.90 INR',
    limits: '5,000.00 - 40,000.00 INR',
    completed30d: '59',
    completionRate30d: '100%',
    avgReleaseTime: '15m',
    avgPaymentTime: '10m 38s',
    available: '85.12 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['IMPS', 'UPI'],
    side: 'buy',
    badge: 'Buyer Ad',
    timerMinutes: 15,
    reputationScore: 4.5,
  ),
  P2PAdItem(
    seller: 'iron India',
    pair: 'USDT/INR',
    price: '95.72 INR',
    limits: '1,000.00 - 5,000.00 INR',
    completed30d: '132',
    completionRate30d: '91%',
    avgReleaseTime: '15m',
    avgPaymentTime: '11m 25s',
    available: '56.24 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['UPI'],
    side: 'buy',
    badge: 'Buyer Ad',
    timerMinutes: 15,
    reputationScore: 4.4,
  ),
  P2PAdItem(
    seller: 'ArekSxPro',
    pair: 'USDT/INR',
    price: '96.14 INR',
    limits: '5,000.00 - 568,000.00 INR',
    completed30d: '1446',
    completionRate30d: '98%',
    avgReleaseTime: '30m',
    avgPaymentTime: '08m 12s',
    available: '36,159.69 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['UPI', 'Paytm', 'PhonePe', 'Google Pay'],
    side: 'sell',
    badge: 'Top Picks',
    topPick: true,
    timerMinutes: 30,
    reputationScore: 4.9,
  ),
  P2PAdItem(
    seller: 'Arekskumar',
    pair: 'USDT/INR',
    price: '102.00 INR',
    limits: '100,000.00 - 2.04M INR',
    completed30d: '115',
    completionRate30d: '86%',
    avgReleaseTime: '30m',
    avgPaymentTime: '10m 10s',
    available: '20,000 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['Cash Deposit', 'UPI', 'Digital eRupee', 'Google Pay'],
    side: 'buy',
    badge: 'Buyer Ad',
    timerMinutes: 30,
    reputationScore: 4.2,
  ),
  P2PAdItem(
    seller: 'mahitravel',
    pair: 'USDT/INR',
    price: '97.00 INR',
    limits: '5,000.00 - 5,000.35 INR',
    completed30d: '285',
    completionRate30d: '93%',
    avgReleaseTime: '15m',
    avgPaymentTime: '09m 44s',
    available: '51.55 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['Digital eRupee'],
    side: 'buy',
    badge: 'Buyer Ad',
    timerMinutes: 15,
    reputationScore: 4.3,
  ),
  P2PAdItem(
    seller: 'Reema08',
    pair: 'USDT/INR',
    price: '96.14 INR',
    limits: '5,000.00 - 5,680.00 INR',
    completed30d: '1446',
    completionRate30d: '98%',
    avgReleaseTime: '30m',
    avgPaymentTime: '09m 03s',
    available: '36,159.69 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['UPI', 'Paytm', 'PhonePe', 'Google Pay'],
    side: 'sell',
    badge: 'Pro Merchant',
    timerMinutes: 30,
    reputationScore: 4.8,
  ),
  P2PAdItem(
    seller: 'CryptoLane',
    pair: 'USDT/INR',
    price: '98.10 INR',
    limits: '2,000.00 - 60,000.00 INR',
    completed30d: '522',
    completionRate30d: '99%',
    avgReleaseTime: '15m',
    avgPaymentTime: '06m 58s',
    available: '1,205.10 USDT',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    paymentMethods: ['UPI', 'IMPS', 'Bank Transfer'],
    side: 'sell',
    badge: 'Verified Pro',
    timerMinutes: 15,
    reputationScore: 4.8,
  ),
];

const List<P2POrderItem> kP2PSampleOrders = [
  P2POrderItem(
    id: 'P2P-104293',
    pair: 'USDT/INR',
    side: 'Buy',
    amount: '12,000 INR',
    status: 'AWAITING PAYMENT',
    createdAt: 'Today, 11:42',
    logoUrl: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    counterparty: 'TecnoSeller',
    paymentMethod: 'UPI',
    orderState: P2POrderState.awaitingPayment,
    fiatAmount: 12000,
    usdtAmount: 122.07,
    pricePerUsdt: 98.31,
    feeUsdt: 0,
    escrowLocked: true,
  ),
  P2POrderItem(
    id: 'P2P-104102',
    pair: 'BTC/INR',
    side: 'Sell',
    amount: '25,000 INR',
    status: 'Released',
    createdAt: 'Today, 09:25',
    logoUrl: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    counterparty: 'CryptoDesk',
    paymentMethod: 'Bank Transfer',
    orderState: P2POrderState.completed,
    fiatAmount: 25000,
    usdtAmount: 253.55,
    pricePerUsdt: 98.6,
    escrowLocked: true,
    escrowReleased: true,
  ),
  P2POrderItem(
    id: 'P2P-103995',
    pair: 'ETH/INR',
    side: 'Buy',
    amount: '18,500 INR',
    status: 'PAYMENT SENT',
    createdAt: 'Yesterday, 23:14',
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    counterparty: 'SamimMolla',
    paymentMethod: 'IMPS',
    orderState: P2POrderState.paymentSent,
    fiatAmount: 18500,
    usdtAmount: 188.25,
    pricePerUsdt: 98.27,
    escrowLocked: true,
  ),
];

final List<AssetTransactionRecord> kAssetTxHistory = [
  AssetTransactionRecord(
    id: 'DEP-20260219-195911',
    type: 'deposit',
    coin: 'USDT',
    amount: 193.3292,
    time: DateTime(2026, 2, 19, 19, 59, 11),
    status: 'Completed',
    network: 'TRC20',
  ),
  AssetTransactionRecord(
    id: 'DEP-20260219-122102',
    type: 'deposit',
    coin: 'USDT',
    amount: 201.57,
    time: DateTime(2026, 2, 19, 12, 21, 2),
    status: 'Completed',
    network: 'BEP20',
  ),
  AssetTransactionRecord(
    id: 'DEP-20260215-105031',
    type: 'deposit',
    coin: 'USDT',
    amount: 160,
    time: DateTime(2026, 2, 15, 10, 50, 31),
    status: 'Completed',
    network: 'ERC20',
  ),
  AssetTransactionRecord(
    id: 'WDR-20260211-223050',
    type: 'withdraw',
    coin: 'USDT',
    amount: 89.5,
    time: DateTime(2026, 2, 11, 22, 30, 50),
    status: 'Completed',
    network: 'TRC20',
  ),
  AssetTransactionRecord(
    id: 'TRF-20260201-184812',
    type: 'transfer',
    coin: 'USDT',
    amount: 149.85,
    time: DateTime(2026, 2, 1, 18, 48, 12),
    status: 'Completed',
    network: 'Funding -> Spot',
  ),
  AssetTransactionRecord(
    id: 'DEP-20260121-120341',
    type: 'deposit',
    coin: 'USDT',
    amount: 99.85,
    time: DateTime(2026, 1, 21, 12, 3, 41),
    status: 'Completed',
    network: 'OPBNB',
  ),
];

class P2PApiEndpoints {
  static const String offers = '/p2p/offers';
  static const String createOrder = '/p2p/order/create';
  static const String payOrder = '/p2p/order/pay';
  static const String releaseOrder = '/p2p/order/release';
  static const String cancelOrder = '/p2p/order/cancel';
  static const String disputeOrder = '/p2p/appeal';
  static const String disputes = '/p2p/disputes';
  static const String chat = '/p2p/chat';
}

class P2PAdminLog {
  const P2PAdminLog({
    required this.time,
    required this.action,
    required this.target,
    required this.meta,
  });

  final DateTime time;
  final String action;
  final String target;
  final String meta;
}

class P2PAppealTicket {
  const P2PAppealTicket({
    required this.orderId,
    required this.buyer,
    required this.seller,
    required this.amount,
    required this.paymentProofPath,
    required this.appealReason,
    required this.chatSummary,
    required this.createdAt,
    this.status = 'UNDER REVIEW',
  });

  final String orderId;
  final String buyer;
  final String seller;
  final String amount;
  final String paymentProofPath;
  final String appealReason;
  final String chatSummary;
  final DateTime createdAt;
  final String status;
}

class P2PEscrowEngine {
  P2PEscrowEngine({
    Map<String, double>? sellerBalances,
    Map<String, double>? buyerBalances,
  }) : _sellerBalances = sellerBalances ?? <String, double>{},
       _buyerBalances = buyerBalances ?? <String, double>{};

  final Map<String, double> _sellerBalances;
  final Map<String, double> _buyerBalances;
  final Map<String, double> _escrowBalances = <String, double>{};

  double sellerBalance(String seller) => _sellerBalances[seller] ?? 0;
  double buyerBalance(String buyer) => _buyerBalances[buyer] ?? 0;
  double escrowBalance(String orderId) => _escrowBalances[orderId] ?? 0;

  bool lockSeller(String seller, String orderId, double usdtAmount) {
    final current = _sellerBalances[seller] ?? 20000;
    if (current < usdtAmount) return false;
    _sellerBalances[seller] = current - usdtAmount;
    _escrowBalances[orderId] = usdtAmount;
    return true;
  }

  bool releaseToBuyer(String buyer, String orderId) {
    final locked = _escrowBalances[orderId] ?? 0;
    if (locked <= 0) return false;
    _escrowBalances.remove(orderId);
    _buyerBalances[buyer] = (_buyerBalances[buyer] ?? 0) + locked;
    return true;
  }

  bool refundToSeller(String seller, String orderId) {
    final locked = _escrowBalances[orderId] ?? 0;
    if (locked <= 0) return false;
    _escrowBalances.remove(orderId);
    _sellerBalances[seller] = (_sellerBalances[seller] ?? 0) + locked;
    return true;
  }
}

class P2PFraudEngine {
  const P2PFraudEngine();

  bool isHighRisk({
    required double fiatAmount,
    required P2PAdItem ad,
    required String paymentMethod,
  }) {
    final highAmount = fiatAmount > 250000;
    final lowRate = _parseNumericValue(ad.completionRate30d) < 92;
    final riskyPayment = paymentMethod.toLowerCase().contains('cash');
    return highAmount || lowRate || riskyPayment;
  }
}

class P2PApiService {
  P2PApiService({P2PEscrowEngine? escrowEngine, P2PFraudEngine? fraudEngine})
    : _escrowEngine = escrowEngine ?? P2PEscrowEngine(),
      _fraudEngine = fraudEngine ?? const P2PFraudEngine();

  final P2PEscrowEngine _escrowEngine;
  final P2PFraudEngine _fraudEngine;

  Future<List<P2PAdItem>> getOffers(List<P2PAdItem> source) async {
    await Future<void>.delayed(const Duration(milliseconds: 220));
    return source;
  }

  Future<P2POrderItem> createOrder({
    required P2PAdItem ad,
    required String buyerId,
    required String side,
    required double fiatAmount,
    required String fiatCurrency,
    required String paymentMethod,
    required String orderId,
    required DateTime now,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 320));
    final usdtAmount = fiatAmount / (ad.priceValue <= 0 ? 1 : ad.priceValue);
    var canLock = _escrowEngine.lockSeller(ad.seller, orderId, usdtAmount);
    if (!canLock) {
      // Demo fallback so buyer/seller flow doesn't block due missing seed balances.
      canLock = _escrowEngine.lockSeller(
        ad.seller,
        orderId,
        usdtAmount.clamp(0, 25),
      );
    }
    if (!canLock) {
      throw Exception('Unable to lock merchant escrow');
    }
    final bool risk = _fraudEngine.isHighRisk(
      fiatAmount: fiatAmount,
      ad: ad,
      paymentMethod: paymentMethod,
    );
    return P2POrderItem(
      id: orderId,
      pair: ad.pair,
      side: side,
      amount:
          '${fiatAmount.toStringAsFixed(2)} $fiatCurrency • ${usdtAmount.toStringAsFixed(4)} ${ad.pair.split('/').first}',
      status: p2pOrderStateLabel(P2POrderState.created),
      createdAt:
          '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}',
      logoUrl: ad.logoUrl,
      counterparty: ad.seller,
      paymentMethod: paymentMethod,
      orderState: P2POrderState.created,
      fiatAmount: fiatAmount,
      usdtAmount: usdtAmount,
      pricePerUsdt: ad.priceValue,
      feeUsdt: 0,
      createdAtMs: now.millisecondsSinceEpoch,
      expiresAtMs: now.add(const Duration(minutes: 10)).millisecondsSinceEpoch,
      escrowLocked: true,
      buyerWallet: buyerId,
      sellerWallet: ad.seller,
      fraudFlag: risk,
    );
  }

  Future<P2POrderItem> markPaid({
    required P2POrderItem order,
    String? paymentProofPath,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return order.copyWith(
      orderState: P2POrderState.paymentSent,
      status: p2pOrderStateLabel(P2POrderState.paymentSent),
      paymentProofPath: paymentProofPath,
    );
  }

  Future<P2POrderItem> markSellerConfirming(P2POrderItem order) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    return order.copyWith(
      orderState: P2POrderState.sellerConfirming,
      status: p2pOrderStateLabel(P2POrderState.sellerConfirming),
    );
  }

  Future<P2POrderItem> releaseOrder({
    required P2POrderItem order,
    required String buyerId,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 240));
    final ok = _escrowEngine.releaseToBuyer(buyerId, order.id);
    // In demo mode, still complete if escrow row is missing.
    return order.copyWith(
      orderState: P2POrderState.completed,
      status: p2pOrderStateLabel(P2POrderState.completed),
      escrowReleased: ok || order.escrowLocked,
    );
  }

  Future<P2POrderItem> cancelOrder({
    required P2POrderItem order,
    required String reason,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 240));
    const cancellableStates = <P2POrderState>{
      P2POrderState.created,
      P2POrderState.awaitingPayment,
    };
    if (!cancellableStates.contains(order.orderState)) {
      throw Exception('Order cannot be cancelled after payment is marked sent');
    }
    _escrowEngine.refundToSeller(order.counterparty, order.id);
    return order.copyWith(
      orderState: P2POrderState.cancelled,
      status: p2pOrderStateLabel(P2POrderState.cancelled),
      cancelReason: reason,
      escrowLocked: false,
    );
  }

  Future<P2POrderItem> raiseDispute({
    required P2POrderItem order,
    required String reason,
    required String paymentProofPath,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 260));
    return order.copyWith(
      orderState: P2POrderState.appealOpened,
      status: p2pOrderStateLabel(P2POrderState.appealOpened),
      disputeReason: reason,
      appealStatus: p2pOrderStateLabel(P2POrderState.underReview),
      appealProofPath: paymentProofPath,
      appealOpenedAtMs: DateTime.now().millisecondsSinceEpoch,
      paymentProofPath: paymentProofPath,
    );
  }

  Future<List<Map<String, String>>> getChat({
    required String orderId,
    required String seller,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 150));
    final now = DateTime.now();
    final hh = now.hour.toString().padLeft(2, '0');
    final mm = now.minute.toString().padLeft(2, '0');
    return <Map<String, String>>[
      {
        'type': 'system',
        'text': 'Welcome to secure P2P chat. Order $orderId',
        'time': '$hh:$mm',
      },
      {
        'type': 'text',
        'text': 'Hello, I am $seller. Pay and share proof here.',
        'time': '$hh:$mm',
      },
    ];
  }
}

const List<String> kMarketNotices = [
  'Notice: P2P order release time improved for verified users.',
  'System: BTC/USDT futures maintenance window completed successfully.',
  'Security: Enable 2FA for safer withdrawals and P2P trading.',
  'Update: New merchant ads are now live in P2P marketplace.',
];

const Map<String, Map<String, String>> kDepositAddressBook = {
  'USDT': {
    'TRC20': 'TVA3u7mqe8f4v2qd5YdKG8g8A2pZV8u9fH',
    'ERC20': '0x54E7dB9Cd57F4D55a0B08E20B2Ef11A7f2a5A91E',
    'BEP20': '0x3C5bF3D4f9A62a4f66eA85d2D0d8E0F8B21d9f3A',
    'APTOS': '0x0f9e4f6e49f6c0f7d3f1af9f8e8e87d4b230b0f6d7f0e2a3f7c1d9a0e1b4c8d2',
    'OPBNB': '0x2Ee0f2E9bA3B5eD2e6A19A8f2B12D8FdA6A0f2b9',
  },
  'BTC': {
    'BTC': 'bc1q8c7rwdwhnh6w9mkrjeyr3h7qpk4m4x5l7j0v3g',
    'BEP20': '0x70eC6C6f80fD8fA9eaB6E3F4f5A70758F3f31Ee2',
  },
  'ETH': {
    'ERC20': '0x14dA1E8c9147d9f6C87d0E0173Ec98AE06aD6E7c',
    'BEP20': '0x87eE07E3A35E3a2E82f2A95A43bA699c6d01b20D',
    'Arbitrum': '0xA9f0f5A1EeA5a4aD1A1BE47bdf8fC48b39F4A2f8',
  },
  'BNB': {
    'BEP20': '0xB4E5f0C2f78dc103D8f8b3FAb6D8Ae9F152A0d62',
    'BNB Beacon': 'bnb1j7t2jlczz4x5t5x9y9p3y3zhy67am6rv4kg38w',
  },
  'SOL': {'SOL': '8N2K7T6QxYQHGqZzV4DgqP14jT7MGN6WSJfYfj8y9E8X'},
  'XRP': {
    'XRP': 'rD2f4h9UoL3cP6sV8nA1kQ5mE7xJ0tY2w',
    'BEP20': '0xA11fD7A1Ead511C0fB3F72FEC8D2ea5A67E2f5E0',
  },
  'DOGE': {
    'DOGE': 'DH2w3Uo8LwY9r7mQvA4tS1kzJ5nB6xE2hP',
    'BEP20': '0x2F84bA6f79E98D7dF1D8c3A9f8A0B4F2f87A12C0',
  },
};

class ChainNetworkMeta {
  const ChainNetworkMeta({
    required this.code,
    required this.display,
    required this.feeUsdt,
    required this.minDepositUsdt,
    required this.minWithdrawUsdt,
    required this.arrival,
  });

  final String code;
  final String display;
  final double feeUsdt;
  final double minDepositUsdt;
  final double minWithdrawUsdt;
  final String arrival;
}

const Map<String, ChainNetworkMeta> kNetworkMeta = {
  'TRC20': ChainNetworkMeta(
    code: 'TRC20',
    display: 'Tron (TRC20)',
    feeUsdt: 1.0,
    minDepositUsdt: 1,
    minWithdrawUsdt: 10,
    arrival: '≈ 1 min',
  ),
  'BEP20': ChainNetworkMeta(
    code: 'BEP20',
    display: 'BNB Smart Chain (BEP20)',
    feeUsdt: 0.01,
    minDepositUsdt: 1,
    minWithdrawUsdt: 10,
    arrival: '≈ 1 min',
  ),
  'ERC20': ChainNetworkMeta(
    code: 'ERC20',
    display: 'Ethereum (ERC20)',
    feeUsdt: 0.5,
    minDepositUsdt: 5,
    minWithdrawUsdt: 15,
    arrival: '≈ 5-15 mins',
  ),
  'APTOS': ChainNetworkMeta(
    code: 'APTOS',
    display: 'Aptos',
    feeUsdt: 0.02,
    minDepositUsdt: 1,
    minWithdrawUsdt: 10,
    arrival: '≈ 1 min',
  ),
  'OPBNB': ChainNetworkMeta(
    code: 'OPBNB',
    display: 'opBNB',
    feeUsdt: 0.015,
    minDepositUsdt: 1,
    minWithdrawUsdt: 10,
    arrival: '≈ 1 min',
  ),
  'BTC': ChainNetworkMeta(
    code: 'BTC',
    display: 'Bitcoin',
    feeUsdt: 5.0,
    minDepositUsdt: 0.0001,
    minWithdrawUsdt: 0.0005,
    arrival: '≈ 10-30 mins',
  ),
  'SOL': ChainNetworkMeta(
    code: 'SOL',
    display: 'Solana',
    feeUsdt: 0.01,
    minDepositUsdt: 0.1,
    minWithdrawUsdt: 1,
    arrival: '≈ 1 min',
  ),
  'XRP': ChainNetworkMeta(
    code: 'XRP',
    display: 'Ripple',
    feeUsdt: 0.1,
    minDepositUsdt: 1,
    minWithdrawUsdt: 5,
    arrival: '≈ 1-2 mins',
  ),
};

class SupportHelpArticle {
  const SupportHelpArticle({
    required this.id,
    required this.title,
    required this.category,
    required this.body,
  });

  final String id;
  final String title;
  final String category;
  final String body;
}

class SupportQuickCategory {
  const SupportQuickCategory(this.title, this.questions);

  final String title;
  final List<String> questions;
}

const List<SupportQuickCategory> kSupportQuickCategories = [
  SupportQuickCategory('Account & Security', [
    'Why is my crypto asset frozen?',
    'Verification code not received',
    'Account is susceptible to high risk',
  ]),
  SupportQuickCategory('Deposit & Withdrawal', [
    'Crypto deposit not credited',
    'How to submit a withdrawal',
    'Network fee and minimum amount details',
  ]),
  SupportQuickCategory('P2P', [
    'P2P order issue',
    'How to open dispute',
    'Merchant not releasing crypto',
  ]),
  SupportQuickCategory('Identity Verification', [
    'How to complete KYC',
    'Identity verification failed',
    'Name is incorrect after verification',
  ]),
  SupportQuickCategory('Promotion & Bonus', [
    "I didn't receive my rewards",
    'Reward distribution information',
    'Voucher and coupon not applied',
  ]),
];

const List<SupportHelpArticle> kSupportHelpArticles = [
  SupportHelpArticle(
    id: 'verification-email',
    title: 'Verification code not received - Email',
    category: 'Account & Security',
    body:
        'If you have not received your verification code by email:\n'
        '1. Check your spam/junk folder.\n'
        '2. Whitelist official support senders.\n'
        '3. Restart app/device and request again.\n'
        '4. Switch network and retry after timer reset.\n'
        '5. If still failing, use Chat with Support and share your UID + timestamp.',
  ),
  SupportHelpArticle(
    id: 'verification-sms',
    title: 'Verification code not received - SMS',
    category: 'Account & Security',
    body:
        'If SMS OTP is delayed:\n'
        '1. Ensure good signal.\n'
        '2. Disable SMS/call blockers.\n'
        '3. Verify your number is active for OTP messages.\n'
        '4. Retry after 120 seconds.\n'
        '5. Contact support if issue persists.',
  ),
  SupportHelpArticle(
    id: 'deposit-not-credited',
    title: "I haven't receive my crypto deposit",
    category: 'Deposit & Withdrawal',
    body:
        'Deposits are credited only when:\n'
        '1. Correct coin and network are used.\n'
        '2. Minimum deposit amount is met.\n'
        '3. Required blockchain confirmations are complete.\n'
        '4. Deposit network is active.\n'
        'You can verify network and minimum values on the deposit page.',
  ),
  SupportHelpArticle(
    id: 'withdraw-howto',
    title: 'How to submit a withdrawal?',
    category: 'Deposit & Withdrawal',
    body:
        'To submit a withdrawal:\n'
        '1. Go to Assets > Withdraw.\n'
        '2. Select coin and network.\n'
        '3. Enter destination address and amount.\n'
        '4. Complete security verification (Email, SMS, Google Auth, Fund password).\n'
        '5. Confirm withdrawal.',
  ),
  SupportHelpArticle(
    id: 'reward-info',
    title: "I didn't receive my rewards",
    category: 'Promotion & Bonus',
    body:
        'Rewards are typically distributed within 7 working days after an event ends.\n'
        'Check event T&C and rewards page for schedule.\n'
        'If missing after timeline, contact support with event screenshot and UID.',
  ),
  SupportHelpArticle(
    id: 'kyc-guide',
    title: 'Identity verification',
    category: 'Identity Verification',
    body:
        'Level 1 requires basic profile details.\n'
        'Level 2 requires government ID front/back and selfie with document.\n'
        'Ensure clear image quality and matching personal details.',
  ),
  SupportHelpArticle(
    id: 'p2p-issue',
    title: 'P2P order issue',
    category: 'P2P',
    body:
        'For P2P issues:\n'
        '1. Open the P2P order details.\n'
        '2. Use in-order chat to contact merchant.\n'
        '3. Click Open Appeal if payment is made but crypto is not released.\n'
        '4. Upload payment proof and wait for admin decision.',
  ),
];

class AssetTransactionRecord {
  const AssetTransactionRecord({
    required this.id,
    required this.type,
    required this.coin,
    required this.amount,
    required this.time,
    required this.status,
    required this.network,
  });

  final String id;
  final String type;
  final String coin;
  final double amount;
  final DateTime time;
  final String status;
  final String network;
}

class ExchangeShell extends StatefulWidget {
  const ExchangeShell({super.key});

  @override
  State<ExchangeShell> createState() => _ExchangeShellState();
}

class _ExchangeShellState extends State<ExchangeShell> {
  int _index = 0;

  Future<void> _openUserCenter() async {
    await Navigator.of(
      context,
    ).push(MaterialPageRoute<void>(builder: (_) => const UserCenterPage()));
    if (mounted) {
      setState(() {});
    }
  }

  void _goToTab(int index) => setState(() => _index = index);

  Future<void> _openTradePair(MarketPair pair) async {
    selectedTradePairNotifier.value = pair;
    await Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => TradingViewChartPage(pair: pair)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomePage(
        onOpenProfile: _openUserCenter,
        onNavigateTab: _goToTab,
        onOpenTradePair: _openTradePair,
      ),
      MarketsPage(
        onOpenProfile: _openUserCenter,
        onOpenTradePair: _openTradePair,
      ),
      FuturesPage(
        onOpenProfile: _openUserCenter,
        onOpenTradePair: _openTradePair,
      ),
      TradePage(onOpenProfile: _openUserCenter),
      AssetsPage(
        onOpenProfile: _openUserCenter,
        onNavigateTab: _goToTab,
        onOpenTradePair: _openTradePair,
      ),
    ];

    return Scaffold(
      body: SafeArea(
        child: IndexedStack(index: _index, children: pages),
      ),
      bottomNavigationBar: Container(
        margin: const EdgeInsets.fromLTRB(14, 0, 14, 12),
        decoration: BoxDecoration(
          color: const Color(0xCC060A15),
          borderRadius: BorderRadius.circular(26),
          border: Border.all(color: const Color(0xFF1D2A46)),
        ),
        child: NavigationBar(
          height: 70,
          backgroundColor: Colors.transparent,
          indicatorColor: const Color(0xFF9DFB3B),
          selectedIndex: _index,
          onDestinationSelected: _goToTab,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined),
              label: 'Home',
            ),
            NavigationDestination(
              icon: Icon(Icons.show_chart),
              label: 'Markets',
            ),
            NavigationDestination(
              icon: Icon(Icons.description_outlined),
              label: 'Futures',
            ),
            NavigationDestination(
              icon: Icon(Icons.candlestick_chart),
              label: 'Trade',
            ),
            NavigationDestination(
              icon: Icon(Icons.account_balance_wallet_outlined),
              label: 'Assets',
            ),
          ],
        ),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({
    super.key,
    required this.onOpenProfile,
    required this.onNavigateTab,
    required this.onOpenTradePair,
  });

  final VoidCallback onOpenProfile;
  final ValueChanged<int> onNavigateTab;
  final ValueChanged<MarketPair> onOpenTradePair;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        _TopHeader(onOpenProfile: onOpenProfile),
        const SizedBox(height: 10),
        _HomeDepositBanner(
          onDeposit: () => Navigator.of(
            context,
          ).push(MaterialPageRoute<void>(builder: (_) => const DepositPage())),
          onOpenAssets: () => onNavigateTab(4),
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _QuickActionButton(
                label: 'Poker',
                icon: Icons.casino_outlined,
                onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Poker module opening soon')),
                ),
              ),
              _QuickActionButton(
                label: 'Auto Earn',
                icon: Icons.savings_outlined,
                onTap: () => onNavigateTab(2),
              ),
              _QuickActionButton(
                label: 'P2P',
                icon: Icons.people_alt_outlined,
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(builder: (_) => const P2PPage()),
                ),
              ),
              _QuickActionButton(
                label: 'LALIGA',
                icon: Icons.emoji_events_outlined,
                onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Campaign page opening soon')),
                ),
              ),
              _QuickActionButton(
                label: 'Rewards',
                icon: Icons.card_giftcard_outlined,
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const RewardsContestOverviewPage(),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        _HomeQuickAccessMenu(onNavigateTab: onNavigateTab),
        const SizedBox(height: 12),
        const _HomeP2PTemplateScroller(),
        const SizedBox(height: 10),
        const _AnnouncementTicker(items: kMarketNotices),
        const SizedBox(height: 10),
        _HomePopularPairsSection(onOpenTradePair: onOpenTradePair),
      ],
    );
  }
}

class RewardsContestOverviewPage extends StatelessWidget {
  const RewardsContestOverviewPage({super.key});

  static const _contests = <Map<String, String>>[
    {
      'title': 'BTC Sprint League',
      'reward': '\$120,000 prize pool',
      'status': 'ONGOING',
      'endsIn': 'Ends in 2d 14h',
      'volume': 'Min volume: 2,000 USDT',
    },
    {
      'title': 'USDT Deposit Race',
      'reward': 'Up to 18% bonus',
      'status': 'ONGOING',
      'endsIn': 'Ends in 5d 03h',
      'volume': 'Min deposit: 100 USDT',
    },
    {
      'title': 'P2P Power Week',
      'reward': 'Zero fee + cashback',
      'status': 'ONGOING',
      'endsIn': 'Ends in 1d 09h',
      'volume': '5 completed P2P orders',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final bg = isLight ? const Color(0xFFF3F6FC) : const Color(0xFF05070B);
    final cardBg = isLight ? Colors.white : const Color(0xFF0F131C);
    final border = isLight ? const Color(0xFFD6DEEC) : const Color(0xFF232A39);
    final primary = isLight ? const Color(0xFF131722) : Colors.white;
    final secondary = isLight ? const Color(0xFF677084) : Colors.white70;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        title: Text(
          'Rewards Hub',
          style: TextStyle(
            color: primary,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        iconTheme: IconThemeData(color: primary),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(14, 8, 14, 16),
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Ongoing Contests',
                  style: TextStyle(
                    color: primary,
                    fontSize: 19,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Join active campaigns and track rewards in real time.',
                  style: TextStyle(
                    color: secondary,
                    fontSize: 13.2,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          ..._contests.map((contest) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          contest['title']!,
                          style: TextStyle(
                            color: primary,
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2ABF74).withValues(alpha: .16),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Text(
                          'ONGOING',
                          style: TextStyle(
                            color: Color(0xFF2ABF74),
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    contest['reward']!,
                    style: TextStyle(
                      color: primary,
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    contest['endsIn']!,
                    style: const TextStyle(
                      color: Color(0xFFF0C244),
                      fontSize: 13.2,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    contest['volume']!,
                    style: TextStyle(
                      color: secondary,
                      fontSize: 12.8,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('${contest['title']} joined')),
                        );
                      },
                      style: FilledButton.styleFrom(
                        backgroundColor: isLight
                            ? const Color(0xFF151925)
                            : Colors.white,
                        foregroundColor: isLight
                            ? Colors.white
                            : const Color(0xFF11151E),
                        minimumSize: const Size.fromHeight(42),
                      ),
                      child: const Text(
                        'Join Contest',
                        style: TextStyle(
                          fontSize: 14.5,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _HomeDepositBanner extends StatelessWidget {
  const _HomeDepositBanner({
    required this.onDeposit,
    required this.onOpenAssets,
  });

  final VoidCallback onDeposit;
  final VoidCallback onOpenAssets;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<double>(
      valueListenable: fundingUsdtBalanceNotifier,
      builder: (context, funding, _) {
        return ValueListenableBuilder<double>(
          valueListenable: spotUsdtBalanceNotifier,
          builder: (context, spot, child) {
            final total = funding + spot;
            final hasBalance = total > 0.0001;
            final isLight = Theme.of(context).brightness == Brightness.light;
            final cardBg = isLight
                ? const Color(0xFFE3E7EF)
                : const Color(0xFF161A23);
            final border = isLight
                ? const Color(0xFFD2DAE8)
                : const Color(0xFF222A3B);
            final primary = isLight ? const Color(0xFF121722) : Colors.white;
            final secondary = isLight
                ? const Color(0xFF5E6779)
                : Colors.white70;
            final buttonBg = isLight ? const Color(0xFF11141C) : Colors.white;
            final buttonFg = isLight ? Colors.white : Colors.black;

            return Container(
              padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    hasBalance
                        ? 'Total Balance ${_formatWithCommas(total, decimals: 2)} USDT'
                        : 'Deposit now to enjoy the\nultimate experience',
                    style: TextStyle(
                      fontSize: 21,
                      fontWeight: FontWeight.w700,
                      color: primary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    hasBalance
                        ? 'Funding ${_formatWithCommas(funding, decimals: 2)} • Spot ${_formatWithCommas(spot, decimals: 2)}'
                        : 'All popular trading pairs supported! Enjoy exclusive benefits.',
                    style: TextStyle(fontSize: 13.2, color: secondary),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: onDeposit,
                          style: FilledButton.styleFrom(
                            backgroundColor: buttonBg,
                            foregroundColor: buttonFg,
                            minimumSize: const Size.fromHeight(44),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                          child: Text(
                            hasBalance ? 'Deposit More' : 'Deposit',
                            style: const TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                      if (hasBalance) ...[
                        const SizedBox(width: 8),
                        SizedBox(
                          height: 44,
                          child: OutlinedButton(
                            onPressed: onOpenAssets,
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(
                                color: isLight
                                    ? const Color(0xFFB9C3D9)
                                    : const Color(0xFF3A465E),
                              ),
                              foregroundColor: primary,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(24),
                              ),
                            ),
                            child: Text(
                              'Assets',
                              style: TextStyle(fontSize: 13.4, color: primary),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}

class _TopHeader extends StatelessWidget {
  const _TopHeader({required this.onOpenProfile});

  final VoidCallback onOpenProfile;

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final searchBg = isLight
        ? const Color(0xFFE9EDF5)
        : const Color(0xFF171B29);
    final iconColor = isLight ? const Color(0xFF161A23) : Colors.white;
    final hintColor = isLight ? const Color(0xFF8A919F) : Colors.white54;

    return Row(
      children: [
        IconButton(
          onPressed: onOpenProfile,
          icon: Icon(Icons.apps_rounded, size: 22, color: iconColor),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Container(
            height: 42,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              color: searchBg,
              borderRadius: BorderRadius.circular(22),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.search,
                  size: 18,
                  color: isLight ? const Color(0xFF232734) : Colors.white70,
                ),
                const SizedBox(width: 8),
                Text(
                  'LIZARDSOL/USDT',
                  style: TextStyle(color: hintColor, fontSize: 13),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 8),
        IconButton(
          onPressed: () => Navigator.of(
            context,
          ).push(MaterialPageRoute<void>(builder: (_) => const ScanPage())),
          icon: Icon(Icons.qr_code_scanner_rounded, size: 22, color: iconColor),
        ),
        IconButton(
          onPressed: () => Navigator.of(context).push(
            MaterialPageRoute<void>(builder: (_) => const SupportBotPage()),
          ),
          icon: Icon(Icons.headset_mic_outlined, size: 22, color: iconColor),
        ),
        ValueListenableBuilder<List<SupportAlert>>(
          valueListenable: supportAlertsNotifier,
          builder: (context, alerts, child) {
            final openAlerts = alerts.where((alert) => !alert.resolved).length;
            return IconButton(
              onPressed: () => Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const SupportAlertsPage(),
                ),
              ),
              icon: Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(Icons.notifications_none, size: 22, color: iconColor),
                  if (openAlerts > 0)
                    Positioned(
                      right: -1,
                      top: -1,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Color(0xFFFF4E63),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  const _QuickActionButton({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final cardBg = isLight ? const Color(0xFFE6EBF4) : const Color(0xFF1A202D);
    final border = isLight ? const Color(0xFFD0D8E9) : const Color(0xFF2C3344);
    final iconColor = isLight
        ? const Color(0xFF10151E)
        : const Color(0xFFD5DEEF);
    final labelColor = isLight ? const Color(0xFF2E3647) : Colors.white70;

    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Container(
        width: 78,
        margin: const EdgeInsets.only(right: 10),
        child: Column(
          children: [
            Container(
              width: 58,
              height: 52,
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: border),
              ),
              child: Icon(icon, size: 21, color: iconColor),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: labelColor,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HomeQuickAccessMenu extends StatelessWidget {
  const _HomeQuickAccessMenu({required this.onNavigateTab});

  final ValueChanged<int> onNavigateTab;

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final bg = isLight ? Colors.white : const Color(0xFF0D131D);
    final border = isLight ? const Color(0xFFD6DDEA) : const Color(0xFF1E293C);
    final iconBg = isLight ? const Color(0xFFEDEFF4) : const Color(0xFF1A2231);
    final iconColor = isLight ? const Color(0xFF131823) : Colors.white;
    final labelColor = isLight ? const Color(0xFF2D3546) : Colors.white70;

    final items = <_QuickAccessItem>[
      _QuickAccessItem(
        title: 'Deposit',
        icon: Icons.arrow_downward_rounded,
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const DepositPage()),
        ),
      ),
      _QuickAccessItem(
        title: 'Withdraw',
        icon: Icons.arrow_upward_rounded,
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const WithdrawPage()),
        ),
      ),
      _QuickAccessItem(
        title: 'P2P',
        icon: Icons.people_alt_outlined,
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const P2PPage()),
        ),
      ),
      _QuickAccessItem(
        title: 'Convert',
        icon: Icons.swap_horiz_rounded,
        onTap: () => ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Convert module opening soon')),
        ),
      ),
      _QuickAccessItem(
        title: 'Buy',
        icon: Icons.add_circle_outline_rounded,
        onTap: () => onNavigateTab(3),
      ),
      _QuickAccessItem(
        title: 'Sell',
        icon: Icons.remove_circle_outline_rounded,
        onTap: () => onNavigateTab(3),
      ),
      _QuickAccessItem(
        title: 'Launchpool',
        icon: Icons.rocket_launch_outlined,
        onTap: () => ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Launchpool opening soon')),
        ),
      ),
      _QuickAccessItem(
        title: 'Coupons',
        icon: Icons.confirmation_num_outlined,
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (_) => const RewardsContestOverviewPage(),
          ),
        ),
      ),
      _QuickAccessItem(
        title: 'Promotion',
        icon: Icons.campaign_outlined,
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (_) => const RewardsContestOverviewPage(),
          ),
        ),
      ),
    ];

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quick access',
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 10),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 5,
              mainAxisExtent: 78,
              crossAxisSpacing: 6,
              mainAxisSpacing: 8,
            ),
            itemCount: items.length,
            itemBuilder: (context, index) {
              final item = items[index];
              return InkWell(
                onTap: item.onTap,
                borderRadius: BorderRadius.circular(12),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: iconBg,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(item.icon, size: 20, color: iconColor),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      item.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 10.8, color: labelColor),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _QuickAccessItem {
  const _QuickAccessItem({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  final String title;
  final IconData icon;
  final VoidCallback onTap;
}

class _HomeP2PTemplateScroller extends StatefulWidget {
  const _HomeP2PTemplateScroller();

  @override
  State<_HomeP2PTemplateScroller> createState() =>
      _HomeP2PTemplateScrollerState();
}

class _HomeP2PTemplateScrollerState extends State<_HomeP2PTemplateScroller> {
  Timer? _autoSlideTimer;
  int _activeIndex = 0;

  final List<Map<String, String>> _pages = <Map<String, String>>[
    {
      'leftTitle': "The Joker's here!",
      'leftSub': 'Weekly event • Lucky draw live',
      'leftCount': '1/6',
      'leftImage': 'promo_joker',
      'rightTopTitle': 'Invite & Earn\n50% Rebate',
      'rightTopSub': 'Invite friends • Instant bonus',
      'rightTopCount': '1/4',
      'rightTopImage': 'promo_invite',
      'rightBottomTitle': 'Vouchers',
      'rightBottomSub': 'Claim trading fee coupons',
      'rightBottomImage': 'promo_voucher',
    },
    {
      'leftTitle': 'Claim your\nwelcome perks',
      'leftSub': 'New user booster • Active now',
      'leftCount': '5/6',
      'leftImage': 'promo_welcome',
      'rightTopTitle': 'Invite & Earn\n50% Rebate',
      'rightTopSub': 'Daily leaderboard rewards',
      'rightTopCount': '1/4',
      'rightTopImage': 'promo_invite',
      'rightBottomTitle': 'Vouchers',
      'rightBottomSub': 'Use coupons in P2P & Spot',
      'rightBottomImage': 'promo_voucher',
    },
    {
      'leftTitle': 'WXT burn event:\n1M WXT',
      'leftSub': 'Burn campaign • Prize pool live',
      'leftCount': '6/6',
      'leftImage': 'promo_burn',
      'rightTopTitle': 'Trade gold-\nbacked PAXG',
      'rightTopSub': 'Ongoing contest • Ends soon',
      'rightTopCount': '2/4',
      'rightTopImage': 'promo_gold',
      'rightBottomTitle': 'Buy Crypto',
      'rightBottomSub': 'Fast fiat purchase',
      'rightBottomImage': 'promo_buy',
    },
    {
      'leftTitle': 'Airdrop Hub',
      'leftSub': 'Claim tasks and earn tokens',
      'leftCount': '3/6',
      'leftImage': 'promo_airdrop',
      'rightTopTitle': 'Trade gold-\nbacked XAUT',
      'rightTopSub': 'Commodity contest live',
      'rightTopCount': '3/4',
      'rightTopImage': 'promo_xaut',
      'rightBottomTitle': 'Buy Crypto',
      'rightBottomSub': 'Card and bank supported',
      'rightBottomImage': 'promo_buy',
    },
    {
      'leftTitle': 'Trade to win',
      'leftSub': 'Compete for rank rewards',
      'leftCount': '4/6',
      'leftImage': 'promo_tradewin',
      'rightTopTitle': 'Trade silver-\nbacked XAG',
      'rightTopSub': 'High APR campaign',
      'rightTopCount': '4/4',
      'rightTopImage': 'promo_silver',
      'rightBottomTitle': 'Vouchers',
      'rightBottomSub': 'Redeem with one tap',
      'rightBottomImage': 'promo_voucher',
    },
    {
      'leftTitle': '\$300,000 up\nfor grabs',
      'leftSub': 'Seasonal championship',
      'leftCount': '2/6',
      'leftImage': 'promo_grabs',
      'rightTopTitle': 'Trade gold-\nbacked PAXG',
      'rightTopSub': 'Volume challenge active',
      'rightTopCount': '2/4',
      'rightTopImage': 'promo_gold',
      'rightBottomTitle': 'Vouchers',
      'rightBottomSub': 'New pack available',
      'rightBottomImage': 'promo_voucher',
    },
  ];

  @override
  void initState() {
    super.initState();
    _autoSlideTimer = Timer.periodic(const Duration(seconds: 4), (_) {
      if (!mounted) return;
      setState(() {
        _activeIndex = (_activeIndex + 1) % _pages.length;
      });
    });
  }

  @override
  void dispose() {
    _autoSlideTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final page = _pages[_activeIndex];
    return SizedBox(
      height: 286,
      child: Padding(
        padding: const EdgeInsets.only(right: 10),
        child: Row(
          children: [
            Expanded(
              flex: 55,
              child: _templateCard(
                title: page['leftTitle']!,
                subtitle: page['leftSub']!,
                count: page['leftCount']!,
                imageUrl: page['leftImage']!,
                large: true,
                animationKey: "left-${page['leftTitle']}-${page['leftCount']}",
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              flex: 45,
              child: Column(
                children: [
                  Expanded(
                    child: _templateCard(
                      title: page['rightTopTitle']!,
                      subtitle: page['rightTopSub']!,
                      count: page['rightTopCount']!,
                      imageUrl: page['rightTopImage']!,
                      large: false,
                      animationKey:
                          "rightTop-${page['rightTopTitle']}-${page['rightTopCount']}",
                    ),
                  ),
                  const SizedBox(height: 10),
                  _smallTemplateCard(
                    title: page['rightBottomTitle']!,
                    subtitle: page['rightBottomSub']!,
                    imageUrl: page['rightBottomImage']!,
                    animationKey:
                        "rightBottom-${page['rightBottomTitle']}-${page['rightBottomImage']}",
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _templateCard({
    required String title,
    required String subtitle,
    required String count,
    required String imageUrl,
    required bool large,
    required String animationKey,
  }) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final cardBg = isLight ? const Color(0xFFF6F7FB) : const Color(0xFF050608);
    final cardBorder = isLight
        ? const Color(0xFFD6DAE6)
        : const Color(0xFF262D3E);
    final textPrimary = isLight ? const Color(0xFF0F121A) : Colors.white;
    final textSecondary = isLight ? const Color(0xFF666D7A) : Colors.white60;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: cardBorder),
      ),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 420),
        switchInCurve: Curves.easeOutCubic,
        switchOutCurve: Curves.easeInCubic,
        transitionBuilder: (child, animation) {
          final slide = Tween<Offset>(
            begin: const Offset(0.22, 0),
            end: Offset.zero,
          ).animate(animation);
          return ClipRect(
            child: SlideTransition(
              position: slide,
              child: FadeTransition(opacity: animation, child: child),
            ),
          );
        },
        child: Column(
          key: ValueKey(animationKey),
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: large ? 21 : 18,
                fontWeight: FontWeight.w700,
                height: 1.12,
                color: textPrimary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: large ? 12.4 : 11.6,
                fontWeight: FontWeight.w500,
                color: textSecondary,
                height: 1.18,
              ),
            ),
            const Spacer(),
            Align(
              alignment: Alignment.center,
              child: _promoVisual(
                token: imageUrl,
                size: large ? 120 : 84,
                isLight: isLight,
                textSecondary: textSecondary,
              ),
            ),
            const SizedBox(height: 10),
            Align(
              alignment: Alignment.bottomLeft,
              child: Text(
                count,
                style: TextStyle(fontSize: 18, color: textSecondary),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _smallTemplateCard({
    required String title,
    required String subtitle,
    required String imageUrl,
    required String animationKey,
  }) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final cardBg = isLight ? const Color(0xFFF6F7FB) : const Color(0xFF050608);
    final cardBorder = isLight
        ? const Color(0xFFD6DAE6)
        : const Color(0xFF262D3E);
    final textPrimary = isLight ? const Color(0xFF0F121A) : Colors.white;
    final textSecondary = isLight ? const Color(0xFF666D7A) : Colors.white54;

    return Container(
      height: 106,
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: cardBorder),
      ),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 420),
        switchInCurve: Curves.easeOutCubic,
        switchOutCurve: Curves.easeInCubic,
        transitionBuilder: (child, animation) {
          final slide = Tween<Offset>(
            begin: const Offset(0.22, 0),
            end: Offset.zero,
          ).animate(animation);
          return ClipRect(
            child: SlideTransition(
              position: slide,
              child: FadeTransition(opacity: animation, child: child),
            ),
          );
        },
        child: Row(
          key: ValueKey(animationKey),
          children: [
            _promoVisual(
              token: imageUrl,
              size: 42,
              isLight: isLight,
              textSecondary: textSecondary,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 22 / 1.6,
                      fontWeight: FontWeight.w600,
                      color: textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11.2,
                      fontWeight: FontWeight.w500,
                      color: textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _promoVisual({
    required String token,
    required double size,
    required bool isLight,
    required Color textSecondary,
  }) {
    final colors = _promoPalette(token, isLight);
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(size * 0.24),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: colors,
        ),
        boxShadow: [
          BoxShadow(
            color: (isLight ? Colors.black : colors.first).withValues(
              alpha: .16,
            ),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          Center(
            child: Icon(
              _promoIcon(token),
              size: size * 0.46,
              color: Colors.white,
            ),
          ),
          Positioned(
            right: size * 0.1,
            top: size * 0.1,
            child: Icon(
              Icons.auto_awesome_rounded,
              size: size * 0.17,
              color: textSecondary.withValues(alpha: .75),
            ),
          ),
        ],
      ),
    );
  }

  IconData _promoIcon(String token) {
    switch (token) {
      case 'promo_joker':
        return Icons.theater_comedy_rounded;
      case 'promo_invite':
        return Icons.group_add_rounded;
      case 'promo_voucher':
        return Icons.card_giftcard_rounded;
      case 'promo_welcome':
        return Icons.celebration_rounded;
      case 'promo_burn':
        return Icons.local_fire_department_rounded;
      case 'promo_gold':
      case 'promo_xaut':
        return Icons.workspace_premium_rounded;
      case 'promo_silver':
        return Icons.military_tech_rounded;
      case 'promo_buy':
        return Icons.account_balance_wallet_rounded;
      case 'promo_airdrop':
        return Icons.currency_exchange_rounded;
      case 'promo_tradewin':
        return Icons.emoji_events_rounded;
      case 'promo_grabs':
        return Icons.attach_money_rounded;
      default:
        return Icons.auto_graph_rounded;
    }
  }

  List<Color> _promoPalette(String token, bool isLight) {
    switch (token) {
      case 'promo_joker':
        return [const Color(0xFF5C2EFA), const Color(0xFFAA5EFF)];
      case 'promo_invite':
        return [const Color(0xFF00A86B), const Color(0xFF3FD197)];
      case 'promo_voucher':
        return [const Color(0xFFE1A300), const Color(0xFFF9CC52)];
      case 'promo_welcome':
        return [const Color(0xFF2A7BFF), const Color(0xFF59A3FF)];
      case 'promo_burn':
        return [const Color(0xFFD9534F), const Color(0xFFFF7B54)];
      case 'promo_gold':
      case 'promo_xaut':
        return [const Color(0xFFB58A00), const Color(0xFFF0C244)];
      case 'promo_silver':
        return [const Color(0xFF7C8798), const Color(0xFFA5AFBF)];
      case 'promo_buy':
        return [const Color(0xFF2378FF), const Color(0xFF58A6FF)];
      case 'promo_airdrop':
        return [const Color(0xFF3F51B5), const Color(0xFF7986CB)];
      case 'promo_tradewin':
        return [const Color(0xFF00A86B), const Color(0xFF00CC88)];
      case 'promo_grabs':
        return [const Color(0xFF9D3AE6), const Color(0xFFDA77FF)];
      default:
        if (isLight) {
          return [const Color(0xFF4D5D7A), const Color(0xFF7B8AA8)];
        }
        return [const Color(0xFF1D273C), const Color(0xFF3A4D6C)];
    }
  }
}

class _HomePopularPairsSection extends StatefulWidget {
  const _HomePopularPairsSection({required this.onOpenTradePair});

  final ValueChanged<MarketPair> onOpenTradePair;

  @override
  State<_HomePopularPairsSection> createState() =>
      _HomePopularPairsSectionState();
}

class _HomePopularPairsSectionState extends State<_HomePopularPairsSection> {
  String _tab = 'Popular';
  static const _tabs = ['Popular', 'Gainers', 'New', '24h Vol'];
  final LiveMarketService _marketService = LiveMarketService();
  List<MarketPair> _pairs = List<MarketPair>.from(kMarketPairs);
  bool _loading = true;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _refresh();
    _timer = Timer.periodic(const Duration(seconds: 20), (_) => _refresh());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _refresh() async {
    try {
      final live = await _marketService.fetchPairs();
      if (!mounted || live.isEmpty) return;
      setState(() {
        _pairs = live;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  List<MarketPair> _rowsForCurrentTab() {
    if (_pairs.isEmpty) return List<MarketPair>.from(kMarketPairs);
    final list = List<MarketPair>.from(_pairs);
    switch (_tab) {
      case 'Gainers':
        list.sort(
          (a, b) => _parsePercentValue(
            b.change,
          ).compareTo(_parsePercentValue(a.change)),
        );
        return list.take(6).toList();
      case 'New':
        if (list.length > 35) return list.skip(25).take(6).toList();
        return list.reversed.take(6).toList();
      case '24h Vol':
        list.sort(
          (a, b) => _parseNumericValue(
            b.volume,
          ).compareTo(_parseNumericValue(a.volume)),
        );
        return list.take(6).toList();
      case 'Popular':
      default:
        return list.take(6).toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    final rows = _rowsForCurrentTab();
    final isLight = Theme.of(context).brightness == Brightness.light;
    final sectionBg = isLight ? Colors.white : const Color(0xFF0C111A);
    final sectionBorder = isLight
        ? const Color(0xFFD9E0EE)
        : const Color(0xFF1A2233);
    final primary = isLight ? const Color(0xFF131722) : Colors.white;
    final secondary = isLight ? const Color(0xFF677083) : Colors.white54;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: sectionBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: sectionBorder),
      ),
      child: Column(
        children: [
          Row(
            children: _tabs.map((item) {
              final active = _tab == item;
              return Expanded(
                child: InkWell(
                  onTap: () => setState(() => _tab = item),
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Column(
                      children: [
                        Text(
                          item,
                          style: TextStyle(
                            fontSize: 12.2,
                            color: active ? primary : secondary,
                            fontWeight: active
                                ? FontWeight.w700
                                : FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          width: 46,
                          height: 2,
                          color: active
                              ? const Color(0xFFF1CB3E)
                              : Colors.transparent,
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Expanded(
                child: Text(
                  'Pair',
                  style: TextStyle(color: secondary, fontSize: 10.8),
                ),
              ),
              Text('Price', style: TextStyle(color: secondary, fontSize: 10.8)),
              SizedBox(width: 14),
              Text(
                'Change',
                style: TextStyle(color: secondary, fontSize: 10.8),
              ),
            ],
          ),
          const SizedBox(height: 4),
          if (_loading)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 14),
              child: Center(
                child: CircularProgressIndicator(
                  strokeWidth: 2.1,
                  color: Color(0xFF9DFB3B),
                ),
              ),
            ),
          ...rows.map((pair) {
            final bool isDown = pair.change.startsWith('-');
            final changeText = pair.change.startsWith('+')
                ? pair.change.substring(1)
                : pair.change;
            return InkWell(
              onTap: () => widget.onOpenTradePair(pair),
              child: Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          CoinLogo(
                            url: pair.logoUrl,
                            fallback: pair.symbol,
                            size: 26,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            pair.symbol,
                            style: TextStyle(
                              fontSize: 11.8,
                              fontWeight: FontWeight.w700,
                              color: primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      pair.price,
                      style: TextStyle(
                        fontSize: 11.8,
                        fontWeight: FontWeight.w700,
                        color: primary,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      width: 86,
                      alignment: Alignment.center,
                      padding: const EdgeInsets.symmetric(vertical: 7),
                      decoration: BoxDecoration(
                        color: isDown
                            ? const Color(0xFFEF4E5E)
                            : const Color(0xFF53D983),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        changeText,
                        style: const TextStyle(
                          fontSize: 11.6,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () {},
            child: const Text(
              'View more',
              style: TextStyle(
                fontSize: 12.2,
                decoration: TextDecoration.underline,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HomeMarketWidgets extends StatefulWidget {
  const _HomeMarketWidgets({required this.onOpenTradePair});

  final ValueChanged<MarketPair> onOpenTradePair;

  @override
  State<_HomeMarketWidgets> createState() => _HomeMarketWidgetsState();
}

class _HomeMarketWidgetsState extends State<_HomeMarketWidgets> {
  late List<MarketPair> _favorites;
  late List<MarketPair> _movers;
  final LiveMarketService _marketService = LiveMarketService();
  Timer? _ticker;

  @override
  void initState() {
    super.initState();
    _favorites = List<MarketPair>.from(kMarketPairs.take(3));
    _movers = List<MarketPair>.from(kMarketPairs.reversed.take(6));
    _refresh();
    _ticker = Timer.periodic(const Duration(seconds: 20), (_) => _refresh());
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  Future<void> _refresh() async {
    try {
      final pairs = await _marketService.fetchPairs();
      if (!mounted || pairs.isEmpty) return;
      final movers = List<MarketPair>.from(pairs)
        ..sort(
          (a, b) => _parsePercentValue(
            b.change,
          ).compareTo(_parsePercentValue(a.change)),
        );
      setState(() {
        _favorites = pairs.take(3).toList();
        _movers = movers.take(6).toList();
      });
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: showHomeFavoritesWidget,
      builder: (context, showFav, _) {
        return ValueListenableBuilder<bool>(
          valueListenable: showHomeTopMoversWidget,
          builder: (context, showTop, child) {
            return Column(
              children: [
                if (showFav)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF111318),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFF212731)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Expanded(
                              child: Text(
                                'Favorites',
                                style: TextStyle(
                                  fontSize: 14.5,
                                  color: Colors.white60,
                                ),
                              ),
                            ),
                            Icon(
                              Icons.chevron_right,
                              size: 18,
                              color: Colors.white38,
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Row(
                          children: [
                            Text(
                              'Spot',
                              style: TextStyle(
                                fontSize: 14.2,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            SizedBox(width: 16),
                            Text(
                              'Derivatives',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white60,
                              ),
                            ),
                            SizedBox(width: 16),
                            Text(
                              'TradFi',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white60,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: List.generate(_favorites.length, (index) {
                            final pair = _favorites[index];
                            return Expanded(
                              child: Padding(
                                padding: EdgeInsets.only(
                                  right: index == _favorites.length - 1 ? 0 : 8,
                                ),
                                child: InkWell(
                                  onTap: () => widget.onOpenTradePair(pair),
                                  child: _HomeMiniTicker(
                                    name: pair.symbol.split('/').first,
                                    price: pair.price,
                                    change: pair.change,
                                  ),
                                ),
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  ),
                if (showFav && showTop) const SizedBox(height: 10),
                if (showTop)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF111318),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFF212731)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Expanded(
                              child: Text(
                                'Top movers',
                                style: TextStyle(
                                  fontSize: 14.5,
                                  color: Colors.white60,
                                ),
                              ),
                            ),
                            Icon(
                              Icons.chevron_right,
                              size: 18,
                              color: Colors.white38,
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Row(
                          children: [
                            Text(
                              'Gainers',
                              style: TextStyle(
                                fontSize: 14.2,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            SizedBox(width: 16),
                            Text(
                              'Losers',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white60,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _HomeMoverGrid(
                          pairs: _movers,
                          onOpenTradePair: widget.onOpenTradePair,
                        ),
                      ],
                    ),
                  ),
              ],
            );
          },
        );
      },
    );
  }
}

class _HomeMiniTicker extends StatelessWidget {
  const _HomeMiniTicker({
    required this.name,
    required this.price,
    required this.change,
  });

  final String name;
  final String price;
  final String change;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: const BoxDecoration(
                color: Color(0xFF1E2530),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  name.substring(0, 1),
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 6),
            Text(
              name,
              style: const TextStyle(
                fontSize: 12.4,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        Text(
          price,
          style: const TextStyle(fontSize: 11.6, fontWeight: FontWeight.w700),
        ),
        Text(
          change,
          style: const TextStyle(
            fontSize: 11,
            color: Color(0xFF40D580),
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}

class _HomeMoverGrid extends StatelessWidget {
  const _HomeMoverGrid({required this.pairs, required this.onOpenTradePair});

  final List<MarketPair> pairs;
  final ValueChanged<MarketPair> onOpenTradePair;

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: pairs.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        mainAxisSpacing: 12,
        crossAxisSpacing: 10,
        childAspectRatio: 0.95,
      ),
      itemBuilder: (context, index) {
        final pair = pairs[index];
        final symbol = pair.symbol.split('/').first;
        return InkWell(
          onTap: () => onOpenTradePair(pair),
          child: Column(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: const BoxDecoration(
                  color: Color(0xFF1C232D),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    symbol.substring(0, 1),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                symbol,
                style: const TextStyle(
                  fontSize: 11.8,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                pair.change,
                style: TextStyle(
                  fontSize: 11,
                  color: pair.change.startsWith('-')
                      ? const Color(0xFFEF4E5E)
                      : const Color(0xFF40D580),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _AnnouncementTicker extends StatefulWidget {
  const _AnnouncementTicker({required this.items});

  final List<String> items;

  @override
  State<_AnnouncementTicker> createState() => _AnnouncementTickerState();
}

class _AnnouncementTickerState extends State<_AnnouncementTicker> {
  late final ScrollController _controller;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _controller = ScrollController();
    _timer = Timer.periodic(const Duration(milliseconds: 55), (_) {
      if (!_controller.hasClients) return;
      final max = _controller.position.maxScrollExtent;
      var next = _controller.offset + 1.6;
      if (next >= max) {
        next = 0;
      }
      _controller.jumpTo(next);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final merged = widget.items.join('     •     ');
    return Container(
      height: 30,
      padding: const EdgeInsets.symmetric(horizontal: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF0C1324),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1A2742)),
      ),
      child: Row(
        children: [
          const Icon(Icons.campaign_outlined, size: 14, color: Colors.white70),
          const SizedBox(width: 8),
          Expanded(
            child: ListView(
              controller: _controller,
              scrollDirection: Axis.horizontal,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                Center(
                  child: Text(
                    '$merged     •     $merged',
                    style: const TextStyle(
                      fontSize: 10.1,
                      color: Colors.white70,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class AuthEntryPage extends StatefulWidget {
  const AuthEntryPage({super.key});

  @override
  State<AuthEntryPage> createState() => _AuthEntryPageState();
}

class _AuthEntryPageState extends State<AuthEntryPage> {
  final TextEditingController _identityController = TextEditingController();
  bool _sending = false;

  @override
  void dispose() {
    _identityController.dispose();
    super.dispose();
  }

  bool _isValidIdentity(String value) {
    final emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    final phoneRegex = RegExp(r'^\+?[0-9]{8,15}$');
    return emailRegex.hasMatch(value) || phoneRegex.hasMatch(value);
  }

  Future<void> _startOtpFlow(String identity) async {
    if (_sending) return;
    final normalized = identity.trim();
    if (!_isValidIdentity(normalized)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter valid email or phone number')),
      );
      return;
    }

    final ok = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (_) => _FakeGeetestDialog(identity: normalized),
    );
    if (!mounted || ok != true) return;

    setState(() => _sending = true);
    try {
      final result = await AuthOtpService.requestOtp(normalized);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            result.backendSent
                ? 'OTP sent to ${_maskIdentity(normalized)}'
                : '${result.message} Demo OTP: ${result.demoOtp ?? ''}',
          ),
        ),
      );
      final verified = await Navigator.of(context).push<bool>(
        MaterialPageRoute<bool>(
          builder: (_) => VerificationCodePage(
            maskedIdentity: _maskIdentity(normalized),
            identity: normalized,
            backendOtpSent: result.backendSent,
            helperMessage: result.message,
            demoOtp: result.demoOtp,
          ),
        ),
      );
      if (verified == true && mounted) {
        authIdentityNotifier.value = normalized;
        isUserLoggedInNotifier.value = true;
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Login successful')));
        Navigator.of(context).pop();
      }
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  Future<void> _onNext() async {
    await _startOtpFlow(_identityController.text.trim());
  }

  Future<void> _onSocialTap(String provider) async {
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    String identity;
    if (provider == 'google') {
      identity = 'user${nowMs % 10000}@gmail.com';
    } else if (provider == 'apple') {
      identity = 'appleuser${nowMs % 10000}@icloud.com';
    } else {
      identity = 'qruser${nowMs % 10000}@bitegit.com';
    }
    _identityController.text = identity;
    await _startOtpFlow(identity);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 12),
            child: Icon(Icons.support_agent_outlined, size: 20),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          const SizedBox(height: 10),
          const Text(
            'Welcome back!',
            style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 24),
          const Text(
            'Email/Phone number',
            style: TextStyle(fontSize: 12.8, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _identityController,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            decoration: const InputDecoration(hintText: 'Enter email or phone'),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _sending ? null : _onNext,
              style: FilledButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(28),
                ),
              ),
              child: Text(
                _sending ? 'Sending OTP...' : 'Next',
                style: const TextStyle(
                  fontSize: 14.8,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          const Center(
            child: Text(
              'Sign up',
              style: TextStyle(fontSize: 15.6, fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(height: 70),
          Row(
            children: const [
              Expanded(child: Divider(color: Colors.white24)),
              SizedBox(width: 12),
              Text('Or', style: TextStyle(color: Colors.white70, fontSize: 14)),
              SizedBox(width: 12),
              Expanded(child: Divider(color: Colors.white24)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              InkWell(
                borderRadius: BorderRadius.circular(30),
                onTap: () => _onSocialTap('google'),
                child: const CircleAvatar(
                  radius: 24,
                  backgroundColor: Color(0xFF1D222E),
                  child: Text('G', style: TextStyle(fontSize: 22)),
                ),
              ),
              InkWell(
                borderRadius: BorderRadius.circular(30),
                onTap: () => _onSocialTap('qr'),
                child: const CircleAvatar(
                  radius: 24,
                  backgroundColor: Color(0xFF1D222E),
                  child: Icon(Icons.qr_code_2_rounded, size: 20),
                ),
              ),
              InkWell(
                borderRadius: BorderRadius.circular(30),
                onTap: () => _onSocialTap('apple'),
                child: const CircleAvatar(
                  radius: 24,
                  backgroundColor: Color(0xFF1D222E),
                  child: Icon(Icons.apple, size: 22),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _FakeGeetestDialog extends StatefulWidget {
  const _FakeGeetestDialog({required this.identity});

  final String identity;

  @override
  State<_FakeGeetestDialog> createState() => _FakeGeetestDialogState();
}

class _FakeGeetestDialogState extends State<_FakeGeetestDialog> {
  final Random _random = Random();
  late double _target;
  double _slider = 0;
  bool _verifying = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _resetPuzzle();
  }

  void _resetPuzzle() {
    _target = 60 + _random.nextInt(30).toDouble();
    _slider = 0;
    _error = null;
    _verifying = false;
  }

  Future<void> _verifySlide(double value) async {
    if (_verifying) return;
    setState(() {
      _verifying = true;
      _error = null;
    });
    await Future<void>.delayed(const Duration(milliseconds: 180));
    final diff = (value - _target).abs();
    if (diff <= 4.8) {
      if (!mounted) return;
      setState(() => _slider = _target);
      await Future<void>.delayed(const Duration(milliseconds: 180));
      if (!mounted) return;
      Navigator.of(context).pop(true);
      return;
    }

    setState(() {
      _error = 'Slider not matched. Try again.';
      _slider = 0;
      _verifying = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final slotLeft = 22 + (_target / 100) * 190;
    final pieceLeft = 22 + (_slider / 100) * 190;
    return Dialog(
      backgroundColor: const Color(0xFF0B0E16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFDEE5F4),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Slide to complete puzzle',
                    style: TextStyle(
                      fontSize: 18,
                      color: Color(0xFF333D4C),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Identity: ${_maskIdentity(widget.identity)}',
                    style: const TextStyle(
                      fontSize: 11.8,
                      color: Color(0xFF4A556A),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF202833), Color(0xFF2A3348)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      children: [
                        SizedBox(
                          height: 150,
                          child: Stack(
                            children: [
                              Positioned.fill(
                                child: Container(
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(10),
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xFF141C2A),
                                        Color(0xFF0E1522),
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                  ),
                                ),
                              ),
                              for (int i = 0; i < 7; i++)
                                Positioned(
                                  left: 8 + i * 38,
                                  top: (i.isEven ? 18 : 30),
                                  child: Container(
                                    width: 28,
                                    height: 20 + (i % 3) * 8,
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(
                                        alpha: 0.05,
                                      ),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                  ),
                                ),
                              Positioned(
                                left: slotLeft,
                                top: 56,
                                child: Container(
                                  width: 34,
                                  height: 34,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(8),
                                    color: Colors.white.withValues(alpha: 0.2),
                                    border: Border.all(
                                      color: const Color(0x99FFFFFF),
                                      width: 1.4,
                                    ),
                                  ),
                                ),
                              ),
                              Positioned(
                                left: pieceLeft,
                                top: 56,
                                child: Container(
                                  width: 34,
                                  height: 34,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(8),
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xFFF4D06F),
                                        Color(0xFFE6A82C),
                                      ],
                                    ),
                                    boxShadow: const [
                                      BoxShadow(
                                        color: Color(0x55000000),
                                        blurRadius: 6,
                                        offset: Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: const Icon(
                                    Icons.extension_rounded,
                                    size: 18,
                                    color: Color(0xFF1C2430),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 8),
                        SliderTheme(
                          data: SliderThemeData(
                            trackHeight: 8,
                            thumbShape: const RoundSliderThumbShape(
                              enabledThumbRadius: 10,
                            ),
                            overlayShape: SliderComponentShape.noOverlay,
                            activeTrackColor: const Color(0xFF57C97A),
                            inactiveTrackColor: const Color(0xFF364155),
                            thumbColor: const Color(0xFF9DFB3B),
                          ),
                          child: Slider(
                            value: _slider,
                            min: 0,
                            max: 100,
                            onChanged: _verifying
                                ? null
                                : (v) => setState(() => _slider = v),
                            onChangeEnd: _verifySlide,
                          ),
                        ),
                        if (_error != null) ...[
                          const SizedBox(height: 6),
                          Text(
                            _error!,
                            style: const TextStyle(
                              fontSize: 11.5,
                              color: Color(0xFFFF8C8C),
                            ),
                          ),
                        ],
                        if (_verifying) ...[
                          const SizedBox(height: 4),
                          const Text(
                            'Verifying...',
                            style: TextStyle(
                              fontSize: 11.5,
                              color: Color(0xFF9DFB3B),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: null,
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFFAEC0EA),
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Slide To Verify'),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  icon: const Icon(
                    Icons.cancel_outlined,
                    size: 22,
                    color: Colors.white60,
                  ),
                ),
                IconButton(
                  onPressed: () {
                    setState(() {
                      _resetPuzzle();
                    });
                  },
                  icon: const Icon(
                    Icons.refresh,
                    size: 22,
                    color: Colors.white60,
                  ),
                ),
                const Icon(
                  Icons.chat_outlined,
                  size: 22,
                  color: Colors.white60,
                ),
                const Text(
                  'GEETEST',
                  style: TextStyle(fontSize: 18, color: Colors.white54),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class VerificationCodePage extends StatefulWidget {
  const VerificationCodePage({
    super.key,
    required this.maskedIdentity,
    required this.identity,
    required this.backendOtpSent,
    required this.helperMessage,
    this.demoOtp,
  });

  final String maskedIdentity;
  final String identity;
  final bool backendOtpSent;
  final String helperMessage;
  final String? demoOtp;

  @override
  State<VerificationCodePage> createState() => _VerificationCodePageState();
}

class _VerificationCodePageState extends State<VerificationCodePage> {
  final TextEditingController _codeController = TextEditingController();
  int _seconds = 118;
  Timer? _timer;
  bool _verifying = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      if (_seconds <= 0) return;
      setState(() => _seconds -= 1);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _codeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final chars = _codeController.text.padRight(6).split('');
    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 12),
            child: Icon(Icons.support_agent_outlined, size: 20),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          const SizedBox(height: 8),
          const Text(
            'Enter verification code',
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 14),
          Text(
            'Verification code : ${widget.maskedIdentity}',
            style: const TextStyle(fontSize: 14.5),
          ),
          const SizedBox(height: 6),
          Text(
            widget.backendOtpSent
                ? 'OTP sent via secure gateway'
                : widget.helperMessage,
            style: const TextStyle(fontSize: 11.8, color: Colors.white60),
          ),
          if (!widget.backendOtpSent && widget.demoOtp != null) ...[
            const SizedBox(height: 3),
            Text(
              'Demo OTP: ${widget.demoOtp}',
              style: const TextStyle(
                fontSize: 12.4,
                color: Color(0xFF9DFB3B),
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
          const SizedBox(height: 12),
          Stack(
            children: [
              Row(
                children: List.generate(6, (i) {
                  final v = chars[i].trim();
                  return Expanded(
                    child: Container(
                      margin: EdgeInsets.only(right: i == 5 ? 0 : 8),
                      height: 56,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: const Color(0xFF1A1E27),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        v,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  );
                }),
              ),
              Positioned.fill(
                child: TextField(
                  controller: _codeController,
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                  style: const TextStyle(color: Colors.transparent),
                  decoration: const InputDecoration(
                    counterText: '',
                    border: InputBorder.none,
                  ),
                  onChanged: (_) => setState(() {}),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text(
                'Resend in ${_seconds}s',
                style: const TextStyle(fontSize: 13, color: Colors.white70),
              ),
              const Spacer(),
              OutlinedButton(
                onPressed: () async {
                  final data = await Clipboard.getData(Clipboard.kTextPlain);
                  final t = data?.text ?? '';
                  if (t.isEmpty) return;
                  _codeController.text = t.substring(0, min(6, t.length));
                  setState(() {});
                },
                child: const Text('Paste'),
              ),
              const SizedBox(width: 8),
              OutlinedButton(
                onPressed: _seconds == 0
                    ? () async {
                        final messenger = ScaffoldMessenger.of(context);
                        final result = await AuthOtpService.requestOtp(
                          widget.identity,
                        );
                        if (!mounted) return;
                        setState(() => _seconds = 118);
                        messenger.showSnackBar(
                          SnackBar(
                            content: Text(
                              result.backendSent
                                  ? 'OTP resent'
                                  : 'OTP resent (Demo OTP: ${result.demoOtp ?? ''})',
                            ),
                          ),
                        );
                      }
                    : null,
                child: const Text('Resend'),
              ),
            ],
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _codeController.text.length == 6 && !_verifying
                  ? () async {
                      final navigator = Navigator.of(context);
                      final messenger = ScaffoldMessenger.of(context);
                      setState(() => _verifying = true);
                      try {
                        await Future<void>.delayed(
                          const Duration(milliseconds: 350),
                        );
                        final ok = await AuthOtpService.verifyOtp(
                          identity: widget.identity,
                          otp: _codeController.text,
                        );
                        if (!mounted) return;
                        if (ok) {
                          navigator.pop(true);
                        } else {
                          messenger.showSnackBar(
                            const SnackBar(
                              content: Text('Invalid OTP. Please try again.'),
                            ),
                          );
                        }
                      } finally {
                        if (mounted) setState(() => _verifying = false);
                      }
                    }
                  : null,
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF2C313E),
                minimumSize: const Size.fromHeight(48),
              ),
              child: Text(
                _verifying ? 'Verifying...' : 'Confirm',
                style: const TextStyle(fontSize: 16),
              ),
            ),
          ),
          const SizedBox(height: 12),
          const Center(
            child: Text(
              "Didn't receive the code?",
              style: TextStyle(fontSize: 13.2, color: Colors.white70),
            ),
          ),
          const SizedBox(height: 20),
          const Center(
            child: Text(
              'Verify via other methods',
              style: TextStyle(fontSize: 16.2, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }
}

class TradingViewChartPage extends StatefulWidget {
  const TradingViewChartPage({super.key, required this.pair});

  final MarketPair pair;

  @override
  State<TradingViewChartPage> createState() => _TradingViewChartPageState();
}

class _TradingViewChartPageState extends State<TradingViewChartPage> {
  late final WebViewController _controller;
  bool _loading = true;
  String _interval = '15';
  static const List<String> _intervals = ['1', '5', '15', '60', '240', '1D'];

  String _tvSymbol(String pair) {
    final cleaned = pair.toUpperCase().replaceAll('/', '').replaceAll('-', '');
    return 'BINANCE:$cleaned';
  }

  String _chartUrl() {
    final symbol = Uri.encodeComponent(_tvSymbol(widget.pair.symbol));
    final interval = Uri.encodeComponent(_interval);
    return 'https://s.tradingview.com/widgetembed/'
        '?symbol=$symbol'
        '&interval=$interval'
        '&hidesidetoolbar=1'
        '&symboledit=0'
        '&saveimage=1'
        '&toolbarbg=05070B'
        '&theme=dark'
        '&style=1'
        '&timezone=Asia%2FKolkata'
        '&withdateranges=1'
        '&hidevolume=0'
        '&allow_symbol_change=0';
  }

  void _reloadChart() {
    setState(() => _loading = true);
    _controller.loadRequest(Uri.parse(_chartUrl()));
  }

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF060A15))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) {
            if (!mounted) return;
            setState(() => _loading = true);
          },
          onPageFinished: (_) {
            if (!mounted) return;
            setState(() => _loading = false);
          },
          onWebResourceError: (_) {
            if (!mounted) return;
            setState(() => _loading = false);
          },
        ),
      )
      ..loadRequest(Uri.parse(_chartUrl()));
  }

  @override
  Widget build(BuildContext context) {
    final isDown = widget.pair.change.startsWith('-');
    final changeColor = isDown
        ? const Color(0xFFEF4E5E)
        : const Color(0xFF53D983);
    return Scaffold(
      backgroundColor: const Color(0xFF05070B),
      appBar: AppBar(
        backgroundColor: const Color(0xFF05070B),
        title: Text(
          widget.pair.symbol,
          style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700),
        ),
        actions: [
          IconButton(
            onPressed: _reloadChart,
            icon: const Icon(Icons.refresh, size: 20),
            tooltip: 'Refresh',
          ),
          IconButton(
            onPressed: () => Navigator.of(context).pop(),
            icon: const Icon(Icons.close_fullscreen_rounded, size: 20),
            tooltip: 'Close',
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            margin: const EdgeInsets.fromLTRB(12, 8, 12, 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              gradient: const LinearGradient(
                colors: [Color(0xFF0B1322), Color(0xFF0C182E)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              border: Border.all(color: const Color(0xFF1D2A44)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.pair.price,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        widget.pair.change,
                        style: TextStyle(
                          fontSize: 12,
                          color: changeColor,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF132238),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: const Color(0xFF2A3E61)),
                  ),
                  child: const Text(
                    'TradingView',
                    style: TextStyle(fontSize: 10.6, color: Colors.white70),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 36,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              scrollDirection: Axis.horizontal,
              itemBuilder: (context, index) {
                final item = _intervals[index];
                final active = _interval == item;
                return ChoiceChip(
                  label: Text(item, style: const TextStyle(fontSize: 10.8)),
                  selected: active,
                  onSelected: (_) {
                    if (_interval == item) return;
                    setState(() => _interval = item);
                    _reloadChart();
                  },
                );
              },
              separatorBuilder: (_, unused) => const SizedBox(width: 6),
              itemCount: _intervals.length,
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: Container(
              margin: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              decoration: BoxDecoration(
                color: const Color(0xFF060A15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF1D2A44)),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x55000000),
                    blurRadius: 14,
                    offset: Offset(0, 6),
                  ),
                ],
              ),
              clipBehavior: Clip.antiAlias,
              child: Stack(
                children: [
                  WebViewWidget(controller: _controller),
                  if (_loading)
                    const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2.2,
                        color: Color(0xFF9DFB3B),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class MarketsPage extends StatefulWidget {
  const MarketsPage({
    super.key,
    required this.onOpenProfile,
    required this.onOpenTradePair,
  });

  final VoidCallback onOpenProfile;
  final ValueChanged<MarketPair> onOpenTradePair;

  @override
  State<MarketsPage> createState() => _MarketsPageState();
}

class _MarketsPageState extends State<MarketsPage> {
  final LiveMarketService _marketService = LiveMarketService();
  List<MarketPair> _pairs = List<MarketPair>.from(kMarketPairs);
  bool _loading = true;
  Timer? _timer;
  String _mainTab = 'Spot';
  String _subTab = 'All';

  static const Map<String, List<String>> _subTabMap = {
    'Favorites': ['Futures', 'Spot'],
    'Futures': ['USDT-M', 'Demo'],
    'Spot': ['All', 'Initial listing', '0 fees', 'Meme', 'Pre-market'],
  };

  @override
  void initState() {
    super.initState();
    _refresh();
    _timer = Timer.periodic(const Duration(seconds: 20), (_) => _refresh());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _refresh() async {
    try {
      final fetched = await _marketService.fetchPairs();
      if (!mounted || fetched.isEmpty) return;
      setState(() {
        _pairs = fetched.take(40).toList();
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  void _setMainTab(String value) {
    if (value == _mainTab) return;
    final subtabs = _subTabMap[value] ?? const <String>[];
    setState(() {
      _mainTab = value;
      _subTab = subtabs.isEmpty ? '' : subtabs.first;
    });
  }

  List<MarketPair> _rowsForState() {
    if (_pairs.isEmpty) return List<MarketPair>.from(kMarketPairs);
    final rows = List<MarketPair>.from(_pairs);
    if (_mainTab == 'Futures') {
      rows.sort(
        (a, b) => _parseNumericValue(
          b.volume,
        ).compareTo(_parseNumericValue(a.volume)),
      );
      return rows.take(22).toList();
    }
    rows.sort(
      (a, b) =>
          _parsePercentValue(b.change).compareTo(_parsePercentValue(a.change)),
    );
    if (_subTab == 'Gainers') {
      return rows.take(22).toList();
    }
    if (_subTab == 'New') {
      return rows.reversed.take(22).toList();
    }
    if (_subTab == '24h Vol') {
      rows.sort(
        (a, b) => _parseNumericValue(
          b.volume,
        ).compareTo(_parseNumericValue(a.volume)),
      );
      return rows.take(22).toList();
    }
    return List<MarketPair>.from(_pairs).take(22).toList();
  }

  Widget _buildMainTabs() {
    const tabs = ['Favorites', 'Futures', 'Spot'];
    return Row(
      children: tabs.map((tab) {
        final active = tab == _mainTab;
        return Expanded(
          child: InkWell(
            onTap: () => _setMainTab(tab),
            child: Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Column(
                children: [
                  Text(
                    tab,
                    style: TextStyle(
                      fontSize: 45 / 3.0,
                      fontWeight: active ? FontWeight.w700 : FontWeight.w600,
                      color: active ? Colors.white : Colors.white54,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    height: 2,
                    width: 48,
                    color: active ? Colors.white : Colors.transparent,
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSubTabs() {
    final subtabs = _subTabMap[_mainTab] ?? const <String>[];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: subtabs.map((tab) {
          final active = tab == _subTab;
          return Padding(
            padding: const EdgeInsets.only(right: 18),
            child: InkWell(
              onTap: () => setState(() => _subTab = tab),
              child: Column(
                children: [
                  Text(
                    tab,
                    style: TextStyle(
                      fontSize: 16,
                      color: active ? Colors.white : Colors.white54,
                      fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    width: 42,
                    height: 2,
                    color: active ? Colors.white : Colors.transparent,
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildFavoritesGrid() {
    final rows = _pairs.take(6).toList();
    return Column(
      children: [
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: rows.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 1.65,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
          ),
          itemBuilder: (context, index) {
            final pair = rows[index];
            final isDown = pair.change.startsWith('-');
            return InkWell(
              onTap: () => widget.onOpenTradePair(pair),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF1B1F2A),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF2B3140)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            pair.symbol.replaceAll('/', ''),
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const Icon(Icons.check_box, size: 18),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      pair.price,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      pair.change,
                      style: TextStyle(
                        fontSize: 14,
                        color: isDown
                            ? const Color(0xFFEF4E5E)
                            : const Color(0xFF53D983),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
        const SizedBox(height: 18),
        SizedBox(
          width: double.infinity,
          child: FilledButton(
            onPressed: () {},
            style: FilledButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black,
              minimumSize: const Size.fromHeight(48),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
            ),
            child: const Text(
              'Favorite',
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPairRows() {
    final rows = _rowsForState();
    return Column(
      children: [
        const Row(
          children: [
            Expanded(
              child: Text(
                'Market/Vol',
                style: TextStyle(color: Colors.white54, fontSize: 12.4),
              ),
            ),
            SizedBox(
              width: 132,
              child: Text(
                'Price',
                textAlign: TextAlign.right,
                style: TextStyle(color: Colors.white54, fontSize: 12.4),
              ),
            ),
            SizedBox(
              width: 96,
              child: Text(
                'Change',
                textAlign: TextAlign.right,
                style: TextStyle(color: Colors.white54, fontSize: 12.4),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ...rows.map((pair) {
          final isDown = pair.change.startsWith('-');
          return InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () => widget.onOpenTradePair(pair),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          pair.symbol.replaceAll('/', ''),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Vol ${pair.volume.replaceAll(' USDT', '')}',
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 11.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(
                    width: 132,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          pair.price,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '\$${_formatWithCommas(double.tryParse(pair.price.replaceAll(',', '')) ?? 0, decimals: 2)}',
                          style: const TextStyle(
                            color: Colors.white54,
                            fontSize: 11.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    width: 86,
                    alignment: Alignment.center,
                    padding: const EdgeInsets.symmetric(vertical: 9),
                    decoration: BoxDecoration(
                      color: isDown
                          ? const Color(0xFFEF4E5E)
                          : const Color(0xFF53D983),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Text(
                      pair.change,
                      style: const TextStyle(
                        fontSize: 12.8,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          height: 54,
          decoration: BoxDecoration(
            color: const Color(0xFF171B29),
            borderRadius: BorderRadius.circular(27),
          ),
          child: const Row(
            children: [
              Icon(Icons.search, size: 28, color: Colors.white70),
              SizedBox(width: 10),
              Text(
                'Search',
                style: TextStyle(color: Colors.white54, fontSize: 17),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        _buildMainTabs(),
        const SizedBox(height: 6),
        _buildSubTabs(),
        const SizedBox(height: 14),
        if (_loading)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(
              child: CircularProgressIndicator(
                strokeWidth: 2.2,
                color: Color(0xFF9DFB3B),
              ),
            ),
          ),
        if (!_loading) ...[
          if (_mainTab == 'Favorites')
            _buildFavoritesGrid()
          else
            _buildPairRows(),
        ],
      ],
    );
  }
}

class TradePage extends StatefulWidget {
  const TradePage({super.key, required this.onOpenProfile});

  final VoidCallback onOpenProfile;

  @override
  State<TradePage> createState() => _TradePageState();
}

class _TradePageState extends State<TradePage> {
  int _headerTab = 0;
  int _timeframeIndex = 0;
  int _tradeViewMode = 0;
  final Random _liveRandom = Random();
  final Map<String, double> _livePrice = {};
  Timer? _liveTimer;
  int _liveSeed = 0;

  static const List<String> _headerTabs = ['Chart', 'Overview', 'Data', 'Feed'];
  static const List<String> _timeframes = ['1m', '5m', '15m', '1h', '4h', '1D'];
  static const List<String> _indicatorTabs = [
    'MA',
    'EMA',
    'BOLL',
    'SAR',
    'VOL',
    'MACD',
    'KDJ',
  ];

  @override
  void initState() {
    super.initState();
    _liveTimer = Timer.periodic(const Duration(seconds: 2), (_) {
      if (!mounted) return;
      final pair = selectedTradePairNotifier.value;
      final anchor = _priceFromString(pair.price);
      final current = _livePrice[pair.symbol] ?? anchor;
      final drift = (_liveRandom.nextDouble() - 0.5) * 0.0065;
      final next = (current * (1 + drift)).clamp(anchor * 0.7, anchor * 1.3);
      setState(() {
        _livePrice[pair.symbol] = next.toDouble();
        _liveSeed++;
      });
    });
  }

  @override
  void dispose() {
    _liveTimer?.cancel();
    super.dispose();
  }

  double _priceFromString(String value) {
    return double.tryParse(value.replaceAll(',', '')) ?? 1;
  }

  double _currentPriceForPair(MarketPair pair) {
    return _livePrice[pair.symbol] ?? _priceFromString(pair.price);
  }

  List<_CandleBar> _buildSeries(MarketPair pair) {
    final String seed =
        '${pair.symbol}-${_timeframes[_timeframeIndex]}-$_liveSeed';
    int hash = 7;
    for (final code in seed.codeUnits) {
      hash = ((hash * 31) + code) & 0x7fffffff;
    }
    final random = Random(hash);
    final base = _currentPriceForPair(pair);
    final List<_CandleBar> candles = [];
    double cursor = base * (0.96 + random.nextDouble() * 0.08);
    for (int i = 0; i < 56; i++) {
      final drift = (random.nextDouble() - 0.5) * (base * 0.008);
      final open = cursor;
      final close = (cursor + drift).clamp(base * 0.7, base * 1.3).toDouble();
      final high =
          max(open, close) + random.nextDouble() * (base * 0.004 + 0.02);
      final low =
          min(open, close) - random.nextDouble() * (base * 0.004 + 0.02);
      candles.add(_CandleBar(open: open, high: high, low: low, close: close));
      cursor = close;
    }
    return candles;
  }

  Widget _buildOverviewCard(MarketPair pair) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF0C1324),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1D2A44)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Market Overview',
            style: TextStyle(fontSize: 12.8, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          _overviewRow('Pair', pair.symbol),
          _overviewRow('24H Change', pair.change),
          _overviewRow('Last Price', pair.price),
          _overviewRow('24H Volume', pair.volume),
          _overviewRow('Source', 'Live feed ready'),
        ],
      ),
    );
  }

  Widget _overviewRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 10.5, color: Colors.white60),
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 10.8, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildTradeNoticeRow() {
    return Container(
      margin: const EdgeInsets.only(top: 6),
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF0B1323),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFF1E2B46)),
      ),
      child: const Row(
        children: [
          Icon(Icons.campaign_outlined, size: 14, color: Colors.white70),
          SizedBox(width: 6),
          Expanded(
            child: Text(
              'New user exclusive: complete KYC and unlock higher P2P limits.',
              style: TextStyle(fontSize: 10.4, color: Colors.white70),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _styledInputBox(String label, String value, {bool muted = false}) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
      decoration: BoxDecoration(
        color: const Color(0xFF171D2C),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 10.6,
                color: muted ? Colors.white38 : Colors.white70,
              ),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 10.8,
              color: muted ? Colors.white54 : Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderEntryPanel(double lastPrice) {
    return Container(
      margin: const EdgeInsets.only(top: 10),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFF0C1324),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1D2A44)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 34,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A2F2A),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: const Text(
                    'Buy',
                    style: TextStyle(
                      fontSize: 12.8,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF53D983),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  height: 34,
                  decoration: BoxDecoration(
                    color: const Color(0xFF2A1A20),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: const Text(
                    'Sell',
                    style: TextStyle(
                      fontSize: 12.8,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFF04E71),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          _styledInputBox('Order Type', 'Limit'),
          _styledInputBox('Price (USDC)', lastPrice.toStringAsFixed(1)),
          _styledInputBox('Quantity', '0.0000 BTC', muted: true),
          _styledInputBox('Order Value', '0.00 USDC', muted: true),
          Row(
            children: List.generate(5, (index) {
              return Expanded(
                child: Container(
                  height: 4,
                  margin: EdgeInsets.only(right: index == 4 ? 0 : 6),
                  decoration: BoxDecoration(
                    color: index == 0
                        ? const Color(0xFF9DFB3B)
                        : const Color(0xFF2A344C),
                    borderRadius: BorderRadius.circular(6),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () {},
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF53D983),
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Place Buy Order',
                style: TextStyle(fontSize: 12.4, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderBook(MarketPair pair, List<_CandleBar> candles) {
    final bool isDown = candles.isNotEmpty
        ? candles.last.close < candles.first.open
        : pair.change.startsWith('-');
    final double mid = candles.isNotEmpty
        ? candles.last.close
        : _priceFromString(pair.price);
    final List<double> asks = List<double>.generate(
      6,
      (i) => mid + ((i + 1) * (mid * 0.0008 + 0.01)),
    );
    final List<double> bids = List<double>.generate(
      6,
      (i) => mid - ((i + 1) * (mid * 0.0008 + 0.01)),
    );

    return Container(
      margin: const EdgeInsets.only(top: 10),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFF0C1324),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1D2A44)),
      ),
      child: Column(
        children: [
          Row(
            children: const [
              Expanded(
                child: Text(
                  'Price',
                  style: TextStyle(fontSize: 10.2, color: Colors.white60),
                ),
              ),
              Expanded(
                child: Text(
                  'Qty',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 10.2, color: Colors.white60),
                ),
              ),
              Expanded(
                child: Text(
                  'Total',
                  textAlign: TextAlign.end,
                  style: TextStyle(fontSize: 10.2, color: Colors.white60),
                ),
              ),
            ],
          ),
          const SizedBox(height: 7),
          ...asks.map((price) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      price.toStringAsFixed(4),
                      style: const TextStyle(
                        fontSize: 10.3,
                        color: Color(0xFFF04E71),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      (0.6 + (price % 1.2)).toStringAsFixed(2),
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 10.1),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      (price * 0.61).toStringAsFixed(2),
                      textAlign: TextAlign.end,
                      style: const TextStyle(fontSize: 10.1),
                    ),
                  ),
                ],
              ),
            );
          }),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                mid.toStringAsFixed(4),
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: isDown
                      ? const Color(0xFFF04E71)
                      : const Color(0xFF53D983),
                ),
              ),
            ),
          ),
          ...bids.map((price) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      price.toStringAsFixed(4),
                      style: const TextStyle(
                        fontSize: 10.3,
                        color: Color(0xFF53D983),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      (0.5 + (price % 1.1)).toStringAsFixed(2),
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 10.1),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      (price * 0.59).toStringAsFixed(2),
                      textAlign: TextAlign.end,
                      style: const TextStyle(fontSize: 10.1),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<MarketPair>(
      valueListenable: selectedTradePairNotifier,
      builder: (context, pair, child) {
        final double anchorPrice = _priceFromString(pair.price);
        final List<_CandleBar> candles = _buildSeries(pair);
        final double lastPrice = candles.isNotEmpty
            ? candles.last.close
            : anchorPrice;
        final double liveChangePct =
            ((lastPrice - anchorPrice) / anchorPrice) * 100;
        final bool isDown = liveChangePct < 0;
        final String liveChangeText =
            '${liveChangePct >= 0 ? '+' : ''}${liveChangePct.toStringAsFixed(2)}%';
        return ListView(
          padding: const EdgeInsets.all(14),
          children: [
            Row(
              children: [
                InkWell(
                  onTap: () {},
                  child: const Padding(
                    padding: EdgeInsets.only(right: 18),
                    child: Text(
                      'Spot',
                      style: TextStyle(
                        fontSize: 21,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
                InkWell(
                  onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Copy trade opening soon')),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.only(right: 18),
                    child: Text(
                      'Copy trade 🔥',
                      style: TextStyle(
                        fontSize: 21,
                        color: Colors.white70,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                InkWell(
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(builder: (_) => const P2PPage()),
                  ),
                  child: const Text(
                    'P2P',
                    style: TextStyle(
                      fontSize: 21,
                      color: Colors.white70,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: widget.onOpenProfile,
                  icon: const Icon(Icons.notifications_none, size: 22),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                CoinLogo(url: pair.logoUrl, fallback: pair.symbol, size: 24),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    pair.symbol,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 5,
                  ),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: const Color(0xFF2A9D59)),
                    color: const Color(0x1B2A9D59),
                  ),
                  child: const Text(
                    'MM',
                    style: TextStyle(
                      fontSize: 10.4,
                      color: Color(0xFF53D983),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C2333),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        onPressed: () => setState(() => _tradeViewMode = 0),
                        icon: Icon(
                          Icons.candlestick_chart,
                          size: 18,
                          color: _tradeViewMode == 0
                              ? Colors.white
                              : Colors.white60,
                        ),
                      ),
                      IconButton(
                        onPressed: () => setState(() => _tradeViewMode = 1),
                        icon: Icon(
                          Icons.receipt_long_outlined,
                          size: 18,
                          color: _tradeViewMode == 1
                              ? Colors.white
                              : Colors.white60,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => TradingViewChartPage(pair: pair),
                    ),
                  ),
                  icon: const Icon(Icons.open_in_full_rounded, size: 20),
                  tooltip: 'Open TradingView chart',
                ),
              ],
            ),
            const SizedBox(height: 2),
            Row(
              children: [
                Text(
                  lastPrice.toStringAsFixed(1),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: isDown
                        ? const Color(0xFFF04E71)
                        : const Color(0xFF53D983),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  liveChangeText,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: isDown
                        ? const Color(0xFFF04E71)
                        : const Color(0xFF53D983),
                  ),
                ),
              ],
            ),
            _buildTradeNoticeRow(),
            const SizedBox(height: 8),
            Row(
              children: List.generate(_headerTabs.length, (index) {
                final active = _headerTab == index;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(8),
                    onTap: () => setState(() => _headerTab = index),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: active
                            ? const Color(0xFF1A2640)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: active
                              ? const Color(0xFF2A3B5E)
                              : Colors.transparent,
                        ),
                      ),
                      child: Text(
                        _headerTabs[index],
                        style: TextStyle(
                          fontSize: 11,
                          color: active ? Colors.white : Colors.white60,
                          fontWeight: active
                              ? FontWeight.w700
                              : FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 8),
            if (_headerTab == 0 && _tradeViewMode == 0) ...[
              Container(
                height: 390,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF0A0E16),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFF1B263F)),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        ...List.generate(_timeframes.length, (index) {
                          final bool active = _timeframeIndex == index;
                          return Padding(
                            padding: const EdgeInsets.only(right: 6),
                            child: OutlinedButton(
                              onPressed: () =>
                                  setState(() => _timeframeIndex = index),
                              style: OutlinedButton.styleFrom(
                                minimumSize: const Size(42, 30),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                ),
                                side: BorderSide(
                                  color: active
                                      ? const Color(0xFF9DFB3B)
                                      : const Color(0xFF293955),
                                ),
                                backgroundColor: active
                                    ? const Color(0x1F9DFB3B)
                                    : Colors.transparent,
                              ),
                              child: Text(
                                _timeframes[index],
                                style: TextStyle(
                                  fontSize: 10,
                                  color: active
                                      ? const Color(0xFF9DFB3B)
                                      : Colors.white70,
                                ),
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        ..._indicatorTabs.map((name) {
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: Text(
                              name,
                              style: TextStyle(
                                fontSize: 10.2,
                                color: name == 'VOL'
                                    ? Colors.white
                                    : Colors.white54,
                                fontWeight: name == 'VOL'
                                    ? FontWeight.w700
                                    : FontWeight.w500,
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Expanded(
                      child: CustomPaint(
                        painter: _CandleChartPainter(
                          candles: candles,
                          isDownTrend: isDown,
                        ),
                        child: const SizedBox.expand(),
                      ),
                    ),
                  ],
                ),
              ),
              _buildOrderEntryPanel(lastPrice),
              _buildOrderBook(pair, candles),
            ] else if (_headerTab == 0 && _tradeViewMode == 1) ...[
              _buildOrderEntryPanel(lastPrice),
              _buildOrderBook(pair, candles),
            ] else ...[
              _buildOverviewCard(pair),
            ],
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: FilledButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Buy order created for ${pair.symbol} @ ${lastPrice.toStringAsFixed(2)}',
                          ),
                        ),
                      );
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF53D983),
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 11),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child: const Text(
                      'Buy',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: FilledButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Sell order created for ${pair.symbol} @ ${lastPrice.toStringAsFixed(2)}',
                          ),
                        ),
                      );
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFFEC4B61),
                      padding: const EdgeInsets.symmetric(vertical: 11),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child: const Text(
                      'Sell',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: const [
                Expanded(
                  child: Center(
                    child: Text(
                      'Orders(0)',
                      style: TextStyle(
                        fontSize: 12.2,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Center(
                    child: Text(
                      'Positions(0)',
                      style: TextStyle(fontSize: 12.2, color: Colors.white60),
                    ),
                  ),
                ),
                Expanded(
                  child: Center(
                    child: Text(
                      'Assets',
                      style: TextStyle(fontSize: 12.2, color: Colors.white60),
                    ),
                  ),
                ),
              ],
            ),
          ],
        );
      },
    );
  }
}

class _CandleBar {
  const _CandleBar({
    required this.open,
    required this.high,
    required this.low,
    required this.close,
  });

  final double open;
  final double high;
  final double low;
  final double close;
}

class _CandleChartPainter extends CustomPainter {
  _CandleChartPainter({required this.candles, required this.isDownTrend});

  final List<_CandleBar> candles;
  final bool isDownTrend;

  @override
  void paint(Canvas canvas, Size size) {
    final paintGrid = Paint()
      ..color = const Color(0xFF1B263F)
      ..strokeWidth = 1;
    final paintWick = Paint()..strokeWidth = 1;
    final paintBody = Paint();
    final textPainter = TextPainter(textDirection: TextDirection.ltr);

    for (int i = 1; i <= 4; i++) {
      final y = (size.height / 5) * i;
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paintGrid);
    }
    for (int i = 1; i <= 5; i++) {
      final x = (size.width / 6) * i;
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paintGrid);
    }

    if (candles.isEmpty) return;
    final minPrice = candles.map((e) => e.low).reduce(min);
    final maxPrice = candles.map((e) => e.high).reduce(max);
    final priceSpan = (maxPrice - minPrice).abs() < 0.00001
        ? 1
        : maxPrice - minPrice;

    double yFromPrice(double price) {
      return ((maxPrice - price) / priceSpan) * (size.height - 10) + 5;
    }

    final candleWidth = size.width / candles.length;
    for (int i = 0; i < candles.length; i++) {
      final item = candles[i];
      final x = (i * candleWidth) + (candleWidth / 2);
      final highY = yFromPrice(item.high);
      final lowY = yFromPrice(item.low);
      final openY = yFromPrice(item.open);
      final closeY = yFromPrice(item.close);
      final bullish = item.close >= item.open;
      final color = bullish ? const Color(0xFF53D983) : const Color(0xFFF04E71);
      paintWick.color = color;
      paintBody.color = color;

      canvas.drawLine(Offset(x, highY), Offset(x, lowY), paintWick);
      final bodyTop = min(openY, closeY);
      final bodyBottom = max(openY, closeY);
      final bodyRect = Rect.fromLTRB(
        x - (candleWidth * 0.28),
        bodyTop,
        x + (candleWidth * 0.28),
        max(bodyBottom, bodyTop + 1.5),
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(bodyRect, const Radius.circular(1.2)),
        paintBody,
      );
    }

    final lastPrice = candles.last.close;
    final lastY = yFromPrice(lastPrice);
    final lastPaint = Paint()
      ..color = isDownTrend
          ? const Color(0xFFF04E71).withValues(alpha: 0.75)
          : const Color(0xFF53D983).withValues(alpha: 0.75)
      ..strokeWidth = 1.1;
    canvas.drawLine(Offset(0, lastY), Offset(size.width, lastY), lastPaint);

    textPainter.text = TextSpan(
      text: lastPrice.toStringAsFixed(4),
      style: const TextStyle(fontSize: 10, color: Colors.white70),
    );
    textPainter.layout(maxWidth: size.width);
    textPainter.paint(
      canvas,
      Offset(size.width - textPainter.width - 4, max(0, lastY - 14)),
    );
  }

  @override
  bool shouldRepaint(covariant _CandleChartPainter oldDelegate) {
    return oldDelegate.candles != candles ||
        oldDelegate.isDownTrend != isDownTrend;
  }
}

class FuturesPage extends StatefulWidget {
  const FuturesPage({
    super.key,
    required this.onOpenProfile,
    required this.onOpenTradePair,
  });

  final VoidCallback onOpenProfile;
  final ValueChanged<MarketPair> onOpenTradePair;

  @override
  State<FuturesPage> createState() => _FuturesPageState();
}

class _FuturesPageState extends State<FuturesPage> {
  final LiveMarketService _marketService = LiveMarketService();
  List<MarketPair> _pairs = List<MarketPair>.from(kMarketPairs);
  bool _loading = true;
  Timer? _timer;
  String _mainTab = 'Futures';
  String _subTab = 'USDT-M';

  static const Map<String, List<String>> _subTabMap = {
    'Favorites': ['Futures', 'Spot'],
    'Futures': ['USDT-M', 'Demo'],
    'Spot': ['All', 'Initial listing', '0 fees', 'Meme', 'Pre-market'],
  };

  @override
  void initState() {
    super.initState();
    _refresh();
    _timer = Timer.periodic(const Duration(seconds: 20), (_) => _refresh());
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _refresh() async {
    try {
      final pairs = await _marketService.fetchPairs();
      if (!mounted || pairs.isEmpty) return;
      setState(() {
        _pairs = pairs.take(60).toList();
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  void _setMainTab(String tab) {
    if (tab == _mainTab) return;
    final subtabs = _subTabMap[tab] ?? const <String>[];
    setState(() {
      _mainTab = tab;
      _subTab = subtabs.isEmpty ? '' : subtabs.first;
    });
  }

  List<MarketPair> _rows() {
    if (_pairs.isEmpty) return List<MarketPair>.from(kMarketPairs);
    final rows = List<MarketPair>.from(_pairs);
    rows.sort(
      (a, b) =>
          _parseNumericValue(b.volume).compareTo(_parseNumericValue(a.volume)),
    );
    return rows.take(20).toList();
  }

  @override
  Widget build(BuildContext context) {
    final rows = _rows();
    final subtabs = _subTabMap[_mainTab] ?? const <String>[];
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          height: 54,
          decoration: BoxDecoration(
            color: const Color(0xFF171B29),
            borderRadius: BorderRadius.circular(27),
          ),
          child: const Row(
            children: [
              Icon(Icons.search, size: 28, color: Colors.white70),
              SizedBox(width: 10),
              Text(
                'Search',
                style: TextStyle(color: Colors.white54, fontSize: 17),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: const [
            Expanded(
              child: Text(
                'Favorites',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  color: Colors.white70,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            Expanded(
              child: Text(
                'Futures',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700),
                textAlign: TextAlign.center,
              ),
            ),
            Expanded(
              child: Text(
                'Spot',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w600,
                  color: Colors.white70,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: ['Favorites', 'Futures', 'Spot'].map((tab) {
            final active = tab == _mainTab;
            return Expanded(
              child: InkWell(
                onTap: () => _setMainTab(tab),
                child: Column(
                  children: [
                    Text(
                      tab,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                        color: active ? Colors.white : Colors.white54,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      width: 44,
                      height: 2,
                      color: active ? Colors.white : Colors.transparent,
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 10),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: subtabs.map((tab) {
              final active = tab == _subTab;
              return Padding(
                padding: const EdgeInsets.only(right: 16),
                child: InkWell(
                  onTap: () => setState(() => _subTab = tab),
                  child: Column(
                    children: [
                      Text(
                        tab,
                        style: TextStyle(
                          fontSize: 15.5,
                          fontWeight: active
                              ? FontWeight.w700
                              : FontWeight.w500,
                          color: active ? Colors.white : Colors.white54,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        width: 42,
                        height: 2,
                        color: active ? Colors.white : Colors.transparent,
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 12),
        const Row(
          children: [
            Expanded(
              child: Text(
                'Market/Vol',
                style: TextStyle(color: Colors.white54, fontSize: 12.4),
              ),
            ),
            SizedBox(
              width: 132,
              child: Text(
                'Price',
                textAlign: TextAlign.right,
                style: TextStyle(color: Colors.white54, fontSize: 12.4),
              ),
            ),
            SizedBox(
              width: 96,
              child: Text(
                'Change',
                textAlign: TextAlign.right,
                style: TextStyle(color: Colors.white54, fontSize: 12.4),
              ),
            ),
          ],
        ),
        if (_loading)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(
              child: CircularProgressIndicator(
                strokeWidth: 2.2,
                color: Color(0xFF9DFB3B),
              ),
            ),
          ),
        if (!_loading)
          ...rows.map((pair) {
            final isDown = pair.change.startsWith('-');
            return InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: () => widget.onOpenTradePair(pair),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            pair.symbol.replaceAll('/', ''),
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Vol ${pair.volume.replaceAll(' USDT', '')}',
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 11.8,
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(
                      width: 132,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            pair.price,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '\$${_formatWithCommas(double.tryParse(pair.price.replaceAll(',', '')) ?? 0, decimals: 2)}',
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 11.8,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      width: 86,
                      alignment: Alignment.center,
                      padding: const EdgeInsets.symmetric(vertical: 9),
                      decoration: BoxDecoration(
                        color: isDown
                            ? const Color(0xFFEF4E5E)
                            : const Color(0xFF53D983),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Text(
                        pair.change,
                        style: const TextStyle(
                          fontSize: 12.8,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }
}

class AssetsPage extends StatefulWidget {
  const AssetsPage({
    super.key,
    required this.onOpenProfile,
    required this.onNavigateTab,
    required this.onOpenTradePair,
  });

  final VoidCallback onOpenProfile;
  final ValueChanged<int> onNavigateTab;
  final ValueChanged<MarketPair> onOpenTradePair;

  @override
  State<AssetsPage> createState() => _AssetsPageState();
}

class _AssetsPageState extends State<AssetsPage> {
  int _tabIndex = 0;
  bool _hideSmallAssets = false;
  static const _tabs = ['Overview', 'Spot', 'Funding'];

  List<Map<String, String>> _assetRows(double funding, double spot) {
    final total = funding + spot;
    return <Map<String, String>>[
      {
        'symbol': 'USDT',
        'name': 'Tether',
        'value': _formatWithCommas(total, decimals: 2),
        'usd': _formatWithCommas(total, decimals: 2),
        'logo':
            'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      },
      {
        'symbol': 'SOLVEX',
        'name': 'Solvex',
        'value': '0.00',
        'usd': '0.00',
        'logo':
            'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      },
      {
        'symbol': 'ADA',
        'name': 'Cardano',
        'value': '0.00',
        'usd': '0.00',
        'logo':
            'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      },
      {
        'symbol': 'OM',
        'name': 'Mantra',
        'value': '0.00',
        'usd': '0.00',
        'logo': 'https://assets.coingecko.com/coins/images/12151/small/om.png',
      },
      {
        'symbol': 'PYOR',
        'name': 'Pyor',
        'value': '0.00',
        'usd': '0.00',
        'logo':
            'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      },
    ];
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<double>(
      valueListenable: fundingUsdtBalanceNotifier,
      builder: (context, funding, _) {
        return ValueListenableBuilder<double>(
          valueListenable: spotUsdtBalanceNotifier,
          builder: (context, spot, child) {
            final total = funding + spot;
            final displayBalance = _tabIndex == 1
                ? spot
                : (_tabIndex == 2 ? funding : total);
            final visibleRows = _assetRows(funding, spot).where((row) {
              if (!_hideSmallAssets) return true;
              final value = double.tryParse(row['value'] ?? '0') ?? 0;
              return value >= 1;
            }).toList();
            final bool isLight =
                Theme.of(context).brightness == Brightness.light;
            final Color primaryText = isLight
                ? const Color(0xFF11141B)
                : Colors.white;
            final Color secondaryText = isLight
                ? const Color(0xFF687183)
                : Colors.white70;
            final Color lineColor = isLight
                ? const Color(0xFF1E242F)
                : Colors.white;
            final Color vipCardBg = isLight
                ? Colors.white
                : const Color(0xFF101319);
            final Color vipCardBorder = isLight
                ? const Color(0xFFD8DFEC)
                : const Color(0xFF242B38);
            final Color vipIconBg = isLight
                ? const Color(0xFFE8ECF5)
                : const Color(0xFF2A303D);

            return ListView(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 14),
              children: [
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: List.generate(_tabs.length, (index) {
                      final active = _tabIndex == index;
                      return Padding(
                        padding: const EdgeInsets.only(right: 24),
                        child: InkWell(
                          onTap: () => setState(() => _tabIndex = index),
                          child: Column(
                            children: [
                              Text(
                                _tabs[index],
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: active
                                      ? FontWeight.w700
                                      : FontWeight.w600,
                                  color: active ? primaryText : secondaryText,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Container(
                                width: 68,
                                height: 2,
                                color: active
                                    ? primaryText
                                    : Colors.transparent,
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      'Est. balance',
                      style: TextStyle(fontSize: 18, color: primaryText),
                    ),
                    const SizedBox(width: 8),
                    Icon(
                      Icons.remove_red_eye_outlined,
                      size: 22,
                      color: secondaryText,
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      _formatWithCommas(displayBalance, decimals: 2),
                      style: TextStyle(
                        fontSize: 44,
                        height: 0.95,
                        fontWeight: FontWeight.w700,
                        color: primaryText,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Padding(
                      padding: EdgeInsets.only(bottom: 8),
                      child: Text(
                        'USDT',
                        style: TextStyle(
                          fontSize: 16.5,
                          fontWeight: FontWeight.w600,
                          color: primaryText,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  '≈ \$${_formatWithCommas(displayBalance, decimals: 2)}',
                  style: TextStyle(fontSize: 18, color: secondaryText),
                ),
                const SizedBox(height: 8),
                Text(
                  'Today\'s PnL ≈ \$0.00 (0.00%)',
                  style: TextStyle(fontSize: 15, color: secondaryText),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _assetAction(
                      icon: Icons.download_rounded,
                      label: 'Add Funds',
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const DepositPage(),
                        ),
                      ),
                    ),
                    _assetAction(
                      icon: Icons.upload_rounded,
                      label: 'Send',
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const WithdrawPage(),
                        ),
                      ),
                    ),
                    _assetAction(
                      icon: Icons.swap_horiz_rounded,
                      label: 'Transfer',
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const TransferPage(),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton.icon(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const AssetHistoryPage(),
                      ),
                    ),
                    icon: const Icon(Icons.history_rounded, size: 18),
                    label: const Text(
                      'Transaction History',
                      style: TextStyle(fontSize: 12.4),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: vipCardBg,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: vipCardBorder),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 13,
                        backgroundColor: vipIconBg,
                        child: Icon(
                          Icons.verified_outlined,
                          size: 14,
                          color: secondaryText,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Upgrade to VIP1 to enjoy more perks',
                          style: TextStyle(
                            fontSize: 13.8,
                            fontWeight: FontWeight.w600,
                            color: primaryText,
                          ),
                        ),
                      ),
                      Icon(Icons.chevron_right_rounded, color: secondaryText),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                Text(
                  'Assets',
                  style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w700,
                    color: primaryText,
                  ),
                ),
                const SizedBox(height: 6),
                Container(height: 2, width: 120, color: lineColor),
                const SizedBox(height: 10),
                Row(
                  children: [
                    InkWell(
                      onTap: () =>
                          setState(() => _hideSmallAssets = !_hideSmallAssets),
                      child: Row(
                        children: [
                          Icon(
                            _hideSmallAssets
                                ? Icons.check_box_rounded
                                : Icons.check_box_outline_blank_rounded,
                            size: 24,
                            color: _hideSmallAssets
                                ? const Color(0xFF9DFB3B)
                                : secondaryText,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Hide assets < 1 USDT',
                            style: TextStyle(
                              fontSize: 17,
                              color: secondaryText,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      onPressed: () => widget.onNavigateTab(1),
                      icon: const Icon(Icons.search_rounded, size: 34),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ...visibleRows.map((row) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    child: Row(
                      children: [
                        CoinLogo(
                          url: row['logo']!,
                          fallback: row['symbol']!,
                          size: 48,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            row['symbol']!,
                            style: TextStyle(
                              fontSize: 40 / 1.7,
                              fontWeight: FontWeight.w600,
                              color: primaryText,
                            ),
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              row['value']!,
                              style: TextStyle(
                                fontSize: 40 / 1.7,
                                fontWeight: FontWeight.w600,
                                color: primaryText,
                              ),
                            ),
                            Text(
                              '\$${row['usd']}',
                              style: TextStyle(
                                fontSize: 35 / 2.2,
                                color: secondaryText,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
              ],
            );
          },
        );
      },
    );
  }

  Widget _assetAction({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    final bool isLight = Theme.of(context).brightness == Brightness.light;
    final Color circleBg = isLight
        ? const Color(0xFFE6EBF5)
        : const Color(0xFF272B35);
    final Color iconColor = isLight ? const Color(0xFF10141B) : Colors.white;
    final Color textColor = isLight ? const Color(0xFF5F6677) : Colors.white70;

    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Column(
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: circleBg,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 27, color: iconColor),
            ),
            const SizedBox(height: 7),
            Text(label, style: TextStyle(fontSize: 14.6, color: textColor)),
          ],
        ),
      ),
    );
  }
}

class UserCenterPage extends StatefulWidget {
  const UserCenterPage({super.key});

  @override
  State<UserCenterPage> createState() => _UserCenterPageState();
}

class _UserCenterPageState extends State<UserCenterPage> {
  int _tab = 0;
  bool _alwaysOn = false;
  final ImagePicker _profilePicker = ImagePicker();

  void _showMessage(String text) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
  }

  Future<void> _openKyc() async {
    await Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const KycVerificationPage()),
    );
    if (mounted) {
      setState(() {});
    }
  }

  Future<void> _pickProfileImage(ImageSource source) async {
    final messenger = ScaffoldMessenger.of(context);
    final XFile? picked = await _profilePicker.pickImage(
      source: source,
      imageQuality: 85,
      maxWidth: 1400,
    );
    if (picked == null) return;

    profileImagePathNotifier.value = picked.path;
    _showMessage('Profile photo updated');
    if (mounted) setState(() {});
    messenger.hideCurrentSnackBar();
  }

  Future<void> _chooseAvatarSymbol() async {
    const symbols = ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
    final selected = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: const Color(0xFF0D1424),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            children: symbols.map((symbol) {
              return InkWell(
                onTap: () => Navigator.of(context).pop(symbol),
                child: CircleAvatar(
                  radius: 24,
                  backgroundColor: const Color(0xFF25324A),
                  child: Text(
                    symbol,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        );
      },
    );

    if (selected == null) return;
    avatarSymbolNotifier.value = selected;
    profileImagePathNotifier.value = null;
    if (mounted) setState(() {});
  }

  Future<void> _openProfileEditor() async {
    await showModalBottomSheet<void>(
      context: context,
      backgroundColor: const Color(0xFF0D1424),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Update Profile Picture',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  FilledButton.icon(
                    onPressed: () {
                      Navigator.of(context).pop();
                      _pickProfileImage(ImageSource.camera);
                    },
                    icon: const Icon(Icons.camera_alt_outlined, size: 16),
                    label: const Text('Camera', style: TextStyle(fontSize: 12)),
                  ),
                  FilledButton.icon(
                    onPressed: () {
                      Navigator.of(context).pop();
                      _pickProfileImage(ImageSource.gallery);
                    },
                    icon: const Icon(Icons.photo_library_outlined, size: 16),
                    label: const Text(
                      'Gallery',
                      style: TextStyle(fontSize: 12),
                    ),
                  ),
                  OutlinedButton.icon(
                    onPressed: () {
                      Navigator.of(context).pop();
                      _chooseAvatarSymbol();
                    },
                    icon: const Icon(Icons.face_2_outlined, size: 16),
                    label: const Text('Avatar', style: TextStyle(fontSize: 12)),
                  ),
                  OutlinedButton.icon(
                    onPressed: () {
                      profileImagePathNotifier.value = null;
                      Navigator.of(context).pop();
                      _showMessage('Photo removed');
                    },
                    icon: const Icon(Icons.delete_outline, size: 16),
                    label: const Text('Remove', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _editNickname() async {
    final controller = TextEditingController(text: nicknameNotifier.value);
    final String? value = await showDialog<String>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Set Nickname'),
          content: TextField(
            controller: controller,
            maxLength: 20,
            decoration: const InputDecoration(hintText: 'Enter nickname'),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () =>
                  Navigator.of(context).pop(controller.text.trim()),
              child: const Text('Save'),
            ),
          ],
        );
      },
    );

    if (value == null || value.isEmpty) return;
    nicknameNotifier.value = value;
    avatarSymbolNotifier.value = value.substring(0, 1).toUpperCase();
    if (mounted) setState(() {});
  }

  void _setTheme(ThemeMode mode) {
    appThemeModeNotifier.value = mode;
    setState(() {});
  }

  void _toggleThemeMode() {
    final nextMode = appThemeModeNotifier.value == ThemeMode.dark
        ? ThemeMode.light
        : ThemeMode.dark;
    _setTheme(nextMode);
  }

  @override
  Widget build(BuildContext context) {
    final tabs = ['My info', 'Preference', 'General'];
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
          children: [
            Row(
              children: [
                IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
                ),
                const Expanded(
                  child: Text(
                    'User Center',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                ),
                ValueListenableBuilder<ThemeMode>(
                  valueListenable: appThemeModeNotifier,
                  builder: (context, mode, child) {
                    return IconButton(
                      onPressed: _toggleThemeMode,
                      icon: Icon(
                        mode == ThemeMode.dark
                            ? Icons.light_mode_rounded
                            : Icons.dark_mode_rounded,
                        size: 21,
                        color: const Color(0xFF9DFB3B),
                      ),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                InkWell(
                  onTap: _openProfileEditor,
                  borderRadius: BorderRadius.circular(36),
                  child: const UserAvatar(radius: 32),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ValueListenableBuilder<String>(
                        valueListenable: nicknameNotifier,
                        builder: (context, nickname, child) {
                          return Text(
                            nickname,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'UID: $currentUserUid',
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF0A101A),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF202C42)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text('Security level ', style: TextStyle(fontSize: 15)),
                      Text(
                        'Low',
                        style: TextStyle(
                          fontSize: 15,
                          color: Color(0xFFFF4A61),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Text(
                    'At least 1 authentication method needs to be enabled.',
                    style: TextStyle(color: Colors.white54, fontSize: 12),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: List.generate(tabs.length, (index) {
                final bool active = index == _tab;
                return Expanded(
                  child: InkWell(
                    onTap: () => setState(() => _tab = index),
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Column(
                        children: [
                          Text(
                            tabs[index],
                            style: TextStyle(
                              fontSize: 12.4,
                              color: active ? Colors.white : Colors.white38,
                              fontWeight: active
                                  ? FontWeight.w600
                                  : FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            height: 3,
                            width: 58,
                            decoration: BoxDecoration(
                              color: active ? Colors.white : Colors.transparent,
                              borderRadius: BorderRadius.circular(6),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
            const SizedBox(height: 6),
            if (_tab == 0) ...[
              _CenterOptionTile(
                icon: Icons.account_circle_outlined,
                title: 'Profile Picture',
                value: 'Change',
                onTap: _openProfileEditor,
              ),
              ValueListenableBuilder<String>(
                valueListenable: nicknameNotifier,
                builder: (context, nickname, child) {
                  return _CenterOptionTile(
                    icon: Icons.badge_outlined,
                    title: 'Nickname',
                    value: nickname,
                    onTap: _editNickname,
                  );
                },
              ),
              _CenterOptionTile(
                icon: Icons.perm_identity_outlined,
                title: 'UID',
                value: currentUserUid,
                onTap: () async {
                  await Clipboard.setData(ClipboardData(text: currentUserUid));
                  if (!mounted) return;
                  _showMessage('UID copied');
                },
              ),
              ValueListenableBuilder<bool>(
                valueListenable: kycVerifiedNotifier,
                builder: (context, verified, child) {
                  final bool basic = kycBasicVerifiedNotifier.value;
                  return _CenterOptionTile(
                    icon: Icons.verified_user_outlined,
                    title: 'Identity Verification',
                    value: verified
                        ? 'Lv.2 Verified'
                        : (basic ? 'Lv.1 Verified' : 'Start KYC'),
                    onTap: _openKyc,
                  );
                },
              ),
              _CenterOptionTile(
                icon: Icons.security_outlined,
                title: 'Security',
                value: 'Set up 2FA',
                onTap: () => _showMessage('2FA setup screen will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.workspace_premium_outlined,
                title: 'VIP level',
                value: 'Non-VIP',
                onTap: () => _showMessage('VIP screen will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.percent_outlined,
                title: 'My Fee Rates',
                value: 'View',
                onTap: () => _showMessage('Fee rates screen will open here'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () => Navigator.of(context).pop(),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF2A344C)),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text('Log Out', style: TextStyle(fontSize: 16)),
              ),
            ],
            if (_tab == 1) ...[
              _CenterOptionTile(
                icon: Icons.access_time,
                title: 'Benchmark Time Zone',
                value: 'Last 24 hours',
                onTap: () => _showMessage('Time zone settings will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.account_balance_wallet_outlined,
                title: 'Withdrawal Address',
                value: 'Manage',
                onTap: () =>
                    _showMessage('Withdrawal address settings will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.wallet_outlined,
                title: 'Manage Crypto Withdrawal Limits',
                value: 'View',
                onTap: () => _showMessage('Withdrawal limits will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.route_outlined,
                title: 'Switch routing',
                value: 'Auto Routing',
                onTap: () => _showMessage('Routing settings will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.swap_calls_outlined,
                title: 'Route Deposits To',
                value: 'Funding Account',
                onTap: () => _showMessage('Deposit routing will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.notifications_none,
                title: 'Notification Settings',
                value: 'Manage',
                onTap: () =>
                    _showMessage('Notification settings will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.email_outlined,
                title: 'Email Subscriptions',
                value: 'Manage',
                onTap: () => _showMessage('Email preferences will open here'),
              ),
            ],
            if (_tab == 2) ...[
              _CenterOptionTile(
                icon: Icons.language,
                title: 'Language',
                value: 'English',
                onTap: () => _showMessage('Language selector will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.currency_exchange_outlined,
                title: 'Currency Display',
                value: 'INR',
                onTap: () => _showMessage('Currency selector will open here'),
              ),
              ValueListenableBuilder<ThemeMode>(
                valueListenable: appThemeModeNotifier,
                builder: (context, mode, child) {
                  return _CenterOptionTile(
                    icon: Icons.palette_outlined,
                    title: 'Color Preferences',
                    value: mode == ThemeMode.dark ? 'Dark' : 'Light',
                    onTap: _toggleThemeMode,
                  );
                },
              ),
              Container(
                margin: const EdgeInsets.only(top: 2, bottom: 2),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      color: Colors.white.withValues(alpha: 0.08),
                    ),
                  ),
                ),
                child: SwitchListTile(
                  value: _alwaysOn,
                  onChanged: (value) => setState(() => _alwaysOn = value),
                  title: const Text(
                    'Always on (no screen lock)',
                    style: TextStyle(fontSize: 13.5),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 2),
                ),
              ),
              _CenterOptionTile(
                icon: Icons.help_outline,
                title: 'Help Center',
                value: 'Open',
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const SupportBotPage(),
                  ),
                ),
              ),
              _CenterOptionTile(
                icon: Icons.show_chart,
                title: 'Trade market overview',
                value: 'Open',
                onTap: () => _showMessage('Market overview will open here'),
              ),
              _CenterOptionTile(
                icon: Icons.headset_mic_outlined,
                title: 'Customer Support Bot',
                value: 'Chat',
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const SupportBotPage(),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _CenterOptionTile extends StatelessWidget {
  const _CenterOptionTile({
    required this.icon,
    required this.title,
    required this.value,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final bool isLight = Theme.of(context).brightness == Brightness.light;
    final borderColor = isLight
        ? const Color(0x220E1422)
        : Colors.white.withValues(alpha: 0.08);
    final iconColor = isLight ? const Color(0xFF2B3A57) : Colors.white70;
    final valueColor = isLight ? const Color(0xFF41506B) : Colors.white54;
    final chevronColor = isLight ? const Color(0xFF596A88) : Colors.white38;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: borderColor)),
        ),
        child: Row(
          children: [
            Icon(icon, size: 20, color: iconColor),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 12.8,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Text(value, style: TextStyle(fontSize: 11.8, color: valueColor)),
            const SizedBox(width: 4),
            Icon(Icons.chevron_right, color: chevronColor, size: 20),
          ],
        ),
      ),
    );
  }
}

class KycVerificationPage extends StatefulWidget {
  const KycVerificationPage({super.key});

  @override
  State<KycVerificationPage> createState() => _KycVerificationPageState();
}

class _KycVerificationPageState extends State<KycVerificationPage> {
  final _fullNameController = TextEditingController();
  final _dobController = TextEditingController();
  final _nationalityController = TextEditingController();
  final _aadhaarNumberController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _pincodeController = TextEditingController();

  final ImagePicker _imagePicker = ImagePicker();

  XFile? _aadhaarFront;
  XFile? _aadhaarBack;
  XFile? _selfieWithDoc;
  PlatformFile? _supportingFile;

  int _level = 0;
  bool _isSubmitting = false;
  bool _faceMatchPassed = false;
  String _faceStatus = 'Not started';

  @override
  void dispose() {
    _fullNameController.dispose();
    _dobController.dispose();
    _nationalityController.dispose();
    _aadhaarNumberController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _pincodeController.dispose();
    super.dispose();
  }

  String _fileNameFromPath(String path) {
    final normalized = path.replaceAll('\\', '/');
    return normalized.split('/').last;
  }

  Future<void> _pickImage({
    required String label,
    required ImageSource source,
    required void Function(XFile file) assign,
  }) async {
    final messenger = ScaffoldMessenger.of(context);
    final XFile? picked = await _imagePicker.pickImage(
      source: source,
      imageQuality: 85,
      maxWidth: 1800,
    );
    if (picked == null) return;

    if (!mounted) return;
    setState(() {
      assign(picked);
      _faceMatchPassed = false;
      _faceStatus = 'Pending AI match';
    });
    messenger.showSnackBar(SnackBar(content: Text('$label selected')));
  }

  Future<void> _pickSupportingFile() async {
    final messenger = ScaffoldMessenger.of(context);
    final FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
    );
    if (result == null || result.files.isEmpty) return;

    if (!mounted) return;
    setState(() {
      _supportingFile = result.files.first;
    });
    messenger.showSnackBar(
      const SnackBar(content: Text('Supporting file selected')),
    );
  }

  Future<int> _detectFacesInImage(String imagePath) async {
    final FaceDetector detector = FaceDetector(
      options: FaceDetectorOptions(
        performanceMode: FaceDetectorMode.accurate,
        enableLandmarks: true,
      ),
    );

    try {
      final InputImage image = InputImage.fromFilePath(imagePath);
      final faces = await detector.processImage(image);
      return faces.length;
    } finally {
      detector.close();
    }
  }

  Future<bool> _runAutoFaceMatch() async {
    if (_aadhaarFront == null || _selfieWithDoc == null) {
      return false;
    }

    try {
      final int aadhaarFaces = await _detectFacesInImage(_aadhaarFront!.path);
      final int selfieFaces = await _detectFacesInImage(_selfieWithDoc!.path);
      final bool passed = aadhaarFaces > 0 && selfieFaces > 0;

      if (!mounted) return false;
      setState(() {
        _faceMatchPassed = passed;
        _faceStatus = passed
            ? 'AI verified: face detected in selfie + document'
            : 'Face not clear. Please re-upload images';
      });
      return passed;
    } catch (_) {
      if (!mounted) return false;
      setState(() {
        _faceMatchPassed = false;
        _faceStatus = 'AI verification failed. Try clear photos';
      });
      return false;
    }
  }

  bool get _isBasicReady {
    return _fullNameController.text.trim().isNotEmpty &&
        _dobController.text.trim().isNotEmpty &&
        _nationalityController.text.trim().isNotEmpty;
  }

  bool get _isAdvancedReady {
    return _aadhaarNumberController.text.trim().isNotEmpty &&
        _addressController.text.trim().isNotEmpty &&
        _cityController.text.trim().isNotEmpty &&
        _stateController.text.trim().isNotEmpty &&
        _pincodeController.text.trim().isNotEmpty &&
        _aadhaarFront != null &&
        _aadhaarBack != null &&
        _selfieWithDoc != null;
  }

  void _submitBasicLevel() {
    if (!_isBasicReady) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Complete all basic details first')),
      );
      return;
    }
    kycBasicVerifiedNotifier.value = true;
    setState(() {
      _level = 1;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Level 1 basic verification completed')),
    );
  }

  Future<void> _submitAdvancedLevel() async {
    if (!kycBasicVerifiedNotifier.value) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Complete Level 1 first')));
      return;
    }

    if (!_isAdvancedReady) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Upload Aadhaar front/back and selfie')),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
      _faceStatus = 'Backend AI verification in progress...';
    });

    final bool passed = await _runAutoFaceMatch();

    if (!mounted) return;
    setState(() {
      _isSubmitting = false;
    });

    if (!passed) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Face verification failed. Re-upload clear photos'),
        ),
      );
      return;
    }

    kycAdvancedVerifiedNotifier.value = true;
    kycVerifiedNotifier.value = true;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Level 2 advanced verification submitted')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Identity Verification')),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0F1A2B),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF22304D)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  kycVerifiedNotifier.value
                      ? 'KYC Status: Lv.2 Verified'
                      : (kycBasicVerifiedNotifier.value
                            ? 'KYC Status: Lv.1 Basic done'
                            : 'KYC Status: Pending'),
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Level 1: Name + Basic info. Level 2: Aadhaar front/back + selfie.',
                  style: TextStyle(color: Colors.white70, fontSize: 12.5),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _level = 0),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: _level == 0
                        ? const Color(0xFF18263F)
                        : Colors.transparent,
                  ),
                  child: const Text(
                    'Level 1 Basic',
                    style: TextStyle(fontSize: 12.5),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _level = 1),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: _level == 1
                        ? const Color(0xFF18263F)
                        : Colors.transparent,
                  ),
                  child: const Text(
                    'Level 2 Advanced',
                    style: TextStyle(fontSize: 12.5),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          if (_level == 0) ...[
            TextField(
              controller: _fullNameController,
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'Full Name'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _dobController,
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(
                labelText: 'Date of Birth (DD/MM/YYYY)',
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _nationalityController,
              textInputAction: TextInputAction.done,
              decoration: const InputDecoration(labelText: 'Nationality'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _submitBasicLevel,
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 11),
                  backgroundColor: const Color(0xFF9DFB3B),
                  foregroundColor: Colors.black,
                ),
                child: const Text(
                  'Submit Level 1',
                  style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700),
                ),
              ),
            ),
          ],
          if (_level == 1) ...[
            TextField(
              controller: _aadhaarNumberController,
              textInputAction: TextInputAction.next,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Aadhaar Number'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _addressController,
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'Address'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _cityController,
                    textInputAction: TextInputAction.next,
                    decoration: const InputDecoration(labelText: 'City'),
                    onChanged: (_) => setState(() {}),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _stateController,
                    textInputAction: TextInputAction.next,
                    decoration: const InputDecoration(labelText: 'State'),
                    onChanged: (_) => setState(() {}),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _pincodeController,
              textInputAction: TextInputAction.done,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Pincode'),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 10),
            _KycUploadTile(
              title: 'Aadhaar Front',
              value: _aadhaarFront == null
                  ? 'Not selected'
                  : _fileNameFromPath(_aadhaarFront!.path),
              onGallery: () => _pickImage(
                label: 'Aadhaar front',
                source: ImageSource.gallery,
                assign: (file) => _aadhaarFront = file,
              ),
              onCamera: () => _pickImage(
                label: 'Aadhaar front',
                source: ImageSource.camera,
                assign: (file) => _aadhaarFront = file,
              ),
            ),
            const SizedBox(height: 8),
            _KycUploadTile(
              title: 'Aadhaar Back',
              value: _aadhaarBack == null
                  ? 'Not selected'
                  : _fileNameFromPath(_aadhaarBack!.path),
              onGallery: () => _pickImage(
                label: 'Aadhaar back',
                source: ImageSource.gallery,
                assign: (file) => _aadhaarBack = file,
              ),
              onCamera: () => _pickImage(
                label: 'Aadhaar back',
                source: ImageSource.camera,
                assign: (file) => _aadhaarBack = file,
              ),
            ),
            const SizedBox(height: 8),
            _KycUploadTile(
              title: 'Selfie With Document',
              value: _selfieWithDoc == null
                  ? 'Not selected'
                  : _fileNameFromPath(_selfieWithDoc!.path),
              onGallery: () => _pickImage(
                label: 'Selfie with document',
                source: ImageSource.gallery,
                assign: (file) => _selfieWithDoc = file,
              ),
              onCamera: () => _pickImage(
                label: 'Selfie with document',
                source: ImageSource.camera,
                assign: (file) => _selfieWithDoc = file,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF0D1422),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF1D2A42)),
              ),
              child: Row(
                children: [
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Additional File (optional)',
                          style: TextStyle(
                            fontSize: 12.2,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 3),
                        Text(
                          'PDF/JPG/PNG',
                          style: TextStyle(
                            color: Colors.white54,
                            fontSize: 11.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    _supportingFile?.name ?? 'None',
                    style: const TextStyle(fontSize: 11, color: Colors.white60),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton(
                    onPressed: _pickSupportingFile,
                    child: const Text(
                      'Select',
                      style: TextStyle(fontSize: 11.5),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF101825),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF1F2C44)),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.auto_awesome,
                    size: 16,
                    color: Color(0xFF9DFB3B),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _faceStatus,
                      style: TextStyle(
                        color: _faceMatchPassed
                            ? const Color(0xFF9DFB3B)
                            : Colors.white60,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _isSubmitting ? null : _submitAdvancedLevel,
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 11),
                  backgroundColor: const Color(0xFF9DFB3B),
                  foregroundColor: Colors.black,
                ),
                child: Text(
                  _isSubmitting ? 'Verifying...' : 'Submit Advanced KYC',
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _KycUploadTile extends StatelessWidget {
  const _KycUploadTile({
    required this.title,
    required this.value,
    required this.onGallery,
    required this.onCamera,
  });

  final String title;
  final String value;
  final VoidCallback onGallery;
  final VoidCallback onCamera;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1422),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF1D2A42)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(fontSize: 13.2, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(color: Colors.white54, fontSize: 11.8),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              OutlinedButton.icon(
                onPressed: onGallery,
                icon: const Icon(Icons.photo_library_outlined, size: 16),
                label: const Text('Gallery', style: TextStyle(fontSize: 12)),
              ),
              const SizedBox(width: 8),
              OutlinedButton.icon(
                onPressed: onCamera,
                icon: const Icon(Icons.camera_alt_outlined, size: 16),
                label: const Text('Camera', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class DepositPage extends StatefulWidget {
  const DepositPage({super.key});

  @override
  State<DepositPage> createState() => _DepositPageState();
}

class _DepositPageState extends State<DepositPage> {
  String _coin = 'USDT';
  late String _network;
  final TextEditingController _amountController = TextEditingController();
  bool _showAddress = false;

  List<String> get _availableNetworks =>
      kDepositAddressBook[_coin]!.keys.toList();
  String get _address => kDepositAddressBook[_coin]![_network]!;
  ChainNetworkMeta get _networkMeta =>
      kNetworkMeta[_network] ??
      const ChainNetworkMeta(
        code: 'CUSTOM',
        display: 'Custom Network',
        feeUsdt: 0,
        minDepositUsdt: 0,
        minWithdrawUsdt: 0,
        arrival: 'N/A',
      );

  @override
  void initState() {
    super.initState();
    _network = _availableNetworks.first;
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  void _showDepositAddress() {
    final amount = double.tryParse(_amountController.text.trim());
    if (amount == null || amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a valid amount first')),
      );
      return;
    }
    setState(() => _showAddress = true);
  }

  Future<void> _selectCoin() async {
    final selected = await Navigator.of(context).push<String>(
      MaterialPageRoute<String>(
        builder: (_) => _CoinSelectPage(
          title: 'Select Coin',
          items: kDepositAddressBook.keys.toList(),
          balances: {
            'USDT': fundingUsdtBalanceNotifier.value + spotUsdtBalanceNotifier.value,
            'BTC': 0,
            'ETH': 0,
            'BNB': 0,
            'SOL': 0,
            'XRP': 0,
            'DOGE': 0,
          },
        ),
      ),
    );
    if (selected == null || selected == _coin) return;
    setState(() {
      _coin = selected;
      _network = _availableNetworks.first;
      _showAddress = false;
    });
  }

  Future<void> _selectNetwork() async {
    final selected = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: Theme.of(context).brightness == Brightness.light
          ? Colors.white
          : const Color(0xFF0A111F),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 18),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 42,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Theme.of(context).brightness == Brightness.light
                        ? const Color(0xFFD0D7E6)
                        : const Color(0xFF2A344A),
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                const SizedBox(height: 12),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Select Network',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700),
                  ),
                ),
                const SizedBox(height: 10),
                Flexible(
                  child: ListView.separated(
                    shrinkWrap: true,
                    itemCount: _availableNetworks.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final code = _availableNetworks[index];
                      final meta = kNetworkMeta[code];
                      final display = meta?.display ?? code;
                      final fee = meta?.feeUsdt ?? 0;
                      final min = meta?.minWithdrawUsdt ?? 0;
                      final arrival = meta?.arrival ?? 'N/A';
                      return InkWell(
                        borderRadius: BorderRadius.circular(14),
                        onTap: () => Navigator.of(context).pop(code),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: code == _network
                                  ? const Color(0xFFE4C657)
                                  : Theme.of(context).brightness == Brightness.light
                                  ? const Color(0xFFD4DCEB)
                                  : const Color(0xFF1E2942),
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    code,
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      display,
                                      style: const TextStyle(
                                        fontSize: 13,
                                        color: Colors.grey,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Network fee ${fee.toStringAsFixed(3)} USDT',
                                style: const TextStyle(fontSize: 12.6, color: Colors.grey),
                              ),
                              Text(
                                'Minimum deposit ${min.toStringAsFixed(4).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\\.$'), '')} $_coin',
                                style: const TextStyle(fontSize: 12.6, color: Colors.grey),
                              ),
                              Text(
                                'Estimated arrival $arrival',
                                style: const TextStyle(fontSize: 12.6, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
    if (selected == null) return;
    setState(() {
      _network = selected;
      _showAddress = false;
    });
  }

  void _confirmDeposit() {
    final amount = double.tryParse(_amountController.text.trim());
    if (amount == null || amount <= 0) return;
    fundingUsdtBalanceNotifier.value += amount;
    if (_coin == 'USDT') {
      spotUsdtBalanceNotifier.value += amount * 0.25;
    }
    kAssetTxHistory.insert(
      0,
      AssetTransactionRecord(
        id: 'DEP-${DateTime.now().millisecondsSinceEpoch}',
        type: 'deposit',
        coin: _coin,
        amount: amount,
        time: DateTime.now(),
        status: 'Completed',
        network: _network,
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Deposit confirmed: ${amount.toStringAsFixed(4)} $_coin credited',
        ),
      ),
    );
    Navigator.of(context).pop(amount);
  }

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final primary = isLight ? const Color(0xFF10141B) : Colors.white;
    final secondary = isLight ? const Color(0xFF6C7485) : Colors.white70;
    final card = isLight ? Colors.white : const Color(0xFF0B1323);
    final border = isLight ? const Color(0xFFD6DEEC) : const Color(0xFF1D2D49);
    final deposits = kAssetTxHistory
        .where((item) => item.type == 'deposit')
        .take(8)
        .toList();
    return Scaffold(
      appBar: AppBar(title: const Text('Deposit')),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: _selectCoin,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: card,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: border),
              ),
              child: Row(
                children: [
                  Text(
                    _coin,
                    style: TextStyle(fontSize: 20, color: primary, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    _coin == 'USDT' ? 'TetherUS' : 'Select token',
                    style: TextStyle(fontSize: 13.4, color: secondary),
                  ),
                  const Spacer(),
                  const Icon(Icons.chevron_right_rounded),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: _selectNetwork,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: card,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: border),
              ),
              child: Row(
                children: [
                  Text(
                    _network,
                    style: TextStyle(fontSize: 18, color: primary, fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _networkMeta.display,
                      style: TextStyle(fontSize: 13, color: secondary),
                    ),
                  ),
                  const Icon(Icons.keyboard_arrow_down_rounded),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: card,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _networkInfoRow(
                  'Network fee',
                  '${_networkMeta.feeUsdt.toStringAsFixed(3)} USDT',
                  secondary,
                ),
                _networkInfoRow(
                  'Minimum deposit',
                  '${_networkMeta.minDepositUsdt.toStringAsFixed(4).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\\.$'), '')} $_coin',
                  secondary,
                ),
                _networkInfoRow('Estimated arrival', _networkMeta.arrival, secondary),
              ],
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _amountController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: InputDecoration(
              labelText: 'Amount ($_coin)',
              hintText: 'Enter amount',
              suffixText: _coin,
            ),
            onChanged: (_) {
              if (_showAddress) setState(() => _showAddress = false);
            },
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: _showDepositAddress,
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 10),
                backgroundColor: const Color(0xFFF0A344),
                foregroundColor: Colors.black,
              ),
              child: const Text(
                'Generate Deposit Address',
                style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700),
              ),
            ),
          ),
          if (_showAddress) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF0A1321),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF1D2D49)),
              ),
              child: Column(
                children: [
                  _AddressQrWidget(data: _address),
                  const SizedBox(height: 8),
                  Text(
                    '$_coin • $_network',
                    style: const TextStyle(
                      fontSize: 12.2,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 5),
                  SelectableText(
                    _address,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 11.5,
                      color: Colors.white70,
                    ),
                  ),
                  const SizedBox(height: 8),
                  FilledButton.icon(
                    onPressed: () async {
                      final messenger = ScaffoldMessenger.of(context);
                      await Clipboard.setData(ClipboardData(text: _address));
                      if (!mounted) return;
                      messenger.showSnackBar(
                        const SnackBar(content: Text('Address copied')),
                      );
                    },
                    icon: const Icon(Icons.copy, size: 14),
                    label: const Text(
                      'Copy Address',
                      style: TextStyle(fontSize: 11.8),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _confirmDeposit,
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF53D983),
                        foregroundColor: Colors.black,
                      ),
                      child: const Text(
                        'I Have Deposited',
                        style: TextStyle(
                          fontSize: 11.8,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 10),
          Text(
            'Send only $_coin via $_network. A mismatched network can permanently lose funds.',
            style: TextStyle(color: secondary, fontSize: 11.4),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Text(
                'Recent Deposits',
                style: TextStyle(
                  color: primary,
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const Spacer(),
              TextButton(
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(builder: (_) => const AssetHistoryPage()),
                ),
                child: const Text('View all'),
              ),
            ],
          ),
          ...deposits.map((item) {
            final y = item.time.year.toString().padLeft(4, '0');
            final m = item.time.month.toString().padLeft(2, '0');
            final d = item.time.day.toString().padLeft(2, '0');
            final hh = item.time.hour.toString().padLeft(2, '0');
            final mm = item.time.minute.toString().padLeft(2, '0');
            final ss = item.time.second.toString().padLeft(2, '0');
            return Container(
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: isLight ? const Color(0xFFE0E6F2) : const Color(0xFF1B263B),
                  ),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.coin,
                          style: TextStyle(
                            color: primary,
                            fontSize: 14.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          '$y-$m-$d $hh:$mm:$ss',
                          style: TextStyle(color: secondary, fontSize: 11.8),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '+${item.amount.toStringAsFixed(4).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\\.$'), '')}',
                        style: const TextStyle(
                          color: Color(0xFF56C08C),
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(item.status, style: TextStyle(color: secondary)),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _networkInfoRow(String label, String value, Color secondary) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Expanded(
            child: Text(label, style: TextStyle(fontSize: 12, color: secondary)),
          ),
          Text(value, style: const TextStyle(fontSize: 12.6, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _CoinSelectPage extends StatefulWidget {
  const _CoinSelectPage({
    required this.title,
    required this.items,
    required this.balances,
  });

  final String title;
  final List<String> items;
  final Map<String, double> balances;

  @override
  State<_CoinSelectPage> createState() => _CoinSelectPageState();
}

class _CoinSelectPageState extends State<_CoinSelectPage> {
  final TextEditingController _searchController = TextEditingController();
  String _query = '';
  static const _history = ['USDT', 'SPK', 'XRP'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rows = widget.items
        .where((item) => item.toLowerCase().contains(_query.toLowerCase()))
        .toList();
    final isLight = Theme.of(context).brightness == Brightness.light;
    final secondary = isLight ? const Color(0xFF6A7284) : Colors.white60;

    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          TextField(
            controller: _searchController,
            onChanged: (value) => setState(() => _query = value.trim()),
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'Search Coins',
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Text(
                'Search History',
                style: TextStyle(fontSize: 16.4, fontWeight: FontWeight.w700),
              ),
              const Spacer(),
              Icon(Icons.delete_outline, size: 20, color: secondary),
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _history
                .map((item) => Chip(label: Text(item)))
                .toList(),
          ),
          const SizedBox(height: 12),
          const Text(
            'Coin List',
            style: TextStyle(fontSize: 16.4, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          ...rows.map((coin) {
            final value = widget.balances[coin] ?? 0;
            return ListTile(
              contentPadding: const EdgeInsets.symmetric(vertical: 2, horizontal: 0),
              onTap: () => Navigator.of(context).pop(coin),
              leading: CircleAvatar(
                radius: 15,
                backgroundColor: const Color(0xFF17B7AE),
                child: Text(
                  coin.isNotEmpty ? coin[0] : '?',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                ),
              ),
              title: Text(
                coin,
                style: const TextStyle(fontSize: 16.8, fontWeight: FontWeight.w700),
              ),
              subtitle: Text(
                coin == 'USDT'
                    ? 'TetherUS'
                    : (coin == 'SPK' ? 'Spark' : coin),
                style: TextStyle(fontSize: 12.8, color: secondary),
              ),
              trailing: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    _formatWithCommas(value, decimals: 4),
                    style: const TextStyle(fontSize: 15.2, fontWeight: FontWeight.w700),
                  ),
                  Text(
                    '₹${_formatWithCommas(value * 91.8, decimals: 2)}',
                    style: TextStyle(fontSize: 12, color: secondary),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _AddressQrWidget extends StatelessWidget {
  const _AddressQrWidget({required this.data});

  final String data;

  List<List<bool>> _buildMatrix(String value) {
    const int side = 29;
    final matrix = List.generate(side, (_) => List<bool>.filled(side, false));

    void paintFinder(int top, int left) {
      for (var r = 0; r < 7; r++) {
        for (var c = 0; c < 7; c++) {
          final rr = top + r;
          final cc = left + c;
          final isBorder = r == 0 || r == 6 || c == 0 || c == 6;
          final isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[rr][cc] = isBorder || isCenter;
        }
      }
    }

    bool inFinderZone(int row, int col) {
      final inTopLeft = row < 7 && col < 7;
      final inTopRight = row < 7 && col >= side - 7;
      final inBottomLeft = row >= side - 7 && col < 7;
      return inTopLeft || inTopRight || inBottomLeft;
    }

    paintFinder(0, 0);
    paintFinder(0, side - 7);
    paintFinder(side - 7, 0);

    final bytes = utf8.encode(value);
    var seed = 0;
    for (final b in bytes) {
      seed = (seed * 131 + b) & 0x7fffffff;
    }
    final random = Random(seed);

    for (var r = 0; r < side; r++) {
      for (var c = 0; c <= side ~/ 2; c++) {
        if (inFinderZone(r, c) || inFinderZone(r, side - 1 - c)) {
          continue;
        }
        final bit = random.nextBool();
        matrix[r][c] = bit;
        matrix[r][side - 1 - c] = bit;
      }
    }

    return matrix;
  }

  @override
  Widget build(BuildContext context) {
    final matrix = _buildMatrix(data);
    return Container(
      width: 160,
      height: 160,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: CustomPaint(painter: _QrMatrixPainter(matrix)),
    );
  }
}

class _QrMatrixPainter extends CustomPainter {
  _QrMatrixPainter(this.matrix);

  final List<List<bool>> matrix;

  @override
  void paint(Canvas canvas, Size size) {
    final side = matrix.length;
    final cellW = size.width / side;
    final cellH = size.height / side;
    final paint = Paint()..color = Colors.black;

    for (var r = 0; r < side; r++) {
      for (var c = 0; c < side; c++) {
        if (!matrix[r][c]) continue;
        canvas.drawRect(
          Rect.fromLTWH(c * cellW, r * cellH, cellW, cellH),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant _QrMatrixPainter oldDelegate) {
    return oldDelegate.matrix != matrix;
  }
}

class ScanPage extends StatefulWidget {
  const ScanPage({super.key});

  @override
  State<ScanPage> createState() => _ScanPageState();
}

class _ScanPageState extends State<ScanPage> {
  final MobileScannerController _scannerController = MobileScannerController(
    detectionSpeed: DetectionSpeed.noDuplicates,
    formats: const [BarcodeFormat.qrCode],
    facing: CameraFacing.back,
    torchEnabled: false,
  );
  bool _torchOn = false;
  bool _busy = false;
  String? _lastCode;

  @override
  void dispose() {
    _scannerController.dispose();
    super.dispose();
  }

  Future<void> _handleDetect(BarcodeCapture capture) async {
    if (_busy) return;
    final code = capture.barcodes
        .map((b) => b.rawValue ?? '')
        .firstWhere((v) => v.trim().isNotEmpty, orElse: () => '');
    if (code.isEmpty) return;
    _busy = true;
    _lastCode = code;
    await _scannerController.stop();
    if (!mounted) return;

    final action = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: const Color(0xFF0C1324),
      builder: (_) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Scan Result',
                style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              SelectableText(
                code,
                style: const TextStyle(fontSize: 12.4, color: Colors.white70),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () async {
                        await Clipboard.setData(ClipboardData(text: code));
                        if (!mounted) return;
                        Navigator.of(context).pop('copy');
                      },
                      icon: const Icon(Icons.copy, size: 16),
                      label: const Text('Copy'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilledButton.icon(
                      onPressed: () => Navigator.of(context).pop('use'),
                      icon: const Icon(Icons.check_circle_outline, size: 16),
                      label: const Text('Use'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () => Navigator.of(context).pop('scan'),
                  child: const Text('Scan Again'),
                ),
              ),
            ],
          ),
        ),
      ),
    );

    if (!mounted) return;
    if (action == 'use') {
      Navigator.of(context).pop(code);
      return;
    }
    if (action == 'copy') {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Scanned value copied')));
    }
    _busy = false;
    await _scannerController.start();
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR'),
        actions: [
          IconButton(
            onPressed: () async {
              await _scannerController.toggleTorch();
              if (!mounted) return;
              setState(() => _torchOn = !_torchOn);
            },
            icon: Icon(_torchOn ? Icons.flash_on : Icons.flash_off),
            tooltip: 'Torch',
          ),
        ],
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: _scannerController,
            onDetect: _handleDetect,
          ),
          IgnorePointer(
            child: Center(
              child: Container(
                width: 260,
                height: 260,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFF9DFB3B), width: 2),
                ),
              ),
            ),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 22,
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xCC05070B),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF223149)),
                ),
                child: Text(
                  _lastCode == null
                      ? 'Align QR code inside frame'
                      : 'Last: ${_lastCode!.length > 28 ? '${_lastCode!.substring(0, 28)}...' : _lastCode}',
                  style: const TextStyle(fontSize: 11.4, color: Colors.white70),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class SupportAlertsPage extends StatelessWidget {
  const SupportAlertsPage({super.key});

  String _fmt(DateTime t) {
    final dd = t.day.toString().padLeft(2, '0');
    final mm = t.month.toString().padLeft(2, '0');
    final hh = t.hour.toString().padLeft(2, '0');
    final mi = t.minute.toString().padLeft(2, '0');
    return '$dd/$mm $hh:$mi';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Support Alerts')),
      body: ValueListenableBuilder<List<SupportAlert>>(
        valueListenable: supportAlertsNotifier,
        builder: (context, alerts, child) {
          if (alerts.isEmpty) {
            return const Center(
              child: Text(
                'No alerts yet',
                style: TextStyle(fontSize: 12.4, color: Colors.white70),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: alerts.length,
            itemBuilder: (context, index) {
              final alert = alerts[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFF0D1422),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF1D2A42)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          'Ticket #${alert.id}',
                          style: const TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          alert.resolved ? 'Resolved' : 'Open',
                          style: TextStyle(
                            fontSize: 11.2,
                            color: alert.resolved
                                ? const Color(0xFF8EEA8A)
                                : const Color(0xFFFFB347),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'User ${alert.userUid} • ${_fmt(alert.timestamp)}',
                      style: const TextStyle(
                        fontSize: 10.6,
                        color: Colors.white60,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(alert.message, style: const TextStyle(fontSize: 11.8)),
                    if (!alert.resolved) ...[
                      const SizedBox(height: 8),
                      Align(
                        alignment: Alignment.centerRight,
                        child: OutlinedButton(
                          onPressed: () {
                            final updated = supportAlertsNotifier.value
                                .map(
                                  (item) => item.id == alert.id
                                      ? item.copyWith(resolved: true)
                                      : item,
                                )
                                .toList();
                            supportAlertsNotifier.value = updated;
                          },
                          child: const Text(
                            'Mark Resolved',
                            style: TextStyle(fontSize: 11),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class WithdrawPage extends StatefulWidget {
  const WithdrawPage({super.key});

  @override
  State<WithdrawPage> createState() => _WithdrawPageState();
}

class _WithdrawPageState extends State<WithdrawPage> {
  String _coin = 'USDT';
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _emailCodeController = TextEditingController();
  final TextEditingController _smsCodeController = TextEditingController();
  final TextEditingController _googleCodeController = TextEditingController();
  final TextEditingController _fundPasswordController = TextEditingController();
  String _network = 'TRC20';

  List<String> get _availableNetworks =>
      kDepositAddressBook[_coin]?.keys.toList() ?? const ['TRC20'];
  ChainNetworkMeta get _networkMeta =>
      kNetworkMeta[_network] ??
      const ChainNetworkMeta(
        code: 'CUSTOM',
        display: 'Custom Network',
        feeUsdt: 0,
        minDepositUsdt: 0,
        minWithdrawUsdt: 0,
        arrival: 'N/A',
      );

  @override
  void dispose() {
    _addressController.dispose();
    _amountController.dispose();
    _emailCodeController.dispose();
    _smsCodeController.dispose();
    _googleCodeController.dispose();
    _fundPasswordController.dispose();
    super.dispose();
  }

  Future<void> _selectCoin() async {
    final selected = await Navigator.of(context).push<String>(
      MaterialPageRoute<String>(
        builder: (_) => _CoinSelectPage(
          title: 'Select Coin',
          items: kDepositAddressBook.keys.toList(),
          balances: {
            'USDT': fundingUsdtBalanceNotifier.value,
            'BTC': 0,
            'ETH': 0,
            'BNB': 0,
            'SOL': 0,
            'XRP': 0,
            'DOGE': 0,
          },
        ),
      ),
    );
    if (selected == null || selected == _coin) return;
    setState(() {
      _coin = selected;
      _network = _availableNetworks.first;
    });
  }

  Future<void> _selectNetwork() async {
    final selected = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: Theme.of(context).brightness == Brightness.light
          ? Colors.white
          : const Color(0xFF0A111F),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          top: false,
          child: ListView(
            shrinkWrap: true,
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 14),
            children: [
              const Text(
                'Choose Network',
                style: TextStyle(fontSize: 27, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              ..._availableNetworks.map((code) {
                final meta = kNetworkMeta[code];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(14),
                    onTap: () => Navigator.of(context).pop(code),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: code == _network
                              ? const Color(0xFFE4C657)
                              : Theme.of(context).brightness == Brightness.light
                              ? const Color(0xFFD5DDED)
                              : const Color(0xFF1D2A44),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '$code ${meta?.display ?? ''}',
                            style: const TextStyle(
                              fontSize: 16.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            'Fee ${meta?.feeUsdt.toStringAsFixed(3) ?? '0'} USDT',
                            style: const TextStyle(
                              fontSize: 12.2,
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            'Minimum withdrawal ${meta?.minWithdrawUsdt.toStringAsFixed(4).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\\.$'), '') ?? '0'} $_coin',
                            style: const TextStyle(
                              fontSize: 12.2,
                              color: Colors.grey,
                            ),
                          ),
                          Text(
                            'Arrival time ${meta?.arrival ?? 'N/A'}',
                            style: const TextStyle(
                              fontSize: 12.2,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0x12000000),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Text(
                  'Ensure selected network matches destination wallet support.',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ),
            ],
          ),
        );
      },
    );
    if (selected == null) return;
    setState(() => _network = selected);
  }

  void _submitWithdrawal() {
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;
    final available = fundingUsdtBalanceNotifier.value;
    if (_addressController.text.trim().isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Enter withdrawal address')));
      return;
    }
    if (amount < _networkMeta.minWithdrawUsdt) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Minimum withdrawal is ${_networkMeta.minWithdrawUsdt.toStringAsFixed(2)} $_coin',
          ),
        ),
      );
      return;
    }
    final requiredSecurityFilled = _emailCodeController.text.trim().isNotEmpty &&
        _smsCodeController.text.trim().isNotEmpty &&
        _googleCodeController.text.trim().isNotEmpty &&
        _fundPasswordController.text.trim().isNotEmpty;
    if (!requiredSecurityFilled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Complete Email, SMS, Google Auth and Fund password'),
        ),
      );
      return;
    }
    final finalAmount = amount + _networkMeta.feeUsdt;
    if (finalAmount > available) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Insufficient available balance')),
      );
      return;
    }
    fundingUsdtBalanceNotifier.value = available - finalAmount;
    kAssetTxHistory.insert(
      0,
      AssetTransactionRecord(
        id: 'WDR-${DateTime.now().millisecondsSinceEpoch}',
        type: 'withdraw',
        coin: _coin,
        amount: amount,
        time: DateTime.now(),
        status: 'Completed',
        network: _network,
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Withdrawal request submitted successfully')),
    );
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final primary = isLight ? const Color(0xFF11151F) : Colors.white;
    final secondary = isLight ? const Color(0xFF6B7385) : Colors.white60;
    final available = fundingUsdtBalanceNotifier.value;
    return Scaffold(
      appBar: AppBar(title: Text('Send $_coin')),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          InkWell(
            onTap: _selectCoin,
            borderRadius: BorderRadius.circular(12),
            child: InputDecorator(
              decoration: const InputDecoration(labelText: 'Coin'),
              child: Row(
                children: [
                  Text(
                    _coin,
                    style: const TextStyle(fontSize: 16.5, fontWeight: FontWeight.w700),
                  ),
                  const Spacer(),
                  const Icon(Icons.chevron_right_rounded),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          InkWell(
            onTap: _selectNetwork,
            borderRadius: BorderRadius.circular(12),
            child: InputDecorator(
              decoration: const InputDecoration(
                labelText: 'Network',
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      '$_network • ${_networkMeta.display}',
                      style: const TextStyle(fontSize: 14),
                    ),
                  ),
                  const Icon(Icons.keyboard_arrow_down_rounded),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _addressController,
            decoration: const InputDecoration(
              labelText: 'Recipient Address',
              hintText: 'Paste destination wallet address',
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              labelText: 'Withdrawal Amount',
              hintText: 'Minimum ${_networkMeta.minWithdrawUsdt.toStringAsFixed(2)}',
              suffixText: _coin,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isLight ? Colors.white : const Color(0xFF0E1523),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isLight ? const Color(0xFFD5DDEC) : const Color(0xFF1E2C46),
              ),
            ),
            child: Column(
              children: [
                _withdrawMetaRow(
                  'Network fee',
                  '${_networkMeta.feeUsdt.toStringAsFixed(3)} $_coin',
                  secondary,
                ),
                _withdrawMetaRow(
                  'Minimum withdrawal',
                  '${_networkMeta.minWithdrawUsdt.toStringAsFixed(2)} $_coin',
                  secondary,
                ),
                _withdrawMetaRow(
                  'Available balance',
                  '${_formatWithCommas(available, decimals: 4)} $_coin',
                  secondary,
                ),
                _withdrawMetaRow(
                  'Estimated arrival',
                  _networkMeta.arrival,
                  secondary,
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Security verification',
            style: TextStyle(
              color: primary,
              fontSize: 14.4,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _emailCodeController,
            decoration: const InputDecoration(labelText: 'Email verification code'),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _smsCodeController,
            decoration: const InputDecoration(labelText: 'SMS verification code'),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _googleCodeController,
            decoration: const InputDecoration(labelText: 'Google Authenticator code'),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _fundPasswordController,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Fund password'),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _submitWithdrawal,
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFFE4C657),
              foregroundColor: Colors.black87,
              minimumSize: const Size.fromHeight(48),
            ),
            child: const Text('Withdraw', style: TextStyle(fontSize: 14.2)),
          ),
        ],
      ),
    );
  }

  Widget _withdrawMetaRow(String label, String value, Color secondary) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: TextStyle(fontSize: 12.2, color: secondary),
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 12.6, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

class TransferPage extends StatefulWidget {
  const TransferPage({super.key});

  @override
  State<TransferPage> createState() => _TransferPageState();
}

class _TransferPageState extends State<TransferPage> {
  String _from = 'Funding';
  String _to = 'Spot';
  final TextEditingController _amountController = TextEditingController();

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Transfer Funds')),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          DropdownButtonFormField<String>(
            initialValue: _from,
            decoration: const InputDecoration(labelText: 'From Wallet'),
            items: const [
              DropdownMenuItem(value: 'Funding', child: Text('Funding')),
              DropdownMenuItem(value: 'Spot', child: Text('Spot')),
            ],
            onChanged: (value) {
              if (value == null) return;
              setState(() => _from = value);
            },
          ),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: _to,
            decoration: const InputDecoration(labelText: 'To Wallet'),
            items: const [
              DropdownMenuItem(value: 'Funding', child: Text('Funding')),
              DropdownMenuItem(value: 'Spot', child: Text('Spot')),
            ],
            onChanged: (value) {
              if (value == null) return;
              setState(() => _to = value);
            },
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Amount',
              hintText: 'Enter USDT amount',
            ),
          ),
          const SizedBox(height: 10),
          FilledButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Transferred from $_from to $_to')),
              );
            },
            child: const Text('Transfer Now', style: TextStyle(fontSize: 13)),
          ),
        ],
      ),
    );
  }
}

class AssetHistoryPage extends StatefulWidget {
  const AssetHistoryPage({super.key});

  @override
  State<AssetHistoryPage> createState() => _AssetHistoryPageState();
}

class _AssetHistoryPageState extends State<AssetHistoryPage> {
  int _tab = 0;
  static const _tabs = ['Deposit', 'Withdraw', 'Transfer'];

  List<AssetTransactionRecord> _rowsForTab() {
    final type = switch (_tab) {
      0 => 'deposit',
      1 => 'withdraw',
      _ => 'transfer',
    };
    return kAssetTxHistory
        .where((item) => item.type == type)
        .toList()
      ..sort((a, b) => b.time.compareTo(a.time));
  }

  String _timeLabel(DateTime value) {
    final y = value.year.toString().padLeft(4, '0');
    final m = value.month.toString().padLeft(2, '0');
    final d = value.day.toString().padLeft(2, '0');
    final hh = value.hour.toString().padLeft(2, '0');
    final mm = value.minute.toString().padLeft(2, '0');
    final ss = value.second.toString().padLeft(2, '0');
    return '$y-$m-$d $hh:$mm:$ss';
  }

  @override
  Widget build(BuildContext context) {
    final rows = _rowsForTab();
    final isLight = Theme.of(context).brightness == Brightness.light;
    final primary = isLight ? const Color(0xFF11151F) : Colors.white;
    final secondary = isLight ? const Color(0xFF6D7586) : Colors.white60;
    final divider = isLight ? const Color(0xFFD9E0EE) : const Color(0xFF1F293D);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Assets'),
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.download_outlined)),
        ],
      ),
      body: Column(
        children: [
          const SizedBox(height: 2),
          Text(
            '${_tabs[_tab]} History',
            style: TextStyle(
              color: secondary,
              fontSize: 13.8,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: List.generate(_tabs.length, (index) {
              final active = _tab == index;
              return Expanded(
                child: InkWell(
                  onTap: () => setState(() => _tab = index),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Column(
                      children: [
                        Text(
                          _tabs[index],
                          style: TextStyle(
                            fontSize: 14.2,
                            fontWeight: active
                                ? FontWeight.w700
                                : FontWeight.w500,
                            color: active ? primary : secondary,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          width: 44,
                          height: 2.5,
                          decoration: BoxDecoration(
                            color: active ? const Color(0xFFE4C657) : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
          Container(
            width: double.infinity,
            color: isLight ? Colors.white : const Color(0xFF090E18),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            child: Text(
              'Deposits not arrived? Check solutions here',
              style: TextStyle(
                color: secondary,
                fontSize: 12.6,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: rows.isEmpty
                ? Center(
                    child: Text(
                      'No ${_tabs[_tab].toLowerCase()} records',
                      style: TextStyle(fontSize: 13.2, color: secondary),
                    ),
                  )
                : ListView.separated(
                    itemCount: rows.length,
                    separatorBuilder: (context, index) =>
                        Divider(height: 1, color: divider),
                    itemBuilder: (context, index) {
                      final item = rows[index];
                      final amountColor = item.type == 'withdraw'
                          ? const Color(0xFFEF4E5E)
                          : const Color(0xFF56C08C);
                      return ListTile(
                        contentPadding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
                        title: Text(
                          item.coin,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: primary,
                          ),
                        ),
                        subtitle: Text(
                          _timeLabel(item.time),
                          style: TextStyle(fontSize: 12.4, color: secondary),
                        ),
                        trailing: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '${item.type == 'withdraw' ? '-' : '+'}${_formatWithCommas(item.amount, decimals: 4).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\\.$'), '')}',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: amountColor,
                              ),
                            ),
                            Text(
                              item.status,
                              style: TextStyle(fontSize: 12.6, color: secondary),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class SupportBotPage extends StatefulWidget {
  const SupportBotPage({super.key});

  @override
  State<SupportBotPage> createState() => _SupportBotPageState();
}

class _SupportBotPageState extends State<SupportBotPage> {
  final TextEditingController _queryController = TextEditingController();
  final TextEditingController _orderIdController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<_SupportMessage> _messages = [];
  final List<_SupportTicket> _tickets = [];
  SupportQuickCategory? _selectedCategory;
  SupportHelpArticle? _activeArticle;
  P2POrderItem? _queriedOrder;
  bool _showFeedbackSheet = false;
  int _ticketSeed = 1000;

  static const List<String> _topQuestions = [
    "I haven't receive my crypto deposit",
    'How to submit a withdrawal?',
    'Verification code not received - SMS',
    'Verification code not received - Email',
    "I didn't receive my rewards",
  ];

  @override
  void dispose() {
    _queryController.dispose();
    _orderIdController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _appendBot(
      "Hey user! I'm your virtual assistant. How can I help today?",
    );
  }

  String _timeTag(DateTime dt) {
    final hh = dt.hour.toString().padLeft(2, '0');
    final mm = dt.minute.toString().padLeft(2, '0');
    return '$hh:$mm';
  }

  void _appendBot(String text) {
    _messages.add(
      _SupportMessage(
        role: 'bot',
        text: text,
        time: DateTime.now(),
      ),
    );
  }

  void _appendUser(String text) {
    _messages.add(
      _SupportMessage(
        role: 'user',
        text: text,
        time: DateTime.now(),
      ),
    );
  }

  void _scrollToBottomSoon() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent + 180,
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
      );
    });
  }

  SupportHelpArticle _findArticleByQuestion(String question) {
    final q = question.toLowerCase();
    if (q.contains('sms')) {
      return kSupportHelpArticles.firstWhere((a) => a.id == 'verification-sms');
    }
    if (q.contains('email') || q.contains('verification code')) {
      return kSupportHelpArticles.firstWhere(
        (a) => a.id == 'verification-email',
      );
    }
    if (q.contains('deposit')) {
      return kSupportHelpArticles.firstWhere((a) => a.id == 'deposit-not-credited');
    }
    if (q.contains('withdraw')) {
      return kSupportHelpArticles.firstWhere((a) => a.id == 'withdraw-howto');
    }
    if (q.contains('reward') || q.contains('bonus') || q.contains('coupon')) {
      return kSupportHelpArticles.firstWhere((a) => a.id == 'reward-info');
    }
    if (q.contains('identity') || q.contains('kyc') || q.contains('verify')) {
      return kSupportHelpArticles.firstWhere((a) => a.id == 'kyc-guide');
    }
    if (q.contains('p2p') || q.contains('merchant') || q.contains('dispute')) {
      return kSupportHelpArticles.firstWhere((a) => a.id == 'p2p-issue');
    }
    return kSupportHelpArticles.first;
  }

  void _openArticleByQuestion(String question) {
    final article = _findArticleByQuestion(question);
    setState(() {
      _activeArticle = article;
      _appendUser(question);
      _appendBot('I found this help article: ${article.title}');
    });
    _scrollToBottomSoon();
  }

  bool _isAgentRequest(String q) {
    const keywords = [
      'connect agent',
      'live agent',
      'human agent',
      'talk to agent',
      'support agent',
      'customer care',
    ];
    return keywords.any(q.contains);
  }

  bool _looksLikeOrderId(String text) {
    final normalized = text.toUpperCase();
    return normalized.contains('P2P-') || RegExp(r'\d{6,}').hasMatch(normalized);
  }

  void _createSupportTicket(String reason) {
    _ticketSeed += 1;
    final alert = addSupportAgentAlert(reason);
    setState(() {
      _tickets.insert(
        0,
        _SupportTicket(
          id: 'STK-$_ticketSeed',
          reason: reason,
          status: 'OPEN',
          createdAt: DateTime.now(),
          alertId: alert.id,
        ),
      );
      _appendBot(
        'Ticket STK-$_ticketSeed created. Human support has been notified.',
      );
    });
    _scrollToBottomSoon();
  }

  void _searchOrderById([String? value]) {
    final query = (value ?? _orderIdController.text).trim();
    if (query.isEmpty) return;
    final normalized = query.toUpperCase();
    P2POrderItem? matched;
    for (final order in kP2PSampleOrders) {
      if (order.id.toUpperCase().contains(normalized)) {
        matched = order;
        break;
      }
    }
    setState(() {
      _appendUser('Order inquiry: $query');
      if (matched == null) {
        _queriedOrder = null;
        _appendBot(
          'No order found for "$query". Please re-check Order ID or open support ticket.',
        );
      } else {
        _queriedOrder = matched;
        _appendBot(
          'Order found: ${matched.id} (${matched.side} ${matched.fiatAmount.toStringAsFixed(0)} INR → ${matched.usdtAmount.toStringAsFixed(2)} USDT).',
        );
      }
    });
    _scrollToBottomSoon();
  }

  void _sendQuestion([String? preset]) {
    final question = (preset ?? _queryController.text).trim();
    if (question.isEmpty) return;
    final lower = question.toLowerCase();

    if (_looksLikeOrderId(question)) {
      _searchOrderById(question);
      _queryController.clear();
      return;
    }

    if (_isAgentRequest(lower)) {
      setState(() {
        _appendUser(question);
      });
      _createSupportTicket('Escalation requested: $question');
      _queryController.clear();
      return;
    }

    final article = _findArticleByQuestion(question);
    setState(() {
      _appendUser(question);
      _activeArticle = article;
      _appendBot('Opening help article: ${article.title}');
      _queryController.clear();
    });
    _scrollToBottomSoon();
  }

  Widget _categorySection(bool isLight) {
    final cardBg = isLight ? const Color(0xFFF1F3F6) : const Color(0xFF111820);
    final chipBg = isLight ? Colors.white : const Color(0xFF1B2532);
    final textColor = isLight ? const Color(0xFF1B1F2A) : Colors.white;

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "👋 Hey user! I'm your virtual assistant. How can I help today?",
            style: TextStyle(
              fontSize: 13.8,
              fontWeight: FontWeight.w600,
              color: textColor,
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: kSupportQuickCategories.map((cat) {
              final active = _selectedCategory?.title == cat.title;
              return InkWell(
                onTap: () {
                  setState(() {
                    _selectedCategory = cat;
                    _appendUser(cat.title);
                    _appendBot('Showing help for ${cat.title}.');
                  });
                  _scrollToBottomSoon();
                },
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: active
                        ? const Color(0xFF16A7C8)
                        : chipBg,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    cat.title,
                    style: TextStyle(
                      fontSize: 11.8,
                      color: active
                          ? Colors.white
                          : (isLight
                                ? const Color(0xFF202534)
                                : Colors.white70),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _questionCard(bool isLight) {
    final category = _selectedCategory;
    if (category == null) return const SizedBox.shrink();
    final bg = isLight ? Colors.white : const Color(0xFF101721);
    final border = isLight ? const Color(0xFFD8DFEB) : const Color(0xFF202C3F);
    final primary = isLight ? const Color(0xFF141A25) : Colors.white;
    final secondary = isLight ? const Color(0xFF596177) : Colors.white70;

    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Common questions you can ask me:',
            style: TextStyle(
              fontSize: 16.5,
              fontWeight: FontWeight.w700,
              color: primary,
            ),
          ),
          const SizedBox(height: 10),
          ...category.questions.map((question) {
            return InkWell(
              onTap: () => _openArticleByQuestion(question),
              borderRadius: BorderRadius.circular(10),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        question,
                        style: TextStyle(
                          fontSize: 14.2,
                          color: secondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    Icon(
                      Icons.chevron_right_rounded,
                      color: secondary,
                      size: 20,
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _activeArticleCard(bool isLight) {
    final article = _activeArticle;
    if (article == null) return const SizedBox.shrink();
    final bg = isLight ? const Color(0xFFF0F2F6) : const Color(0xFF141D2A);
    final border = isLight ? const Color(0xFFD3DBE9) : const Color(0xFF1E2C44);
    final primary = isLight ? const Color(0xFF151A25) : Colors.white;
    final secondary = isLight ? const Color(0xFF4E566A) : Colors.white70;

    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  article.title,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: primary,
                  ),
                ),
              ),
              TextButton(
                onPressed: () {
                  setState(() => _activeArticle = null);
                },
                child: const Text('Close'),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            article.body,
            style: TextStyle(
              fontSize: 14.2,
              color: secondary,
              height: 1.44,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _chatWithSupport,
              style: FilledButton.styleFrom(
                backgroundColor: isLight
                    ? const Color(0xFFE9EDF5)
                    : const Color(0xFF202B3F),
                foregroundColor: isLight
                    ? const Color(0xFF161A25)
                    : Colors.white,
                minimumSize: const Size.fromHeight(46),
              ),
              icon: const Icon(Icons.headset_mic_outlined),
              label: const Text(
                'Chat with Support',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _orderQueryCard(bool isLight) {
    final bg = isLight ? Colors.white : const Color(0xFF101824);
    final border = isLight ? const Color(0xFFD8DFED) : const Color(0xFF1F2B42);
    final primary = isLight ? const Color(0xFF141924) : Colors.white;
    final secondary = isLight ? const Color(0xFF5A6377) : Colors.white70;

    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Inquiry',
            style: TextStyle(
              fontSize: 16.8,
              fontWeight: FontWeight.w700,
              color: primary,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _orderIdController,
                  decoration: const InputDecoration(
                    hintText: 'Search by Order ID (P2P-104293)',
                  ),
                  onSubmitted: _searchOrderById,
                ),
              ),
              const SizedBox(width: 8),
              FilledButton(
                onPressed: _searchOrderById,
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFF11151E),
                  foregroundColor: Colors.white,
                ),
                child: const Text('Query'),
              ),
            ],
          ),
          if (_queriedOrder != null) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isLight ? const Color(0xFFF1F4F9) : const Color(0xFF131D2C),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Order ID ${_queriedOrder!.id}',
                    style: TextStyle(
                      color: primary,
                      fontSize: 13.3,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Amount: ${_queriedOrder!.fiatAmount.toStringAsFixed(0)} INR',
                    style: TextStyle(fontSize: 12.4, color: secondary),
                  ),
                  Text(
                    'Price: ${_queriedOrder!.pricePerUsdt.toStringAsFixed(2)} INR',
                    style: TextStyle(fontSize: 12.4, color: secondary),
                  ),
                  Text(
                    'Buyer: ${_queriedOrder!.side.toLowerCase() == 'buy' ? 'You' : _queriedOrder!.counterparty}',
                    style: TextStyle(fontSize: 12.4, color: secondary),
                  ),
                  Text(
                    'Seller: ${_queriedOrder!.side.toLowerCase() == 'sell' ? 'You' : _queriedOrder!.counterparty}',
                    style: TextStyle(fontSize: 12.4, color: secondary),
                  ),
                  Text(
                    'Order status: ${_queriedOrder!.status}',
                    style: TextStyle(
                      fontSize: 12.8,
                      color: p2pStateColor(_queriedOrder!.orderState),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      OutlinedButton(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) => const P2PPage(),
                            ),
                          );
                        },
                        child: const Text('View Order'),
                      ),
                      OutlinedButton(
                        onPressed: () {
                          if (_queriedOrder == null) return;
                          _createSupportTicket(
                            'Dispute opened for ${_queriedOrder!.id}',
                          );
                        },
                        child: const Text('Open Dispute'),
                      ),
                      OutlinedButton(
                        onPressed: () {
                          final order = _queriedOrder;
                          if (order == null) return;
                          setState(() {
                            _appendUser('Contact merchant for ${order.id}');
                            _appendBot(
                              'Merchant ${order.counterparty} has been notified in chat.',
                            );
                          });
                          _scrollToBottomSoon();
                        },
                        child: const Text('Contact Merchant'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  void _chatWithSupport() {
    _createSupportTicket('User requested live support from help center');
    setState(() {
      _showFeedbackSheet = true;
    });
  }

  Widget _topQuestionsCard(bool isLight) {
    final bg = isLight ? Colors.white : const Color(0xFF0F1724);
    final border = isLight ? const Color(0xFFD8DFEB) : const Color(0xFF202C3F);

    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Top questions',
            style: TextStyle(fontSize: 18.5, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          ..._topQuestions.map((q) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: OutlinedButton(
                onPressed: () => _openArticleByQuestion(q),
                style: OutlinedButton.styleFrom(
                  alignment: Alignment.centerLeft,
                  minimumSize: const Size.fromHeight(44),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        q,
                        style: const TextStyle(fontSize: 14),
                      ),
                    ),
                    const Icon(Icons.chevron_right_rounded, size: 18),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 2),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _chatWithSupport,
              style: FilledButton.styleFrom(
                backgroundColor: isLight
                    ? const Color(0xFFE9EDF4)
                    : const Color(0xFF202A3A),
                foregroundColor: isLight ? Colors.black : Colors.white,
                minimumSize: const Size.fromHeight(50),
              ),
              icon: const Icon(Icons.headset_mic_outlined),
              label: const Text(
                'Chat with us',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _chatThreadCard(bool isLight) {
    if (_messages.isEmpty) return const SizedBox.shrink();
    final bg = isLight ? Colors.white : const Color(0xFF0F1724);
    final border = isLight ? const Color(0xFFD8DFEB) : const Color(0xFF202C3F);
    final botBg = isLight ? const Color(0xFFF0F3F8) : const Color(0xFF1A2436);
    final userBg = const Color(0xFF18AFCB);

    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        children: _messages.map((item) {
          final isBot = item.role == 'bot';
          return Padding(
            padding: const EdgeInsets.only(bottom: 9),
            child: Column(
              crossAxisAlignment: isBot
                  ? CrossAxisAlignment.start
                  : CrossAxisAlignment.end,
              children: [
                Text(
                  _timeTag(item.time),
                  style: TextStyle(
                    fontSize: 11,
                    color: isLight ? const Color(0xFF747C8F) : Colors.white54,
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  constraints: const BoxConstraints(maxWidth: 340),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: isBot ? botBg : userBg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(
                    item.text,
                    style: TextStyle(
                      fontSize: 14,
                      height: 1.38,
                      color: isBot
                          ? (isLight ? const Color(0xFF1B2130) : Colors.white)
                          : Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _ticketSummaryCard(bool isLight) {
    if (_tickets.isEmpty) return const SizedBox.shrink();
    final bg = isLight ? Colors.white : const Color(0xFF101822);
    final border = isLight ? const Color(0xFFD8DFEB) : const Color(0xFF203047);

    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Support Tickets',
            style: TextStyle(fontSize: 16.8, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          ..._tickets.take(4).map((ticket) {
            final created = _timeTag(ticket.createdAt);
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isLight ? const Color(0xFFF2F5FA) : const Color(0xFF1B2434),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${ticket.id} • ${ticket.reason}',
                        style: const TextStyle(
                          fontSize: 12.6,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${ticket.status} · $created',
                      style: const TextStyle(
                        fontSize: 11.6,
                        color: Color(0xFF18AFCB),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isLight = Theme.of(context).brightness == Brightness.light;
    final inputHint = isLight ? const Color(0xFF8C94A5) : Colors.white54;
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Text('🤖', style: TextStyle(fontSize: 18)),
            SizedBox(width: 8),
            Text('Bitget Support'),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () => Navigator.of(context).pop(),
            icon: const Icon(Icons.close),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              controller: _scrollController,
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
              children: [
                _categorySection(isLight),
                _questionCard(isLight),
                _activeArticleCard(isLight),
                _orderQueryCard(isLight),
                _ticketSummaryCard(isLight),
                _topQuestionsCard(isLight),
                _chatThreadCard(isLight),
                if (_showFeedbackSheet)
                  Container(
                    margin: const EdgeInsets.only(top: 12),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isLight
                          ? const Color(0xFFF1F3F8)
                          : const Color(0xFF151E2B),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'We value your feedback! Please rate your experience.',
                          style: TextStyle(
                            fontSize: 16.8,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: List.generate(5, (index) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 6),
                              child: IconButton(
                                onPressed: () {
                                  setState(() {
                                    _showFeedbackSheet = false;
                                  });
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                        'Thanks for rating ${index + 1} star',
                                      ),
                                    ),
                                  );
                                },
                                icon: const Icon(
                                  Icons.star_border_rounded,
                                  size: 28,
                                ),
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 4, 12, 10),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _queryController,
                    decoration: InputDecoration(
                      hintText: 'Input your question(s) here',
                      hintStyle: TextStyle(color: inputHint),
                      isDense: true,
                    ),
                    onSubmitted: (_) => _sendQuestion(),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: _sendQuestion,
                  style: FilledButton.styleFrom(
                    backgroundColor: isLight
                        ? const Color(0xFFE6EAF3)
                        : const Color(0xFF2A3346),
                    foregroundColor: isLight
                        ? const Color(0xFF1A1F2A)
                        : Colors.white,
                  ),
                  child: const Icon(Icons.arrow_upward_rounded, size: 16),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SupportMessage {
  const _SupportMessage({
    required this.role,
    required this.text,
    required this.time,
  });

  final String role;
  final String text;
  final DateTime time;
}

class _SupportTicket {
  const _SupportTicket({
    required this.id,
    required this.reason,
    required this.status,
    required this.createdAt,
    required this.alertId,
  });

  final String id;
  final String reason;
  final String status;
  final DateTime createdAt;
  final int alertId;
}

class _PostAdDraft {
  const _PostAdDraft({
    required this.side,
    required this.pair,
    required this.price,
    required this.limits,
    required this.available,
    required this.paymentMethods,
  });

  final String side;
  final String pair;
  final String price;
  final String limits;
  final String available;
  final List<String> paymentMethods;
}

class P2PPostAdPage extends StatefulWidget {
  const P2PPostAdPage({super.key});

  @override
  State<P2PPostAdPage> createState() => _P2PPostAdPageState();
}

class _P2PPostAdPageState extends State<P2PPostAdPage> {
  int _step = 1;
  String _side = 'buy';
  String _asset = 'USDT';
  String _fiat = 'INR';
  String _priceType = 'Fixed';
  final TextEditingController _priceController = TextEditingController(
    text: '91.63',
  );
  final TextEditingController _minController = TextEditingController(
    text: '500',
  );
  final TextEditingController _maxController = TextEditingController(
    text: '5500',
  );
  final TextEditingController _availableController = TextEditingController(
    text: '200.00',
  );
  final TextEditingController _paymentController = TextEditingController(
    text: 'UPI, Paytm, IMPS',
  );
  final TextEditingController _conditionsController = TextEditingController(
    text: 'Payment should be from verified account only.',
  );
  final TextEditingController _remarksController = TextEditingController();

  @override
  void dispose() {
    _priceController.dispose();
    _minController.dispose();
    _maxController.dispose();
    _availableController.dispose();
    _paymentController.dispose();
    _conditionsController.dispose();
    _remarksController.dispose();
    super.dispose();
  }

  void _changePrice(double delta) {
    final current = double.tryParse(_priceController.text.trim()) ?? 0;
    final next = (current + delta).clamp(1, 100000);
    setState(() => _priceController.text = next.toStringAsFixed(2));
  }

  void _next() {
    if (_step < 3) {
      setState(() => _step += 1);
      return;
    }
    final methods = _paymentController.text
        .split(',')
        .map((item) => item.trim())
        .where((item) => item.isNotEmpty)
        .toList();
    final draft = _PostAdDraft(
      side: _side,
      pair: '${_asset.toUpperCase()}/${_fiat.toUpperCase()}',
      price: '${_priceController.text.trim()} ${_fiat.toUpperCase()}',
      limits:
          '${_minController.text.trim()} - ${_maxController.text.trim()} ${_fiat.toUpperCase()}',
      available: '${_availableController.text.trim()} ${_asset.toUpperCase()}',
      paymentMethods: methods.isEmpty ? const ['UPI'] : methods,
    );
    Navigator.of(context).pop(draft);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post Ad'),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 10),
            child: Icon(Icons.help_outline, size: 20),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 10, 14, 6),
            child: Column(
              children: [
                Row(
                  children: List.generate(3, (index) {
                    final stepNo = index + 1;
                    final active = _step == stepNo;
                    final done = _step > stepNo;
                    return Expanded(
                      child: Row(
                        children: [
                          Container(
                            width: 22,
                            height: 22,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: active || done
                                  ? const Color(0xFFF1CB3E)
                                  : const Color(0xFF293146),
                              shape: BoxShape.circle,
                            ),
                            child: Text(
                              '$stepNo',
                              style: TextStyle(
                                fontSize: 11.2,
                                color: active || done
                                    ? Colors.black
                                    : Colors.white70,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          if (index != 2)
                            Expanded(
                              child: Container(
                                height: 2,
                                color: _step > stepNo
                                    ? const Color(0xFFF1CB3E)
                                    : const Color(0xFF293146),
                              ),
                            ),
                        ],
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 8),
                const Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Set Type & Price',
                        style: TextStyle(fontSize: 10.6),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        'Set Amount & Method',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 10.6, color: Colors.white70),
                      ),
                    ),
                    Expanded(
                      child: Text(
                        'Set Conditions',
                        textAlign: TextAlign.right,
                        style: TextStyle(fontSize: 10.6, color: Colors.white70),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(14),
              children: [
                if (_step == 1) ...[
                  const Text(
                    'I want to',
                    style: TextStyle(fontSize: 16.5, color: Colors.white70),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: ChoiceChip(
                          label: const Text('Buy'),
                          selected: _side == 'buy',
                          onSelected: (_) => setState(() => _side = 'buy'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ChoiceChip(
                          label: const Text('Sell'),
                          selected: _side == 'sell',
                          onSelected: (_) => setState(() => _side = 'sell'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          initialValue: _asset,
                          decoration: const InputDecoration(labelText: 'Asset'),
                          items: const [
                            DropdownMenuItem(
                              value: 'USDT',
                              child: Text('USDT'),
                            ),
                            DropdownMenuItem(value: 'BTC', child: Text('BTC')),
                            DropdownMenuItem(value: 'ETH', child: Text('ETH')),
                          ],
                          onChanged: (value) {
                            if (value == null) return;
                            setState(() => _asset = value);
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          initialValue: _fiat,
                          decoration: const InputDecoration(
                            labelText: 'With fiat',
                          ),
                          items: const [
                            DropdownMenuItem(value: 'INR', child: Text('INR')),
                            DropdownMenuItem(value: 'USD', child: Text('USD')),
                          ],
                          onChanged: (value) {
                            if (value == null) return;
                            setState(() => _fiat = value);
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    initialValue: _priceType,
                    decoration: const InputDecoration(labelText: 'Price Type'),
                    items: const [
                      DropdownMenuItem(value: 'Fixed', child: Text('Fixed')),
                      DropdownMenuItem(
                        value: 'Floating',
                        child: Text('Floating'),
                      ),
                    ],
                    onChanged: (value) {
                      if (value == null) return;
                      setState(() => _priceType = value);
                    },
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F1627),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFF24324A)),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: () => _changePrice(-0.10),
                          icon: const Icon(Icons.remove),
                        ),
                        Expanded(
                          child: TextField(
                            controller: _priceController,
                            keyboardType: const TextInputType.numberWithOptions(
                              decimal: true,
                            ),
                            textAlign: TextAlign.center,
                            decoration: const InputDecoration(
                              border: InputBorder.none,
                              isDense: true,
                            ),
                          ),
                        ),
                        IconButton(
                          onPressed: () => _changePrice(0.10),
                          icon: const Icon(Icons.add),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Your Price  ₹${_priceController.text.trim()}',
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ] else if (_step == 2) ...[
                  TextField(
                    controller: _minController,
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true,
                    ),
                    decoration: const InputDecoration(labelText: 'Min Limit'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _maxController,
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true,
                    ),
                    decoration: const InputDecoration(labelText: 'Max Limit'),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _availableController,
                    keyboardType: const TextInputType.numberWithOptions(
                      decimal: true,
                    ),
                    decoration: const InputDecoration(
                      labelText: 'Available Quantity',
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _paymentController,
                    decoration: const InputDecoration(
                      labelText: 'Payment Methods (comma separated)',
                    ),
                  ),
                ] else ...[
                  TextField(
                    controller: _conditionsController,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Trading conditions',
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _remarksController,
                    maxLines: 3,
                    decoration: const InputDecoration(
                      labelText: 'Remark for counterparty (optional)',
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10192B),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFF24324A)),
                    ),
                    child: const Text(
                      'Tip: Keep payment details accurate and avoid third-party transfers.',
                      style: TextStyle(fontSize: 11.2, color: Colors.white70),
                    ),
                  ),
                ],
              ],
            ),
          ),
          SafeArea(
            top: false,
            minimum: const EdgeInsets.fromLTRB(14, 8, 14, 14),
            child: SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _next,
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFFF1CB3E),
                  foregroundColor: Colors.black,
                  minimumSize: const Size.fromHeight(50),
                ),
                child: Text(
                  _step == 3 ? 'Publish Ad' : 'Next',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

enum _P2PTab { p2p, orders, ads, profile }

class P2PPage extends StatefulWidget {
  const P2PPage({super.key});

  @override
  State<P2PPage> createState() => _P2PPageState();
}

class _P2PPageState extends State<P2PPage> {
  _P2PTab _activeTab = _P2PTab.p2p;
  List<P2PAdItem> _ads = List<P2PAdItem>.from(kP2PSampleAds);
  List<P2POrderItem> _orders = List<P2POrderItem>.from(kP2PSampleOrders);
  String _orderPrimaryTab = 'ONGOING';
  String _orderSecondaryTab = 'ALL';
  String _adType = 'sell';
  String _marketMainTab = 'BUY';
  String _marketCrypto = 'USDT';
  String _marketCurrency = 'INR';
  String _amountFilter = 'Any Amount';
  String _marketPaymentFilter = 'All Payment Methods';
  bool _marketPaused = false;
  int _nextOrderNumber = 104500;
  final String _buyerUid = currentUserUid;
  final String _sessionIp = '103.42.19.${28 + Random().nextInt(180)}';
  final P2PApiService _api = P2PApiService();
  final Random _rng = Random();
  final List<P2PAdminLog> _adminLogs = <P2PAdminLog>[];
  final List<P2PAppealTicket> _appeals = <P2PAppealTicket>[];
  final Set<String> _bannedMerchants = <String>{};
  Timer? _offerTicker;

  final TextEditingController _adPairController = TextEditingController(
    text: 'USDT/INR',
  );
  final TextEditingController _adPriceController = TextEditingController(
    text: '89.20 INR',
  );
  final TextEditingController _adLimitsController = TextEditingController(
    text: '5,000 - 50,000 INR',
  );
  final TextEditingController _adAvailableController = TextEditingController(
    text: '8,000 USDT',
  );
  final TextEditingController _adPaymentController = TextEditingController(
    text: 'UPI, IMPS',
  );

  @override
  void initState() {
    super.initState();
    _orders = _orders
        .map(
          (order) => order.copyWith(
            status: p2pOrderStateLabel(order.orderState),
            createdAtMs: order.createdAtMs == 0
                ? DateTime.now().millisecondsSinceEpoch
                : order.createdAtMs,
            expiresAtMs: order.expiresAtMs == 0
                ? DateTime.now()
                      .add(const Duration(minutes: 10))
                      .millisecondsSinceEpoch
                : order.expiresAtMs,
          ),
        )
        .toList();
    _offerTicker = Timer.periodic(const Duration(seconds: 3), (_) {
      if (!mounted || _marketPaused) return;
      setState(() {
        _ads = _ads.map((ad) {
          if (!ad.autoPriceEnabled) return ad;
          final base = ad.priceValue <= 0 ? 98 : ad.priceValue;
          final drift = (_rng.nextDouble() - 0.5) * 0.0045;
          final next = (base * (1 + drift)).clamp(base * 0.96, base * 1.04);
          return ad.copyWith(price: '${next.toStringAsFixed(2)} INR');
        }).toList();
      });
    });
  }

  @override
  void dispose() {
    _offerTicker?.cancel();
    _adPairController.dispose();
    _adPriceController.dispose();
    _adLimitsController.dispose();
    _adAvailableController.dispose();
    _adPaymentController.dispose();
    super.dispose();
  }

  void _appendAdminLog({
    required String action,
    required String target,
    required String meta,
  }) {
    _adminLogs.insert(
      0,
      P2PAdminLog(
        time: DateTime.now(),
        action: action,
        target: target,
        meta: meta,
      ),
    );
  }

  String _orderId() => 'P2P-${_nextOrderNumber++}';

  String _countdownFromMs(int expiryMs) {
    final left = expiryMs - DateTime.now().millisecondsSinceEpoch;
    if (left <= 0) return '00:00';
    final mins = (left ~/ 60000).toString().padLeft(2, '0');
    final sec = ((left % 60000) ~/ 1000).toString().padLeft(2, '0');
    return '$mins:$sec';
  }

  void _upsertOrder(P2POrderItem order) {
    final idx = _orders.indexWhere((element) => element.id == order.id);
    setState(() {
      if (idx < 0) {
        _orders = [order, ..._orders];
      } else {
        _orders[idx] = order;
      }
    });
    if (order.orderState == P2POrderState.appealOpened &&
        order.appealProofPath != null &&
        order.disputeReason != null) {
      final already = _appeals.any((item) => item.orderId == order.id);
      if (!already) {
        _appeals.insert(
          0,
          P2PAppealTicket(
            orderId: order.id,
            buyer: order.buyerWallet,
            seller: order.counterparty,
            amount: '${order.fiatAmount.toStringAsFixed(2)} INR',
            paymentProofPath: order.appealProofPath!,
            appealReason: order.disputeReason!,
            chatSummary:
                'Buyer marked paid. Seller did not release within countdown.',
            createdAt: DateTime.now(),
          ),
        );
      }
    }
  }

  bool _matchesAmountFilter(P2PAdItem ad) {
    if (_amountFilter == 'Any Amount') return true;
    final limits = ad.limitRange;
    final min = limits[0];
    final max = limits[1];
    if (_amountFilter == '0 - 5,000') return min <= 5000;
    if (_amountFilter == '5,000 - 50,000') return min <= 50000 && max >= 5000;
    if (_amountFilter == '50,000+') return max >= 50000;
    return true;
  }

  List<P2PAdItem> _visibleAds() {
    return _ads.where((ad) {
      if (_bannedMerchants.contains(ad.seller)) return false;
      if (_marketCrypto.toUpperCase() !=
          ad.pair.split('/').first.toUpperCase()) {
        return false;
      }
      if (_marketPaymentFilter != 'All Payment Methods' &&
          !ad.paymentMethods.contains(_marketPaymentFilter)) {
        return false;
      }
      if (!_matchesAmountFilter(ad)) return false;
      if (_marketMainTab == 'BUY') {
        return ad.side.toLowerCase() == 'sell';
      }
      if (_marketMainTab == 'SELL') {
        return ad.side.toLowerCase() == 'buy';
      }
      if (_marketMainTab == 'BLOCK TRADE') {
        return false;
      }
      return true;
    }).toList();
  }

  void _createAd() {
    final pair = _adPairController.text.trim();
    final price = _adPriceController.text.trim();
    final limits = _adLimitsController.text.trim();
    final available = _adAvailableController.text.trim();
    final methods = _adPaymentController.text
        .split(',')
        .map((item) => item.trim())
        .where((item) => item.isNotEmpty)
        .toList();
    if (pair.isEmpty || price.isEmpty || limits.isEmpty || available.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Fill all ad fields first')));
      return;
    }

    final nickname = nicknameNotifier.value.isEmpty
        ? 'Merchant'
        : nicknameNotifier.value;

    setState(() {
      _ads.insert(
        0,
        P2PAdItem(
          seller: nickname,
          pair: pair.toUpperCase(),
          price: price,
          limits: limits,
          completed30d: '0',
          completionRate30d: '--',
          avgReleaseTime: '--',
          avgPaymentTime: '--',
          available: available,
          logoUrl: _adType == 'buy'
              ? 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
              : 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
          paymentMethods: methods.isEmpty ? const ['UPI'] : methods,
          side: _adType,
          verified: true,
          badge: 'Advertiser',
          timerMinutes: 15,
          reputationScore: 4.6,
        ),
      );
    });

    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Ad created')));
  }

  Future<void> _openPostAdWizard() async {
    if (!kycVerifiedNotifier.value) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Complete KYC verification before posting ads.'),
        ),
      );
      await Navigator.of(context).push(
        MaterialPageRoute<void>(builder: (_) => const KycVerificationPage()),
      );
      if (!mounted || !kycVerifiedNotifier.value) return;
    }
    final draft = await Navigator.of(context).push<_PostAdDraft>(
      MaterialPageRoute<_PostAdDraft>(builder: (_) => const P2PPostAdPage()),
    );
    if (draft == null) return;
    setState(() {
      _adType = draft.side;
      _adPairController.text = draft.pair;
      _adPriceController.text = draft.price;
      _adLimitsController.text = draft.limits;
      _adAvailableController.text = draft.available;
      _adPaymentController.text = draft.paymentMethods.join(', ');
    });
    _createAd();
  }

  List<String> _marketPaymentFilters() {
    final Set<String> allMethods = {'All Payment Methods'};
    for (final ad in _ads) {
      allMethods.addAll(ad.paymentMethods);
    }
    return allMethods.toList();
  }

  void _openOrderChat(P2POrderItem order) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => P2POrderChatPage(
          seller: order.counterparty,
          pair: order.pair,
          side: order.side,
          orderId: order.id,
          stateLabel: p2pOrderStateLabel(order.orderState),
          paymentDue: order.fiatAmount > 0
              ? order.fiatAmount.toStringAsFixed(2)
              : null,
          expiresAtMs: order.expiresAtMs,
        ),
      ),
    );
  }

  void _openAdChat(P2PAdItem ad, String side) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => P2POrderChatPage(
          seller: ad.seller,
          pair: ad.pair,
          side: side,
          stateLabel: 'PRE ORDER CHAT',
        ),
      ),
    );
  }

  Future<void> _openOrderLifecycle(P2POrderItem order) async {
    final result = await Navigator.of(context).push<P2POrderItem>(
      MaterialPageRoute<P2POrderItem>(
        builder: (_) => P2POrderGeneratedPage(
          order: order,
          api: _api,
          buyerId: _buyerUid,
          onOpenChat: () => _openOrderChat(order),
        ),
      ),
    );
    if (result == null) return;
    _upsertOrder(result);
    _appendAdminLog(
      action: 'order_update',
      target: result.id,
      meta: p2pOrderStateLabel(result.orderState),
    );
  }

  Future<void> _openTradeFlow(P2PAdItem ad, String side) async {
    if (_marketPaused) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('P2P is temporarily paused by admin.')),
      );
      return;
    }
    if (!kycVerifiedNotifier.value) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Complete KYC before creating P2P orders.'),
        ),
      );
      await Navigator.of(context).push(
        MaterialPageRoute<void>(builder: (_) => const KycVerificationPage()),
      );
      if (!mounted) return;
      if (!kycVerifiedNotifier.value) return;
    }
    final normalizedSide = side.toUpperCase();
    final hasActiveSameSide = _orders.any((order) {
      final active =
          order.orderState != P2POrderState.completed &&
          order.orderState != P2POrderState.cancelled;
      return active &&
          order.side.toUpperCase() == normalizedSide &&
          order.buyerWallet == _buyerUid;
    });
    if (hasActiveSameSide) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Only 1 active $normalizedSide order allowed per user.',
          ),
        ),
      );
      return;
    }
    final order = await Navigator.of(context).push<P2POrderItem>(
      MaterialPageRoute<P2POrderItem>(
        builder: (_) => P2POrderCreatePage(
          offer: ad,
          side: normalizedSide,
          fiatCurrency: _marketCurrency,
          api: _api,
          buyerId: _buyerUid,
          generateOrderId: _orderId,
          onOpenChat: () => _openAdChat(ad, side),
        ),
      ),
    );
    if (!mounted) return;
    if (order == null) return;
    _upsertOrder(order);
    setState(() {
      _activeTab = _P2PTab.orders;
      _orderPrimaryTab = 'ONGOING';
      _orderSecondaryTab = 'ALL';
    });
    _appendAdminLog(
      action: 'order_create',
      target: order.id,
      meta: '${order.side} ${order.pair} • $side',
    );
    if (order.fraudFlag) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Fraud risk flag raised. Monitoring enabled for this order.',
          ),
        ),
      );
    }
  }

  Widget _buildProfileSummaryCard(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: kycVerifiedNotifier,
      builder: (context, verified, child) {
        final bool basic = kycBasicVerifiedNotifier.value;
        final String identityLabel = verified
            ? 'Identity Verified'
            : (basic ? 'Basic Verified' : 'Identity Pending');
        final Color identityColor = verified
            ? const Color(0xFF9DFB3B)
            : const Color(0xFFFFAE42);
        final P2PAdItem metricBase = _ads.isNotEmpty
            ? _ads.first
            : kP2PSampleAds.first;
        final String completedOrders = verified
            ? metricBase.completed30d
            : (basic ? '14' : '0');
        final String completionRate = verified
            ? metricBase.completionRate30d
            : (basic ? '92.1%' : '--');
        final String avgReleaseTime = verified
            ? metricBase.avgReleaseTime
            : '--';
        final String avgPaymentTime = verified
            ? metricBase.avgPaymentTime
            : '--';

        return Container(
          padding: const EdgeInsets.all(10.5),
          decoration: BoxDecoration(
            color: const Color(0xFF0F1A2B),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF22304D)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const UserAvatar(radius: 16),
                  const SizedBox(width: 7),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ValueListenableBuilder<String>(
                          valueListenable: nicknameNotifier,
                          builder: (context, nickname, _) {
                            return Text(
                              nickname,
                              style: const TextStyle(
                                fontSize: 12.2,
                                fontWeight: FontWeight.w700,
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 3),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 7,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: identityColor.withValues(alpha: 0.14),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: identityColor.withValues(alpha: 0.45),
                            ),
                          ),
                          child: Text(
                            identityLabel,
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w600,
                              color: identityColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  OutlinedButton(
                    onPressed: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => const DepositPage(),
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(66, 28),
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                    ),
                    child: const Text(
                      'Deposit',
                      style: TextStyle(fontSize: 10.2),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Deposit: 0.00 USDT',
                style: TextStyle(color: Colors.white70, fontSize: 10.4),
              ),
              const SizedBox(height: 7),
              Row(
                children: [
                  Expanded(
                    child: _P2PMetricTile(
                      title: 'Completed Orders (30D)',
                      value: completedOrders,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _P2PMetricTile(
                      title: 'Completion Rate (30D)',
                      value: completionRate,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Expanded(
                    child: _P2PMetricTile(
                      title: 'Average Release Time',
                      value: avgReleaseTime,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _P2PMetricTile(
                      title: 'Average Payment Time',
                      value: avgPaymentTime,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                verified
                    ? 'You can place P2P buy/sell orders now.'
                    : 'KYC verification required before P2P buy orders.',
                style: const TextStyle(color: Colors.white70, fontSize: 10.2),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildP2PMainTab(BuildContext context) {
    final List<P2PAdItem> visibleAds = _visibleAds();
    final String actionLabel = _marketMainTab == 'SELL' ? 'SELL' : 'BUY';
    final List<String> paymentFilters = _marketPaymentFilters();
    const amountFilters = [
      'Any Amount',
      '0 - 5,000',
      '5,000 - 50,000',
      '50,000+',
    ];
    const cryptoFilters = ['USDT', 'BTC', 'ETH'];
    const fiatFilters = ['INR', 'USD'];

    return ListView(
      key: const ValueKey<String>('p2p-main'),
      padding: const EdgeInsets.fromLTRB(8, 12, 8, 14),
      children: [
        Row(
          children: [
            const Text(
              'P2P',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: const [
            Expanded(
              child: Text(
                'BUY / SELL / BLOCK TRADE',
                style: TextStyle(fontSize: 10.4, color: Colors.white54),
              ),
            ),
          ],
        ),
        const SizedBox(height: 5),
        Row(
          children: [
            for (final tab in const ['BUY', 'SELL', 'BLOCK TRADE']) ...[
              Expanded(
                child: InkWell(
                  onTap: () => setState(() => _marketMainTab = tab),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    margin: EdgeInsets.only(
                      right: tab == 'BLOCK TRADE' ? 0 : 6,
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: _marketMainTab == tab
                          ? const Color(0xFF353A43)
                          : const Color(0xFF0E1524),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF1D2A44)),
                    ),
                    child: Text(
                      tab,
                      style: TextStyle(
                        fontSize: tab == 'BLOCK TRADE' ? 10 : 10.8,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
        if (_marketMainTab == 'BLOCK TRADE') ...[
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0C1324),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFF1D2A44)),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Block Trade Desk',
                  style: TextStyle(fontSize: 13.8, fontWeight: FontWeight.w700),
                ),
                SizedBox(height: 5),
                Text(
                  'For large OTC orders, connect with verified desk support. Minimum quote size: 500,000 INR.',
                  style: TextStyle(fontSize: 10.8, color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          FilledButton(
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute<void>(builder: (_) => const SupportBotPage()),
            ),
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFF111B31),
              minimumSize: const Size.fromHeight(42),
            ),
            child: const Text('Request Block Trade Quote'),
          ),
        ] else ...[
          const SizedBox(height: 9),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 7),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
                bottom: BorderSide(color: Colors.white.withValues(alpha: 0.08)),
              ),
            ),
            child: Row(
              children: [
                PopupMenuButton<String>(
                  initialValue: _marketCrypto,
                  onSelected: (value) => setState(() => _marketCrypto = value),
                  itemBuilder: (_) => cryptoFilters
                      .map(
                        (item) => PopupMenuItem<String>(
                          value: item,
                          child: Text(
                            item,
                            style: const TextStyle(fontSize: 10.8),
                          ),
                        ),
                      )
                      .toList(),
                  child: Text(
                    '$_marketCrypto ▾',
                    style: const TextStyle(
                      fontSize: 10.8,
                      color: Colors.white70,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                PopupMenuButton<String>(
                  initialValue: _marketCurrency,
                  onSelected: (value) =>
                      setState(() => _marketCurrency = value),
                  itemBuilder: (_) => fiatFilters
                      .map(
                        (item) => PopupMenuItem<String>(
                          value: item,
                          child: Text(
                            item,
                            style: const TextStyle(fontSize: 10.8),
                          ),
                        ),
                      )
                      .toList(),
                  child: Text(
                    '$_marketCurrency ▾',
                    style: const TextStyle(
                      fontSize: 10.8,
                      color: Colors.white70,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                PopupMenuButton<String>(
                  initialValue: _amountFilter,
                  onSelected: (value) => setState(() => _amountFilter = value),
                  itemBuilder: (_) => amountFilters
                      .map(
                        (item) => PopupMenuItem<String>(
                          value: item,
                          child: Text(
                            item,
                            style: const TextStyle(fontSize: 10.8),
                          ),
                        ),
                      )
                      .toList(),
                  child: const Text(
                    'Amount ▾',
                    style: TextStyle(fontSize: 10.8, color: Colors.white70),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: PopupMenuButton<String>(
                    initialValue: _marketPaymentFilter,
                    tooltip: 'Payment filter',
                    color: const Color(0xFF0F1A2B),
                    onSelected: (value) =>
                        setState(() => _marketPaymentFilter = value),
                    itemBuilder: (_) => paymentFilters
                        .map(
                          (item) => PopupMenuItem<String>(
                            value: item,
                            child: Text(
                              item,
                              style: const TextStyle(fontSize: 10.8),
                            ),
                          ),
                        )
                        .toList(),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        '$_marketPaymentFilter ▾',
                        style: const TextStyle(
                          fontSize: 10.8,
                          color: Colors.white70,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          if (visibleAds.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 10),
              child: Text(
                'No ads in this filter',
                style: TextStyle(fontSize: 10.4, color: Colors.white60),
              ),
            ),
          ...visibleAds.map(
            (ad) => _P2PAdCard(
              ad: ad,
              primaryAction: actionLabel,
              onAction: () => _openTradeFlow(ad, actionLabel),
              showTopPick: ad.topPick,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildOrdersTab() {
    final ongoingOrders = _orders
        .where(
          (order) =>
              order.orderState != P2POrderState.completed &&
              order.orderState != P2POrderState.cancelled,
        )
        .toList();
    final fulfilledOrders = _orders
        .where(
          (order) =>
              order.orderState == P2POrderState.completed ||
              order.orderState == P2POrderState.cancelled,
        )
        .toList();
    final bool showingOngoing = _orderPrimaryTab == 'ONGOING';
    final baseOrders = showingOngoing ? ongoingOrders : fulfilledOrders;
    final statusFilters = showingOngoing
        ? const ['ALL', 'UNPAID', 'PAID', 'APPEAL']
        : const ['ALL', 'COMPLETED', 'CANCELLED'];
    final filteredOrders = baseOrders.where((order) {
      if (_orderSecondaryTab == 'ALL') return true;
      if (_orderSecondaryTab == 'UNPAID') {
        return order.orderState == P2POrderState.created ||
            order.orderState == P2POrderState.awaitingPayment;
      }
      if (_orderSecondaryTab == 'PAID') {
        return order.orderState == P2POrderState.paymentSent ||
            order.orderState == P2POrderState.sellerConfirming;
      }
      if (_orderSecondaryTab == 'APPEAL') {
        return order.orderState == P2POrderState.appealOpened ||
            order.orderState == P2POrderState.underReview;
      }
      if (_orderSecondaryTab == 'COMPLETED') {
        return order.orderState == P2POrderState.completed;
      }
      if (_orderSecondaryTab == 'CANCELLED') {
        return order.orderState == P2POrderState.cancelled;
      }
      return true;
    }).toList();

    return ListView(
      key: const ValueKey<String>('p2p-orders'),
      padding: const EdgeInsets.all(14),
      children: [
        Row(
          children: [
            const Expanded(
              child: Text(
                'Order History',
                style: TextStyle(fontSize: 15.4, fontWeight: FontWeight.w700),
              ),
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.search, size: 20),
              tooltip: 'Search orders',
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.filter_alt_outlined, size: 20),
              tooltip: 'Filter orders',
            ),
          ],
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            _OrderHeaderTab(
              label: 'Ongoing',
              active: showingOngoing,
              onTap: () {
                setState(() {
                  _orderPrimaryTab = 'ONGOING';
                  _orderSecondaryTab = 'ALL';
                });
              },
            ),
            const SizedBox(width: 10),
            _OrderHeaderTab(
              label: 'Fulfilled',
              active: !showingOngoing,
              onTap: () {
                setState(() {
                  _orderPrimaryTab = 'FULFILLED';
                  _orderSecondaryTab = 'ALL';
                });
              },
            ),
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: statusFilters.map((item) {
            final active = _orderSecondaryTab == item;
            return ChoiceChip(
              label: Text(item, style: const TextStyle(fontSize: 10.4)),
              selected: active,
              onSelected: (_) => setState(() => _orderSecondaryTab = item),
            );
          }).toList(),
        ),
        if (!showingOngoing) ...[
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
            decoration: BoxDecoration(
              color: const Color(0xFF101827),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFF24324A)),
            ),
            child: Row(
              children: const [
                Icon(Icons.error_outline, size: 16, color: Colors.white70),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'You have unread messages',
                    style: TextStyle(fontSize: 11.2),
                  ),
                ),
                Icon(Icons.chevron_right, size: 18, color: Colors.white38),
              ],
            ),
          ),
        ],
        const SizedBox(height: 8),
        if (filteredOrders.isEmpty)
          Container(
            margin: const EdgeInsets.only(top: 36),
            child: const Column(
              children: [
                Icon(
                  Icons.find_in_page_outlined,
                  size: 72,
                  color: Colors.white30,
                ),
                SizedBox(height: 10),
                Text(
                  'No orders',
                  style: TextStyle(fontSize: 21, color: Colors.white54),
                ),
              ],
            ),
          ),
        ...filteredOrders.map(
          (order) => _P2POrderCard(
            order: order,
            onChat: () => _openOrderChat(order),
            onTap: () => _openOrderLifecycle(order),
            countdown: _countdownFromMs(order.expiresAtMs),
          ),
        ),
      ],
    );
  }

  Widget _buildAdsTab() {
    final myName = nicknameNotifier.value.trim().toLowerCase();
    final myAds = _ads
        .where((ad) => ad.seller.trim().toLowerCase() == myName)
        .toList();

    return ListView(
      key: const ValueKey<String>('p2p-ads'),
      padding: const EdgeInsets.all(14),
      children: [
        Row(
          children: [
            const Expanded(
              child: Text(
                'My Ads',
                style: TextStyle(fontSize: 15.4, fontWeight: FontWeight.w700),
              ),
            ),
            IconButton(
              onPressed: _openPostAdWizard,
              icon: const Icon(Icons.add, size: 22),
              tooltip: 'Post Ad',
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.history_outlined, size: 21),
              tooltip: 'Ad history',
            ),
          ],
        ),
        const SizedBox(height: 10),
        if (myAds.isEmpty)
          Container(
            padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 14),
            decoration: BoxDecoration(
              color: const Color(0xFF0C1324),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1D2A44)),
            ),
            child: Column(
              children: [
                const Icon(
                  Icons.find_in_page_outlined,
                  size: 74,
                  color: Colors.white30,
                ),
                const SizedBox(height: 10),
                const Text(
                  'You do not have any Ads.',
                  style: TextStyle(fontSize: 20, color: Colors.white54),
                ),
                const SizedBox(height: 14),
                FilledButton(
                  onPressed: _openPostAdWizard,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFFF1CB3E),
                    foregroundColor: Colors.black,
                    minimumSize: const Size(156, 44),
                  ),
                  child: const Text(
                    'Post Ad',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
          ),
        ...myAds.map(
          (ad) => _P2PAdCard(
            ad: ad,
            primaryAction: 'Manage',
            onAction: () {},
            showTopPick: ad.topPick,
          ),
        ),
      ],
    );
  }

  Future<void> _freezeOrderByAdmin(String orderId) async {
    final idx = _orders.indexWhere((order) => order.id == orderId);
    if (idx < 0) return;
    final current = _orders[idx];
    final updated = current.copyWith(
      orderState: P2POrderState.frozen,
      status: p2pOrderStateLabel(P2POrderState.frozen),
      isFrozen: true,
    );
    _upsertOrder(updated);
    _appendAdminLog(
      action: 'freeze_order',
      target: orderId,
      meta: 'Order frozen by admin',
    );
  }

  Future<void> _releaseEscrowByAdmin(String orderId) async {
    final idx = _orders.indexWhere((order) => order.id == orderId);
    if (idx < 0) return;
    try {
      final released = await _api.releaseOrder(
        order: _orders[idx],
        buyerId: _buyerUid,
      );
      _upsertOrder(released);
      _appendAdminLog(
        action: 'release_escrow',
        target: orderId,
        meta: 'Escrow force released to buyer',
      );
    } catch (_) {}
  }

  Future<void> _cancelOrderByAdmin(String orderId) async {
    final idx = _orders.indexWhere((order) => order.id == orderId);
    if (idx < 0) return;
    final cancelled = await _api.cancelOrder(
      order: _orders[idx],
      reason: 'Cancelled by admin override',
    );
    _upsertOrder(cancelled);
    _appendAdminLog(
      action: 'cancel_order',
      target: orderId,
      meta: 'Admin override cancel',
    );
  }

  Future<void> _returnEscrowToSellerByAdmin(String orderId) async {
    final idx = _orders.indexWhere((order) => order.id == orderId);
    if (idx < 0) return;
    final returned = await _api.cancelOrder(
      order: _orders[idx],
      reason: 'Admin resolved dispute: escrow returned to seller',
    );
    _upsertOrder(returned);
    _appendAdminLog(
      action: 'return_escrow',
      target: orderId,
      meta: 'Escrow returned to seller',
    );
  }

  void _banMerchant(String merchant) {
    setState(() {
      _bannedMerchants.add(merchant);
    });
    _appendAdminLog(
      action: 'ban_merchant',
      target: merchant,
      meta: 'Merchant disabled from new offers',
    );
  }

  Future<void> _openAdminPanel() async {
    await Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => P2PAdminPanelPage(
          orders: _orders,
          appeals: _appeals,
          bannedMerchants: _bannedMerchants,
          logs: _adminLogs,
          onFreezeOrder: _freezeOrderByAdmin,
          onReleaseEscrow: _releaseEscrowByAdmin,
          onReturnEscrow: _returnEscrowToSellerByAdmin,
          onCancelOrder: _cancelOrderByAdmin,
          onBanMerchant: _banMerchant,
          onTogglePause: (paused) => setState(() => _marketPaused = paused),
          marketPaused: _marketPaused,
        ),
      ),
    );
    if (!mounted) return;
    setState(() {});
  }

  Widget _buildProfileTab(BuildContext context) {
    return ListView(
      key: const ValueKey<String>('p2p-profile'),
      padding: const EdgeInsets.all(14),
      children: [
        _buildProfileSummaryCard(context),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.all(9),
          decoration: BoxDecoration(
            color: const Color(0xFF0D172A),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: const Color(0xFF1E2A44)),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.shield_outlined,
                size: 16,
                color: Colors.white70,
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  'Security: KYC ${kycVerifiedNotifier.value ? 'Verified' : 'Pending'} • IP Monitoring Active ($_sessionIp)',
                  style: const TextStyle(fontSize: 10.2, color: Colors.white70),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        _P2PProfileNavTile(
          icon: Icons.verified_user_outlined,
          title: 'Identity Verification',
          subtitle: 'Basic + Advanced KYC',
          onTap: () => Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const KycVerificationPage(),
            ),
          ),
        ),
        _P2PProfileNavTile(
          icon: Icons.account_circle_outlined,
          title: 'User Center',
          subtitle: 'Profile, security and preferences',
          onTap: () => Navigator.of(context).push(
            MaterialPageRoute<void>(builder: (_) => const UserCenterPage()),
          ),
        ),
        _P2PProfileNavTile(
          icon: Icons.support_agent_outlined,
          title: 'Customer Support',
          subtitle: 'Connect AI bot or live agent',
          onTap: () => Navigator.of(context).push(
            MaterialPageRoute<void>(builder: (_) => const SupportBotPage()),
          ),
        ),
        _P2PProfileNavTile(
          icon: Icons.admin_panel_settings_outlined,
          title: 'Admin Support Panel',
          subtitle: 'Disputes, escrow release and risk controls',
          onTap: _openAdminPanel,
        ),
      ],
    );
  }

  Widget _buildTabBody(BuildContext context) {
    switch (_activeTab) {
      case _P2PTab.p2p:
        return _buildP2PMainTab(context);
      case _P2PTab.orders:
        return _buildOrdersTab();
      case _P2PTab.ads:
        return _buildAdsTab();
      case _P2PTab.profile:
        return _buildProfileTab(context);
    }
  }

  Widget _bottomNavItem(_P2PTab tab, IconData icon, String label) {
    final bool active = _activeTab == tab;
    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(14),
        onTap: () => setState(() => _activeTab = tab),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 7),
          decoration: BoxDecoration(
            color: active ? const Color(0xFF9DFB3B) : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 17,
                color: active ? Colors.black : Colors.white70,
              ),
              const SizedBox(height: 3),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10.2,
                  fontWeight: FontWeight.w600,
                  color: active ? Colors.black : Colors.white70,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: const Text(
          'P2P',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: _buildTabBody(context),
            ),
          ),
          SafeArea(
            top: false,
            minimum: const EdgeInsets.only(bottom: 8),
            child: Container(
              margin: const EdgeInsets.fromLTRB(12, 0, 12, 30),
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xCC060A15),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFF1D2A46)),
              ),
              child: Row(
                children: [
                  _bottomNavItem(_P2PTab.p2p, Icons.swap_horiz, 'P2P'),
                  _bottomNavItem(
                    _P2PTab.orders,
                    Icons.receipt_long_outlined,
                    'Orders',
                  ),
                  _bottomNavItem(_P2PTab.ads, Icons.campaign_outlined, 'Ads'),
                  _bottomNavItem(
                    _P2PTab.profile,
                    Icons.account_circle_outlined,
                    'Profile',
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _P2PMetricTile extends StatelessWidget {
  const _P2PMetricTile({required this.title, required this.value});

  final String title;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(7),
      decoration: BoxDecoration(
        color: const Color(0xFF0B1323),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFF1E2B46)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(color: Colors.white54, fontSize: 8.8),
          ),
          const SizedBox(height: 3),
          Text(
            value,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

class _OrderHeaderTab extends StatelessWidget {
  const _OrderHeaderTab({
    required this.label,
    required this.active,
    required this.onTap,
  });

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(8),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: active ? FontWeight.w700 : FontWeight.w500,
                color: active ? Colors.white : Colors.white54,
              ),
            ),
            const SizedBox(height: 5),
            Container(
              width: 36,
              height: 3,
              decoration: BoxDecoration(
                color: active ? const Color(0xFFF1CB3E) : Colors.transparent,
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _P2PAdCard extends StatelessWidget {
  const _P2PAdCard({
    required this.ad,
    required this.primaryAction,
    required this.onAction,
    this.showTopPick = false,
  });

  final P2PAdItem ad;
  final String primaryAction;
  final VoidCallback onAction;
  final bool showTopPick;

  @override
  Widget build(BuildContext context) {
    final normalized = primaryAction.toLowerCase();
    final bool isBuyAction = normalized == 'buy';
    final bool isSellAction = normalized == 'sell';
    final Color buttonColor = isBuyAction
        ? const Color(0xFF57C97A)
        : (isSellAction ? const Color(0xFFEB4D5D) : const Color(0xFF23314A));
    final Color cardBorderColor = showTopPick
        ? const Color(0xFFE39A2A)
        : const Color(0xFF1D2A44);
    final String price = ad.price.replaceAll(' INR', '');
    final List<Color> methodColors = const [
      Color(0xFFE39A2A),
      Color(0xFF53D983),
      Color(0xFFEF4E5E),
      Color(0xFF5D8CFF),
    ];
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF0C1324),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: cardBorderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 24,
                height: 24,
                alignment: Alignment.center,
                decoration: const BoxDecoration(
                  color: Color(0xFF2A313F),
                  shape: BoxShape.circle,
                ),
                child: Text(
                  ad.seller.substring(0, 1).toUpperCase(),
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            ad.seller,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 10.2,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        if (ad.verified) ...[
                          const SizedBox(width: 4),
                          const Icon(
                            Icons.verified,
                            size: 12,
                            color: Color(0xFF57A2FF),
                          ),
                        ],
                      ],
                    ),
                    Row(
                      children: [
                        Text(
                          '${ad.completed30d} Orders (${ad.completionRate30d})',
                          style: const TextStyle(
                            fontSize: 9.3,
                            color: Colors.white60,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              if (showTopPick)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF3D2A12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'Top Pick',
                    style: TextStyle(
                      fontSize: 9.1,
                      color: Color(0xFFF9B13F),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            '₹ $price',
            style: const TextStyle(fontSize: 15.6, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 2),
          Text(
            '${ad.badge} • Rank ${ad.reputationScore.toStringAsFixed(1)}',
            style: const TextStyle(fontSize: 9.2, color: Colors.white60),
          ),
          const SizedBox(height: 4),
          Text(
            'Limits  ${ad.limits}',
            style: const TextStyle(color: Colors.white70, fontSize: 9.6),
          ),
          Text(
            'Quantity  ${ad.available}',
            style: const TextStyle(color: Colors.white70, fontSize: 9.6),
          ),
          const SizedBox(height: 6),
          Wrap(
            spacing: 8,
            runSpacing: 5,
            children: List<Widget>.generate(ad.paymentMethods.length, (index) {
              final method = ad.paymentMethods[index];
              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 3,
                    height: 14,
                    decoration: BoxDecoration(
                      color: methodColors[index % methodColors.length],
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    method,
                    style: const TextStyle(
                      fontSize: 9.5,
                      color: Colors.white70,
                    ),
                  ),
                ],
              );
            }),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Text(
                '${ad.timerMinutes}m',
                style: const TextStyle(fontSize: 9.2, color: Colors.white54),
              ),
              const SizedBox(width: 6),
              Text(
                '30D ${ad.avgReleaseTime}',
                style: const TextStyle(fontSize: 9.2, color: Colors.white54),
              ),
              const Spacer(),
              SizedBox(
                width: 92,
                child: FilledButton(
                  onPressed: onAction,
                  style: FilledButton.styleFrom(
                    backgroundColor: buttonColor,
                    foregroundColor: Colors.white,
                    minimumSize: const Size.fromHeight(34),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: Text(
                    primaryAction,
                    style: const TextStyle(
                      fontSize: 10.8,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _P2POrderCard extends StatelessWidget {
  const _P2POrderCard({
    required this.order,
    required this.onChat,
    required this.onTap,
    this.countdown = '--:--',
  });

  final P2POrderItem order;
  final VoidCallback onChat;
  final VoidCallback onTap;
  final String countdown;

  @override
  Widget build(BuildContext context) {
    final statusColor = p2pStateColor(order.orderState);
    final stateLabel = p2pOrderStateLabel(order.orderState);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: const Color(0xFF0C1324),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF1D2A44)),
        ),
        child: Column(
          children: [
            Row(
              children: [
                CoinLogo(url: order.logoUrl, fallback: order.pair, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    '${order.pair} • ${order.side}',
                    style: const TextStyle(
                      fontSize: 12.2,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: onChat,
                  icon: const Icon(
                    Icons.chat_bubble_outline,
                    size: 18,
                    color: Colors.white70,
                  ),
                  tooltip: 'Chat seller',
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.18),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    stateLabel,
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 10.2,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 7),
            Row(
              children: [
                Expanded(
                  child: Text(
                    order.id,
                    style: const TextStyle(
                      fontSize: 10.3,
                      color: Colors.white60,
                    ),
                  ),
                ),
                Flexible(
                  child: Text(
                    order.amount,
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                      fontSize: 10.8,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 2,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Text(
                  'Seller: ${order.counterparty}',
                  style: const TextStyle(fontSize: 10.1, color: Colors.white60),
                ),
                const Spacer(),
                Text(
                  order.paymentMethod,
                  style: const TextStyle(fontSize: 10.1, color: Colors.white60),
                ),
              ],
            ),
            if (order.orderState == P2POrderState.awaitingPayment ||
                order.orderState == P2POrderState.created) ...[
              const SizedBox(height: 3),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Pay within $countdown',
                  style: const TextStyle(
                    fontSize: 9.8,
                    color: Color(0xFFFFAE42),
                  ),
                ),
              ),
            ],
            const SizedBox(height: 3),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                order.createdAt,
                style: const TextStyle(fontSize: 10.1, color: Colors.white60),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

enum _P2PChatMessageType { text, image, system }

class _P2PChatMessage {
  const _P2PChatMessage({
    this.text,
    this.imagePath,
    required this.mine,
    required this.timeLabel,
    this.type = _P2PChatMessageType.text,
  });

  final String? text;
  final String? imagePath;
  final bool mine;
  final String timeLabel;
  final _P2PChatMessageType type;
}

class P2POrderChatPage extends StatefulWidget {
  const P2POrderChatPage({
    super.key,
    required this.seller,
    required this.pair,
    required this.side,
    this.orderId,
    this.stateLabel,
    this.paymentDue,
    this.expiresAtMs,
  });

  final String seller;
  final String pair;
  final String side;
  final String? orderId;
  final String? stateLabel;
  final String? paymentDue;
  final int? expiresAtMs;

  @override
  State<P2POrderChatPage> createState() => _P2POrderChatPageState();
}

class _P2POrderChatPageState extends State<P2POrderChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<_P2PChatMessage> _messages = <_P2PChatMessage>[];
  final P2PApiService _api = P2PApiService();
  bool _requestingAgent = false;
  Timer? _expiryTimer;
  bool _fiveMinuteWarned = false;

  @override
  void initState() {
    super.initState();
    _loadInitialChat();
    _expiryTimer = Timer.periodic(const Duration(seconds: 20), (_) {
      final expiresAt = widget.expiresAtMs;
      if (expiresAt == null || _fiveMinuteWarned || !mounted) return;
      final leftMs = expiresAt - DateTime.now().millisecondsSinceEpoch;
      if (leftMs <= 5 * 60 * 1000 && leftMs > 0) {
        _fiveMinuteWarned = true;
        setState(() {
          _messages.add(
            _P2PChatMessage(
              text:
                  'System: 5 minutes remaining. Complete payment to avoid auto-cancellation.',
              mine: false,
              timeLabel: _timeLabel(DateTime.now()),
              type: _P2PChatMessageType.system,
            ),
          );
        });
        _scrollToBottom();
      }
    });
  }

  @override
  void dispose() {
    _expiryTimer?.cancel();
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  String _timeLabel(DateTime time) {
    final h = time.hour.toString().padLeft(2, '0');
    final m = time.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  Future<void> _loadInitialChat() async {
    final orderId = widget.orderId ?? 'P2P-preview';
    final initial = await _api.getChat(orderId: orderId, seller: widget.seller);
    if (!mounted) return;
    setState(() {
      _messages
        ..clear()
        ..addAll(
          initial.map(
            (item) => _P2PChatMessage(
              text: item['text'],
              mine: false,
              timeLabel: item['time'] ?? _timeLabel(DateTime.now()),
              type: item['type'] == 'system'
                  ? _P2PChatMessageType.system
                  : _P2PChatMessageType.text,
            ),
          ),
        )
        ..add(
          _P2PChatMessage(
            text:
                'Order status: ${widget.stateLabel ?? 'AWAITING PAYMENT'}. Please click paid after transfer.',
            mine: false,
            timeLabel: _timeLabel(DateTime.now()),
            type: _P2PChatMessageType.system,
          ),
        );
    });
  }

  Future<void> _send() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;
    _messageController.clear();
    setState(() {
      _messages.add(
        _P2PChatMessage(
          text: text,
          mine: true,
          timeLabel: _timeLabel(DateTime.now()),
        ),
      );
    });
    await Future<void>.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;
    setState(() {
      _messages.add(
        _P2PChatMessage(
          text: 'Noted. I will verify once payment is visible.',
          mine: false,
          timeLabel: _timeLabel(DateTime.now()),
        ),
      );
    });
    _scrollToBottom();
  }

  Future<void> _sendImageProof() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked == null) return;
    if (!mounted) return;
    setState(() {
      _messages.add(
        _P2PChatMessage(
          imagePath: picked.path,
          mine: true,
          timeLabel: _timeLabel(DateTime.now()),
          type: _P2PChatMessageType.image,
        ),
      );
      _messages.add(
        _P2PChatMessage(
          text: 'Payment proof image shared.',
          mine: false,
          timeLabel: _timeLabel(DateTime.now()),
          type: _P2PChatMessageType.system,
        ),
      );
    });
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scrollController.hasClients) return;
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 220),
        curve: Curves.easeOut,
      );
    });
  }

  Future<void> _escalateSupport() async {
    setState(() => _requestingAgent = true);
    final alert = addSupportAgentAlert(
      'P2P escalation from order ${widget.orderId ?? 'N/A'} with ${widget.seller}',
    );
    await Future<void>.delayed(const Duration(milliseconds: 450));
    if (!mounted) return;
    setState(() {
      _requestingAgent = false;
      _messages.add(
        _P2PChatMessage(
          text:
              'Support ticket #${alert.id} created. Agent will join this chat shortly.',
          mine: false,
          timeLabel: _timeLabel(DateTime.now()),
          type: _P2PChatMessageType.system,
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final heading = widget.orderId == null
        ? '${widget.side} ${widget.pair}'
        : '${widget.orderId} • ${widget.side} ${widget.pair}';
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.seller,
              style: const TextStyle(
                fontSize: 13.2,
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              heading,
              style: const TextStyle(fontSize: 10.2, color: Colors.white60),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: _requestingAgent ? null : _escalateSupport,
            icon: const Icon(Icons.support_agent_outlined, size: 20),
            tooltip: 'Escalate to support',
          ),
        ],
      ),
      body: Column(
        children: [
          if (widget.paymentDue != null)
            Container(
              margin: const EdgeInsets.fromLTRB(10, 10, 10, 4),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF0F1A2A),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF263550)),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.info_outline,
                    size: 16,
                    color: Colors.white70,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'To be paid ₹${widget.paymentDue}. Use secure payment channel only.',
                      style: const TextStyle(
                        fontSize: 10.3,
                        color: Colors.white70,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 18),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                if (msg.type == _P2PChatMessageType.system) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFF121C30),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFF273651)),
                    ),
                    child: Text(
                      msg.text ?? '',
                      style: const TextStyle(
                        fontSize: 10.4,
                        color: Colors.white70,
                      ),
                    ),
                  );
                }
                return Align(
                  alignment: msg.mine
                      ? Alignment.centerRight
                      : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.74,
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: msg.mine
                          ? const Color(0xFF57C97A)
                          : const Color(0xFF111B2F),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: msg.mine
                            ? const Color(0xFF57C97A)
                            : const Color(0xFF263550),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (msg.type == _P2PChatMessageType.image &&
                            msg.imagePath != null)
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.file(
                              File(msg.imagePath!),
                              height: 140,
                              width: 140,
                              fit: BoxFit.cover,
                            ),
                          )
                        else
                          Text(
                            msg.text ?? '',
                            style: TextStyle(
                              fontSize: 10.8,
                              color: msg.mine ? Colors.black : Colors.white,
                            ),
                          ),
                        const SizedBox(height: 3),
                        Text(
                          msg.timeLabel,
                          style: TextStyle(
                            fontSize: 9.2,
                            color: msg.mine
                                ? Colors.black.withValues(alpha: 0.65)
                                : Colors.white54,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          AnimatedPadding(
            duration: const Duration(milliseconds: 120),
            curve: Curves.easeOut,
            padding: EdgeInsets.only(bottom: bottomInset > 0 ? 18 : 14),
            child: SafeArea(
              top: false,
              minimum: const EdgeInsets.fromLTRB(0, 0, 0, 24),
              child: Container(
                margin: const EdgeInsets.fromLTRB(8, 0, 8, 14),
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 10),
                decoration: BoxDecoration(
                  color: const Color(0xFF080D17),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF24324A)),
                ),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: _sendImageProof,
                      icon: const Icon(
                        Icons.image_outlined,
                        color: Colors.white70,
                      ),
                      tooltip: 'Send proof image',
                    ),
                    Expanded(
                      child: TextField(
                        controller: _messageController,
                        style: const TextStyle(fontSize: 11),
                        decoration: const InputDecoration(
                          hintText: 'Type message',
                          isDense: true,
                        ),
                        onSubmitted: (_) => _send(),
                      ),
                    ),
                    const SizedBox(width: 6),
                    FilledButton(
                      onPressed: _send,
                      style: FilledButton.styleFrom(
                        backgroundColor: const Color(0xFF57C97A),
                        foregroundColor: Colors.black,
                        minimumSize: const Size(58, 36),
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                      ),
                      child: const Text(
                        'Send',
                        style: TextStyle(
                          fontSize: 10.8,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class P2POrderCreatePage extends StatefulWidget {
  const P2POrderCreatePage({
    super.key,
    required this.offer,
    required this.side,
    required this.fiatCurrency,
    required this.api,
    required this.buyerId,
    required this.generateOrderId,
    required this.onOpenChat,
  });

  final P2PAdItem offer;
  final String side;
  final String fiatCurrency;
  final P2PApiService api;
  final String buyerId;
  final String Function() generateOrderId;
  final VoidCallback onOpenChat;

  @override
  State<P2POrderCreatePage> createState() => _P2POrderCreatePageState();
}

class _P2POrderCreatePageState extends State<P2POrderCreatePage> {
  late final TextEditingController _amountController;
  late String _paymentMethod;
  bool _fiatInput = true;
  bool _creating = false;

  @override
  void initState() {
    super.initState();
    final min = widget.offer.limitRange.first;
    _amountController = TextEditingController(
      text: min <= 0 ? '500' : min.toStringAsFixed(0),
    );
    _paymentMethod = widget.offer.paymentMethods.first;
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  double get _entered => _parseNumericValue(_amountController.text);
  double get _price =>
      widget.offer.priceValue <= 0 ? 1 : widget.offer.priceValue;

  double get _fiatAmount => _fiatInput ? _entered : _entered * _price;
  double get _usdtAmount => _fiatInput ? _entered / _price : _entered;

  bool get _isAmountValid {
    final range = widget.offer.limitRange;
    if (_fiatAmount <= 0) return false;
    return _fiatAmount >= range.first && _fiatAmount <= range.last;
  }

  Future<void> _createOrder() async {
    if (!_isAmountValid) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Amount must be between ₹${widget.offer.limitRange.first.toStringAsFixed(0)} and ₹${widget.offer.limitRange.last.toStringAsFixed(0)}',
          ),
        ),
      );
      return;
    }
    setState(() => _creating = true);
    try {
      final order = await widget.api.createOrder(
        ad: widget.offer,
        buyerId: widget.buyerId,
        side: widget.side,
        fiatAmount: _fiatAmount,
        fiatCurrency: widget.fiatCurrency,
        paymentMethod: _paymentMethod,
        orderId: widget.generateOrderId(),
        now: DateTime.now(),
      );
      if (!mounted) return;
      final finalOrder = await Navigator.of(context).push<P2POrderItem>(
        MaterialPageRoute<P2POrderItem>(
          builder: (_) => P2POrderGeneratedPage(
            order: order,
            api: widget.api,
            buyerId: widget.buyerId,
            onOpenChat: widget.onOpenChat,
          ),
        ),
      );
      if (!mounted) return;
      Navigator.of(context).pop(finalOrder ?? order);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Unable to create order: $e')));
    } finally {
      if (mounted) setState(() => _creating = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final sideLabel = widget.side.toUpperCase() == 'BUY'
        ? 'Buy USDT'
        : 'Sell USDT';
    final buttonLabel = widget.side.toUpperCase() == 'BUY'
        ? 'BUY USDT WITH 0 FEES'
        : 'SELL USDT WITH 0 FEES';
    final sideColor = widget.side.toUpperCase() == 'BUY'
        ? const Color(0xFF53D983)
        : const Color(0xFFEF4E5E);
    final range = widget.offer.limitRange;
    return Scaffold(
      appBar: AppBar(title: Text(sideLabel)),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          Row(
            children: [
              ChoiceChip(
                label: const Text('Crypto'),
                selected: !_fiatInput,
                onSelected: (_) => setState(() => _fiatInput = false),
              ),
              const SizedBox(width: 6),
              ChoiceChip(
                label: const Text('Fiat'),
                selected: _fiatInput,
                onSelected: (_) => setState(() => _fiatInput = true),
              ),
              const Spacer(),
              Text(
                'Price ₹${_price.toStringAsFixed(2)}',
                style: const TextStyle(fontSize: 12.2, color: Colors.white70),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF101827),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1D2A44)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  controller: _amountController,
                  keyboardType: const TextInputType.numberWithOptions(
                    decimal: true,
                  ),
                  decoration: InputDecoration(
                    hintText: _fiatInput ? '500' : '5.09',
                    suffix: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(_fiatInput ? widget.fiatCurrency : 'USDT'),
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () {
                            final maxValue = _fiatInput
                                ? range.last
                                : range.last / _price;
                            _amountController.text = maxValue.toStringAsFixed(
                              _fiatInput ? 0 : 4,
                            );
                            setState(() {});
                          },
                          child: const Text(
                            'Max',
                            style: TextStyle(
                              color: Color(0xFF1BB6D1),
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 6),
                Text(
                  'Limit ₹${range.first.toStringAsFixed(0)} - ₹${range.last.toStringAsFixed(0)}',
                  style: const TextStyle(fontSize: 10.3, color: Colors.white60),
                ),
                const SizedBox(height: 4),
                Text(
                  '≈ ${_usdtAmount.toStringAsFixed(4)} USDT',
                  style: const TextStyle(fontSize: 12.2, color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          DropdownButtonFormField<String>(
            initialValue: _paymentMethod,
            decoration: const InputDecoration(labelText: 'Payment Method'),
            items: widget.offer.paymentMethods
                .map(
                  (method) => DropdownMenuItem<String>(
                    value: method,
                    child: Text(method),
                  ),
                )
                .toList(),
            onChanged: (value) {
              if (value == null) return;
              setState(() => _paymentMethod = value);
            },
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1E2A44)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Order Summary',
                  style: TextStyle(fontSize: 12.3, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 6),
                _summaryRow('Price', '₹${_price.toStringAsFixed(2)}'),
                _summaryRow(
                  'Amount',
                  '₹${_fiatAmount.toStringAsFixed(2)} ${widget.fiatCurrency}',
                ),
                _summaryRow(
                  'Quantity',
                  '${_usdtAmount.toStringAsFixed(4)} USDT',
                ),
                _summaryRow('Fee', '0 USDT'),
                _summaryRow('Payment', _paymentMethod),
                const Divider(height: 16, color: Color(0xFF24324A)),
                Row(
                  children: [
                    const CircleAvatar(radius: 12, child: Text('J')),
                    const SizedBox(width: 7),
                    Expanded(
                      child: Text(
                        '${widget.offer.seller} ${widget.offer.verified ? '• Verified' : ''}',
                        style: const TextStyle(
                          fontSize: 11.2,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: widget.onOpenChat,
                      icon: const Icon(Icons.arrow_forward, size: 18),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                _summaryRow(
                  'Pay within',
                  '${widget.offer.timerMinutes > 0 ? widget.offer.timerMinutes : 10} minute(s)',
                ),
                _summaryRow(
                  'Historical orders',
                  '${widget.offer.completed30d} • ${widget.offer.completionRate30d}',
                ),
                _summaryRow('30D avg release', widget.offer.avgReleaseTime),
                _summaryRow('Avg payment time', widget.offer.avgPaymentTime),
              ],
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'Notes',
            style: TextStyle(fontSize: 12.2, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 6),
          const Text(
            '* Do not include crypto terms in payment remarks.\n* Complete payment within timer to avoid auto cancellation.\n* Use in-app chat for all communication.',
            style: TextStyle(fontSize: 10.3, color: Colors.white70),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _creating ? null : _createOrder,
            style: FilledButton.styleFrom(
              backgroundColor: sideColor,
              foregroundColor: Colors.black,
              minimumSize: const Size.fromHeight(48),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text(
              _creating ? 'Creating...' : buttonLabel,
              style: const TextStyle(
                fontSize: 12.6,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 10.4, color: Colors.white60),
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 11.2, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

class P2POrderGeneratedPage extends StatefulWidget {
  const P2POrderGeneratedPage({
    super.key,
    required this.order,
    required this.api,
    required this.buyerId,
    required this.onOpenChat,
  });

  final P2POrderItem order;
  final P2PApiService api;
  final String buyerId;
  final VoidCallback onOpenChat;

  @override
  State<P2POrderGeneratedPage> createState() => _P2POrderGeneratedPageState();
}

class _P2POrderGeneratedPageState extends State<P2POrderGeneratedPage> {
  late P2POrderItem _order;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _order = widget.order;
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String _countdown() {
    final left = _order.expiresAtMs - DateTime.now().millisecondsSinceEpoch;
    if (left <= 0) return '00:00';
    final min = (left ~/ 60000).toString().padLeft(2, '0');
    final sec = ((left % 60000) ~/ 1000).toString().padLeft(2, '0');
    return '$min:$sec';
  }

  Future<void> _openPayment() async {
    final updated = await Navigator.of(context).push<P2POrderItem>(
      MaterialPageRoute<P2POrderItem>(
        builder: (_) => P2PPaymentPage(
          order: _order,
          api: widget.api,
          buyerId: widget.buyerId,
          onOpenChat: widget.onOpenChat,
        ),
      ),
    );
    if (updated == null) return;
    setState(() => _order = updated);
  }

  Future<void> _cancelOrder() async {
    final reason = await Navigator.of(context).push<String>(
      MaterialPageRoute<String>(builder: (_) => const P2PCancelReasonPage()),
    );
    if (reason == null || reason.isEmpty) return;
    try {
      final updated = await widget.api.cancelOrder(
        order: _order,
        reason: reason,
      );
      if (!mounted) return;
      setState(() => _order = updated);
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Order cancelled')));
      Navigator.of(context).pop(_order);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Cancel failed: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => Navigator.of(context).pop(_order),
          icon: const Icon(Icons.arrow_back),
        ),
        title: const Text('Order Generated'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          const Text(
            'The order has been generated. Proceed to payment.',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 6),
          Text(
            'Please pay within ${_countdown()}',
            style: const TextStyle(fontSize: 12.6, color: Color(0xFF22BCD5)),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFF24324A)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const CircleAvatar(radius: 12, child: Text('J')),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _order.counterparty,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: widget.onOpenChat,
                      icon: const Icon(Icons.forum_outlined, size: 19),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                const Text(
                  '* The cryptocurrency is held in system escrow.\n* Complete payment in timer and click paid.',
                  style: TextStyle(fontSize: 10.4, color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0B1323),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1E2B46)),
            ),
            child: Column(
              children: [
                _orderDetailRow(
                  'Trading amount',
                  '₹${_order.fiatAmount.toStringAsFixed(2)}',
                ),
                _orderDetailRow(
                  'Price',
                  '₹${_order.pricePerUsdt.toStringAsFixed(2)}',
                ),
                _orderDetailRow(
                  'Quantity',
                  '${_order.usdtAmount.toStringAsFixed(4)} USDT',
                ),
                _orderDetailRow(
                  'Fee',
                  '${_order.feeUsdt.toStringAsFixed(2)} USDT',
                ),
                _orderDetailRow('Payment method', _order.paymentMethod),
                const Divider(height: 16, color: Color(0xFF24324A)),
                _orderDetailRow('Order No', _order.id),
                _orderDetailRow(
                  'Order time',
                  DateTime.fromMillisecondsSinceEpoch(
                    _order.createdAtMs,
                  ).toIso8601String().replaceFirst('T', ' ').substring(0, 19),
                ),
                _orderDetailRow(
                  'Status',
                  p2pOrderStateLabel(_order.orderState),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _openPayment,
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFFE7EDF8),
              foregroundColor: Colors.black,
              minimumSize: const Size.fromHeight(50),
            ),
            child: const Text('Next →', style: TextStyle(fontSize: 13.5)),
          ),
          TextButton(
            onPressed: _cancelOrder,
            child: const Text(
              'Cancel',
              style: TextStyle(fontSize: 13.2, color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }

  Widget _orderDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 7),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 11, color: Colors.white60),
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

class P2PPaymentPage extends StatefulWidget {
  const P2PPaymentPage({
    super.key,
    required this.order,
    required this.api,
    required this.buyerId,
    required this.onOpenChat,
  });

  final P2POrderItem order;
  final P2PApiService api;
  final String buyerId;
  final VoidCallback onOpenChat;

  @override
  State<P2PPaymentPage> createState() => _P2PPaymentPageState();
}

class _P2PPaymentPageState extends State<P2PPaymentPage> {
  late P2POrderItem _order;
  bool _payClicked = false;
  bool _processing = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _order = widget.order.orderState == P2POrderState.created
        ? widget.order.copyWith(
            orderState: P2POrderState.awaitingPayment,
            status: p2pOrderStateLabel(P2POrderState.awaitingPayment),
          )
        : widget.order;
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  String _countdown() {
    final left = _order.expiresAtMs - DateTime.now().millisecondsSinceEpoch;
    if (left <= 0) return '00:00';
    final min = (left ~/ 60000).toString().padLeft(2, '0');
    final sec = ((left % 60000) ~/ 1000).toString().padLeft(2, '0');
    return '$min:$sec';
  }

  Future<void> _uploadProof() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked == null) return;
    setState(() {
      _order = _order.copyWith(paymentProofPath: picked.path);
    });
  }

  Future<void> _confirmPaid() async {
    if (_processing) return;
    if (_order.orderState == P2POrderState.completed) return;
    final canConfirm =
        _order.orderState == P2POrderState.created ||
        _order.orderState == P2POrderState.awaitingPayment;
    if (!canConfirm) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Payment already submitted')),
      );
      return;
    }
    if (!_payClicked) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Tap PAY button before confirming')),
      );
      return;
    }
    if (_order.paymentProofPath == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Upload payment proof screenshot first')),
      );
      return;
    }
    setState(() => _processing = true);
    try {
      var next = await widget.api.markPaid(
        order: _order,
        paymentProofPath: _order.paymentProofPath,
      );
      if (!mounted) return;
      setState(() => _order = next);
      await Future<void>.delayed(const Duration(seconds: 1));
      next = await widget.api.markSellerConfirming(next);
      if (!mounted) return;
      setState(() => _order = next);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Payment sent. Waiting for seller confirmation.'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Payment flow error: $e')));
    } finally {
      if (mounted) setState(() => _processing = false);
    }
  }

  Future<void> _cancelOrder() async {
    final canCancel =
        _order.orderState == P2POrderState.created ||
        _order.orderState == P2POrderState.awaitingPayment;
    if (!canCancel) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Cancel is allowed only before payment is sent'),
        ),
      );
      return;
    }
    final reason = await Navigator.of(context).push<String>(
      MaterialPageRoute<String>(builder: (_) => const P2PCancelReasonPage()),
    );
    if (reason == null || reason.isEmpty) return;
    try {
      final cancelled = await widget.api.cancelOrder(
        order: _order,
        reason: reason,
      );
      if (!mounted) return;
      setState(() => _order = cancelled);
      Navigator.of(context).pop(_order);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Cancel failed: $e')));
    }
  }

  Future<void> _raiseDispute() async {
    final canAppeal =
        _order.orderState == P2POrderState.paymentSent ||
        _order.orderState == P2POrderState.sellerConfirming;
    if (!canAppeal) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Appeal can be opened after payment is marked sent'),
        ),
      );
      return;
    }
    if (_order.paymentProofPath == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Upload payment proof before appeal')),
      );
      return;
    }
    const reasons = [
      'Seller not releasing crypto',
      'Payment completed but no response',
      'Seller offline',
      'Payment details incorrect',
      'Other issue',
    ];
    final reason = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: const Color(0xFF0C1324),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: reasons
              .map(
                (item) => ListTile(
                  title: Text(item, style: const TextStyle(fontSize: 11.3)),
                  onTap: () => Navigator.of(context).pop(item),
                ),
              )
              .toList(),
        ),
      ),
    );
    if (reason == null) return;
    try {
      final disputed = await widget.api.raiseDispute(
        order: _order,
        reason: reason,
        paymentProofPath: _order.paymentProofPath!,
      );
      if (!mounted) return;
      setState(() => _order = disputed);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Appeal opened. Support team moved order to review.'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Appeal failed: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final completed = _order.orderState == P2POrderState.completed;
    final canConfirm =
        _order.orderState == P2POrderState.created ||
        _order.orderState == P2POrderState.awaitingPayment;
    final canCancel =
        _order.orderState == P2POrderState.created ||
        _order.orderState == P2POrderState.awaitingPayment;
    final canOpenAppeal =
        _order.orderState == P2POrderState.paymentSent ||
        _order.orderState == P2POrderState.sellerConfirming;
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          onPressed: () => Navigator.of(context).pop(_order),
          icon: const Icon(Icons.arrow_back),
        ),
        title: Text(_order.counterparty),
        actions: [
          IconButton(
            onPressed: widget.onOpenChat,
            icon: const Icon(Icons.forum_outlined),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF1E1A12),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF473D2C)),
            ),
            child: const Text(
              'Remember to click paid after transferring funds. Use only verified payment rails.',
              style: TextStyle(fontSize: 10.8, color: Colors.white70),
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF1E2B46)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'To be paid ₹${_order.fiatAmount.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Please pay within ${_countdown()}',
                        style: const TextStyle(
                          fontSize: 11.2,
                          color: Color(0xFF22BCD5),
                        ),
                      ),
                    ],
                  ),
                ),
                FilledButton(
                  onPressed: completed
                      ? null
                      : () => setState(() => _payClicked = true),
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('PAY'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: _uploadProof,
                  icon: const Icon(Icons.image_outlined, size: 16),
                  label: const Text('Upload Proof'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: widget.onOpenChat,
                  icon: const Icon(Icons.chat_bubble_outline, size: 16),
                  label: const Text('Chat'),
                ),
              ),
            ],
          ),
          if (_order.paymentProofPath != null) ...[
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.file(
                File(_order.paymentProofPath!),
                height: 180,
                fit: BoxFit.cover,
              ),
            ),
          ],
          const SizedBox(height: 10),
          _statusLine('Order', p2pOrderStateLabel(_order.orderState)),
          _statusLine('Payment method', _order.paymentMethod),
          _statusLine('Fee', '${_order.feeUsdt.toStringAsFixed(2)} USDT'),
          const SizedBox(height: 14),
          FilledButton(
            onPressed: completed
                ? null
                : _processing
                ? null
                : (canConfirm ? _confirmPaid : null),
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFF53D983),
              foregroundColor: Colors.black,
              minimumSize: const Size.fromHeight(47),
            ),
            child: Text(
              completed
                  ? 'COMPLETED'
                  : (canOpenAppeal
                        ? 'PAYMENT SENT'
                        : (_order.orderState == P2POrderState.underReview ||
                                  _order.orderState ==
                                      P2POrderState.appealOpened
                              ? 'UNDER REVIEW'
                              : (_processing
                                    ? 'Processing...'
                                    : 'I HAVE PAID'))),
              style: const TextStyle(
                fontSize: 12.4,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(height: 7),
          Row(
            children: [
              Expanded(
                child: FilledButton(
                  onPressed: completed || !canOpenAppeal ? null : _raiseDispute,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFFFFAE42),
                    foregroundColor: Colors.black,
                  ),
                  child: const Text(
                    'OPEN APPEAL',
                    style: TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextButton(
                  onPressed: completed || !canCancel ? null : _cancelOrder,
                  child: const Text('Cancel Order'),
                ),
              ),
            ],
          ),
          if (completed)
            FilledButton(
              onPressed: () => Navigator.of(context).pop(_order),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF111B31),
                minimumSize: const Size.fromHeight(44),
              ),
              child: const Text('Back to Orders'),
            ),
        ],
      ),
    );
  }

  Widget _statusLine(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 10.8, color: Colors.white60),
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 11.2, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

class P2PCancelReasonPage extends StatefulWidget {
  const P2PCancelReasonPage({super.key});

  @override
  State<P2PCancelReasonPage> createState() => _P2PCancelReasonPageState();
}

class _P2PCancelReasonPageState extends State<P2PCancelReasonPage> {
  static const reasons = [
    "I don't want to proceed with this order.",
    "Seller requirements issue",
    "I don't know how to make the payment.",
    'I agreed with seller to cancel the order',
    'I could not reach the seller',
    "The seller's payment details are incorrect.",
    'The seller was rude or unprofessional.',
    'Suspected scam',
    'Other',
  ];
  String? _selected;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cancel Order')),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(14),
              children: [
                const Text(
                  'Please select a reason for cancellation',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Order cancellation tips',
                  style: TextStyle(fontSize: 12, color: Color(0xFF18BDD6)),
                ),
                const SizedBox(height: 10),
                ...reasons.map(
                  (reason) => InkWell(
                    onTap: () => setState(() => _selected = reason),
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        children: [
                          Icon(
                            _selected == reason
                                ? Icons.radio_button_checked
                                : Icons.radio_button_off,
                            size: 18,
                            color: _selected == reason
                                ? const Color(0xFF18BDD6)
                                : Colors.white54,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              reason,
                              style: const TextStyle(fontSize: 13.6),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          SafeArea(
            top: false,
            minimum: const EdgeInsets.fromLTRB(14, 8, 14, 34),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  "I have not paid the seller / I have received seller's refund",
                  style: TextStyle(fontSize: 11.6, color: Colors.white60),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _selected != null
                        ? () => Navigator.of(context).pop(_selected)
                        : null,
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFFCAD0DA),
                      foregroundColor: Colors.black54,
                      minimumSize: const Size.fromHeight(46),
                    ),
                    child: const Text(
                      'Confirm',
                      style: TextStyle(fontSize: 14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class P2PAdminPanelPage extends StatefulWidget {
  const P2PAdminPanelPage({
    super.key,
    required this.orders,
    required this.appeals,
    required this.bannedMerchants,
    required this.logs,
    required this.onFreezeOrder,
    required this.onReleaseEscrow,
    required this.onReturnEscrow,
    required this.onCancelOrder,
    required this.onBanMerchant,
    required this.onTogglePause,
    required this.marketPaused,
  });

  final List<P2POrderItem> orders;
  final List<P2PAppealTicket> appeals;
  final Set<String> bannedMerchants;
  final List<P2PAdminLog> logs;
  final Future<void> Function(String orderId) onFreezeOrder;
  final Future<void> Function(String orderId) onReleaseEscrow;
  final Future<void> Function(String orderId) onReturnEscrow;
  final Future<void> Function(String orderId) onCancelOrder;
  final void Function(String merchant) onBanMerchant;
  final ValueChanged<bool> onTogglePause;
  final bool marketPaused;

  @override
  State<P2PAdminPanelPage> createState() => _P2PAdminPanelPageState();
}

class _P2PAdminPanelPageState extends State<P2PAdminPanelPage> {
  late bool _paused;

  @override
  void initState() {
    super.initState();
    _paused = widget.marketPaused;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('P2P Admin Panel')),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          SwitchListTile(
            value: _paused,
            onChanged: (value) {
              setState(() => _paused = value);
              widget.onTogglePause(value);
            },
            title: const Text('Emergency P2P Pause'),
            subtitle: const Text('Stops new order creation'),
          ),
          const SizedBox(height: 8),
          const Text(
            'Appeal Queue',
            style: TextStyle(fontSize: 12.8, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          if (widget.appeals.isEmpty)
            const Text(
              'No active appeals',
              style: TextStyle(fontSize: 10.6, color: Colors.white60),
            ),
          ...widget.appeals.take(20).map((appeal) {
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF0D172A),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF22324F)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          '${appeal.orderId} • ${appeal.status}',
                          style: const TextStyle(
                            fontSize: 11.4,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      Text(
                        '${appeal.createdAt.hour.toString().padLeft(2, '0')}:${appeal.createdAt.minute.toString().padLeft(2, '0')}',
                        style: const TextStyle(
                          fontSize: 10,
                          color: Colors.white60,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 5),
                  Text(
                    'Buyer: ${appeal.buyer} • Seller: ${appeal.seller}',
                    style: const TextStyle(
                      fontSize: 10.3,
                      color: Colors.white70,
                    ),
                  ),
                  Text(
                    'Amount: ${appeal.amount}',
                    style: const TextStyle(
                      fontSize: 10.3,
                      color: Colors.white70,
                    ),
                  ),
                  Text(
                    'Reason: ${appeal.appealReason}',
                    style: const TextStyle(
                      fontSize: 10.3,
                      color: Colors.white70,
                    ),
                  ),
                  Text(
                    'Chat: ${appeal.chatSummary}',
                    style: const TextStyle(
                      fontSize: 10.3,
                      color: Colors.white70,
                    ),
                  ),
                  if (appeal.paymentProofPath.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.file(
                        File(appeal.paymentProofPath),
                        height: 96,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorBuilder: (_, error, stackTrace) => Container(
                          height: 64,
                          alignment: Alignment.centerLeft,
                          color: const Color(0xFF131D31),
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          child: Text(
                            'Proof path: ${appeal.paymentProofPath}',
                            style: const TextStyle(
                              fontSize: 10,
                              color: Colors.white60,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      OutlinedButton(
                        onPressed: () async {
                          await widget.onReleaseEscrow(appeal.orderId);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Release To Buyer'),
                      ),
                      OutlinedButton(
                        onPressed: () async {
                          await widget.onReturnEscrow(appeal.orderId);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Return To Seller'),
                      ),
                      OutlinedButton(
                        onPressed: () async {
                          await widget.onFreezeOrder(appeal.orderId);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Freeze Order'),
                      ),
                      OutlinedButton(
                        onPressed: () {
                          widget.onBanMerchant(appeal.seller);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Ban User'),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 8),
          const Text(
            'Admin Actions',
            style: TextStyle(fontSize: 12.8, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          ...widget.orders.take(12).map((order) {
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF0C1324),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF1D2A44)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${order.id} • ${order.counterparty}',
                    style: const TextStyle(
                      fontSize: 11.7,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${order.side} ${order.pair} • ${p2pOrderStateLabel(order.orderState)}',
                    style: const TextStyle(
                      fontSize: 10.4,
                      color: Colors.white70,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      OutlinedButton(
                        onPressed: () async {
                          await widget.onFreezeOrder(order.id);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Freeze'),
                      ),
                      OutlinedButton(
                        onPressed: () async {
                          await widget.onReleaseEscrow(order.id);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Release Crypto'),
                      ),
                      OutlinedButton(
                        onPressed: () async {
                          await widget.onReturnEscrow(order.id);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Return Crypto'),
                      ),
                      OutlinedButton(
                        onPressed: () async {
                          await widget.onCancelOrder(order.id);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Cancel Order'),
                      ),
                      OutlinedButton(
                        onPressed: () {
                          widget.onBanMerchant(order.counterparty);
                          if (mounted) setState(() {});
                        },
                        child: const Text('Ban Merchant'),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }),
          const SizedBox(height: 8),
          const Text(
            'Banned Merchants',
            style: TextStyle(fontSize: 12.8, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 6),
          if (widget.bannedMerchants.isEmpty)
            const Text('No banned merchants', style: TextStyle(fontSize: 10.4)),
          ...widget.bannedMerchants.map(
            (merchant) =>
                Text('• $merchant', style: const TextStyle(fontSize: 10.6)),
          ),
          const SizedBox(height: 10),
          const Text(
            'Transaction Logs',
            style: TextStyle(fontSize: 12.8, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 6),
          if (widget.logs.isEmpty)
            const Text('No activity yet', style: TextStyle(fontSize: 10.4)),
          ...widget.logs.take(20).map((log) {
            final t =
                '${log.time.hour.toString().padLeft(2, '0')}:${log.time.minute.toString().padLeft(2, '0')}';
            return Container(
              margin: const EdgeInsets.only(bottom: 6),
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF0E1728),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF1E2B46)),
              ),
              child: Text(
                '[$t] ${log.action} • ${log.target} • ${log.meta}',
                style: const TextStyle(fontSize: 10.2, color: Colors.white70),
              ),
            );
          }),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFF0D172A),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFF22324F)),
            ),
            child: const Text(
              'API Endpoints: GET /p2p/offers, POST /p2p/order/create, POST /p2p/order/pay, POST /p2p/order/release, POST /p2p/order/cancel, POST /p2p/appeal, GET /p2p/chat, GET /p2p/disputes',
              style: TextStyle(fontSize: 10.1, color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }
}

class _P2PProfileNavTile extends StatelessWidget {
  const _P2PProfileNavTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: const Color(0xFF0C1324),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF1D2A44)),
        ),
        child: Row(
          children: [
            Icon(icon, size: 18, color: Colors.white70),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 11.8,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 10.1,
                      color: Colors.white54,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, size: 18, color: Colors.white54),
          ],
        ),
      ),
    );
  }
}
