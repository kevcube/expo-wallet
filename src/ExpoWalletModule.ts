import { NativeModule, requireNativeModule } from 'expo';

import { 
  ExpoWalletModuleEvents, 
  PKPassData, 
  PKSecureElementPassData, 
  PKStoredValuePassData, 
  PKIdentityDocumentData, 
  PKShareablePassData,
  GoogleWalletPassClass,
  GoogleWalletPassObject,
  PassCreationResult,
  WalletAvailability 
} from './ExpoWallet.types';

declare class ExpoWalletModule extends NativeModule<ExpoWalletModuleEvents> {
  // Legacy properties for backward compatibility
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;

  // Wallet availability and status
  isWalletAvailable(): Promise<WalletAvailability>;
  canAddPasses(): Promise<boolean>;

  // PKPass (Traditional PassKit passes)
  addPKPass(passData: PKPassData): Promise<PassCreationResult>;
  updatePKPass(passId: string, passData: Partial<PKPassData>): Promise<PassCreationResult>;
  removePKPass(passId: string): Promise<PassCreationResult>;
  
  // PKSecureElementPass (Apple Pay cards, transit cards with Secure Element)
  addPKSecureElementPass(passData: PKSecureElementPassData): Promise<PassCreationResult>;
  updatePKSecureElementPass(passId: string, passData: Partial<PKSecureElementPassData>): Promise<PassCreationResult>;
  removePKSecureElementPass(passId: string): Promise<PassCreationResult>;
  
  // PKStoredValuePass (Gift cards, prepaid cards with stored value)
  addPKStoredValuePass(passData: PKStoredValuePassData): Promise<PassCreationResult>;
  updatePKStoredValuePass(passId: string, passData: Partial<PKStoredValuePassData>): Promise<PassCreationResult>;
  updateStoredValueBalance(passId: string, newBalance: number): Promise<PassCreationResult>;
  removePKStoredValuePass(passId: string): Promise<PassCreationResult>;
  
  // PKIdentityDocument (Driver's licenses, state IDs)
  addPKIdentityDocument(passData: PKIdentityDocumentData): Promise<PassCreationResult>;
  updatePKIdentityDocument(passId: string, passData: Partial<PKIdentityDocumentData>): Promise<PassCreationResult>;
  removePKIdentityDocument(passId: string): Promise<PassCreationResult>;
  
  // PKShareablePass (Passes that can be shared between users)
  addPKShareablePass(passData: PKShareablePassData): Promise<PassCreationResult>;
  updatePKShareablePass(passId: string, passData: Partial<PKShareablePassData>): Promise<PassCreationResult>;
  sharePKPass(passId: string, recipients: string[]): Promise<PassCreationResult>;
  removePKShareablePass(passId: string): Promise<PassCreationResult>;
  
  // Google Wallet integration (Android)
  createGoogleWalletClass(classData: GoogleWalletPassClass): Promise<PassCreationResult>;
  createGoogleWalletObject(objectData: GoogleWalletPassObject): Promise<PassCreationResult>;
  addToGoogleWallet(classData: GoogleWalletPassClass, objectData: GoogleWalletPassObject): Promise<PassCreationResult>;
  updateGoogleWalletObject(objectId: string, objectData: Partial<GoogleWalletPassObject>): Promise<PassCreationResult>;
  removeFromGoogleWallet(objectId: string): Promise<PassCreationResult>;
  
  // Pass management
  getAllPasses(): Promise<{ passes: Array<{ id: string; type: string; description: string }> }>;
  getPassById(passId: string): Promise<{ pass: any; success: boolean; error?: string }>;
  
  // Presentation and interaction
  presentPass(passId: string): Promise<PassCreationResult>;
  
  // NFC & SE Platform (iOS 18.1+)
  isNFCSEPlatformAvailable(): Promise<boolean>;
  createNFCSecureElementCredential(credentialData: any): Promise<PassCreationResult>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoWalletModule>('ExpoWallet');
