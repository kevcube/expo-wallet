import React, { useState, useEffect } from 'react';
import { useEvent } from 'expo';
import ExpoWallet from 'expo-wallet';
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { PKPassData, PKSecureElementPassData, PKStoredValuePassData, PKIdentityDocumentData, PKShareablePassData, GoogleWalletPassClass, GoogleWalletPassObject, WalletAvailability } from '../src/ExpoWallet.types';

export default function App() {
  const [walletAvailable, setWalletAvailable] = useState<WalletAvailability | null>(null);
  const [selectedPassType, setSelectedPassType] = useState<string>('PKPass');
  
  // Basic pass data
  const [passTypeIdentifier, setPassTypeIdentifier] = useState('pass.com.example.mypass');
  const [serialNumber, setSerialNumber] = useState('12345678');
  const [teamIdentifier, setTeamIdentifier] = useState('ABC123');
  const [organizationName, setOrganizationName] = useState('Example Organization');
  const [description, setDescription] = useState('Example Pass');
  const [logoText, setLogoText] = useState('LOGO');
  const [backgroundColor, setBackgroundColor] = useState('#0066CC');
  const [foregroundColor, setForegroundColor] = useState('#FFFFFF');
  
  // Pass style for PKPass
  const [passStyle, setPassStyle] = useState<'boardingPass' | 'coupon' | 'eventTicket' | 'generic' | 'storeCard'>('generic');
  
  // PKStoredValuePass specific
  const [balance, setBalance] = useState('25.00');
  const [currencyCode, setCurrencyCode] = useState('USD');
  
  // PKIdentityDocument specific
  const [documentType, setDocumentType] = useState<'drivingLicense' | 'stateID' | 'passport' | 'nationalID'>('drivingLicense');
  const [issuingAuthority, setIssuingAuthority] = useState('State of California');
  const [documentNumber, setDocumentNumber] = useState('DL123456789');
  const [givenName, setGivenName] = useState('John');
  const [familyName, setFamilyName] = useState('Doe');
  const [dateOfBirth, setDateOfBirth] = useState('1990-01-01');
  
  // PKSecureElementPass specific
  const [primaryAccountIdentifier, setPrimaryAccountIdentifier] = useState('account123');
  const [primaryAccountNumberSuffix, setPrimaryAccountNumberSuffix] = useState('1234');
  
  // PKShareablePass specific
  const [maxNumberOfShares, setMaxNumberOfShares] = useState('5');
  const [requiresAuthentication, setRequiresAuthentication] = useState(true);
  
  // Google Wallet specific
  const [googleWalletClassId, setGoogleWalletClassId] = useState('issuer.class123');
  const [googleWalletObjectId, setGoogleWalletObjectId] = useState('issuer.object123');
  const [issuerName, setIssuerName] = useState('Example Issuer');
  
  // Events
  const onPassAdded = useEvent(ExpoWallet, 'onPassAdded');
  const onPassUpdated = useEvent(ExpoWallet, 'onPassUpdated');
  const onPassRemoved = useEvent(ExpoWallet, 'onPassRemoved');

  useEffect(() => {
    checkWalletAvailability();
  }, []);

  useEffect(() => {
    if (onPassAdded) {
      Alert.alert('Pass Added', `Pass ${onPassAdded.passId} was ${onPassAdded.success ? 'successfully added' : 'failed to add'}`);
    }
  }, [onPassAdded]);

  const checkWalletAvailability = async () => {
    try {
      const availability = await ExpoWallet.isWalletAvailable();
      setWalletAvailable(availability);
    } catch (error) {
      console.error('Error checking wallet availability:', error);
    }
  };

  const createPKPass = async () => {
    try {
      const passData: PKPassData = {
        passTypeIdentifier,
        serialNumber,
        teamIdentifier,
        organizationName,
        description,
        logoText,
        backgroundColor,
        foregroundColor,
        passStyle,
        primaryFields: [
          {
            key: 'member',
            label: 'Member',
            value: 'John Doe'
          }
        ],
        secondaryFields: [
          {
            key: 'level',
            label: 'Level',
            value: 'Gold'
          }
        ],
        barcodes: [
          {
            format: 'PKBarcodeFormatQR',
            message: serialNumber,
            messageEncoding: 'iso-8859-1'
          }
        ]
      };

      const result = await ExpoWallet.addPKPass(passData);
      Alert.alert('PKPass', result.success ? `Created pass: ${result.passId}` : `Error: ${result.error}`);
    } catch (error) {
      Alert.alert('Error', `Failed to create PKPass: ${error}`);
    }
  };

  const createPKSecureElementPass = async () => {
    try {
      const passData: PKSecureElementPassData = {
        passTypeIdentifier,
        serialNumber,
        teamIdentifier,
        organizationName,
        description,
        logoText,
        backgroundColor,
        foregroundColor,
        devicePaymentApplications: [
          {
            paymentApplicationIdentifier: 'payment.app.example'
          }
        ],
        primaryAccountIdentifier,
        primaryAccountNumberSuffix
      };

      const result = await ExpoWallet.addPKSecureElementPass(passData);
      Alert.alert('PKSecureElementPass', result.success ? `Created pass: ${result.passId}` : `Error: ${result.error}`);
    } catch (error) {
      Alert.alert('Error', `Failed to create PKSecureElementPass: ${error}`);
    }
  };

  const createPKStoredValuePass = async () => {
    try {
      const passData: PKStoredValuePassData = {
        passTypeIdentifier,
        serialNumber,
        teamIdentifier,
        organizationName,
        description,
        logoText,
        backgroundColor,
        foregroundColor,
        balance: parseFloat(balance),
        currencyCode
      };

      const result = await ExpoWallet.addPKStoredValuePass(passData);
      Alert.alert('PKStoredValuePass', result.success ? `Created pass: ${result.passId}` : `Error: ${result.error}`);
    } catch (error) {
      Alert.alert('Error', `Failed to create PKStoredValuePass: ${error}`);
    }
  };

  const createPKIdentityDocument = async () => {
    try {
      const passData: PKIdentityDocumentData = {
        passTypeIdentifier,
        serialNumber,
        teamIdentifier,
        organizationName,
        description,
        documentType,
        issuingAuthority,
        documentNumber,
        personalInfo: {
          givenName,
          familyName,
          dateOfBirth
        }
      };

      const result = await ExpoWallet.addPKIdentityDocument(passData);
      Alert.alert('PKIdentityDocument', result.success ? `Created document: ${result.passId}` : `Error: ${result.error}`);
    } catch (error) {
      Alert.alert('Error', `Failed to create PKIdentityDocument: ${error}`);
    }
  };

  const createPKShareablePass = async () => {
    try {
      const passData: PKShareablePassData = {
        passTypeIdentifier,
        serialNumber,
        teamIdentifier,
        organizationName,
        description,
        logoText,
        backgroundColor,
        foregroundColor,
        sharingConfiguration: {
          maxNumberOfShares: parseInt(maxNumberOfShares),
          requiresAuthentication,
          allowedSharingChannels: ['airdrop', 'messages']
        }
      };

      const result = await ExpoWallet.addPKShareablePass(passData);
      Alert.alert('PKShareablePass', result.success ? `Created pass: ${result.passId}` : `Error: ${result.error}`);
    } catch (error) {
      Alert.alert('Error', `Failed to create PKShareablePass: ${error}`);
    }
  };

  const createGoogleWalletPass = async () => {
    try {
      const classData: GoogleWalletPassClass = {
        id: googleWalletClassId,
        issuerName,
        hexBackgroundColor: backgroundColor,
        logo: {
          sourceUri: { uri: 'https://via.placeholder.com/150' },
          contentDescription: 'Company Logo'
        }
      };

      const objectData: GoogleWalletPassObject = {
        id: googleWalletObjectId,
        classId: googleWalletClassId,
        state: 'ACTIVE',
        barcode: {
          type: 'QR_CODE',
          value: serialNumber
        },
        textModulesData: [
          {
            header: 'Member',
            body: 'John Doe',
            id: 'member'
          }
        ]
      };

      const result = await ExpoWallet.addToGoogleWallet(classData, objectData);
      Alert.alert('Google Wallet Pass', result.success ? `Created pass: ${result.passId}` : `Error: ${result.error}`);
    } catch (error) {
      Alert.alert('Error', `Failed to create Google Wallet pass: ${error}`);
    }
  };

  const getAllPasses = async () => {
    try {
      const result = await ExpoWallet.getAllPasses();
      Alert.alert('All Passes', `Found ${result.passes.length} passes:\n${result.passes.map(p => `${p.description} (${p.type})`).join('\n')}`);
    } catch (error) {
      Alert.alert('Error', `Failed to get passes: ${error}`);
    }
  };

  const renderPassTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Pass Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.passTypeScroll}>
        {['PKPass', 'PKSecureElementPass', 'PKStoredValuePass', 'PKIdentityDocument', 'PKShareablePass', 'GoogleWallet'].map((type) => (
          <Button
            key={type}
            title={type}
            onPress={() => setSelectedPassType(type)}
            color={selectedPassType === type ? '#0066CC' : '#999'}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderBasicFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Pass Type Identifier"
        value={passTypeIdentifier}
        onChangeText={setPassTypeIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Serial Number"
        value={serialNumber}
        onChangeText={setSerialNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Team Identifier"
        value={teamIdentifier}
        onChangeText={setTeamIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Organization Name"
        value={organizationName}
        onChangeText={setOrganizationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Logo Text"
        value={logoText}
        onChangeText={setLogoText}
      />
      <TextInput
        style={styles.input}
        placeholder="Background Color (#0066CC)"
        value={backgroundColor}
        onChangeText={setBackgroundColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Foreground Color (#FFFFFF)"
        value={foregroundColor}
        onChangeText={setForegroundColor}
      />
    </View>
  );

  const renderPKPassFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PKPass Specific</Text>
      <Text style={styles.label}>Pass Style:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.passTypeScroll}>
        {(['boardingPass', 'coupon', 'eventTicket', 'generic', 'storeCard'] as const).map((style) => (
          <Button
            key={style}
            title={style}
            onPress={() => setPassStyle(style)}
            color={passStyle === style ? '#0066CC' : '#999'}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderPKStoredValuePassFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stored Value Pass Specific</Text>
      <TextInput
        style={styles.input}
        placeholder="Balance"
        value={balance}
        onChangeText={setBalance}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Currency Code (USD)"
        value={currencyCode}
        onChangeText={setCurrencyCode}
      />
    </View>
  );

  const renderPKIdentityDocumentFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Identity Document Specific</Text>
      <Text style={styles.label}>Document Type:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.passTypeScroll}>
        {(['drivingLicense', 'stateID', 'passport', 'nationalID'] as const).map((type) => (
          <Button
            key={type}
            title={type}
            onPress={() => setDocumentType(type)}
            color={documentType === type ? '#0066CC' : '#999'}
          />
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        placeholder="Issuing Authority"
        value={issuingAuthority}
        onChangeText={setIssuingAuthority}
      />
      <TextInput
        style={styles.input}
        placeholder="Document Number"
        value={documentNumber}
        onChangeText={setDocumentNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Given Name"
        value={givenName}
        onChangeText={setGivenName}
      />
      <TextInput
        style={styles.input}
        placeholder="Family Name"
        value={familyName}
        onChangeText={setFamilyName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />
    </View>
  );

  const renderPKSecureElementPassFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Secure Element Pass Specific</Text>
      <TextInput
        style={styles.input}
        placeholder="Primary Account Identifier"
        value={primaryAccountIdentifier}
        onChangeText={setPrimaryAccountIdentifier}
      />
      <TextInput
        style={styles.input}
        placeholder="Primary Account Number Suffix"
        value={primaryAccountNumberSuffix}
        onChangeText={setPrimaryAccountNumberSuffix}
      />
    </View>
  );

  const renderPKShareablePassFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Shareable Pass Specific</Text>
      <TextInput
        style={styles.input}
        placeholder="Max Number of Shares"
        value={maxNumberOfShares}
        onChangeText={setMaxNumberOfShares}
        keyboardType="number-pad"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Requires Authentication:</Text>
        <Switch
          value={requiresAuthentication}
          onValueChange={setRequiresAuthentication}
        />
      </View>
    </View>
  );

  const renderGoogleWalletFields = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Google Wallet Specific</Text>
      <TextInput
        style={styles.input}
        placeholder="Class ID (issuer.class123)"
        value={googleWalletClassId}
        onChangeText={setGoogleWalletClassId}
      />
      <TextInput
        style={styles.input}
        placeholder="Object ID (issuer.object123)"
        value={googleWalletObjectId}
        onChangeText={setGoogleWalletObjectId}
      />
      <TextInput
        style={styles.input}
        placeholder="Issuer Name"
        value={issuerName}
        onChangeText={setIssuerName}
      />
    </View>
  );

  const renderCreateButton = () => {
    const createFunctions = {
      PKPass: createPKPass,
      PKSecureElementPass: createPKSecureElementPass,
      PKStoredValuePass: createPKStoredValuePass,
      PKIdentityDocument: createPKIdentityDocument,
      PKShareablePass: createPKShareablePass,
      GoogleWallet: createGoogleWalletPass,
    };

    return (
      <View style={styles.section}>
        <Button
          title={`Create ${selectedPassType}`}
          onPress={createFunctions[selectedPassType as keyof typeof createFunctions]}
          color="#0066CC"
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="Get All Passes"
          onPress={getAllPasses}
          color="#666"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Expo Wallet Demo</Text>
        
        {walletAvailable && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wallet Status</Text>
            <Text>Platform: {walletAvailable.platform}</Text>
            <Text>Available: {walletAvailable.isAvailable ? 'Yes' : 'No'}</Text>
            <Text>Can Add Passes: {walletAvailable.canAddPasses ? 'Yes' : 'No'}</Text>
            <Text>Supported Types: {walletAvailable.supportedPassTypes.join(', ')}</Text>
          </View>
        )}

        {renderPassTypeSelector()}
        {renderBasicFields()}
        
        {selectedPassType === 'PKPass' && renderPKPassFields()}
        {selectedPassType === 'PKSecureElementPass' && renderPKSecureElementPassFields()}
        {selectedPassType === 'PKStoredValuePass' && renderPKStoredValuePassFields()}
        {selectedPassType === 'PKIdentityDocument' && renderPKIdentityDocumentFields()}
        {selectedPassType === 'PKShareablePass' && renderPKShareablePassFields()}
        {selectedPassType === 'GoogleWallet' && renderGoogleWalletFields()}
        
        {renderCreateButton()}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.note}>
            • PKPass: Traditional Apple Wallet passes for boarding passes, event tickets, coupons, etc.{'\n'}
            • PKSecureElementPass: Secure payment cards and transit passes with hardware security.{'\n'}
            • PKStoredValuePass: Gift cards and prepaid cards with stored monetary value.{'\n'}
            • PKIdentityDocument: Driver's licenses and state IDs (requires special entitlements).{'\n'}
            • PKShareablePass: Passes that can be shared between users via AirDrop or Messages.{'\n'}
            • Google Wallet: Android wallet passes using Google's Wallet API.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  passTypeScroll: {
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSpacing: {
    height: 10,
  },
  note: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
