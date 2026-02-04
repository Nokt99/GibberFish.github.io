#include <iostream>
#include <string>
#include <chrono>
#include <random>
#include <vector>
#include <algorithm>
#include <sstream>

static std::string t(const std::string& s) {
    size_t a = s.find_first_not_of(" \t\r\n");
    if (a == std::string::npos) return "";
    size_t b = s.find_last_not_of(" \t\r\n");
    return s.substr(a, b - a + 1);
}

static unsigned long long n() {
    return std::chrono::high_resolution_clock::now().time_since_epoch().count();
}

static std::string r16() {
    unsigned long long v = n();
    std::mt19937_64 g(v ^ (v << 13) ^ (v >> 7));
    std::uniform_int_distribution<unsigned long long> d;
    unsigned long long x = d(g);
    static const char* h = "0123456789abcdef";
    std::string o;
    o.reserve(16);
    for (int i = 0; i < 16; i++) o.push_back(h[(x >> (i * 4)) & 0xF]);
    return o;
}

static std::string r32() {
    unsigned long long v = n();
    std::mt19937_64 g(v ^ (v << 17) ^ (v >> 11));
    std::uniform_int_distribution<unsigned long long> d;
    unsigned long long x1 = d(g);
    unsigned long long x2 = d(g);
    static const char* h = "0123456789abcdef";
    std::string o;
    o.reserve(32);
    for (int i = 0; i < 16; i++) o.push_back(h[(x1 >> (i * 4)) & 0xF]);
    for (int i = 0; i < 16; i++) o.push_back(h[(x2 >> (i * 4)) & 0xF]);
    return o;
}

static std::string mode(int argc, char* argv[]) {
    if (argc < 2) return "idle";
    return t(argv[1]);
}

static std::string mix(const std::string& a, const std::string& b) {
    std::string o;
    o.reserve(a.size() + b.size());
    for (size_t i = 0; i < a.size(); i++) o.push_back(a[i]);
    for (size_t i = 0; i < b.size(); i++) o.push_back(b[i]);
    return o;
}

static void out(const std::string& c, const std::string& tok) {
    std::cout << c << "|" << tok << std::endl;
}

static bool anomaly() {
    unsigned long long v = n();
    return (v & 0x1F) == 0x1F;
}

static bool entropySpike() {
    unsigned long long v = n();
    return ((v >> 8) & 0xFF) == 0xA7;
}

static bool pattern() {
    unsigned long long v = n();
    return ((v ^ (v << 3) ^ (v >> 5)) & 0x3F) == 0x2A;
}

static bool triggerUnwanted() {
    return anomaly() || entropySpike() || pattern();
}

static bool triggerSuspicious() {
    unsigned long long v = n();
    return ((v & 0xFFF) == 0xABC) || ((v >> 12) & 0xF) == 0xE;
}

int main(int argc, char* argv[]) {
    std::string m = mode(argc, argv);
    if (m == "idle") {
        out("NO_ALERT", r16());
        return 0;
    }
    if (m == "unwanted") {
        if (triggerUnwanted()) {
            out("ALERT_UNWANTED_VISITOR", r32());
            return 0;
        }
        out("NO_ALERT", r16());
        return 0;
    }
    if (m == "suspicious") {
        if (triggerSuspicious()) {
            out("ALERT_SUSPICIOUS_ACTIVITY", r32());
            return 0;
        }
        out("NO_ALERT", r16());
        return 0;
    }
    out("NO_ALERT", r16());
    return 0;
}
