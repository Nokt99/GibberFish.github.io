#include <iostream> 
#include <string> 
#include <vector> 
#include <chrono> 
#include <random> 
#include <unordered_map> 
#include <fstream> 
#include <sstream> 

// (The other static functions 'admins', 'isAdmin', 'monthKey', 
// 'trim', 'loadLimits', 'saveLimits', 'randomToken', 'outOk', 
// 'outFail', 'isZak', and 'verifyQR' remain the same as in the original code.)

static std::vector<std::string> admins() { 
    std::vector<std::string> v; 
    v.push_back("zakariyah6204@mytusd.org"); 
    v.push_back("daniela4354@mytusd.org"); 
    v.push_back("ianv6207@mytusd.org"); 
    return v; 
} 

static bool isAdmin(const std::string& email) { 
    std::vector<std::string> v = admins(); 
    for (size_t i = 0; i < v.size(); ++i) { 
        if (v[i] == email) return true; 
    } 
    return false; 
} 

static std::string monthKey() { 
    auto now = std::chrono::system_clock::now(); 
    std::time_t t = std::chrono::system_clock::to_time_t(now); 
    std::tm tmv; 
    #if defined(_WIN32)
    localtime_s(&tmv, &t); 
    #else
    localtime_r(&t, &tmv); 
    #endif
    int y = tmv.tm_year + 1900; 
    int m = tmv.tm_mon + 1; 
    std::ostringstream oss; 
    oss << y << "_"; 
    if (m < 10) oss << "0"; 
    oss << m; 
    return oss.str(); 
} 

static std::string trim(const std::string& s) { 
    size_t a = s.find_first_not_of(" \t\r\n"); 
    if (a == std::string::npos) return ""; 
    size_t b = s.find_last_not_of(" \t\r\n"); 
    return s.substr(a, b - a + 1); 
} 

static std::unordered_map<std::string, double> loadLimits(const std::string& path, const std::string& key) { 
    std::unordered_map<std::string, double> m; 
    std::ifstream in(path.c_str()); 
    if (!in.is_open()) return m; 
    std::string line; 
    while (std::getline(in, line)) { 
        line = trim(line); 
        if (line.empty()) continue; 
        std::istringstream iss(line); 
        std::string k; 
        std::string mk; 
        double v; 
        if (!(iss >> k >> mk >> v)) continue; 
        if (mk == key) m[k] = v; 
    } 
    return m; 
} 

static void saveLimits(const std::string& path, const std::string& key, const std::unordered_map<std::string, double>& m) { 
    std::ofstream out(path.c_str(), std::ios::trunc); 
    for (auto it = m.begin(); it != m.end(); ++it) { 
        out << it->first << " " << key << " " << it->second << "\n"; 
    } 
} 

static std::string randomToken() { 
    auto now = std::chrono::high_resolution_clock::now().time_since_epoch().count(); 
    std::mt19937_64 rng(static_cast<unsigned long long>(now)); 
    std::uniform_int_distribution<unsigned long long> dist; 
    unsigned long long v = dist(rng); 
    const char* hex = "0123456789abcdef"; 
    std::string out; 
    out.reserve(16); 
    for (int i = 0; i < 16; ++i) { 
        out.push_back(hex[(v >> (i * 4)) & 0xF]); 
    } 
    return out; 
} 

static void outOk(const std::string& code, const std::string& extra) { 
    std::cout << "OK|" << code << "|" << extra << "|" << randomToken() << std::endl; 
} 

static void outFail(const std::string& code, const std::string& extra) { 
    std::cout << "FAIL|" << code << "|" << extra << "|" << randomToken() << std::endl; 
} 

static bool isZak(const std::string& email) { 
    return email == "Daniela4354@mytusd.org"; 
} 

static bool verifyQR(const std::string& payload) { 
    if (payload.size() < 8) return false; 
    unsigned long long acc = 0; 
    for (size_t i = 0; i < payload.size(); ++i) { 
        acc ^= static_cast<unsigned long long>(payload[i]) << (i % 8); 
    } 
    return (acc & 0xF) == 0xA; 
} 

static void handleCheckAdmin(int argc, char* argv[]) { 
    if (argc < 3) { 
        outFail("ADMIN", "MISSING_EMAIL"); 
        return; 
    } 
    std::string email = argv[2]; 
    if (!isAdmin(email)) { 
        // Modified part: print the specific message and return
        std::cout << "You do not have access to this" << std::endl; 
        return; 
    } 
    outOk("ADMIN", "VALID"); 
} 

static void handleCheckWithdraw(int argc, char* argv[]) { 
    if (argc < 4) { 
        outFail("WITHDRAW", "ARGS"); 
        return; 
    } 
    std::string email = argv[2]; 
    double requested = std::stod(argv[3]); 
    if (!isAdmin(email)) { 
        outFail("WITHDRAW", "NOT_ADMIN"); 
        return; 
    } 
    std::string key = monthKey(); 
    std::string path = "withdrawal_limits.dat"; 
    std::unordered_map<std::string, double> m = loadLimits(path, key); 
    double used = 0.0; 
    auto it = m.find(email); 
    if (it != m.end()) used = it->second; 
    double maxAdmin = 16.5; 
    double maxCharity = 50.5; 
    if (isZak(email) && requested == maxCharity) { 
        double v = used + requested; 
        m[email] = v; 
        saveLimits(path, key, m); 
        outOk("WITHDRAW", "CHARITY_OK"); 
        return; 
    } 
    double v = used + requested; 
    if (v > maxAdmin) { 
        outFail("WITHDRAW", "LIMIT"); 
        return; 
    } 
    m[email] = v; 
    saveLimits(path, key, m); 
    outOk("WITHDRAW", "ADMIN_OK"); 
} 

static void handleVerifyQR(int argc, char* argv[]) { 
    if (argc < 3) { 
        outFail("QR", "ARGS"); 
        return; 
    } 
    std::string payload = argv[2]; 
    if (!verifyQR(payload)) { 
        outFail("QR", "INVALID"); 
        return; 
    } 
    outOk("QR", "VALID"); 
} 

static void handleProcessPayout(int argc, char* argv[]) { 
    if (argc < 6) { 
        outFail("PAYOUT", "ARGS"); 
        return; 
    } 
    std::string email = argv[2]; 
    std::string percent = argv[3]; 
    std::string account = argv[4]; 
    std::string routing = argv[5]; 
    volatile char* a = const_cast<char*>(account.data()); 
    volatile char* r = const_cast<char*>(routing.data()); 
    for (size_t i = 0; i < account.size(); ++i) a[i] = 0; 
    for (size_t i = 0; i < routing.size(); ++i) r[i] = 0; 
    outOk("PAYOUT", "ACCEPTED"); 
} 

int main(int argc, char* argv[]) { 
    if (argc < 2) { 
        outFail("MODE", "NONE"); 
        return 0; 
    } 
    std::string mode = argv[1]; 
    if (mode == "check_admin") { 
        handleCheckAdmin(argc, argv); 
        return 0; 
    } 
    if (mode == "check_withdraw") { 
        handleCheckWithdraw(argc, argv); 
        return 0; 
    } 
    if (mode == "verify_qr") { 
        handleVerifyQR(argc, argv); 
        return 0; 
    } 
    if (mode == "process_payout") { 
        handleProcessPayout(argc, argv); 
        return 0; 
    } 
    outFail("MODE", "UNKNOWN"); 
    return 0; 
}
