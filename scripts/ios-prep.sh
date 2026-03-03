#!/usr/bin/env bash
# ios-prep.sh — One-shot script to get RunTools ready for Xcode / TestFlight.
# Run from the repo root: bash scripts/ios-prep.sh
set -euo pipefail

# ── colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC}  $*"; }
info() { echo -e "${CYAN}▶${NC}  $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
die()  { echo -e "${RED}✗${NC}  $*" >&2; exit 1; }

echo ""
echo -e "${CYAN}RunTools — iOS / TestFlight prep${NC}"
echo "─────────────────────────────────────────"

# ── 1. Prerequisites ──────────────────────────────────────────────────────────
info "Checking prerequisites..."

[[ "$(uname)" == "Darwin" ]] || die "This script must be run on macOS."

command -v node  &>/dev/null || die "Node.js not found. Install from https://nodejs.org"
command -v npm   &>/dev/null || die "npm not found."
command -v xcode-select &>/dev/null && xcode-select -p &>/dev/null \
  || die "Xcode Command Line Tools not found. Run: xcode-select --install"

# Xcode.app (full, not just CLI tools) is required for cap add ios
if ! /usr/bin/xcodebuild -version &>/dev/null; then
  die "Xcode.app not found. Install from the Mac App Store, then run: sudo xcode-select -s /Applications/Xcode.app"
fi

if ! command -v pod &>/dev/null; then
  warn "CocoaPods not found — installing now (requires sudo)..."
  sudo gem install cocoapods
fi

ok "All prerequisites satisfied."
echo ""

# ── 2. npm install ────────────────────────────────────────────────────────────
info "Installing npm dependencies (picks up @capacitor/ios)..."
npm install
ok "npm install complete."
echo ""

# ── 3. Build web assets + cap sync ────────────────────────────────────────────
info "Building web assets and syncing Capacitor (npm run build:mobile)..."
npm run build:mobile
ok "Web build + cap sync complete."
echo ""

# ── 4. Add iOS platform (idempotent) ─────────────────────────────────────────
if [[ -d "ios" ]]; then
  ok "iOS platform already exists — skipping cap add ios."
else
  info "Adding iOS platform (npx cap add ios)..."
  npx cap add ios
  ok "iOS platform added."
fi
echo ""

# ── 5. pod install ────────────────────────────────────────────────────────────
info "Installing CocoaPods dependencies..."
pushd ios/App > /dev/null
pod install
popd > /dev/null
ok "pod install complete."
echo ""

# ── 6. Done ───────────────────────────────────────────────────────────────────
echo -e "${GREEN}All done!${NC} Xcode project is ready."
echo ""
echo "Next steps:"
echo "  1. Run:  npm run ios:open          # opens Xcode"
echo "  2. In Xcode → Signing & Capabilities → select your Apple Developer Team"
echo "  3. Add your app icon:  Assets.xcassets → AppIcon (1024×1024 PNG)"
echo "  4. Set minimum iOS version in project settings (recommend: iOS 16.0)"
echo "  5. Test on a simulator or device (▶ button)"
echo "  6. For TestFlight: Product → Archive → Distribute App → TestFlight"
echo ""
echo "  App ID:   com.runtools.app"
echo "  App Name: RunTools"
echo ""
