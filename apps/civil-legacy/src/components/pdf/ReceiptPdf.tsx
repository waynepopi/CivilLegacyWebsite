import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import type { ReceiptData } from '@/lib/receiptUtils';
import {
  formatUSD,
  calculateLineTotal,
  calculateGrandTotal,
} from '@/lib/receiptUtils';

// ─── Colour Tokens ──────────────────────────────────────────────────────────
const BLUE = '#00529B';
const DARK_NAVY = '#1a1a2e';
const LIGHT_GREY_BG = '#f0f0f0';
const BORDER_GREY = '#cccccc';
const GREEN = '#1b8a2a';
const WHITE = '#ffffff';

// ─── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    color: DARK_NAVY,
    fontSize: 9,
  },

  // ── Header ──────────────────────────────────────────────────────────────
  headerWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },
  logo: {
    width: 90,
    height: 90,
    objectFit: 'contain',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 9,
    color: '#555555',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: BLUE,
    marginBottom: 5,
  },
  contactLine: {
    fontSize: 7,
    color: '#444444',
    textAlign: 'center',
    marginBottom: 14,
  },

  // ── Title Bar ───────────────────────────────────────────────────────────
  titleBar: {
    backgroundColor: BLUE,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    color: WHITE,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
  },

  // ── Receipt Metadata ────────────────────────────────────────────────────
  metaBlock: {
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  metaLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    width: 120,
  },
  metaValue: {
    fontSize: 9,
  },

  // ── Section Header (blue ribbon) ────────────────────────────────────────
  sectionHeader: {
    backgroundColor: BLUE,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  sectionHeaderText: {
    color: WHITE,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },

  // ── Client details ─────────────────────────────────────────────────────
  detailRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  detailLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    width: 120,
  },
  detailValue: {
    fontSize: 9,
  },

  // ── Table ───────────────────────────────────────────────────────────────
  table: {
    marginTop: 2,
    marginBottom: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: LIGHT_GREY_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GREY,
    borderTopWidth: 1,
    borderTopColor: BORDER_GREY,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  // Column widths proportional to reference
  colDesc: {
    width: '50%',
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  colQty: {
    width: '12%',
    paddingVertical: 7,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  colUnit: {
    width: '19%',
    paddingVertical: 7,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  colTotal: {
    width: '19%',
    paddingVertical: 7,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
  },
  tableCellText: {
    fontSize: 9,
    color: DARK_NAVY,
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: DARK_NAVY,
  },

  // Total row
  totalRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GREY,
  },
  totalLabelCell: {
    width: '81%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  totalLabelText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: DARK_NAVY,
  },
  totalValueCell: {
    width: '19%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalValueText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },

  // ── Transaction details ─────────────────────────────────────────────────
  transactionBlock: {
    marginBottom: 14,
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: BORDER_GREY,
    marginTop: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#444444',
    fontStyle: 'italic',
    marginBottom: 4,
    lineHeight: 1.5,
  },
  footerAuthorized: {
    marginTop: 12,
  },
  authorizedLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: DARK_NAVY,
    marginBottom: 2,
  },
  signatureLine: {
    width: 140,
    height: 1,
    backgroundColor: DARK_NAVY,
    marginBottom: 8,
    marginTop: 12,
  },
  authorizedDept: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: DARK_NAVY,
    marginBottom: 1,
  },
  authorizedSystem: {
    fontSize: 7,
    color: '#666666',
    fontStyle: 'italic',
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  qrBlock: {
    alignItems: 'center',
  },
  qrImage: {
    width: 70,
    height: 70,
  },
  qrLabel: {
    fontSize: 7,
    color: BLUE,
    fontStyle: 'italic',
    marginTop: 2,
  },

  // ── Status badge ────────────────────────────────────────────────────────
  statusPaid: {
    color: GREEN,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
});

// ─── Component ──────────────────────────────────────────────────────────────

interface ReceiptPdfProps {
  data: ReceiptData;
}

const ReceiptPdf: React.FC<ReceiptPdfProps> = ({ data }) => {
  const grandTotal = calculateGrandTotal(data.services);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ════════════════════════════════════════════════════════════════════
            1. COMPANY HEADER
            ════════════════════════════════════════════════════════════════════ */}
        <View style={s.headerWrap}>
          {/* Logo — embedded from public directory */}
          <Image style={s.logo} src="/logo-full.png" />

          <Text style={s.tagline}>
            Engineering | Construction | Training &amp; Capacity Building
          </Text>
        </View>

        <View style={s.headerDivider} />

        <Text style={s.contactLine}>
          Head Office: Chipinge, Zimbabwe | Phone: +263 71 440 6037 | Email:
          info@civillegacy.co.zw | Website: www.civillegacy.co.zw
        </Text>

        {/* ════════════════════════════════════════════════════════════════════
            2. TITLE BAR
            ════════════════════════════════════════════════════════════════════ */}
        <View style={s.titleBar}>
          <Text style={s.titleText}>OFFICIAL PAYMENT RECEIPT</Text>
        </View>

        {/* ════════════════════════════════════════════════════════════════════
            3. RECEIPT METADATA
            ════════════════════════════════════════════════════════════════════ */}
        <View style={s.metaBlock}>
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>Receipt No.:</Text>
            <Text style={s.metaValue}>{data.receiptNo}</Text>
          </View>
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>Date Issued:</Text>
            <Text style={s.metaValue}>{data.dateIssued}</Text>
          </View>
          <View style={s.metaRow}>
            <Text style={s.metaLabel}>Payment Method:</Text>
            <Text style={s.metaValue}>{data.paymentMethod}</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════════
            4. CLIENT DETAILS
            ════════════════════════════════════════════════════════════════════ */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>CLIENT DETAILS</Text>
        </View>

        <View style={{ marginBottom: 10 }}>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Client Name:</Text>
            <Text style={s.detailValue}>{data.client.name}</Text>
          </View>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Email Address:</Text>
            <Text style={s.detailValue}>{data.client.email}</Text>
          </View>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Phone Number:</Text>
            <Text style={s.detailValue}>{data.client.phone}</Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════════
            5. PAYMENT DETAILS TABLE
            ════════════════════════════════════════════════════════════════════ */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>PAYMENT DETAILS</Text>
        </View>

        <View style={s.table}>
          {/* Header Row */}
          <View style={s.tableHeaderRow}>
            <View style={s.colDesc}>
              <Text style={s.tableHeaderText}>Description of Service</Text>
            </View>
            <View style={s.colQty}>
              <Text style={s.tableHeaderText}>Qty</Text>
            </View>
            <View style={s.colUnit}>
              <Text style={s.tableHeaderText}>Unit Price (USD)</Text>
            </View>
            <View style={s.colTotal}>
              <Text style={s.tableHeaderText}>Total (USD)</Text>
            </View>
          </View>

          {/* Data Rows — dynamic, supports 1 … N services */}
          {data.services.map((svc, idx) => (
            <View style={s.tableRow} key={idx}>
              <View style={s.colDesc}>
                <Text style={s.tableCellText}>{svc.description}</Text>
              </View>
              <View style={s.colQty}>
                <Text style={s.tableCellText}>{svc.qty}</Text>
              </View>
              <View style={s.colUnit}>
                <Text style={s.tableCellText}>
                  {formatUSD(svc.unitPrice)}
                </Text>
              </View>
              <View style={s.colTotal}>
                <Text style={s.tableCellBold}>
                  {formatUSD(calculateLineTotal(svc.qty, svc.unitPrice))}
                </Text>
              </View>
            </View>
          ))}

          {/* TOTAL PAID Row */}
          <View style={s.totalRow}>
            <View style={s.totalLabelCell}>
              <Text style={s.totalLabelText}>TOTAL PAID</Text>
            </View>
            <View style={s.totalValueCell}>
              <Text style={s.totalValueText}>{formatUSD(grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════════
            6. TRANSACTION DETAILS
            ════════════════════════════════════════════════════════════════════ */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>TRANSACTION DETAILS</Text>
        </View>

        <View style={s.transactionBlock}>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Transaction ID:</Text>
            <Text style={s.detailValue}>{data.transaction.id}</Text>
          </View>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Payment Gateway:</Text>
            <Text style={s.detailValue}>{data.transaction.gateway}</Text>
          </View>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Currency:</Text>
            <Text style={s.detailValue}>{data.transaction.currency}</Text>
          </View>
          <View style={s.detailRow}>
            <Text style={s.detailLabel}>Payment Status:</Text>
            <Text
              style={
                data.transaction.status === 'PAID'
                  ? s.statusPaid
                  : s.detailValue
              }
            >
              {data.transaction.status}
            </Text>
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════════
            7. FOOTER
            ════════════════════════════════════════════════════════════════════ */}
        <View style={s.footerDivider} />

        <Text style={s.footerText}>
          This receipt confirms that full payment has been received by Civil
          Legacy Consultancy for the services listed above.
        </Text>
        <Text style={s.footerText}>
          For any enquiries, please contact us at info@civillegacy.co.zw or call
          +263 71 440 6037.
        </Text>

        <View style={s.footerBottom}>
          {/* Left — authorization */}
          <View style={s.footerAuthorized}>
            <Text style={s.authorizedLabel}>Authorized by</Text>
            <View style={s.signatureLine} />
            <Text style={s.authorizedDept}>
              Civil Legacy Consultancy Finance Department
            </Text>
            <Text style={s.authorizedSystem}>(Automated System Receipt)</Text>
          </View>

          {/* Right — QR code (only if image provided) */}
          {data.qrCodeImage ? (
            <View style={s.qrBlock}>
              <Image style={s.qrImage} src={data.qrCodeImage} />
              <Text style={s.qrLabel}>Scan for Verification</Text>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPdf;
