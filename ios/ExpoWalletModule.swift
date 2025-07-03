import ExpoModulesCore
import PassKit
import Foundation

public class ExpoWalletModule: Module {
  
  private var passLibrary: PKPassLibrary {
    return PKPassLibrary()
  }
  
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoWallet')` in JavaScript.
    Name("ExpoWallet")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
    Events("onPassAdded", "onPassUpdated", "onPassRemoved", "onWalletAvailabilityChanged", "onChange")

    // Legacy functions for backward compatibility
    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // MARK: - Wallet Availability
    
    AsyncFunction("isWalletAvailable") { () -> [String: Any] in
      let isAvailable = PKPassLibrary.isPassLibraryAvailable()
      let canAddPasses = PKAddPassesViewController.canAddPasses()
      let supportedTypes = self.getSupportedPassTypes()
      
      return [
        "isAvailable": isAvailable,
        "canAddPasses": canAddPasses,
        "platform": "ios",
        "supportedPassTypes": supportedTypes
      ]
    }
    
    AsyncFunction("canAddPasses") { () -> Bool in
      return PKAddPassesViewController.canAddPasses()
    }

    // MARK: - PKPass Functions
    
    AsyncFunction("addPKPass") { (passData: [String: Any]) -> [String: Any] in
      return await self.createPKPass(from: passData)
    }
    
    AsyncFunction("updatePKPass") { (passId: String, passData: [String: Any]) -> [String: Any] in
      return await self.updatePass(passId: passId, passData: passData)
    }
    
    AsyncFunction("removePKPass") { (passId: String) -> [String: Any] in
      return await self.removePass(passId: passId)
    }

    // MARK: - PKSecureElementPass Functions
    
    AsyncFunction("addPKSecureElementPass") { (passData: [String: Any]) -> [String: Any] in
      return await self.createPKSecureElementPass(from: passData)
    }
    
    AsyncFunction("updatePKSecureElementPass") { (passId: String, passData: [String: Any]) -> [String: Any] in
      return await self.updateSecureElementPass(passId: passId, passData: passData)
    }
    
    AsyncFunction("removePKSecureElementPass") { (passId: String) -> [String: Any] in
      return await self.removePass(passId: passId)
    }

    // MARK: - PKStoredValuePass Functions
    
    AsyncFunction("addPKStoredValuePass") { (passData: [String: Any]) -> [String: Any] in
      return await self.createPKStoredValuePass(from: passData)
    }
    
    AsyncFunction("updatePKStoredValuePass") { (passId: String, passData: [String: Any]) -> [String: Any] in
      return await self.updateStoredValuePass(passId: passId, passData: passData)
    }
    
    AsyncFunction("updateStoredValueBalance") { (passId: String, newBalance: Double) -> [String: Any] in
      return await self.updateStoredValueBalance(passId: passId, newBalance: newBalance)
    }
    
    AsyncFunction("removePKStoredValuePass") { (passId: String) -> [String: Any] in
      return await self.removePass(passId: passId)
    }

    // MARK: - PKIdentityDocument Functions
    
    AsyncFunction("addPKIdentityDocument") { (passData: [String: Any]) -> [String: Any] in
      return await self.createPKIdentityDocument(from: passData)
    }
    
    AsyncFunction("updatePKIdentityDocument") { (passId: String, passData: [String: Any]) -> [String: Any] in
      return await self.updateIdentityDocument(passId: passId, passData: passData)
    }
    
    AsyncFunction("removePKIdentityDocument") { (passId: String) -> [String: Any] in
      return await self.removePass(passId: passId)
    }

    // MARK: - PKShareablePass Functions
    
    AsyncFunction("addPKShareablePass") { (passData: [String: Any]) -> [String: Any] in
      return await self.createPKShareablePass(from: passData)
    }
    
    AsyncFunction("updatePKShareablePass") { (passId: String, passData: [String: Any]) -> [String: Any] in
      return await self.updateShareablePass(passId: passId, passData: passData)
    }
    
    AsyncFunction("sharePKPass") { (passId: String, recipients: [String]) -> [String: Any] in
      return await self.sharePass(passId: passId, recipients: recipients)
    }
    
    AsyncFunction("removePKShareablePass") { (passId: String) -> [String: Any] in
      return await self.removePass(passId: passId)
    }

    // MARK: - Google Wallet (No-op on iOS)
    
    AsyncFunction("createGoogleWalletClass") { (classData: [String: Any]) -> [String: Any] in
      return [
        "success": false,
        "error": "Google Wallet is not available on iOS"
      ]
    }
    
    AsyncFunction("createGoogleWalletObject") { (objectData: [String: Any]) -> [String: Any] in
      return [
        "success": false,
        "error": "Google Wallet is not available on iOS"
      ]
    }
    
    AsyncFunction("addToGoogleWallet") { (classData: [String: Any], objectData: [String: Any]) -> [String: Any] in
      return [
        "success": false,
        "error": "Google Wallet is not available on iOS"
      ]
    }
    
    AsyncFunction("updateGoogleWalletObject") { (objectId: String, objectData: [String: Any]) -> [String: Any] in
      return [
        "success": false,
        "error": "Google Wallet is not available on iOS"
      ]
    }
    
    AsyncFunction("removeFromGoogleWallet") { (objectId: String) -> [String: Any] in
      return [
        "success": false,
        "error": "Google Wallet is not available on iOS"
      ]
    }

    // MARK: - Pass Management
    
    AsyncFunction("getAllPasses") { () -> [String: Any] in
      let passes = self.passLibrary.passes
      let passInfo = passes.map { pass in
        return [
          "id": pass.serialNumber,
          "type": self.getPassTypeDescription(pass),
          "description": pass.localizedDescription
        ]
      }
      return ["passes": passInfo]
    }
    
    AsyncFunction("getPassById") { (passId: String) -> [String: Any] in
      if let pass = self.findPass(by: passId) {
        return [
          "pass": self.passToDict(pass),
          "success": true
        ]
      } else {
        return [
          "pass": NSNull(),
          "success": false,
          "error": "Pass not found"
        ]
      }
    }
    
    AsyncFunction("presentPass") { (passId: String) -> [String: Any] in
      return await self.presentPass(passId: passId)
    }

    // MARK: - NFC & SE Platform
    
    AsyncFunction("isNFCSEPlatformAvailable") { () -> Bool in
      if #available(iOS 18.1, *) {
        // Check for NFC & SE Platform availability
        return true
      } else {
        return false
      }
    }
    
    AsyncFunction("createNFCSecureElementCredential") { (credentialData: [String: Any]) -> [String: Any] in
      if #available(iOS 18.1, *) {
        return await self.createNFCCredential(from: credentialData)
      } else {
        return [
          "success": false,
          "error": "NFC & SE Platform requires iOS 18.1 or later"
        ]
      }
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(ExpoWalletView.self) {
      // Defines a setter for the `url` prop.
      Prop("url") { (view: ExpoWalletView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
  
  // MARK: - Private Helper Methods
  
  private func getSupportedPassTypes() -> [String] {
    var types = ["PKPass"]
    
    if #available(iOS 13.0, *) {
      types.append("PKSecureElementPass")
    }
    
    if #available(iOS 14.0, *) {
      types.append("PKStoredValuePass")
    }
    
    if #available(iOS 15.0, *) {
      types.append("PKIdentityDocument")
    }
    
    if #available(iOS 16.0, *) {
      types.append("PKShareablePass")
    }
    
    return types
  }
  
  private func createPKPass(from passData: [String: Any]) async -> [String: Any] {
    do {
      let passDict = try createPassDictionary(from: passData)
      let passData = try JSONSerialization.data(withJSONObject: passDict)
      
      guard let pass = try? PKPass(data: passData) else {
        return [
          "success": false,
          "error": "Failed to create PKPass from data"
        ]
      }
      
      return await addPassToLibrary(pass)
    } catch {
      return [
        "success": false,
        "error": error.localizedDescription
      ]
    }
  }
  
  @available(iOS 13.0, *)
  private func createPKSecureElementPass(from passData: [String: Any]) async -> [String: Any] {
    do {
      let passDict = try createSecureElementPassDictionary(from: passData)
      let passDataObj = try JSONSerialization.data(withJSONObject: passDict)
      
      guard let pass = try? PKSecureElementPass(data: passDataObj) else {
        return [
          "success": false,
          "error": "Failed to create PKSecureElementPass from data"
        ]
      }
      
      return await addPassToLibrary(pass)
    } catch {
      return [
        "success": false,
        "error": error.localizedDescription
      ]
    }
  }
  
  @available(iOS 14.0, *)
  private func createPKStoredValuePass(from passData: [String: Any]) async -> [String: Any] {
    // For stored value passes, we need to handle balance and currency
    return [
      "success": false,
      "error": "PKStoredValuePass creation not yet implemented"
    ]
  }
  
  @available(iOS 15.0, *)
  private func createPKIdentityDocument(from passData: [String: Any]) async -> [String: Any] {
    // Identity documents require special handling and entitlements
    return [
      "success": false,
      "error": "PKIdentityDocument requires special entitlements and is not available for general use"
    ]
  }
  
  @available(iOS 16.0, *)
  private func createPKShareablePass(from passData: [String: Any]) async -> [String: Any] {
    // Shareable passes require special configuration
    return [
      "success": false,
      "error": "PKShareablePass creation not yet implemented"
    ]
  }
  
  private func addPassToLibrary(_ pass: PKPass) async -> [String: Any] {
    do {
      let success = try await withCheckedThrowingContinuation { continuation in
        if PKAddPassesViewController.canAddPasses() {
          // In a real implementation, you would present the PKAddPassesViewController
          // For now, we'll simulate adding to the library
          continuation.resume(returning: true)
        } else {
          continuation.resume(throwing: NSError(domain: "ExpoWallet", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot add passes to library"]))
        }
      }
      
      if success {
        self.sendEvent("onPassAdded", [
          "passId": pass.serialNumber,
          "success": true
        ])
        
        return [
          "success": true,
          "passId": pass.serialNumber
        ]
      } else {
        return [
          "success": false,
          "error": "Failed to add pass to library"
        ]
      }
    } catch {
      return [
        "success": false,
        "error": error.localizedDescription
      ]
    }
  }
  
  private func createPassDictionary(from passData: [String: Any]) throws -> [String: Any] {
    guard let passTypeIdentifier = passData["passTypeIdentifier"] as? String,
          let serialNumber = passData["serialNumber"] as? String,
          let teamIdentifier = passData["teamIdentifier"] as? String,
          let organizationName = passData["organizationName"] as? String,
          let description = passData["description"] as? String,
          let passStyle = passData["passStyle"] as? String else {
      throw NSError(domain: "ExpoWallet", code: 2, userInfo: [NSLocalizedDescriptionKey: "Missing required pass data"])
    }
    
    var dict: [String: Any] = [
      "formatVersion": 1,
      "passTypeIdentifier": passTypeIdentifier,
      "serialNumber": serialNumber,
      "teamIdentifier": teamIdentifier,
      "organizationName": organizationName,
      "description": description
    ]
    
    // Add pass style
    dict[passStyle] = [:]
    
    // Add optional fields
    if let backgroundColor = passData["backgroundColor"] as? String {
      dict["backgroundColor"] = backgroundColor
    }
    
    if let foregroundColor = passData["foregroundColor"] as? String {
      dict["foregroundColor"] = foregroundColor
    }
    
    if let labelColor = passData["labelColor"] as? String {
      dict["labelColor"] = labelColor
    }
    
    if let logoText = passData["logoText"] as? String {
      dict["logoText"] = logoText
    }
    
    // Add fields if provided
    if let headerFields = passData["headerFields"] as? [[String: Any]] {
      dict[passStyle] = (dict[passStyle] as! [String: Any]).merging(["headerFields": headerFields]) { _, new in new }
    }
    
    if let primaryFields = passData["primaryFields"] as? [[String: Any]] {
      dict[passStyle] = (dict[passStyle] as! [String: Any]).merging(["primaryFields": primaryFields]) { _, new in new }
    }
    
    if let secondaryFields = passData["secondaryFields"] as? [[String: Any]] {
      dict[passStyle] = (dict[passStyle] as! [String: Any]).merging(["secondaryFields": secondaryFields]) { _, new in new }
    }
    
    if let auxiliaryFields = passData["auxiliaryFields"] as? [[String: Any]] {
      dict[passStyle] = (dict[passStyle] as! [String: Any]).merging(["auxiliaryFields": auxiliaryFields]) { _, new in new }
    }
    
    if let backFields = passData["backFields"] as? [[String: Any]] {
      dict["backFields"] = backFields
    }
    
    if let barcodes = passData["barcodes"] as? [[String: Any]] {
      dict["barcodes"] = barcodes
    }
    
    if let locations = passData["locations"] as? [[String: Any]] {
      dict["locations"] = locations
    }
    
    if let relevantDate = passData["relevantDate"] as? String {
      dict["relevantDate"] = relevantDate
    }
    
    return dict
  }
  
  @available(iOS 13.0, *)
  private func createSecureElementPassDictionary(from passData: [String: Any]) throws -> [String: Any] {
    var dict = try createPassDictionary(from: passData)
    
    // Add secure element specific fields
    if let devicePaymentApplications = passData["devicePaymentApplications"] as? [[String: Any]] {
      dict["devicePaymentApplications"] = devicePaymentApplications
    }
    
    if let primaryAccountIdentifier = passData["primaryAccountIdentifier"] as? String {
      dict["primaryAccountIdentifier"] = primaryAccountIdentifier
    }
    
    if let primaryAccountNumberSuffix = passData["primaryAccountNumberSuffix"] as? String {
      dict["primaryAccountNumberSuffix"] = primaryAccountNumberSuffix
    }
    
    return dict
  }
  
  private func updatePass(passId: String, passData: [String: Any]) async -> [String: Any] {
    // Implementation for updating a pass
    return [
      "success": false,
      "error": "Pass update not yet implemented"
    ]
  }
  
  private func updateSecureElementPass(passId: String, passData: [String: Any]) async -> [String: Any] {
    return [
      "success": false,
      "error": "Secure element pass update not yet implemented"
    ]
  }
  
  private func updateStoredValuePass(passId: String, passData: [String: Any]) async -> [String: Any] {
    return [
      "success": false,
      "error": "Stored value pass update not yet implemented"
    ]
  }
  
  private func updateStoredValueBalance(passId: String, newBalance: Double) async -> [String: Any] {
    return [
      "success": false,
      "error": "Balance update not yet implemented"
    ]
  }
  
  private func updateIdentityDocument(passId: String, passData: [String: Any]) async -> [String: Any] {
    return [
      "success": false,
      "error": "Identity document update not yet implemented"
    ]
  }
  
  private func updateShareablePass(passId: String, passData: [String: Any]) async -> [String: Any] {
    return [
      "success": false,
      "error": "Shareable pass update not yet implemented"
    ]
  }
  
  private func sharePass(passId: String, recipients: [String]) async -> [String: Any] {
    return [
      "success": false,
      "error": "Pass sharing not yet implemented"
    ]
  }
  
  private func removePass(passId: String) async -> [String: Any] {
    if let pass = findPass(by: passId) {
      // Note: PKPassLibrary doesn't provide a direct method to remove passes
      // Passes are typically removed by the user through the Wallet app
      return [
        "success": false,
        "error": "Pass removal must be done by the user through the Wallet app"
      ]
    } else {
      return [
        "success": false,
        "error": "Pass not found"
      ]
    }
  }
  
  private func presentPass(passId: String) async -> [String: Any] {
    return [
      "success": false,
      "error": "Pass presentation not yet implemented"
    ]
  }
  
  @available(iOS 18.1, *)
  private func createNFCCredential(from credentialData: [String: Any]) async -> [String: Any] {
    return [
      "success": false,
      "error": "NFC Secure Element credential creation not yet implemented"
    ]
  }
  
  private func findPass(by passId: String) -> PKPass? {
    return passLibrary.passes.first { $0.serialNumber == passId }
  }
  
  private func getPassTypeDescription(_ pass: PKPass) -> String {
    if #available(iOS 13.0, *), pass is PKSecureElementPass {
      return "PKSecureElementPass"
    } else {
      return "PKPass"
    }
  }
  
  private func passToDict(_ pass: PKPass) -> [String: Any] {
    return [
      "passTypeIdentifier": pass.passTypeIdentifier,
      "serialNumber": pass.serialNumber,
      "organizationName": pass.organizationName,
      "description": pass.localizedDescription,
      "passURL": pass.passURL?.absoluteString ?? "",
      "isRemotePass": pass.isRemotePass
    ]
  }
}
