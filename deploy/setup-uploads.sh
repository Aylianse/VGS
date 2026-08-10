#!/usr/bin/env bash
# Create persistent upload folders on the Hostinger VPS.
# Run once on the server: sudo bash deploy/setup-uploads.sh

set -euo pipefail

UPLOAD_DIR="${UPLOAD_DIR:-/var/www/vitaglow/uploads}"

echo "Creating upload directories at $UPLOAD_DIR ..."
mkdir -p "$UPLOAD_DIR"/{products,blog,general}
chmod -R 755 "$UPLOAD_DIR"

echo "Done. Folder structure:"
find "$UPLOAD_DIR" -type d | sort

echo ""
echo "Upload images via Admin panel, or copy files directly:"
echo "  Products:  $UPLOAD_DIR/products/"
echo "  Blog:      $UPLOAD_DIR/blog/"
echo "  General:   $UPLOAD_DIR/general/"
echo ""
echo "Public URLs: /uploads/products/..., /uploads/blog/..., /uploads/general/..."
