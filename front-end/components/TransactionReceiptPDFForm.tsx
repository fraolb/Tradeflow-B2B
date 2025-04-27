import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    fontSize: 24,
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    width: "30%",
  },
  value: {
    width: "70%",
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
  },
  amountBox: {
    padding: 10,
    backgroundColor: "#e6f4ea",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  hashLink: {
    fontSize: 10,
    color: "#1a73e8",
    textAlign: "right",
  },
  footer: {
    fontSize: 10,
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
});

interface TxData {
  date: string;
  from: string | null;
  address: `0x${string}` | undefined;
  to: string;
  reason: string | null;
  amount: number;
  token: string;
  link: string;
  hash: string;
}

export const TransactionReceipt = ({
  transaction,
}: {
  transaction: TxData;
}) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Tradeflow B2B</Text>
      <Text style={styles.subHeader}>Transaction Receipt</Text>

      <View style={styles.section}>
        <View style={styles.amountBox}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.value}>
            {transaction.amount.toFixed(2)}&nbsp;{transaction.token}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>From:</Text>
          <Text style={styles.value}>{transaction.from}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account:</Text>
          <Text style={styles.value}>{transaction.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>{transaction.to}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{transaction.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reason:</Text>
          <Text style={styles.value}>{transaction.reason}</Text>
        </View>

        <View style={styles.divider} />

        <View>
          <Text style={styles.label}>Transaction Hash:</Text>
          <Link src={transaction.link} style={styles.hashLink}>
            {transaction.hash}
          </Link>
        </View>
      </View>

      <Text style={styles.footer}>
        This is a system-generated receipt. For queries, contact
        support@tradeflow.com
      </Text>
    </Page>
  </Document>
);
