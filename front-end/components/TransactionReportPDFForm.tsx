import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { ReportTxData } from "@/types/reportTransaction";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    fontSize: 20,
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  titleWrap: {
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 12,
    textAlign: "left",
    color: "#666",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    paddingVertical: 2,
  },
  tableCol: {
    flex: 1,
    paddingHorizontal: 2,
  },
  hashLink: {
    fontSize: 8,
    color: "#1a73e8",
  },
  footer: {
    fontSize: 8,
    textAlign: "center",
    color: "#999",
    marginTop: 30,
  },
});

export const TransactionReport = ({
  transactions,
  name,
  address,
  chainId,
}: {
  transactions: ReportTxData[];
  name: string | null;
  address: `0x${string}` | undefined;
  chainId: number;
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Tradeflow B2B</Text>
      <Text style={styles.subHeader}>Transaction Report</Text>

      <View style={styles.titleWrap}>
        <Text style={styles.title}>Bussiness Name : {name}</Text>
        <Text style={styles.title}>Address : {address}</Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCol, { flex: 1 }]}>Date</Text>
        <Text style={[styles.tableCol, { flex: 2 }]}>To/From</Text>
        <Text style={[styles.tableCol, { flex: 1 }]}>Type</Text>
        <Text style={[styles.tableCol, { flex: 3 }]}>Reason</Text>
        <Text style={[styles.tableCol, { flex: 1 }]}>Amount</Text>
        <Text style={[styles.tableCol, { flex: 2 }]}>Link</Text>
      </View>

      {/* Table Rows */}
      {transactions.map((tx, index) => (
        <View style={styles.tableRow} key={index}>
          <Text style={[styles.tableCol, { flex: 1 }]}>
            {" "}
            {new Date(tx.timestamp * 1000).toLocaleDateString()}
          </Text>
          <View style={[styles.tableCol, { flex: 2 }]}>
            <Link
              src={
                chainId == 42220
                  ? `https://celoscan.io/address/${tx.counterparty}`
                  : `https://celo-alfajores.blockscout.com/address/${tx.counterparty}`
              }
              style={styles.hashLink}
            >
              {`${tx.counterparty.slice(0, 6)}...${tx.counterparty.slice(-4)}`}
            </Link>
          </View>

          <Text style={[styles.tableCol, { flex: 1 }]}>
            {tx.txType == 0 ? "Sent" : "Recieve"}
          </Text>
          <Text style={[styles.tableCol, { flex: 3 }]}>{tx.reason}</Text>
          <Text style={[styles.tableCol, { flex: 1 }]}>
            ${(tx.amount / 1e18).toFixed(2)}
          </Text>
          <View style={[styles.tableCol, { flex: 2 }]}>
            <Link
              src={
                chainId == 42220
                  ? `https://celoscan.io/tx/${tx.hash}`
                  : `https://celo-alfajores.blockscout.com/tx/${tx.hash}`
              }
              style={styles.hashLink}
            >
              {tx.hash ? `${tx.hash.slice(0, 6)}...${tx.hash.slice(-4)}` : ""}
            </Link>
          </View>
        </View>
      ))}

      <Text style={styles.footer}>
        This is a system-generated report. For queries, contact
        support@tradeflow.com
      </Text>
    </Page>
  </Document>
);
