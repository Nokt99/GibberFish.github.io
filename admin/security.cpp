#include <iostream>
#include <string>
#include <algorithm>

/**
 * Gibberfish Security Module
 * Targeted Button: collection-box
 * Authorized Admin: peppapig1235@gmail.com
 */

// Global constant for the admin email
const std::string ADMIN_EMAIL = "zakariyah6204@mytusd.org";

// Helper function to normalize email strings (handles Case Sensitivity)
std::string normalizeEmail(std::string email) {
    std::transform(email.begin(), email.end(), email.begin(), ::tolower);
    return email;
}

// 1. UI Check: Determines if the button should even be drawn/visible
bool shouldShowCollectionBox(std::string currentUserEmail) {
    return normalizeEmail(currentUserEmail) == ADMIN_EMAIL;
}

// 2. Logic Check: The actual security gate for the button's function
void onCollectionBoxClick(std::string currentUserEmail) {
    // CRITICAL: Even if they find a way to click it, we check again here
    if (normalizeEmail(currentUserEmail) != ADMIN_EMAIL) {
        std::cerr << "[SECURITY ALERT] Unauthorized access attempt to collection-box blocked." << std::endl;
        return; // Stop execution immediately
    }

    // Place the actual code for the collection box here
    std::cout << "[ADMIN] Access Granted. Opening Collection Box..." << std::endl;
}

int main() {
    // This variable would normally come from your login system
    std::string userSessionEmail = "peppapig1235@gmail.com"; 

    // Visual layer: Only show if authorized
    if (shouldShowCollectionBox(userSessionEmail)) {
        // UI Framework: collectionBoxButton.show();
        std::cout << "Button 'collection-box' is now visible." << std::endl;
        
        // Action layer: Execute function
        onCollectionBoxClick(userSessionEmail);
    } else {
        std::cout << "Button 'collection-box' is hidden for this user." << std::endl;
    }

    return 0;
}
