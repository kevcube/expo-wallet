import type { StyleProp, ViewStyle } from 'react-native';

// Pass creation types
export interface PassData {
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  logoText?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  labelColor?: string;
  webServiceURL?: string;
  authenticationToken?: string;
}

export interface PassField {
  key: string;
  label?: string;
  value: string;
  textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight' | 'PKTextAlignmentNatural';
  changeMessage?: string;
}

export interface PassLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  relevantText?: string;
}

export interface PassBarcode {
  format: 'PKBarcodeFormatQR' | 'PKBarcodeFormatPDF417' | 'PKBarcodeFormatAztec' | 'PKBarcodeFormatCode128';
  message: string;
  messageEncoding: string;
  altText?: string;
}

export interface PKPassData extends PassData {
  passStyle: 'boardingPass' | 'coupon' | 'eventTicket' | 'generic' | 'storeCard';
  headerFields?: PassField[];
  primaryFields?: PassField[];
  secondaryFields?: PassField[];
  auxiliaryFields?: PassField[];
  backFields?: PassField[];
  locations?: PassLocation[];
  relevantDate?: string;
  barcodes?: PassBarcode[];
  maxDistance?: number;
  transitType?: 'PKTransitTypeAir' | 'PKTransitTypeBus' | 'PKTransitTypeTrain' | 'PKTransitTypeBoat' | 'PKTransitTypeGeneric';
}

export interface PKSecureElementPassData extends PassData {
  devicePaymentApplications: Array<{
    paymentApplicationIdentifier: string;
    inAppPaymentApplications?: Array<{
      applicationIdentifier: string;
      merchantIdentifier: string;
    }>;
  }>;
  primaryAccountIdentifier: string;
  primaryAccountNumberSuffix: string;
  deviceAccountIdentifier?: string;
  deviceAccountNumberSuffix?: string;
  suspendedReason?: string;
}

export interface PKStoredValuePassData extends PassData {
  balance: number;
  currencyCode: string;
  balanceUpdateDate?: string;
  autoTopUpAmount?: number;
  autoTopUpThreshold?: number;
}

export interface PKIdentityDocumentData extends PassData {
  documentType: 'drivingLicense' | 'stateID' | 'passport' | 'nationalID';
  issuingAuthority: string;
  documentNumber: string;
  expirationDate?: string;
  personalInfo: {
    givenName: string;
    familyName: string;
    dateOfBirth?: string;
    portrait?: string; // Base64 encoded image
  };
  drivingPrivileges?: Array<{
    vehicleClass: string;
    expirationDate?: string;
    restrictions?: string[];
  }>;
}

export interface PKShareablePassData extends PassData {
  sharingConfiguration: {
    maxNumberOfShares: number;
    requiresAuthentication: boolean;
    allowedSharingChannels: Array<'airdrop' | 'messages' | 'mail' | 'other'>;
  };
  activationState?: 'activated' | 'activating' | 'inactive' | 'suspended';
}

// Google Wallet types
export interface GoogleWalletPassClass {
  id: string;
  issuerName: string;
  reviewStatus?: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  logo?: {
    sourceUri: { uri: string };
    contentDescription?: string;
  };
  hexBackgroundColor?: string;
  localizedIssuerName?: {
    defaultValue: {
      language: string;
      value: string;
    };
  };
}

export interface GoogleWalletPassObject {
  id: string;
  classId: string;
  state: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'INACTIVE';
  barcode?: {
    type: 'QR_CODE' | 'PDF_417' | 'AZTEC' | 'CODE_128';
    value: string;
    alternateText?: string;
  };
  heroImage?: {
    sourceUri: { uri: string };
    contentDescription?: string;
  };
  textModulesData?: Array<{
    header: string;
    body: string;
    id: string;
  }>;
  linksModuleData?: {
    uris: Array<{
      uri: string;
      description: string;
      id: string;
    }>;
  };
}

// Module events
export type ExpoWalletModuleEvents = {
  onPassAdded: (params: { passId: string; success: boolean; error?: string }) => void;
  onPassUpdated: (params: { passId: string; success: boolean; error?: string }) => void;
  onPassRemoved: (params: { passId: string; success: boolean; error?: string }) => void;
  onWalletAvailabilityChanged: (params: { available: boolean; reason?: string }) => void;
};

// Result types
export interface PassCreationResult {
  success: boolean;
  passId?: string;
  error?: string;
}

export interface WalletAvailability {
  isAvailable: boolean;
  canAddPasses: boolean;
  platform: 'ios' | 'android';
  supportedPassTypes: string[];
}

// View props
export type ExpoWalletViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: { url: string } }) => void;
  style?: StyleProp<ViewStyle>;
};

// Legacy types for backward compatibility
export type OnLoadEventPayload = {
  url: string;
};

export type ChangeEventPayload = {
  value: string;
};
