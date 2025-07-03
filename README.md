# expo-wallet

A comprehensive Expo module for creating and managing digital passes and identity documents in iOS and Android wallets. Supports Apple PassKit (PKPass, PKSecureElementPass, PKStoredValuePass, PKIdentityDocument, PKShareablePass) and Google Wallet API integration.

## Platform Support

| Feature | iOS | Android |
|---------|-----|---------|
| PKPass | ✅ | ❌ |
| PKSecureElementPass | ✅ (iOS 13.0+) | ❌ |
| PKStoredValuePass | ✅ (iOS 14.0+) | ❌ |
| PKIdentityDocument | ✅ (iOS 15.0+) | ❌ |
| PKShareablePass | ✅ (iOS 16.0+) | ❌ |
| Google Wallet | ❌ | ✅ |
| NFC & SE Platform | ✅ (iOS 18.1+) | 🚧 |

## Installation

```bash
npx expo install expo-wallet
```

## Configuration

### iOS Setup

1. Add PassKit framework to your iOS project
2. Configure pass type identifiers in Apple Developer Console
3. Add PassKit entitlement to your app:

```xml
<!-- ios/YourApp/YourApp.entitlements -->
<key>com.apple.developer.pass-type-identifiers</key>
<array>
    <string>pass.com.yourcompany.yourpasstype</string>
</array>
```

4. For PKIdentityDocument and PKShareablePass, additional entitlements may be required.

### Android Setup

1. Set up Google Cloud Console project
2. Enable Google Wallet API
3. Create service account and download credentials
4. Configure issuer account in Google Pay & Wallet Console

## API Reference

### Core Functions

#### `isWalletAvailable(): Promise<WalletAvailability>`

Check if wallet functionality is available on the device.

```typescript
const availability = await ExpoWallet.isWalletAvailable();
console.log(availability.isAvailable); // true/false
console.log(availability.platform); // 'ios' or 'android'
console.log(availability.supportedPassTypes); // Array of supported pass types
```

#### `canAddPasses(): Promise<boolean>`

Check if the device can add passes to the wallet.

### PKPass (iOS Traditional Passes)

Create traditional Apple Wallet passes for boarding passes, event tickets, coupons, store cards, and generic passes.

```typescript
import { PKPassData } from 'expo-wallet';

const passData: PKPassData = {
  passTypeIdentifier: 'pass.com.example.eventticket',
  serialNumber: 'ET123456789',
  teamIdentifier: 'ABC123',
  organizationName: 'Example Events',
  description: 'Concert Ticket',
  logoText: 'EVENTS',
  backgroundColor: '#1E3A8A',
  foregroundColor: '#FFFFFF',
  passStyle: 'eventTicket',
  primaryFields: [
    {
      key: 'event',
      label: 'Event',
      value: 'Rock Concert 2024'
    }
  ],
  secondaryFields: [
    {
      key: 'date',
      label: 'Date',
      value: 'March 15, 2024'
    }
  ],
  barcodes: [
    {
      format: 'PKBarcodeFormatQR',
      message: 'ET123456789',
      messageEncoding: 'iso-8859-1'
    }
  ]
};

const result = await ExpoWallet.addPKPass(passData);
```

### PKSecureElementPass (iOS Secure Payment/Transit Cards)

Create secure payment cards and transit passes that use the device's Secure Element.

```typescript
import { PKSecureElementPassData } from 'expo-wallet';

const passData: PKSecureElementPassData = {
  passTypeIdentifier: 'pass.com.example.transitcard',
  serialNumber: 'TC123456789',
  teamIdentifier: 'ABC123',
  organizationName: 'Metro Transit',
  description: 'Metro Transit Card',
  devicePaymentApplications: [
    {
      paymentApplicationIdentifier: 'transit.metro.app'
    }
  ],
  primaryAccountIdentifier: 'account_123',
  primaryAccountNumberSuffix: '1234'
};

const result = await ExpoWallet.addPKSecureElementPass(passData);
```

### PKStoredValuePass (iOS Gift/Prepaid Cards)

Create gift cards and prepaid cards with stored monetary value.

```typescript
import { PKStoredValuePassData } from 'expo-wallet';

const passData: PKStoredValuePassData = {
  passTypeIdentifier: 'pass.com.example.giftcard',
  serialNumber: 'GC123456789',
  teamIdentifier: 'ABC123',
  organizationName: 'Example Store',
  description: 'Gift Card',
  balance: 50.00,
  currencyCode: 'USD',
  balanceUpdateDate: new Date().toISOString()
};

const result = await ExpoWallet.addPKStoredValuePass(passData);

// Update balance
await ExpoWallet.updateStoredValueBalance('GC123456789', 25.00);
```

### PKIdentityDocument (iOS Driver's License/State ID)

Create digital identity documents like driver's licenses and state IDs.

⚠️ **Note**: PKIdentityDocument requires special entitlements and is not available for general use. Contact Apple for more information.

```typescript
import { PKIdentityDocumentData } from 'expo-wallet';

const passData: PKIdentityDocumentData = {
  passTypeIdentifier: 'pass.com.state.driverslicense',
  serialNumber: 'DL123456789',
  teamIdentifier: 'ABC123',
  organizationName: 'State of California',
  description: 'California Driver\'s License',
  documentType: 'drivingLicense',
  issuingAuthority: 'California DMV',
  documentNumber: 'DL123456789',
  expirationDate: '2028-03-15',
  personalInfo: {
    givenName: 'John',
    familyName: 'Doe',
    dateOfBirth: '1990-01-01'
  },
  drivingPrivileges: [
    {
      vehicleClass: 'C',
      expirationDate: '2028-03-15'
    }
  ]
};

const result = await ExpoWallet.addPKIdentityDocument(passData);
```

### PKShareablePass (iOS Shareable Passes)

Create passes that can be shared between users via AirDrop, Messages, etc.

```typescript
import { PKShareablePassData } from 'expo-wallet';

const passData: PKShareablePassData = {
  passTypeIdentifier: 'pass.com.example.membership',
  serialNumber: 'MB123456789',
  teamIdentifier: 'ABC123',
  organizationName: 'Fitness Club',
  description: 'Family Membership',
  sharingConfiguration: {
    maxNumberOfShares: 4,
    requiresAuthentication: true,
    allowedSharingChannels: ['airdrop', 'messages']
  },
  activationState: 'activated'
};

const result = await ExpoWallet.addPKShareablePass(passData);

// Share the pass
await ExpoWallet.sharePKPass('MB123456789', ['user1@example.com', 'user2@example.com']);
```

### Google Wallet (Android Passes)

Create passes for Google Wallet on Android devices.

```typescript
import { GoogleWalletPassClass, GoogleWalletPassObject } from 'expo-wallet';

// First, create a pass class (template)
const classData: GoogleWalletPassClass = {
  id: 'issuer.eventclass123',
  issuerName: 'Example Events',
  hexBackgroundColor: '#1E3A8A',
  logo: {
    sourceUri: { uri: 'https://example.com/logo.png' },
    contentDescription: 'Company Logo'
  }
};

// Then, create a pass object (instance)
const objectData: GoogleWalletPassObject = {
  id: 'issuer.eventobject123',
  classId: 'issuer.eventclass123',
  state: 'ACTIVE',
  barcode: {
    type: 'QR_CODE',
    value: 'EVENT123456'
  },
  textModulesData: [
    {
      header: 'Event',
      body: 'Rock Concert 2024',
      id: 'event'
    }
  ],
  heroImage: {
    sourceUri: { uri: 'https://example.com/concert.jpg' },
    contentDescription: 'Concert Image'
  }
};

const result = await ExpoWallet.addToGoogleWallet(classData, objectData);
```

### Pass Management

```typescript
// Get all passes
const allPasses = await ExpoWallet.getAllPasses();
console.log(allPasses.passes);

// Get specific pass
const pass = await ExpoWallet.getPassById('PASS_ID');

// Present pass (show in wallet app)
await ExpoWallet.presentPass('PASS_ID');

// Remove pass
await ExpoWallet.removePKPass('PASS_ID'); // iOS
await ExpoWallet.removeFromGoogleWallet('PASS_ID'); // Android
```

### Events

Listen for pass-related events:

```typescript
import { useEvent } from 'expo';

export function MyComponent() {
  const onPassAdded = useEvent(ExpoWallet, 'onPassAdded');
  const onPassUpdated = useEvent(ExpoWallet, 'onPassUpdated');
  const onPassRemoved = useEvent(ExpoWallet, 'onPassRemoved');

  React.useEffect(() => {
    if (onPassAdded) {
      console.log('Pass added:', onPassAdded.passId, onPassAdded.success);
    }
  }, [onPassAdded]);

  // ...
}
```

## Pass Types and Use Cases

### PKPass Use Cases

- **Boarding Pass**: Airline tickets, train tickets, bus tickets
- **Event Ticket**: Concert tickets, movie tickets, sports events
- **Coupon**: Store discounts, promotional offers
- **Store Card**: Loyalty cards, membership cards
- **Generic**: Any other type of pass (gym membership, library card, etc.)

### PKSecureElementPass Use Cases

- Payment cards (credit/debit)
- Transit cards with contactless payment
- Corporate access cards
- Student ID cards with payment functionality

### PKStoredValuePass Use Cases

- Gift cards
- Prepaid cards
- Campus dining cards
- Transit cards with stored value

### PKIdentityDocument Use Cases

- Driver's licenses
- State identification cards
- Passport cards
- National ID cards

### PKShareablePass Use Cases

- Family membership cards
- Guest passes
- Temporary access cards
- Event passes for groups

## NFC & SE Platform (iOS 18.1+)

For apps targeting iOS 18.1+, you can use the new NFC & SE Platform for secure contactless transactions:

```typescript
// Check availability
const isAvailable = await ExpoWallet.isNFCSEPlatformAvailable();

// Create NFC credential (requires special entitlements)
const credentialData = {
  // Credential configuration
};
const result = await ExpoWallet.createNFCSecureElementCredential(credentialData);
```

## Example App

The included example app demonstrates all functionality with a comprehensive UI for creating different types of passes. Run it with:

```bash
cd example
npm install
npx expo start
```

## Requirements

- **iOS**: iOS 13.0+ (PassKit), iOS 15.0+ (PKIdentityDocument), iOS 18.1+ (NFC & SE Platform)
- **Android**: Android 6.0+ with Google Play Services
- **Expo**: SDK 50+

## Entitlements and Permissions

### iOS

```xml
<!-- Required for all pass types -->
<key>com.apple.developer.pass-type-identifiers</key>
<array>
    <string>pass.com.yourcompany.*</string>
</array>

<!-- For PKIdentityDocument -->
<key>com.apple.developer.identity-documents</key>
<array>
    <string>com.apple.identity.document.driverslicense</string>
</array>

<!-- For NFC & SE Platform -->
<key>com.apple.developer.nfc.secure-element</key>
<array>
    <string>payment</string>
    <string>access</string>
</array>
```

### Android

```xml
<!-- Google Wallet permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Security Considerations

1. **Pass Signing**: All passes must be cryptographically signed
2. **Server Integration**: Implement secure server endpoints for pass updates
3. **Data Validation**: Validate all pass data on the server side
4. **Certificates**: Use proper certificates from Apple Developer Console
5. **API Keys**: Secure your Google Cloud service account keys

## Troubleshooting

### Common iOS Issues

- **Pass not appearing**: Check pass type identifier and team identifier
- **Invalid signature**: Ensure pass is properly signed with correct certificate
- **Pass rejected**: Validate pass JSON against PassKit specification

### Common Android Issues

- **Google Wallet not found**: Ensure Google Wallet app is installed
- **API errors**: Check Google Cloud project configuration and credentials
- **JWT issues**: Verify service account key and signing process

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests for any improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Documentation

- [Apple PassKit Documentation](https://developer.apple.com/documentation/passkit)
- [Google Wallet API Documentation](https://developers.google.com/wallet)
- [NFC & SE Platform Documentation](https://developer.apple.com/support/nfc-se-platform)
- [Expo Module API](https://docs.expo.dev/modules/module-api/)
