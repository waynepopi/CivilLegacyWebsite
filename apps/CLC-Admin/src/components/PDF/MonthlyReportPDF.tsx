import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register a nice font if possible, or use standard ones
// Standard fonts: Helvetica, Courier, Times-Roman

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1pt solid #0077B6',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  meta: {
    textAlign: 'right',
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f5',
    padding: 5,
    marginBottom: 10,
    color: '#18181b',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  card: {
    width: '30%',
    padding: 10,
    border: '1pt solid #e4e4e7',
    borderRadius: 4,
  },
  cardLabel: {
    fontSize: 8,
    color: '#71717a',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f4f4f5',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableCell: {
    fontSize: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#a1a1aa',
    borderTop: '0.5pt solid #e4e4e7',
    paddingTop: 10,
  },
});

interface Props {
  data: any;
  period: string;
}

const MonthlyReportPDF = ({ data, period }: Props) => {
  const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Civil Legacy Consultancy</Text>
            <Text style={{ fontSize: 14, marginTop: 2 }}>Monthly Sales Report</Text>
          </View>
          <View style={styles.meta}>
            <Text style={{ fontWeight: 'bold' }}>Period: {period}</Text>
            <Text>Generated on: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total Revenue</Text>
              <Text style={styles.cardValue}>{formatCurrency(data.totalRevenue)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Paid Orders</Text>
              <Text style={styles.cardValue}>{data.paidOrders}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Avg Order Value</Text>
              <Text style={styles.cardValue}>{formatCurrency(data.avgOrderValue)}</Text>
            </View>
          </View>
          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Pending Orders</Text>
              <Text style={styles.cardValue}>{data.pendingOrders}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Failed Orders</Text>
              <Text style={styles.cardValue}>{data.failedOrders}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total Transactions</Text>
              <Text style={styles.cardValue}>{data.orderCount}</Text>
            </View>
          </View>
        </View>

        {/* Top Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Services</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '50%' }]}>
                <Text style={styles.tableCellHeader}>Service Description</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Units Sold</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '30%' }]}>
                <Text style={styles.tableCellHeader}>Revenue</Text>
              </View>
            </View>
            {data.topServices.map((svc: any, i: number) => (
              <View style={styles.tableRow} key={i}>
                <View style={[styles.tableCol, { width: '50%' }]}>
                  <Text style={styles.tableCell}>{svc.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{svc.count}</Text>
                </View>
                <View style={[styles.tableCol, { width: '30%' }]}>
                  <Text style={styles.tableCell}>{formatCurrency(svc.revenue)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders Detail</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, { width: '25%' }]}>
                <Text style={styles.tableCellHeader}>Date</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '35%' }]}>
                <Text style={styles.tableCellHeader}>Customer</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Status</Text>
              </View>
              <View style={[styles.tableColHeader, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Amount</Text>
              </View>
            </View>
            {data.recentOrders.map((order: any, i: number) => (
              <View style={styles.tableRow} key={i}>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text style={styles.tableCell}>{new Date(order.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.tableCol, { width: '35%' }]}>
                  <Text style={styles.tableCell}>{order.customer_name}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{order.payments?.[0]?.status || 'PENDING'}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{formatCurrency(order.total_amount)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Confidentially generated for Civil Legacy Consultancy Administration.
          All values derived from production transaction logs.
        </Text>
      </Page>
    </Document>
  );
};

export default MonthlyReportPDF;
